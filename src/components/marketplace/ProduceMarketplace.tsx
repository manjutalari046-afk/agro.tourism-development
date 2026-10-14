import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  ShieldCheck,
  Check,
  Phone,
  Mail,
  Send,
  MapPin,
  Tag,
  Sparkles,
} from 'lucide-react';
import { ProduceListing, UserProfile, ProduceEnquiry } from '../../types';
import { farmStore } from '../../services/store';

interface ProduceMarketplaceProps {
  currentUser: UserProfile;
}

export const ProduceMarketplace: React.FC<ProduceMarketplaceProps> = ({ currentUser }) => {
  const listings = farmStore.getProduceListings();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [organicOnly, setOrganicOnly] = useState(false);

  // Enquiry modal
  const [selectedProduct, setSelectedProduct] = useState<ProduceListing | null>(null);
  const [buyerName, setBuyerName] = useState(currentUser.name || 'Ananya Sharma');
  const [buyerPhone, setBuyerPhone] = useState(currentUser.phone || '+91 99880 77665');
  const [buyerEmail, setBuyerEmail] = useState(currentUser.email || 'ananya.travels@farmbridge.ai');
  const [requestedQuantity, setRequestedQuantity] = useState<number>(5);
  const [message, setMessage] = useState('Interested in purchasing directly during our upcoming farm visit.');
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  const filtered = listings.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesOrganic = !organicOnly || item.organicCertified;
    return matchesSearch && matchesCategory && matchesOrganic;
  });

  const handleSubmitEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const enquiry: ProduceEnquiry = {
      id: `penq_${Date.now()}`,
      produceId: selectedProduct.id,
      productName: selectedProduct.productName,
      farmerId: selectedProduct.farmerId,
      buyerName,
      buyerPhone,
      buyerEmail,
      requestedQuantity,
      unit: selectedProduct.unit,
      message,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    farmStore.submitProduceEnquiry(enquiry);
    farmStore.addAuditLog(
      'SUBMITTED_PRODUCE_ENQUIRY',
      selectedProduct.productName,
      `Buyer ${buyerName} enquired for ${requestedQuantity} ${selectedProduct.unit}`
    );

    setEnquirySuccess(true);
    setTimeout(() => {
      setEnquirySuccess(false);
      setSelectedProduct(null);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="border-b border-stone-200 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2">
          <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
          <span>Farm-to-Visitor Direct Commerce</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          Direct Farm Produce Marketplace
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Purchase farm-fresh GI-tagged mangoes, unpolished heirloom pulses, wood-pressed oils, and pure forest honey directly from registered farmers.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search farm products, millets, honey, spices..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-stone-300"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg border border-stone-300 bg-white"
          >
            <option value="All">All Categories</option>
            <option value="Pulses">Unpolished Pulses</option>
            <option value="Cold-Pressed Oils">Cold-Pressed Oils</option>
            <option value="Organic Fruits">Organic Fruits</option>
            <option value="Dairy & Honey">Wild Honey & Dairy</option>
            <option value="Heritage Grains & Millets">Grains & Millets</option>
          </select>

          <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer self-center px-2">
            <input
              type="checkbox"
              checked={organicOnly}
              onChange={(e) => setOrganicOnly(e.target.checked)}
              className="rounded text-emerald-700"
            />
            <span>Zero-Chemical Only</span>
          </label>
        </div>
      </div>

      {/* Produce Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 w-full">
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/90 backdrop-blur-xs text-stone-900 shadow-xs">
                    {item.category}
                  </span>
                </div>
                {item.organicCertified && (
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-700 text-white shadow-xs flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Organic
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-bold text-stone-900 text-sm leading-snug line-clamp-2">
                  {item.productName}
                </h3>
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-2 text-[11px] text-stone-500 space-y-0.5 border-t border-stone-100">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    <span>{item.farmName}</span>
                  </div>
                  <div>Available Stock: <strong>{item.quantityAvailable} {item.unit}</strong></div>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-stone-100 flex items-center justify-between mt-2">
              <div>
                <span className="text-lg font-black text-stone-900">₹{item.pricePerUnit}</span>
                <span className="text-xs text-stone-500"> / {item.unit}</span>
              </div>

              <button
                onClick={() => setSelectedProduct(item)}
                className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs transition"
              >
                Enquire
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Produce Enquiry Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  Farm Produce Direct Enquiry
                </span>
                <h3 className="text-sm font-bold text-stone-900 mt-1">{selectedProduct.productName}</h3>
              </div>
              <button onClick={() => setSelectedProduct(null)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleSubmitEnquiry} className="space-y-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-500 block">Host Farm & Location:</span>
                <strong className="text-stone-800">{selectedProduct.farmName} ({selectedProduct.pickupAddress})</strong>
                <span className="text-stone-500 block mt-1">
                  Price: ₹{selectedProduct.pricePerUnit} per {selectedProduct.unit}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Your Name</label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Quantity ({selectedProduct.unit})</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedProduct.quantityAvailable}
                    value={requestedQuantity}
                    onChange={(e) => setRequestedQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Message or Pickup Preference</label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-700 text-white font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Product Enquiry</span>
                </button>
              </div>

              {enquirySuccess && (
                <div className="p-2.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-center font-bold flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>Enquiry dispatched directly to the farmer!</span>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
