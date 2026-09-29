import React, { useState } from 'react';
import { X, ShieldCheck, Trash2, AlertTriangle, CheckCircle2, Lock } from 'lucide-react';
import { useStudent } from '../context/StudentContext';

interface PrivacyModalProps {
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ onClose }) => {
  const { clearAllData, profile } = useStudent();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
    clearAllData();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
            <div>
              <h2 className="text-lg font-extrabold text-white font-heading">Privacy & Data Ethics</h2>
              <p className="text-xs text-slate-400">Our commitments to high school students and parents</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Commitments list */}
        <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/50 border border-slate-800">
            <Lock className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Zero Identifiable Data Required</strong>
              <span>You never need to provide national identity numbers, passwords, phone numbers, or residential addresses. A simple first name or nickname is sufficient.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/50 border border-slate-800">
            <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Stored in Your Browser</strong>
              <span>Your marks, quiz responses, and saved lists are stored privately on your device’s local browser storage.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/50 border border-slate-800">
            <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Guidance, Not Fixed Diagnostics</strong>
              <span>PathPilot is an educational discovery tool. Recommendations are intended to open possibilities, not limit potential. Current test scores never define fixed intelligence.</span>
            </div>
          </div>
        </div>

        {/* Delete My Data Action */}
        <div className="pt-4 border-t border-slate-800">
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-red-950/60 hover:text-red-300 text-slate-400 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700/60 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete All My Saved Data</span>
            </button>
          ) : (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 space-y-3">
              <p className="text-xs font-semibold text-red-200">
                Are you sure? This will wipe your profile, quiz answers, and application checklists from this device.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors"
                >
                  Yes, Wipe Everything
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
