import React, { useState } from 'react';
import {
  CheckSquare,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Upload,
  ArrowRight,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { UserProfile, FarmImprovementItem, FarmStayListing } from '../../types';
import { farmStore } from '../../services/store';

interface ImprovementPlannerProps {
  currentUser: UserProfile;
  onSelectTab: (tab: string) => void;
}

export const ImprovementPlanner: React.FC<ImprovementPlannerProps> = ({
  currentUser,
  onSelectTab,
}) => {
  const farmStays = farmStore.getFarmStays();
  const [selectedStayId, setSelectedStayId] = useState<string>(() => {
    // Pick the stay with issues or farmer's stay
    const needsImprovement = farmStays.find((s) => s.readinessState !== 'Eligible for recommendation');
    return needsImprovement ? needsImprovement.id : farmStays[0]?.id || '';
  });

  const stay = farmStore.getFarmStayById(selectedStayId);

  // Dynamic improvement items generated from outstanding criteria
  const [items, setItems] = useState<FarmImprovementItem[]>([
    {
      id: 'imp_1',
      farmStayId: selectedStayId,
      criterionId: 'crit_water_1',
      problemIdentified: 'Potable Drinking Water Test Report older than 6 months or missing microbiological panel',
      whyItMatters: 'Protects visiting guests and families from water-borne pathogens (E. coli, coliforms) and prevents severe legal liability for the farm operator.',
      isMandatory: true,
      suggestedAction: 'Collect a 1-litre sterile water sample from your RO tap / borewell and submit to District Water Quality Testing Laboratory (RWS Dept). Upload the BIS 10500 test certificate.',
      responsibleParty: 'Farm Operator + District Laboratory',
      status: stay?.drinkingWaterTested ? 'Verified Done' : 'In Progress',
      evidenceSubmittedNotes: 'Sample sent to Nalgonda District Lab on Oct 10th; awaiting PDF.',
    },
    {
      id: 'imp_2',
      farmStayId: selectedStayId,
      criterionId: 'crit_safety_1',
      problemIdentified: 'First-Aid Kit lacks dedicated emergency protocol signage and anti-venom proximity contact',
      whyItMatters: 'Rural farms have snakes, bees, and equipment risks. Immediate first-response clarity saves lives in emergencies.',
      isMandatory: true,
      suggestedAction: 'Mount a visible first-aid station in the main dining hall. Print emergency numbers for the nearest Primary Health Centre (PHC) and designated 24/7 taxi driver.',
      responsibleParty: 'Farm Manager',
      status: stay?.hasFirstAid ? 'Verified Done' : 'Not Started',
    },
    {
      id: 'imp_3',
      farmStayId: selectedStayId,
      criterionId: 'crit_access_1',
      problemIdentified: 'Monsoon mud track gets waterlogged, preventing emergency ambulance access within 150m',
      whyItMatters: 'Standard rural tourism norms require all-weather passage for ambulances or transport vehicles.',
      isMandatory: true,
      suggestedAction: 'Coordinate with Gram Panchayat or lay 2 truckloads of coarse gravel along the 120m approach path before the rainy season.',
      responsibleParty: 'Gram Panchayat & Farm Host',
      status: stay?.roadAccessQuality === 'All-weather paved' ? 'Verified Done' : 'In Progress',
    },
    {
      id: 'imp_4',
      farmStayId: selectedStayId,
      criterionId: 'crit_waste_1',
      problemIdentified: 'Need dual-bin composting signage for day visitors',
      whyItMatters: 'Preserves farm ecosystem, enriches compost, and models sustainable agritourism to city guests.',
      isMandatory: false,
      suggestedAction: 'Install color-coded bins (Green for organic peels, Blue for dry recyclables) with pictorial signs in regional languages.',
      responsibleParty: 'Farm Host',
      status: 'In Progress',
    },
  ]);

  const handleStatusChange = (id: string, newStatus: FarmImprovementItem['status']) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, evidenceSubmittedNotes: notes } : item))
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2">
            <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>Farm Compliance & Quality Roadmap</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Farm-Stay Improvement Action Planner
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Track and resolve outstanding eligibility gaps to transition your property to "Eligible for Recommendation".
          </p>
        </div>

        {farmStays.length > 1 && (
          <select
            value={selectedStayId}
            onChange={(e) => setSelectedStayId(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-stone-300 bg-white font-medium"
          >
            {farmStays.map((s) => (
              <option key={s.id} value={s.id}>
                {s.farmName} ({s.readinessState.split(' ')[0]})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Property Status Banner */}
      {stay && (
        <div className="p-4 bg-stone-100 rounded-xl border border-stone-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-stone-900">{stay.farmName}</span>
            <span className="text-xs text-stone-500 block">Current Status: <strong>{stay.readinessState}</strong></span>
          </div>
          <button
            onClick={() => onSelectTab('farmstay_readiness')}
            className="text-xs font-semibold text-emerald-700 hover:underline"
          >
            Open Audit Desk →
          </button>
        </div>
      )}

      {/* Checklist items */}
      <div className="space-y-4">
        {items.map((item) => {
          const isDone = item.status === 'Verified Done';
          return (
            <div
              key={item.id}
              className={`p-6 rounded-2xl border transition bg-white ${
                isDone ? 'border-emerald-200 bg-emerald-50/20' : 'border-stone-200 shadow-2xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        item.isMandatory
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.isMandatory ? 'Mandatory Requirement' : 'Optional Strength'}
                    </span>
                    <span className="text-xs text-stone-500">
                      Responsible: <strong>{item.responsibleParty}</strong>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900">{item.problemIdentified}</h3>
                </div>

                <div className="shrink-0">
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value as any)}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-300 font-semibold bg-white"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Evidence Submitted">Evidence Submitted</option>
                    <option value="Verified Done">Verified Done</option>
                  </select>
                </div>
              </div>

              {/* Why it matters */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed mb-3">
                <strong className="text-stone-900">Why this matters: </strong>
                {item.whyItMatters}
              </div>

              {/* Suggested Action */}
              <div className="text-xs text-stone-700 space-y-1 mb-3">
                <strong className="text-stone-900 block">Suggested Corrective Action:</strong>
                <p className="leading-relaxed text-stone-600">{item.suggestedAction}</p>
              </div>

              {/* Evidence Note update */}
              <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center gap-2 text-xs">
                <span className="text-stone-500 font-medium shrink-0">Submitted Evidence:</span>
                <input
                  type="text"
                  value={item.evidenceSubmittedNotes || ''}
                  onChange={(e) => handleUpdateNotes(item.id, e.target.value)}
                  placeholder="e.g. Lab report PDF #1042 sent or uploaded to drive..."
                  className="flex-1 px-3 py-1.5 rounded-lg border border-stone-300 text-xs"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
