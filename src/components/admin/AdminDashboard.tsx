import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Clock,
  Layers,
  Search,
  Plus,
  Save,
  Check,
  Lock,
  ArrowRight,
  UserCheck,
  Eye,
} from 'lucide-react';
import {
  UserProfile,
  FarmStayListing,
  ReadinessCriterion,
  InfrastructureReport,
  AuditLogItem,
  GovernmentScheme,
  ReadinessState,
} from '../../types';
import { farmStore } from '../../services/store';

interface AdminDashboardProps {
  currentUser: UserProfile;
  onSelectTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser, onSelectTab }) => {
  // Authorization Check
  if (currentUser.role !== 'administrator') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-stone-900">Access Restricted</h2>
        <p className="text-xs text-stone-600">
          The administrative console requires authorized Administrator role credentials. Current active role is "{currentUser.role}".
        </p>
        <button
          onClick={() => farmStore.switchRole('administrator')}
          className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs"
        >
          Switch to Administrator Persona
        </button>
      </div>
    );
  }

  const [activeAdminTab, setActiveAdminTab] = useState<
    'verification_queue' | 'criteria_manager' | 'infra_moderation' | 'audit_logs'
  >('verification_queue');

  const [farmStays, setFarmStays] = useState<FarmStayListing[]>(() => farmStore.getFarmStays());
  const [criteria, setCriteria] = useState<ReadinessCriterion[]>(() => farmStore.getCriteria());
  const [infraReports, setInfraReports] = useState<InfrastructureReport[]>(() =>
    farmStore.getInfrastructureReports()
  );
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => farmStore.getAuditLogs());

  // Verification Desk Modal / Edit State
  const [selectedStay, setSelectedStay] = useState<FarmStayListing | null>(null);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [decisionState, setDecisionState] = useState<ReadinessState>('Eligible for recommendation');

  // Criteria Editing state
  const [showAddCritModal, setShowAddCritModal] = useState(false);
  const [newCritTitle, setNewCritTitle] = useState('');
  const [newCritCat, setNewCritCat] = useState<ReadinessCriterion['category']>('Safety & First Aid');
  const [newCritDesc, setNewCritDesc] = useState('');
  const [newCritMandatory, setNewCritMandatory] = useState(true);
  const [newCritSource, setNewCritSource] = useState('National Agritourism Standards Sec 4');

  const handleOpenReview = (stay: FarmStayListing) => {
    setSelectedStay(stay);
    setDecisionState(stay.readinessState);
    setDecisionNotes(stay.verificationNotes || '');
  };

  const handleSaveDecision = () => {
    if (!selectedStay) return;

    farmStore.updateFarmVerificationStatus(
      selectedStay.id,
      decisionState,
      decisionNotes,
      selectedStay.criterionEvaluations
    );

    setFarmStays(farmStore.getFarmStays());
    setAuditLogs(farmStore.getAuditLogs());
    setSelectedStay(null);
  };

  const handleAddCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    const newCrit: ReadinessCriterion = {
      id: `crit_${Date.now()}`,
      title: newCritTitle,
      category: newCritCat,
      isMandatory: newCritMandatory,
      description: newCritDesc,
      verificationMethod: 'Physical Inspection',
      regulatorySource: newCritSource,
    };

    farmStore.saveCriterion(newCrit);
    setCriteria(farmStore.getCriteria());
    setAuditLogs(farmStore.getAuditLogs());
    setShowAddCritModal(false);
    // Reset
    setNewCritTitle('');
    setNewCritDesc('');
  };

  const handleToggleCriterionMandatory = (criterion: ReadinessCriterion) => {
    const updated = { ...criterion, isMandatory: !criterion.isMandatory };
    farmStore.saveCriterion(updated);
    setCriteria(farmStore.getCriteria());
    setAuditLogs(farmStore.getAuditLogs());
  };

  const handleUpdateInfraStatus = (
    reportId: string,
    status: InfrastructureReport['status'],
    notes?: string
  ) => {
    farmStore.updateInfrastructureReportStatus(
      reportId,
      status,
      'District Administration & R&B Division',
      notes
    );
    setInfraReports(farmStore.getInfrastructureReports());
    setAuditLogs(farmStore.getAuditLogs());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
            <span>Administrative Governance & Audit Trail</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Platform Verification & Standards Authority
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Supervise farm-stay eligibility, audit water test reports, configure legal assessment criteria, and review civic escalations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 font-medium">
            Admin: {currentUser.name}
          </span>
        </div>
      </div>

      {/* Admin Navigation Sub-Tabs */}
      <div className="flex border-b border-stone-200 gap-6">
        <button
          onClick={() => setActiveAdminTab('verification_queue')}
          className={`pb-3 text-sm font-semibold transition border-b-2 -mb-[2px] ${
            activeAdminTab === 'verification_queue'
              ? 'border-purple-700 text-purple-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Farm-Stay Verification Desk ({farmStays.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('criteria_manager')}
          className={`pb-3 text-sm font-semibold transition border-b-2 -mb-[2px] ${
            activeAdminTab === 'criteria_manager'
              ? 'border-purple-700 text-purple-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Readiness Criteria Configuration ({criteria.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('infra_moderation')}
          className={`pb-3 text-sm font-semibold transition border-b-2 -mb-[2px] ${
            activeAdminTab === 'infra_moderation'
              ? 'border-purple-700 text-purple-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Infrastructure Moderation ({infraReports.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('audit_logs')}
          className={`pb-3 text-sm font-semibold transition border-b-2 -mb-[2px] ${
            activeAdminTab === 'audit_logs'
              ? 'border-purple-700 text-purple-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Complete Audit Trail ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: Verification Queue */}
      {activeAdminTab === 'verification_queue' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Submitted Properties Pending & Active Audits
            </h2>
            <span className="text-xs text-stone-500">
              Only approved properties pass Stage 1 for tourist recommendation
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                <tr>
                  <th className="p-3.5">Property Name & Location</th>
                  <th className="p-3.5">Operator</th>
                  <th className="p-3.5">Water & Safety Status</th>
                  <th className="p-3.5">Current State</th>
                  <th className="p-3.5">Last Verified</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {farmStays.map((stay) => (
                  <tr key={stay.id} className="hover:bg-stone-50/60 transition">
                    <td className="p-3.5">
                      <strong className="text-stone-900 block">{stay.farmName}</strong>
                      <span className="text-[11px] text-stone-500">{stay.location}, {stay.district}</span>
                    </td>
                    <td className="p-3.5 text-stone-700 font-medium">
                      {stay.operatorName}
                    </td>
                    <td className="p-3.5">
                      <div className="space-y-0.5">
                        <span className={`block text-[11px] font-semibold ${stay.drinkingWaterTested ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {stay.drinkingWaterTested ? '✓ BIS 10500 Tested' : '⚠ Missing Lab Certificate'}
                        </span>
                        <span className="text-[10px] text-stone-400 block">{stay.roadAccessQuality}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          stay.readinessState === 'Eligible for recommendation'
                            ? 'bg-emerald-100 text-emerald-800'
                            : stay.readinessState === 'Awaiting verification'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {stay.readinessState}
                      </span>
                    </td>
                    <td className="p-3.5 text-stone-500 text-[11px]">
                      {stay.verificationDate || 'Unverified'}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleOpenReview(stay)}
                        className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs shadow-2xs"
                      >
                        Audit / Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Audit Review Modal */}
          {selectedStay && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-2xs">
              <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 bg-purple-50 px-2 py-0.5 rounded">
                      Official Property Audit Console
                    </span>
                    <h3 className="text-lg font-bold text-stone-900 mt-1">
                      {selectedStay.farmName}
                    </h3>
                  </div>
                  <button onClick={() => setSelectedStay(null)} className="text-stone-400 hover:text-stone-700">✕</button>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Property specs summary */}
                  <div className="grid grid-cols-2 gap-3 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                    <div>
                      <span className="text-stone-500 block mb-0.5">Location & Area:</span>
                      <strong className="text-stone-900">{selectedStay.location}, {selectedStay.district} ({selectedStay.farmSizeAcres} Acres)</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 block mb-0.5">Water Source Claim:</span>
                      <strong className="text-stone-900">{selectedStay.waterSourceDescription}</strong>
                    </div>
                  </div>

                  {/* Decision State Select */}
                  <div>
                    <label className="block font-bold text-stone-900 mb-1">
                      Verification Determination State
                    </label>
                    <select
                      value={decisionState}
                      onChange={(e) => setDecisionState(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 font-bold bg-white"
                    >
                      <option value="Eligible for recommendation">Eligible for recommendation (100% Verified)</option>
                      <option value="Awaiting verification">Awaiting verification (Pending lab tests or re-inspection)</option>
                      <option value="Improvement required">Improvement required (Fails critical safety/water norms)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-900 mb-1">
                      Official Auditor Inspection Notes & Findings
                    </label>
                    <textarea
                      rows={3}
                      value={decisionNotes}
                      onChange={(e) => setDecisionNotes(e.target.value)}
                      placeholder="Record exact test report numbers, physical inspection observations, and safety protocol checks..."
                      className="w-full px-3 py-2 rounded-lg border border-stone-300"
                      required
                    />
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedStay(null)}
                      className="px-4 py-2 rounded-lg border border-stone-300 text-stone-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveDecision}
                      className="px-6 py-2 rounded-lg bg-purple-700 hover:bg-purple-600 text-white font-bold"
                    >
                      Commit Verification Decision
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Criteria Manager */}
      {activeAdminTab === 'criteria_manager' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                Configurable Eligibility Rules & Standards
              </h2>
              <p className="text-xs text-stone-500">
                Manage mandatory standards vs optional strength categories according to State Agritourism Policies.
              </p>
            </div>
            <button
              onClick={() => setShowAddCritModal(true)}
              className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Criterion</span>
            </button>
          </div>

          <div className="space-y-3">
            {criteria.map((crit) => (
              <div
                key={crit.id}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded text-[10px]">
                      {crit.category}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      Method: {crit.verificationMethod}
                    </span>
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm">{crit.title}</h3>
                  <p className="text-stone-600 leading-relaxed">{crit.description}</p>
                  <span className="text-[10px] text-stone-400 block">Authority / Citation: {crit.regulatorySource}</span>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <button
                    onClick={() => handleToggleCriterionMandatory(crit)}
                    className={`px-3 py-1.5 rounded-full font-bold text-xs transition ${
                      crit.isMandatory
                        ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {crit.isMandatory ? 'Mandatory Gate' : 'Optional Strength'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Criterion Modal */}
          {showAddCritModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="text-base font-bold text-stone-900">Define Readiness Criterion</h3>
                  <button onClick={() => setShowAddCritModal(false)} className="text-stone-400 hover:text-stone-700">✕</button>
                </div>

                <form onSubmit={handleAddCriterion} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Criterion Title</label>
                    <input
                      type="text"
                      value={newCritTitle}
                      onChange={(e) => setNewCritTitle(e.target.value)}
                      placeholder="e.g. Solar Water Heater Temperature Check"
                      className="w-full px-3 py-2 rounded-lg border border-stone-300"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Category</label>
                      <select
                        value={newCritCat}
                        onChange={(e) => setNewCritCat(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                      >
                        <option value="Legal & Permissions">Legal & Permissions</option>
                        <option value="Safety & First Aid">Safety & First Aid</option>
                        <option value="Accommodation Standard">Accommodation Standard</option>
                        <option value="Sanitation & Drinking Water">Sanitation & Drinking Water</option>
                        <option value="Visitor Experiences">Visitor Experiences</option>
                        <option value="Environmental Responsibility">Environmental Responsibility</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Type</label>
                      <select
                        value={newCritMandatory ? 'mandatory' : 'optional'}
                        onChange={(e) => setNewCritMandatory(e.target.value === 'mandatory')}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                      >
                        <option value="mandatory">Mandatory (Must pass)</option>
                        <option value="optional">Optional Strength</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Specification & Audit Rule</label>
                    <textarea
                      rows={2}
                      value={newCritDesc}
                      onChange={(e) => setNewCritDesc(e.target.value)}
                      placeholder="Describe what verifiable standard the inspector or lab document must meet..."
                      className="w-full px-3 py-2 rounded-lg border border-stone-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Regulatory Source Link / Section</label>
                    <input
                      type="text"
                      value={newCritSource}
                      onChange={(e) => setNewCritSource(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300"
                      required
                    />
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddCritModal(false)}
                      className="px-4 py-2 rounded-lg border border-stone-300 text-stone-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-purple-700 hover:bg-purple-600 text-white font-bold"
                    >
                      Commit Criterion
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Infrastructure Moderation */}
      {activeAdminTab === 'infra_moderation' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Review & Assign Community Infrastructure Bottlenecks
          </h2>

          <div className="space-y-3">
            {infraReports.map((report) => (
              <div
                key={report.id}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                      {report.category}
                    </span>
                    <h3 className="font-bold text-stone-900 text-sm mt-1">{report.title}</h3>
                    <p className="text-stone-500 text-[11px]">
                      Village: {report.village}, {report.district} • Backers: {report.supportVotesCount}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={report.status}
                      onChange={(e) => handleUpdateInfraStatus(report.id, e.target.value as any)}
                      className="px-2.5 py-1.5 rounded-lg border border-stone-300 font-bold bg-white"
                    >
                      <option value="Reported">Reported</option>
                      <option value="Verified by Community">Verified by Community</option>
                      <option value="Escalated to Panchayat / Admin">Escalate to Panchayat</option>
                      <option value="Work In Progress">Mark Work In Progress</option>
                      <option value="Resolved">Mark Resolved</option>
                    </select>
                  </div>
                </div>

                <p className="text-stone-700 leading-relaxed bg-stone-50 p-3 rounded-lg border border-stone-100">
                  {report.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Audit Logs */}
      {activeAdminTab === 'audit_logs' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Immutable Audit Trail & Regulatory Log
          </h2>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Action Type</th>
                  <th className="p-3">Actor / Persona</th>
                  <th className="p-3">Target Entity</th>
                  <th className="p-3">Operation Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/50">
                    <td className="p-3 text-stone-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3 font-bold text-stone-900">
                      {log.action}
                    </td>
                    <td className="p-3 text-stone-700">
                      {log.performedBy} ({log.performedByRole})
                    </td>
                    <td className="p-3 font-medium text-emerald-800">
                      {log.targetEntity}
                    </td>
                    <td className="p-3 text-stone-600">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
