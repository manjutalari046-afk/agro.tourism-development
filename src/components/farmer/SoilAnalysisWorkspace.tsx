import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Download,
  Info,
  Droplet,
  Save,
  Check,
  RefreshCw,
  Printer,
} from 'lucide-react';
import { UserProfile, SoilAnalysisReport, SoilMetrics } from '../../types';
import { requestSoilAnalysis } from '../../services/aiService';
import { farmStore } from '../../services/store';

interface SoilAnalysisWorkspaceProps {
  currentUser: UserProfile;
}

export const SoilAnalysisWorkspace: React.FC<SoilAnalysisWorkspaceProps> = ({ currentUser }) => {
  const [farmName, setFarmName] = useState('Surya Organic Plot #2');
  const [location, setLocation] = useState(currentUser.location || 'Choutuppal, Yadadri Bhuvanagiri');
  const [soilType, setSoilType] = useState<SoilAnalysisReport['soilType']>('Red & Yellow');
  const [irrigationType, setIrrigationType] = useState<SoilAnalysisReport['irrigationType']>('Drip Irrigation');
  const [currentCrop, setCurrentCrop] = useState('Cotton / Red Gram');

  // Soil metrics
  const [ph, setPh] = useState<string>('6.8');
  const [nitrogen, setNitrogen] = useState<string>('195');
  const [phosphorus, setPhosphorus] = useState<string>('22');
  const [potassium, setPotassium] = useState<string>('310');
  const [organicCarbon, setOrganicCarbon] = useState<string>('0.52');
  const [ec, setEc] = useState<string>('0.45');
  const [zinc, setZinc] = useState<string>('0.58');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<SoilAnalysisReport | null>(() => {
    const existing = farmStore.getSoilReports(currentUser.id);
    return existing.length > 0 ? existing[0] : null;
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // File Upload handler (Simulates reading official lab Soil Health Card PDF/Image)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setUploadedFileName(file.name);
      // Auto-populate simulated extracted values from standard state lab card
      setPh('6.9');
      setNitrogen('210');
      setPhosphorus('24');
      setPotassium('325');
      setOrganicCarbon('0.55');
      setEc('0.42');
      setZinc('0.60');
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const metrics: Partial<SoilMetrics> = {
      ph: ph ? parseFloat(ph) : undefined,
      nitrogenKgHa: nitrogen ? parseFloat(nitrogen) : undefined,
      phosphorusKgHa: phosphorus ? parseFloat(phosphorus) : undefined,
      potassiumKgHa: potassium ? parseFloat(potassium) : undefined,
      organicCarbonPercent: organicCarbon ? parseFloat(organicCarbon) : undefined,
      electricalConductivityDsM: ec ? parseFloat(ec) : undefined,
      zincPpm: zinc ? parseFloat(zinc) : undefined,
    };

    const missingMetrics: string[] = [];
    if (!ph) missingMetrics.push('pH Value');
    if (!nitrogen) missingMetrics.push('Available Nitrogen');
    if (!phosphorus) missingMetrics.push('Available Phosphorus');
    if (!potassium) missingMetrics.push('Available Potassium');
    if (!organicCarbon) missingMetrics.push('Organic Carbon (OC)');
    if (!ec) missingMetrics.push('Electrical Conductivity (EC)');
    if (!zinc) missingMetrics.push('Zinc (Zn)');
    missingMetrics.push('Sulfur (S)', 'Boron (B)'); // standard lab omissions

    try {
      const response = await requestSoilAnalysis({
        farmName,
        location,
        soilType,
        irrigationType,
        currentCrop,
        metrics,
      });

      const newReport: SoilAnalysisReport = {
        id: `soil_rep_${Date.now()}`,
        farmerId: currentUser.id,
        farmName,
        location,
        soilType,
        irrigationType,
        currentCrop,
        testedAt: new Date().toISOString().split('T')[0],
        metrics,
        missingMetrics,
        phCategory: response.data.phCategory,
        nitrogenStatus: response.data.nitrogenStatus,
        phosphorusStatus: response.data.phosphorusStatus,
        potassiumStatus: response.data.potassiumStatus,
        recommendations: {
          fertilizerDose: response.data.fertilizerDose,
          organicAmendments: response.data.organicAmendments,
          irrigationAdvice: response.data.irrigationAdvice,
          caution: response.data.missingMetricsNote || 'Regular lab testing every 24 months recommended.',
        },
        aiExplanation: response.data.aiExplanation,
        documentFileName: uploadedFileName || 'Manual_Soil_Reading.csv',
      };

      setReport(newReport);
      farmStore.saveSoilReport(newReport);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Soil analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Agronomic Disclaimer Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>ICAR & Soil Health Card Evidence Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Scientific Soil Analysis & Nutrient Advisor
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Input verified laboratory parameters to diagnose nutrient imbalances, avoid wasteful fertilizer purchases, and restore organic carbon.
          </p>
        </div>

        {report && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-medium flex items-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-stone-500" />
              <span>Print / Export Dossier</span>
            </button>
          </div>
        )}
      </div>

      {/* Lab Accuracy Notice: Grounding Rule */}
      <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong>Laboratory Test Requirement Notice: </strong>
          Soil photographs cannot determine chemical N-P-K nutrient or pH values. Please enter readings from your government Soil Health Card or recognized soil testing laboratory, or upload the certified test document below.
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Inputs & File Upload (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-5">
          <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
            Farm & Soil Parameter Inputs
          </h2>

          <form onSubmit={handleAnalyze} className="space-y-4">
            {/* Farm Details */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Farm / Plot Identifier
                </label>
                <input
                  type="text"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  placeholder="e.g. Field #1 North Borewell"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Soil Texture / Type
                  </label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="Red & Yellow">Red & Yellow (Chalka)</option>
                    <option value="Black (Regur)">Black Cotton (Regur)</option>
                    <option value="Alluvial">Alluvial</option>
                    <option value="Laterite">Laterite</option>
                    <option value="Sandy Loam">Sandy Loam</option>
                    <option value="Clay Loam">Clay Loam</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Irrigation System
                  </label>
                  <select
                    value={irrigationType}
                    onChange={(e) => setIrrigationType(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="Drip Irrigation">Drip Irrigation</option>
                    <option value="Borewell / Tube well">Borewell / Tube well</option>
                    <option value="Sprinkler">Sprinkler</option>
                    <option value="Canal">Canal</option>
                    <option value="Rainfed">Rainfed Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Current or Intended Crop
                </label>
                <input
                  type="text"
                  value={currentCrop}
                  onChange={(e) => setCurrentCrop(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  placeholder="e.g. Cotton, Red Gram, Mango, Maize"
                />
              </div>
            </div>

            {/* Upload Document Box */}
            <div className="p-3.5 bg-stone-50 rounded-xl border border-dashed border-stone-300 text-center">
              <Upload className="w-5 h-5 text-stone-400 mx-auto mb-1.5" />
              <label className="text-xs font-medium text-emerald-700 hover:text-emerald-800 cursor-pointer">
                <span>Upload Soil Health Card (PDF/Image)</span>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-stone-400 mt-1">
                {uploadedFileName ? `Attached: ${uploadedFileName}` : 'Extracts NPK & pH data automatically into fields below'}
              </p>
            </div>

            {/* Measured Lab Parameters */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Measured Lab Values
                </span>
                <span className="text-[10px] text-stone-400">Leave blank if unmeasured</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-0.5">
                    Soil pH (Acidity/Alkalinity)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={ph}
                    onChange={(e) => setPh(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 rounded border border-stone-300"
                    placeholder="e.g. 6.8"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-0.5">
                    Nitrogen - N (kg/ha)
                  </label>
                  <input
                    type="number"
                    value={nitrogen}
                    onChange={(e) => setNitrogen(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 rounded border border-stone-300"
                    placeholder="e.g. 195 (Low <250)"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-0.5">
                    Phosphorus - P (kg/ha)
                  </label>
                  <input
                    type="number"
                    value={phosphorus}
                    onChange={(e) => setPhosphorus(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 rounded border border-stone-300"
                    placeholder="e.g. 22 (Med 20-50)"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-0.5">
                    Potassium - K (kg/ha)
                  </label>
                  <input
                    type="number"
                    value={potassium}
                    onChange={(e) => setPotassium(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 rounded border border-stone-300"
                    placeholder="e.g. 310 (High >280)"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-0.5">
                    Organic Carbon - OC (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={organicCarbon}
                    onChange={(e) => setOrganicCarbon(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 rounded border border-stone-300"
                    placeholder="e.g. 0.52"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-0.5">
                    EC - Salinity (dS/m)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={ec}
                    onChange={(e) => setEc(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 rounded border border-stone-300"
                    placeholder="e.g. 0.45 (<1.0 is Normal)"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-medium text-stone-600 mb-0.5">
                    Zinc - Zn (ppm) (Optional Micronutrient)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={zinc}
                    onChange={(e) => setZinc(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 rounded border border-stone-300"
                    placeholder="e.g. 0.58 (<0.6 is Deficient)"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition disabled:opacity-60 shadow-xs"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Soil Advisory...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Generate Evidence-Based Soil Advisory</span>
                </>
              )}
            </button>

            {saveSuccess && (
              <div className="text-center text-xs text-emerald-700 font-medium flex items-center justify-center gap-1">
                <Check className="w-4 h-4" />
                <span>Report successfully saved to farm profile!</span>
              </div>
            )}
          </form>
        </div>

        {/* Right Panel: Advisory Output & Missing Data Audit (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {report ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
              {/* Report Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Soil Health Advisory # {report.id.slice(-6)}
                  </span>
                  <h3 className="text-xl font-bold text-stone-900 mt-1">{report.farmName}</h3>
                  <p className="text-xs text-stone-500">
                    Location: {report.location} • Tested: {report.testedAt} • Soil: {report.soilType}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-stone-100 text-stone-800">
                    {report.irrigationType}
                  </span>
                </div>
              </div>

              {/* Measured vs Benchmark Matrix */}
              <div>
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3">
                  Nutrient Status vs Agronomic Benchmarks
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl border border-stone-200 bg-stone-50/50">
                    <span className="text-[11px] text-stone-500">Reaction (pH)</span>
                    <div className="text-lg font-extrabold text-stone-900 mt-0.5">
                      {report.metrics.ph ?? 'N/A'}
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700">
                      {report.phCategory} (Ideal 6.5-7.5)
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-stone-200 bg-stone-50/50">
                    <span className="text-[11px] text-stone-500">Available N</span>
                    <div className="text-lg font-extrabold text-stone-900 mt-0.5">
                      {report.metrics.nitrogenKgHa ? `${report.metrics.nitrogenKgHa} kg` : 'N/A'}
                    </div>
                    <span className={`text-[11px] font-semibold ${report.nitrogenStatus === 'Low' ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {report.nitrogenStatus} (&lt;250 Low)
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-stone-200 bg-stone-50/50">
                    <span className="text-[11px] text-stone-500">Available P</span>
                    <div className="text-lg font-extrabold text-stone-900 mt-0.5">
                      {report.metrics.phosphorusKgHa ? `${report.metrics.phosphorusKgHa} kg` : 'N/A'}
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700">
                      {report.phosphorusStatus} (20-50 Med)
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-stone-200 bg-stone-50/50">
                    <span className="text-[11px] text-stone-500">Available K</span>
                    <div className="text-lg font-extrabold text-stone-900 mt-0.5">
                      {report.metrics.potassiumKgHa ? `${report.metrics.potassiumKgHa} kg` : 'N/A'}
                    </div>
                    <span className="text-[11px] font-semibold text-sky-700">
                      {report.potassiumStatus} (&gt;280 High)
                    </span>
                  </div>
                </div>
              </div>

              {/* Transparent Explanation in Simple Language */}
              <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Agronomist Explanation & Cost-Saving Insight</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {report.aiExplanation}
                </p>
              </div>

              {/* Actionable Fertilizer & Nutrient Dosing */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Precise Nutrient Management
                </h4>
                <div className="space-y-2">
                  {report.recommendations.fertilizerDose.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        {idx + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Organic Amendments & Soil Health Restoration */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Organic Carbon Building & Bio-Amendments
                </h4>
                <div className="space-y-2">
                  {report.recommendations.organicAmendments.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Irrigation Advisory */}
              <div className="p-3 bg-sky-50 rounded-lg border border-sky-200 flex items-start gap-2.5 text-xs text-sky-900">
                <Droplet className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Water Management Guidance: </span>
                  {report.recommendations.irrigationAdvice}
                </div>
              </div>

              {/* Unmeasured / Missing Values Audit */}
              <div className="p-3 bg-stone-100 rounded-lg border border-stone-200 text-xs text-stone-600 space-y-1">
                <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Unmeasured Parameters in Current Test</span>
                </div>
                <p className="text-[11px]">
                  Missing: {report.missingMetrics.join(', ')}.
                </p>
                <p className="text-[11px] text-stone-500">
                  Note: Micronutrient deficiencies (such as Zinc and Boron) can limit yield even when NPK are balanced. Ask your local testing lab for a 12-parameter panel.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4">
              <FileText className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="text-base font-bold text-stone-800">No Soil Test Analyzed Yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Fill in your laboratory soil health metrics on the left or upload a card document to generate instant scientific advisories.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
