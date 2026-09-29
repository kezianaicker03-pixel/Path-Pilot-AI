import React, { useState } from 'react';
import {
  Award,
  Search,
  ExternalLink,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Building2,
  DollarSign,
} from 'lucide-react';
import { FUNDING_DATABASE } from '../../data/fundingData';
import { FundingOpportunity } from '../../types';

export const FundingView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredFunding = FUNDING_DATABASE.filter((fund) => {
    const matchSearch =
      fund.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fund.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fund.targetFields.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase())) ||
      fund.coverage.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCountry = selectedCountry === 'all' || fund.country === selectedCountry;
    const matchType = selectedType === 'all' || fund.type === selectedType;

    return matchSearch && matchCountry && matchType;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Financial Aid</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-0.5">
          Verified Bursaries, Scholarships & Funding
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Explore tuition cover, living stipends, and corporate sponsorships with real eligibility criteria and deadlines.
        </p>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-white block mb-0.5">Verified Free Access:</strong>
          PathPilot does not charge application fees. Official bursary and scholarship applications are always 100% free through their respective foundation portals.
        </div>
      </div>

      {/* Search & Filter */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, provider, or field of study (e.g. Engineering, NSFAS, Sasol)..."
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
              <option value="ZA">South Africa</option>
              <option value="GB">United Kingdom</option>
              <option value="US">United States</option>
              <option value="AU">Australia</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Funding Types</option>
              <option value="Academic Merit">Academic Merit</option>
              <option value="Financial Need">Financial Need</option>
              <option value="Corporate / Industry">Corporate / Industry</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Funding Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFunding.map((fund) => (
          <div
            key={fund.id}
            className="flex flex-col justify-between rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-6 shadow-xl space-y-5 transition-all"
          >
            <div>
              {/* Top Meta */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-950 border border-indigo-700/50 text-indigo-300">
                      {fund.type}
                    </span>
                    <span className="text-xs text-slate-400">{fund.country}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-white mt-1.5 leading-snug">{fund.name}</h3>
                  <span className="text-xs text-slate-400 block mt-0.5">{fund.provider}</span>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-amber-400 flex-shrink-0">
                  <Award className="h-5 w-5" />
                </div>
              </div>

              {/* Coverage Details */}
              <div className="mt-4 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Coverage & Benefits
                </span>
                <p className="text-xs text-cyan-300 font-medium leading-relaxed">{fund.coverage}</p>
              </div>

              {/* Eligibility Summary */}
              <div className="mt-3 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Eligibility Criteria
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">{fund.eligibilitySummary}</p>
              </div>

              {/* Target Fields */}
              <div className="mt-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Target Fields of Study
                </span>
                <div className="flex flex-wrap gap-1">
                  {fund.targetFields.map((f, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions & Dates */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-amber-400" />
                  <span>Closing Date:</span>
                </span>
                <span className="text-xs font-bold text-white">{fund.closingDate}</span>
              </div>

              <a
                href={fund.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Official Portal</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
