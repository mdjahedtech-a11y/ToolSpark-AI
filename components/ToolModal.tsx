import React from 'react';
import { X } from 'lucide-react';
import { ToolDef } from '../types';
import { AdBanner } from './AdBanner';
import { motion, AnimatePresence } from 'framer-motion';

interface ToolModalProps {
  tool: ToolDef | null;
  onClose: () => void;
  children: React.ReactNode;
}

export const ToolModal: React.FC<ToolModalProps> = ({ tool, onClose, children }) => {
  if (!tool) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel rounded-3xl shadow-2xl no-scrollbar flex flex-col bg-white dark:bg-slate-900"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
               <div className={`p-2 rounded-lg ${tool.color} bg-opacity-10 dark:bg-opacity-20`}>
                 <tool.icon className={`w-5 h-5 ${tool.color.replace('bg-', 'text-')}`} />
               </div>
               <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                 {tool.title}
               </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 flex-1">
            {children}
          </div>

          {/* Footer Ad */}
          <div className="p-4 bg-gray-50 dark:bg-slate-950/50 border-t border-gray-200 dark:border-gray-800">
            <AdBanner location="footer" />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};