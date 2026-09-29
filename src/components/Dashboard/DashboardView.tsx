import React from 'react';
import {
  Compass,
  GraduationCap,
  Sparkles,
  Bookmark,
  Calendar,
  Sliders,
  Award,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Share2,
  HelpCircle,
  MapPin,
  Edit3,
  RotateCcw,
  FileText,
} from 'lucide-react';
import { useStudent } from '../../context/StudentContext';
import { UNIVERSITIES_DATABASE } from '../../data/universitiesData';
import { evaluateProgrammeEligibility } from '../../utils/scoringEngine';

interface DashboardViewProps {
  onOpenShareModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenShareModal }) => {
  const {
    profile,
    topMatches,
    alternativeMatches,
    setActiveTab,
    setSelectedCareer,
    setSelectedProgramme,
    applications,
    setIsAskPilotOpen,
    setInitialPilotQuestion,
    toggleSaveCareer,
    isCareerSaved,
    setIsEditAcademicModalOpen,
    setIsNewAssessmentModalOpen,
    loadTestProfile,
  } = useStudent();

  if (!profile) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">No profile loaded.</p>
        <button
          onClick={() => setActiveTab('onboarding')}
          className="mt-4 px-6 py-2 rounded-xl bg-indigo-600 text-white font-bold text-sm"
        >
          Start Onboarding
        </button>
      </div>
    );
  }

  // Profile completion calculation
  let completion = 40;
  if (profile.subjects && profile.subjects.length >= 5) completion += 20;
  if (profile.interests && profile.interests.length >= 3) completion += 20;
  if (profile.savedCareerIds && profile.savedCareerIds.length > 0) completion += 10;
  if (applications && applications.length > 0) completion += 10;

  // Watched universities
  const watchedUniversities = UNIVERSITIES_DATABASE.filter((u) =>
    profile.savedUniversityIds?.includes(u.id)
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Test Profiles Switcher Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:px-4 sm:py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="font-semibold text-slate-300">Test Profiles:</span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">Try different students with distinct personalities & subjects:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { key: 'studentA', label: '🎨 Student A (Creative)' },
            { key: 'studentB', label: '🧠 Student B (Social)' },
            { key: 'studentC', label: '⚖️ Student C (Enterprising)' },
            { key: 'studentD', label: '🏗️ Student D (Practical)' },
            { key: 'studentE', label: '🔬 Student E (Investigative)' },
            { key: 'studentF', label: '📊 Student F (Organised)' },
            { key: 'medicalPhysicsEdgeCase', label: '⚠️ Edge Case (No Physics)' },
          ].map((tp) => (
            <button
              key={tp.key}
              type="button"
              onClick={() => loadTestProfile(tp.key)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-900/60 hover:text-cyan-300 text-slate-300 border border-slate-700 hover:border-cyan-500/40 font-medium transition-all"
            >
              {tp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/50 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 backdrop-blur-md">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-xs font-semibold text-cyan-300 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
              <span>{profile.careerStyle?.title || 'The Curious Problem Solver'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
              Ready to keep building your future? 🚀
            </h1>

            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Based on your {profile.grade} {profile.curriculum} profile in {profile.region || 'your region'}, we’ve generated your personalized career fits, verified university requirements, and action roadmap.
            </p>

            {/* Career Style Traits */}
            {profile.careerStyle?.traits && (
              <div className="flex flex-wrap gap-2 mt-4">
                {profile.careerStyle.traits.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-200 border border-slate-700"
                  >
                    ✓ {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right Action & Progress Gauge */}
          <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
            <div className="bg-slate-950/70 border border-slate-800 px-4 py-3 rounded-2xl flex items-center gap-3">
              <div className="relative flex items-center justify-center h-12 w-12 rounded-full bg-slate-800">
                <span className="text-xs font-extrabold text-cyan-300">{completion}%</span>
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Profile Progress</span>
                <span className="text-[11px] text-slate-400">
                  {completion === 100 ? 'All milestones active!' : 'Keep exploring paths'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTab('report')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-95 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 hover:scale-[1.02]"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>View Full Report ✨</span>
              </button>

              <button
                onClick={() => setIsEditAcademicModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-cyan-500/30 transition-all shadow-sm"
                title="Edit saved subjects and marks"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit Academic Profile</span>
              </button>

              <button
                onClick={() => setIsNewAssessmentModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
                title="Start a fresh discovery assessment"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Start New Assessment</span>
              </button>

              <button
                onClick={onOpenShareModal}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveTab('careers')}
          className="p-4 rounded-2xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 text-left transition-all group"
        >
          <TrendingUp className="h-5 w-5 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-white block">Explore Careers</span>
          <span className="text-[11px] text-slate-400">Top 6 matches & more</span>
        </button>

        <button
          onClick={() => setActiveTab('universities')}
          className="p-4 rounded-2xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 text-left transition-all group"
        >
          <GraduationCap className="h-5 w-5 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-white block">University Degrees</span>
          <span className="text-[11px] text-slate-400">APS & subject rules</span>
        </button>

        <button
          onClick={() => setActiveTab('what-if')}
          className="p-4 rounded-2xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 text-left transition-all group"
        >
          <Sliders className="h-5 w-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-white block">What If? Simulator</span>
          <span className="text-[11px] text-slate-400">Hypothetical mark boost</span>
        </button>

        <button
          onClick={() => setActiveTab('planner')}
          className="p-4 rounded-2xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 text-left transition-all group"
        >
          <Calendar className="h-5 w-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-white block">Application Planner</span>
          <span className="text-[11px] text-slate-400">Checklist & deadlines</span>
        </button>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Top Matches & Academic Progress */}
        <div className="lg:col-span-2 space-y-8">
          {/* Top Career Matches */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🔥</span>
                <div>
                  <h2 className="text-lg font-bold text-white font-heading">My Top Career Matches</h2>
                  <p className="text-xs text-slate-400">Based on interests, RIASEC profile, and current school subjects</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('careers')}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {topMatches.slice(0, 3).map((match) => (
                <div
                  key={match.career.id}
                  className="p-4 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <span className="text-3xl flex-shrink-0">{match.career.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-white">{match.career.title}</h3>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                          {match.fitScore}% Fit
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-1">{match.career.tagline}</p>

                      {/* 3 Component Sub-scores */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-900/80 text-cyan-300 border border-slate-700">
                          🧠 Personality {match.personalityFit || 80}%
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-900/80 text-purple-300 border border-slate-700">
                          🎯 Interests {match.interestFit || 80}%
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                            match.academicStatus === 'aligned'
                              ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                              : match.academicStatus === 'moderate'
                              ? 'bg-amber-950/70 border-amber-500/40 text-amber-300'
                              : 'bg-rose-950/70 border-rose-500/40 text-rose-300'
                          }`}
                        >
                          📚 Academic {match.academicAlignment || 70}%
                        </span>
                        {match.resultCategory === 'explore_with_caution' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-900/40 border border-amber-500/50 text-amber-300">
                            ⚠️ Subject Gate
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 text-[11px] text-slate-400 mt-2">
                        <span>{match.career.category}</span>
                        <span>·</span>
                        <span>{match.career.studyDuration}</span>
                        <span>·</span>
                        <span className="text-indigo-300 font-medium">
                          {match.matchReasons[0] || 'Strong profile match'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center">
                    <button
                      onClick={() => toggleSaveCareer(match.career.id)}
                      className={`p-2 rounded-xl border transition-colors ${
                        isCareerSaved(match.career.id)
                          ? 'bg-red-950/60 border-red-500/50 text-red-400'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                      title="Save Career"
                    >
                      <Bookmark className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCareer(match.career);
                        setActiveTab('careers');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <span>Explore</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Reality Check Snapshot */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">📊</span>
                <div>
                  <h2 className="text-lg font-bold text-white font-heading">Academic Reality Check</h2>
                  <p className="text-xs text-slate-400">Comparing your marks to common degree requirements</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditAcademicModalOpen(true)}
                  className="text-xs font-bold text-cyan-300 hover:text-cyan-200 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-700/60 transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit Academic Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab('what-if')}
                  className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  <span>Simulate "What If?"</span>
                  <Sliders className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.subjects.map((sub) => {
                let statusColor = 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30';
                let statusText = 'Strong';
                if (sub.mark < 60) {
                  statusColor = 'text-amber-400 bg-amber-950/40 border-amber-500/30';
                  statusText = 'Improvement area';
                } else if (sub.mark < 70) {
                  statusColor = 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30';
                  statusText = 'On track';
                }

                return (
                  <div key={sub.id} className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block truncate max-w-[180px]">{sub.name}</span>
                      <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${statusColor}`}>
                        {statusText}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-extrabold text-white">{sub.mark}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400">
              <AlertCircle className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>
                Meeting minimum published criteria does not guarantee admission, as spaces are competitive. Keeping priority subjects above 70%+ opens maximum degree options.
              </span>
            </div>
          </div>
        </div>

        {/* Right Col: Applications, Watched Universities & Ask Pilot Widget */}
        <div className="space-y-8">
          {/* Watched Universities */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-purple-400" />
                <h2 className="text-sm font-bold text-white">Universities Watching</h2>
              </div>
              <button
                onClick={() => setActiveTab('universities')}
                className="text-[11px] font-bold text-cyan-400 hover:underline"
              >
                Search more
              </button>
            </div>

            {watchedUniversities.length === 0 ? (
              <div className="text-center py-6 px-4 rounded-2xl bg-slate-800/40 border border-slate-800">
                <p className="text-xs text-slate-400">No universities saved yet 👀</p>
                <button
                  onClick={() => setActiveTab('universities')}
                  className="mt-3 px-4 py-1.5 rounded-lg bg-indigo-600/80 text-white text-xs font-bold"
                >
                  Explore Degrees
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {watchedUniversities.slice(0, 3).map((uni) => {
                  const evalResult = evaluateProgrammeEligibility(uni, profile.subjects);
                  let badge = '🟢 Meets minimum';
                  if (evalResult.status === 'almost_there') badge = '🟡 Close to target';
                  if (evalResult.status === 'not_met') badge = '🔴 Action needed';

                  return (
                    <div
                      key={uni.id}
                      onClick={() => {
                        setSelectedProgramme(uni);
                        setActiveTab('universities');
                      }}
                      className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-800 cursor-pointer transition-colors"
                    >
                      <span className="text-xs font-bold text-white block">{uni.programmeName}</span>
                      <span className="text-[11px] text-slate-400 block">{uni.universityName} · {uni.city}</span>
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-700/50 text-[10px]">
                        <span className="font-semibold text-slate-300">{badge}</span>
                        <span className="text-cyan-400 font-bold">Req: {uni.minAdmissionScore} {uni.admissionSystem}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Applications Tracker */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-amber-400" />
                <h2 className="text-sm font-bold text-white">Application Deadlines</h2>
              </div>
              <button
                onClick={() => setActiveTab('planner')}
                className="text-[11px] font-bold text-cyan-400 hover:underline"
              >
                View all
              </button>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-6 px-4 rounded-2xl bg-slate-800/40 border border-slate-800">
                <p className="text-xs text-slate-400">No applications tracked yet.</p>
                <button
                  onClick={() => setActiveTab('planner')}
                  className="mt-3 px-4 py-1.5 rounded-lg bg-indigo-600/80 text-white text-xs font-bold"
                >
                  Start Planner
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {applications.slice(0, 2).map((app) => (
                  <div key={app.id} className="p-3 rounded-xl bg-slate-800/60 border border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white truncate max-w-[160px]">{app.programmeName}</span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-950 border border-amber-500/40 text-amber-300 text-[10px] font-bold">
                        {app.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-400">
                      <Clock className="h-3 w-3 text-slate-500" />
                      <span>Closes: {app.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ask Pilot Widget */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-950/90 to-purple-950/70 border border-indigo-500/40 p-6 shadow-lg">
            <div className="flex items-center gap-2.5 mb-2">
              <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
              <h3 className="text-sm font-bold text-white">Ask Pilot ✨</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Have doubts about whether your marks qualify for biomedical degrees or which universities offer your path?
            </p>

            <div className="space-y-1.5 mb-4">
              {[
                'Could I become a medical physicist with my subjects?',
                'What can I study with CAT and Physical Sciences?',
                'Which universities offer biomedical engineering in SA?',
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInitialPilotQuestion(q);
                    setIsAskPilotOpen(true);
                  }}
                  className="w-full text-left p-2 rounded-lg bg-slate-900/60 hover:bg-slate-900 text-[11px] font-medium text-slate-300 hover:text-cyan-300 transition-colors border border-indigo-900/50"
                >
                  "{q}"
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsAskPilotOpen(true)}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-95 text-white text-xs font-bold shadow-md transition-all"
            >
              Open Pilot Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
