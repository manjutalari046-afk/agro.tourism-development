import React, { useState } from 'react';
import {
  Building2,
  Search,
  Filter,
  ExternalLink,
  CheckCircle2,
  FileText,
  AlertCircle,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { GovernmentScheme, UserProfile } from '../../types';
import { farmStore } from '../../services/store';

interface SchemeFinderProps {
  currentUser: UserProfile;
}

export const SchemeFinder: React.FC<SchemeFinderProps> = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [landHoldingHa, setLandHoldingHa] = useState<number>(2.5); // Farmer's land holding
  const [schemes, setSchemes] = useState<GovernmentScheme[]>(() => farmStore.getSchemes());
  const [selectedScheme, setSelectedScheme] = useState<GovernmentScheme | null>(schemes[0]);

  const filtered = schemes.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.teluguName && s.teluguName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="border-b border-stone-200 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2">
          <Building2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Official Agricultural & Agritourism Subsidies</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          Government Schemes & Financial Incentives Directory
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Search verified central and state support programs for direct income support, crop insurance, drip irrigation, and agritourism infrastructure.
        </p>
      </div>

      {/* Distinction Disclaimer Banner */}
      <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong>Preliminary Match Disclaimer: </strong>
          Matches shown below are preliminary criteria assessments based on publicly notified guidelines. FarmBridge AI does not issue official approvals or process payments directly. Always submit formal applications through the official departmental portals or your local Village Revenue / Agricultural Extension Officer.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Filter & Schemes List (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search scheme name or keyword..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-stone-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded border border-stone-300 bg-white"
                >
                  <option value="All">All Categories</option>
                  <option value="Direct Income Support">Income Support</option>
                  <option value="Crop Insurance">Crop Insurance</option>
                  <option value="Irrigation & Water">Irrigation / Drip</option>
                  <option value="Soil & Inputs">Soil & Inputs</option>
                  <option value="Agritourism & Rural Infra">Agritourism Subsidy</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Land (Hectares)</label>
                <input
                  type="number"
                  step="0.5"
                  value={landHoldingHa}
                  onChange={(e) => setLandHoldingHa(parseFloat(e.target.value) || 1)}
                  className="w-full text-xs px-2.5 py-1.5 rounded border border-stone-300"
                />
              </div>
            </div>
          </div>

          {/* Scheme Cards */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filtered.map((scheme) => {
              const isSelected = selectedScheme?.id === scheme.id;
              return (
                <div
                  key={scheme.id}
                  onClick={() => setSelectedScheme(scheme)}
                  className={`p-4 rounded-xl border transition cursor-pointer bg-white ${
                    isSelected
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 shadow-2xs'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {scheme.category}
                  </span>
                  <h4 className="font-bold text-stone-900 text-sm mt-1.5 leading-snug">{scheme.name}</h4>
                  {scheme.teluguName && (
                    <span className="text-xs text-stone-500 block">{scheme.teluguName}</span>
                  )}
                  <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">
                    {scheme.potentialBenefits}
                  </p>

                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                    <span>Verified: {scheme.lastVerifiedDate}</span>
                    <span className="text-emerald-700 font-semibold">View Requirements →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Scheme Details (7 Cols) */}
        <div className="lg:col-span-7">
          {selectedScheme ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded">
                  {selectedScheme.category}
                </span>
                <h3 className="text-xl font-bold text-stone-900 mt-2">{selectedScheme.name}</h3>
                {selectedScheme.teluguName && (
                  <p className="text-sm font-medium text-emerald-700">{selectedScheme.teluguName}</p>
                )}
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {selectedScheme.description}
                </p>
              </div>

              {/* Potential Benefits */}
              <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1">
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">
                  Potential Benefits & Financial Assistance:
                </span>
                <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                  {selectedScheme.potentialBenefits}
                </p>
              </div>

              {/* Eligibility Conditions */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Eligibility Criteria
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-700">
                  {selectedScheme.eligibilityConditions.map((cond, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{cond}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Required Documents */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Required Documentation Checklist
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedScheme.requiredDocuments.map((doc, i) => (
                    <div key={i} className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-700 flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Application Procedure */}
              <div className="space-y-1.5 text-xs text-stone-700">
                <h4 className="font-bold text-stone-800 uppercase tracking-wider">
                  Application Procedure
                </h4>
                <p className="leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-200">
                  {selectedScheme.applicationProcedure}
                </p>
              </div>

              {/* Official Source & Verification */}
              <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="text-stone-500 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Last verified: {selectedScheme.lastVerifiedDate}</span>
                </div>

                <a
                  href={selectedScheme.officialSourceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs shadow-2xs transition"
                >
                  <span>Official Government Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-xs text-stone-500">
              Select a scheme from the left to view comprehensive eligibility rules and documents.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
