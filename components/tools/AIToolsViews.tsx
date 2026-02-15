import React, { useState } from 'react';
import { ResultBox } from '../ResultBox';
import { ToolType } from '../../types';
import { incrementToolUsage, simulateDirectLinkAd, triggerRedirectAd } from '../../services/adService';
import { generateCaption, generateShortStory, generateStudyQuestions } from '../../services/geminiService';

interface ToolViewProps {
  type: ToolType;
}

export const AIToolView: React.FC<ToolViewProps> = ({ type }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  // AI Inputs
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Fun'); // Also functions as Genre or Level based on tool context
  const [language, setLanguage] = useState('English');
  
  const processAI = async (callFn: () => Promise<string>) => {
    setLoading(true);
    setResult('');
    
    // Simulate Ad viewing time before heavy AI cost
    await simulateDirectLinkAd();
    
    const res = await callFn();
    setResult(res);
    setLoading(false);

    if (incrementToolUsage()) {
      triggerRedirectAd();
    }
  };

  const LanguageSelector = () => (
    <select 
        className="input-field" 
        value={language} 
        onChange={e => setLanguage(e.target.value)}
    >
        <option value="English">English</option>
        <option value="Bangla">Bangla</option>
    </select>
  );

  return (
    <div className="space-y-6">
        {type === ToolType.AI_CAPTION && (
            <div className="space-y-4">
                <input placeholder="Post Topic (e.g., Sunset at beach)" className="input-field" value={topic} onChange={e => setTopic(e.target.value)} />
                <div className="grid grid-cols-2 gap-4">
                    <select className="input-field" value={tone} onChange={e => setTone(e.target.value)}>
                        <option>Fun</option>
                        <option>Professional</option>
                        <option>Sarcastic</option>
                        <option>Inspirational</option>
                    </select>
                    <LanguageSelector />
                </div>
                <button 
                    onClick={() => processAI(() => generateCaption(topic, tone, language))} 
                    disabled={loading || !topic} 
                    className="primary-btn"
                >
                    {loading ? 'AI is thinking...' : 'Launch!'}
                </button>
            </div>
        )}

        {type === ToolType.AI_STORY && (
            <div className="space-y-4">
                <input placeholder="Story Premise (e.g., A robot who loves to cook)" className="input-field" value={topic} onChange={e => setTopic(e.target.value)} />
                <div className="grid grid-cols-2 gap-4">
                    <select className="input-field" value={tone} onChange={e => setTone(e.target.value)}>
                        <option value="Sci-Fi">Sci-Fi</option>
                        <option value="Fantasy">Fantasy</option>
                        <option value="Horror">Horror</option>
                        <option value="Comedy">Comedy</option>
                    </select>
                    <LanguageSelector />
                </div>
                <button 
                    onClick={() => processAI(() => generateShortStory(topic, tone, language))} 
                    disabled={loading || !topic} 
                    className="primary-btn"
                >
                    {loading ? 'Writing Story...' : 'Generate Story'}
                </button>
            </div>
        )}

        {type === ToolType.AI_STUDY && (
            <div className="space-y-4">
                <input placeholder="Subject/Topic (e.g., Photosynthesis)" className="input-field" value={topic} onChange={e => setTopic(e.target.value)} />
                <div className="grid grid-cols-2 gap-4">
                    <select className="input-field" value={tone} onChange={e => setTone(e.target.value)}>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                    <LanguageSelector />
                </div>
                <button 
                    onClick={() => processAI(() => generateStudyQuestions(topic, tone, language))} 
                    disabled={loading || !topic} 
                    className="primary-btn"
                >
                    {loading ? 'Generating Questions...' : 'Create Questions'}
                </button>
            </div>
        )}

        <ResultBox content={result} label="AI Output" />

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