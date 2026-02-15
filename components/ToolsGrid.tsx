import React from 'react';
import { ToolDef } from '../types';
import { motion } from 'framer-motion';

interface ToolsGridProps {
  tools: ToolDef[];
  onSelect: (tool: ToolDef) => void;
}

export const ToolsGrid: React.FC<ToolsGridProps> = ({ tools, onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {tools.map((tool, index) => (
        <motion.div
          key={tool.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onSelect(tool)}
          className="group relative cursor-pointer"
        >
          {/* Glass Card */}
          <div className="h-full glass-panel rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-indigo-400/30 dark:hover:border-indigo-400/30">
            <div className={`inline-flex p-3 rounded-xl mb-4 ${tool.color} bg-opacity-10 dark:bg-opacity-20`}>
              <tool.icon className={`w-6 h-6 ${tool.color.replace('bg-', 'text-')}`} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{tool.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{tool.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};