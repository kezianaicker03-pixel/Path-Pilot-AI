import React, { useState } from 'react';
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  User,
  Brain,
  BookOpen,
  Sliders,
  CheckCircle2,
  Info,
  Layers,
} from 'lucide-react';
import {
  CountryCode,
  CurriculumType,
  RIASECKey,
  StudentProfile,
  SubjectMark,
  WorkPreferences,
} from '../../types';
import { QUIZ_QUESTIONS } from '../../data/quizQuestions';
import { useStudent } from '../../context/StudentContext';
import { SubjectEntrySection } from '../Academics/SubjectEntrySection';
import { calculateAssessmentScores } from '../../utils/scoringEngine';

// Broad Curiosity Areas specified in Requirement 6
const BROAD_INTEREST_OPTIONS = [
  { id: 'health', label: 'Health & Medicine', icon: '🩺' },
  { id: 'tech', label: 'Technology', icon: '💻' },
  { id: 'ai', label: 'AI', icon: '🤖' },
  { id: 'data', label: 'Data', icon: '📊' },
  { id: 'eng', label: 'Engineering', icon: '⚙️' },
  { id: 'science', label: 'Science', icon: '🔬' },
  { id: 'math', label: 'Mathematics', icon: '🔢' },
  { id: 'research', label: 'Research', icon: '🔍' },
  { id: 'business', label: 'Business', icon: '💼' },
  { id: 'entrepreneurship', label: 'Entrepreneurship', icon: '🚀' },
  { id: 'finance', label: 'Finance', icon: '📈' },
  { id: 'accounting', label: 'Accounting', icon: '🧾' },
  { id: 'law', label: 'Law', icon: '⚖️' },
  { id: 'politics', label: 'Politics/Public Service', icon: '🏛️' },
  { id: 'psychology', label: 'Psychology', icon: '🧠' },
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'art_design', label: 'Art & Design', icon: '🎨' },
  { id: 'media', label: 'Media', icon: '📹' },
  { id: 'writing', label: 'Writing', icon: '✍️' },
  { id: 'environment', label: 'Environment', icon: '🌱' },
  { id: 'agriculture', label: 'Agriculture', icon: '🌾' },
  { id: 'animals', label: 'Animals', icon: '🐾' },
  { id: 'architecture', label: 'Architecture', icon: '📐' },
  { id: 'construction', label: 'Construction', icon: '🏗️' },
  { id: 'tourism', label: 'Tourism', icon: '🗺️' },
  { id: 'hospitality', label: 'Hospitality', icon: '🏨' },
  { id: 'sport', label: 'Sport', icon: '⚽' },
  { id: 'fashion', label: 'Fashion', icon: '👗' },
  { id: 'music', label: 'Music', icon: '🎵' },
  { id: 'social_impact', label: 'Social Impact', icon: '🤝' },
  { id: 'gaming', label: 'Gaming', icon: '🎮' },
  { id: 'logistics', label: 'Logistics', icon: '🚢' },
  { id: 'aviation', label: 'Aviation', icon: '✈️' },
  { id: 'food', label: 'Food', icon: '🥗' },
  { id: 'other', label: 'Other', icon: '✨' },
  { id: 'unsure', label: "I'm not sure yet", icon: '🧭' },
];

const WORK_ENVIRONMENTS = [
  'Hospital/clinic',
  'Laboratory',
  'Modern office',
  'Remote / from anywhere',
  'Outdoors / nature',
  'Workshop / robotics lab',
  'Studio',
  'Court / legal environment',
  'Active construction site',
  'School / campus',
  'Corporate headquarters',
];

const QUESTIONS_PER_PAGE = 6;

export const OnboardingWizard: React.FC = () => {
  const { profile, saveProfileAndCalculate, setActiveTab, isNewAssessmentActive } = useStudent();

  const [step, setStep] = useState<number>(1); // 1: Profile, 2: Assessment, 3: Academics, 4: Preferences, 5: Analyzing

  // Step 1: Profile State
  const [name, setName] = useState(isNewAssessmentActive ? '' : profile?.name || '');
  const [country, setCountry] = useState<CountryCode>(isNewAssessmentActive ? 'ZA' : profile?.country || 'ZA');
  const [region, setRegion] = useState(isNewAssessmentActive ? 'Gauteng' : profile?.region || 'Gauteng');
  const [grade, setGrade] = useState(isNewAssessmentActive ? 'Grade 11' : profile?.grade || 'Grade 11');
  const [curriculum, setCurriculum] = useState<CurriculumType>(isNewAssessmentActive ? 'IEB' : profile?.curriculum || 'IEB');
  const [hasIdeaLevel, setHasIdeaLevel] = useState<'yes' | 'few' | 'none'>('few');
  const [initialCareerIdeas, setInitialCareerIdeas] = useState<string[]>([]);
  const [careerIdeaInput, setCareerIdeaInput] = useState('');

  // Step 2: Quiz State (32 broad, neutral questions)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizPage, setQuizPage] = useState<number>(0);
  const [quizWarning, setQuizWarning] = useState<string | null>(null);

  // Step 3: Academics State (Strict manual entry; no hallucinated subjects)
  const [subjects, setSubjects] = useState<SubjectMark[]>([]);

  // Step 4: Preferences State
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [workWith, setWorkWith] = useState<WorkPreferences['workWith']>('combination');
  const [selectedEnvs, setSelectedEnvs] = useState<string[]>([]);
  const [maxStudyYears, setMaxStudyYears] = useState<number>(5);

  // Reset all state when a new assessment is triggered
  React.useEffect(() => {
    if (isNewAssessmentActive) {
      setStep(1);
      setName('');
      setCountry('ZA');
      setRegion('Gauteng');
      setGrade('Grade 11');
      setCurriculum('IEB');
      setHasIdeaLevel('few');
      setInitialCareerIdeas([]);
      setCareerIdeaInput('');
      setQuizAnswers({});
      setQuizPage(0);
      setSubjects([]);
      setSelectedInterests([]);
      setSelectedEnvs([]);
      setQuizWarning(null);
    }
  }, [isNewAssessmentActive]);

  const [priorities, setPriorities] = useState(
    profile?.workPreferences?.priorities || {
      earningPotential: 4,
      jobStability: 4,
      helpingPeople: 5,
      creativity: 3,
      flexibility: 4,
      remoteWork: 4,
      travel: 3,
      workLifeBalance: 4,
      leadership: 3,
      continuousLearning: 5,
    }
  );

  // Step 5: Loading state animation messages
  const [analysisProgressIndex, setAnalysisProgressIndex] = useState(0);

  const analysisMessages = [
    'Measuring your RIASEC dimensions & work styles… 🧠',
    'Analyzing curiosity areas & natural preferences… 🔍',
    'Checking exact subjects & mark thresholds… 📊',
    'Enforcing subject prerequisites & academic gates… ⚖️',
    'Evaluating verified university admission criteria… 🏛️',
    'Organizing recommendations into Strong Matches & Explorations… 🚀',
    'Your PathPilot report is ready ✨',
  ];

  const handleStartAnalysis = () => {
    setStep(5);
    let idx = 0;
    const interval = setInterval(() => {
      idx += 1;
      setAnalysisProgressIndex(idx);
      if (idx >= analysisMessages.length - 1) {
        clearInterval(interval);
        setTimeout(() => {
          completeOnboarding();
        }, 1100);
      }
    }, 800);
  };

  const completeOnboarding = () => {
    // 1. Calculate RIASEC dimensions (0-100) and Work-Style traits (0-100)
    const { riasecScores, personalityDimensions, workStyleTraits } = calculateAssessmentScores(
      quizAnswers,
      QUIZ_QUESTIONS
    );

    const newProfile: StudentProfile = {
      name: name.trim(), // Optional; if blank, dashboard and report handle neutrally
      country,
      region,
      grade,
      curriculum,
      initialCareerIdeas,
      hasIdeaLevel,
      subjects: subjects.filter((s) => s.name.trim().length > 0),
      interests: selectedInterests,
      riasecScores,
      personalityDimensions,
      workStyleTraits,
      workPreferences: {
        workWith,
        environment: selectedEnvs,
        maxStudyDurationYears: maxStudyYears,
        priorities,
      },
      savedCareerIds: profile?.savedCareerIds || [],
      savedUniversityIds: profile?.savedUniversityIds || [],
    };

    saveProfileAndCalculate(newProfile);
  };

  // Helper to add custom career idea
  const handleAddCareerIdea = () => {
    if (!careerIdeaInput.trim()) return;
    if (!initialCareerIdeas.includes(careerIdeaInput.trim())) {
      setInitialCareerIdeas([...initialCareerIdeas, careerIdeaInput.trim()]);
    }
    setCareerIdeaInput('');
  };

  const totalQuizPages = Math.ceil(QUIZ_QUESTIONS.length / QUESTIONS_PER_PAGE);
  const currentQuestions = QUIZ_QUESTIONS.slice(
    quizPage * QUESTIONS_PER_PAGE,
    (quizPage + 1) * QUESTIONS_PER_PAGE
  );
  const answeredCount = Object.keys(quizAnswers).length;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Header (1 Profile, 2 Assessment, 3 Academics, 4 Preferences, 5 Results) */}
        {step < 5 && (
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
              <span className="text-cyan-400">Step {step} of 4</span>
              <span>{Math.round((step / 4) * 100)}% Complete</span>
            </div>

            {/* Stepper Bar */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { s: 1, label: 'Profile' },
                { s: 2, label: 'Assessment' },
                { s: 3, label: 'Academics' },
                { s: 4, label: 'Preferences' },
              ].map((item) => (
                <div key={item.s} className="flex flex-col gap-1">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      step >= item.s
                        ? 'bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-sm shadow-cyan-500/20'
                        : 'bg-slate-800'
                    }`}
                  />
                  <span
                    className={`text-[11px] font-semibold text-center ${
                      step === item.s ? 'text-cyan-300' : 'text-slate-400'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: STUDENT PROFILE */}
        {step === 1 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl animate-fadeIn">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Step 1</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-heading">
                Tell us about your educational context
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                We only ask what is needed to match you with valid academic programmes. No legal name or ID required.
              </p>
            </div>

            <div className="space-y-6">
              {/* First name / Nickname (optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  First name or nickname (optional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Optional (e.g. Alex, Sam, Jordan)"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm"
                />
              </div>

              {/* Country & Region */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value as CountryCode)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 text-sm"
                  >
                    <option value="ZA">South Africa (APS system)</option>
                    <option value="GB">United Kingdom (UCAS / A-Levels)</option>
                    <option value="US">United States (GPA / Honors)</option>
                    <option value="AU">Australia (ATAR system)</option>
                    <option value="OTHER">Other / International</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Province / State / Region
                  </label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="e.g. Gauteng, Western Cape, London, California"
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                  />
                </div>
              </div>

              {/* Grade & Curriculum */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Current Grade / Year
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 text-sm"
                  >
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12 / Matric</option>
                    <option value="Gap Year">Gap Year / Matric Upgrade</option>
                    <option value="First Year">1st Year University</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Curriculum System
                  </label>
                  <select
                    value={curriculum}
                    onChange={(e) => setCurriculum(e.target.value as CurriculumType)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 text-sm"
                  >
                    <option value="IEB">South Africa - IEB</option>
                    <option value="NSC">South Africa - CAPS / NSC</option>
                    <option value="Cambridge">Cambridge (IGCSE / AS / A-Levels)</option>
                    <option value="IB">International Baccalaureate (IB)</option>
                    <option value="American">US High School Diploma</option>
                    <option value="Other">Other Curriculum</option>
                  </select>
                </div>
              </div>

              {/* Do you already have careers in mind? */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Do you already have careers in mind?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { val: 'yes', label: 'Yes, clear ideas' },
                    { val: 'few', label: 'A few ideas' },
                    { val: 'none', label: 'No idea yet 🧭' },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setHasIdeaLevel(opt.val as any)}
                      className={`p-3 rounded-xl text-xs font-bold border transition-all text-center ${
                        hasIdeaLevel === opt.val
                          ? 'bg-indigo-600/30 border-cyan-400 text-cyan-300 shadow-md'
                          : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {hasIdeaLevel !== 'none' && (
                  <div className="mt-4">
                    <label className="block text-xs text-slate-400 mb-1.5">
                      Type and press enter to add careers you’re curious about:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={careerIdeaInput}
                        onChange={(e) => setCareerIdeaInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCareerIdea())}
                        placeholder="e.g. Biomedical Engineering, Software Dev"
                        className="flex-1 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
                      />
                      <button
                        type="button"
                        onClick={handleAddCareerIdea}
                        className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-colors"
                      >
                        Add
                      </button>
                    </div>

                    {initialCareerIdeas.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {initialCareerIdeas.map((idea, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-700/50 text-cyan-300 text-xs font-medium"
                          >
                            <span>{idea}</span>
                            <button
                              type="button"
                              onClick={() => setInitialCareerIdeas(initialCareerIdeas.filter((_, idx) => idx !== i))}
                              className="hover:text-red-400"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Next Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
              >
                <span>Continue to Assessment</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CAREER PERSONALITY & INTERESTS ASSESSMENT */}
        {step === 2 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl animate-fadeIn">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Step 2</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-heading">
                Career Personality & Interests Assessment
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Answer instinctively — go with what genuinely reflects how you think, solve problems, and prefer to work.
              </p>

              {/* Progress counter & pagination tabs */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-cyan-400">
                    {answeredCount} of {QUIZ_QUESTIONS.length} Scenarios Answered
                  </span>
                  <div className="w-28 bg-slate-700 h-1.5 rounded-full overflow-hidden hidden sm:block">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full transition-all duration-300"
                      style={{ width: `${Math.round((answeredCount / QUIZ_QUESTIONS.length) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <span className="text-slate-400 mr-1">Section:</span>
                  {Array.from({ length: totalQuizPages }).map((_, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => setQuizPage(pIdx)}
                      className={`px-2.5 py-1 rounded-lg transition-colors ${
                        quizPage === pIdx
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {pIdx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Questions for current page */}
            <div className="space-y-8">
              {currentQuestions.map((q, qLocalIdx) => {
                const globalIndex = quizPage * QUESTIONS_PER_PAGE + qLocalIdx;
                const selectedOption = quizAnswers[q.id];
                return (
                  <div key={q.id} className="border-t border-slate-800 pt-6 first:border-0 first:pt-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <span className="text-xs font-bold text-cyan-400">Scenario {globalIndex + 1} of {QUIZ_QUESTIONS.length}</span>
                        <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">{q.scenario}</h3>
                        {q.subtext && <p className="text-xs text-slate-400 mt-0.5">{q.subtext}</p>}
                      </div>
                    </div>

                    {/* Option Choices */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                      {q.options.map((opt) => {
                        const isSelected = selectedOption === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setQuizAnswers({ ...quizAnswers, [q.id]: opt.id });
                              setQuizWarning(null);
                            }}
                            className={`p-4 rounded-xl border text-left transition-all duration-200 flex items-start gap-3 ${
                              isSelected
                                ? 'bg-indigo-950/70 border-cyan-400 shadow-md shadow-cyan-500/10'
                                : 'bg-slate-800/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                            }`}
                          >
                            {opt.icon && <span className="text-2xl flex-shrink-0">{opt.icon}</span>}
                            <div>
                              <p className={`text-sm font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                                {opt.label}
                              </p>
                              {opt.description && (
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                  {opt.description}
                                </p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Warning if nothing selected */}
            {quizWarning && (
              <div className="mt-6 p-3 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-200 text-xs font-semibold flex items-center gap-2">
                <Info className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span>{quizWarning}</span>
              </div>
            )}

            {/* Pagination Controls */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  if (quizPage > 0) {
                    setQuizPage(quizPage - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    setStep(1);
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{quizPage > 0 ? 'Previous Section' : 'Back to Profile'}</span>
              </button>

              <div className="flex items-center gap-3">
                {quizPage < totalQuizPages - 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQuizPage(quizPage + 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20"
                  >
                    <span>Next Section ({quizPage + 2} of {totalQuizPages})</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (answeredCount < 3) {
                        setQuizWarning('Please answer at least 3 scenarios so PathPilot can accurately map your thinking style.');
                        return;
                      }
                      setQuizWarning(null);
                      setStep(3);
                    }}
                    className="px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
                  >
                    <span>Continue to Academics</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: ACADEMIC PROFILE (STRICT MANUAL ENTRY ONLY) */}
        {step === 3 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl animate-fadeIn">
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Step 3 of 4</span>
            </div>

            <SubjectEntrySection
              initialSubjects={subjects}
              country={country}
              mode="assessment"
              submitButtonText="Save Subjects & Continue"
              onSave={(validSubjects) => {
                setSubjects(validSubjects);
                setStep(4);
              }}
              onBack={() => setStep(2)}
            />
          </div>
        )}

        {/* STEP 4: CURIOUS INTERESTS & WORK PREFERENCES */}
        {step === 4 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl animate-fadeIn">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Step 4</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-heading">
                What areas are you curious about?
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Select as many or as few as you genuinely like — there are no wrong answers ✨
              </p>
            </div>

            <div className="space-y-8">
              {/* Broad Curiosity Areas Multi-select */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Curiosity & Topic Areas ({selectedInterests.length} selected)
                  </label>
                  {selectedInterests.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedInterests([])}
                      className="text-xs text-slate-400 hover:text-cyan-400"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {BROAD_INTEREST_OPTIONS.map((item) => {
                    const isSelected = selectedInterests.includes(item.label);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          if (item.id === 'unsure') {
                            // If unsure is picked, toggle it
                            if (isSelected) {
                              setSelectedInterests(selectedInterests.filter((i) => i !== item.label));
                            } else {
                              setSelectedInterests([item.label]);
                            }
                          } else {
                            // Remove unsure if selecting specific areas
                            const filtered = selectedInterests.filter((i) => i !== "I'm not sure yet");
                            if (isSelected) {
                              setSelectedInterests(filtered.filter((i) => i !== item.label));
                            } else {
                              setSelectedInterests([...filtered, item.label]);
                            }
                          }
                        }}
                        className={`p-3 rounded-xl text-left border transition-all flex items-center gap-2.5 ${
                          isSelected
                            ? 'bg-indigo-950/80 border-cyan-400 text-cyan-300 shadow-sm'
                            : 'bg-slate-800/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="text-xl flex-shrink-0">{item.icon}</span>
                        <span className="text-xs font-bold truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Would you rather work with */}
              <div className="pt-4 border-t border-slate-800">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  How do you prefer to spend your working hours?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { val: 'technology', label: 'Technology & Code', icon: '💻' },
                    { val: 'people', label: 'People & Mentorship', icon: '👥' },
                    { val: 'ideas', label: 'Ideas & Research', icon: '🧠' },
                    { val: 'data', label: 'Data & Patterns', icon: '📊' },
                    { val: 'objects', label: 'Physical Systems & Materials', icon: '⚙️' },
                    { val: 'combination', label: 'A balanced combination', icon: '⚖️' },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setWorkWith(opt.val as any)}
                      className={`p-3 rounded-xl text-left border transition-all flex items-center gap-2 ${
                        workWith === opt.val
                          ? 'bg-indigo-600/30 border-cyan-400 text-cyan-300'
                          : 'bg-slate-800/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{opt.icon}</span>
                      <span className="text-xs font-bold">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Environment */}
              <div className="pt-4 border-t border-slate-800">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Preferred Work Environments
                </label>
                <div className="flex flex-wrap gap-2">
                  {WORK_ENVIRONMENTS.map((env) => {
                    const isSelected = selectedEnvs.includes(env);
                    return (
                      <button
                        key={env}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedEnvs(selectedEnvs.filter((e) => e !== env));
                          } else {
                            setSelectedEnvs([...selectedEnvs, env]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300'
                            : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {env}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Study duration comfort */}
              <div className="pt-4 border-t border-slate-800">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  How long would you be comfortable studying after school?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { yrs: 3, label: '3 Years (Bachelor’s)' },
                    { yrs: 4, label: '4 Years (Honours / BEng)' },
                    { yrs: 5, label: '5–6 Years (Master’s/Clinical)' },
                    { yrs: 7, label: '7+ Years (Long Specialisation)' },
                  ].map((dur) => (
                    <button
                      key={dur.yrs}
                      type="button"
                      onClick={() => setMaxStudyYears(dur.yrs)}
                      className={`p-3 rounded-xl text-center border text-xs font-bold transition-all ${
                        maxStudyYears === dur.yrs
                          ? 'bg-indigo-600/30 border-cyan-400 text-cyan-300'
                          : 'bg-slate-800/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {dur.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Sliders */}
              <div className="pt-4 border-t border-slate-800">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                  How important are these priorities to you? (1 = Low, 5 = Essential)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'helpingPeople', label: 'Helping People / Social Impact' },
                    { key: 'continuousLearning', label: 'Continuous Learning & Discovery' },
                    { key: 'earningPotential', label: 'High Earning Potential' },
                    { key: 'workLifeBalance', label: 'Work-Life Balance' },
                    { key: 'creativity', label: 'Creativity & Originality' },
                    { key: 'remoteWork', label: 'Remote / Flexible Location' },
                  ].map((p) => {
                    const val = (priorities as any)[p.key] || 3;
                    return (
                      <div key={p.key} className="bg-slate-800/60 p-3 rounded-xl border border-slate-800">
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-300">{p.label}</span>
                          <span className="text-cyan-400 font-bold">{val} / 5</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="1"
                          value={val}
                          onChange={(e) =>
                            setPriorities({ ...priorities, [p.key]: parseInt(e.target.value) })
                          }
                          className="w-full accent-cyan-400 cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Academics</span>
              </button>

              <button
                type="button"
                onClick={handleStartAnalysis}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-cyan-500 to-indigo-600 hover:opacity-90 text-white font-extrabold text-sm flex items-center gap-2.5 shadow-xl shadow-cyan-500/20 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="h-4 w-4 text-cyan-200" />
                <span>Calculate My Career Pathways</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: ANALYSIS ANIMATION */}
        {step === 5 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl text-center max-w-lg mx-auto animate-fadeIn">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 animate-spin blur-md opacity-70" />
              <div className="relative w-full h-full rounded-full bg-slate-900 border-2 border-cyan-400 flex items-center justify-center">
                <Brain className="h-10 w-10 text-cyan-400 animate-pulse" />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white font-heading mb-2">
              Synthesizing Your Career Blueprint
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Evaluating personality traits, curious interests, and exact academic subject eligibility.
            </p>

            <div className="space-y-3 max-w-sm mx-auto text-left mb-6">
              {analysisMessages.map((msg, i) => {
                const isPassed = i < analysisProgressIndex;
                const isCurrent = i === analysisProgressIndex;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 text-xs transition-opacity duration-300 ${
                      isPassed ? 'text-emerald-400 font-semibold' : isCurrent ? 'text-cyan-300 font-bold' : 'text-slate-600 opacity-40'
                    }`}
                  >
                    {isPassed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    ) : isCurrent ? (
                      <div className="h-4 w-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin flex-shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-slate-700 flex-shrink-0" />
                    )}
                    <span>{msg}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
