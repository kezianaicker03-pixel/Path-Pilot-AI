import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  Bookmark,
  ArrowRight,
  TrendingUp,
  Sparkles,
  MapPin,
  Check,
  Plus,
  Scale,
  GraduationCap,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';
import { Career, CareerMatchResult } from '../../types';
import { useStudent } from '../../context/StudentContext';
import { CAREERS_DATABASE } from '../../data/careersData';

interface CareerMatchesViewProps {
  onSelectCareer: (career: Career) => void;
  onOpenCompare: (careers: Career[]) => void;
}

export const CareerMatchesView: React.FC<CareerMatchesViewProps> = ({
  onSelectCareer,
  onOpenCompare,
}) => {
  const {
    profile,
    topMatches,
    alternativeMatches,
    categorizedMatches,
    toggleSaveCareer,
    isCareerSaved,
    setActiveTab,
    setSelectedProgramme,
  } = useStudent();

  const [activeCategoryTab, setActiveCategoryTab] = useState<'all' | 'strong' | 'exploring' | 'caution'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStudyDuration, setSelectedStudyDuration] = useState<string>('all');
  const [selectedForCompare, setSelectedForCompare] = useState<Career[]>([]);

  // Categories list
  const categories = [
    'all',
    'Medicine & Healthcare',
    'Engineering',
    'Technology & Computing',
    'Science & Research',
    'Finance & Accounting',
    'Creative Arts & Design',
    'Environment & Agriculture',
    'Business & Entrepreneurship',
    'Law & Public Policy',
  ];

  const getCategoryTheme = (cat: string) => {
    if (cat.includes('Medicine') || cat.includes('Health')) return 'border-teal-500/30 text-teal-300 bg-teal-950/40';
    if (cat.includes('Technology') || cat.includes('Computing')) return 'border-blue-500/30 text-blue-300 bg-blue-950/40';
    if (cat.includes('Engineering')) return 'border-orange-500/30 text-orange-300 bg-orange-950/40';
    if (cat.includes('Finance') || cat.includes('Business') || cat.includes('Accounting')) return 'border-purple-500/30 text-purple-300 bg-purple-950/40';
    if (cat.includes('Science')) return 'border-emerald-500/30 text-emerald-300 bg-emerald-950/40';
    if (cat.includes('Creative') || cat.includes('Design')) return 'border-pink-500/30 text-pink-300 bg-pink-950/40';
    if (cat.includes('Environment')) return 'border-green-500/30 text-green-300 bg-green-950/40';
    return 'border-indigo-500/30 text-indigo-300 bg-indigo-950/40';
  };

  const handleToggleCompare = (career: Career) => {
    if (selectedForCompare.some((c) => c.id === career.id)) {
      setSelectedForCompare(selectedForCompare.filter((c) => c.id !== career.id));
    } else {
      if (selectedForCompare.length >= 3) {
        alert('You can compare up to 3 careers at once.');
        return;
      }
      setSelectedForCompare([...selectedForCompare, career]);
    }
  };

  const isBrowsingCatalog = searchQuery.trim().length > 0 || selectedCategory !== 'all' || selectedStudyDuration !== 'all';

  const filteredCatalog = CAREERS_DATABASE.filter((career) => {
    const matchSearch =
      career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.keySubjects.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchCat = selectedCategory === 'all' || career.category === selectedCategory;
    const matchDur =
      selectedStudyDuration === 'all' ||
      (selectedStudyDuration === 'short' && career.studyDurationYears <= 3.5) ||
      (selectedStudyDuration === 'medium' && career.studyDurationYears === 4) ||
      (selectedStudyDuration === 'long' && career.studyDurationYears >= 5);

    return matchSearch && matchCat && matchDur;
  });

  const strongMatches = categorizedMatches?.strongMatches || [];
  const worthExploring = categorizedMatches?.worthExploring || [];
  const exploreWithCaution = categorizedMatches?.exploreWithCaution || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Career Discovery</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-0.5">
            Personalised Career Matches
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            PathPilot scores are evaluated honestly across 3 distinct pillars: your personality work style (30%), curious interests (30%), and actual school subjects & marks (30%).
          </p>
        </div>

        {/* Compare floating badge / trigger */}
        {selectedForCompare.length > 0 && (
          <div className="flex items-center gap-3 p-3 bg-indigo-950 border border-indigo-500 rounded-2xl shadow-xl">
            <Scale className="h-5 w-5 text-cyan-400" />
            <span className="text-xs font-bold text-white">
              {selectedForCompare.length} of 3 selected to compare
            </span>
            <button
              onClick={() => onOpenCompare(selectedForCompare)}
              className="px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-extrabold text-xs hover:bg-cyan-400 transition-colors"
            >
              Compare Now
            </button>
            <button
              onClick={() => setSelectedForCompare([])}
              className="text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Honest Categorization Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
        <button
          type="button"
          onClick={() => setActiveCategoryTab('all')}
          className={`p-3 rounded-xl border text-left transition-all ${
            activeCategoryTab === 'all'
              ? 'bg-indigo-950/80 border-cyan-400 text-white shadow-md'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-xs font-bold block">All Recommendations</span>
          <span className="text-[11px] text-slate-400">
            {strongMatches.length + worthExploring.length + exploreWithCaution.length} pathways
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveCategoryTab('strong')}
          className={`p-3 rounded-xl border text-left transition-all ${
            activeCategoryTab === 'strong'
              ? 'bg-emerald-950/80 border-emerald-400 text-white shadow-md'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold block text-emerald-300">🌟 Strong Matches</span>
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-900/80 text-emerald-200">
              {strongMatches.length}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Aligned personality + academic subjects</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveCategoryTab('exploring')}
          className={`p-3 rounded-xl border text-left transition-all ${
            activeCategoryTab === 'exploring'
              ? 'bg-indigo-950/80 border-indigo-400 text-white shadow-md'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-cyan-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold block text-cyan-300">👀 Worth Exploring</span>
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-indigo-900/80 text-indigo-200">
              {worthExploring.length}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Good fit or alternative pathways available</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveCategoryTab('caution')}
          className={`p-3 rounded-xl border text-left transition-all ${
            activeCategoryTab === 'caution'
              ? 'bg-amber-950/80 border-amber-400 text-white shadow-md'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold block text-amber-300">⚠️ Subject Caution</span>
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-amber-900/80 text-amber-200">
              {exploreWithCaution.length}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Missing specific prerequisite subjects</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search careers, keywords, or subjects (e.g. Physics, Law, Biology)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Fields</option>
              {categories.slice(1).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={selectedStudyDuration}
              onChange={(e) => setSelectedStudyDuration(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-cyan-400"
            >
              <option value="all">Any Duration</option>
              <option value="short">3 Years (BSc / BCom)</option>
              <option value="medium">4 Years (BEng / Honours)</option>
              <option value="long">5+ Years (Specialised / Clinical)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Browsing Full Catalog */}
      {isBrowsingCatalog ? (
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Catalog Results ({filteredCatalog.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCatalog.map((career) => (
              <CareerCardItem
                key={career.id}
                career={career}
                onSelectCareer={onSelectCareer}
                onToggleCompare={handleToggleCompare}
                isSelectedForCompare={selectedForCompare.some((c) => c.id === career.id)}
                isSaved={isCareerSaved(career.id)}
                onToggleSave={() => toggleSaveCareer(career.id)}
                getCategoryTheme={getCategoryTheme}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Categorized Results View */
        <div className="space-y-12">
          {/* SECTION 1: STRONG MATCHES */}
          {(activeCategoryTab === 'all' || activeCategoryTab === 'strong') && strongMatches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🌟</span>
                  <div>
                    <h2 className="text-xl font-extrabold text-white font-heading">
                      Strong Matches ({strongMatches.length})
                    </h2>
                    <p className="text-xs text-slate-400">
                      High alignment across personality style, curious interests, and your actual school subjects.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {strongMatches.map((match) => (
                  <CareerCardItem
                    key={match.career.id}
                    matchResult={match}
                    career={match.career}
                    fitScore={match.fitScore}
                    personalityFit={match.personalityFit}
                    interestFit={match.interestFit}
                    academicAlignment={match.academicAlignment}
                    matchReasons={match.matchReasons}
                    cautionNotes={match.cautionNotes}
                    resultCategory={match.resultCategory}
                    onSelectCareer={onSelectCareer}
                    onToggleCompare={handleToggleCompare}
                    isSelectedForCompare={selectedForCompare.some((c) => c.id === match.career.id)}
                    isSaved={isCareerSaved(match.career.id)}
                    onToggleSave={() => toggleSaveCareer(match.career.id)}
                    getCategoryTheme={getCategoryTheme}
                  />
                ))}
              </div>
            </div>
          )}

          {/* SECTION 2: WORTH EXPLORING */}
          {(activeCategoryTab === 'all' || activeCategoryTab === 'exploring') && worthExploring.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">👀</span>
                  <div>
                    <h2 className="text-xl font-extrabold text-white font-heading">
                      Worth Exploring ({worthExploring.length})
                    </h2>
                    <p className="text-xs text-slate-400">
                      Good natural interest or personality fit; alternative university gateways or elective tracks exist.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {worthExploring.map((match) => (
                  <CareerCardItem
                    key={match.career.id}
                    matchResult={match}
                    career={match.career}
                    fitScore={match.fitScore}
                    personalityFit={match.personalityFit}
                    interestFit={match.interestFit}
                    academicAlignment={match.academicAlignment}
                    matchReasons={match.matchReasons}
                    cautionNotes={match.cautionNotes}
                    resultCategory={match.resultCategory}
                    onSelectCareer={onSelectCareer}
                    onToggleCompare={handleToggleCompare}
                    isSelectedForCompare={selectedForCompare.some((c) => c.id === match.career.id)}
                    isSaved={isCareerSaved(match.career.id)}
                    onToggleSave={() => toggleSaveCareer(match.career.id)}
                    getCategoryTheme={getCategoryTheme}
                  />
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: SUBJECT CAUTION / PREREQUISITES RESTRICTION */}
          {(activeCategoryTab === 'all' || activeCategoryTab === 'caution') && exploreWithCaution.length > 0 && (
            <div className="p-6 rounded-3xl bg-amber-950/20 border border-amber-500/30">
              <div className="flex items-start gap-3 mb-4">
                <ShieldAlert className="h-6 w-6 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-lg font-bold text-amber-200 font-heading">
                    Interesting, But Your Current Subjects May Limit Direct Admission ({exploreWithCaution.length})
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    You may have strong curiosity in these fields, but their typical university degree pathways require specific school subjects (such as Physical Sciences or Advanced Pure Mathematics) that are not currently recorded on your subject list.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {exploreWithCaution.map((match) => (
                  <CareerCardItem
                    key={match.career.id}
                    matchResult={match}
                    career={match.career}
                    fitScore={match.fitScore}
                    personalityFit={match.personalityFit}
                    interestFit={match.interestFit}
                    academicAlignment={match.academicAlignment}
                    matchReasons={match.matchReasons}
                    cautionNotes={match.cautionNotes}
                    resultCategory={match.resultCategory}
                    onSelectCareer={onSelectCareer}
                    onToggleCompare={handleToggleCompare}
                    isSelectedForCompare={selectedForCompare.some((c) => c.id === match.career.id)}
                    isSaved={isCareerSaved(match.career.id)}
                    onToggleSave={() => toggleSaveCareer(match.career.id)}
                    getCategoryTheme={getCategoryTheme}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface CareerCardItemProps {
  career: Career;
  matchResult?: CareerMatchResult;
  fitScore?: number;
  personalityFit?: number;
  interestFit?: number;
  academicAlignment?: number;
  matchReasons?: string[];
  cautionNotes?: string[];
  resultCategory?: 'strong_match' | 'worth_exploring' | 'explore_with_caution';
  onSelectCareer: (career: Career) => void;
  onToggleCompare: (career: Career) => void;
  isSelectedForCompare: boolean;
  isSaved: boolean;
  onToggleSave: () => void;
  getCategoryTheme: (cat: string) => string;
}

const CareerCardItem: React.FC<CareerCardItemProps> = ({
  career,
  matchResult,
  fitScore,
  personalityFit,
  interestFit,
  academicAlignment,
  matchReasons,
  cautionNotes,
  resultCategory,
  onSelectCareer,
  onToggleCompare,
  isSelectedForCompare,
  isSaved,
  onToggleSave,
  getCategoryTheme,
}) => {
  const isCaution = resultCategory === 'explore_with_caution' || (cautionNotes && cautionNotes.length > 0);

  return (
    <div
      className={`flex flex-col justify-between rounded-2xl p-5 shadow-lg transition-all duration-200 hover:-translate-y-1 ${
        isCaution
          ? 'bg-slate-900/90 border border-amber-500/40 hover:border-amber-400'
          : 'bg-slate-900/90 border border-slate-800 hover:border-slate-700'
      }`}
    >
      <div>
        {/* Header: Icon, Title, Category & Actions */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{career.icon}</span>
            <div>
              <h3 className="text-base font-bold text-white leading-snug">{career.title}</h3>
              <span className={`inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getCategoryTheme(career.category)}`}>
                {career.category}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onToggleSave}
              className={`p-1.5 rounded-lg border transition-colors ${
                isSaved
                  ? 'bg-red-950/70 border-red-500/60 text-red-400'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save career'}
            >
              <Bookmark className="h-4 w-4" />
            </button>

            <button
              onClick={() => onToggleCompare(career)}
              className={`p-1.5 rounded-lg border transition-colors ${
                isSelectedForCompare
                  ? 'bg-indigo-950 border-cyan-400 text-cyan-300'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title="Compare career"
            >
              <Scale className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 4-Part Score Breakdown (Fit Score + Personality, Interest, Academic) */}
        {fitScore !== undefined && (
          <div className="mb-3 space-y-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">PathPilot Fit Score</span>
              <span
                className={`text-xs font-black px-2 py-0.5 rounded-md border ${
                  isCaution
                    ? 'bg-amber-950/90 text-amber-300 border-amber-500/50'
                    : 'bg-cyan-950/90 text-cyan-300 border-cyan-500/50'
                }`}
              >
                {fitScore}%
              </span>
            </div>

            {/* Sub-scores 3-pillar breakdown */}
            <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-slate-800 text-[10px] text-center">
              <div className="bg-slate-900 p-1 rounded-lg">
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Personality</span>
                <span className="text-cyan-300 font-bold">{personalityFit ?? 80}%</span>
              </div>
              <div className="bg-slate-900 p-1 rounded-lg">
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Interest</span>
                <span className="text-purple-300 font-bold">{interestFit ?? 80}%</span>
              </div>
              <div
                className={`p-1 rounded-lg ${
                  (academicAlignment ?? 70) >= 70
                    ? 'bg-emerald-950/40 text-emerald-300'
                    : 'bg-rose-950/40 text-rose-300'
                }`}
              >
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Academic</span>
                <span className="font-bold">{academicAlignment ?? 70}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Tagline */}
        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-3">
          {career.tagline}
        </p>

        {/* Caution Notice if Subject Gate triggered */}
        {isCaution && cautionNotes && cautionNotes.length > 0 && (
          <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 mb-3 text-[11px] text-amber-200 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300 block">Academic Subject Note:</span>
              <span>{cautionNotes[0]}</span>
            </div>
          </div>
        )}

        {/* Honest "Why it appeared" */}
        {matchReasons && matchReasons.length > 0 && (
          <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-900/60 mb-3 text-[11px] text-indigo-200">
            <span className="font-bold text-cyan-400 block mb-1">Why this appeared:</span>
            <ul className="space-y-0.5">
              {matchReasons.slice(0, 2).map((reason, rIdx) => (
                <li key={rIdx} className="flex items-start gap-1.5">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Academic Requirements & Subject Dependency */}
        <div className="space-y-1 text-[11px] text-slate-400 mb-4 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span>Subject Dependency:</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                career.requirements?.subjectDependencyLevel === 'high'
                  ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                  : career.requirements?.subjectDependencyLevel === 'medium'
                  ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {career.requirements?.subjectDependencyLevel?.toUpperCase() || 'MEDIUM'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Typical Duration:</span>
            <span className="text-slate-200 font-semibold">{career.studyDuration}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Standard subjects:</span>
            <span className="text-slate-200 font-semibold truncate max-w-[170px]" title={career.keySubjects.join(', ')}>
              {career.keySubjects.slice(0, 3).join(', ')}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80">
        <button
          onClick={() => onSelectCareer(career)}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors text-center"
        >
          Explore Details
        </button>
        <button
          onClick={() => onSelectCareer(career)}
          className={`px-3 py-2 rounded-xl text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 ${
            isCaution ? 'bg-amber-600 hover:bg-amber-500' : 'bg-indigo-600 hover:bg-indigo-500'
          }`}
        >
          <span>Pathway Guide</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};
