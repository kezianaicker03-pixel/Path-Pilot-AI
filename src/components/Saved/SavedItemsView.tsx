import React from 'react';
import { Bookmark, Trash2, ArrowRight, GraduationCap, TrendingUp, Scale } from 'lucide-react';
import { useStudent } from '../../context/StudentContext';
import { CAREERS_DATABASE } from '../../data/careersData';
import { UNIVERSITIES_DATABASE } from '../../data/universitiesData';
import { Career, UniversityProgramme } from '../../types';

interface SavedItemsViewProps {
  onSelectCareer: (career: Career) => void;
  onSelectProgramme: (programme: UniversityProgramme) => void;
}

export const SavedItemsView: React.FC<SavedItemsViewProps> = ({
  onSelectCareer,
  onSelectProgramme,
}) => {
  const {
    profile,
    toggleSaveCareer,
    toggleSaveUniversity,
    setActiveTab,
  } = useStudent();

  const savedCareers = CAREERS_DATABASE.filter((c) =>
    profile?.savedCareerIds?.includes(c.id)
  );

  const savedUniversities = UNIVERSITIES_DATABASE.filter((u) =>
    profile?.savedUniversityIds?.includes(u.id)
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Personal Collection</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-0.5">
          Saved Careers & University Degrees
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Keep your shortlist handy as you explore future possibilities and build your application roadmap.
        </p>
      </div>

      {/* Saved Careers */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">Saved Careers ({savedCareers.length})</h2>
        </div>

        {savedCareers.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <p className="text-xs text-slate-400">No careers saved yet.</p>
            <button
              onClick={() => setActiveTab('careers')}
              className="mt-3 px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold"
            >
              Browse Careers
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedCareers.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-3xl mb-2">{c.icon}</span>
                    <button
                      onClick={() => toggleSaveCareer(c.id)}
                      className="p-1 text-slate-400 hover:text-red-400"
                      title="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <h3 className="text-sm font-bold text-white">{c.title}</h3>
                  <span className="text-[11px] text-cyan-400 block mt-0.5">{c.category}</span>
                  <p className="text-xs text-slate-300 mt-2 line-clamp-2">{c.tagline}</p>
                </div>

                <button
                  onClick={() => onSelectCareer(c)}
                  className="mt-4 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Explore Details</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Saved Universities */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-purple-400" />
          <h2 className="text-lg font-bold text-white">Saved University Degrees ({savedUniversities.length})</h2>
        </div>

        {savedUniversities.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <p className="text-xs text-slate-400">No university degrees saved yet.</p>
            <button
              onClick={() => setActiveTab('universities')}
              className="mt-3 px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold"
            >
              Browse Degrees
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedUniversities.map((u) => (
              <div
                key={u.id}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/50">
                        {u.shortName}
                      </span>
                      <h3 className="text-sm font-bold text-white mt-1.5">{u.programmeName}</h3>
                      <span className="text-xs text-slate-400 block">{u.universityName} · {u.city}</span>
                    </div>
                    <button
                      onClick={() => toggleSaveUniversity(u.id)}
                      className="p-1 text-slate-400 hover:text-red-400"
                      title="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
                    <span>Min Score: {u.minAdmissionScore} {u.admissionSystem}</span>
                    <span>Closes: {u.applicationCloseDate}</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      onSelectProgramme(u);
                      setActiveTab('universities');
                    }}
                    className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs text-center transition-colors"
                  >
                    View Degree Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
