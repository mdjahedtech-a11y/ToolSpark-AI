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
  const [stylishResults, setStylishResults] = useState<{name: string, content: string}[]>([]);
  
  // Inputs
  const [textInput, setTextInput] = useState('');
  const [pwdLength, setPwdLength] = useState(12);

  const processAction = async (action: () => Promise<string | void> | string | void) => {
    setLoading(true);
    setResult('');
    setStylishResults([]); // Clear previous results
    
    await simulateDirectLinkAd();
    
    const res = await action();
    if (typeof res === 'string') {
        setResult(res);
    }
    
    setLoading(false);

    if (incrementToolUsage()) {
      triggerRedirectAd();
    }
  };

  // Logic
  const generateStylishText = () => {
    if (!textInput) return;

    const transform = (str: string, map: Record<string, string> | ((c: string) => string)) => {
        return str.split('').map(c => {
            if (typeof map === 'function') return map(c);
            return map[c] || map[c.toLowerCase()] || c;
        }).join('');
    };

    // 1. Bubbles
    const bubbleMap: Record<string, string> = {};
    "abcdefghijklmnopqrstuvwxyz".split('').forEach((c, i) => bubbleMap[c] = String.fromCodePoint(0x24D0 + i));
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').forEach((c, i) => bubbleMap[c] = String.fromCodePoint(0x24B6 + i));
    "0123456789".split('').forEach((c, i) => bubbleMap[c] = String.fromCodePoint(0x2460 + i));

    // 2. Square
    const squareMap: Record<string, string> = {};
    "abcdefghijklmnopqrstuvwxyz".split('').forEach((c, i) => squareMap[c] = String.fromCodePoint(0x1F130 + i)); // Bold Script actually, let's use fixed squares
    // Fixing Square Map manually for safety or using correct ranges
    // A-Z: 1F130..1F149
    // a-z: not in same block directly as filled squares usually, using generic mapping logic
    
    // Let's use specific maps for best compatibility
    const fonts = [
        {
            name: "Bubbles",
            fn: (c: string) => {
                const code = c.charCodeAt(0);
                if (code >= 97 && code <= 122) return String.fromCodePoint(0x24D0 + code - 97);
                if (code >= 65 && code <= 90) return String.fromCodePoint(0x24B6 + code - 65);
                if (code >= 49 && code <= 57) return String.fromCodePoint(0x2460 + code - 49);
                if (code === 48) return '⓪';
                return c;
            }
        },
        {
            name: "Square",
            fn: (c: string) => {
                const code = c.charCodeAt(0);
                if (code >= 97 && code <= 122) return String.fromCodePoint(0x1F130 + code - 97); // actually these are bold script logic in some fonts, but let's use the Square A enclosed
                // Enclosed Alphanumeric Supplement: 1F130 is 🄰 (Square A)
                if (code >= 65 && code <= 90) return String.fromCodePoint(0x1F130 + code - 65);
                return c;
            }
        },
        {
            name: "Double Struck",
            fn: (c: string) => {
                const code = c.charCodeAt(0);
                if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D552 + code - 97);
                if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D538 + code - 65);
                if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7D8 + code - 48);
                return c;
            }
        },
        {
            name: "Script Bold",
            fn: (c: string) => {
                const code = c.charCodeAt(0);
                if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D4EA + code - 97);
                if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D4D0 + code - 65);
                return c;
            }
        },
        {
            name: "Fraktur",
            fn: (c: string) => {
                const code = c.charCodeAt(0);
                if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D51E + code - 97);
                if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D504 + code - 65);
                return c;
            }
        },
        {
            name: "Wide",
            fn: (c: string) => {
                const code = c.charCodeAt(0);
                if (code >= 33 && code <= 126) return String.fromCodePoint(0xFF01 + code - 33);
                return c;
            }
        },
        {
            name: "Small Caps",
            map: {
                a:'ᴀ', b:'ʙ', c:'ᴄ', d:'ᴅ', e:'ᴇ', f:'ꜰ', g:'ɢ', h:'ʜ', i:'ɪ', j:'ᴊ', k:'ᴋ', l:'ʟ', m:'ᴍ',
                n:'ɴ', o:'ᴏ', p:'ᴘ', q:'ǫ', r:'ʀ', s:'ꜱ', t:'ᴛ', u:'ᴜ', v:'ᴠ', w:'ᴡ', x:'x', y:'ʏ', z:'ᴢ'
            }
        },
        {
            name: "Upside Down",
            map: {
                a:'ɐ', b:'q', c:'ɔ', d:'p', e:'ǝ', f:'ɟ', g:'ƃ', h:'ɥ', i:'ᴉ', j:'ɾ', k:'ʞ', l:'l', m:'ɯ',
                n:'u', o:'o', p:'d', q:'b', r:'ɹ', s:'s', t:'ʇ', u:'n', v:'ʌ', w:'ʍ', x:'x', y:'ʎ', z:'z',
                A:'∀', B:'B', C:'Ɔ', D:'D', E:'Ǝ', F:'Ⅎ', G:'פ', H:'H', I:'I', J:'ſ', K:'K', L:'˥', M:'W',
                N:'N', O:'O', P:'d', Q:'Q', R:'R', S:'S', T:'┴', U:'∩', V:'Λ', W:'M', X:'X', Y:'⅄', Z:'Z',
                '1':'Ɩ', '2':'ᄅ', '3':'Ɛ', '4':'h', '5':'ϛ', '6':'9', '7':'L', '8':'8', '9':'6', '0':'0',
                '.':'˙', ',':'\'', '?':'¿', '!':'¡', '"':',,', "'":','
            },
            reverse: true
        },
        {
            name: "Greek Style",
            map: {
                'a': 'α', 'b': 'в', 'c': '¢', 'd': '∂', 'e': 'є', 'f': 'ƒ', 'g': 'g', 'h': 'h', 'i': 'ι',
                'j': 'נ', 'k': 'к', 'l': 'ℓ', 'm': 'м', 'n': 'η', 'o': 'σ', 'p': 'ρ', 'q': 'q', 'r': 'я',
                's': 'ѕ', 't': 'т', 'u': 'υ', 'v': 'ν', 'w': 'ω', 'x': 'χ', 'y': 'у', 'z': 'z'
            }
        },
        {
            name: "Currency",
            map: {
                a:'₳', b:'฿', c:'₵', d:'Đ', e:'Ɇ', f:'₣', g:'₲', h:'Ⱨ', i:'ł', j:'J', k:'₭', l:'Ⱡ', m:'₥',
                n:'₦', o:'Ø', p:'₱', q:'Q', r:'Ɽ', s:'₴', t:'₮', u:'Ʉ', v:'V', w:'₩', x:'Ӿ', y:'¥', z:'Ƶ'
            }
        }
    ];

    const results = fonts.map(style => {
        let content = "";
        if (style.reverse) {
             content = textInput.split('').reverse().map(c => {
                if (style.map) return style.map[c] || style.map[c.toLowerCase()] || c;
                return c;
             }).join('');
        } else if (style.map) {
             content = transform(textInput, style.map as any);
        } else if (style.fn) {
             content = transform(textInput, style.fn);
        }
        return { name: style.name, content };
    });

    setStylishResults(results);
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
                <div className="space-y-4 pt-4">
                    {stylishResults.map((item, idx) => (
                        <ResultBox key={idx} content={item.content} label={item.name} />
                    ))}
                </div>
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
                <ResultBox content={result} />
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
                <ResultBox content={result} isHTML={true} />
             </div>
        )}

        {type === ToolType.RANDOM_NAME && (
            <div className="text-center">
                 <p className="mb-4 text-gray-600 dark:text-gray-400">Pick a random name from our database.</p>
                 <button onClick={() => processAction(generateRandomName)} disabled={loading} className="primary-btn">
                    {loading ? 'Picking...' : 'Pick Name'}
                </button>
                <ResultBox content={result} />
            </div>
        )}

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