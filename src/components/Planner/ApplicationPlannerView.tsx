import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  ExternalLink,
  ChevronDown,
  AlertCircle,
  FileText,
  GraduationCap,
} from 'lucide-react';
import { ApplicationItem } from '../../types';
import { useStudent } from '../../context/StudentContext';
import { UNIVERSITIES_DATABASE } from '../../data/universitiesData';

export const ApplicationPlannerView: React.FC = () => {
  const {
    applications,
    updateApplicationStatus,
    toggleChecklistItem,
    removeApplication,
    addApplication,
    setActiveTab,
  } = useStudent();

  const statuses: ApplicationItem['status'][] = [
    'Interested',
    'Preparing',
    'Applied',
    'Awaiting response',
    'Offer received',
    'Not proceeding',
  ];

  const getStatusColor = (status: ApplicationItem['status']) => {
    switch (status) {
      case 'Interested':
        return 'bg-blue-950/80 border-blue-500/40 text-blue-300';
      case 'Preparing':
        return 'bg-amber-950/80 border-amber-500/40 text-amber-300';
      case 'Applied':
        return 'bg-purple-950/80 border-purple-500/40 text-purple-300';
      case 'Awaiting response':
        return 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300';
      case 'Offer received':
        return 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300';
      case 'Not proceeding':
        return 'bg-slate-800 border-slate-700 text-slate-400';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Admissions Tracker</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-0.5">
            University Application Planner
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track deadlines, prepare required documents, and mark off application milestones step-by-step.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('universities')}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
        >
          <Plus className="h-4 w-4" />
          <span>Add Programme from Search</span>
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/60 border border-slate-800 rounded-3xl p-8">
          <GraduationCap className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No University Applications Tracked Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
            Find degrees matching your career interests and click "Track in Planner" to keep all your requirements and dates organized.
          </p>
          <button
            onClick={() => setActiveTab('universities')}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-colors"
          >
            Explore University Degrees
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => {
            const completedCount = app.checklist.filter((i) => i.isDone).length;
            const progressPercent = Math.round((completedCount / app.checklist.length) * 100);

            return (
              <div
                key={app.id}
                className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-7 shadow-xl space-y-6"
              >
                {/* Top Info */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                      {app.universityName}
                    </span>
                    <h3 className="text-lg font-extrabold text-white mt-0.5">{app.programmeName}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <Clock className="h-3.5 w-3.5 text-amber-400" />
                      <span>Application Deadline: <strong className="text-slate-200">{app.deadline}</strong></span>
                    </div>
                  </div>

                  {/* Status Dropdown and Delete */}
                  <div className="flex items-center gap-3">
                    <select
                      value={app.status}
                      onChange={(e) => updateApplicationStatus(app.id, e.target.value as any)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border focus:outline-none ${getStatusColor(
                        app.status
                      )}`}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => removeApplication(app.id)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-red-950/70 hover:text-red-400 text-slate-400 transition-colors"
                      title="Remove from tracker"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-400">Application Checklist Progress</span>
                    <span className="text-cyan-300 font-bold">{completedCount} of {app.checklist.length} ({progressPercent}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-2 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Checklist Items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {app.checklist.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => toggleChecklistItem(app.id, item.id)}
                      className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                        item.isDone
                          ? 'bg-slate-950/60 border-slate-800 text-slate-400'
                          : 'bg-slate-800/60 border-slate-700/80 text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <div
                        className={`h-4 w-4 mt-0.5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                          item.isDone ? 'bg-cyan-500 text-slate-950' : 'border border-slate-500'
                        }`}
                      >
                        {item.isDone && <CheckCircle2 className="h-3.5 w-3.5" />}
                      </div>
                      <span className={`text-xs ${item.isDone ? 'line-through text-slate-500' : 'font-medium'}`}>
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Notes Memo */}
                {app.notes && (
                  <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
                    <FileText className="h-4 w-4 text-slate-500 flex-shrink-0 mt-0.5" />
                    <span>{app.notes}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
