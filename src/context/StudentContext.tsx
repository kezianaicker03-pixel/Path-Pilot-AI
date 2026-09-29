import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ApplicationItem,
  Career,
  CareerMatchResult,
  CountryCode,
  StudentProfile,
  SubjectMark,
  UniversityProgramme,
} from '../types';
import { DEMO_STUDENT_PROFILE } from '../data/demoProfile';
import { TEST_STUDENTS } from '../data/testProfiles';
import { CAREERS_DATABASE } from '../data/careersData';
import { UNIVERSITIES_DATABASE } from '../data/universitiesData';
import { calculateCareerMatches, determineCareerArchetype } from '../utils/scoringEngine';

export type NavigationTab =
  | 'landing'
  | 'onboarding'
  | 'dashboard'
  | 'discover'
  | 'careers'
  | 'universities'
  | 'what-if'
  | 'roadmap'
  | 'planner'
  | 'funding'
  | 'saved'
  | 'report';

interface StudentContextType {
  profile: StudentProfile | null;
  topMatches: CareerMatchResult[];
  alternativeMatches: CareerMatchResult[];
  categorizedMatches: {
    strongMatches: CareerMatchResult[];
    worthExploring: CareerMatchResult[];
    exploreWithCaution: CareerMatchResult[];
  };
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedCareer: Career | null;
  setSelectedCareer: (career: Career | null) => void;
  selectedProgramme: UniversityProgramme | null;
  setSelectedProgramme: (programme: UniversityProgramme | null) => void;
  isAskPilotOpen: boolean;
  setIsAskPilotOpen: (open: boolean) => void;
  initialPilotQuestion: string;
  setInitialPilotQuestion: (q: string) => void;

  // New assessment & academic modal state
  isNewAssessmentActive: boolean;
  startNewAssessment: () => void;
  isNewAssessmentModalOpen: boolean;
  setIsNewAssessmentModalOpen: (open: boolean) => void;
  isEditAcademicModalOpen: boolean;
  setIsEditAcademicModalOpen: (open: boolean) => void;
  updateProfileSubjects: (newSubjects: SubjectMark[]) => void;

  // Actions
  updateProfile: (updates: Partial<StudentProfile>) => void;
  saveProfileAndCalculate: (newProfile: StudentProfile) => void;
  loadDemoProfile: () => void;
  loadTestProfile: (studentKey: string) => void;
  clearAllData: () => void;

  // Saved items
  toggleSaveCareer: (careerId: string) => void;
  toggleSaveUniversity: (programmeId: string) => void;
  isCareerSaved: (careerId: string) => boolean;
  isUniversitySaved: (programmeId: string) => boolean;

  // Applications planner
  applications: ApplicationItem[];
  addApplication: (programme: UniversityProgramme) => void;
  updateApplicationStatus: (appId: string, status: ApplicationItem['status']) => void;
  toggleChecklistItem: (appId: string, checklistId: string) => void;
  removeApplication: (appId: string) => void;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const STORAGE_KEY_PROFILE = 'pathpilot_student_profile_v1';
const STORAGE_KEY_APPS = 'pathpilot_applications_v1';
const STORAGE_KEY_THEME = 'pathpilot_theme_v1';

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<StudentProfile | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<NavigationTab>(() => {
    return profile ? 'dashboard' : 'landing';
  });

  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [selectedProgramme, setSelectedProgramme] = useState<UniversityProgramme | null>(null);
  const [isAskPilotOpen, setIsAskPilotOpen] = useState(false);
  const [initialPilotQuestion, setInitialPilotQuestion] = useState('');

  // Assessment & Academic Modal State
  const [isNewAssessmentActive, setIsNewAssessmentActive] = useState(false);
  const [isNewAssessmentModalOpen, setIsNewAssessmentModalOpen] = useState(false);
  const [isEditAcademicModalOpen, setIsEditAcademicModalOpen] = useState(false);

  const [applications, setApplications] = useState<ApplicationItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_APPS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'app-demo-1',
        programmeId: 'uct-beng-biomedical',
        universityName: 'University of Cape Town',
        programmeName: 'BSc (Eng) Electrical and Computer Engineering (Biomedical stream)',
        status: 'Preparing',
        deadline: '31 July 2026',
        notes: 'Gathering Grade 11 final IEB results and certified ID copy.',
        checklist: [
          { id: 'c1', label: 'Research faculty prospectus & subject requirements', isDone: true },
          { id: 'c2', label: 'Check APS and minimum math benchmark (75%)', isDone: true },
          { id: 'c3', label: 'Prepare certified copy of ID / passport', isDone: true },
          { id: 'c4', label: 'Upload latest Grade 11 / Grade 12 term reports', isDone: false },
          { id: 'c5', label: 'Submit online application form before 31 July deadline', isDone: false },
          { id: 'c6', label: 'Apply for UCT Entrance & Allan Gray Fellowships', isDone: false },
        ],
      },
    ];
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_THEME);
      if (stored !== null) return stored === 'true';
    } catch {
      // fallback
    }
    return true; // default modern dark gradient style
  });

  useEffect(() => {
    try {
      if (profile) {
        localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
      } else {
        localStorage.removeItem(STORAGE_KEY_PROFILE);
      }
    } catch (e) {
      console.warn('Could not persist profile', e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(applications));
    } catch (e) {
      console.warn('Could not persist applications', e);
    }
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_THEME, String(isDarkMode));
    } catch {
      // ignore
    }
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Compute career matches dynamically
  const { topMatches, alternativeMatches, categorizedMatches } = React.useMemo(() => {
    if (!profile) {
      return {
        topMatches: [],
        alternativeMatches: [],
        categorizedMatches: { strongMatches: [], worthExploring: [], exploreWithCaution: [] },
      };
    }
    return calculateCareerMatches(profile);
  }, [profile]);

  const updateProfile = (updates: Partial<StudentProfile>) => {
    setProfile((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      const archetype = determineCareerArchetype(updated.riasecScores, updated.workStyleTraits);
      updated.careerStyle = archetype;
      return updated;
    });
  };

  const saveProfileAndCalculate = (newProfile: StudentProfile) => {
    const archetype = determineCareerArchetype(newProfile.riasecScores, newProfile.workStyleTraits);
    const assessmentDate =
      newProfile.assessmentDate ||
      new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const complete: StudentProfile = {
      ...newProfile,
      careerStyle: archetype,
      assessmentDate,
    };
    setProfile(complete);
    setIsNewAssessmentActive(false);
    setActiveTab('report');
  };

  const startNewAssessment = () => {
    setIsNewAssessmentActive(true);
    setIsNewAssessmentModalOpen(false);
    setActiveTab('onboarding');
  };

  const updateProfileSubjects = (newSubjects: SubjectMark[]) => {
    setProfile((prev) => {
      if (!prev) return null;
      const updated: StudentProfile = {
        ...prev,
        subjects: newSubjects,
      };
      const archetype = determineCareerArchetype(updated.riasecScores, updated.workStyleTraits);
      updated.careerStyle = archetype;
      return updated;
    });
  };

  const loadDemoProfile = () => {
    setProfile(DEMO_STUDENT_PROFILE);
    setIsNewAssessmentActive(false);
    setActiveTab('dashboard');
  };

  const loadTestProfile = (studentKey: string) => {
    const testStudent = TEST_STUDENTS[studentKey];
    if (testStudent) {
      setProfile(testStudent);
      setIsNewAssessmentActive(false);
      setActiveTab('dashboard');
    }
  };

  const clearAllData = () => {
    setProfile(null);
    setApplications([]);
    setIsNewAssessmentActive(false);
    localStorage.removeItem(STORAGE_KEY_PROFILE);
    localStorage.removeItem(STORAGE_KEY_APPS);
    setActiveTab('landing');
  };

  const toggleSaveCareer = (careerId: string) => {
    if (!profile) return;
    const current = profile.savedCareerIds || [];
    const isSaved = current.includes(careerId);
    const updated = isSaved ? current.filter((id) => id !== careerId) : [...current, careerId];
    updateProfile({ savedCareerIds: updated });
  };

  const toggleSaveUniversity = (programmeId: string) => {
    if (!profile) return;
    const current = profile.savedUniversityIds || [];
    const isSaved = current.includes(programmeId);
    const updated = isSaved ? current.filter((id) => id !== programmeId) : [...current, programmeId];
    updateProfile({ savedUniversityIds: updated });
  };

  const isCareerSaved = (careerId: string) => {
    return Boolean(profile?.savedCareerIds?.includes(careerId));
  };

  const isUniversitySaved = (programmeId: string) => {
    return Boolean(profile?.savedUniversityIds?.includes(programmeId));
  };

  const addApplication = (programme: UniversityProgramme) => {
    if (applications.some((a) => a.programmeId === programme.id)) {
      setActiveTab('planner');
      return;
    }
    const newApp: ApplicationItem = {
      id: `app-${Date.now()}`,
      programmeId: programme.id,
      universityName: programme.universityName,
      programmeName: programme.programmeName,
      status: 'Interested',
      deadline: programme.applicationCloseDate,
      notes: `Target admission requirement: ${programme.minAdmissionScore} ${programme.admissionSystem}.`,
      checklist: [
        { id: 'c1', label: 'Research faculty prospectus & subject requirements', isDone: true },
        { id: 'c2', label: 'Check admission score & benchmarks', isDone: true },
        { id: 'c3', label: 'Prepare certified copy of ID / passport', isDone: false },
        { id: 'c4', label: 'Upload latest school reports', isDone: false },
        { id: 'c5', label: `Submit application by ${programme.applicationCloseDate}`, isDone: false },
        { id: 'c6', label: 'Apply for university / corporate bursaries', isDone: false },
      ],
    };
    setApplications((prev) => [newApp, ...prev]);
    setActiveTab('planner');
  };

  const updateApplicationStatus = (appId: string, status: ApplicationItem['status']) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status } : app))
    );
  };

  const toggleChecklistItem = (appId: string, checklistId: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        return {
          ...app,
          checklist: app.checklist.map((item) =>
            item.id === checklistId ? { ...item, isDone: !item.isDone } : item
          ),
        };
      })
    );
  };

  const removeApplication = (appId: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== appId));
  };

  return (
    <StudentContext.Provider
      value={{
        profile,
        topMatches,
        alternativeMatches,
        categorizedMatches,
        activeTab,
        setActiveTab,
        selectedCareer,
        setSelectedCareer,
        selectedProgramme,
        setSelectedProgramme,
        isAskPilotOpen,
        setIsAskPilotOpen,
        initialPilotQuestion,
        setInitialPilotQuestion,
        isNewAssessmentActive,
        startNewAssessment,
        isNewAssessmentModalOpen,
        setIsNewAssessmentModalOpen,
        isEditAcademicModalOpen,
        setIsEditAcademicModalOpen,
        updateProfileSubjects,
        updateProfile,
        saveProfileAndCalculate,
        loadDemoProfile,
        loadTestProfile,
        clearAllData,
        toggleSaveCareer,
        toggleSaveUniversity,
        isCareerSaved,
        isUniversitySaved,
        applications,
        addApplication,
        updateApplicationStatus,
        toggleChecklistItem,
        removeApplication,
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
}
