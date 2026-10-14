import React, { useState } from 'react';
import {
  Building2,
  Phone,
  MapPin,
  Star,
  ShieldCheck,
  Plus,
  Search,
  Filter,
} from 'lucide-react';
import { CommunityBusiness, UserProfile } from '../../types';
import { farmStore } from '../../services/store';

interface CommunityDirectoryProps {
  currentUser: UserProfile;
}

export const CommunityDirectory: React.FC<CommunityDirectoryProps> = ({ currentUser }) => {
  const [businesses, setBusinesses] = useState<CommunityBusiness[]>(() =>
    farmStore.getCommunityBusinesses()
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Business state
  const [businessName, setBusinessName] = useState('');
  const [bizCategory, setBizCategory] = useState<CommunityBusiness['category']>('Local Guide & Agro-Trek');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState(currentUser.location || 'Choutuppal');
  const [district, setDistrict] = useState('Yadadri Bhuvanagiri');
  const [description, setDescription] = useState('');

  const filtered = businesses.filter((b) => {
    const matchSearch =
      b.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = category === 'All' || b.category === category;
    return matchSearch && matchCat;
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newBiz: CommunityBusiness = {
      id: `cb_${Date.now()}`,
      businessName,
      category: bizCategory,
      contactPerson,
      phone,
      village,
      district,
      description,
      isVerified: true,
      rating: 4.8,
    };

    farmStore.saveCommunityBusiness(newBiz);
    setBusinesses(farmStore.getCommunityBusinesses());
    setShowAddModal(false);
    // Reset
    setBusinessName('');
    setDescription('');
    setContactPerson('');
    setPhone('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2">
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Local Rural Economy & Ancillary Services</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Community Rural Enterprise Directory
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Certified local service providers: 4WD rural transit, handloom weavers, traditional catering guilds, and certified nature guides.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 transition self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Register Local Enterprise</span>
        </button>
      </div>

      {/* Search and filters */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-col sm:flex-row gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search enterprise name, guide, transport, handicrafts..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-300"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 rounded-lg border border-stone-300 bg-white"
        >
          <option value="All">All Categories</option>
          <option value="Local Guide & Agro-Trek">Local Guides & Treks</option>
          <option value="Traditional Catering & Food">Traditional Catering</option>
          <option value="Rural Transport & Jeeps">Rural Transport</option>
          <option value="Village Handicrafts">Village Handicrafts</option>
        </select>
      </div>

      {/* Business Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((b) => (
          <div
            key={b.id}
            className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-xs transition flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {b.category}
                </span>
                {b.isVerified && (
                  <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                )}
              </div>

              <h3 className="font-bold text-stone-900 text-sm mt-2 leading-snug">{b.businessName}</h3>
              <p className="text-xs text-stone-600 line-clamp-3 mt-1.5 leading-relaxed">{b.description}</p>
            </div>

            <div className="pt-3 border-t border-stone-100 text-xs space-y-1">
              <div className="flex items-center justify-between text-stone-600">
                <span>Contact: <strong>{b.contactPerson}</strong></span>
                <span className="flex items-center gap-1 font-bold text-amber-600">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                  {b.rating}
                </span>
              </div>
              <div className="text-stone-500 flex items-center gap-1 text-[11px]">
                <MapPin className="w-3 h-3 text-stone-400" />
                <span>{b.village}, {b.district}</span>
              </div>
              <div className="text-emerald-800 font-bold flex items-center gap-1 pt-1">
                <Phone className="w-3 h-3" />
                <span>{b.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Register Business Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900">Register Community Rural Enterprise</h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleRegister} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Enterprise Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Deccan Handloom Cooperative"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={bizCategory}
                    onChange={(e) => setBizCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="Local Guide & Agro-Trek">Local Guide & Agro-Trek</option>
                    <option value="Traditional Catering & Food">Traditional Catering</option>
                    <option value="Rural Transport & Jeeps">Rural Transport & Jeeps</option>
                    <option value="Village Handicrafts">Village Handicrafts</option>
                    <option value="Equipment Rental">Equipment Rental</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Village & District</label>
                  <input
                    type="text"
                    value={`${village}, ${district}`}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description of Services</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your tourist offerings, vehicle types, or artisan crafts..."
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                  required
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold"
                >
                  Save Enterprise Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
