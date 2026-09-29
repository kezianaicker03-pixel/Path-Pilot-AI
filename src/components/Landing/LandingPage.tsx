import React from 'react';
import {
  Sparkles,
  Compass,
  GraduationCap,
  Calculator,
  MapPin,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  TrendingUp,
  BookOpen,
} from 'lucide-react';
import { useStudent } from '../../context/StudentContext';

export const LandingPage: React.FC = () => {
  const { setActiveTab, loadDemoProfile, profile } = useStudent();

  const featureCards = [
    {
      icon: Compass,
      title: 'Discover My Career',
      color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400',
      description: 'Find roles matching your natural strengths, Holland RIASEC interests, and lifestyle goals.',
      action: () => setActiveTab('onboarding'),
    },
    {
      icon: GraduationCap,
      title: 'Find Universities',
      color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400',
      description: 'Search official programmes with published benchmarks, fees, dates, and funding options.',
      action: () => setActiveTab('universities'),
    },
    {
      icon: CheckCircle2,
      title: 'Check My Marks',
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
      description: 'Real-time academic reality check: see exactly where your current marks stand vs requirements.',
      action: () => setActiveTab('universities'),
    },
    {
      icon: Calculator,
      title: 'Calculate Admission Score',
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
      description: 'Accurately calculate your APS (UCT FPS, Wits APS, UP, Maties) or international ATAR/GPA.',
      action: () => setActiveTab('what-if'),
    },
    {
      icon: MapPin,
      title: 'Build My Roadmap',
      color: 'from-indigo-500/20 to-violet-500/10 border-indigo-500/30 text-indigo-400',
      description: 'Step-by-step milestones from high school subjects to clinical or professional licensing.',
      action: () => setActiveTab('roadmap'),
    },
    {
      icon: MessageSquare,
      title: 'Ask PathPilot AI',
      color: 'from-cyan-500/20 to-sky-500/10 border-cyan-500/30 text-cyan-400',
      description: 'Have a friendly chat with "Pilot ✨" about your subject combinations, doubts, or degree options.',
      action: () => setActiveTab('discover'),
    },
  ];

  const steps = [
    { number: '1', title: 'Tell us about yourself', desc: 'Share your grade, country, and whether you already have early ideas.' },
    { number: '2', title: 'Complete discovery quiz', desc: '16 scenario-based questions to map your RIASEC interest profile.' },
    { number: '3', title: 'Add your subjects and marks', desc: 'Enter school subjects to power the academic eligibility engine.' },
    { number: '4', title: 'Get personalised matches', desc: 'Top 6 matches plus 3 unexpected high-potential careers to explore.' },
    { number: '5', title: 'Discover universities', desc: 'Compare verified degree requirements, APS cutoff points, and dates.' },
    { number: '6', title: 'Build your future plan', desc: 'Track your application checklist, game plan, and funding deadines.' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-800/80">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-tr from-indigo-600/30 via-purple-600/25 to-cyan-500/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Tag badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-indigo-500/30 text-xs font-semibold text-cyan-300 shadow-sm mb-6 animate-pulse">
            <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
            <span>Discover your path. Plan your future.</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-4 font-heading">
            Not sure what you want to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">become?</span>
          </h1>

          <p className="text-xl sm:text-2xl font-bold text-slate-200 mb-6">
            Let’s figure it out together.
          </p>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed mb-10">
            Discover careers that match your interests, personality, subjects and marks — then see exactly what you need to study and where you can apply.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('onboarding')}
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 rounded-xl shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2"
            >
              <span>Find My Path ✨</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => setActiveTab('careers')}
              className="w-full sm:w-auto px-7 py-4 text-base font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              <span>Explore Careers</span>
            </button>

            {/* Quick Demo Profile Load */}
            <button
              onClick={loadDemoProfile}
              className="w-full sm:w-auto px-6 py-4 text-sm font-semibold text-indigo-300 bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-700/60 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span>Try Demo: Alex (Grade 11, IEB)</span>
            </button>
          </div>

          {/* Integrity Note */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Constructive guidance, not psychological diagnoses. No personal ID or sensitive data required.</span>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Everything you need to navigate your future
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            From the moment of “I have no idea” to a clear, step-by-step roadmap to your degree and career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                onClick={card.action}
                className={`group cursor-pointer rounded-2xl bg-gradient-to-b ${card.color} p-6 backdrop-blur-sm border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900/90 border border-slate-800 shadow-inner mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{card.description}</p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore feature</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 sm:py-24 bg-slate-950/60 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Step-by-step guidance</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">How PathPilot Works</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm mt-2">
              A gentle, supportive journey designed specifically for high school students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between hover:border-indigo-500/40 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/20 text-cyan-400 font-extrabold text-base border border-indigo-500/30">
                    {s.number}
                  </div>
                  <h3 className="text-base font-bold text-white">{s.title}</h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => setActiveTab('onboarding')}
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
            >
              <span>Begin Discovery Journey</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
        <p>© 2026 PathPilot AI · High School Career Discovery & University Guidance Platform</p>
        <p className="mt-1">Guidance provided for educational exploration. Official admissions determined solely by respective institutions.</p>
      </footer>
    </div>
  );
};
