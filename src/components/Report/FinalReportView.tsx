import React, { useRef } from 'react';
import {
  Sparkles,
  Printer,
  Download,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Compass,
  GraduationCap,
  ExternalLink,
  Flame,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  Award,
  Layers,
  Edit3,
} from 'lucide-react';
import { useStudent } from '../../context/StudentContext';
import { UNIVERSITIES_DATABASE } from '../../data/universitiesData';
import { evaluateProgrammeEligibility } from '../../utils/scoringEngine';
import { getSubjectIcon } from '../Academics/SubjectEntrySection';
import { RIASECKey, UniversityProgramme, Career } from '../../types';

export const FinalReportView: React.FC = () => {
  const {
    profile,
    topMatches,
    alternativeMatches,
    categorizedMatches,
    setActiveTab,
    setSelectedCareer,
    setSelectedProgramme,
    setIsAskPilotOpen,
    setIsEditAcademicModalOpen,
  } = useStudent();

  const reportRef = useRef<HTMLDivElement>(null);

  if (!profile) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <Sparkles className="h-12 w-12 text-cyan-400 mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold text-white mb-2">No Assessment Available Yet</h2>
        <p className="text-sm text-slate-400 max-w-md mb-6">
          Complete the discovery assessment and enter your school subjects to generate your personalized PathPilot Report.
        </p>
        <button
          onClick={() => setActiveTab('onboarding')}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all"
        >
          Start Assessment ✨
        </button>
      </div>
    );
  }

  // Country name helper
  const countryName =
    profile.country === 'ZA'
      ? 'South Africa'
      : profile.country === 'GB'
      ? 'United Kingdom'
      : profile.country === 'US'
      ? 'United States'
      : profile.country === 'AU'
      ? 'Australia'
      : 'International';

  const assessmentDate =
    profile.assessmentDate ||
    new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  // Student subjects analysis
  const enteredSubjects = profile.subjects || [];
  const sortedSubjects = [...enteredSubjects].sort((a, b) => b.mark - a.mark);
  const strongestSubject = sortedSubjects[0];
  const lowestSubject = sortedSubjects.length > 1 ? sortedSubjects[sortedSubjects.length - 1] : null;

  // RIASEC Level labels
  const rawRiasec: { key: RIASECKey; name: string; score: number; level: string; desc: string }[] = [
    { key: 'I', name: 'Investigative', score: profile.riasecScores.I, level: 'High', desc: 'Analyzing, researching, inquiring' },
    { key: 'R', name: 'Realistic', score: profile.riasecScores.R, level: 'High', desc: 'Practical, technical, hands-on systems' },
    { key: 'S', name: 'Social', score: profile.riasecScores.S, level: 'Medium-High', desc: 'Helping, advising, collaboration' },
    { key: 'E', name: 'Enterprising', score: profile.riasecScores.E, level: 'Medium', desc: 'Leading, persuading, strategy' },
    { key: 'C', name: 'Conventional', score: profile.riasecScores.C, level: 'Medium', desc: 'Organizing, structured methods' },
    { key: 'A', name: 'Artistic', score: profile.riasecScores.A, level: 'Moderate', desc: 'Creativity, expressive design' },
  ];
  const riasecLevels = [...rawRiasec].sort((a, b) => b.score - a.score);

  // Filter universities based on country and careers
  const relevantProgrammes = UNIVERSITIES_DATABASE.filter((prog) => {
    if (prog.country === profile.country) return true;
    return topMatches.slice(0, 3).some((m) => prog.careerIds.includes(m.career.id));
  }).slice(0, 6);

  // Priority subjects determination
  const mathSubject = enteredSubjects.find((s) => s.name.toLowerCase().includes('math'));
  const scienceSubject = enteredSubjects.find(
    (s) => s.name.toLowerCase().includes('physic') || s.name.toLowerCase().includes('chem')
  );
  const techOrBioSubject = enteredSubjects.find(
    (s) =>
      s.name.toLowerCase().includes('computer') ||
      s.name.toLowerCase().includes('cat') ||
      s.name.toLowerCase().includes('it') ||
      s.name.toLowerCase().includes('life')
  );

  const prioritySubjectsList = [
    mathSubject && {
      subject: mathSubject.name,
      current: mathSubject.mark,
      target: mathSubject.mark < 70 ? '70%+' : '75%+',
      priority: 'Priority 1',
      isFire: true,
      reason:
        'Higher Pure Mathematics marks directly open published thresholds across Engineering, Physics, and Data Sciences.',
    },
    scienceSubject && {
      subject: scienceSubject.name,
      current: scienceSubject.mark,
      target: scienceSubject.mark < 65 ? '65%+' : '70%+',
      priority: 'Priority 2',
      isFire: true,
      reason:
        'Physical Sciences is a prerequisite for Bachelor of Science and Engineering programmes across target faculties.',
    },
    techOrBioSubject && {
      subject: techOrBioSubject.name,
      current: techOrBioSubject.mark,
      target: '75%+',
      priority: 'Priority 3',
      isFire: false,
      reason:
        'Strong marks in applied sciences bolster faculty point calculations and demonstrate technical competency.',
    },
  ].filter(Boolean) as {
    subject: string;
    current: number;
    target: string;
    priority: string;
    isFire: boolean;
    reason: string;
  }[];

  // Primary career for roadmap
  const primaryCareer = topMatches[0]?.career;

  const handlePrint = () => {
    window.print();
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 selection:bg-indigo-500 selection:text-white print:p-0 print:bg-white print:text-black">
      {/* Top Floating / Navigation Bar (Hidden during print) */}
      <div className="max-w-5xl mx-auto mb-8 print:hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xl">
          {/* Quick jump navigation */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            <button
              onClick={() => scrollToSection('sec-overview')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Overview
            </button>
            <button
              onClick={() => scrollToSection('sec-careers')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Career Matches
            </button>
            <button
              onClick={() => scrollToSection('sec-academics')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Academics
            </button>
            <button
              onClick={() => scrollToSection('sec-universities')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Universities
            </button>
            <button
              onClick={() => scrollToSection('sec-roadmap')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Roadmap
            </button>
            <button
              onClick={() => scrollToSection('sec-next-steps')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Next Steps
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsEditAcademicModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Edit your marks"
            >
              <Edit3 className="h-3.5 w-3.5 text-cyan-400" />
              <span>Edit Marks</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Report Container */}
      <div
        ref={reportRef}
        className="max-w-5xl mx-auto space-y-10 print:space-y-6 print:max-w-none print:m-0"
      >
        {/* 1. REPORT HEADER */}
        <section
          id="sec-overview"
          className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden print:border-slate-300 print:shadow-none print:p-4 print:bg-white"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 h-48 w-48 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-cyan-400/10 blur-2xl pointer-events-none print:hidden" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-800 print:border-slate-300">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-950 border border-indigo-500/40 text-[11px] font-bold text-cyan-300 uppercase tracking-wider print:border-slate-400 print:text-black">
                  PATHPILOT AI
                </span>
                <span className="text-xs text-slate-400 print:text-slate-600">
                  Career & University Guidance Report
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-heading tracking-tight print:text-black">
                Your PathPilot Career Report ✨
              </h1>
              <p className="text-sm text-slate-300 mt-1 print:text-slate-700">
                Here’s what we discovered about you — and some paths worth exploring.
              </p>
            </div>

            {/* Metadata Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 print:bg-slate-50 print:border-slate-300">
                <span className="text-[10px] uppercase text-slate-400 font-bold block print:text-slate-500">Location</span>
                <span className="font-bold text-white print:text-black">{profile.region || countryName}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 print:bg-slate-50 print:border-slate-300">
                <span className="text-[10px] uppercase text-slate-400 font-bold block print:text-slate-500">Grade / Year</span>
                <span className="font-bold text-white print:text-black">{profile.grade}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 print:bg-slate-50 print:border-slate-300">
                <span className="text-[10px] uppercase text-slate-400 font-bold block print:text-slate-500">Curriculum</span>
                <span className="font-bold text-white print:text-black">{profile.curriculum} ({countryName})</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 print:bg-slate-50 print:border-slate-300">
                <span className="text-[10px] uppercase text-slate-400 font-bold block print:text-slate-500">Assessment Date</span>
                <span className="font-bold text-white print:text-black">{assessmentDate}</span>
              </div>
            </div>
          </div>

          {/* 2. QUICK SUMMARY */}
          <div className="mt-6 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 print:text-slate-800">
              Quick Summary
            </h3>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed print:text-slate-800">
              Your results suggest that you thrive when solving problems, understanding complex systems, and applying science and technology in meaningful, tangible ways. Based on your entered school subjects, marks profile, and work-style preferences, degrees combining analytical thinking with applied sciences offer you the strongest long-term alignment and highest momentum.
            </p>
          </div>
        </section>

        {/* 3. CAREER PERSONALITY & WORK STYLE PROFILE */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4">
          {/* Personality Archetype & Dimensions */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl print:border-slate-300 print:bg-white print:p-4">
            <div className="flex items-center gap-2 mb-2">
              <Compass className="h-5 w-5 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 print:text-slate-700">
                Pillar 1 · Personality & Work Style Profile
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading print:text-black">
              {profile.careerStyle?.title || 'The Curious Problem Solver'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed print:text-slate-700">
              {profile.careerStyle?.description ||
                'You appear to enjoy investigating problems, learning how systems work and finding logical solutions. You also value work that has a practical impact.'}
            </p>

            {/* RIASEC Dimensions */}
            <div className="mt-5 pt-4 border-t border-slate-800 print:border-slate-300 space-y-2">
              <span className="text-[11px] font-bold uppercase text-slate-400 block mb-2 print:text-slate-600">
                Career Personality Dimensions (0–100)
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {riasecLevels.map((r) => (
                  <div
                    key={r.key}
                    className="p-2 rounded-xl bg-slate-800/60 border border-slate-800 print:bg-slate-50 print:border-slate-300 flex items-center justify-between"
                  >
                    <span className="text-slate-300 font-semibold print:text-slate-800">{r.name}</span>
                    <span className="font-bold text-cyan-300 text-[11px] print:text-black">{r.score}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Work Style Traits & Curiosity Interests */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl print:border-slate-300 print:bg-white print:p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-yellow-300" />
                <span className="text-xs font-bold uppercase tracking-wider text-yellow-300 print:text-slate-700">
                  Pillar 2 · Work Preferences & Curiosity
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 print:text-black">
                How You Naturally Think & Work
              </h3>

              {profile.workStyleTraits && (
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  {Object.entries(profile.workStyleTraits).slice(0, 6).map(([trait, score]) => (
                    <div key={trait} className="p-2 rounded-lg bg-slate-800/50 border border-slate-800 flex justify-between">
                      <span className="capitalize text-slate-300">{trait.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="text-purple-300 font-bold">{score}%</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Selected Curiosity Areas */}
              <div className="pt-3 border-t border-slate-800">
                <span className="text-[11px] font-bold uppercase text-slate-400 block mb-2">
                  Areas of Curiosity ({profile.interests?.length || 0})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.interests?.map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-700/50 text-cyan-300 text-xs font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
              <span>Preferred focus: </span>
              <span className="text-white font-semibold capitalize">{profile.workPreferences?.workWith || 'Balanced combination'}</span>
            </div>
          </div>
        </section>

        {/* 5. ACADEMIC SUBJECT PROFILE (HARD INPUTS ONLY) */}
        <section
          id="sec-academics"
          className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl print:border-slate-300 print:bg-white print:p-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 print:text-slate-700">
                  Pillar 3 · Academic Alignment
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading mt-1 print:text-black">
                Your School Subjects & Verified Marks
              </h2>
            </div>
            <span className="text-xs text-slate-400 print:text-slate-600">
              Evaluated strictly against the {enteredSubjects.length} subjects you entered
            </span>
          </div>

          <div className="mb-4 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300">
            🔒 <strong className="text-white">Strict Academic Check:</strong> PathPilot scores careers using only the subjects and marks you explicitly entered. It never assumes or hallucinates unentered prerequisite subjects.
          </div>

          {/* Subjects Bars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {enteredSubjects.map((s) => {
              const isHigh = s.mark >= 75;
              const isMedium = s.mark >= 60;
              return (
                <div
                  key={s.id}
                  className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-800 print:bg-slate-50 print:border-slate-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{getSubjectIcon(s.name)}</span>
                      <span className="text-xs font-bold text-white truncate max-w-[140px] print:text-black">
                        {s.name}
                      </span>
                    </div>
                    <span className="text-sm font-extrabold text-cyan-300 print:text-black">
                      {s.mark}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden print:bg-slate-200">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isHigh
                          ? 'bg-emerald-400'
                          : isMedium
                          ? 'bg-cyan-400'
                          : 'bg-amber-400'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(5, s.mark))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Academic Commentary */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed print:bg-slate-50 print:border-slate-300 print:text-slate-800">
            {strongestSubject && (
              <p>
                Your strongest current subject is{' '}
                <span className="font-bold text-white print:text-black">
                  {strongestSubject.name} at {strongestSubject.mark}%
                </span>
                .{' '}
                {lowestSubject && lowestSubject.mark < 65 ? (
                  <span>
                    {' '}
                    <span className="font-semibold text-amber-300 print:text-black">{lowestSubject.name} ({lowestSubject.mark}%)</span> may benefit from dedicated attention, as competitive degrees frequently enforce strict minimum thresholds in core analytical subjects.
                  </span>
                ) : (
                  <span>
                    {' '}Your overall marks demonstrate a solid foundation capable of meeting published minimum criteria across multiple university programmes.
                  </span>
                )}
              </p>
            )}
          </div>
        </section>

        {/* 6. CATEGORIZED CAREER PATHWAYS & SCORE BREAKDOWNS */}
        <section
          id="sec-careers"
          className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl print:border-slate-300 print:bg-white print:p-4 space-y-8"
        >
          <div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 print:text-slate-700">
                Career Fit Synthesis
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading mt-1 print:text-black">
              Categorized Career Recommendations
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 print:text-slate-600">
              Evaluated across 3 distinct pillars: Personality (30%), Curious Interests (30%), and Academic Alignment (30%).
            </p>
          </div>

          {/* Category A: Strong Matches */}
          {categorizedMatches?.strongMatches && categorizedMatches.strongMatches.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌟</span>
                <h3 className="text-base font-bold text-emerald-300 uppercase tracking-wider">
                  Strong Matches ({categorizedMatches.strongMatches.length})
                </h3>
              </div>
              <div className="space-y-4">
                {categorizedMatches.strongMatches.map((match, idx) => (
                  <div
                    key={match.career.id}
                    className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 print:bg-slate-50 print:border-slate-300 print:p-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-700/60 print:border-slate-300">
                      <div className="flex items-center gap-2.5">
                        <span className="h-6 w-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center print:bg-slate-800">
                          {idx + 1}
                        </span>
                        <h4 className="text-base sm:text-lg font-bold text-white print:text-black">
                          {match.career.title}
                        </h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-cyan-300 text-xs font-bold border border-slate-700">
                          🧠 Personality {match.personalityFit}%
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-purple-300 text-xs font-bold border border-slate-700">
                          🎯 Interests {match.interestFit}%
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                          📚 Academic {match.academicAlignment}%
                        </span>
                        <span className="px-3 py-1 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-extrabold text-xs">
                          {match.fitScore}% Fit
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed print:text-slate-800">
                      {match.career.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-3 border-t border-slate-800 print:border-slate-200 text-xs">
                      <div>
                        <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1.5 print:text-slate-600">
                          Why this matches you:
                        </span>
                        <ul className="space-y-1 text-slate-300 print:text-slate-800">
                          {match.matchReasons.slice(0, 3).map((r, rIdx) => (
                            <li key={rIdx} className="flex items-start gap-1.5">
                              <span className="text-emerald-400 font-bold">✓</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1.5 print:text-slate-600">
                          Typical Pathway & Duration:
                        </span>
                        <p className="text-slate-300 font-medium print:text-slate-800">
                          {match.career.typicalDegrees[0] || 'Undergraduate Degree'}
                        </p>
                        <span className="inline-block mt-1 text-[11px] text-slate-400 print:text-slate-600">
                          Approx. {match.career.studyDuration || `${match.career.studyDurationYears} years`} study & training
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category B: Worth Exploring */}
          {categorizedMatches?.worthExploring && categorizedMatches.worthExploring.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-lg">👀</span>
                <h3 className="text-base font-bold text-cyan-300 uppercase tracking-wider">
                  Worth Exploring ({categorizedMatches.worthExploring.length})
                </h3>
              </div>
              <div className="space-y-4">
                {categorizedMatches.worthExploring.slice(0, 4).map((match, idx) => (
                  <div
                    key={match.career.id}
                    className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 print:bg-slate-50 print:border-slate-300 print:p-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-700/60 print:border-slate-300">
                      <h4 className="text-base font-bold text-white print:text-black">
                        {match.career.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-cyan-300 text-xs font-bold border border-slate-700">
                          🧠 {match.personalityFit}%
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-purple-300 text-xs font-bold border border-slate-700">
                          🎯 {match.interestFit}%
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-slate-300 text-xs font-bold border border-slate-700">
                          📚 {match.academicAlignment}%
                        </span>
                        <span className="px-3 py-1 rounded-xl bg-slate-800 text-cyan-300 font-extrabold text-xs">
                          {match.fitScore}% Fit
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {match.career.tagline}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category C: Subject Prerequisite Caution */}
          {categorizedMatches?.exploreWithCaution && categorizedMatches.exploreWithCaution.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                <h3 className="text-base font-bold text-amber-300 uppercase tracking-wider">
                  Interesting, But Your Current Subjects May Limit This Path ({categorizedMatches.exploreWithCaution.length})
                </h3>
              </div>
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 mb-3">
                The careers below have strong personality or curiosity alignment, but standard university admission pathways require high-school subjects (such as Physical Sciences or Advanced Mathematics) that do not appear on your current subject list.
              </div>
              <div className="space-y-4">
                {categorizedMatches.exploreWithCaution.map((match) => (
                  <div
                    key={match.career.id}
                    className="p-5 rounded-2xl bg-slate-800/40 border border-amber-500/30"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                      <h4 className="text-base font-bold text-white">{match.career.title}</h4>
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-950/80 text-amber-300 text-xs font-bold border border-amber-500/50">
                        Prerequisite Restriction (Academic: {match.academicAlignment}%)
                      </span>
                    </div>
                    {match.cautionNotes && match.cautionNotes.length > 0 && (
                      <p className="text-xs text-amber-200 mt-2">
                        ⚠️ {match.cautionNotes[0]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 7. CAREERS TO EXPLORE (YOU MIGHT ALSO LIKE) */}
        {alternativeMatches.length > 0 && (
          <section className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl print:border-slate-300 print:bg-white print:p-4">
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400 print:text-slate-700">
                Discovery Section
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5 print:text-black">
                You Might Also Like 🔭
              </h3>
              <p className="text-xs text-slate-400 print:text-slate-600">
                Careers you may not have originally considered that share your underlying problem-solving DNA
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {alternativeMatches.slice(0, 3).map((alt) => (
                <div
                  key={alt.career.id}
                  className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 print:bg-slate-50 print:border-slate-300"
                >
                  <h4 className="text-sm font-bold text-white print:text-black mb-1">
                    {alt.career.title}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-3 print:text-slate-800">
                    {alt.career.description}
                  </p>
                  <span className="inline-block mt-2 text-[10px] text-cyan-400 font-semibold print:text-slate-700">
                    Fit Alignment: {alt.fitScore}%
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. ACADEMIC REALITY CHECK */}
        <section className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl print:border-slate-300 print:bg-white print:p-4">
          <div className="mb-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 print:text-slate-700">
                Admissions Reality Check
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading mt-1 print:text-black">
              Where You Are Academically
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 print:text-slate-600">
              Comparing your entered subjects and marks directly against published university minimums
            </p>
          </div>

          {/* Academic benchmarks comparisons */}
          <div className="space-y-3 mb-6">
            {relevantProgrammes.slice(0, 3).map((prog) => {
              const evalResult = evaluateProgrammeEligibility(prog, enteredSubjects);
              const statusBadge =
                evalResult.status === 'on_track'
                  ? '🟢 Meets published minimum'
                  : evalResult.status === 'almost_there'
                  ? '🟡 Close to published requirement'
                  : '🔴 Requirement not currently met';

              return (
                <div
                  key={prog.id}
                  className="p-4 rounded-2xl bg-slate-800/60 border border-slate-800 print:bg-slate-50 print:border-slate-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-white print:text-black">
                        {prog.programmeName}
                      </h4>
                      <span className="text-xs text-slate-400 print:text-slate-600">
                        {prog.universityName} • {prog.degreeType}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-200 print:text-black">
                      {statusBadge}
                    </span>
                  </div>

                  {/* Subject breakdown */}
                  <div className="mt-3 pt-2 border-t border-slate-800/80 print:border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {evalResult.subjectEvaluations.map((sub, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 print:bg-white print:border-slate-300"
                      >
                        <div className="flex justify-between font-semibold">
                          <span className="text-slate-300 print:text-slate-700">{sub.subjectName}</span>
                          <span className="text-white print:text-black">
                            {sub.studentMark !== undefined ? `${sub.studentMark}%` : 'Not taken'}
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                          <span>Req: {sub.requiredMark}%</span>
                          <span
                            className={
                              sub.status === 'on_track'
                                ? 'text-emerald-400'
                                : sub.status === 'almost_there'
                                ? 'text-amber-400'
                                : 'text-red-400'
                            }
                          >
                            {sub.difference >= 0 ? `+${sub.difference}%` : `${sub.difference}%`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-400 italic print:text-slate-600">
            ⚠️ Important notice: Requirements vary by university faculty and admission cycle. Meeting minimum published requirements does not guarantee admission. Always confirm with the university admissions office before lodging official applications.
          </p>
        </section>

        {/* 9. MY PRIORITY SUBJECTS */}
        {prioritySubjectsList.length > 0 && (
          <section className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl print:border-slate-300 print:bg-white print:p-4">
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 print:text-slate-700">
                Strategic Focus
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5 print:text-black">
                Subjects To Focus On 🔥
              </h3>
              <p className="text-xs text-slate-400 print:text-slate-600">
                Subjects that provide the highest leverage for widening your eligible degree options
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {prioritySubjectsList.map((pri, pIdx) => (
                <div
                  key={pIdx}
                  className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/70 print:bg-slate-50 print:border-slate-300"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      {pri.isFire && <Flame className="h-4 w-4 text-orange-400" />}
                      <span className="text-xs font-bold uppercase text-orange-400 print:text-slate-700">
                        {pri.priority}
                      </span>
                    </div>
                    <span className="text-xs font-extrabold text-cyan-300 print:text-black">
                      Target: {pri.target}
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-white print:text-black mb-1">
                    {pri.subject} (Current: {pri.current}%)
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed print:text-slate-800">
                    {pri.reason}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 10. UNIVERSITIES & PROGRAMMES TO EXPLORE & 11. ELIGIBILITY SUMMARY */}
        <section
          id="sec-universities"
          className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl print:border-slate-300 print:bg-white print:p-4"
        >
          <div className="mb-5">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-purple-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400 print:text-slate-700">
                Degree Pathways
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading mt-1 print:text-black">
              Universities & Programmes To Explore
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 print:text-slate-600">
              Verified undergraduate programmes aligned with your country and career matches
            </p>
          </div>

          {/* Eligibility Summary Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 print:border-slate-300 mb-6">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-800/80 border-b border-slate-800 print:bg-slate-100 print:border-slate-300 text-slate-300 print:text-slate-800 font-bold uppercase text-[10px]">
                  <th className="p-3">Programme</th>
                  <th className="p-3">University</th>
                  <th className="p-3">Application Deadline</th>
                  <th className="p-3">Current Status</th>
                  <th className="p-3 text-right print:hidden">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                {relevantProgrammes.map((prog) => {
                  const evalResult = evaluateProgrammeEligibility(prog, enteredSubjects);
                  const statusText =
                    evalResult.status === 'on_track'
                      ? '🟢 Meets published minimums'
                      : evalResult.status === 'almost_there'
                      ? '🟡 Close to published requirement'
                      : '🔴 Requirement not met';

                  return (
                    <tr
                      key={prog.id}
                      className="hover:bg-slate-800/40 print:hover:bg-transparent transition-colors"
                    >
                      <td className="p-3 font-semibold text-white print:text-black">
                        {prog.programmeName}
                      </td>
                      <td className="p-3 text-slate-300 print:text-slate-800">
                        {prog.universityName}
                      </td>
                      <td className="p-3 text-slate-400 print:text-slate-600">
                        {prog.applicationCloseDate}
                      </td>
                      <td className="p-3 font-bold text-slate-200 print:text-black">
                        {statusText}
                      </td>
                      <td className="p-3 text-right print:hidden">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProgramme(prog);
                            setActiveTab('universities');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-indigo-950 text-cyan-300 hover:bg-indigo-900 border border-indigo-700/50 text-[11px] font-semibold"
                        >
                          View Requirements
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* 12. PERSONALISED CAREER ROADMAP */}
        {primaryCareer && (
          <section
            id="sec-roadmap"
            className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl print:border-slate-300 print:bg-white print:p-4"
          >
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 print:text-slate-700">
                Multi-Year Trajectory
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading mt-1 print:text-black">
                Your Possible Roadmap 🗺️
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 print:text-slate-600">
                Example progression timeline for {primaryCareer.title}
              </p>
            </div>

            {/* Stepped Timeline */}
            <div className="relative pl-6 sm:pl-8 border-l-2 border-indigo-600/40 space-y-6 print:border-slate-400 print:space-y-4">
              <div className="relative">
                <span className="absolute -left-[31px] sm:-left-[39px] top-1 h-4 w-4 rounded-full bg-cyan-400 ring-4 ring-slate-950 print:ring-white" />
                <span className="text-[10px] font-extrabold uppercase text-cyan-400 block print:text-slate-700">NOW • High School ({profile.grade})</span>
                <h4 className="text-sm font-bold text-white print:text-black">
                  Strengthen Core Analytical Subjects
                </h4>
                <p className="text-xs text-slate-300 mt-0.5 print:text-slate-700">
                  Focus on Mathematics and Physical Sciences revision to comfortably meet faculty score benchmarks.
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] sm:-left-[39px] top-1 h-4 w-4 rounded-full bg-indigo-500 ring-4 ring-slate-950 print:ring-white" />
                <span className="text-[10px] font-extrabold uppercase text-indigo-400 block print:text-slate-700">GRADE 12</span>
                <h4 className="text-sm font-bold text-white print:text-black">
                  Maintain Consistency & Early University Applications
                </h4>
                <p className="text-xs text-slate-300 mt-0.5 print:text-slate-700">
                  Submit applications before closing deadlines (e.g. 31 July for UCT / Wits) using Term 1 and Grade 11 results.
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] sm:-left-[39px] top-1 h-4 w-4 rounded-full bg-purple-500 ring-4 ring-slate-950 print:ring-white" />
                <span className="text-[10px] font-extrabold uppercase text-purple-400 block print:text-slate-700">YEARS 1–3 or 4</span>
                <h4 className="text-sm font-bold text-white print:text-black">
                  Undergraduate Degree ({primaryCareer.typicalDegrees[0] || 'Bachelor of Science'})
                </h4>
                <p className="text-xs text-slate-300 mt-0.5 print:text-slate-700">
                  Complete foundational academic coursework, laboratory modules, and maintain good academic standing.
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] sm:-left-[39px] top-1 h-4 w-4 rounded-full bg-emerald-400 ring-4 ring-slate-950 print:ring-white" />
                <span className="text-[10px] font-extrabold uppercase text-emerald-400 block print:text-slate-700">CAREER GOAL</span>
                <h4 className="text-sm font-bold text-white print:text-black">
                  Practising {primaryCareer.title}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5 print:text-slate-700">
                  Professional licensing, industry contributions, and rewarding specialization.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* 13. NEXT 5 ACTIONS */}
        <section
          id="sec-next-steps"
          className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl print:border-slate-300 print:bg-white print:p-4"
        >
          <div className="mb-5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 print:text-slate-700">
              Immediate Steps
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading mt-1 print:text-black">
              What Should You Do Next? 🚀
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 print:text-slate-600">
              Five concrete actions tailored to your current academic stage
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-800 print:bg-slate-50 print:border-slate-300 flex items-start gap-3">
              <span className="h-6 w-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                1
              </span>
              <div>
                <h4 className="font-bold text-white print:text-black">Research your top 3 career matches</h4>
                <p className="text-slate-300 mt-0.5 text-xs print:text-slate-700">
                  Explore day-to-day responsibilities, typical job postings, and professional registration paths.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-800 print:bg-slate-50 print:border-slate-300 flex items-start gap-3">
              <span className="h-6 w-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                2
              </span>
              <div>
                <h4 className="font-bold text-white print:text-black">Target key subject benchmarks</h4>
                <p className="text-slate-300 mt-0.5 text-xs print:text-slate-700">
                  Aim for 70%+ in Pure Mathematics and core sciences in your upcoming assessments.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-800 print:bg-slate-50 print:border-slate-300 flex items-start gap-3">
              <span className="h-6 w-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                3
              </span>
              <div>
                <h4 className="font-bold text-white print:text-black">Compare degree requirements</h4>
                <p className="text-slate-300 mt-0.5 text-xs print:text-slate-700">
                  Shortlist 3–4 programmes across target universities and review their exact admission systems.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-800 print:bg-slate-50 print:border-slate-300 flex items-start gap-3">
              <span className="h-6 w-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                4
              </span>
              <div>
                <h4 className="font-bold text-white print:text-black">Save programmes to your Planner</h4>
                <p className="text-slate-300 mt-0.5 text-xs print:text-slate-700">
                  Bookmark key degree programmes in PathPilot to monitor deadlines and funding opportunities.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-800 print:bg-slate-50 print:border-slate-300 flex items-start gap-3 sm:col-span-2">
              <span className="h-6 w-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                5
              </span>
              <div>
                <h4 className="font-bold text-white print:text-black">Revisit PathPilot after each term report</h4>
                <p className="text-slate-300 mt-0.5 text-xs print:text-slate-700">
                  Update your marks using the "Edit Academic Profile" button to track newly unlocked degree options in real time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 14. QUESTIONS TO THINK ABOUT */}
        <section className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl print:border-slate-300 print:bg-white print:p-4">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="h-5 w-5 text-indigo-400" />
            <h3 className="text-base sm:text-lg font-bold text-white print:text-black">
              Before You Choose A Career… Questions To Think About
            </h3>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-300 print:text-slate-800">
            <li className="p-3 rounded-xl bg-slate-800/40 border border-slate-800/80 print:bg-slate-50 print:border-slate-300">
              💬 “Can I imagine enjoying the actual day-to-day tasks involved in this field?”
            </li>
            <li className="p-3 rounded-xl bg-slate-800/40 border border-slate-800/80 print:bg-slate-50 print:border-slate-300">
              💬 “Am I comfortable with the study duration required for full qualification?”
            </li>
            <li className="p-3 rounded-xl bg-slate-800/40 border border-slate-800/80 print:bg-slate-50 print:border-slate-300">
              💬 “Do I genuinely enjoy the school subjects closely connected to this degree?”
            </li>
            <li className="p-3 rounded-xl bg-slate-800/40 border border-slate-800/80 print:bg-slate-50 print:border-slate-300">
              💬 “Would I find this career stimulating even if salary wasn't the only consideration?”
            </li>
          </ul>
        </section>

        {/* 15. IMPORTANT ETHICAL NOTE */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 leading-relaxed text-center print:border-slate-300 print:text-slate-600 print:bg-white">
          <p>
            PathPilot AI is an exploratory career guidance navigation tool designed to illuminate options. Career-fit scores and admission estimates are not psychological diagnoses or admissions guarantees. University criteria and faculty quotas may change without notice. Always verify official requirements directly with the institution.
          </p>
        </div>

        {/* 24. END OF REPORT HERO & ACTION BUTTONS (Hidden during print) */}
        <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-cyan-950 border border-indigo-500/30 text-center space-y-6 print:hidden shadow-2xl">
          <div className="max-w-xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              Your future isn't one decision. It's something you build. 🚀
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              You don't need to know your entire life today. Use these insights to explore the careers that excite you, understand what they require, and take practical steps forward.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('careers')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02]"
            >
              Explore My Careers
            </button>

            <button
              onClick={() => setActiveTab('universities')}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs transition-colors"
            >
              View Universities
            </button>

            <button
              onClick={() => setIsEditAcademicModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-bold text-xs transition-colors"
            >
              Edit My Marks
            </button>

            <button
              onClick={() => setIsAskPilotOpen(true)}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-yellow-300 font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Ask Pilot ✨</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs transition-colors"
            >
              Return To Dashboard
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
