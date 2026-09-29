import React from 'react';
import {
  X,
  Sparkles,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  GraduationCap,
  Briefcase,
  MapPin,
  Clock,
  ShieldCheck,
  Building2,
  Cpu,
} from 'lucide-react';
import { Career } from '../../types';
import { useStudent } from '../../context/StudentContext';

interface CareerDetailModalProps {
  career: Career;
  onClose: () => void;
  onFindUniversities: (career: Career) => void;
}

export const CareerDetailModal: React.FC<CareerDetailModalProps> = ({
  career,
  onClose,
  onFindUniversities,
}) => {
  const { profile, topMatches, isCareerSaved, toggleSaveCareer, setSelectedCareer } = useStudent();

  const matchData = topMatches.find((m) => m.career.id === career.id);
  const fitScore = matchData?.fitScore || 85;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-8">
        {/* Close and Actions Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{career.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white font-heading">{career.title}</h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                  {fitScore}% Fit Score
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-xs font-semibold text-slate-400">{career.category} · {career.studyDuration}</span>
                {career.requirements?.subjectDependencyLevel && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                    Dependency: {career.requirements.subjectDependencyLevel.toUpperCase()}
                  </span>
                )}
              </div>
              {matchData && (
                <div className="flex flex-wrap gap-1.5 mt-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded-md bg-slate-950 text-cyan-300 border border-slate-800 font-semibold">
                    🧠 Personality {matchData.personalityFit || 80}%
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-950 text-purple-300 border border-slate-800 font-semibold">
                    🎯 Interests {matchData.interestFit || 80}%
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-950 text-emerald-300 border border-slate-800 font-semibold">
                    📚 Academic {matchData.academicAlignment || 70}%
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveCareer(career.id)}
              className={`p-2.5 rounded-xl border transition-colors ${
                isCareerSaved(career.id)
                  ? 'bg-red-950/70 border-red-500/60 text-red-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title="Save to favorites"
            >
              <Bookmark className="h-5 w-5" />
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Overview & Tagline */}
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-900/60">
          <p className="text-sm font-bold text-cyan-300 mb-1">{career.tagline}</p>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{career.description}</p>
        </div>

        {/* EXPLAIN THE MATCH (Requirement 12) */}
        <div className="rounded-2xl bg-slate-800/40 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Why PathPilot matched you with {career.title}</h2>
          </div>

          {matchData?.cautionNotes && matchData.cautionNotes.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-200 text-xs flex items-start gap-2.5">
              <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-amber-300 mb-0.5">Academic Prerequisite Caution:</strong>
                <span>{matchData.cautionNotes.join(' ')}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                Your Strengths for this Pathway
              </span>
              <ul className="space-y-2 text-xs text-slate-300">
                {matchData?.strengths.map((st, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{st}</span>
                  </li>
                )) || (
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Strong alignment with core STEM reasoning and technical problem solving</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Areas to Develop */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                Areas to Develop & Next Steps
              </span>
              <ul className="space-y-2 text-xs text-slate-300">
                {matchData?.areasToDevelop.map((area, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>{area}</span>
                  </li>
                )) || (
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>Focus on consistent exam practice for Pure Mathematics & Physical Sciences</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* SUBJECTS THAT MATTER & BENCHMARKS */}
        <div>
          <h2 className="text-base font-bold text-white mb-3">Subjects That Matter for Admission</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.entries(career.minimumSubjectBenchmarks).map(([subj, benchmark]) => {
              const studentSub = profile?.subjects.find(
                (s) => s.name.toLowerCase().includes(subj.toLowerCase()) || subj.toLowerCase().includes(s.name.toLowerCase())
              );
              const mark = studentSub?.mark;
              const isMet = mark !== undefined && mark >= benchmark;
              const isClose = mark !== undefined && mark < benchmark && mark >= benchmark - 8;

              return (
                <div key={subj} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{subj}</span>
                    <span className="text-[10px] text-slate-400">Benchmark: {benchmark}%</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Your Current Mark:</span>
                    <span className="font-extrabold text-white">
                      {mark !== undefined ? `${mark}%` : 'Not recorded'}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isMet && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                        🟢 Meets target benchmark
                      </span>
                    )}
                    {isClose && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40">
                        🟡 {benchmark - (mark || 0)}% to target
                      </span>
                    )}
                    {!isMet && !isClose && mark !== undefined && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-500/40">
                        🔴 Priority academic focus
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* VISUAL CAREER ROADMAP (Requirement 18) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">Interactive Career Roadmap</h2>
            {career.isRegulated && career.registrationBody && (
              <span className="text-xs font-semibold text-indigo-300 bg-indigo-950/80 px-2.5 py-1 rounded-lg border border-indigo-700/50">
                Regulated: {career.registrationBody}
              </span>
            )}
          </div>

          <div className="relative border-l-2 border-indigo-500/40 ml-4 pl-6 space-y-6">
            {career.roadmap.map((step, idx) => (
              <div key={idx} className="relative group">
                {/* Milestone Node */}
                <div className="absolute -left-[31px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 border-2 border-cyan-400 text-[10px] font-bold text-cyan-300">
                  {idx + 1}
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                      {step.stage}
                    </span>
                    {step.duration && (
                      <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{step.duration}</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white">{step.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>

                  <div className="pt-2 border-t border-slate-700/50">
                    <span className="text-[10px] font-bold text-slate-400 block mb-1">Key Actions:</span>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {step.keyActions.map((act, i) => (
                        <li key={i} className="flex items-center gap-2 text-[11px]">
                          <span className="h-1 w-1 rounded-full bg-cyan-400" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WORK ENVIRONMENTS & FUTURE SKILLS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-cyan-400" />
              <span>Work Environments</span>
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {career.workEnvironments.map((env, i) => (
                <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-700">
                  {env}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-purple-400" />
              <span>Future Skills & Tools</span>
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {career.futureSkills.map((sk, i) => (
                <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-700">
                  {sk}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* DEGREE PATHWAYS & BOTTOM ACTIONS */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 block">Typical Degree Pathways:</span>
            <span className="text-xs font-bold text-white">
              {career.typicalDegrees.join(' · ')}
            </span>
          </div>

          <button
            onClick={() => onFindUniversities(career)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02]"
          >
            <GraduationCap className="h-4 w-4" />
            <span>Find Universities Offering This</span>
          </button>
        </div>
      </div>
    </div>
  );
};
