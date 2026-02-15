import React, { useState } from 'react';
import { ResultBox } from '../ResultBox';
import { ToolType } from '../../types';
import { incrementToolUsage, simulateDirectLinkAd, triggerRedirectAd } from '../../services/adService';
import QRCode from 'qrcode';

interface ToolViewProps {
  type: ToolType;
}

export const DailyToolView: React.FC<ToolViewProps> = ({ type }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  
  // Inputs
  const [textInput, setTextInput] = useState('');
  const [pwdLength, setPwdLength] = useState(12);

  const processAction = async (action: () => Promise<string> | string) => {
    setLoading(true);
    setResult('');
    await simulateDirectLinkAd();
    
    const res = await action();
    setResult(res);
    setLoading(false);

    if (incrementToolUsage()) {
      triggerRedirectAd();
    }
  };

  // Logic
  const generateStylishText = () => {
    const chars: Record<string, string> = {
        'a': 'α', 'b': 'в', 'c': '¢', 'd': '∂', 'e': 'є', 'f': 'ƒ', 'g': 'g', 'h': 'h', 'i': 'ι',
        'j': 'נ', 'k': 'к', 'l': 'ℓ', 'm': 'м', 'n': 'η', 'o': 'σ', 'p': 'ρ', 'q': 'q', 'r': 'я',
        's': 'ѕ', 't': 'т', 'u': 'υ', 'v': 'ν', 'w': 'ω', 'x': 'χ', 'y': 'у', 'z': 'z'
    };
    return textInput.toLowerCase().split('').map(c => chars[c] || c).join('');
  };

  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let retVal = "";
    for (let i = 0, n = charset.length; i < pwdLength; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  };

  const generateRandomName = () => {
    const names = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "River", "Sam", "Jamie", "Dakota", "Reese"];
    return names[Math.floor(Math.random() * names.length)];
  };

  const generateQR = async () => {
    if(!textInput) return "Enter text first";
    try {
        const url = await QRCode.toDataURL(textInput);
        return `<img src="${url}" alt="QR Code" class="mx-auto rounded-lg border-4 border-white shadow-md" />`;
    } catch (err) {
        return "Error generating QR";
    }
  };

  return (
    <div className="space-y-6">
        {type === ToolType.STYLISH_TEXT && (
            <div className="space-y-4">
                <textarea 
                    className="input-field min-h-[100px]" 
                    placeholder="Enter your text here..." 
                    value={textInput}
                    onChange={e => setTextInput(e.target.value)}
                />
                <button onClick={() => processAction(generateStylishText)} disabled={loading} className="primary-btn">
                    {loading ? 'Generating...' : 'Make it Stylish'}
                </button>
            </div>
        )}

        {type === ToolType.PASSWORD_GENERATOR && (
             <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Length: {pwdLength}</span>
                    <input type="range" min="6" max="32" value={pwdLength} onChange={e => setPwdLength(parseInt(e.target.value))} className="accent-indigo-500" />
                 </div>
                 <button onClick={() => processAction(generatePassword)} disabled={loading} className="primary-btn">
                    {loading ? 'Generating...' : 'Generate Password'}
                </button>
             </div>
        )}

        {type === ToolType.QR_GENERATOR && (
             <div className="space-y-4">
                 <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Enter URL or Text" 
                    value={textInput}
                    onChange={e => setTextInput(e.target.value)}
                />
                <button onClick={() => processAction(generateQR)} disabled={loading} className="primary-btn">
                    {loading ? 'Generating...' : 'Generate QR Code'}
                </button>
             </div>
        )}

        {type === ToolType.RANDOM_NAME && (
            <div className="text-center">
                 <p className="mb-4 text-gray-600 dark:text-gray-400">Pick a random name from our database.</p>
                 <button onClick={() => processAction(generateRandomName)} disabled={loading} className="primary-btn">
                    {loading ? 'Picking...' : 'Pick Name'}
                </button>
            </div>
        )}

        <ResultBox content={result} isHTML={type === ToolType.QR_GENERATOR} />

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