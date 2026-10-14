import React, { useState } from 'react';
import {
  UserCheck,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Sparkles,
  Phone,
  Mail,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { TouristEnquiry, UserProfile } from '../../types';
import { farmStore } from '../../services/store';

interface TouristEnquiriesProps {
  currentUser: UserProfile;
  onSelectTab: (tab: string) => void;
}

export const TouristEnquiries: React.FC<TouristEnquiriesProps> = ({
  currentUser,
  onSelectTab,
}) => {
  // If farmer, show enquiries for their farm; if tourist, show enquiries by their email
  const isFarmer = currentUser.role === 'farmer';
  const [enquiries, setEnquiries] = useState<TouristEnquiry[]>(() => {
    if (isFarmer) {
      return farmStore.getTouristEnquiries({ farmerId: currentUser.id });
    }
    return farmStore.getTouristEnquiries({ touristEmail: currentUser.email });
  });

  const [replyMessage, setReplyMessage] = useState<Record<string, string>>({});

  const handleUpdateStatus = (
    id: string,
    status: TouristEnquiry['status']
  ) => {
    const reply = replyMessage[id];
    farmStore.updateTouristEnquiryStatus(id, status, reply);
    setEnquiries(
      enquiries.map((e) => (e.id === id ? { ...e, status, hostReplyMessage: reply || e.hostReplyMessage } : e))
    );
    farmStore.addAuditLog(
      'UPDATED_ENQUIRY_STATUS',
      `Enquiry #${id.slice(-5)}`,
      `Status transitioned to ${status}`
    );
  };

  const getStatusBadge = (status: TouristEnquiry['status']) => {
    switch (status) {
      case 'Submitted':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Host Reviewing':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Accepted':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Declined':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Completed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="border-b border-stone-200 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 mb-2">
          <UserCheck className="w-3.5 h-3.5 text-sky-600" />
          <span>Transparent Enquiry & Availability Status</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          {isFarmer ? 'Farm-Stay Booking Enquiries (Host View)' : 'My Farm-Stay Enquiries (Tourist View)'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          {isFarmer
            ? 'Review visiting tourist date requests, dietary notes, and confirm availability.'
            : 'Track the status of your enquiries, host responses, and stay confirmation messages.'}
        </p>
      </div>

      {enquiries.length > 0 ? (
        <div className="space-y-4">
          {enquiries.map((enq) => (
            <div
              key={enq.id}
              className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-stone-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5">
                    Enquiry ID: {enq.id} • Submitted: {new Date(enq.createdAt).toLocaleDateString()}
                  </span>
                  <h3 className="text-lg font-bold text-stone-900">{enq.farmName}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600 mt-1">
                    <span>Dates: <strong className="text-stone-800">{enq.checkInDate} to {enq.checkOutDate}</strong></span>
                    <span>•</span>
                    <span>Guests: <strong className="text-stone-800">{enq.guestsCount}</strong></span>
                    <span>•</span>
                    <span>Est. Cost: <strong className="text-emerald-700">₹{enq.totalEstimatedCost.toLocaleString()}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(enq.status)}`}>
                    Status: {enq.status}
                  </span>
                </div>
              </div>

              {/* Guest & Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                <div>
                  <span className="text-stone-500 block mb-0.5">Tourist Contact:</span>
                  <span className="font-semibold text-stone-900 block">{enq.touristName}</span>
                  <span className="text-stone-600 block">{enq.touristPhone} • {enq.touristEmail}</span>
                </div>
                <div>
                  <span className="text-stone-500 block mb-0.5">Special Dietary / Group Notes:</span>
                  <span className="text-stone-700 block italic">"{enq.dietaryNotes || 'None specified'}"</span>
                </div>
              </div>

              {/* Preferred Activities requested */}
              {enq.preferredActivities && enq.preferredActivities.length > 0 && (
                <div className="text-xs">
                  <span className="font-semibold text-stone-700 block mb-1">Requested Farm Experiences:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {enq.preferredActivities.map((act, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-200">
                        {act}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Host Response Message */}
              {enq.hostReplyMessage && (
                <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                  <strong className="block text-emerald-900">Message from Farm Host:</strong>
                  <p>{enq.hostReplyMessage}</p>
                </div>
              )}

              {/* Host Controls (If current user is host) */}
              {isFarmer && enq.status !== 'Completed' && enq.status !== 'Declined' && (
                <div className="pt-3 border-t border-stone-100 space-y-2">
                  <label className="block text-xs font-semibold text-stone-700">Host Reply Message to Tourist</label>
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Delighted to host your family! Organic breakfast included..."
                      value={replyMessage[enq.id] || ''}
                      onChange={(e) => setReplyMessage({ ...replyMessage, [enq.id]: e.target.value })}
                      className="flex-1 text-xs px-3 py-2 rounded-lg border border-stone-300"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateStatus(enq.id, 'Accepted')}
                        className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs"
                      >
                        Accept Enquiry
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(enq.id, 'Declined')}
                        className="px-3.5 py-2 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-2xl border border-stone-200 space-y-3">
          <Calendar className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">No Enquiries Logged</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {isFarmer
              ? 'When visitors enquire about your verified farm stay, details will appear here for your review and acceptance.'
              : 'You have not submitted any farm stay enquiries yet. Explore verified stays to plan your visit.'}
          </p>
          {!isFarmer && (
            <button
              onClick={() => onSelectTab('tourist_search')}
              className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold"
            >
              Explore Farm Stays
            </button>
          )}
        </div>
      )}
    </div>
  );
};
