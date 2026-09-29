import React from 'react';
import { X, Scale, ExternalLink, Bookmark, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import { UniversityProgramme } from '../../types';
import { useStudent } from '../../context/StudentContext';
import { evaluateProgrammeEligibility } from '../../utils/scoringEngine';

interface UniversityCompareModalProps {
  programmes: UniversityProgramme[];
  onClose: () => void;
}

export const UniversityCompareModal: React.FC<UniversityCompareModalProps> = ({
  programmes,
  onClose,
}) => {
  const { profile, addApplication } = useStudent();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <Scale className="h-6 w-6 text-purple-400" />
            <div>
              <h2 className="text-xl font-extrabold text-white font-heading">
                Side-by-Side Degree Comparison
              </h2>
              <p className="text-xs text-slate-400">
                Compare admission scores, required subjects, fees, and deadlines across selected institutions
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

        {/* Matrix Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-${programmes.length} gap-4`}>
          {programmes.map((p) => {
            const evalResult = profile ? evaluateProgrammeEligibility(p, profile.subjects) : null;

            return (
              <div
                key={p.id}
                className="flex flex-col justify-between rounded-2xl bg-slate-800/60 border border-slate-700/80 p-5 space-y-4"
              >
                <div>
                  {/* University & Degree */}
                  <div className="pb-3 border-b border-slate-700/60">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                      {p.shortName} · {p.city}
                    </span>
                    <h3 className="text-base font-extrabold text-white mt-1 leading-snug">
                      {p.programmeName}
                    </h3>
                    <span className="text-xs text-slate-400 block mt-0.5">{p.universityName}</span>
                  </div>

                  {/* Eligibility Status */}
                  {evalResult && (
                    <div className="pt-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Your Eligibility Status
                      </span>
                      {evalResult.status === 'on_track' && (
                        <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          <span>Currently on track</span>
                        </div>
                      )}
                      {evalResult.status === 'almost_there' && (
                        <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5">
                          <AlertCircle className="h-4 w-4 text-amber-400" />
                          <span>Close to target</span>
                        </div>
                      )}
                      {evalResult.status === 'not_met' && (
                        <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center gap-1.5">
                          <AlertCircle className="h-4 w-4 text-red-400" />
                          <span>Requirement not met</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Score & Requirements */}
                  <div className="pt-3 border-t border-slate-700/50 space-y-1.5 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Required Admission Score:</span>
                      <span className="font-extrabold text-white">
                        {p.minAdmissionScore} {p.admissionSystem}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block mt-2">Subject Minimums:</span>
                      <ul className="space-y-1 text-slate-300 mt-1">
                        {p.subjectRequirements.map((r) => (
                          <li key={r.subject} className="flex items-center justify-between text-[11px]">
                            <span>{r.subject}:</span>
                            <span className="font-bold text-white">{r.minPercentage}%</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Dates & Fees */}
                  <div className="pt-3 border-t border-slate-700/50 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Applications close:</span>
                      <span className="text-white font-semibold">{p.applicationCloseDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Indicative fees:</span>
                      <span className="text-white font-semibold">{p.approximateAnnualFee || p.estimatedAnnualFees || 'See Prospectus'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-700/50 flex gap-2">
                  <button
                    onClick={() => {
                      addApplication(p);
                      onClose();
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Track in Planner</span>
                  </button>
                  <a
                    href={p.officialProgrammeUrl || p.officialUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Visit website"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
