import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Upload,
  ArrowRight,
  Sparkles,
  Info,
  Check,
  Send,
  HelpCircle,
} from 'lucide-react';
import { UserProfile, FarmStayListing, ReadinessCriterion, ReadinessState } from '../../types';
import { farmStore } from '../../services/store';

interface ReadinessAssessmentProps {
  currentUser: UserProfile;
  onSelectTab: (tab: string) => void;
}

export const ReadinessAssessment: React.FC<ReadinessAssessmentProps> = ({
  currentUser,
  onSelectTab,
}) => {
  const farmStays = farmStore.getFarmStays();
  // Farmer views their own stay; Admins can pick any stay
  const [selectedFarmStayId, setSelectedFarmStayId] = useState<string>(() => {
    const mine = farmStore.getFarmerFarmStay(currentUser.id);
    return mine ? mine.id : farmStays[0]?.id || '';
  });

  const stay = farmStore.getFarmStayById(selectedFarmStayId);
  const criteria = farmStore.getCriteria();

  const [evidenceNotes, setEvidenceNotes] = useState<Record<string, string>>({});
  const [reviewRequested, setReviewRequested] = useState(false);

  if (!stay) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-stone-900">No Farm-Stay Listing Found</h2>
        <p className="text-xs text-stone-600">Please register your property first before conducting an assessment.</p>
        <button
          onClick={() => onSelectTab('farmstay_register')}
          className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-semibold text-xs"
        >
          Register Property Now
        </button>
      </div>
    );
  }

  const mandatoryCriteria = criteria.filter((c) => c.isMandatory);
  const optionalCriteria = criteria.filter((c) => !c.isMandatory);

  const getStatusColor = (state: ReadinessState) => {
    switch (state) {
      case 'Eligible for recommendation':
        return {
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
          badge: 'bg-emerald-600 text-white',
          desc: 'This property has passed all audited mandatory safety, drinking water, and legal verifications. It is eligible for tourist recommendation ranking.',
        };
      case 'Awaiting verification':
        return {
          bg: 'bg-sky-50 border-sky-300 text-sky-950',
          badge: 'bg-sky-600 text-white',
          desc: 'Basic property registration submitted, but mandatory physical or laboratory inspection documents are pending review by authorized officials.',
        };
      case 'Improvement required':
        return {
          bg: 'bg-amber-50 border-amber-300 text-amber-950',
          badge: 'bg-amber-600 text-white',
          desc: 'One or more mandatory safety, sanitation, or access requirements currently fail standards. See improvement checklist below to correct deficiencies.',
        };
    }
  };

  const statusConfig = getStatusColor(stay.readinessState);

  const handleEvidenceSubmit = (critId: string) => {
    const notes = evidenceNotes[critId];
    if (!notes) return;

    const currentEvals = stay.criterionEvaluations || {};
    const updated = {
      ...currentEvals,
      [critId]: {
        criterionId: critId,
        satisfied: false,
        status: 'Evidence Missing' as const,
        evidenceNotes: notes,
      },
    };

    farmStore.saveFarmStay({
      ...stay,
      criterionEvaluations: updated,
    });
    alert('Evidence document note submitted for official audit.');
  };

  const handleRequestReview = () => {
    farmStore.addAuditLog(
      'REQUESTED_FARM_REVIEW',
      stay.farmName,
      `Farmer ${currentUser.name} requested administrative re-evaluation of readiness criteria.`
    );
    setReviewRequested(true);
    setTimeout(() => setReviewRequested(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Two-Stage Agritourism Standards Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Farm-Stay Readiness & Verification Desk
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Evaluating: <strong className="text-stone-900">{stay.farmName}</strong> ({stay.location}, {stay.district})
          </p>
        </div>

        {/* If Admin or Multi-farm selector */}
        {farmStays.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500">Evaluating Property:</span>
            <select
              value={selectedFarmStayId}
              onChange={(e) => setSelectedFarmStayId(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border border-stone-300 bg-white font-medium"
            >
              {farmStays.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.farmName} ({s.readinessState.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Readiness State Card (The 3 Canonical States) */}
      <div className={`p-6 rounded-2xl border ${statusConfig.bg} shadow-xs space-y-3`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider ${statusConfig.badge}`}>
              {stay.readinessState}
            </span>
            <span className="text-xs text-stone-600">
              {stay.verificationDate ? `Audited by Extension Office on ${stay.verificationDate}` : 'Under Review'}
            </span>
          </div>

          <button
            onClick={handleRequestReview}
            disabled={reviewRequested}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs transition flex items-center gap-2 self-start"
          >
            {reviewRequested ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Review Request Logged</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Request Official Audit / Re-inspection</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs sm:text-sm leading-relaxed max-w-3xl">
          {statusConfig.desc}
        </p>

        {stay.verificationNotes && (
          <div className="p-3 bg-white/70 rounded-xl border border-stone-300/60 text-xs text-stone-800">
            <strong>Auditor Inspection Log: </strong>
            {stay.verificationNotes}
          </div>
        )}
      </div>

      {/* Mandatory Requirements Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Mandatory Eligibility Requirements (Must Pass 100%)</span>
            </h2>
            <p className="text-xs text-stone-500">
              Legal ownership, BIS 10500 potable water test, sanitary toilets, first-aid safety protocol, and road access.
            </p>
          </div>
          <button
            onClick={() => onSelectTab('improvement_planner')}
            className="text-xs font-semibold text-emerald-700 hover:underline"
          >
            View Improvement Action Plan →
          </button>
        </div>

        <div className="space-y-3">
          {mandatoryCriteria.map((crit) => {
            const evalState = stay.criterionEvaluations?.[crit.id];
            const isSatisfied = evalState?.satisfied ?? false;
            const status = evalState?.status || (isSatisfied ? 'Satisfied' : 'Evidence Missing');

            return (
              <div
                key={crit.id}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 bg-rose-50 px-2 py-0.5 rounded">
                        Mandatory • {crit.category}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        Method: {crit.verificationMethod}
                      </span>
                    </div>
                    <h3 className="font-bold text-stone-900 text-sm">{crit.title}</h3>
                    <p className="text-xs text-stone-600 leading-relaxed">{crit.description}</p>
                    <span className="text-[10px] text-stone-400 block">Source: {crit.regulatorySource}</span>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                        isSatisfied
                          ? 'bg-emerald-100 text-emerald-800'
                          : status === 'Evidence Missing'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isSatisfied ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Satisfied</span>
                        </>
                      ) : status === 'Evidence Missing' ? (
                        <>
                          <Clock className="w-3.5 h-3.5" />
                          <span>Evidence Pending</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Correction Required</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Outstanding Evidence Note Input if not satisfied */}
                {!isSatisfied && (
                  <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add reference to laboratory document or uploaded certificate..."
                      value={evidenceNotes[crit.id] || ''}
                      onChange={(e) => setEvidenceNotes({ ...evidenceNotes, [crit.id]: e.target.value })}
                      className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-stone-300"
                    />
                    <button
                      onClick={() => handleEvidenceSubmit(crit.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-stone-900 text-white font-medium text-xs hover:bg-stone-800 transition"
                    >
                      Submit Evidence Note
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Optional Strengths & Experiences */}
      <div className="space-y-4 pt-4 border-t border-stone-200">
        <div>
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Optional Experience Strengths & Amenities</span>
          </h2>
          <p className="text-xs text-stone-500">
            Hands-on harvesting, traditional food, zero-plastic waste, and guided nature walks. Boosts recommendation ranking!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {optionalCriteria.map((crit) => {
            const evalState = stay.criterionEvaluations?.[crit.id];
            const isSatisfied = evalState?.satisfied ?? true;

            return (
              <div
                key={crit.id}
                className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-2 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {crit.category}
                  </span>
                  <h4 className="font-bold text-stone-900 text-xs mt-1.5">{crit.title}</h4>
                  <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">{crit.description}</p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-stone-400">Bonus Preference</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3 h-3" />
                    Offered
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
