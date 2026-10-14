import React from 'react';
import {
  Sprout,
  Compass,
  FileText,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { UserProfile, Language } from '../../types';
import { farmStore } from '../../services/store';

interface FarmerDashboardProps {
  currentUser: UserProfile;
  language: Language;
  onSelectTab: (tab: string) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  currentUser,
  language,
  onSelectTab,
}) => {
  const soilReports = farmStore.getSoilReports(currentUser.id);
  const profitCalcs = farmStore.getProfitCalculations(currentUser.id);
  const farmerStay = farmStore.getFarmerFarmStay(currentUser.id);
  const produceListings = farmStore.getProduceListings().filter((p) => p.farmerId === currentUser.id);
  const produceEnquiries = farmStore.getProduceEnquiries(currentUser.id);
  const rotationPlans = farmStore.getRotationPlans(currentUser.id);
  const latestSoil = soilReports[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Farm Profile Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-stone-900 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-emerald-200 text-xs font-medium">
            <Sprout className="w-3.5 h-3.5" />
            <span>Active Farm: Green Acres & Surya Agro-Haven</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Namaskaram, {currentUser.name}
          </h1>
          <p className="text-sm text-stone-200 max-w-xl">
            Location: <span className="text-emerald-300 font-medium">{currentUser.location}</span> • 12 Acres • Red & Yellow Sandy Loam Soil
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onSelectTab('soil_analysis')}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition"
          >
            <FileText className="w-4 h-4" />
            <span>New Soil Test</span>
          </button>
          <button
            onClick={() => onSelectTab('crop_profit')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm border border-white/20 transition flex items-center gap-2"
          >
            <DollarSign className="w-4 h-4 text-emerald-300" />
            <span>Profit Calculator</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Soil Health Status</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-stone-900">
              {latestSoil ? `pH ${latestSoil.metrics?.ph ?? 6.8} (Neutral)` : 'No Report'}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {latestSoil ? `Available N: ${latestSoil.nitrogenStatus} • K: ${latestSoil.potassiumStatus}` : 'Upload report to diagnose'}
            </p>
          </div>
          <button
            onClick={() => onSelectTab('soil_analysis')}
            className="mt-3 text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
          >
            <span>View Soil Advisory</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Saved Profit Plans</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-stone-900">{profitCalcs.length} Saved</div>
            <p className="text-xs text-stone-500 mt-1">
              {profitCalcs[0] ? `Latest: ${profitCalcs[0].cropName} (₹${profitCalcs[0].estimatedNetReturn.toLocaleString()} net)` : 'No calculation saved'}
            </p>
          </div>
          <button
            onClick={() => onSelectTab('crop_profit')}
            className="mt-3 text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
          >
            <span>Open Calculator</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Agritourism Readiness</span>
            <Compass className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-stone-900">
              {farmerStay ? farmerStay.readinessState.split(' ')[0] : 'Not Opted In'}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {farmerStay ? farmerStay.readinessState : 'Tourism is 100% optional'}
            </p>
          </div>
          <button
            onClick={() => onSelectTab('farmstay_register')}
            className="mt-3 text-xs font-semibold text-sky-700 hover:underline flex items-center gap-1"
          >
            <span>{farmerStay ? 'Manage Farm-Stay' : 'Check Eligibility'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Produce Marketplace</span>
            <ShoppingBag className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-stone-900">{produceListings.length} Active</div>
            <p className="text-xs text-stone-500 mt-1">
              {produceEnquiries.length} Buyer inquiries received
            </p>
          </div>
          <button
            onClick={() => onSelectTab('market_data')}
            className="mt-3 text-xs font-semibold text-amber-700 hover:underline flex items-center gap-1"
          >
            <span>View Listings & Prices</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Grid: Soil Insights & Crop Action Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Actionable Farm Guidance */}
        <div className="lg:col-span-2 space-y-6">
          {/* Latest Soil Advisory Card */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Sprout className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900">Latest Soil Advisory</h3>
                  <p className="text-xs text-stone-500">
                    Report ID: {latestSoil?.id || 'soil_rep_1'} • Tested: {latestSoil?.testedAt || '2026-07-28'}
                  </p>
                </div>
              </div>

              <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                Lab Tested (BIS Spec)
              </span>
            </div>

            {latestSoil && (
              <div className="space-y-4">
                <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-700 leading-relaxed">
                  <strong className="text-stone-900">Agronomic Insight: </strong>
                  {latestSoil.aiExplanation}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                    <span className="text-[11px] text-stone-400 block">pH Value</span>
                    <span className="text-base font-bold text-stone-900">{latestSoil.metrics?.ph}</span>
                    <span className="text-[10px] text-emerald-600 block font-medium">Optimal</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                    <span className="text-[11px] text-stone-400 block">Nitrogen (N)</span>
                    <span className="text-base font-bold text-stone-900">{latestSoil.metrics?.nitrogenKgHa} kg/ha</span>
                    <span className="text-[10px] text-amber-600 block font-medium">Low Deficit</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                    <span className="text-[11px] text-stone-400 block">Phosphorus (P)</span>
                    <span className="text-base font-bold text-stone-900">{latestSoil.metrics?.phosphorusKgHa} kg/ha</span>
                    <span className="text-[10px] text-emerald-600 block font-medium">Medium</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                    <span className="text-[11px] text-stone-400 block">Potassium (K)</span>
                    <span className="text-base font-bold text-stone-900">{latestSoil.metrics?.potassiumKgHa} kg/ha</span>
                    <span className="text-[10px] text-sky-600 block font-medium">Surplus (Skip MOP)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
                    Key Recommendations
                  </h4>
                  <ul className="space-y-1.5 text-xs text-stone-600">
                    {latestSoil.recommendations.fertilizerDose.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Quick Agricultural Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => onSelectTab('crop_suitability')}
              className="p-4 bg-white rounded-xl border border-stone-200 hover:border-emerald-300 hover:shadow-xs text-left transition group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <Sprout className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-stone-900 group-hover:text-emerald-700 transition">
                Crop Match Engine
              </h4>
              <p className="text-xs text-stone-500 mt-1">
                Find ranked crops suited to your soil pH, season & water capacity.
              </p>
            </button>

            <button
              onClick={() => onSelectTab('crop_rotation')}
              className="p-4 bg-white rounded-xl border border-stone-200 hover:border-emerald-300 hover:shadow-xs text-left transition group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <Layers className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-stone-900 group-hover:text-emerald-700 transition">
                Rotation Planner
              </h4>
              <p className="text-xs text-stone-500 mt-1">
                Sequence nitrogen-fixing legumes to replenish soil health.
              </p>
            </button>

            <button
              onClick={() => onSelectTab('crop_health')}
              className="p-4 bg-white rounded-xl border border-stone-200 hover:border-emerald-300 hover:shadow-xs text-left transition group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-stone-900 group-hover:text-emerald-700 transition">
                Crop Health Doctor
              </h4>
              <p className="text-xs text-stone-500 mt-1">
                Screen plant leaf issues & receive verified biological remedies.
              </p>
            </button>
          </div>
        </div>

        {/* Right Col: Notifications, Mandi Ticker & Scheme Alerts */}
        <div className="space-y-6">
          {/* Market Price Mini Ticker */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-stone-900">Regional APMC Mandi Rates</h3>
              <span className="text-[11px] text-stone-400">Tandur & Warangal</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-100">
                <div>
                  <span className="font-semibold text-stone-800">Red Gram (Tur)</span>
                  <span className="block text-[10px] text-stone-400">Tandur APMC</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-stone-900">₹7,920 / Qtl</span>
                  <span className="block text-[10px] text-emerald-600 font-medium">+1.8% today</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-100">
                <div>
                  <span className="font-semibold text-stone-800">Cotton (Kapus)</span>
                  <span className="block text-[10px] text-stone-400">Warangal Mandi</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-stone-900">₹7,320 / Qtl</span>
                  <span className="block text-[10px] text-rose-500 font-medium">-0.6% today</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-stone-800">Groundnut Pod</span>
                  <span className="block text-[10px] text-stone-400">Gadwal Mandi</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-stone-900">₹6,680 / Qtl</span>
                  <span className="block text-[10px] text-emerald-600 font-medium">+0.9% today</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectTab('market_data')}
              className="mt-4 w-full py-2 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold text-center transition"
            >
              Full Market Dashboard →
            </button>
          </div>

          {/* Applicable Government Scheme Banner */}
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-amber-700" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded">
                  Eligible Scheme
                </span>
                <h4 className="text-xs font-bold text-stone-900">PMKSY Micro-Irrigation Subsidy</h4>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Up to 90% subsidy on drip irrigation installations for small & marginal farmers in Yadadri district.
                </p>
                <button
                  onClick={() => onSelectTab('govt_schemes')}
                  className="text-xs font-semibold text-amber-800 hover:underline pt-1 block"
                >
                  View Details & Documents →
                </button>
              </div>
            </div>
          </div>

          {/* Conversational Assistant Card */}
          <div className="bg-emerald-900 text-white rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Agricultural Knowledge Advisor
              </h4>
            </div>
            <p className="text-xs text-stone-200 leading-relaxed">
              Have questions about organic pest management, fertilizer ratios, or NABARD subsidies?
            </p>
            <button
              onClick={() => onSelectTab('knowledge_assistant')}
              className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs transition"
            >
              Ask Agronomic Advisor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
