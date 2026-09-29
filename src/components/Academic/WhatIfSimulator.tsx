import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  GraduationCap,
  AlertCircle,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { SubjectMark } from '../../types';
import { useStudent } from '../../context/StudentContext';
import { runWhatIfSimulation, calculateUniversityAdmissionScore } from '../../utils/scoringEngine';
import { UNIVERSITIES_DATABASE } from '../../data/universitiesData';

export const WhatIfSimulator: React.FC = () => {
  const { profile, updateProfile, setActiveTab, setSelectedProgramme } = useStudent();

  const baseSubjects: SubjectMark[] = profile?.subjects || [];

  // Simulated subjects state
  const [simulatedSubjects, setSimulatedSubjects] = useState<SubjectMark[]>(() => {
    return JSON.parse(JSON.stringify(baseSubjects));
  });

  if (!profile || baseSubjects.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400">Please complete onboarding or add subjects first.</p>
        <button
          onClick={() => setActiveTab('onboarding')}
          className="mt-4 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
        >
          Add Subjects
        </button>
      </div>
    );
  }

  const handleSliderChange = (id: string, newMark: number) => {
    setSimulatedSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, mark: newMark } : s))
    );
  };

  const handleReset = () => {
    setSimulatedSubjects(JSON.parse(JSON.stringify(baseSubjects)));
  };

  const handleSaveAsGoals = () => {
    updateProfile({ subjects: simulatedSubjects });
    alert('Hypothetical marks saved to your active student profile!');
  };

  // Run What If simulation
  const { baseEvaluations, simulatedEvaluations, newlyUnlocked } = runWhatIfSimulation(
    baseSubjects,
    simulatedSubjects
  );

  // Sample standard APS calculation for display
  const uctSample = UNIVERSITIES_DATABASE.find((u) => u.universityName.includes('Cape Town'));
  const witsSample = UNIVERSITIES_DATABASE.find((u) => u.universityName.includes('Witwatersrand'));
  const upSample = UNIVERSITIES_DATABASE.find((u) => u.universityName.includes('Pretoria'));

  const baseUctScore = uctSample ? calculateUniversityAdmissionScore(uctSample, baseSubjects).score : 0;
  const simUctScore = uctSample ? calculateUniversityAdmissionScore(uctSample, simulatedSubjects).score : 0;

  const baseWitsScore = witsSample ? calculateUniversityAdmissionScore(witsSample, baseSubjects).score : 0;
  const simWitsScore = witsSample ? calculateUniversityAdmissionScore(witsSample, simulatedSubjects).score : 0;

  const baseUpScore = upSample ? calculateUniversityAdmissionScore(upSample, baseSubjects).score : 0;
  const simUpScore = upSample ? calculateUniversityAdmissionScore(upSample, simulatedSubjects).score : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-xs font-semibold text-cyan-300 mb-2">
            <Zap className="h-3.5 w-3.5 text-yellow-300" />
            <span>Interactive Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            What If? 👀 Academic Simulator
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            See how improving specific subject marks by 5% or 10% unlocks previously out-of-reach university programmes in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Marks</span>
          </button>
          <button
            onClick={handleSaveAsGoals}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
          >
            Save as Target Goals
          </button>
        </div>
      </div>

      {/* Main Score Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            UCT Faculty Points Score (FPS)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{simUctScore}</span>
            <span className="text-xs text-slate-400">/ 600</span>
            {simUctScore !== baseUctScore && (
              <span className={`text-xs font-bold ${simUctScore > baseUctScore ? 'text-emerald-400' : 'text-red-400'}`}>
                {simUctScore > baseUctScore ? `+${simUctScore - baseUctScore}` : simUctScore - baseUctScore} pts
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 block">Baseline: {baseUctScore} pts</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Wits University APS
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{simWitsScore}</span>
            <span className="text-xs text-slate-400">pts</span>
            {simWitsScore !== baseWitsScore && (
              <span className={`text-xs font-bold ${simWitsScore > baseWitsScore ? 'text-emerald-400' : 'text-red-400'}`}>
                {simWitsScore > baseWitsScore ? `+${simWitsScore - baseWitsScore}` : simWitsScore - baseWitsScore} pts
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 block">Baseline: {baseWitsScore} pts</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            National Standard APS (UP/Maties)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{simUpScore}</span>
            <span className="text-xs text-slate-400">/ 42</span>
            {simUpScore !== baseUpScore && (
              <span className={`text-xs font-bold ${simUpScore > baseUpScore ? 'text-emerald-400' : 'text-red-400'}`}>
                {simUpScore > baseUpScore ? `+${simUpScore - baseUpScore}` : simUpScore - baseUpScore} pts
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 block">Baseline: {baseUpScore} pts</span>
        </div>
      </div>

      {/* NEWLY UNLOCKED PROGRAMMES BANNER */}
      {newlyUnlocked.length > 0 && (
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950/60 via-teal-950/50 to-slate-900 border border-emerald-500/40 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-400 animate-pulse" />
            <h2 className="text-base font-extrabold text-white font-heading">
              Newly Unlocked Degrees with this Simulation! ({newlyUnlocked.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {newlyUnlocked.map((item) => (
              <div
                key={item.programme.id}
                onClick={() => {
                  setSelectedProgramme(item.programme);
                  setActiveTab('universities');
                }}
                className="p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400 cursor-pointer transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                    {item.newStatus === 'on_track' ? '🟢 Now On Track!' : '🟡 Within Reach!'}
                  </span>
                  <span className="text-[10px] text-slate-400">{item.programme.shortName}</span>
                </div>
                <h3 className="text-xs font-bold text-white leading-snug">{item.programme.programmeName}</h3>
                <p className="text-[11px] text-slate-400">Score increased to {item.newScore} {item.programme.admissionSystem}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Sliders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold text-white">Adjust Your Hypothetical Marks</h2>
            <p className="text-xs text-slate-400 mt-0.5">Drag the sliders to see where small efforts yield the biggest rewards.</p>
          </div>

          <div className="space-y-4">
            {simulatedSubjects.map((sub) => {
              const original = baseSubjects.find((b) => b.id === sub.id)?.mark || sub.mark;
              const diff = sub.mark - original;

              return (
                <div key={sub.id} className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate max-w-[200px]">{sub.name}</span>
                    <div className="flex items-center gap-2">
                      {diff !== 0 && (
                        <span className={`text-[11px] font-bold ${diff > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {diff > 0 ? `+${diff}%` : `${diff}%`}
                        </span>
                      )}
                      <span className="text-sm font-extrabold text-white w-10 text-right">{sub.mark}%</span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sub.mark}
                    onChange={(e) => handleSliderChange(sub.id, parseInt(e.target.value, 10))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>0%</span>
                    <span className="text-slate-400">Original: {original}%</span>
                    <span>100%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-Time Impact Breakdown */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-white">Simulation Impact Breakdown</h2>
            <p className="text-xs text-slate-400 mt-0.5">Eligibility status across all 12 tracked degree programmes.</p>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {simulatedEvaluations.map(({ programme, eval: ev }) => {
              const baseStatus = baseEvaluations.find((b) => b.programme.id === programme.id)?.eval.status;
              const statusChanged = baseStatus !== ev.status;

              return (
                <div
                  key={programme.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    statusChanged
                      ? 'bg-indigo-950/40 border-cyan-500/40'
                      : 'bg-slate-800/40 border-slate-800'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white truncate">{programme.programmeName}</span>
                      <span className="text-[10px] text-slate-400 flex-shrink-0">({programme.shortName})</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Score: {ev.calculatedScore} / {programme.minAdmissionScore} {programme.admissionSystem}
                    </span>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    {ev.status === 'on_track' && (
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                        🟢 On track
                      </span>
                    )}
                    {ev.status === 'almost_there' && (
                      <span className="text-[11px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
                        🟡 Almost there
                      </span>
                    )}
                    {ev.status === 'not_met' && (
                      <span className="text-[11px] font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-500/40">
                        🔴 Below minimum
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
