import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Heart,
  Share2,
  AlertCircle,
  Phone,
  Mail,
  ArrowLeft,
  Send,
  Check,
  DollarSign,
  Coffee,
  Info,
} from 'lucide-react';
import { FarmStayListing, UserProfile, TouristEnquiry } from '../../types';
import { farmStore } from '../../services/store';

interface FarmStayDetailsProps {
  farmStayId: string;
  currentUser: UserProfile;
  onBack: () => void;
  onSelectTab: (tab: string) => void;
}

export const FarmStayDetails: React.FC<FarmStayDetailsProps> = ({
  farmStayId,
  currentUser,
  onBack,
  onSelectTab,
}) => {
  const stay = farmStore.getFarmStayById(farmStayId);
  const [activePhoto, setActivePhoto] = useState(0);

  // Enquiry modal state
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [checkInDate, setCheckInDate] = useState('2026-10-24');
  const [checkOutDate, setCheckOutDate] = useState('2026-10-26');
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [dietaryNotes, setDietaryNotes] = useState('Vegetarian traditional country meals');
  const [specialRequests, setSpecialRequests] = useState('');
  const [touristName, setTouristName] = useState(currentUser.name || 'Ananya Sharma');
  const [touristEmail, setTouristEmail] = useState(currentUser.email || 'ananya.travels@farmbridge.ai');
  const [touristPhone, setTouristPhone] = useState(currentUser.phone || '+91 99880 77665');

  const [enquirySubmitted, setEnquirySubmitted] = useState(false);

  if (!stay) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-sm text-stone-600">Property details not found.</p>
        <button onClick={onBack} className="text-xs font-semibold text-emerald-700 underline">
          Back to Search
        </button>
      </div>
    );
  }

  // Calculate nights
  const nights = Math.max(
    1,
    Math.round(
      (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)
    ) || 1
  );
  const totalCost = stay.pricePerNight * nights;

  const toggleActivity = (title: string) => {
    if (selectedActivities.includes(title)) {
      setSelectedActivities(selectedActivities.filter((a) => a !== title));
    } else {
      setSelectedActivities([...selectedActivities, title]);
    }
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const enquiry: TouristEnquiry = {
      id: `enq_${Date.now()}`,
      farmStayId: stay.id,
      farmName: stay.farmName,
      farmerId: stay.farmerId,
      touristName,
      touristEmail,
      touristPhone,
      checkInDate,
      checkOutDate,
      guestsCount,
      preferredActivities: selectedActivities,
      dietaryNotes,
      specialRequests,
      totalEstimatedCost: totalCost,
      status: 'Submitted',
      createdAt: new Date().toISOString(),
    };

    farmStore.submitTouristEnquiry(enquiry);
    farmStore.addAuditLog(
      'SUBMITTED_TOURIST_ENQUIRY',
      stay.farmName,
      `Enquiry submitted by ${touristName} for ${guestsCount} guests from ${checkInDate} to ${checkOutDate}`
    );

    setEnquirySubmitted(true);
    setTimeout(() => {
      setEnquirySubmitted(false);
      setShowEnquiryModal(false);
      onSelectTab('tourist_enquiries');
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1.5 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Farm Stays Search</span>
      </button>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {stay.readinessState}
            </span>
            <span className="text-xs text-stone-500 font-medium">
              {stay.accommodationType} • {stay.farmSizeAcres} Acre Organic Farm
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            {stay.farmName}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 flex items-center gap-1">
            <MapPin className="w-4 h-4 text-stone-400" />
            <span>{stay.location}, {stay.district}, {stay.state}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-black text-stone-900">₹{stay.pricePerNight}</span>
            <span className="text-xs text-stone-500 block">per night (includes farm breakfast)</span>
          </div>

          <button
            onClick={() => setShowEnquiryModal(true)}
            className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md transition"
          >
            Send Host Enquiry
          </button>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="space-y-3">
        <div className="rounded-2xl overflow-hidden h-72 sm:h-96 w-full bg-stone-100">
          <img
            src={stay.photos[activePhoto] || stay.photos[0]}
            alt={stay.farmName}
            className="w-full h-full object-cover"
          />
        </div>

        {stay.photos.length > 1 && (
          <div className="flex items-center gap-3">
            {stay.photos.map((photo, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhoto(idx)}
                className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition ${
                  activePhoto === idx ? 'border-emerald-600 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={photo} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid: Details on Left (8 cols), Enquiry Card on Right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Information (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Overview */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
              About the Farm & Host Family
            </h2>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {stay.description}
            </p>
            <div className="pt-2 text-xs text-stone-600 flex flex-wrap gap-4">
              <span>Host Operator: <strong className="text-stone-800">{stay.operatorName}</strong></span>
              <span>•</span>
              <span>Total Guest Capacity: <strong className="text-stone-800">{stay.maxGuestCapacity} Guests ({stay.totalRooms} Rooms)</strong></span>
            </div>
          </div>

          {/* Authentic Farm Activities */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h2 className="text-base font-bold text-stone-900">
                Participatory Farm Activities & Experiences
              </h2>
              <span className="text-xs text-stone-500">Included or small activity fee</span>
            </div>

            <div className="space-y-3">
              {stay.activities.map((act) => (
                <div
                  key={act.id}
                  className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        {act.category}
                      </span>
                      <h4 className="font-bold text-stone-900 text-sm mt-1">{act.title}</h4>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-stone-900">₹{act.pricePerPerson}</span>
                      <span className="text-[10px] text-stone-500 block">per person • {act.durationMinutes} mins</span>
                    </div>
                  </div>

                  <p className="text-stone-600 leading-relaxed">{act.description}</p>

                  <div className="flex items-center gap-4 text-[11px] text-stone-500 pt-1">
                    <span>Safety: <strong className="text-stone-700">{act.safetyNotes}</strong></span>
                    <span>•</span>
                    <span>Min Age: <strong className="text-stone-700">{act.minAgeYears} years</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verification & Audited Facilities */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
              Audited Health, Hygiene & Safety Facilities
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 block">Potable Drinking Water</span>
                <p className="text-stone-600">{stay.waterSourceDescription}</p>
                <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {stay.drinkingWaterTested ? 'BIS 10500 Compliant Lab Test' : 'Pending Extension Audit'}
                </span>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 block">Sanitation & Bathrooms</span>
                <p className="text-stone-600">{stay.sanitationDetails}</p>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 block">Access & Roads</span>
                <p className="text-stone-600">Road Quality: {stay.roadAccessQuality}</p>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 block">Emergency & First Aid</span>
                <p className="text-stone-600">
                  {stay.hasFirstAid ? 'Equipped first-aid kit with anti-snake venom protocol.' : 'Under re-stocking.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Enquiry Card (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm sticky top-24 space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                Stay Pricing
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-extrabold text-stone-900">₹{stay.pricePerNight}</span>
                <span className="text-xs text-stone-500">/ night</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Check-in</label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border border-stone-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Check-out</label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border border-stone-300 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">Guests</label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(parseInt(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded border border-stone-300 bg-white font-medium"
                >
                  {[...Array(stay.maxGuestCapacity)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                <div className="flex justify-between text-stone-600">
                  <span>₹{stay.pricePerNight} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
                  <span>₹{totalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Traditional Farm Breakfast</span>
                  <span className="text-emerald-700 font-semibold">Included</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-900 text-sm">
                  <span>Estimated Total</span>
                  <span>₹{totalCost.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowEnquiryModal(true)}
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm transition shadow-md"
            >
              Submit Stay Enquiry
            </button>

            <div className="p-3 bg-stone-100 rounded-xl text-[11px] text-stone-500 leading-tight">
              <strong>Transparent Host Confirmation Policy: </strong>
              Submitting an enquiry does not charge you or confirm a booking immediately. The farm host will review your dates and contact you with confirmation.
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Enquiry Modal */}
      {showEnquiryModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  Direct Farm-Stay Enquiry
                </span>
                <h3 className="text-base font-bold text-stone-900 mt-1">
                  Enquiry for {stay.farmName}
                </h3>
              </div>
              <button
                onClick={() => setShowEnquiryModal(false)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEnquirySubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
                <div>
                  <span className="text-stone-500 block mb-0.5">Stay Dates:</span>
                  <strong className="text-stone-800">{checkInDate} to {checkOutDate}</strong>
                </div>
                <div>
                  <span className="text-stone-500 block mb-0.5">Guests & Total:</span>
                  <strong className="text-stone-800">{guestsCount} Guests • ₹{totalCost.toLocaleString()}</strong>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={touristName}
                  onChange={(e) => setTouristName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={touristPhone}
                    onChange={(e) => setTouristPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={touristEmail}
                    onChange={(e) => setTouristEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Preferred Activities to Experience
                </label>
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {stay.activities.map((act) => (
                    <label key={act.id} className="flex items-center gap-2 cursor-pointer p-1.5 bg-stone-50 rounded border border-stone-200">
                      <input
                        type="checkbox"
                        checked={selectedActivities.includes(act.title)}
                        onChange={() => toggleActivity(act.title)}
                        className="rounded text-emerald-700"
                      />
                      <span className="text-stone-800">{act.title} (₹{act.pricePerPerson})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Dietary Preferences / Special Requests
                </label>
                <textarea
                  rows={2}
                  value={dietaryNotes}
                  onChange={(e) => setDietaryNotes(e.target.value)}
                  placeholder="e.g. Traditional vegetarian meal, traveling with 1 senior citizen..."
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-300"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEnquiryModal(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Enquiry to Host</span>
                </button>
              </div>

              {enquirySubmitted && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-center font-bold flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Enquiry saved and routed to property operator! Redirecting to tracking...</span>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
