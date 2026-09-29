import React, { useState } from 'react';
import { X, Share2, Copy, Check, Sparkles, Compass, Download, Shield } from 'lucide-react';
import { useStudent } from '../../context/StudentContext';

interface ShareProfileModalProps {
  onClose: () => void;
}

export const ShareProfileModal: React.FC<ShareProfileModalProps> = ({ onClose }) => {
  const { profile, topMatches } = useStudent();
  const [copied, setCopied] = useState(false);

  if (!profile) return null;

  const handleCopy = () => {
    const summaryText = `🚀 PathPilot AI Career Discovery Profile
Academic Profile: ${profile.grade}, ${profile.curriculum} (${profile.region || profile.country})
Career Archetype: ${profile.careerStyle?.title || 'The Curious Problem Solver'}

🌟 Top Career Matches:
${topMatches.map((m, i) => `${i + 1}. ${m.career.title} (${m.fitScore}% Fit) - ${m.career.tagline}`).join('\n')}

💡 Core Interests: ${profile.interests.join(', ')}

Generated with PathPilot AI · Discover your path. Plan your future.`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Share Your Future Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* The Visual Profile Card */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/40 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-cyan-400" />
              <span className="font-extrabold text-sm text-white font-heading">
                PathPilot <span className="text-cyan-400">AI</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-400">Verified Profile</span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
              {profile.careerStyle?.title}
            </span>
            <h3 className="text-xl font-extrabold text-white mt-0.5">Your Career Matches</h3>
            <p className="text-xs text-slate-400">
              {profile.grade} · {profile.curriculum} · {profile.region || 'South Africa'}
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Top Matches
            </span>
            {topMatches.slice(0, 4).map((m, idx) => (
              <div key={m.career.id} className="flex items-center justify-between text-xs">
                <span className="text-slate-200 font-medium">
                  {m.career.icon} {m.career.title}
                </span>
                <span className="text-cyan-300 font-bold">{m.fitScore}%</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <div className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              <span>Marks kept private by default</span>
            </div>
            <span>pathpilot.app</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span>Print Card</span>
          </button>
        </div>
      </div>
    </div>
  );
};
