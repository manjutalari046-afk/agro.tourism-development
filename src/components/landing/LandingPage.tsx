import React, { useState } from 'react';
import {
  Sprout,
  Compass,
  Building2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Award,
  Layers,
  ShoppingBag,
  AlertCircle,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import { UserRole, Language, FarmStayListing } from '../../types';
import { farmStore } from '../../services/store';

interface LandingPageProps {
  language: Language;
  onSelectTab: (tab: string) => void;
  onSwitchRole: (role: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  language,
  onSelectTab,
  onSwitchRole,
}) => {
  const farmStays = farmStore.getFarmStays().filter((f) => f.readinessState === 'Eligible for recommendation');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Do I have to host tourists to use the agricultural tools?',
      a: 'Absolutely not. Farmers remain the primary focus of FarmBridge AI. All agricultural tools—soil analysis, crop recommendations, expense calculators, mandi prices, and government schemes—work completely independently. Tourism is strictly an optional diversification for interested and suitable farms.',
    },
    {
      q: 'How does FarmBridge verify farm stays before recommending them to tourists?',
      a: 'We enforce a strict two-stage process. First, mandatory eligibility requirements (land legality, certified BIS 10500 drinking water test reports, clean sanitation, emergency first aid, and safe road access) must be audited and verified by authorized extension officers. Only then does a farm stay become eligible for recommendation ranking.',
    },
    {
      q: 'Can ordinary photos alone prove soil nutrients or safety compliance?',
      a: 'No. FarmBridge AI never fabricates laboratory readings or safety certifications from photos. Our soil assistant relies on actual laboratory soil tests (or manual parameter entries), distinguishing measured from estimated values. Farm-stay sanitation and safety require physical audits or certified laboratory test documents.',
    },
    {
      q: 'How does the community infrastructure gap reporting work?',
      a: 'Farmers, tourists, and village representatives can report specific rural barriers—such as waterlogged access roads, weak internet/UPI connectivity, or inadequate waste disposal. The platform clusters related complaints by locality and escalates verified reports to Gram Panchayats and district authorities.',
    },
    {
      q: 'Are market mandi prices live or estimates?',
      a: 'FarmBridge clearly tags every price observation with its exact reporting mandi, date, timestamp, and data source (such as e-NAM and Agmarknet bulletins). We never present static demo figures as live real-time prices.',
    },
  ];

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-stone-900 text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-700/60 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm font-medium backdrop-blur-xs">
              <Sprout className="w-4 h-4 text-emerald-300" />
              <span>Evidence-Based Agritech • Audited Agritourism • Rural Growth</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Empowering Farmers. <br className="hidden sm:inline" />
              <span className="text-emerald-300">Connecting Agritourism.</span> <br className="hidden sm:inline" />
              Transforming Rural Communities.
            </h1>

            <p className="text-lg sm:text-xl text-stone-200 leading-relaxed max-w-2xl mx-auto">
              A unified agricultural intelligence platform that provides scientific soil guidance, transparent crop economics, verified farm-stay discovery, and community infrastructure advocacy.
            </p>

            {/* Clear Dual Entry Points */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  onSwitchRole('farmer');
                  onSelectTab('farmer_dashboard');
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold shadow-lg shadow-emerald-950/30 flex items-center justify-center gap-2.5 transition transform hover:-translate-y-0.5"
              >
                <Sprout className="w-5 h-5 text-stone-950" />
                <span>Enter as Farmer</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  onSwitchRole('tourist');
                  onSelectTab('tourist_search');
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold border border-white/20 backdrop-blur-xs flex items-center justify-center gap-2.5 transition transform hover:-translate-y-0.5"
              >
                <Compass className="w-5 h-5 text-emerald-300" />
                <span>Explore Verified Farm Stays</span>
              </button>
            </div>

            {/* Quick Demo Switch helper */}
            <div className="pt-2 text-xs text-stone-300 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Interactive multi-role demo: Switch between Farmer, Tourist, Community Lead & Admin anytime.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Pillars Section */}
      <section className="py-16 -mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Agriculture */}
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-stone-200 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-5">
              <Sprout className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">1. Agricultural Decision Support</h3>
            <p className="text-sm text-stone-600 mb-4 leading-relaxed">
              Scientific soil health cards, NPK nutrient diagnosis, transparent crop rotation, mandi prices, and government scheme navigation. Works 100% independently of tourism.
            </p>
            <button
              onClick={() => {
                onSwitchRole('farmer');
                onSelectTab('soil_analysis');
              }}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
            >
              <span>Explore Soil & Crop Tools</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Pillar 2: Agritourism */}
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-stone-200 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center mb-5">
              <Compass className="w-6 h-6 text-sky-700" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">2. Audited Farm-Stay Discovery</h3>
            <p className="text-sm text-stone-600 mb-4 leading-relaxed">
              Transparent two-stage matching: mandatory drinking water, hygiene, and emergency safety audits filter candidates before preference ranking connects genuine farm hosts with respectful tourists.
            </p>
            <button
              onClick={() => {
                onSwitchRole('tourist');
                onSelectTab('tourist_search');
              }}
              className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1 group"
            >
              <span>Search Farm Stays</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Pillar 3: Rural Community */}
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-stone-200 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-5">
              <Building2 className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">3. Community & Infrastructure</h3>
            <p className="text-sm text-stone-600 mb-4 leading-relaxed">
              Crowdsourced reporting of rural road damage, internet dead zones, and water issues. Aggregates localized evidence to unlock public infrastructure upgrades and promote local village enterprises.
            </p>
            <button
              onClick={() => {
                onSwitchRole('community_manager');
                onSelectTab('infra_gap_reports');
              }}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 group"
            >
              <span>View Infrastructure Gaps</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Agricultural Tools Showcase */}
      <section className="py-16 bg-stone-100 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              Farmer-First Technology
            </span>
            <h2 className="text-3xl font-extrabold text-stone-900 mt-3">
              Actionable Agricultural Decision Tools
            </h2>
            <p className="text-stone-600 text-sm mt-2">
              Designed with agronomic rigour, regional suitability, and honest disclaimers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                pH
              </div>
              <h4 className="font-bold text-stone-900">AI Soil Analysis</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Interprets lab Soil Health Cards, diagnoses N-P-K nutrient deficiencies, and highlights unmeasured micronutrients.
              </p>
              <button
                onClick={() => {
                  onSwitchRole('farmer');
                  onSelectTab('soil_analysis');
                }}
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                Analyze Soil →
              </button>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                ₹
              </div>
              <h4 className="font-bold text-stone-900">Profit & Break-Even Calculator</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Calculates total cultivation costs, gross revenue, net returns, and break-even selling prices per quintal.
              </p>
              <button
                onClick={() => {
                  onSwitchRole('farmer');
                  onSelectTab('crop_profit');
                }}
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                Calculate Margins →
              </button>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                🩺
              </div>
              <h4 className="font-bold text-stone-900">Crop Health Doctor</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Preliminary pest & leaf disease screening with organic remedies, biological controls, and KVK referral guidance.
              </p>
              <button
                onClick={() => {
                  onSwitchRole('farmer');
                  onSelectTab('crop_health');
                }}
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                Diagnose Symptoms →
              </button>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                🏛️
              </div>
              <h4 className="font-bold text-stone-900">Government Schemes Finder</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Filter subsidies including PM-KISAN, PMFBY crop insurance, PMKSY micro-irrigation, and NABARD tourism grants.
              </p>
              <button
                onClick={() => {
                  onSwitchRole('farmer');
                  onSelectTab('govt_schemes');
                }}
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                Search Subsidies →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Farm-Stay Discovery Preview */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-3 py-1 rounded-full mb-2">
              <BadgeCheck className="w-3.5 h-3.5 text-sky-700" />
              <span>Audited Farm Experiences</span>
            </div>
            <h2 className="text-3xl font-extrabold text-stone-900">
              Verified Agritourism Stays
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              Properties that satisfy mandatory legal permissions, certified drinking water, and safe sanitation.
            </p>
          </div>

          <button
            onClick={() => {
              onSwitchRole('tourist');
              onSelectTab('tourist_search');
            }}
            className="px-5 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm flex items-center gap-2"
          >
            <span>View All Properties</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {farmStays.map((stay) => (
            <div
              key={stay.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col sm:flex-row"
            >
              <div className="sm:w-2/5 relative h-56 sm:h-auto">
                <img
                  src={stay.photos[0]}
                  alt={stay.farmName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-600 text-white shadow-xs flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Eligible
                  </span>
                </div>
              </div>

              <div className="sm:w-3/5 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-xs text-stone-500 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{stay.location}, {stay.district}</span>
                  </div>
                  <h3 className="font-bold text-lg text-stone-900 leading-snug">{stay.farmName}</h3>
                  <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">{stay.tagline}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {stay.activities.slice(0, 2).map((act) => (
                      <span key={act.id} className="text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-medium">
                        {act.title}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-stone-900">₹{stay.pricePerNight}</span>
                    <span className="text-xs text-stone-500"> / night</span>
                  </div>

                  <button
                    onClick={() => {
                      onSwitchRole('tourist');
                      onSelectTab('tourist_search');
                    }}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition"
                  >
                    View Details & Enquire
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Impact Statistics (Clearly labelled sample & live figures) */}
      <section className="py-16 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950 px-3 py-1 rounded-full border border-amber-800">
              Measurable Rural Footprint
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-3">Platform Impact Dashboard</h2>
            <p className="text-stone-400 text-xs mt-2">
              Values clearly labelled between live observations and pilot regional sample statistics.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-5 bg-stone-800/60 rounded-xl border border-stone-700">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">142</div>
              <div className="text-xs font-medium text-stone-300 mt-1">Participating Farms</div>
              <div className="text-[10px] text-stone-500 mt-0.5">(Sample Telangana Cohort)</div>
            </div>

            <div className="p-5 bg-stone-800/60 rounded-xl border border-stone-700">
              <div className="text-3xl sm:text-4xl font-extrabold text-sky-400">100%</div>
              <div className="text-xs font-medium text-stone-300 mt-1">Water & Sanitation Audited</div>
              <div className="text-[10px] text-stone-500 mt-0.5">(For Recommended Stays)</div>
            </div>

            <div className="p-5 bg-stone-800/60 rounded-xl border border-stone-700">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">18</div>
              <div className="text-xs font-medium text-stone-300 mt-1">Infrastructure Gaps Escalated</div>
              <div className="text-[10px] text-stone-500 mt-0.5">(Roads, Water, 4G Telecom)</div>
            </div>

            <div className="p-5 bg-stone-800/60 rounded-xl border border-stone-700">
              <div className="text-3xl sm:text-4xl font-extrabold text-purple-400">₹3.8L</div>
              <div className="text-xs font-medium text-stone-300 mt-1">Direct Farm Produce Revenue</div>
              <div className="text-[10px] text-stone-500 mt-0.5">(Enquiry Facilitated)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">Frequently Asked Questions</h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Transparent explanations of our agronomic models, safety audits, and community governance.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden transition"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-stone-900 text-sm sm:text-base hover:bg-stone-50"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-5 h-5 text-stone-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-stone-400 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
