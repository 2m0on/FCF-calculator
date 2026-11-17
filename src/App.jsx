import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Building2, 
  Coins, 
  Percent,
  CheckSquare
} from 'lucide-react';

const App = () => {
  // Input states initialized with values from the reference image
  const [fcf, setFcf] = useState('127006');
  const [debt, setDebt] = useState('33366');
  const [deductDebt, setDeductDebt] = useState(true);
  const [cash, setCash] = useState('99369');
  const [addCash, setAddCash] = useState(true);
  const [discountRate, setDiscountRate] = useState('7.97');
  const [shares, setShares] = useState('24285');
  
  const [growth1, setGrowth1] = useState('47.4');
  const [growth2, setGrowth2] = useState('1.0');
  const [growth3, setGrowth3] = useState('4.0');

  // State to hold values for calculation, initialized with default values
  const [calcParams, setCalcParams] = useState({
    fcf: '127006',
    debt: '33366',
    deductDebt: true,
    cash: '99369',
    addCash: true,
    discountRate: '7.97',
    shares: '24285',
    growth1: '47.4',
    growth2: '1.0',
    growth3: '4.0'
  });

  const handleCalculate = () => {
    setCalcParams({
      fcf, debt, deductDebt, cash, addCash, discountRate, shares, growth1, growth2, growth3
    });
  };

  // Calculation Logic relies ONLY on calcParams
  const results = useMemo(() => {
    let currentFcf = parseFloat(calcParams.fcf) || 0;
    const r = (parseFloat(calcParams.discountRate) || 0) / 100;
    const g1 = (parseFloat(calcParams.growth1) || 0) / 100;
    const g2 = (parseFloat(calcParams.growth2) || 0) / 100;
    const g3 = (parseFloat(calcParams.growth3) || 0) / 100;
    const parsedShares = parseFloat(calcParams.shares) || 1; 

    let totalPV = 0;
    const projections = [];

    for (let i = 1; i <= 20; i++) {
      if (i <= 5) {
        currentFcf *= (1 + g1);
      } else if (i <= 10) {
        currentFcf *= (1 + g2);
      } else {
        currentFcf *= (1 + g3);
      }

      const pv = currentFcf / Math.pow(1 + r, i);
      totalPV += pv;

      projections.push({ year: i, fcf: currentFcf, pv: pv });
    }

    let intrinsicValue = totalPV;
    if (calcParams.addCash) intrinsicValue += (parseFloat(calcParams.cash) || 0);
    if (calcParams.deductDebt) intrinsicValue -= (parseFloat(calcParams.debt) || 0);

    const intrinsicValuePerShare = intrinsicValue / parsedShares;

    return { projections, totalPV, intrinsicValue, intrinsicValuePerShare };
  }, [calcParams]);

  const formatCurrency = (val) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
  
  const formatNumber = (val) => 
    new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex items-center gap-3 border-b border-slate-200 pb-6">
          <div className="p-3 bg-blue-600 rounded-lg text-white shadow-sm">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">20-Year DCF Calculator</h1>
            <p className="text-slate-500 text-sm">Discounted Cash Flow Intrinsic Value Modeler</p>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Parameters Card */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-slate-400" />
                Company Parameters
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 flex justify-between">
                    <span>Free Cash Flow</span> <span className="text-slate-400 text-xs font-normal">(In millions)</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="number" value={fcf} onChange={(e) => setFcf(e.target.value)} 
                      className="w-full border border-slate-300 rounded-lg py-2 pl-9 pr-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 flex justify-between">
                    <span>Total Debt (excl. Lease Obligations)</span> <span className="text-slate-400 text-xs font-normal">(In millions)</span>
                  </label>
                  <div className="relative mb-2">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="number" value={debt} onChange={(e) => setDebt(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg py-2 pl-9 pr-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer w-max ml-auto">
                    <input type="checkbox" checked={deductDebt} onChange={(e) => setDeductDebt(e.target.checked)} 
                      className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4" />
                    <span className="text-sm text-slate-600 font-medium">Deduct from Intrinsic Value</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 flex justify-between">
                    <span>Cash & ST Investments</span> <span className="text-slate-400 text-xs font-normal">(In millions)</span>
                  </label>
                  <div className="relative mb-2">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="number" value={cash} onChange={(e) => setCash(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg py-2 pl-9 pr-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer w-max ml-auto">
                    <input type="checkbox" checked={addCash} onChange={(e) => setAddCash(e.target.checked)}
                      className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4" />
                    <span className="text-sm text-slate-600 font-medium">Add to Intrinsic Value</span>
                  </label>
                </div>

                <div className="border-t border-slate-100 pt-5 mt-5">
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center justify-between">
                        <span>Discount Rate</span>
                      </label>
                      <div className="relative">
                        <input type="number" step="0.01" value={discountRate} onChange={(e) => setDiscountRate(e.target.value)}
                          className="w-full border border-slate-300 rounded-lg py-2 pl-3 pr-8 text-right text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                        <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center justify-between">
                        <span>Shares Outstanding</span> <span className="text-slate-400 text-xs font-normal">(In millions)</span>
                      </label>
                      <input type="number" value={shares} onChange={(e) => setShares(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg py-2 px-3 text-right text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Growth Rates Card */}
            <div className="bg-slate-100/50 border border-slate-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-slate-500" />
                Growth rate
              </h2>
              <div className="bg-white border border-slate-200 rounded-lg p-1">
                {[
                  { label: 'Growth Rate (Year 1-5)', val: growth1, setter: setGrowth1 },
                  { label: 'Growth Rate (Year 6-10)', val: growth2, setter: setGrowth2 },
                  { label: 'Growth Rate (Year 11-20)', val: growth3, setter: setGrowth3 }
                ].map((g, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-3 ${idx !== 2 ? 'border-b border-slate-100' : ''}`}>
                    <label className="text-sm font-medium text-slate-700">{g.label}</label>
                    <div className="relative w-32">
                      <input type="number" step="0.1" value={g.val} onChange={(e) => g.setter(e.target.value)}
                        className="w-full border border-slate-300 rounded-md py-1.5 pr-8 pl-3 text-slate-900 text-right text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                      <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 text-sm pointer-events-none">%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculate Button */}
            <button 
              onClick={handleCalculate}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-lg py-4 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
            >
              <Calculator className="w-5 h-5" />
              Calculate Intrinsic Value
            </button>

          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Summary Output Card */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <Coins className="w-32 h-32 text-slate-900" />
              </div>
              
              <div className="relative z-10 flex flex-col space-y-6">
                <div>
                  <h3 className="text-slate-500 font-semibold uppercase tracking-wider text-sm mb-2">Intrinsic Value</h3>
                  <div className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight">
                    {formatCurrency(results.intrinsicValuePerShare)}
                  </div>
                  <p className="text-slate-500 mt-2 text-sm">Estimated Fair Value per Share</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">PV of Cash Flows</p>
                    <p className="text-xl font-bold text-slate-800">{formatNumber(results.totalPV)} <span className="text-sm font-normal text-slate-500">M</span></p>
                  </div>
                  <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100/50">
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">Total Intrinsic Value</p>
                    <p className="text-xl font-bold text-blue-700">{formatNumber(results.intrinsicValue)} <span className="text-sm font-normal text-blue-500/80">M</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Projections Table Card */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-auto max-h-[480px]">
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50 rounded-t-xl">
                <h3 className="font-semibold text-slate-800 text-sm">20-Year Cash Flow Projection</h3>
                <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">In millions</span>
              </div>
              
              <div className="overflow-y-auto flex-1 p-0">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-white sticky top-0 border-b border-slate-200 z-10">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Year</th>
                      <th className="px-6 py-3 font-semibold text-right">Projected FCF</th>
                      <th className="px-6 py-3 font-semibold text-right">Present Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {results.projections.map((row) => (
                      <tr key={row.year} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3 text-slate-600 font-medium flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs">
                            {row.year}
                          </span>
                          {row.year <= 5 && <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-sm border border-blue-100">Stage 1</span>}
                          {row.year > 5 && row.year <= 10 && <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-sm border border-amber-100">Stage 2</span>}
                          {row.year > 10 && <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-sm border border-slate-200">Terminal</span>}
                        </td>
                        <td className="px-6 py-3 text-slate-700 text-right tabular-nums">
                          {formatNumber(row.fcf)}
                        </td>
                        <td className="px-6 py-3 text-slate-900 text-right font-medium tabular-nums">
                          {formatNumber(row.pv)}
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
    </div>
  );
};

export default App;