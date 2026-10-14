import React, { useState, useMemo } from 'react';
import {
  Compass,
  Search,
  Filter,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { FarmStayListing, UserProfile } from '../../types';
import { farmStore } from '../../services/store';

interface TouristSearchProps {
  currentUser: UserProfile;
  onSelectFarmStay: (farmStayId: string) => void;
}

export const TouristSearch: React.FC<TouristSearchProps> = ({
  currentUser,
  onSelectFarmStay,
}) => {
  const allStays = farmStore.getFarmStays();

  // Search parameters
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('2026-10-24');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [maxBudget, setMaxBudget] = useState<number>(3500);
  const [selectedActivity, setSelectedActivity] = useState<string>('All');
  const [selectedAccommodation, setSelectedAccommodation] = useState<string>('All');
  const [includePendingAudit, setIncludePendingAudit] = useState(false);

  // STAGE 1: Mandatory Eligibility Filtering (Memoized for efficiency)
  const stageOneFiltered = useMemo(() => {
    return allStays.filter((stay) => {
      if (!includePendingAudit) {
        // Standard recommended list ONLY admits properties that passed mandatory verification
        return stay.readinessState === 'Eligible for recommendation';
      }
      return true;
    });
  }, [allStays, includePendingAudit]);

  // STAGE 2: Preference-Based Ranking & Scoring (Memoized for efficiency)
  const rankedStays = useMemo(() => {
    return stageOneFiltered.map((stay) => {
      let score = 100;
      const reasons: string[] = [];

      // Destination match
      if (destination.trim()) {
        const query = destination.toLowerCase().trim();
        const match =
          stay.location.toLowerCase().includes(query) ||
          stay.district.toLowerCase().includes(query) ||
          stay.state.toLowerCase().includes(query);
        if (match) {
          score += 20;
          reasons.push(`Located in your requested region of ${stay.district}`);
        } else {
          score -= 30;
        }
      }

      // Budget match
      if (stay.pricePerNight <= maxBudget) {
        score += 15;
        reasons.push(`Within your budget of ₹${maxBudget}/night (at ₹${stay.pricePerNight}/night)`);
      } else {
        score -= (stay.pricePerNight - maxBudget) / 100;
      }

      // Capacity match
      if (stay.maxGuestCapacity >= guestCount) {
        reasons.push(`Accommodates your group of ${guestCount} guests (capacity up to ${stay.maxGuestCapacity})`);
      } else {
        score -= 40;
      }

      // Activity preference
      if (selectedActivity !== 'All') {
        const hasAct = stay.activities.some(
          (a) => a.category.includes(selectedActivity) || a.title.includes(selectedActivity)
        );
        if (hasAct) {
          score += 25;
          reasons.push(`Offers requested hands-on activity: ${selectedActivity}`);
        } else {
          score -= 15;
        }
      }

      // Accommodation style
      if (selectedAccommodation !== 'All') {
        if (stay.accommodationType === selectedAccommodation) {
          score += 15;
          reasons.push(`Matches preferred ${stay.accommodationType} lodging`);
        }
      }

      // Default safety verified reason
      if (stay.readinessState === 'Eligible for recommendation') {
        reasons.push('Verified laboratory BIS 10500 drinking water & certified sanitation');
      }

      return {
        stay,
        score: Math.max(10, Math.min(100, Math.round(score))),
        matchExplanation: reasons.length > 0 ? reasons.slice(0, 3).join('. ') + '.' : 'Meets foundational regional standards.',
      };
    }).sort((a, b) => b.score - a.score);
  }, [stageOneFiltered, destination, maxBudget, guestCount, selectedActivity, selectedAccommodation]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" role="region" aria-label="Tourist Farm Stay Search and Recommendations">
      {/* Title */}
      <div className="border-b border-stone-200 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 mb-2">
          <Compass className="w-3.5 h-3.5 text-sky-600" aria-hidden="true" />
          <span>Stage 1 Filtered & Stage 2 Ranked</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          Discover Verified Farm-Stays & Rural Retreats
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Every recommended farm stay is audited for certified potable drinking water, clean toilets, and emergency safety.
        </p>
      </div>

      {/* Two-Stage Architecture Notice */}
      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3" role="note">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <strong>Two-Stage Recommendation Protection: </strong>
          Properties failing essential drinking-water laboratory checks or emergency safety standards are automatically filtered out. Properties shown below are actively verified and ranked by your explicit budget, activity, and date preferences.
        </div>
      </div>

      {/* Search Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label htmlFor="search-destination" className="block font-semibold text-stone-700 mb-1">
              Destination / Region
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" aria-hidden="true" />
              <input
                id="search-destination"
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Yadadri, East Godavari, Telangana"
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-stone-300 focus-visible:ring-2 focus-visible:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="search-date" className="block font-semibold text-stone-700 mb-1">
              Travel Date
            </label>
            <div className="relative">
              <Calendar className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" aria-hidden="true" />
              <input
                id="search-date"
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-stone-300 focus-visible:ring-2 focus-visible:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="search-guests" className="block font-semibold text-stone-700 mb-1">
              Guests
            </label>
            <div className="relative">
              <Users className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" aria-hidden="true" />
              <select
                id="search-guests"
                value={guestCount}
                onChange={(e) => setGuestCount(parseInt(e.target.value))}
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-stone-300 bg-white focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <option value={1}>1 Guest (Solo Traveler)</option>
                <option value={2}>2 Guests (Couple)</option>
                <option value={4}>4 Guests (Family / Friends)</option>
                <option value={6}>6+ Guests (Group)</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="budget-slider" className="font-semibold text-stone-700">Max Budget / Night</label>
              <span className="font-bold text-stone-900">₹{maxBudget}</span>
            </div>
            <input
              id="budget-slider"
              type="range"
              min="1200"
              max="5000"
              step="200"
              value={maxBudget}
              onChange={(e) => setMaxBudget(parseInt(e.target.value))}
              className="w-full accent-emerald-700"
              aria-valuemin={1200}
              aria-valuemax={5000}
              aria-valuenow={maxBudget}
              aria-label="Maximum budget per night in Rupees"
            />
          </div>
        </div>

        {/* Secondary filters */}
        <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label htmlFor="select-activity" className="text-stone-600 mr-1.5 font-medium">Activity:</label>
              <select
                id="select-activity"
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-stone-300 bg-white focus-visible:ring-1 focus-visible:ring-emerald-500"
              >
                <option value="All">All Activities</option>
                <option value="Harvesting">Harvesting & Fruit Picking</option>
                <option value="Dairy">Cow Milking & Dairy</option>
                <option value="Cooking">Traditional Cooking</option>
                <option value="Nature Walk">Guided Nature Walk</option>
              </select>
            </div>

            <div>
              <label htmlFor="select-lodging" className="text-stone-600 mr-1.5 font-medium">Lodging:</label>
              <select
                id="select-lodging"
                value={selectedAccommodation}
                onChange={(e) => setSelectedAccommodation(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-stone-300 bg-white focus-visible:ring-1 focus-visible:ring-emerald-500"
              >
                <option value="All">Any Lodging Style</option>
                <option value="Eco Cottage">Eco Cottage</option>
                <option value="Traditional Farmhouse">Traditional Farmhouse</option>
                <option value="Tents & Camping">Tents & Camping</option>
              </select>
            </div>
          </div>

          {/* Toggle unverified stays with clear notice */}
          <label className="flex items-center gap-2 cursor-pointer text-stone-600 text-[11px]">
            <input
              type="checkbox"
              checked={includePendingAudit}
              onChange={(e) => setIncludePendingAudit(e.target.checked)}
              className="rounded text-sky-700 focus-visible:ring-1 focus-visible:ring-sky-500"
            />
            <span>Show unverified / pending audit properties (for testing)</span>
          </label>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between" aria-live="polite">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Verified Agritourism Stays ({rankedStays.length} matching your criteria)
          </h2>
          <span className="text-xs text-stone-500">
            Sorted by preference score & verified readiness
          </span>
        </div>

        {rankedStays.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" role="list">
            {rankedStays.map(({ stay, score, matchExplanation }) => {
              const isEligible = stay.readinessState === 'Eligible for recommendation';

              return (
                <div
                  key={stay.id}
                  role="listitem"
                  className={`bg-white rounded-2xl border overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col justify-between ${
                    isEligible ? 'border-stone-200' : 'border-amber-300 bg-amber-50/10'
                  }`}
                >
                  <div>
                    {/* Image Header with badges */}
                    <div className="relative h-52 w-full">
                      <img
                        src={stay.photos[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'}
                        alt={`Photo of ${stay.farmName}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold shadow-xs flex items-center gap-1 ${
                            isEligible
                              ? 'bg-emerald-600 text-white'
                              : 'bg-amber-600 text-white'
                          }`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                          {stay.readinessState}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-xs font-black text-stone-900 shadow-xs">
                        {score}% Match
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <div>
                        <div className="flex items-center gap-1 text-xs text-stone-500 mb-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" aria-hidden="true" />
                          <span>{stay.location}, {stay.district}</span>
                        </div>
                        <h3 className="font-bold text-stone-900 text-lg leading-tight">{stay.farmName}</h3>
                        <p className="text-xs text-stone-600 line-clamp-2 mt-1.5 leading-relaxed">{stay.tagline}</p>
                      </div>

                      {/* Transparent Match Explanation */}
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed">
                        <strong className="text-stone-900">Why Recommended: </strong>
                        {matchExplanation}
                      </div>

                      {/* Activities Preview */}
                      <div className="flex flex-wrap gap-1.5" aria-label="Available farm activities">
                        {stay.activities.slice(0, 3).map((act) => (
                          <span
                            key={act.id}
                            className="text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-medium"
                          >
                            {act.title}
                          </span>
                        ))}
                      </div>

                      {/* Facilities quick tags */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-stone-500 pt-1">
                        <span>Water: <strong className="text-stone-700">{stay.drinkingWaterTested ? 'BIS 10500 Tested' : 'Pending Lab'}</strong></span>
                        <span>•</span>
                        <span>Lodging: <strong className="text-stone-700">{stay.accommodationType}</strong></span>
                        <span>•</span>
                        <span>Access: <strong className="text-stone-700">{stay.roadAccessQuality}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="p-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-xl font-black text-stone-900">₹{stay.pricePerNight}</span>
                      <span className="text-xs text-stone-500"> / night</span>
                    </div>

                    <button
                      onClick={() => onSelectFarmStay(stay.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 transition focus-visible:outline-2 focus-visible:outline-emerald-600"
                      aria-label={`View full details and enquiry options for ${stay.farmName}`}
                    >
                      <span>View Details & Enquire</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
            <Compass className="w-12 h-12 text-stone-300 mx-auto" aria-hidden="true" />
            <h3 className="text-base font-bold text-stone-800">No Eligible Farm-Stays Found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Try expanding your budget slider or searching a different district. Remember that properties must pass mandatory drinking water and sanitation audits to appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
