import React, { useState } from 'react';
import {
  Sprout,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Droplet,
  Clock,
  DollarSign,
  TrendingUp,
  Info,
  ArrowRight,
  ShieldCheck,
  Bookmark,
  Check,
} from 'lucide-react';
import { CropOption, UserProfile } from '../../types';
import { CROPS_CATALOG } from '../../data/initialData';

interface CropSuitabilityEngineProps {
  currentUser: UserProfile;
  onSelectTab: (tab: string) => void;
}

export const CropSuitabilityEngine: React.FC<CropSuitabilityEngineProps> = ({
  currentUser,
  onSelectTab,
}) => {
  // Input parameters
  const [season, setSeason] = useState<'Kharif' | 'Rabi' | 'Zaid'>('Kharif');
  const [soilType, setSoilType] = useState('Red & Yellow');
  const [waterAvailability, setWaterAvailability] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [budgetPerAcre, setBudgetPerAcre] = useState<number>(30000);
  const [farmSizeAcres, setFarmSizeAcres] = useState<number>(4);
  const [preferenceCategory, setPreferenceCategory] = useState<string>('All');
  const [selectedCrop, setSelectedCrop] = useState<CropOption | null>(CROPS_CATALOG[1]); // Red gram default

  // Filtering & Ranking Logic based on verified agronomic rules
  const rankedCrops = CROPS_CATALOG.filter((crop) => {
    if (preferenceCategory !== 'All' && crop.category !== preferenceCategory) {
      return false;
    }
    return true;
  }).map((crop) => {
    let score = crop.suitabilityScore;

    // Water constraint penalty
    if (waterAvailability === 'Low' && crop.waterLevel === 'High') {
      score -= 30;
    } else if (waterAvailability === 'High' && crop.waterLevel === 'Low') {
      score -= 5;
    }

    // Budget constraint penalty
    if (crop.estimatedCostPerAcre > budgetPerAcre) {
      score -= 20;
    }

    // Soil type affinity
    if (soilType === 'Black (Regur)' && (crop.id === 'crop_cotton' || crop.id === 'crop_red_gram')) {
      score += 5;
    }
    if (soilType === 'Red & Yellow' && (crop.id === 'crop_groundnut' || crop.id === 'crop_red_gram' || crop.id === 'crop_millets')) {
      score += 5;
    }

    const clampedScore = Math.max(20, Math.min(98, score));
    const tier = clampedScore >= 85 ? 'Highly Suitable' : clampedScore >= 70 ? 'Moderately Suitable' : 'Marginal';

    return {
      ...crop,
      suitabilityScore: clampedScore,
      suitabilityTier: tier as CropOption['suitabilityTier'],
    };
  }).sort((a, b) => b.suitabilityScore - a.suitabilityScore);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Agronomic Disclaimer Header */}
      <div className="border-b border-stone-200 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2">
          <Sprout className="w-3.5 h-3.5 text-emerald-600" />
          <span>Regional Agro-Climatic Match Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          Crop Suitability & Comparative Evaluation
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Matches regional crops to your soil profile, seasonal water availability, and cultivation budget with transparent agronomic rationale.
        </p>
      </div>

      {/* Honest Disclaimer Banner */}
      <div className="p-3.5 bg-stone-100 rounded-xl border border-stone-200 flex items-start gap-3">
        <Info className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
        <div className="text-xs text-stone-600 leading-relaxed">
          <strong>Transparent Agronomic Guarantee Disclaimer: </strong>
          Recommendations are evidence-informed decision aids based on regional research bulletins. Actual crop yield depends heavily on local monsoon timing, pest outbreaks, and farm management. Yields and revenues are indicative estimates, never guaranteed profits.
        </div>
      </div>

      {/* Main Grid: Filters on Left (4 cols), Results on Right (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-100 pb-3">
            <Filter className="w-4 h-4 text-emerald-700" />
            <span>Farm & Seasonal Parameters</span>
          </h2>

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Target Crop Season
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Kharif', 'Rabi', 'Zaid'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeason(s)}
                    className={`py-2 text-xs font-medium rounded-lg border transition ${
                      season === s
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Soil Type (Profile)
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-white"
              >
                <option value="Red & Yellow">Red & Yellow (Chalka / Loam)</option>
                <option value="Black (Regur)">Deep Black Cotton (Regur)</option>
                <option value="Alluvial">Alluvial Delta Soil</option>
                <option value="Sandy Loam">Sandy Loam</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Assured Water Availability
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Low', 'Medium', 'High'] as const).map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setWaterAvailability(w)}
                    className={`py-2 text-xs font-medium rounded-lg border transition ${
                      waterAvailability === w
                        ? 'bg-sky-700 text-white border-sky-700 shadow-2xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-stone-400 mt-1 block">
                {waterAvailability === 'Low' && 'Rainfed / Deficit water table'}
                {waterAvailability === 'Medium' && 'Borewell / 1-2 critical irrigations'}
                {waterAvailability === 'High' && 'Assured canal / Perennial drip'}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-700">
                  Input Budget per Acre (₹)
                </label>
                <span className="text-xs font-bold text-stone-900">₹{budgetPerAcre.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="8000"
                max="60000"
                step="2000"
                value={budgetPerAcre}
                onChange={(e) => setBudgetPerAcre(parseInt(e.target.value))}
                className="w-full accent-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Crop Category Filter
              </label>
              <select
                value={preferenceCategory}
                onChange={(e) => setPreferenceCategory(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-white"
              >
                <option value="All">All Categories</option>
                <option value="Pulse">Pulses (Legumes)</option>
                <option value="Cash Crop">Commercial / Cash Crops</option>
                <option value="Oilseed">Oilseeds</option>
                <option value="Cereal">Nutri-Cereals / Millets</option>
                <option value="Spices">Spices & Condiments</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Column (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Ranked Crop Matches ({rankedCrops.length} options evaluated)
            </h3>
            <span className="text-xs text-stone-500">
              Evaluated for: {season} • {soilType}
            </span>
          </div>

          {/* Cards List */}
          <div className="space-y-4">
            {rankedCrops.map((crop) => {
              const isSelected = selectedCrop?.id === crop.id;
              const isHighlySuitable = crop.suitabilityTier === 'Highly Suitable';
              const isModerate = crop.suitabilityTier === 'Moderately Suitable';

              return (
                <div
                  key={crop.id}
                  onClick={() => setSelectedCrop(crop)}
                  className={`p-5 rounded-2xl border transition cursor-pointer bg-white ${
                    isSelected
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm'
                      : 'border-stone-200 hover:border-stone-300 shadow-2xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                        {crop.suitabilityScore}%
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-stone-900 text-base">{crop.name}</h4>
                          <span className="text-xs text-stone-500 font-normal">{crop.teluguName}</span>
                          {crop.isLegume && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              N-Fixing Legume
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500 mt-1">
                          <span>Category: <strong className="text-stone-700">{crop.category}</strong></span>
                          <span>•</span>
                          <span>Est. Duration: <strong className="text-stone-700">{crop.cropDurationDays}</strong></span>
                          <span>•</span>
                          <span>Input Cost: <strong className="text-stone-700">₹{crop.estimatedCostPerAcre.toLocaleString()}/acre</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isHighlySuitable
                            ? 'bg-emerald-100 text-emerald-800'
                            : isModerate
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {crop.suitabilityTier}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Details when selected */}
                  {isSelected && (
                    <div className="mt-5 pt-4 border-t border-stone-100 space-y-4 animate-in fade-in duration-200">
                      {/* Suitability Reasons */}
                      <div>
                        <h5 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                          Why This Crop is Suitable:
                        </h5>
                        <ul className="space-y-1 text-xs text-stone-700">
                          {crop.reasons.map((r, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Growing Conditions & Water */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                        <div>
                          <span className="font-semibold text-stone-800 block mb-0.5">Growing Conditions:</span>
                          <span className="text-stone-600">{crop.growingConditions}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-stone-800 block mb-0.5">Water Requirement:</span>
                          <span className="text-stone-600">{crop.waterRequirementMm} (Level: {crop.waterLevel})</span>
                        </div>
                        <div>
                          <span className="font-semibold text-stone-800 block mb-0.5">Expected Yield Range:</span>
                          <span className="text-stone-600">{crop.expectedYieldPerAcre}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-stone-800 block mb-0.5">Market Demand:</span>
                          <span className="text-stone-600">{crop.marketDemand} Regional Demand</span>
                        </div>
                      </div>

                      {/* Risks and Constraints */}
                      <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs">
                        <span className="font-bold text-amber-900 block mb-1">
                          Agronomic Risks & Key Constraints:
                        </span>
                        <ul className="space-y-1 text-amber-800">
                          {crop.risksAndConstraints.map((risk, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                              <span>{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Recommended Next Steps */}
                      <div>
                        <h5 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                          Recommended Next Steps for Farmer:
                        </h5>
                        <ul className="space-y-1 text-xs text-stone-700">
                          {crop.nextSteps.map((step, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                                {i + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => onSelectTab('crop_profit')}
                          className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs flex items-center gap-1.5 transition"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>Calculate Profit for {crop.name}</span>
                        </button>
                        <button
                          onClick={() => onSelectTab('crop_rotation')}
                          className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs transition"
                        >
                          Check Rotation Sequence →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
