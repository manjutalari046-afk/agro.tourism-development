import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  AlertCircle,
  Upload,
  Save,
  Check,
  ShieldCheck,
  Droplet,
  MapPin,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { UserProfile, FarmStayListing, ReadinessState } from '../../types';
import { farmStore } from '../../services/store';

interface FarmStayRegistrationProps {
  currentUser: UserProfile;
  onSelectTab: (tab: string) => void;
}

export const FarmStayRegistration: React.FC<FarmStayRegistrationProps> = ({
  currentUser,
  onSelectTab,
}) => {
  const existingStay = farmStore.getFarmerFarmStay(currentUser.id);

  // Form states
  const [farmName, setFarmName] = useState(existingStay?.farmName || 'Surya Organic Agro-Haven');
  const [tagline, setTagline] = useState(existingStay?.tagline || 'Experience authentic organic paddy & mango farming in peaceful Deccan countryside');
  const [location, setLocation] = useState(existingStay?.location || 'Choutuppal Mandal');
  const [district, setDistrict] = useState(existingStay?.district || 'Yadadri Bhuvanagiri');
  const [state, setState] = useState(existingStay?.state || 'Telangana');
  const [farmType, setFarmType] = useState(existingStay?.farmType || 'Integrated Organic Farm (Paddy, Guava & Dairy)');
  const [farmSizeAcres, setFarmSizeAcres] = useState(existingStay?.farmSizeAcres || 12);
  const [description, setDescription] = useState(existingStay?.description || 'Family-run heritage farm committed to natural zero-budget farming. Guests stay in eco-cottages constructed with clay tiles and bamboo, taste authentic spicy Telangana meals, and participate in daily farming tasks.');
  const [operatorName, setOperatorName] = useState(existingStay?.operatorName || currentUser.name);
  const [contactPhone, setContactPhone] = useState(existingStay?.contactPhone || currentUser.phone || '+91 98480 12345');
  const [contactEmail, setContactEmail] = useState(existingStay?.contactEmail || currentUser.email);

  // Accommodation
  const [accommodationType, setAccommodationType] = useState<FarmStayListing['accommodationType']>(existingStay?.accommodationType || 'Eco Cottage');
  const [totalRooms, setTotalRooms] = useState(existingStay?.totalRooms || 4);
  const [maxGuestCapacity, setMaxGuestCapacity] = useState(existingStay?.maxGuestCapacity || 12);
  const [pricePerNight, setPricePerNight] = useState(existingStay?.pricePerNight || 2400);

  // Facilities & Essentials
  const [drinkingWaterTested, setDrinkingWaterTested] = useState(existingStay?.drinkingWaterTested ?? true);
  const [waterSourceDescription, setWaterSourceDescription] = useState(existingStay?.waterSourceDescription || 'RO purified deep borewell with BIS 10500 certified lab test');
  const [sanitationDetails, setSanitationDetails] = useState(existingStay?.sanitationDetails || '3 attached western toilets + 2 clean outdoor traditional showers with solar heating');
  const [roadAccessQuality, setRoadAccessQuality] = useState<FarmStayListing['roadAccessQuality']>(existingStay?.roadAccessQuality || 'All-weather paved');
  const [hasFirstAid, setHasFirstAid] = useState(existingStay?.hasFirstAid ?? true);
  const [hasEmergencyContact, setHasEmergencyContact] = useState(existingStay?.hasEmergencyContact ?? true);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const stay: FarmStayListing = {
      id: existingStay?.id || `fs_${Date.now()}`,
      farmerId: currentUser.id,
      farmName,
      tagline,
      location,
      district,
      state,
      farmType,
      farmSizeAcres,
      description,
      operatorName,
      contactEmail,
      contactPhone,
      accommodationType,
      totalRooms,
      maxGuestCapacity,
      pricePerNight,
      drinkingWaterTested,
      waterSourceDescription,
      sanitationDetails,
      visitorSafetyMeasures: [
        'First-aid kit with anti-snake venom emergency protocol',
        'Emergency vehicle contact numbers',
        'Fire buckets and extinguishers',
      ],
      wasteManagement: 'On-site vermicomposting and bio-gas digestor; strict zero-plastic policy',
      roadAccessQuality,
      hasFirstAid,
      hasEmergencyContact,
      seasonalOpenMonths: ['Jan', 'Feb', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      photos: existingStay?.photos || [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
      ],
      readinessState: existingStay?.readinessState || 'Awaiting verification',
      criterionEvaluations: existingStay?.criterionEvaluations || {
        crit_legal_1: { criterionId: 'crit_legal_1', satisfied: true, status: 'Satisfied' },
        crit_safety_1: { criterionId: 'crit_safety_1', satisfied: hasFirstAid, status: hasFirstAid ? 'Satisfied' : 'Evidence Missing' },
        crit_water_1: { criterionId: 'crit_water_1', satisfied: drinkingWaterTested, status: drinkingWaterTested ? 'Satisfied' : 'Evidence Missing' },
        crit_sanitation_1: { criterionId: 'crit_sanitation_1', satisfied: true, status: 'Satisfied' },
        crit_access_1: { criterionId: 'crit_access_1', satisfied: roadAccessQuality !== 'Narrow dirt track (4WD suggested)', status: roadAccessQuality !== 'Narrow dirt track (4WD suggested)' ? 'Satisfied' : 'Failed' },
      },
      featured: existingStay?.featured ?? true,
      activities: existingStay?.activities || [
        {
          id: 'act_1',
          title: 'Morning Paddy Transplanting & Weeding',
          category: 'Harvesting & Fruit Picking',
          description: 'Step into the cool paddy mud and learn traditional seedling transplanting.',
          durationMinutes: 90,
          pricePerPerson: 350,
          capacity: 10,
          seasonalMonths: ['Jul', 'Aug', 'Sep', 'Oct'],
          safetyNotes: 'Wear provided boots or bare feet',
          minAgeYears: 6,
        },
      ],
      createdAt: existingStay?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    farmStore.saveFarmStay(stay);
    farmStore.evaluateFarmReadiness(stay.id, true);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 mb-2">
            <Compass className="w-3.5 h-3.5 text-sky-600" />
            <span>Voluntary Agritourism Diversification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Farm-Stay Property Registration
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Register your agricultural property for visitor experiences. Registration initiates the mandatory audit for safety, sanitation, and drinking water.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectTab('farmstay_readiness')}
            className="px-3.5 py-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-xs hover:bg-emerald-100 transition"
          >
            Check Readiness Score →
          </button>
        </div>
      </div>

      {/* Mandatory Regulatory Grounding Alert */}
      <div className="p-4 bg-stone-100 rounded-xl border border-stone-200 text-xs text-stone-700 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <strong>Strict Two-Stage Verification Process: </strong>
          Submitting this registration does <em>not</em> immediately publish your farm stay as "verified" to tourists. An authorized agricultural/tourism officer must review your legal land records, certified drinking water lab report (BIS 10500), sanitation facilities, and first-aid protocol before recommendation.
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
        {/* Section 1: Property Identification */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-2">
            1. Property & Operator Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Farm Name</label>
              <input
                type="text"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Village / Mandal</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">District & State</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300"
                  required
                />
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Farm Enterprise Type</label>
              <input
                type="text"
                value={farmType}
                onChange={(e) => setFarmType(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Total Agricultural Area (Acres)</label>
              <input
                type="number"
                value={farmSizeAcres}
                onChange={(e) => setFarmSizeAcres(parseFloat(e.target.value) || 1)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 font-bold"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">Property & Agricultural Story</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Accommodation & Capacity */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-2">
            2. Accommodation & Guest Capacity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Dwelling Style</label>
              <select
                value={accommodationType}
                onChange={(e) => setAccommodationType(e.target.value as any)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-white"
              >
                <option value="Eco Cottage">Eco Cottage</option>
                <option value="Traditional Farmhouse">Traditional Farmhouse</option>
                <option value="Heritage Hut">Heritage Mud/Bamboo Hut</option>
                <option value="Tents & Camping">Tents & Camping Site</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Guest Rooms</label>
              <input
                type="number"
                min="1"
                value={totalRooms}
                onChange={(e) => setTotalRooms(parseInt(e.target.value) || 1)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Max Capacity (Guests)</label>
              <input
                type="number"
                min="1"
                value={maxGuestCapacity}
                onChange={(e) => setMaxGuestCapacity(parseInt(e.target.value) || 1)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Base Price / Night (₹)</label>
              <input
                type="number"
                min="500"
                step="100"
                value={pricePerNight}
                onChange={(e) => setPricePerNight(parseFloat(e.target.value) || 0)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 font-bold text-emerald-800"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: Mandatory Safety & Sanitation Audits */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-2">
            3. Mandatory Hygiene, Water & Safety Measures
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-900">
                <input
                  type="checkbox"
                  checked={drinkingWaterTested}
                  onChange={(e) => setDrinkingWaterTested(e.target.checked)}
                  className="rounded text-emerald-700"
                />
                <span>Certified Potable Water Test (BIS 10500)</span>
              </label>
              <textarea
                rows={2}
                value={waterSourceDescription}
                onChange={(e) => setWaterSourceDescription(e.target.value)}
                placeholder="Water source and lab test details..."
                className="w-full px-2.5 py-1.5 rounded border border-stone-300 bg-white"
              />
              <span className="text-[11px] text-stone-500 block">
                Lab testing within last 6 months is required before public recommendation.
              </span>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <label className="block font-bold text-stone-900">
                Functional Sanitation & Toilets
              </label>
              <textarea
                rows={3}
                value={sanitationDetails}
                onChange={(e) => setSanitationDetails(e.target.value)}
                placeholder="Describe toilets, running water, and septic safety..."
                className="w-full px-2.5 py-1.5 rounded border border-stone-300 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Emergency Vehicle Road Access
              </label>
              <select
                value={roadAccessQuality}
                onChange={(e) => setRoadAccessQuality(e.target.value as any)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-white"
              >
                <option value="All-weather paved">All-weather paved road</option>
                <option value="Good gravel road">Good gravel road (accessible in rain)</option>
                <option value="Narrow dirt track (4WD suggested)">Narrow dirt track (4WD only - fails emergency audit)</option>
              </select>
            </div>

            <div className="space-y-2 pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasFirstAid}
                  onChange={(e) => setHasFirstAid(e.target.checked)}
                  className="rounded text-emerald-700"
                />
                <span>Stocked First-Aid Kit & Snakebite Protocol on site</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasEmergencyContact}
                  onChange={(e) => setHasEmergencyContact(e.target.checked)}
                  className="rounded text-emerald-700"
                />
                <span>Emergency phone numbers (PHC, Ambulance, Police) displayed</span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-500">
            Current Assessment State: <strong className="text-stone-800">{existingStay?.readinessState || 'Awaiting verification'}</strong>
          </p>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 transition"
            >
              <Save className="w-4 h-4" />
              <span>Save Property Dossier</span>
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 text-xs text-emerald-800 font-semibold flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            <span>Farm-Stay record saved. Click "Check Readiness Score" above to audit outstanding criteria.</span>
          </div>
        )}
      </form>
    </div>
  );
};
