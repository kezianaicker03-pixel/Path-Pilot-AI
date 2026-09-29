export type CurriculumType = 'NSC' | 'IEB' | 'Cambridge' | 'A Levels' | 'GCSE' | 'High School Diploma' | 'AP' | 'State/Territory (ATAR)' | 'Other';

export type CountryCode = 'ZA' | 'GB' | 'US' | 'AU' | 'OTHER';

export interface SubjectMark {
  id: string;
  name: string;
  mark: number; // 0 to 100
  isLiked?: boolean;
  isDisliked?: boolean;
}

export type RIASECKey = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export interface RIASECScores {
  R: number; // Realistic
  I: number; // Investigative
  A: number; // Artistic
  S: number; // Social
  E: number; // Enterprising
  C: number; // Conventional
}

export interface WorkPreferences {
  workWith: 'people' | 'technology' | 'ideas' | 'objects' | 'data' | 'combination';
  environment: string[];
  maxStudyDurationYears: number; // 2, 3, 4, 6, 7+ (represented as number)
  priorities: {
    earningPotential: number; // 1 to 5
    jobStability: number;
    helpingPeople: number;
    creativity: number;
    flexibility: number;
    remoteWork: number;
    travel: number;
    workLifeBalance: number;
    leadership: number;
    continuousLearning: number;
  };
}

export interface PersonalityDimensions {
  investigative: number; // 0 - 100
  creative: number;
  social: number;
  practical: number;
  enterprising: number;
  organised: number;
}

export interface WorkStyleTraits {
  analytical: number; // 0 - 100
  collaborative: number;
  independent: number;
  structured: number;
  adaptable: number;
  detailOriented: number;
  leadershipOriented: number;
  peopleOriented: number;
  practical?: number;
}

export type SubjectDependencyLevel = 'low' | 'medium' | 'high';

export interface CareerRequirements {
  requiredOrCommonSubjects: string[];
  stronglyRecommendedSubjects: string[];
  alternativePathways: string[];
  subjectDependencyLevel: SubjectDependencyLevel;
  criticalPrerequisites?: string[]; // Subjects that MUST be present for standard entry
}

export interface StudentProfile {
  name: string;
  country: CountryCode;
  region: string;
  grade: string; // e.g. "Grade 11", "Grade 12", "Year 12"
  curriculum: CurriculumType;
  initialCareerIdeas: string[];
  hasIdeaLevel: 'yes' | 'few' | 'none';
  subjects: SubjectMark[];
  interests: string[];
  riasecScores: RIASECScores;
  personalityDimensions?: PersonalityDimensions;
  workStyleTraits?: WorkStyleTraits;
  workPreferences: WorkPreferences;
  savedCareerIds: string[];
  savedUniversityIds: string[];
  assessmentDate?: string;
  careerStyle?: {
    title: string;
    description: string;
    traits: string[];
    dominantDimensions?: string[];
  };
}

export interface RoadmapStep {
  stage: string; // e.g. "Grade 11", "Grade 12", "Undergraduate Degree", "Postgraduate / Honours", "Internship / Clinical", "Professional Registration", "Licensed Career"
  title: string;
  description: string;
  duration?: string;
  keyActions: string[];
}

export interface Career {
  id: string;
  title: string;
  category: string;
  icon: string;
  tagline: string;
  description: string;
  riasecWeights: Partial<Record<RIASECKey, number>>;
  primaryInterests: string[];
  keySubjects: string[];
  minimumSubjectBenchmarks: Record<string, number>; // e.g. { "Mathematics": 70, "Physical Sciences": 65 }
  studyDuration: string; // e.g. "4-5 years"
  studyDurationYears: number;
  typicalDegrees: string[];
  workEnvironments: string[];
  majorTasks: string[];
  futureSkills: string[];
  relatedCareers: string[];
  isRegulated?: boolean;
  registrationBody?: string;
  roadmap: RoadmapStep[];
  requirements?: CareerRequirements;
  subjectDependencyLevel?: SubjectDependencyLevel;
}

export type MatchResultCategory =
  | 'strong_match' // 🌟 Strong Matches
  | 'worth_exploring' // 👀 Worth Exploring
  | 'explore_with_caution'; // 🚧 Interesting, But Your Current Subjects May Limit This Path

export interface CareerMatchResult {
  career: Career;
  fitScore: number; // 0 - 100 (Overall PathPilot Fit)
  personalityFit: number; // 0 - 100 (Component A)
  interestFit: number; // 0 - 100 (Component B)
  academicAlignment: number; // 0 - 100 (Component C)
  lifestyleFit: number; // 0 - 100
  resultCategory: MatchResultCategory;
  academicStatus: 'aligned' | 'moderate' | 'not-currently-aligned';
  criticalMissingSubjects: string[];
  matchReasons: string[];
  strengths: string[];
  areasToDevelop: string[];
  cautionNotes?: string[];
  subjectRelevance: {
    subject: string;
    studentMark?: number;
    benchmark?: number;
    status: 'on_track' | 'almost_there' | 'needs_work' | 'not_taken';
    note: string;
    isCritical?: boolean;
  }[];
}

export type EligibilityStatus = 'on_track' | 'almost_there' | 'not_met';

export interface SubjectRequirement {
  subject: string;
  minPercentage: number;
  alternativeSubjects?: string[]; // e.g. Mathematical Literacy 80% instead of Maths 70%
}

export interface UniversityProgramme {
  id: string;
  universityName: string;
  shortName: string;
  country: CountryCode;
  city: string;
  faculty?: string;
  programmeName: string;
  degreeType: string; // e.g. "BSc", "BEng", "BCom", "BA"
  durationYears: number;
  careerIds: string[];
  admissionSystem: 'APS' | 'UCAS/A-Levels' | 'GPA' | 'ATAR' | 'Percentage';
  minAdmissionScore: number;
  admissionFormulaDescription: string;
  subjectRequirements: SubjectRequirement[];
  applicationOpenDate: string;
  applicationCloseDate: string;
  approximateAnnualFee?: string;
  estimatedAnnualFees?: string;
  officialProgrammeUrl: string;
  officialAdmissionsUrl: string;
  officialUrl?: string;
  bursaryOpportunities?: string[];
  bursariesAvailable?: string[];
  verifiedDate?: string;
  verificationSource?: string;
  verificationNote?: string;
}

export interface EligibilityEvaluation {
  programmeId: string;
  status: EligibilityStatus;
  calculatedScore: number;
  scoreName: string; // "APS", "ATAR", "GPA", etc.
  scoreDifference: number; // positive = surplus, negative = deficit
  scoreExplanation: string;
  subjectEvaluations: {
    subjectName: string;
    requiredMark: number;
    studentMark?: number;
    difference: number;
    status: EligibilityStatus;
    feedback: string;
  }[];
  overallFeedback: string;
  isCompetitiveDisclaimer: string;
}

export type ApplicationStatus =
  | 'Interested'
  | 'Preparing'
  | 'Applied'
  | 'Awaiting response'
  | 'Offer received'
  | 'Not proceeding';

export interface ChecklistItem {
  id: string;
  label: string;
  isDone: boolean;
}

export interface ApplicationItem {
  id: string;
  programmeId: string;
  universityName: string;
  programmeName: string;
  status: ApplicationStatus;
  deadline: string;
  notes: string;
  checklist: ChecklistItem[];
}

export interface FundingOpportunity {
  id: string;
  name: string;
  provider: string;
  country: CountryCode;
  targetFields: string[];
  coverage: string;
  eligibilitySummary: string;
  type: 'Academic Merit' | 'Financial Need' | 'Equity / Diversity' | 'Corporate / Industry';
  closingDate: string;
  officialUrl: string;
  verifiedDate: string;
}

export interface QuizQuestion {
  id: number;
  type: 'choice_cards' | 'single_choice' | 'top_three' | 'slider_scale';
  scenario: string;
  subtext?: string;
  dimensionCategory?: 'investigative' | 'creative' | 'social' | 'practical' | 'enterprising' | 'organised' | 'workstyle' | 'multidimensional';
  options: {
    id: string;
    label: string;
    description?: string;
    icon?: string;
    riasecEffect?: Partial<Record<RIASECKey, number>>;
    workStyleEffect?: Partial<Record<keyof WorkStyleTraits, number>>;
    interestTag?: string;
  }[];
}
