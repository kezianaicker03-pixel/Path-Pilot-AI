import React from 'react';
import { X, Scale, Bookmark, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Career } from '../../types';
import { useStudent } from '../../context/StudentContext';

interface CareerCompareModalProps {
  careers: Career[];
  onClose: () => void;
  onSelectCareer: (c: Career) => void;
}

export const CareerCompareModal: React.FC<CareerCompareModalProps> = ({
  careers,
  onClose,
  onSelectCareer,
}) => {
  const { topMatches } = useStudent();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <Scale className="h-6 w-6 text-cyan-400" />
            <div>
              <h2 className="text-xl font-extrabold text-white font-heading">
                Side-by-Side Career Comparison
              </h2>
              <p className="text-xs text-slate-400">
                Compare study requirements, tasks, and typical pathways across selected careers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Side-by-side Table/Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-${careers.length} gap-4`}>
          {careers.map((career) => {
            const match = topMatches.find((m) => m.career.id === career.id);
            const fit = match?.fitScore || 80;

            return (
              <div
                key={career.id}
                className="flex flex-col justify-between rounded-2xl bg-slate-800/60 border border-slate-700/80 p-5 space-y-5"
              >
                <div>
                  {/* Title & Icon */}
                  <div className="text-center pb-4 border-b border-slate-700/60">
                    <span className="text-4xl block mb-2">{career.icon}</span>
                    <h3 className="text-lg font-extrabold text-white">{career.title}</h3>
                    <span className="text-xs font-semibold text-cyan-400 block mt-0.5">{career.category}</span>
                    <div className="mt-2 inline-block px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-bold">
                      {fit}% Fit Score
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="pt-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      What you do
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">{career.tagline}</p>
                  </div>

                  {/* Study Duration */}
                  <div className="pt-3 border-t border-slate-700/50">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Study Duration
                    </span>
                    <span className="text-xs font-bold text-white">{career.studyDuration}</span>
                  </div>

                  {/* Key School Subjects */}
                  <div className="pt-3 border-t border-slate-700/50">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Key High School Subjects
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {career.keySubjects.map((sub, i) => (
                        <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Typical Degrees */}
                  <div className="pt-3 border-t border-slate-700/50">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Typical Undergraduate Degrees
                    </span>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {career.typicalDegrees.map((deg, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px]">
                          <span className="text-cyan-400">·</span>
                          <span>{deg}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Work Environments */}
                  <div className="pt-3 border-t border-slate-700/50">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Work Environments
                    </span>
                    <p className="text-xs text-slate-300">{career.workEnvironments.join(', ')}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onSelectCareer(career);
                  }}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Explore Roadmap</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
