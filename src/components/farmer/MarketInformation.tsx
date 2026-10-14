import React, { useState } from 'react';
import {
  ShoppingBag,
  TrendingUp,
  Search,
  Filter,
  MapPin,
  Clock,
  ExternalLink,
  Plus,
  Save,
  Check,
  Phone,
  Mail,
  ShieldCheck,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { UserProfile, MarketObservation, ProduceListing, ProduceEnquiry } from '../../types';
import { MARKET_DATA, PRODUCE_LISTINGS } from '../../data/initialData';
import { farmStore } from '../../services/store';

interface MarketInformationProps {
  currentUser: UserProfile;
}

export const MarketInformation: React.FC<MarketInformationProps> = ({ currentUser }) => {
  const [activeSubTab, setActiveSubTab] = useState<'mandi_prices' | 'my_listings' | 'buyer_inquiries'>('mandi_prices');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCommodity, setSelectedCommodity] = useState('All');

  // Listings state
  const [myListings, setMyListings] = useState<ProduceListing[]>(() =>
    farmStore.getProduceListings().filter((p) => p.farmerId === currentUser.id)
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [inquiries, setInquiries] = useState<ProduceEnquiry[]>(() =>
    farmStore.getProduceEnquiries(currentUser.id)
  );

  // New Listing Form state
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState<ProduceListing['category']>('Pulses');
  const [quantityAvailable, setQuantityAvailable] = useState<number>(100);
  const [unit, setUnit] = useState<ProduceListing['unit']>('Kg');
  const [pricePerUnit, setPricePerUnit] = useState<number>(160);
  const [pickupAddress, setPickupAddress] = useState(currentUser.location || 'Choutuppal Farm Gate');
  const [deliveryAvailable, setDeliveryAvailable] = useState(true);
  const [organicCertified, setOrganicCertified] = useState(true);
  const [description, setDescription] = useState('');

  const filteredMandi = MARKET_DATA.filter((m) => {
    const matchesSearch =
      m.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.mandiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesComm = selectedCommodity === 'All' || m.commodity.includes(selectedCommodity);
    return matchesSearch && matchesComm;
  });

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    const newListing: ProduceListing = {
      id: `prod_${Date.now()}`,
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      farmName: 'Surya Agro-Haven & Organics',
      contactPhone: currentUser.phone || '+91 98480 12345',
      productName,
      category,
      quantityAvailable,
      unit,
      pricePerUnit,
      harvestDate: new Date().toISOString().split('T')[0],
      pickupAddress,
      deliveryAvailable,
      organicCertified,
      description,
      status: 'Available',
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
      createdAt: new Date().toISOString(),
    };

    farmStore.saveProduceListing(newListing);
    setMyListings([newListing, ...myListings]);
    setShowAddModal(false);
    // Reset
    setProductName('');
    setDescription('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="border-b border-stone-200 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>Transparent Mandi Intelligence & Farm-Gate Sales</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          Agricultural Market Rates & Produce Marketplace
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Track official APMC mandi price observations across districts and publish your harvested crops directly to visitors and wholesale buyers.
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-stone-200 gap-6">
        <button
          onClick={() => setActiveSubTab('mandi_prices')}
          className={`pb-3 text-sm font-semibold transition border-b-2 -mb-[2px] ${
            activeSubTab === 'mandi_prices'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          APMC Mandi Price Board ({filteredMandi.length})
        </button>
        <button
          onClick={() => setActiveSubTab('my_listings')}
          className={`pb-3 text-sm font-semibold transition border-b-2 -mb-[2px] ${
            activeSubTab === 'my_listings'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          My Listed Produce ({myListings.length})
        </button>
        <button
          onClick={() => setActiveSubTab('buyer_inquiries')}
          className={`pb-3 text-sm font-semibold transition border-b-2 -mb-[2px] ${
            activeSubTab === 'buyer_inquiries'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Buyer Inquiries Received ({inquiries.length})
        </button>
      </div>

      {/* TAB 1: Mandi Prices */}
      {activeSubTab === 'mandi_prices' && (
        <div className="space-y-6">
          {/* Transparency Citation */}
          <div className="p-3.5 bg-stone-100 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong>Verified Observation Feeds: </strong>
              Prices below represent daily observations collected from official e-NAM (National Agriculture Market) and state agricultural marketing boards. Observation date and source are recorded per entry.
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search commodity (e.g. Red Gram, Cotton, Mango) or Mandi..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-stone-300 bg-white"
              />
            </div>

            <select
              value={selectedCommodity}
              onChange={(e) => setSelectedCommodity(e.target.value)}
              className="text-xs px-3 py-2 rounded-lg border border-stone-300 bg-white"
            >
              <option value="All">All Commodities</option>
              <option value="Red Gram">Red Gram (Tur)</option>
              <option value="Cotton">Cotton (Kapus)</option>
              <option value="Groundnut">Groundnut</option>
              <option value="Chilli">Dry Chilli</option>
              <option value="Mango">Mango</option>
              <option value="Millet">Millets</option>
            </select>
          </div>

          {/* Mandi Table */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                  <tr>
                    <th className="p-3.5">Commodity & Variety</th>
                    <th className="p-3.5">Mandi Market</th>
                    <th className="p-3.5">District & State</th>
                    <th className="p-3.5 text-right">Modal Price</th>
                    <th className="p-3.5 text-right">Min - Max Range</th>
                    <th className="p-3.5 text-right">24h Change</th>
                    <th className="p-3.5">Observation Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredMandi.map((row) => (
                    <tr key={row.id} className="hover:bg-stone-50/60 transition">
                      <td className="p-3.5">
                        <span className="font-bold text-stone-900 block">{row.commodity}</span>
                        <span className="text-[11px] text-stone-500">{row.variety}</span>
                      </td>
                      <td className="p-3.5 font-medium text-stone-800">
                        {row.mandiName}
                      </td>
                      <td className="p-3.5 text-stone-600">
                        {row.district}, {row.state}
                      </td>
                      <td className="p-3.5 text-right">
                        <span className="text-sm font-bold text-emerald-800">
                          ₹{row.modalPrice.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-stone-400 block">{row.priceUnit}</span>
                      </td>
                      <td className="p-3.5 text-right text-stone-600 font-medium">
                        ₹{row.minPrice.toLocaleString()} - ₹{row.maxPrice.toLocaleString()}
                      </td>
                      <td className="p-3.5 text-right font-bold">
                        <span className={row.priceChange24h >= 0 ? 'text-emerald-600' : 'text-rose-500'}>
                          {row.priceChange24h > 0 ? `+${row.priceChange24h}%` : `${row.priceChange24h}%`}
                        </span>
                      </td>
                      <td className="p-3.5 text-[11px] text-stone-500">
                        <div className="truncate max-w-[200px]" title={row.dataSource}>
                          {row.dataSource}
                        </div>
                        <span className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {row.observationDate}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Farmer's Own Produce Listings */}
      {activeSubTab === 'my_listings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Published Farm Products for Direct Visitors & Wholesalers
            </h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>List New Produce</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myListings.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
              >
                <div>
                  <img
                    src={prod.imageUrl}
                    alt={prod.productName}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
                        {prod.category}
                      </span>
                      {prod.organicCertified && (
                        <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          Zero Chemical
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-stone-900 text-sm leading-snug">{prod.productName}</h4>
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">{prod.description}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-stone-100 flex items-center justify-between mt-2">
                  <div>
                    <span className="text-base font-bold text-stone-900">₹{prod.pricePerUnit}</span>
                    <span className="text-xs text-stone-500"> / {prod.unit}</span>
                    <span className="block text-[10px] text-stone-400">Available: {prod.quantityAvailable} {prod.unit}</span>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {prod.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Add Produce Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="text-base font-bold text-stone-900">List Farm Produce for Sale</h3>
                  <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-700">✕</button>
                </div>

                <form onSubmit={handleCreateListing} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Product Title</label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g. Unpolished Kandi Pappu (Red Gram Dal)"
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
                        <option value="Pulses">Pulses</option>
                        <option value="Organic Fruits">Organic Fruits</option>
                        <option value="Heritage Grains & Millets">Grains & Millets</option>
                        <option value="Cold-Pressed Oils">Cold-Pressed Oils</option>
                        <option value="Spices & Herbs">Spices & Herbs</option>
                        <option value="Dairy & Honey">Dairy & Honey</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Price (₹)</label>
                      <input
                        type="number"
                        value={pricePerUnit}
                        onChange={(e) => setPricePerUnit(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 font-bold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Stock Quantity</label>
                      <input
                        type="number"
                        value={quantityAvailable}
                        onChange={(e) => setQuantityAvailable(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Unit</label>
                      <select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                      >
                        <option value="Kg">Kg</option>
                        <option value="Quintal">Quintal</option>
                        <option value="Box (10kg)">Box (10kg)</option>
                        <option value="Litre">Litre</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Product Description</label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Naturally dried, stone-milled, no chemical polishing..."
                      className="w-full px-3 py-2 rounded-lg border border-stone-300"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={organicCertified}
                        onChange={(e) => setOrganicCertified(e.target.checked)}
                        className="rounded text-emerald-700"
                      />
                      <span>Natural / Zero-budget organic</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={deliveryAvailable}
                        onChange={(e) => setDeliveryAvailable(e.target.checked)}
                        className="rounded text-emerald-700"
                      />
                      <span>Delivery / Parcel option available</span>
                    </label>
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold"
                    >
                      Publish Listing
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Buyer Inquiries */}
      {activeSubTab === 'buyer_inquiries' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Inquiries from Farm-Stay Guests and Produce Buyers
          </h3>

          {inquiries.length > 0 ? (
            <div className="space-y-3">
              {inquiries.map((inq) => (
                <div key={inq.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">{inq.productName}</h4>
                      <p className="text-xs text-stone-500">
                        From: <strong className="text-stone-800">{inq.buyerName}</strong> • Requested: {inq.requestedQuantity} {inq.unit}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                      {inq.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-100">
                    "{inq.message}"
                  </p>
                  <div className="flex items-center gap-4 text-xs text-stone-500 pt-1">
                    <span>Phone: <strong className="text-stone-800">{inq.buyerPhone}</strong></span>
                    <span>•</span>
                    <span>Email: <strong className="text-stone-800">{inq.buyerEmail}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-stone-200">
              <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="text-xs text-stone-500">No buyer inquiries yet. Inquiries from tourists browsing your farm products will show here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
