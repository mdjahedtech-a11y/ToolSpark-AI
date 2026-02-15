import React, { useState, useEffect } from 'react';
import { 
  Calculator, Calendar, CreditCard, GraduationCap, Percent, CircleDollarSign, 
  Type, Lock, QrCode, Dices, 
  Sparkles, BookOpen, PenTool,
  Moon, Sun, Menu
} from 'lucide-react';
import { ToolCategory, ToolDef, ToolType } from './types';
import { ToolsGrid } from './components/ToolsGrid';
import { ToolModal } from './components/ToolModal';
import { AdBanner } from './components/AdBanner';
import { UtilityToolView } from './components/tools/UtilityToolsViews';
import { DailyToolView } from './components/tools/DailyToolsViews';
import { AIToolView } from './components/tools/AIToolsViews';

// Define Tools
const TOOLS: ToolDef[] = [
  // Utility
  { id: ToolType.AGE_CALCULATOR, title: 'Age Calculator', description: 'Calculate your precise age in years, months, and days.', category: ToolCategory.UTILITY, icon: Calendar, color: 'bg-blue-500' },
  { id: ToolType.EMI_CALCULATOR, title: 'EMI Calculator', description: 'Plan your loans with monthly installment calculations.', category: ToolCategory.UTILITY, icon: Calculator, color: 'bg-green-500' },
  { id: ToolType.GPA_CALCULATOR, title: 'GPA Calculator', description: 'Track your academic performance easily.', category: ToolCategory.UTILITY, icon: GraduationCap, color: 'bg-orange-500' },
  { id: ToolType.PERCENTAGE_CALCULATOR, title: 'Percentage Calculator', description: 'Quick percentage calculations for daily use.', category: ToolCategory.UTILITY, icon: Percent, color: 'bg-red-500' },
  { id: ToolType.CURRENCY_CONVERTER, title: 'Currency Converter', description: 'Convert between major world currencies.', category: ToolCategory.UTILITY, icon: CircleDollarSign, color: 'bg-teal-500' },
  
  // Daily
  { id: ToolType.STYLISH_TEXT, title: 'Stylish Text', description: 'Generate fancy text for social media bios.', category: ToolCategory.DAILY, icon: Type, color: 'bg-purple-500' },
  { id: ToolType.PASSWORD_GENERATOR, title: 'Password Generator', description: 'Create strong, secure passwords instantly.', category: ToolCategory.DAILY, icon: Lock, color: 'bg-indigo-500' },
  { id: ToolType.QR_GENERATOR, title: 'QR Code Generator', description: 'Turn links and text into scannable QR codes.', category: ToolCategory.DAILY, icon: QrCode, color: 'bg-pink-500' },
  { id: ToolType.RANDOM_NAME, title: 'Random Picker', description: 'Pick random names or items from a list.', category: ToolCategory.DAILY, icon: Dices, color: 'bg-yellow-500' },

  // AI
  { id: ToolType.AI_CAPTION, title: 'AI Caption Gen', description: 'Viral captions for Instagram & TikTok.', category: ToolCategory.AI, icon: Sparkles, color: 'bg-rose-500' },
  { id: ToolType.AI_STORY, title: 'AI Storyteller', description: 'Generate creative short stories in seconds.', category: ToolCategory.AI, icon: PenTool, color: 'bg-cyan-500' },
  { id: ToolType.AI_STUDY, title: 'Study Buddy', description: 'Generate practice questions for any topic.', category: ToolCategory.AI, icon: BookOpen, color: 'bg-violet-500' },
];

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTool, setSelectedTool] = useState<ToolDef | null>(null);
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'All'>('All');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const filteredTools = activeCategory === 'All' 
    ? TOOLS 
    : TOOLS.filter(t => t.category === activeCategory);

  const renderToolView = (tool: ToolDef) => {
    switch (tool.category) {
      case ToolCategory.UTILITY:
        return <UtilityToolView type={tool.id} />;
      case ToolCategory.DAILY:
        return <DailyToolView type={tool.id} />;
      case ToolCategory.AI:
        return <AIToolView type={tool.id} />;
      default:
        return <div>Tool not implemented yet.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-500">
      
      {/* Navbar */}
      <header className="sticky top-0 z-30 glass-panel border-b-0 border-white/10 shadow-sm bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2 rounded-lg">
               <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              ToolSpark AI
            </span>
          </div>
          
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        
        {/* Header Ad */}
        <AdBanner location="header" />

        {/* Hero Section */}
        <div className="text-center my-12">
           <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
             All Your Tools in <br/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">One Smart Place</span>
           </h1>
           <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
             Access utility calculators, daily helpers, and powerful AI assistants instantly. No downloads, no sign-ups.
           </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {['All', ToolCategory.UTILITY, ToolCategory.DAILY, ToolCategory.AI].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-lg scale-105'
                  : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <ToolsGrid tools={filteredTools} onSelect={setSelectedTool} />

        {/* Bottom Section - More Ad Space or Info */}
        <div className="mt-20 border-t border-gray-200 dark:border-gray-800 pt-10">
            <AdBanner location="inline" />
        </div>

      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>© 2025 ToolSpark AI. Built for efficiency.</p>
      </footer>

      {/* Tool Modal */}
      <ToolModal tool={selectedTool} onClose={() => setSelectedTool(null)}>
        {selectedTool && renderToolView(selectedTool)}
      </ToolModal>
      
    </div>
  );
}