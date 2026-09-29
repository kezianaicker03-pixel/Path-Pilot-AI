import React, { useState } from 'react';
import {
  Search,
  GraduationCap,
  Calendar,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Bookmark,
  Sparkles,
  Award,
  Scale,
  Plus,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { UniversityProgramme, CountryCode } from '../../types';
import { UNIVERSITIES_DATABASE } from '../../data/universitiesData';
import { useStudent } from '../../context/StudentContext';
import { evaluateProgrammeEligibility } from '../../utils/scoringEngine';

interface UniversitySearchViewProps {
  onSelectProgramme?: (p: UniversityProgramme) => void;
  onOpenCompare: (programmes: UniversityProgramme[]) => void;
}

export const UniversitySearchView: React.FC<UniversitySearchViewProps> = ({
  onSelectProgramme,
  onOpenCompare,
}) => {
  const {
    profile,
    toggleSaveUniversity,
    isUniversitySaved,
    addApplication,
    selectedProgramme,
  } = useStudent();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('ZA');
  const [selectedDegreeType, setSelectedDegreeType] = useState<string>('all');
  const [selectedForCompare, setSelectedForCompare] = useState<UniversityProgramme[]>([]);

  // Verification state cache
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verificationResults, setVerificationResults] = useState<
    Record<string, { verified: boolean; lastChecked: string; summary: string; sources: any[] }>
  >({});

  const handleToggleCompare = (p: UniversityProgramme) => {
    if (selectedForCompare.some((item) => item.id === p.id)) {
      setSelectedForCompare(selectedForCompare.filter((item) => item.id !== p.id));
    } else {
      if (selectedForCompare.length >= 3) {
        alert('You can compare up to 3 university programmes at once.');
        return;
      }
      setSelectedForCompare([...selectedForCompare, p]);
    }
  };

  const handleLiveVerification = async (p: UniversityProgramme) => {
    setVerifyingId(p.id);
    try {
      const res = await fetch('/api/verify-university', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          universityName: p.universityName,
          programmeName: p.programmeName,
          country: p.country,
        }),
      });
      const data = await res.json();
      setVerificationResults((prev) => ({ ...prev, [p.id]: data }));
    } catch (err) {
      console.error('Verification failed', err);
    } finally {
      setVerifyingId(null);
    }
  };

  // Filter programmes
  const filteredProgrammes = UNIVERSITIES_DATABASE.filter((prog) => {
    const matchSearch =
      prog.programmeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.universityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prog.faculty || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.subjectRequirements.some((r) => r.subject.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchCountry = selectedCountry === 'all' || prog.country === selectedCountry;
    const matchDegree = selectedDegreeType === 'all' || prog.degreeType === selectedDegreeType;

    return matchSearch && matchCountry && matchDegree;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Higher Education</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-0.5">
            University Degree Search & Reality Check
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Compare verified undergraduate admission scores (APS / FPS / ATAR), required school subjects, and deadlines.
          </p>
        </div>

        {/* Compare Trigger */}
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
              Compare
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

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search programmes or universities (e.g. Biomedical, UCT, Wits, Physics)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Countries</option>
              <option value="ZA">South Africa (APS)</option>
              <option value="GB">United Kingdom (UCAS)</option>
              <option value="US">United States (GPA)</option>
              <option value="AU">Australia (ATAR)</option>
            </select>

            <select
              value={selectedDegreeType}
              onChange={(e) => setSelectedDegreeType(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Degree Types</option>
              <option value="BEng / BSc(Eng)">Engineering (BEng / BSc Eng)</option>
              <option value="BSc">Bachelor of Science (BSc)</option>
              <option value="MBChB">Medical / Clinical (MBChB)</option>
              <option value="BCom">Commerce & Analytics (BCom)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count & Disclaimer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
        <span>Showing {filteredProgrammes.length} verified degree programmes</span>
        <span className="text-[11px] text-amber-400/90 flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Meeting minimum requirements does not guarantee admission. Programmes are competitive.</span>
        </span>
      </div>

      {/* Programme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProgrammes.map((programme) => {
          const evalResult = profile ? evaluateProgrammeEligibility(programme, profile.subjects) : null;
          const isSaved = isUniversitySaved(programme.id);
          const isCompared = selectedForCompare.some((c) => c.id === programme.id);
          const liveVerification = verificationResults[programme.id];

          return (
            <div
              key={programme.id}
              className="flex flex-col justify-between rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-6 shadow-xl transition-all duration-200"
            >
              <div className="space-y-4">
                {/* Header: University, City, Action Icons */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-700/50 text-indigo-300">
                        {programme.shortName}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{programme.city}, {programme.country}</span>
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-white mt-1.5 leading-snug">
                      {programme.programmeName}
                    </h3>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      {programme.universityName} {programme.faculty ? `· ${programme.faculty}` : ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => toggleSaveUniversity(programme.id)}
                      className={`p-2 rounded-xl border transition-colors ${
                        isSaved
                          ? 'bg-red-950/70 border-red-500/60 text-red-400'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                      title={isSaved ? 'Remove from saved' : 'Save programme'}
                    >
                      <Bookmark className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleToggleCompare(programme)}
                      className={`p-2 rounded-xl border transition-colors ${
                        isCompared
                          ? 'bg-indigo-950 border-cyan-400 text-cyan-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                      title="Compare programme"
                    >
                      <Scale className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Admission Score & Duration details */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Min Admission Score</span>
                    <span className="font-extrabold text-white">
                      {programme.minAdmissionScore} {programme.admissionSystem}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Degree Type & Duration</span>
                    <span className="font-extrabold text-white">
                      {programme.degreeType} ({programme.durationYears} yrs)
                    </span>
                  </div>
                </div>

                {/* STUDENT'S REAL-TIME ELIGIBILITY STATUS */}
                {evalResult && (
                  <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Academic Reality Check
                      </span>
                      {evalResult.status === 'on_track' && (
                        <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/40 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Currently on track</span>
                        </span>
                      )}
                      {evalResult.status === 'almost_there' && (
                        <span className="text-[11px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-500/40 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          <span>Almost there</span>
                        </span>
                      )}
                      {evalResult.status === 'not_met' && (
                        <span className="text-[11px] font-bold text-red-300 bg-red-950/80 px-2 py-0.5 rounded-md border border-red-500/40 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          <span>Requirement not met</span>
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-300">
                      <span>Your calculated {evalResult.scoreName}: </span>
                      <span className="font-extrabold text-white">{evalResult.calculatedScore}</span>
                      <span className="text-slate-400"> (Required: {programme.minAdmissionScore})</span>
                    </div>

                    {/* Subject checks list */}
                    <div className="space-y-1 pt-1 border-t border-slate-700/50">
                      {evalResult.subjectEvaluations.map((se) => (
                        <div key={se.subjectName} className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400 truncate max-w-[170px]">{se.subjectName}:</span>
                          <span className={se.status === 'on_track' ? 'text-emerald-400 font-medium' : se.status === 'almost_there' ? 'text-amber-400 font-medium' : 'text-red-400 font-medium'}>
                            {se.studentMark !== undefined ? `${se.studentMark}% (req ${se.requiredMark}%)` : `Not taken (req ${se.requiredMark}%)`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Deadlines, Fees & Bursaries */}
                <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <Calendar className="h-3.5 w-3.5 text-amber-400" />
                      <span>Applications Close:</span>
                    </span>
                    <span className="font-semibold text-white text-[11px]">{programme.applicationCloseDate}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <Award className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Indicative Annual Fees:</span>
                    </span>
                    <span className="font-semibold text-white text-[11px]">
                      {programme.approximateAnnualFee || programme.estimatedAnnualFees || 'See Prospectus'}
                    </span>
                  </div>

                  {(programme.bursaryOpportunities || programme.bursariesAvailable) && (
                    <div className="text-[11px] text-slate-400">
                      <span>Funding opportunities: </span>
                      <span className="text-cyan-300">
                        {(programme.bursaryOpportunities || programme.bursariesAvailable || []).slice(0, 2).join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Live Grounded Verification Box */}
                {liveVerification && (
                  <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-cyan-300 font-bold">
                      <span className="flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Pilot Live Verification</span>
                      </span>
                      <span className="text-[10px] text-slate-400">Last checked: {liveVerification.lastChecked}</span>
                    </div>
                    <p className="text-slate-200 text-[11px] leading-relaxed">{liveVerification.summary}</p>
                    {liveVerification.sources.length > 0 && (
                      <div className="pt-1 flex flex-wrap gap-2 text-[10px]">
                        {liveVerification.sources.slice(0, 2).map((s: any, idx: number) => (
                          <a
                            key={idx}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:underline flex items-center gap-0.5"
                          >
                            <span>{s.title}</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-4">
                <button
                  onClick={() => handleLiveVerification(programme)}
                  disabled={verifyingId === programme.id}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  title="Verify admission requirements live with Google Search"
                >
                  <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
                  <span>{verifyingId === programme.id ? 'Checking...' : 'Check Live'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={programme.officialProgrammeUrl || programme.officialUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Official University Website"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>

                  <button
                    onClick={() => addApplication(programme)}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Track App</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
