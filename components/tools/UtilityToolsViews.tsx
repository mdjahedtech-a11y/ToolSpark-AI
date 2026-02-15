import React, { useState } from 'react';
import { ResultBox } from '../ResultBox';
import { ToolType } from '../../types';
import { incrementToolUsage, simulateDirectLinkAd, triggerRedirectAd } from '../../services/adService';

interface ToolViewProps {
  type: ToolType;
}

export const UtilityToolView: React.FC<ToolViewProps> = ({ type }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  // States for various calculators
  const [ageDate, setAgeDate] = useState('');
  
  const [emiPrincipal, setEmiPrincipal] = useState('');
  const [emiRate, setEmiRate] = useState('');
  const [emiTenure, setEmiTenure] = useState('');

  const [gpaScores, setGpaScores] = useState([{ credit: '', grade: '' }]);
  
  const [pctVal, setPctVal] = useState('');
  const [pctTotal, setPctTotal] = useState('');

  const [currAmount, setCurrAmount] = useState('');
  const [currFrom, setCurrFrom] = useState('USD');
  const [currTo, setCurrTo] = useState('EUR');

  const processCalculation = async (calcFn: () => string) => {
    setLoading(true);
    setResult('');
    
    // Monetization: Direct Link Simulation
    await simulateDirectLinkAd();

    const res = calcFn();
    setResult(res);
    setLoading(false);

    // Monetization: Usage Threshold Check
    if (incrementToolUsage()) {
      triggerRedirectAd();
    }
  };

  // --- Logic Implementations ---
  
  const calculateAge = () => {
    if (!ageDate) return "Please select a date.";
    const birth = new Date(ageDate);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    return `You are ${years} years, ${months} months, and ${days} days old.`;
  };

  const calculateEMI = () => {
    const P = parseFloat(emiPrincipal);
    const r = parseFloat(emiRate) / 12 / 100;
    const n = parseFloat(emiTenure) * 12; // tenure in years
    if (!P || !r || !n) return "Please fill all fields correctly.";
    
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    return `Monthly EMI: ${emi.toFixed(2)}\nTotal Interest: ${totalInterest.toFixed(2)}\nTotal Payment: ${totalPayment.toFixed(2)}`;
  };

  const calculateGPA = () => {
      // Simple 4.0 scale assumption
      let totalPoints = 0;
      let totalCredits = 0;
      gpaScores.forEach(item => {
          const credit = parseFloat(item.credit);
          const grade = parseFloat(item.grade); // Assuming user enters numeric grade point (4.0, 3.7 etc) or we could map A=4
          if (!isNaN(credit) && !isNaN(grade)) {
              totalPoints += credit * grade;
              totalCredits += credit;
          }
      });
      if (totalCredits === 0) return "Add valid courses.";
      return `GPA: ${(totalPoints / totalCredits).toFixed(2)}`;
  };

  const calculatePercent = () => {
      const v = parseFloat(pctVal);
      const t = parseFloat(pctTotal);
      if(!t) return "Total cannot be zero";
      return `${v} is ${(v/t * 100).toFixed(2)}% of ${t}`;
  };

  const convertCurrency = () => {
      // Mock rates
      const rates: Record<string, number> = {
          'USD': 1, 'EUR': 0.92, 'GBP': 0.79, 'INR': 83.5, 'JPY': 150.1
      };
      const amount = parseFloat(currAmount);
      if(!amount) return "Enter amount";
      
      const inUSD = amount / rates[currFrom];
      const resultVal = inUSD * rates[currTo];
      return `${amount} ${currFrom} = ${resultVal.toFixed(2)} ${currTo}`;
  };

  // --- Renders ---

  return (
    <div className="space-y-6">
      {/* Age Calculator Input */}
      {type === ToolType.AGE_CALCULATOR && (
        <div className="flex flex-col gap-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
          <input 
            type="date" 
            className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={ageDate}
            onChange={(e) => setAgeDate(e.target.value)}
          />
          <button 
             onClick={() => processCalculation(calculateAge)}
             disabled={loading}
             className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold shadow-lg transform active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Calculate Age'}
          </button>
        </div>
      )}

      {/* EMI Calculator */}
      {type === ToolType.EMI_CALCULATOR && (
        <div className="space-y-4">
          <input placeholder="Loan Amount" type="number" className="input-field" value={emiPrincipal} onChange={e => setEmiPrincipal(e.target.value)} />
          <input placeholder="Interest Rate (%)" type="number" className="input-field" value={emiRate} onChange={e => setEmiRate(e.target.value)} />
          <input placeholder="Tenure (Years)" type="number" className="input-field" value={emiTenure} onChange={e => setEmiTenure(e.target.value)} />
           <button 
             onClick={() => processCalculation(calculateEMI)}
             disabled={loading}
             className="primary-btn"
          >
            {loading ? 'Processing...' : 'Calculate EMI'}
          </button>
        </div>
      )}

      {/* GPA Calculator */}
      {type === ToolType.GPA_CALCULATOR && (
          <div className="space-y-4">
              {gpaScores.map((score, idx) => (
                  <div key={idx} className="flex gap-2">
                      <input placeholder="Credits" type="number" className="input-field" value={score.credit} onChange={e => {
                          const newScores = [...gpaScores];
                          newScores[idx].credit = e.target.value;
                          setGpaScores(newScores);
                      }} />
                      <input placeholder="Grade (0-4)" type="number" className="input-field" value={score.grade} onChange={e => {
                          const newScores = [...gpaScores];
                          newScores[idx].grade = e.target.value;
                          setGpaScores(newScores);
                      }} />
                  </div>
              ))}
              <button onClick={() => setGpaScores([...gpaScores, {credit: '', grade: ''}])} className="text-sm text-indigo-500 hover:underline">+ Add Subject</button>
              <button onClick={() => processCalculation(calculateGPA)} disabled={loading} className="primary-btn">{loading ? 'Processing...' : 'Calculate GPA'}</button>
          </div>
      )}

      {/* Percentage Calculator */}
      {type === ToolType.PERCENTAGE_CALCULATOR && (
          <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span>What is</span>
                  <input type="number" className="input-field w-24" value={pctVal} onChange={e => setPctVal(e.target.value)} />
                  <span>% of</span>
                  <input type="number" className="input-field w-24" value={pctTotal} onChange={e => setPctTotal(e.target.value)} />
              </div>
              <button onClick={() => processCalculation(calculatePercent)} disabled={loading} className="primary-btn">{loading ? 'Processing...' : 'Calculate'}</button>
          </div>
      )}

      {/* Currency Converter */}
      {type === ToolType.CURRENCY_CONVERTER && (
          <div className="space-y-4">
              <input type="number" placeholder="Amount" className="input-field" value={currAmount} onChange={e => setCurrAmount(e.target.value)} />
              <div className="flex gap-4">
                  <select className="input-field" value={currFrom} onChange={e => setCurrFrom(e.target.value)}>
                      {['USD', 'EUR', 'GBP', 'INR', 'JPY'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <span className="self-center text-gray-500">to</span>
                  <select className="input-field" value={currTo} onChange={e => setCurrTo(e.target.value)}>
                      {['USD', 'EUR', 'GBP', 'INR', 'JPY'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
              </div>
              <button onClick={() => processCalculation(convertCurrency)} disabled={loading} className="primary-btn">{loading ? 'Processing...' : 'Convert'}</button>
          </div>
      )}

      {/* Fallback for Loan which is same as EMI usually or simpler */}
      {type === ToolType.LOAN_CALCULATOR && (
           <div className="text-center text-gray-500">Use EMI Calculator for detailed Loan breakdown.</div>
      )}

      <ResultBox content={result} />
      
      <style>{`
        .input-field {
            width: 100%;
            padding: 0.75rem;
            border-radius: 0.75rem;
            border: 1px solid #e5e7eb;
            background-color: #ffffff;
            color: #111827;
            outline: none;
            transition: all 0.2s;
        }
        .dark .input-field {
            background-color: #1e293b;
            border-color: #475569;
            color: #ffffff;
        }
        .input-field:focus {
            ring: 2px;
            ring-color: #6366f1;
            border-color: transparent;
        }
        .primary-btn {
            width: 100%;
            padding: 0.75rem 1.5rem;
            border-radius: 0.75rem;
            background: linear-gradient(to right, #4f46e5, #9333ea);
            color: white;
            font-weight: 700;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            transition: all 0.2s;
        }
        .primary-btn:hover {
            background: linear-gradient(to right, #4338ca, #7e22ce);
        }
        .primary-btn:active {
            transform: scale(0.98);
        }
        .primary-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};