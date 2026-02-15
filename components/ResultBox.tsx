import React from 'react';
import { Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResultBoxProps {
  content: string;
  label?: string;
  isHTML?: boolean;
}

export const ResultBox: React.FC<ResultBoxProps> = ({ content, label = "Result", isHTML = false }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!content) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="relative p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-800/50 border border-indigo-100 dark:border-slate-700 shadow-inner">
        {isHTML ? (
            <div dangerouslySetInnerHTML={{ __html: content }} className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200" />
        ) : (
             <pre className="whitespace-pre-wrap font-mono text-sm sm:text-base text-gray-800 dark:text-gray-200 break-words">
                {content}
            </pre>
        )}
      </div>
    </motion.div>
  );
};