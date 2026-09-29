import React from 'react';
import {
  MapPin,
  Flame,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Target,
  ShieldCheck,
  GraduationCap,
  Award,
} from 'lucide-react';
import { useStudent } from '../../context/StudentContext';
import { CAREERS_DATABASE } from '../../data/careersData';

export const AcademicGamePlanView: React.FC = () => {
  const { profile, topMatches, setSelectedCareer, setActiveTab } = useStudent();

  if (!profile) return null;

  // Identify student's primary career interest
  const primaryMatch = topMatches[0] || { career: CAREERS_DATABASE[0], fitScore: 92, matchReasons: [] };
  const career = primaryMatch.career;

  // Find priority subjects (benchmarks where student has the biggest deficit or highest leverage)
  const prioritySubjects = Object.entries(career.minimumSubjectBenchmarks).map(([subj, benchmark]) => {
    const studentSub = profile.subjects.find(
      (s) => s.name.toLowerCase().includes(subj.toLowerCase()) || subj.toLowerCase().includes(s.name.toLowerCase())
    );
    const mark = studentSub?.mark || 0;
    const diff = mark - benchmark;
    return {
      subject: subj,
      benchmark,
      studentMark: mark,
      diff,
      isHighPriority: diff < 0,
    };
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Action Plan</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-0.5">
          My Academic Game Plan & Milestones
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          A personalized strategy linking your high school marks directly to professional qualifications.
        </p>
      </div>

      {/* Priority Subjects Section */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5">
          <Flame className="h-6 w-6 text-amber-400 animate-pulse" />
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white">
              Highest-Leverage Priority Subjects for {career.title}
            </h2>
            <p className="text-xs text-slate-400">
              Target these subjects to maximize your university options and secure admission benchmarks.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {prioritySubjects.map((item) => (
            <div
              key={item.subject}
              className={`p-4 rounded-2xl border space-y-3 ${
                item.isHighPriority
                  ? 'bg-amber-950/30 border-amber-500/40'
                  : 'bg-slate-800/50 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{item.subject}</span>
                {item.isHighPriority ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                    <Flame className="h-3 w-3" />
                    <span>Priority Area</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                    On Track
                  </span>
                )}
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Your Current Mark:</span>
                  <span className="text-xl font-extrabold text-white">{item.studentMark}%</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Benchmark Goal:</span>
                  <span className="text-xl font-extrabold text-cyan-300">{item.benchmark}%</span>
                </div>
              </div>

              <div className="text-xs text-slate-300 pt-2 border-t border-slate-700/50 leading-relaxed">
                {item.diff < 0 ? (
                  <span className="text-amber-300">
                    △ {Math.abs(item.diff)}% to target. Focus on past exam papers, 1-on-1 tutoring, and foundational calculus/mechanics.
                  </span>
                ) : (
                  <span className="text-emerald-300">
                    ✓ Meets benchmark. Maintain consistency through regular timed mock exams.
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-Year Timeline Roadmap */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-indigo-400" />
            <h2 className="text-base sm:text-lg font-extrabold text-white">
              Full Pathway: From {profile.grade} to Professional Career
            </h2>
          </div>
          {career.registrationBody && (
            <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-indigo-950 text-cyan-300 border border-indigo-700/50">
              Regulated by {career.registrationBody}
            </span>
          )}
        </div>

        <div className="relative border-l-2 border-indigo-500/40 ml-4 pl-6 space-y-8">
          {career.roadmap.map((milestone, idx) => (
            <div key={idx} className="relative group">
              {/* Circle Milestone */}
              <div className="absolute -left-[31px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 border-2 border-cyan-400 text-xs font-bold text-cyan-300">
                {idx + 1}
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    {milestone.stage} {milestone.duration && `· ${milestone.duration}`}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">{milestone.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{milestone.description}</p>

                <div className="pt-3 border-t border-slate-700/50">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">Milestone Action Checklist:</span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {milestone.keyActions.map((act, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
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
    </div>
  );
};
