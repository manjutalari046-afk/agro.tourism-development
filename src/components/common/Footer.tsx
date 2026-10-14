import React from 'react';
import { Sprout, ShieldCheck, ExternalLink, HeartHandshake, PhoneCall, BookOpen } from 'lucide-react';
import { Language } from '../../types';

interface FooterProps {
  language: Language;
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <Sprout className="w-5 h-5 text-emerald-100" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">FarmBridge AI</span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              Connecting primary agriculture, verified rural agritourism readiness, and community infrastructure development.
              Empowering farmers with evidence-based soil decisions, fair market insights, and sustainable tourism diversification.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-stone-800/80 p-2.5 rounded-lg border border-stone-700 max-w-md">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>
                Evidence-Grounded Policy: Recommendations distinguish measured lab data from estimates. Tourism recommendations require audited verification.
              </span>
            </div>
          </div>

          {/* Agricultural Tools */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3">Farmer Assistance</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button onClick={() => onSelectTab('soil_analysis')} className="hover:text-white transition">
                  Soil Health Analysis
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('crop_suitability')} className="hover:text-white transition">
                  Crop Recommendation Engine
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('crop_profit')} className="hover:text-white transition">
                  Cultivation Profit Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('crop_health')} className="hover:text-white transition">
                  Plant Health Assistant
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('market_data')} className="hover:text-white transition">
                  APMC Mandi Price Tracker
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('govt_schemes')} className="hover:text-white transition">
                  Government Scheme Directory
                </button>
              </li>
            </ul>
          </div>

          {/* Agritourism & Visitors */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-sky-400 mb-3">Agritourism & Stays</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button onClick={() => onSelectTab('tourist_search')} className="hover:text-white transition">
                  Discover Verified Farm Stays
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('farmstay_register')} className="hover:text-white transition">
                  Farm-Stay Registration
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('farmstay_readiness')} className="hover:text-white transition">
                  Readiness Assessment
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('marketplace')} className="hover:text-white transition">
                  Direct Farm Produce Market
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('tourist_enquiries')} className="hover:text-white transition">
                  Track Enquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Rural Governance & Reference */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">Rural Community</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button onClick={() => onSelectTab('infra_gap_reports')} className="hover:text-white transition">
                  Infrastructure Gap Reporter
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('community_directory')} className="hover:text-white transition">
                  Local Service Directory
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('community_hub')} className="hover:text-white transition">
                  Community Impact Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('admin_dashboard')} className="hover:text-white transition">
                  Admin Verification Desk
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory & Institutional Citations */}
        <div className="pt-8 border-t border-stone-800 text-xs text-stone-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Aligned with ICAR & State Agricultural Universities</span>
            <span>•</span>
            <span>BIS 10500 Water Standards</span>
            <span>•</span>
            <span>NABARD Rural Tourism Guidelines</span>
            <span>•</span>
            <span>e-NAM / Agmarknet Market Feeds</span>
          </div>
          <div>
            © 2026 FarmBridge AI Platform. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
