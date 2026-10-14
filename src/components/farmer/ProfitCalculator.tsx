import React, { useState, useMemo, useCallback } from 'react';
import {
  DollarSign,
  TrendingUp,
  Save,
  Check,
  Info,
  Trash2,
  Plus,
  Printer,
  Sparkles,
} from 'lucide-react';
import { CropProfitEstimate, CropCostItem, UserProfile } from '../../types';
import { farmStore } from '../../services/store';

interface ProfitCalculatorProps {
  currentUser: UserProfile;
}

export const ProfitCalculator: React.FC<ProfitCalculatorProps> = ({ currentUser }) => {
  const [cropName, setCropName] = useState('Red Gram / Pigeon Pea (Kharif)');
  const [cultivatedAreaAcres, setCultivatedAreaAcres] = useState<number>(4);

  // Expense line items
  const [expenses, setExpenses] = useState<CropCostItem[]>([
    { id: '1', name: 'Certified Seed (ICPL-87119)', category: 'Seeds', amount: 4800 },
    { id: '2', name: 'Vermicompost & Bio-nutrients', category: 'Fertilizers & Nutrients', amount: 8000 },
    { id: '3', name: 'Neem Oil & Bio-fungicides', category: 'Crop Protection', amount: 5200 },
    { id: '4', name: 'Ploughing & Land Preparation', category: 'Machinery & Fuel', amount: 9600 },
    { id: '5', name: 'Weeding, Sowing & Farm Labour', category: 'Labour', amount: 16000 },
    { id: '6', name: 'Borewell Power & Drip Maintenance', category: 'Irrigation & Power', amount: 4000 },
    { id: '7', name: 'Harvesting, Threshing & Mandi Freight', category: 'Harvesting & Transport', amount: 10400 },
  ]);

  // Production and Market Expectations
  const [expectedYieldPerAcre, setExpectedYieldPerAcre] = useState<number>(8); // Quintals / acre
  const [expectedSellingPrice, setExpectedSellingPrice] = useState<number>(7800); // ₹ / Quintal (near MSP)

  const [savedCalcs, setSavedCalcs] = useState<CropProfitEstimate[]>(() =>
    farmStore.getProfitCalculations(currentUser.id)
  );
  const [justSaved, setJustSaved] = useState(false);

  // Memoized Arithmetic formulas (Efficiency)
  const totalEstimatedCost = useMemo(() => {
    return expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [expenses]);

  const costPerAcre = useMemo(() => {
    return cultivatedAreaAcres > 0 ? totalEstimatedCost / cultivatedAreaAcres : 0;
  }, [totalEstimatedCost, cultivatedAreaAcres]);

  const totalExpectedYieldQuintals = useMemo(() => {
    return (expectedYieldPerAcre || 0) * (cultivatedAreaAcres || 0);
  }, [expectedYieldPerAcre, cultivatedAreaAcres]);

  const estimatedGrossRevenue = useMemo(() => {
    return totalExpectedYieldQuintals * (expectedSellingPrice || 0);
  }, [totalExpectedYieldQuintals, expectedSellingPrice]);

  const estimatedNetReturn = useMemo(() => {
    return estimatedGrossRevenue - totalEstimatedCost;
  }, [estimatedGrossRevenue, totalEstimatedCost]);

  const breakEvenPricePerQuintal = useMemo(() => {
    return totalExpectedYieldQuintals > 0 ? totalEstimatedCost / totalExpectedYieldQuintals : 0;
  }, [totalEstimatedCost, totalExpectedYieldQuintals]);

  const breakEvenYieldQuintals = useMemo(() => {
    return expectedSellingPrice > 0 ? totalEstimatedCost / expectedSellingPrice : 0;
  }, [totalEstimatedCost, expectedSellingPrice]);

  const roiPct = useMemo(() => {
    return totalEstimatedCost > 0 ? (estimatedNetReturn / totalEstimatedCost) * 100 : 0;
  }, [estimatedNetReturn, totalEstimatedCost]);

  // Sensitivity Analysis Grid (-15%, Baseline, +15%)
  const sensitivityData = useMemo(() => {
    return [
      {
        scenario: 'Pessimistic (-15% Yield/Price)',
        yield: Math.round(totalExpectedYieldQuintals * 0.85),
        price: Math.round(expectedSellingPrice * 0.85),
        netReturn: Math.round(totalExpectedYieldQuintals * 0.85 * expectedSellingPrice * 0.85 - totalEstimatedCost),
      },
      {
        scenario: 'Baseline Estimate',
        yield: Math.round(totalExpectedYieldQuintals),
        price: Math.round(expectedSellingPrice),
        netReturn: Math.round(estimatedNetReturn),
      },
      {
        scenario: 'Optimistic (+15% Yield/Price)',
        yield: Math.round(totalExpectedYieldQuintals * 1.15),
        price: Math.round(expectedSellingPrice * 1.15),
        netReturn: Math.round(totalExpectedYieldQuintals * 1.15 * expectedSellingPrice * 1.15 - totalEstimatedCost),
      },
    ];
  }, [totalExpectedYieldQuintals, expectedSellingPrice, estimatedNetReturn, totalEstimatedCost]);

  const handleAddExpense = useCallback(() => {
    const newItem: CropCostItem = {
      id: String(Date.now()),
      name: 'Additional Field Operation',
      category: 'Labour',
      amount: 2000,
    };
    setExpenses((prev) => [...prev, newItem]);
  }, []);

  const handleUpdateExpense = useCallback((id: string, field: keyof CropCostItem, val: any) => {
    setExpenses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  }, []);

  const handleRemoveExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleSaveCalculation = () => {
    const calc: CropProfitEstimate = {
      id: `calc_${Date.now()}`,
      farmerId: currentUser.id,
      cropName,
      cultivatedAreaAcres,
      expenses,
      totalEstimatedCost,
      costPerAcre,
      expectedYieldQuintalsPerAcre: expectedYieldPerAcre,
      totalExpectedYieldQuintals,
      expectedSellingPricePerQuintal: expectedSellingPrice,
      estimatedGrossRevenue,
      estimatedNetReturn,
      breakEvenPricePerQuintal,
      breakEvenYieldQuintals,
      returnOnInvestmentPct: roiPct,
      savedAt: new Date().toISOString(),
    };

    farmStore.saveProfitCalculation(calc);
    setSavedCalcs([calc, ...savedCalcs]);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" role="region" aria-label="Crop Profit Calculator">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
            <span>Farm Financial & Break-Even Modeling</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Crop Cultivation Expense & Profit Calculator
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Compute itemized input costs, revenue potentials, minimum break-even selling prices, and price sensitivity.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3.5 py-2 rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-medium flex items-center gap-1.5 shadow-2xs self-start focus-visible:outline-2 focus-visible:outline-emerald-600"
          aria-label="Print or export cultivation balance sheet"
        >
          <Printer className="w-3.5 h-3.5 text-stone-500" aria-hidden="true" />
          <span>Print Balance Sheet</span>
        </button>
      </div>

      {/* Honest Arithmetic Disclaimer */}
      <div className="p-3.5 bg-stone-100 rounded-xl border border-stone-200 text-xs text-stone-700 flex items-start gap-3" role="note">
        <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <strong>Economic Model Notice: </strong>
          Calculations are based strictly on farmer-provided expense inputs and historical APMC market trends. FarmBridge AI does not guarantee actual selling prices or agricultural harvests. Use this tool to plan capital requirements and avoid debt traps.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Cost Configuration Form (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Cultivation Inputs & Area
            </h2>
            <div className="flex items-center gap-2">
              <label htmlFor="crop-name-input" className="sr-only">Crop Name</label>
              <input
                id="crop-name-input"
                type="text"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="text-xs font-semibold text-stone-800 border-b border-stone-300 focus:outline-hidden text-right focus-visible:ring-1 focus-visible:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
            <div>
              <label htmlFor="area-input" className="block text-[11px] font-semibold text-stone-600 mb-1">
                Land Area (Acres)
              </label>
              <input
                id="area-input"
                type="number"
                min="0.5"
                step="0.5"
                value={cultivatedAreaAcres}
                onChange={(e) => setCultivatedAreaAcres(parseFloat(e.target.value) || 1)}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-stone-300 font-bold focus-visible:ring-2 focus-visible:ring-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="yield-input" className="block text-[11px] font-semibold text-stone-600 mb-1">
                Yield (Qtl/Acre)
              </label>
              <input
                id="yield-input"
                type="number"
                min="1"
                value={expectedYieldPerAcre}
                onChange={(e) => setExpectedYieldPerAcre(parseFloat(e.target.value) || 1)}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-stone-300 font-bold focus-visible:ring-2 focus-visible:ring-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="price-input" className="block text-[11px] font-semibold text-stone-600 mb-1">
                Price (₹/Qtl)
              </label>
              <input
                id="price-input"
                type="number"
                step="50"
                value={expectedSellingPrice}
                onChange={(e) => setExpectedSellingPrice(parseFloat(e.target.value) || 1)}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-stone-300 font-bold text-emerald-800 focus-visible:ring-2 focus-visible:ring-emerald-500"
              />
            </div>
          </div>

          {/* Itemized Expenses Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Itemized Expenses (₹)
              </h3>
              <button
                type="button"
                onClick={handleAddExpense}
                className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-emerald-600 rounded px-1"
                aria-label="Add new expense line item"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Add Expense Line</span>
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1" role="list">
              {expenses.map((item, index) => (
                <div
                  key={item.id}
                  role="listitem"
                  className="flex items-center gap-2 p-2 rounded-lg border border-stone-200 bg-stone-50/50 text-xs"
                >
                  <label htmlFor={`exp-name-${item.id}`} className="sr-only">Expense description {index + 1}</label>
                  <input
                    id={`exp-name-${item.id}`}
                    type="text"
                    value={item.name}
                    onChange={(e) => handleUpdateExpense(item.id, 'name', e.target.value)}
                    className="flex-1 px-2 py-1 bg-white border border-stone-300 rounded text-xs focus-visible:ring-1 focus-visible:ring-emerald-500"
                  />
                  <label htmlFor={`exp-cat-${item.id}`} className="sr-only">Expense category {index + 1}</label>
                  <select
                    id={`exp-cat-${item.id}`}
                    value={item.category}
                    onChange={(e) => handleUpdateExpense(item.id, 'category', e.target.value as any)}
                    className="w-28 px-1 py-1 bg-white border border-stone-300 rounded text-[11px] focus-visible:ring-1 focus-visible:ring-emerald-500"
                  >
                    <option value="Seeds">Seeds</option>
                    <option value="Fertilizers & Nutrients">Nutrients</option>
                    <option value="Crop Protection">Protection</option>
                    <option value="Labour">Labour</option>
                    <option value="Irrigation & Power">Irrigation</option>
                    <option value="Machinery & Fuel">Machinery</option>
                    <option value="Harvesting & Transport">Harvest/Transit</option>
                  </select>
                  <div className="relative w-24">
                    <span className="absolute left-2 top-1 text-[11px] text-stone-400" aria-hidden="true">₹</span>
                    <label htmlFor={`exp-amt-${item.id}`} className="sr-only">Expense amount {index + 1}</label>
                    <input
                      id={`exp-amt-${item.id}`}
                      type="number"
                      value={item.amount}
                      onChange={(e) => handleUpdateExpense(item.id, 'amount', parseFloat(e.target.value) || 0)}
                      className="w-full pl-5 pr-2 py-1 bg-white border border-stone-300 rounded text-xs font-semibold text-right focus-visible:ring-1 focus-visible:ring-emerald-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveExpense(item.id)}
                    className="p-1 text-stone-400 hover:text-rose-600 rounded focus-visible:outline-2 focus-visible:outline-rose-500"
                    title="Remove item"
                    aria-label={`Remove expense item ${item.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-stone-200 text-xs font-bold text-stone-900" aria-live="polite">
              <span>Total Estimated Expenses:</span>
              <span className="text-base text-stone-900">₹{totalEstimatedCost.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={handleSaveCalculation}
              className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition focus-visible:outline-2 focus-visible:outline-emerald-600"
            >
              <Save className="w-4 h-4" aria-hidden="true" />
              <span>Save Financial Calculation</span>
            </button>
          </div>

          {justSaved && (
            <div className="text-center text-xs text-emerald-700 font-medium flex items-center justify-center gap-1" role="status" aria-live="polite">
              <Check className="w-4 h-4" aria-hidden="true" />
              <span>Saved to farm financial records!</span>
            </div>
          )}
        </div>

        {/* Right: Revenue, Net Return & Sensitivity (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 gap-4" aria-live="polite">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                Gross Revenue ({totalExpectedYieldQuintals} Qtl)
              </span>
              <div className="text-2xl font-black text-stone-900 mt-1">
                ₹{estimatedGrossRevenue.toLocaleString()}
              </div>
              <span className="text-[11px] text-stone-500 mt-0.5 block">
                @ ₹{expectedSellingPrice.toLocaleString()} / Quintal
              </span>
            </div>

            <div className={`p-5 rounded-2xl border shadow-2xs ${estimatedNetReturn >= 0 ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300'}`}>
              <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider block">
                Estimated Net Margin
              </span>
              <div className={`text-2xl font-black mt-1 ${estimatedNetReturn >= 0 ? 'text-emerald-800' : 'text-rose-700'}`}>
                ₹{estimatedNetReturn.toLocaleString()}
              </div>
              <span className={`text-[11px] font-medium mt-0.5 block ${estimatedNetReturn >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                ROI: {roiPct.toFixed(1)}% ({cultivatedAreaAcres} Acres)
              </span>
            </div>
          </div>

          {/* Break-Even Intelligence */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Safety Thresholds (Break-Even Analysis)
            </h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[11px] text-stone-500 block">Break-Even Selling Price</span>
                <span className="text-lg font-bold text-stone-900">
                  ₹{Math.round(breakEvenPricePerQuintal).toLocaleString()} / Qtl
                </span>
                <span className="text-[10px] text-stone-500 block mt-0.5">
                  (Below this price, you make a loss)
                </span>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[11px] text-stone-500 block">Break-Even Harvest Volume</span>
                <span className="text-lg font-bold text-stone-900">
                  {breakEvenYieldQuintals.toFixed(2)} Quintals
                </span>
                <span className="text-[10px] text-stone-500 block mt-0.5">
                  ({(breakEvenYieldQuintals / (cultivatedAreaAcres || 1)).toFixed(2)} Qtl / acre minimum)
                </span>
              </div>
            </div>
          </div>

          {/* Price & Yield Sensitivity Table */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Market & Weather Sensitivity Analysis
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left" aria-label="Sensitivity analysis scenarios">
                <thead className="bg-stone-50 text-stone-700 font-semibold border-b border-stone-200">
                  <tr>
                    <th scope="col" className="p-2">Scenario</th>
                    <th scope="col" className="p-2 text-right">Yield</th>
                    <th scope="col" className="p-2 text-right">Market Price</th>
                    <th scope="col" className="p-2 text-right">Est. Net Profit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {sensitivityData.map((row, idx) => (
                    <tr key={idx} className={idx === 1 ? 'bg-emerald-50/50 font-bold' : ''}>
                      <td className="p-2 text-stone-800">{row.scenario}</td>
                      <td className="p-2 text-right text-stone-600">{row.yield} Qtl</td>
                      <td className="p-2 text-right text-stone-600">₹{row.price.toLocaleString()}</td>
                      <td className={`p-2 text-right ${row.netReturn >= 0 ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}`}>
                        ₹{row.netReturn.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
