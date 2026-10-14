import React, { useState } from 'react';
import {
  Layers,
  ArrowRight,
  Sprout,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Save,
  Check,
} from 'lucide-react';
import { UserProfile, CropRotationPlan } from '../../types';
import { farmStore } from '../../services/store';

interface CropRotationPlannerProps {
  currentUser: UserProfile;
}

export const CropRotationPlanner: React.FC<CropRotationPlannerProps> = ({ currentUser }) => {
  const [plotName, setPlotName] = useState('East 4-Acre Block');
  const [currentCrop, setCurrentCrop] = useState('Cotton (Bt / Hybrid)');
  const [nextCrop, setNextCrop] = useState('Red Gram / Chickpea (Legume)');
  const [season, setSeason] = useState<CropRotationPlan['rotationSeason']>('Rabi');
  const [savedPlans, setSavedPlans] = useState<CropRotationPlan[]>(() =>
    farmStore.getRotationPlans(currentUser.id)
  );
  const [justSaved, setJustSaved] = useState(false);

  // Dynamic agronomic rotation evaluator
  const evaluateRotation = () => {
    let score = 7;
    let nBenefit = 'Adds 30 - 45 kg of biologically fixed atmospheric nitrogen per hectare.';
    let pestBreak = 'Breaks the reproductive lifecycle of Pink Bollworm and cotton root pathogens.';
    let irrigation = 'Legumes tap deeper moisture with lower surface irrigation needs (1-2 protective irrigations sufficient).';
    let legumeRec = 'Pigeon Pea (ICPL-87119) or Bengal Gram (JG-11).';
    const cautions: string[] = [];

    if (currentCrop.includes('Cotton') && nextCrop.includes('Legume')) {
      score = 9.4;
      nBenefit = 'Fixes 45-60 kg N/ha in root nodules; leaves high-nitrogen biomass for subsequent cereals.';
      pestBreak = 'High disruption of Cotton Pink Bollworm (Helicoverpa/Pectinophora) pupation cycle in soil.';
      irrigation = 'Low water footprint. Deep taproot prevents deep percolation losses.';
      cautions.push('Ensure soil is treated with Trichoderma viride to prevent root-knot nematode transition.');
    } else if (currentCrop.includes('Paddy') && nextCrop.includes('Legume')) {
      score = 9.2;
      nBenefit = 'Excellent relay crop. Sunnhemp or Green gram (Moong) harnesses residual moisture after paddy harvest.';
      pestBreak = 'Breaks yellow stem borer cycle effectively.';
      irrigation = 'Relay sown directly into standing paddy 7-10 days before harvest using residual soil moisture.';
      cautions.push('Drain standing water before broadcast sowing to avoid seed rot.');
    } else if (currentCrop === nextCrop) {
      score = 3.5;
      nBenefit = 'Zero biological nitrogen fixation. Depletes same root-zone nutrient horizon.';
      pestBreak = 'Severe risk: Mono-cropping builds pest and pathogen reservoirs in soil year after year.';
      irrigation = 'Heavy cumulative water demand depleting groundwater aquifers.';
      cautions.push('Mono-cropping will degrade soil microbial diversity and increase chemical pesticide dependency.');
    } else {
      score = 7.5;
      nBenefit = 'Moderate organic matter turnover; balance nitrogen application.';
      pestBreak = 'Moderate pest break depending on botanical family divergence.';
      irrigation = 'Standard irrigation intervals according to crop package.';
      cautions.push('Verify local weather forecasts for unseasonal late monsoon showers before sowing.');
    }

    return { score, nBenefit, pestBreak, irrigation, legumeRec, cautions };
  };

  const evaluation = evaluateRotation();

  const handleSavePlan = () => {
    const newPlan: CropRotationPlan = {
      id: `rot_${Date.now()}`,
      farmerId: currentUser.id,
      plotName,
      currentCrop,
      nextCrop,
      rotationSeason: season,
      nitrogenBenefit: evaluation.nBenefit,
      soilHealthScore: evaluation.score,
      pestBreakingEffect: evaluation.pestBreak,
      irrigationFeasibility: evaluation.irrigation,
      legumeOptionRecommended: evaluation.legumeRec,
      cautions: evaluation.cautions,
      createdAt: new Date().toISOString(),
    };

    farmStore.saveRotationPlan(newPlan);
    setSavedPlans([newPlan, ...savedPlans]);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="border-b border-stone-200 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2">
          <Layers className="w-3.5 h-3.5 text-emerald-600" />
          <span>Soil Health & Biological Succession</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          Crop Rotation & Soil Regeneration Planner
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Plan sustainable crop sequences that break pest cycles, enrich soil nitrogen through legumes, and conserve groundwater.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sequence Builder Form (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-5">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-3">
            Sequence Configuration
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Plot / Field Name
              </label>
              <input
                type="text"
                value={plotName}
                onChange={(e) => setPlotName(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Previous / Current Crop
              </label>
              <select
                value={currentCrop}
                onChange={(e) => setCurrentCrop(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-white"
              >
                <option value="Cotton (Bt / Hybrid)">Cotton (Bt / Hybrid)</option>
                <option value="Paddy / Rice (Kharif)">Paddy / Rice (Kharif)</option>
                <option value="Maize (Corn)">Maize (Corn)</option>
                <option value="Chilli (Spices)">Chilli (Commercial Spice)</option>
                <option value="Sugarcane">Sugarcane</option>
              </select>
            </div>

            <div className="flex items-center justify-center py-1">
              <span className="p-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Proposed Subsequent Crop
              </label>
              <select
                value={nextCrop}
                onChange={(e) => setNextCrop(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-white"
              >
                <option value="Red Gram / Chickpea (Legume)">Red Gram / Chickpea (Legume)</option>
                <option value="Green Gram / Black Gram (Moong/Urad)">Green Gram / Black Gram (Moong/Urad)</option>
                <option value="Groundnut (Peanut)">Groundnut (Peanut)</option>
                <option value="Foxtail / Finger Millet (Ragi)">Foxtail / Finger Millet (Ragi)</option>
                <option value="Cotton (Bt / Hybrid)">Cotton (Repeat Monoculture - Caution)</option>
                <option value="Sunflower (Oilseed)">Sunflower (Oilseed)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Target Rotation Season
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Rabi', 'Zaid', 'Kharif'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeason(s)}
                    className={`py-1.5 text-xs font-medium rounded-lg border transition ${
                      season === s
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSavePlan}
              className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <Save className="w-4 h-4" />
              <span>Save Sequence to Farm Dossier</span>
            </button>

            {justSaved && (
              <div className="text-center text-xs text-emerald-700 font-medium flex items-center justify-center gap-1">
                <Check className="w-4 h-4" />
                <span>Rotation sequence saved!</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Agronomic Impact Evaluation (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Agronomic Succession Assessment
                </span>
                <h3 className="text-base font-bold text-stone-900 mt-1">
                  {currentCrop} ➔ {nextCrop}
                </h3>
              </div>

              <div className="text-right">
                <div className="text-2xl font-black text-emerald-700">{evaluation.score} / 10</div>
                <span className="text-[10px] text-stone-500">Soil Health Score</span>
              </div>
            </div>

            {/* Nitrogen & Biological Fixation */}
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>Biological Nitrogen Fixation Impact</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                {evaluation.nBenefit}
              </p>
            </div>

            {/* Pest Cycle Breaking */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Pest & Pathogen Cycle Interruption</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {evaluation.pestBreak}
              </p>
            </div>

            {/* Irrigation & Soil Moisture */}
            <div className="p-4 bg-sky-50 rounded-xl border border-sky-200 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900">
                <Sprout className="w-4 h-4 text-sky-700" />
                <span>Water Balance & Moisture Utilization</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                {evaluation.irrigation}
              </p>
            </div>

            {/* Cautions */}
            {evaluation.cautions.length > 0 && (
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                  <span>Important Agronomic Considerations:</span>
                </span>
                <ul className="space-y-1 pl-4 list-disc text-amber-800 text-[11px]">
                  {evaluation.cautions.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
