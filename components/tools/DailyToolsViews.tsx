import React, { useState } from 'react';
import { ResultBox } from '../ResultBox';
import { ToolType } from '../../types';
import { incrementToolUsage, simulateDirectLinkAd, triggerRedirectAd } from '../../services/adService';
import QRCode from 'qrcode';
import { Download } from 'lucide-react';

interface ToolViewProps {
  type: ToolType;
}

interface FontDef {
    name: string;
    fn?: (c: string) => string;
    map?: Record<string, string>;
    reverse?: boolean;
}

export const DailyToolView: React.FC<ToolViewProps> = ({ type }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [stylishResults, setStylishResults] = useState<{name: string, content: string}[]>([]);
  
  // Inputs
  const [textInput, setTextInput] = useState('');
  const [pwdLength, setPwdLength] = useState(12);

  // QR Code Specific State
  const [qrColor, setQrColor] = useState('#000000');
  const [qrBgColor, setQrBgColor] = useState('#ffffff');
  const [qrLogo, setQrLogo] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  // Updated processAction with relaxed typing to avoid strict union mismatches
  const processAction = async (action: () => Promise<any> | any) => {
    setLoading(true);
    setResult('');
    setStylishResults([]); 
    
    await simulateDirectLinkAd();
    
    try {
        const res = await action();
        if (typeof res === 'string') {
            setResult(res);
        }
    } catch (error) {
        console.error("Action failed", error);
    }
    
    setLoading(false);

    if (incrementToolUsage()) {
      triggerRedirectAd();
    }
  };

  // Logic
  const generateStylishText = (): void => {
    if (!textInput) return;

    const transform = (str: string, map: Record<string, string> | ((c: string) => string)) => {
        return str.split('').map(c => {
            if (typeof map === 'function') return map(c);
            return map[c] || map[c.toLowerCase()] || c;
        }).join('');
    };

    const fonts: FontDef[] = [
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
                if (code >= 97 && code <= 122) return String.fromCodePoint(0x1F130 + code - 97);
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
        if (style.reverse && style.map) {
             const m = style.map;
             content = textInput.split('').reverse().map(c => {
                return m[c] || m[c.toLowerCase()] || c;
             }).join('');
        } else if (style.map) {
             content = transform(textInput, style.map);
        } else if (style.fn) {
             content = transform(textInput, style.fn);
        }
        return { name: style.name, content };
    });

    setStylishResults(results);
  };

  const generatePassword = (): string => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let retVal = "";
    for (let i = 0, n = charset.length; i < pwdLength; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  };

  const generateRandomName = (): string => {
    const names = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "River", "Sam", "Jamie", "Dakota", "Reese"];
    return names[Math.floor(Math.random() * names.length)];
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
              setQrLogo(evt.target?.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  const generateQR = async (): Promise<string> => {
    setQrDataUrl(null);
    if(!textInput) return "Enter text first";
    try {
        const options: any = {
            errorCorrectionLevel: 'H',
            margin: 2,
            width: 400,
            color: {
                dark: qrColor,
                light: qrBgColor
            }
        };

        const qrUrl = await QRCode.toDataURL(textInput, options);
        let finalUrl = qrUrl;

        if (qrLogo) {
            finalUrl = await new Promise<string>((resolve) => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return resolve(qrUrl);

                const qrImg = new Image();
                qrImg.crossOrigin = "Anonymous";
                qrImg.onload = () => {
                    canvas.width = qrImg.width;
                    canvas.height = qrImg.height;
                    
                    // Draw QR
                    ctx.drawImage(qrImg, 0, 0);

                    const logoImg = new Image();
                    logoImg.crossOrigin = "Anonymous";
                    logoImg.onload = () => {
                        const logoSize = canvas.width * 0.2; // 20% size
                        const x = (canvas.width - logoSize) / 2;
                        const y = (canvas.height - logoSize) / 2;

                        ctx.drawImage(logoImg, x, y, logoSize, logoSize);
                        
                        resolve(canvas.toDataURL());
                    };
                    logoImg.onerror = () => {
                         resolve(qrUrl);
                    }
                    logoImg.src = qrLogo;
                };
                qrImg.src = qrUrl;
            });
        }
        
        setQrDataUrl(finalUrl);
        return `<img src="${finalUrl}" alt="QR Code" class="mx-auto rounded-lg border-4 border-white shadow-md" />`;
    } catch (err) {
        console.error(err);
        return "Error generating QR";
    }
  };

  const downloadQR = () => {
      if (!qrDataUrl) return;
      const link = document.createElement('a');
      link.href = qrDataUrl;
      link.download = `qrcode-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">QR Color</label>
                        <input type="color" value={qrColor} onChange={e => setQrColor(e.target.value)} className="h-10 w-full rounded cursor-pointer border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 p-1" />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Background</label>
                        <input type="color" value={qrBgColor} onChange={e => setQrBgColor(e.target.value)} className="h-10 w-full rounded cursor-pointer border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 p-1" />
                    </div>
                </div>

                <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Add Logo (Optional)</label>
                    <div className="flex items-center gap-4">
                        <label className="flex-1 cursor-pointer">
                            <span className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Choose Image...</span>
                            </span>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                        {qrLogo && (
                            <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 p-2 rounded-lg">
                                <img src={qrLogo} className="w-8 h-8 object-cover rounded" alt="Preview" />
                                <button onClick={() => setQrLogo(null)} className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
                            </div>
                        )}
                    </div>
                </div>

                <button onClick={() => processAction(generateQR)} disabled={loading} className="primary-btn">
                    {loading ? 'Generating...' : 'Generate Custom QR Code'}
                </button>
                <ResultBox content={result} isHTML={true} />
                
                {qrDataUrl && !loading && (
                    <button onClick={downloadQR} className="w-full py-3 px-6 mt-2 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2">
                        <Download className="w-5 h-5" />
                        Download QR Code
                    </button>
                )}
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