import React from 'react';
import { X, BookOpen, CheckCircle2 } from 'lucide-react';
import { useStudent } from '../../context/StudentContext';
import { SubjectEntrySection } from './SubjectEntrySection';
import { SubjectMark } from '../../types';

export const EditAcademicModal: React.FC = () => {
  const {
    profile,
    isEditAcademicModalOpen,
    setIsEditAcademicModalOpen,
    updateProfileSubjects,
  } = useStudent();

  if (!isEditAcademicModalOpen || !profile) return null;

  const handleSave = (updatedSubjects: SubjectMark[]) => {
    updateProfileSubjects(updatedSubjects);
    setIsEditAcademicModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-950 border border-indigo-500/40 text-cyan-300">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white font-heading">
                Edit Academic Profile
              </h2>
              <p className="text-xs text-slate-400">
                Update your subjects and latest marks to recalculate your admissions eligibility
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditAcademicModalOpen(false)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Reusable Subject Entry Section */}
        <SubjectEntrySection
          initialSubjects={profile.subjects || []}
          country={profile.country}
          mode="edit"
          submitButtonText="Save Changes"
          onSave={handleSave}
          onBack={() => setIsEditAcademicModalOpen(false)}
        />
      </div>
    </div>
  );
};
