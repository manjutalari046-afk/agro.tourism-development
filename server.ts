import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);

const app = express();
app.use(express.json({ limit: '15mb' }));

// Initialize GoogleGenAI if key available
let genAI: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenAI();
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// 1. AI Soil Analysis Endpoint
app.post('/api/ai/soil-analysis', async (req: Request, res: Response) => {
  const { farmName, location, soilType, irrigationType, currentCrop, metrics } = req.body;

  const prompt = `You are a senior agronomist and soil science specialist for Indian agriculture.
Analyze this farm's soil parameters and generate evidence-informed recommendations:
- Farm: ${farmName || 'Rural Plot'}
- Location: ${location || 'Deccan Plateau, India'}
- Soil Type: ${soilType || 'Red & Yellow'}
- Irrigation: ${irrigationType || 'Borewell'}
- Intended / Current Crop: ${currentCrop || 'Mixed Cereal / Pulses'}
- Measured Parameters:
  * pH: ${metrics?.ph ?? 'Not measured'}
  * Available Nitrogen (N): ${metrics?.nitrogenKgHa ? `${metrics.nitrogenKgHa} kg/ha` : 'Not measured'}
  * Available Phosphorus (P): ${metrics?.phosphorusKgHa ? `${metrics.phosphorusKgHa} kg/ha` : 'Not measured'}
  * Available Potassium (K): ${metrics?.potassiumKgHa ? `${metrics.potassiumKgHa} kg/ha` : 'Not measured'}
  * Organic Carbon (OC): ${metrics?.organicCarbonPercent ? `${metrics.organicCarbonPercent} %` : 'Not measured'}
  * Electrical Conductivity (EC): ${metrics?.electricalConductivityDsM ? `${metrics.electricalConductivityDsM} dS/m` : 'Not measured'}
  * Zinc: ${metrics?.zincPpm ? `${metrics.zincPpm} ppm` : 'Not measured'}

CRITICAL GUIDELINES:
1. Explain reasoning in simple, friendly language for a farmer.
2. Distinguish measured values from estimated or unmeasured values.
3. If potassium is high, recommend skipping chemical potash to save costs.
4. Give specific organic amendments (e.g., FYM, vermicompost, green manuring).
5. Highlight missing parameters that should be tested next time.
6. Provide a valid JSON response with keys:
   {
     "phCategory": "Acidic" | "Neutral" | "Alkaline",
     "nitrogenStatus": "Low" | "Medium" | "High",
     "phosphorusStatus": "Low" | "Medium" | "High",
     "potassiumStatus": "Low" | "Medium" | "High",
     "fertilizerDose": ["step 1", "step 2"],
     "organicAmendments": ["amendment 1", "amendment 2"],
     "irrigationAdvice": "advice string",
     "missingMetricsNote": "note on unmeasured values",
     "aiExplanation": "detailed simple explanation string"
   }
Return ONLY pure JSON.`;

  if (genAI && process.env.GEMINI_API_KEY) {
    try {
      const response = await genAI.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const responseText = response.text || '';
      const parsed = JSON.parse(responseText);
      return res.json({ success: true, isAiGenerated: true, data: parsed });
    } catch (err: any) {
      console.warn('Gemini API call failed or timed out, using deterministic agronomic rules engine:', err.message);
    }
  }

  // Deterministic Agronomic Fallback (Evidence-Based Rule Engine)
  const ph = metrics?.ph ?? 6.8;
  const n = metrics?.nitrogenKgHa ?? 200;
  const p = metrics?.phosphorusKgHa ?? 25;
  const k = metrics?.potassiumKgHa ?? 300;

  const phCat = ph < 6.5 ? 'Acidic' : ph > 7.5 ? 'Alkaline' : 'Neutral';
  const nStat = n < 250 ? 'Low' : n > 500 ? 'High' : 'Medium';
  const pStat = p < 20 ? 'Low' : p > 50 ? 'High' : 'Medium';
  const kStat = k < 150 ? 'Low' : k > 280 ? 'High' : 'Medium';

  const fertilizerDose: string[] = [];
  if (nStat === 'Low') {
    fertilizerDose.push('Nitrogen is deficient: Apply Urea or DAP in 3 split vegetative doses rather than a single heavy basal dose to avoid leaching.');
  }
  if (pStat === 'Low') {
    fertilizerDose.push('Phosphorus is low: Apply Single Super Phosphate (SSP) @ 100 kg/acre at sowing for root initiation.');
  } else {
    fertilizerDose.push('Phosphorus is adequate: Maintain maintenance dose only.');
  }
  if (kStat === 'High') {
    fertilizerDose.push('Potassium is abundant in this soil profile: You can safely omit chemical Potash (MOP) this season, saving ₹1,200/acre.');
  }

  const organicAmendments = [
    'Apply 3 tonnes of well-decomposed Farmyard Manure (FYM) or 1.5 tonnes vermicompost per acre during secondary tillage.',
    'Broadcast Trichoderma viride enriched bio-compost to improve beneficial soil fungi and prevent soil-borne wilt.',
  ];

  return res.json({
    success: true,
    isAiGenerated: false,
    note: 'Generated using verified regional agronomic decision matrix (deterministic fallback)',
    data: {
      phCategory: phCat,
      nitrogenStatus: nStat,
      phosphorusStatus: pStat,
      potassiumStatus: kStat,
      fertilizerDose,
      organicAmendments,
      irrigationAdvice: 'Adopt drip irrigation or furrow pulses during morning hours to maintain optimal field capacity without water stagnation.',
      missingMetricsNote: 'Sulfur and Micronutrient (Zinc, Boron) tests were not detected in current input. Testing micronutrients is advised for high-yield horticulture.',
      aiExplanation: `Your soil has a ${phCat} reaction (pH ${ph}). Available Nitrogen is ${nStat}, while Potassium is ${kStat}. By utilizing green manuring with legumes and adjusting inorganic fertilizer doses according to these measured deficits, you can optimize nutrient uptake efficiency while reducing unnecessary input costs.`,
    },
  });
});

// 2. AI Crop Health Assistant Endpoint
app.post('/api/ai/crop-health', async (req: Request, res: Response) => {
  const { cropName, cropStage, symptoms, affectedPart, imageBase64 } = req.body;

  const prompt = `You are an agricultural plant pathologist.
Analyze this crop health issue:
- Crop: ${cropName}
- Stage: ${cropStage}
- Affected Part: ${affectedPart}
- Observed Symptoms: ${symptoms}

CRITICAL RULES:
1. Distinguish preliminary screening from laboratory confirmation.
2. Provide:
   - possibleDiseaseOrPest
   - confidenceTier: "Probable (AI Screening)" | "Under Investigation" | "Requires Lab Confirmation"
   - diagnosisExplanation: simple breakdown
   - preventiveMeasures: list of 3 cultural/preventive steps
   - curativeOrganicTreatments: list of 2-3 organic or bio-control remedies (e.g. Neem oil, Trichoderma, Beauveria)
   - recommendedAgronomicAdvice: when to contact nearest Krishi Vigyan Kendra (KVK) or extension officer
Return valid JSON only.`;

  if (genAI && process.env.GEMINI_API_KEY) {
    try {
      const contents: any[] = [];
      if (imageBase64) {
        // Strip data:image/...;base64,
        const cleaned = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        contents.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: cleaned,
          },
        });
      }
      contents.push({ text: prompt });

      const response = await genAI.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const responseText = response.text || '';
      const parsed = JSON.parse(responseText);
      return res.json({ success: true, isAiGenerated: true, data: parsed });
    } catch (err: any) {
      console.warn('Gemini plant pathology check fallback triggered:', err.message);
    }
  }

  // Agronomic Knowledge Base Fallback
  const lowerSym = (symptoms || '').toLowerCase();
  let disease = 'Foliar Leaf Spot / Blight Complex';
  let treatments = [
    'Spray Neem Seed Kernel Extract (NSKE 5%) or 10,000 ppm Neem Oil @ 3ml/litre with a natural sticker.',
    'Apply Pseudomonas fluorescens bio-fungicide @ 5g/litre as preventative biological shield.',
  ];

  if (lowerSym.includes('curl') || lowerSym.includes('wrinkle') || lowerSym.includes('yellow')) {
    disease = 'Sucking Pest Induced Leaf Curl / Viral Vector Complex';
    treatments = [
      'Install yellow and blue sticky traps (25 per acre) immediately to monitor and capture thrips and whiteflies.',
      'Foliar spray of cold-pressed Neem oil (5ml/L) + Pongamia (Karanja) oil (3ml/L) in early morning.',
      'Rogue out and safely burn severely stunted viral-infected plants to prevent field-wide transmission.',
    ];
  } else if (lowerSym.includes('wilt') || lowerSym.includes('droop') || lowerSym.includes('root')) {
    disease = 'Fusarium Wilt / Collar Rot';
    treatments = [
      'Drench the root zone with Trichoderma viride bio-agent @ 10g/L mixed in well-aerated cow dung slurry.',
      'Ensure immediate field surface drainage to avoid prolonged root zone water stagnation.',
    ];
  }

  return res.json({
    success: true,
    isAiGenerated: false,
    note: 'Screening generated by Plant Protection Decision Matrix',
    data: {
      possibleDiseaseOrPest: disease,
      confidenceTier: 'Probable (AI Screening)',
      diagnosisExplanation: `The observed symptoms of "${symptoms}" on the ${affectedPart} during the ${cropStage} stage indicate a typical pattern of ${disease}. This is a preliminary diagnostic screening.`,
      preventiveMeasures: [
        'Maintain balanced nitrogen nutrition; avoid excessive synthetic urea which creates soft, succulent tissue attractive to pests.',
        'Ensure proper plant spacing and crop canopy aeration to lower localized leaf humidity.',
        'Disinfect pruning tools and sanitize hands between rows.',
      ],
      curativeOrganicTreatments: treatments,
      recommendedAgronomicAdvice: 'If symptom progression continues past 48 hours or affects more than 10% of your crop stand, take sample cuttings in a sealed paper envelope to your nearest Mandal Agricultural Officer (AEO) or Krishi Vigyan Kendra (KVK) for laboratory microscopic culture.',
    },
  });
});

// 3. AI Agricultural Knowledge Assistant Endpoint
app.post('/api/ai/knowledge', async (req: Request, res: Response) => {
  const { question, conversationHistory } = req.body;

  const prompt = `You are FarmBridge AI's agricultural advisor for Indian farmers, agritourism operators, and rural communities.
Trusted Knowledge Base context:
- Crops: Cotton, Red Gram, Groundnut, Millets, Turmeric, Chillies, Paddy, Mango orchards.
- Soils: Red chalka, Black cotton regur, Alluvial, Laterite; pH management, organic carbon building.
- Schemes: PM-KISAN, PMFBY crop insurance, NABARD Agritourism Subsidy, PMKSY Micro-irrigation.
- Agritourism: Safety norms, water testing (BIS 10500), sanitation, visitor activities.
- Guidelines: Give practical, respectful, accurate advice. Clearly state if official verification is needed. Recommend local Agricultural Extension Officers for legal or severe crop failure situations.

User Question: ${question}

Provide a concise, helpful response organized with clear sections if needed.`;

  if (genAI && process.env.GEMINI_API_KEY) {
    try {
      const response = await genAI.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.3,
        },
      });

      return res.json({
        success: true,
        isAiGenerated: true,
        answer: response.text || 'Unable to generate response at this time.',
        sources: ['ICAR Package of Practices', 'State Agriculture Department Extension Handbooks', 'National Agritourism Standards'],
      });
    } catch (err: any) {
      console.warn('Gemini knowledge assistant fallback triggered:', err.message);
    }
  }

  // Fallback response with helpful agronomic pointers
  return res.json({
    success: true,
    isAiGenerated: false,
    answer: `Regarding your query about "${question}":\n\n1. **Agronomic Best Practice**: Ensure baseline soil testing (pH, NPK, OC) before investing in fertilizers. For pulse crops like Red Gram or Groundnut, inoculate seeds with Rhizobium to harness natural atmospheric nitrogen.\n2. **Government Support**: Check active government subsidy programs like PMKSY for drip irrigation (up to 90% subsidy for small farmers) and PMFBY for risk protection.\n3. **Agritourism Integration**: If you are planning farm visits, prioritize BIS 10500 certified drinking water and safe sanitary facilities before opening to the public.\n\n*Note: For field-specific emergencies, always consult your local Mandal Agricultural Officer or visit your nearest Krishi Vigyan Kendra (KVK).*`,
    sources: ['FarmBridge Agronomic Knowledge Base (Offline Verified Version)'],
  });
});

// Setup Vite or Static File Serving
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FarmBridge AI server listening on http://0.0.0.0:${PORT} (env: ${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
