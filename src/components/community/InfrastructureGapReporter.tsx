import React, { useState } from 'react';
import {
  Building2,
  AlertTriangle,
  Plus,
  ThumbsUp,
  MapPin,
  Clock,
  Layers,
  CheckCircle2,
  Filter,
  Send,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { InfrastructureReport, UserProfile } from '../../types';
import { farmStore } from '../../services/store';

interface InfrastructureGapReporterProps {
  currentUser: UserProfile;
}

export const InfrastructureGapReporter: React.FC<InfrastructureGapReporterProps> = ({ currentUser }) => {
  const [reports, setReports] = useState<InfrastructureReport[]>(() =>
    farmStore.getInfrastructureReports()
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<InfrastructureReport['category']>('Access Roads & Transport');
  const [village, setVillage] = useState(currentUser.location || 'Choutuppal Rural Hamlet');
  const [district, setDistrict] = useState('Yadadri Bhuvanagiri');
  const [state, setState] = useState('Telangana');
  const [locationDetails, setLocationDetails] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<InfrastructureReport['severity']>('Critical');

  const filtered = reports.filter((r) => {
    const matchCat = selectedCategory === 'All' || r.category === selectedCategory;
    const matchStatus = selectedStatus === 'All' || r.status === selectedStatus;
    return matchCat && matchStatus;
  });

  // Group by category for cluster aggregation view
  const categoryCluster = reports.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleUpvote = (id: string) => {
    farmStore.upvoteInfrastructureReport(id);
    setReports(farmStore.getInfrastructureReports());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: InfrastructureReport = {
      id: `infra_${Date.now()}`,
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      reporterRole: currentUser.role,
      category,
      village,
      district,
      state,
      locationDetails,
      title,
      description,
      severity,
      reportedDate: new Date().toISOString().split('T')[0],
      status: 'Reported',
      supportVotesCount: 1,
    };

    farmStore.submitInfrastructureReport(newReport);
    setReports(farmStore.getInfrastructureReports());
    setShowSubmitModal(false);
    // Reset
    setTitle('');
    setDescription('');
    setLocationDetails('');
  };

  const getStatusBadge = (status: InfrastructureReport['status']) => {
    switch (status) {
      case 'Reported':
        return 'bg-stone-100 text-stone-700 border-stone-200';
      case 'Verified by Community':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Escalated to Panchayat / Admin':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Work In Progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 mb-2">
            <Building2 className="w-3.5 h-3.5 text-amber-600" />
            <span>Civic Escalation & Panchayat Advocacy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Rural Infrastructure Gap Reporter & Aggregator
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Crowdsource and aggregate road, drinking water, and telecom bottlenecks to advocate for public infrastructure funding.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-2 transition shadow-xs self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Report Infrastructure Gap</span>
        </button>
      </div>

      {/* Cluster Aggregation Metric Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.entries(categoryCluster).map(([cat, count]) => (
          <div key={cat} className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-stone-500 truncate block">{cat}</span>
            <div className="text-2xl font-black text-stone-900 mt-1">{count}</div>
            <span className="text-[10px] text-stone-400">Reports Clustered</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl border border-stone-200 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          <span className="font-semibold text-stone-600">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white"
          >
            <option value="All">All Categories</option>
            <option value="Access Roads & Transport">Roads & Transport</option>
            <option value="Telecom & Internet">Telecom & Internet</option>
            <option value="Drinking Water Supply">Drinking Water</option>
            <option value="Waste Management">Waste Management</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-stone-600">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Reported">Reported</option>
            <option value="Verified by Community">Community Verified</option>
            <option value="Escalated to Panchayat / Admin">Escalated</option>
            <option value="Work In Progress">Work In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Reports Feed */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    item.severity === 'Critical' ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-stone-50 text-stone-700 border-stone-200'
                  }`}>
                    {item.severity} Severity
                  </span>
                  <span className="text-[10px] text-stone-400">
                    Reported: {item.reportedDate} by {item.reporterName}
                  </span>
                </div>

                <h3 className="font-bold text-stone-900 text-base">{item.title}</h3>
                <p className="text-xs text-stone-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{item.village}, {item.district} ({item.locationDetails})</span>
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(item.status)}`}>
                  {item.status}
                </span>

                <button
                  onClick={() => handleUpvote(item.id)}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 border border-stone-200 flex items-center gap-1.5 transition"
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>{item.supportVotesCount} Backers</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-3.5 rounded-xl border border-stone-100">
              {item.description}
            </p>

            {item.assignedAuthority && (
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
                <div className="font-bold">Responsible Agency: {item.assignedAuthority}</div>
                <div className="text-[11px] text-amber-900 leading-normal">
                  Status Note: {item.resolutionNotes || 'Under formal review.'}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Submit Report Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900">Report Rural Infrastructure Bottleneck</h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Issue Headline</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Broken Culvert on Farm Access Road"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="Access Roads & Transport">Roads & Transport</option>
                    <option value="Drinking Water Supply">Drinking Water</option>
                    <option value="Sanitation & Drainage">Sanitation & Drainage</option>
                    <option value="Waste Management">Waste Management</option>
                    <option value="Telecom & Internet">Telecom & Internet</option>
                    <option value="Power Supply & Grid">Power Grid</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Severity</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="Critical">Critical (Halts transport/water)</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Minor">Minor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Exact Location / Landmark</label>
                <input
                  type="text"
                  value={locationDetails}
                  onChange={(e) => setLocationDetails(e.target.value)}
                  placeholder="e.g. 500m before East Hamlet canal crossing"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description of Bottleneck</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain how this impacts produce transport, farm tourists, or daily village life..."
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                  required
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-700 hover:bg-amber-600 text-white font-bold"
                >
                  Submit Civic Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
