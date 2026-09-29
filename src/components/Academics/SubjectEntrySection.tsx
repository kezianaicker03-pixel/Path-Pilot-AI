import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Search,
  AlertCircle,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { CountryCode, SubjectMark } from '../../types';

export const COMMON_SA_SUBJECTS = [
  'Mathematics',
  'Mathematical Literacy',
  'Physical Sciences',
  'Life Sciences',
  'Computer Applications Technology',
  'Information Technology',
  'Accounting',
  'English',
  'Afrikaans',
  'isiZulu',
  'Business Studies',
  'Economics',
  'Geography',
  'History',
  'Engineering Graphics and Design',
  'Life Orientation',
  'Tourism',
  'Consumer Studies',
  'Visual Arts',
  'Dramatic Arts',
];

export const COMMON_INTL_SUBJECTS = [
  'Mathematics / Calculus',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'English Literature',
  'Economics',
  'Psychology',
  'History',
  'Art & Design',
  'Statistics',
  'Business Studies',
  'Geography',
];

export const getSubjectIcon = (subjectName: string): string => {
  const s = subjectName.toLowerCase();
  if (s.includes('math') || s.includes('calculus') || s.includes('stat')) return '📐';
  if (s.includes('physic') || s.includes('chem') || s.includes('physical')) return '🔬';
  if (s.includes('life') || s.includes('bio')) return '🧬';
  if (s.includes('computer') || s.includes('cat') || s.includes('inf') || s.includes('it')) return '💻';
  if (s.includes('account') || s.includes('business') || s.includes('econ') || s.includes('financ')) return '📊';
  if (s.includes('eng') || s.includes('afrik') || s.includes('zulu') || s.includes('lang') || s.includes('lit')) return '📖';
  if (s.includes('geograph') || s.includes('hist')) return '🌍';
  if (s.includes('graphic') || s.includes('design') || s.includes('egd') || s.includes('art') || s.includes('dram')) return '🎨';
  if (s.includes('tour') || s.includes('consumer') || s.includes('hospital')) return '🏨';
  return '📚';
};

interface SubjectEntrySectionProps {
  initialSubjects?: SubjectMark[];
  country?: CountryCode;
  onSave: (subjects: SubjectMark[]) => void;
  onBack?: () => void;
  submitButtonText?: string;
  mode?: 'assessment' | 'edit';
}

export const SubjectEntrySection: React.FC<SubjectEntrySectionProps> = ({
  initialSubjects = [],
  country = 'ZA',
  onSave,
  onBack,
  submitButtonText = 'Continue',
  mode = 'assessment',
}) => {
  // Temporary form state
  const [subjects, setSubjects] = useState<SubjectMark[]>(() => {
    // Clone initial subjects to ensure isolated local form state
    return initialSubjects.map((s) => ({ ...s }));
  });

  // New subject inputs
  const [searchInput, setSearchInput] = useState('');
  const [markInput, setMarkInput] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close autocomplete dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const suggestionList = country === 'ZA' ? COMMON_SA_SUBJECTS : COMMON_INTL_SUBJECTS;

  // Filter autocomplete suggestions based on search query
  const filteredSuggestions = suggestionList.filter((name) =>
    name.toLowerCase().includes(searchInput.trim().toLowerCase())
  );

  const isExactMatch = suggestionList.some(
    (name) => name.toLowerCase() === searchInput.trim().toLowerCase()
  );

  // Add subject handler
  const handleAddSubject = (subjectNameToAdd?: string, explicitMark?: number) => {
    setValidationError(null);
    const targetName = (subjectNameToAdd || searchInput).trim();

    if (!targetName) {
      setValidationError('Please select or type a subject name.');
      searchInputRef.current?.focus();
      return;
    }

    // Check for duplicates
    const isDuplicate = subjects.some(
      (s) => s.name.toLowerCase() === targetName.toLowerCase()
    );
    if (isDuplicate) {
      setValidationError(`You've already added this subject.`);
      return;
    }

    // Mark validation
    let resolvedMark: number | undefined = explicitMark;
    if (resolvedMark === undefined) {
      if (markInput === '') {
        setValidationError(`Add your current mark for ${targetName}.`);
        return;
      }
      const parsed = Number(markInput);
      if (isNaN(parsed) || parsed < 0 || parsed > 100) {
        setValidationError('Please enter a mark between 0 and 100.');
        return;
      }
      resolvedMark = Math.round(parsed);
    }

    const newSubject: SubjectMark = {
      id: `subj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: targetName,
      mark: resolvedMark,
      isLiked: true,
    };

    setSubjects((prev) => [...prev, newSubject]);
    setSearchInput('');
    setMarkInput('');
    setIsDropdownOpen(false);
    setValidationError(null);
  };

  // Add empty subject row when user clicks "+ Add Subject" without typing yet
  const handleAddNewEmptyRow = () => {
    setValidationError(null);
    searchInputRef.current?.focus();
    setIsDropdownOpen(true);
  };

  // Select from autocomplete
  const handleSelectSuggestion = (suggestedName: string) => {
    setSearchInput(suggestedName);
    setIsDropdownOpen(false);
    setValidationError(null);

    // If mark input already has a valid value, add immediately
    if (markInput !== '') {
      handleAddSubject(suggestedName);
    }
  };

  // Update mark for an existing subject
  const handleUpdateMark = (id: string, valueStr: string) => {
    setValidationError(null);
    if (valueStr === '') {
      setSubjects((prev) =>
        prev.map((s) => (s.id === id ? { ...s, mark: 0 } : s))
      );
      return;
    }

    const val = Number(valueStr);
    if (isNaN(val) || val < 0 || val > 100) {
      setValidationError('Please enter a mark between 0 and 100.');
      return;
    }

    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, mark: Math.round(val) } : s))
    );
  };

  // Remove subject
  const handleRemoveSubject = (id: string) => {
    setValidationError(null);
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  // Toggle liked / disliked
  const handleTogglePreference = (id: string, type: 'liked' | 'disliked') => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        if (type === 'liked') {
          return { ...s, isLiked: !s.isLiked, isDisliked: false };
        } else {
          return { ...s, isDisliked: !s.isDisliked, isLiked: false };
        }
      })
    );
  };

  // Continue / Save Changes validation
  const handleContinue = () => {
    setValidationError(null);

    if (subjects.length === 0) {
      setValidationError('Add at least one subject so PathPilot can understand your academic profile.');
      return;
    }

    // Check that every subject has a valid mark
    for (const sub of subjects) {
      if (sub.mark === undefined || isNaN(sub.mark) || sub.mark < 0 || sub.mark > 100) {
        setValidationError(`Add your current mark for ${sub.name}.`);
        return;
      }
    }

    // All valid - pass clean completed list
    onSave(subjects);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
            What subjects do you take? 📚
          </h2>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          Add the subjects you currently take at school. You can search for a subject or type your own.
        </p>
      </div>

      {/* Validation Alert */}
      {validationError && (
        <div className="p-3.5 rounded-xl bg-amber-950/80 border border-amber-500/60 text-amber-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn shadow-md">
          <AlertCircle className="h-4 w-4 text-amber-400 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* SEARCH / INPUT BAR */}
      <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5 relative" ref={dropdownRef}>
          {/* Search / Autocomplete input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchInput}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setIsDropdownOpen(true);
                setValidationError(null);
              }}
              placeholder="Search or type a subject (e.g. Mathematics, Physical Sciences)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
            />

            {/* Dropdown / Autocomplete Menu */}
            {isDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1.5 max-h-56 overflow-y-auto rounded-xl bg-slate-900 border border-slate-700 shadow-2xl z-40 py-1 divide-y divide-slate-800">
                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map((item) => {
                    const alreadyAdded = subjects.some(
                      (s) => s.name.toLowerCase() === item.toLowerCase()
                    );
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleSelectSuggestion(item)}
                        className={`w-full px-4 py-2.5 text-left text-xs flex items-center justify-between transition-colors ${
                          alreadyAdded
                            ? 'bg-slate-900/60 text-slate-500 cursor-not-allowed'
                            : 'text-slate-200 hover:bg-indigo-950/70 hover:text-cyan-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{getSubjectIcon(item)}</span>
                          <span className="font-semibold">{item}</span>
                        </div>
                        {alreadyAdded && (
                          <span className="text-[10px] text-slate-500 italic">Added</span>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="px-4 py-3 text-xs text-slate-400">
                    No predefined match found.
                  </div>
                )}

                {/* Add Custom Subject Option */}
                {searchInput.trim() && !isExactMatch && (
                  <button
                    type="button"
                    onClick={() => handleSelectSuggestion(searchInput.trim())}
                    className="w-full px-4 py-2.5 text-left text-xs bg-indigo-950/80 text-cyan-300 hover:bg-indigo-900 font-bold flex items-center gap-2 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add custom subject: "{searchInput.trim()}"</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mark Input */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                value={markInput}
                onChange={(e) => {
                  setMarkInput(e.target.value);
                  setValidationError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubject();
                  }
                }}
                placeholder="Mark %"
                className="w-24 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-center text-sm font-bold placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none">
                %
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleAddSubject()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
            >
              <Plus className="h-4 w-4" />
              <span>+ Add Subject</span>
            </button>
          </div>
        </div>

        {/* Helper suggestions prompt */}
        <p className="text-[11px] text-slate-400">
          💡 Click a subject from the list or type any custom subject. Enter your percentage mark from 0 to 100%.
        </p>
      </div>

      {/* SELECTED SUBJECTS LIST (CARDS) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Selected Subjects ({subjects.length})
          </span>
          {subjects.length > 0 && (
            <button
              type="button"
              onClick={() => setSubjects([])}
              className="text-[11px] text-slate-400 hover:text-red-400 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {subjects.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 text-center space-y-2">
            <BookOpen className="h-8 w-8 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-300">No subjects added yet</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Search above or click "+ Add Subject" to build your academic profile row-by-row.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {subjects.map((s) => (
              <div
                key={s.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/90 transition-all shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl flex-shrink-0">{getSubjectIcon(s.name)}</span>
                  <div>
                    <h4 className="text-sm font-extrabold text-white">{s.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => handleTogglePreference(s.id, 'liked')}
                        className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded border transition-colors ${
                          s.isLiked
                            ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                            : 'text-slate-400 border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <ThumbsUp className="h-2.5 w-2.5" />
                        <span>Enjoy</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTogglePreference(s.id, 'disliked')}
                        className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded border transition-colors ${
                          s.isDisliked
                            ? 'bg-red-950/70 border-red-500 text-red-300'
                            : 'text-slate-400 border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <ThumbsDown className="h-2.5 w-2.5" />
                        <span>Challenging</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Current mark:</span>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={s.mark}
                        onChange={(e) => handleUpdateMark(s.id, e.target.value)}
                        className="w-16 px-2.5 py-1 text-center font-bold text-sm bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      />
                      <span className="text-xs font-semibold text-slate-400 ml-1">%</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveSubject(s.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors"
                    title="Remove subject"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Back
          </button>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={handleContinue}
          className="px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/20 hover:scale-[1.02]"
        >
          <span>{submitButtonText}</span>
        </button>
      </div>
    </div>
  );
};
