import React from "react";

interface QuickQuestionProps {
  icon: string;
  title: string;
  subtitle: string;
  questions: string[];
  onAsk: (question: string) => void;
}

export const QuickQuestion: React.FC<QuickQuestionProps> = ({ icon, title, subtitle, questions, onAsk }) => {
  return (
    <div className="mb-4" role="region" aria-label={`${title} quick questions`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl" role="img" aria-label={title}>{icon}</span>
        <span className="font-bold text-gray-800 dark:text-gray-100">{title}</span>
        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{subtitle}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {questions.map((q, i) => (
          <button
            key={q}
            onClick={() => onAsk(q)}
            className="relative group bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-left text-sm font-medium shadow hover:shadow-md transition-all duration-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 hover:bg-green-50 dark:hover:bg-green-900/20"
            aria-label={`Ask about ${q}`}
          >
            <span className="z-10 relative">{q}</span>
            <span className="absolute inset-0 bg-green-100 dark:bg-green-900 opacity-0 group-hover:opacity-20 transition-opacity duration-200" />
          </button>
        ))}
      </div>
    </div>
  );
}; 