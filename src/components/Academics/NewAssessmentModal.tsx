import React from 'react';
import { AlertCircle, RotateCcw, X } from 'lucide-react';
import { useStudent } from '../../context/StudentContext';

export const NewAssessmentModal: React.FC = () => {
  const { isNewAssessmentModalOpen, setIsNewAssessmentModalOpen, startNewAssessment } = useStudent();

  if (!isNewAssessmentModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-7 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-950 border border-indigo-500/40 text-cyan-300">
              <RotateCcw className="h-5 w-5" />
            </div>
            <h3 className="text-base font-extrabold text-white font-heading">
              Start a new assessment?
            </h3>
          </div>
          <button
            onClick={() => setIsNewAssessmentModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Start a new assessment? Your current quiz answers and temporary academic inputs will be cleared so you can begin fresh.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsNewAssessmentModalOpen(false)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => startNewAssessment()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/20"
          >
            Start New Assessment
          </button>
        </div>
      </div>
    </div>
  );
};
