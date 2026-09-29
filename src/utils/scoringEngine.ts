import {
  Career,
  CareerMatchResult,
  EligibilityEvaluation,
  EligibilityStatus,
  MatchResultCategory,
  PersonalityDimensions,
  QuizQuestion,
  RIASECKey,
  RIASECScores,
  StudentProfile,
  SubjectMark,
  UniversityProgramme,
  WorkStyleTraits,
} from '../types';
import { CAREERS_DATABASE } from '../data/careersData';
import { UNIVERSITIES_DATABASE } from '../data/universitiesData';
import {
  checkCriticalPrerequisites,
  doesSubjectMatchRequirement,
  findStudentSubject,
} from './subjectMatching';

/**
 * Calculates RIASEC dimensions (0-100) and Work-Style traits (0-100) from quiz answers.
 */
export function calculateAssessmentScores(
  answers: Record<number, string | string[]>,
  questions: QuizQuestion[]
): {
  riasecScores: RIASECScores;
  personalityDimensions: PersonalityDimensions;
  workStyleTraits: WorkStyleTraits;
} {
  const rawRiasec: RIASECScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  const rawWorkStyles: WorkStyleTraits = {
    analytical: 0,
    collaborative: 0,
    independent: 0,
    structured: 0,
    adaptable: 0,
    detailOriented: 0,
    leadershipOriented: 0,
    peopleOriented: 0,
  };

  questions.forEach((q) => {
    const chosen = answers[q.id];
    if (!chosen) return;

    const chosenIds = Array.isArray(chosen) ? chosen : [chosen];
    chosenIds.forEach((id) => {
      const opt = q.options.find((o) => o.id === id);
      if (!opt) return;

      if (opt.riasecEffect) {
        for (const [key, val] of Object.entries(opt.riasecEffect)) {
          rawRiasec[key as RIASECKey] += val || 0;
        }
      }

      if (opt.workStyleEffect) {
        for (const [key, val] of Object.entries(opt.workStyleEffect)) {
          const k = key as keyof WorkStyleTraits;
          if (rawWorkStyles[k] !== undefined) {
            rawWorkStyles[k] += val || 0;
          }
        }
      }
    });
  });

  // Normalize RIASEC into 0-100 dimensions
  const maxRiasec = Math.max(...Object.values(rawRiasec), 1);
  const personalityDimensions: PersonalityDimensions = {
    investigative: Math.min(100, Math.round((rawRiasec.I / maxRiasec) * 100)),
    creative: Math.min(100, Math.round((rawRiasec.A / maxRiasec) * 100)),
    social: Math.min(100, Math.round((rawRiasec.S / maxRiasec) * 100)),
    practical: Math.min(100, Math.round((rawRiasec.R / maxRiasec) * 100)),
    enterprising: Math.min(100, Math.round((rawRiasec.E / maxRiasec) * 100)),
    organised: Math.min(100, Math.round((rawRiasec.C / maxRiasec) * 100)),
  };

  // Normalize Work-Style traits into 0-100 scale
  const maxTrait = Math.max(...Object.values(rawWorkStyles), 1);
  const workStyleTraits: WorkStyleTraits = {
    analytical: Math.min(100, Math.round(((rawWorkStyles.analytical || 1) / maxTrait) * 100)),
    collaborative: Math.min(100, Math.round(((rawWorkStyles.collaborative || 1) / maxTrait) * 100)),
    independent: Math.min(100, Math.round(((rawWorkStyles.independent || 1) / maxTrait) * 100)),
    structured: Math.min(100, Math.round(((rawWorkStyles.structured || 1) / maxTrait) * 100)),
    adaptable: Math.min(100, Math.round(((rawWorkStyles.adaptable || 1) / maxTrait) * 100)),
    detailOriented: Math.min(100, Math.round(((rawWorkStyles.detailOriented || 1) / maxTrait) * 100)),
    leadershipOriented: Math.min(100, Math.round(((rawWorkStyles.leadershipOriented || 1) / maxTrait) * 100)),
    peopleOriented: Math.min(100, Math.round(((rawWorkStyles.peopleOriented || 1) / maxTrait) * 100)),
  };

  return { riasecScores: rawRiasec, personalityDimensions, workStyleTraits };
}

/**
 * Determines a nuanced personality archetype without pre-determining a specific career.
 */
export function determineCareerArchetype(
  scores: RIASECScores,
  workStyles?: WorkStyleTraits
): {
  title: string;
  description: string;
  traits: string[];
  dominantDimensions: string[];
} {
  const sorted = (Object.entries(scores) as [RIASECKey, number][]).sort((a, b) => b[1] - a[1]);
  const primary = sorted[0]?.[0] || 'I';
  const secondary = sorted[1]?.[0] || 'A';

  const dimNames: Record<RIASECKey, string> = {
    I: 'Investigative',
    A: 'Creative',
    S: 'Social',
    R: 'Practical',
    E: 'Enterprising',
    C: 'Organised',
  };

  const key = `${primary}-${secondary}`;
  const reverseKey = `${secondary}-${primary}`;

  const archetypes: Record<string, { title: string; description: string; traits: string[] }> = {
    'I-A': {
      title: 'The Analytical Explorer',
      description: 'You enjoy understanding how things work, investigating difficult problems, and learning new information. You also show a strong preference for independent thinking and evidence-based decisions.',
      traits: ['Analytical Mindset', 'Independent Thinker', 'Deep Curiosity', 'Evidence-Driven'],
    },
    'I-R': {
      title: 'The Investigative Builder',
      description: 'You combine systematic intellectual inquiry with an interest in tangible mechanics, functional systems, and empirical reality.',
      traits: ['Technical Inquiry', 'Empirical Problem Solving', 'Systems-Minded', 'Hands-on Logic'],
    },
    'I-S': {
      title: 'The Human-Centered Investigator',
      description: 'You are drawn to understanding complex phenomena and applying rigorous scientific or analytical insight to directly help and empower people.',
      traits: ['Empathetic Analysis', 'Purpose-Driven', 'Insightful Listener', 'Curious Researcher'],
    },
    'I-C': {
      title: 'The Systematic Analyst',
      description: 'You excel at finding order in data, structuring information cleanly, and testing models with disciplined accuracy.',
      traits: ['Methodical', 'High Precision', 'Logical Integrity', 'Detail-Oriented'],
    },
    'I-E': {
      title: 'The Strategic Problem Solver',
      description: 'You combine deep cognitive exploration with a desire to take initiative, mobilize projects, and turn analytical insights into action.',
      traits: ['Strategic Vision', 'Intellectual Initiative', 'Decisive', 'Growth-Focused'],
    },
    'A-I': {
      title: 'The Creative Explorer',
      description: 'You thrive when generating original concepts, challenging conventional viewpoints, and exploring novel ideas through design, storytelling, or experimentation.',
      traits: ['Original Thinker', 'Concept Crafter', 'Intuitive Discovery', 'Aesthetic Sensitivity'],
    },
    'A-S': {
      title: 'The Creative Communicator',
      description: 'You express original ideas to connect deeply with people, foster empathy, and create meaningful cultural or visual impact.',
      traits: ['Storyteller', 'Human Resonance', 'Expressive', 'Collaborative Spirit'],
    },
    'A-E': {
      title: 'The Visionary Innovator',
      description: 'You enjoy creating bold new ideas, pitching novel concepts, and inspiring others to step outside traditional boundaries.',
      traits: ['Visionary', 'Creative Catalyst', 'Bold Perspective', 'Adaptive'],
    },
    'S-I': {
      title: 'The Insightful Educator',
      description: 'You have a natural gift for understanding people, breaking down difficult topics with patience, and supporting others to reach their potential.',
      traits: ['Empathetic Guide', 'Patient Teacher', 'Human Understanding', 'Supportive'],
    },
    'S-E': {
      title: 'The Collaborative Catalyst',
      description: 'You thrive when mobilizing groups around shared causes, inspiring teamwork, and cultivating strong interpersonal trust.',
      traits: ['Team Leader', 'Empathetic Mobilizer', 'Community Builder', 'Persuasive'],
    },
    'S-C': {
      title: 'The Supportive Coordinator',
      description: 'You ensure people and organizations function harmoniously by combining genuine empathy with clear organizational consistency.',
      traits: ['Reliable Ally', 'Careful Organizer', 'Harmonious Flow', 'Service-Minded'],
    },
    'R-I': {
      title: 'The Practical Specialist',
      description: 'You are at your best when working with tangible equipment, materials, and real-world systems, backed by rigorous functional logic.',
      traits: ['Hands-on Mastery', 'Real-World Focus', 'Technical Execution', 'Physical Insight'],
    },
    'R-C': {
      title: 'The Precision Craftsman',
      description: 'You take pride in building, repairing, and operating physical or technical systems with high accuracy, order, and safety.',
      traits: ['Careful Craft', 'Systematic Builder', 'Reliable Execution', 'Quality Conscious'],
    },
    'E-I': {
      title: 'The Strategic Builder',
      description: 'You are energized by spotting opportunities, orchestrating resources, and driving initiatives forward with analytical clarity.',
      traits: ['Enterprising Mindset', 'Strategic Acumen', 'Goal-Oriented', 'Decisive'],
    },
    'E-S': {
      title: 'The Inspirational Leader',
      description: 'You bring people together with enthusiasm and vision, championing causes and guiding teams toward meaningful shared goals.',
      traits: ['Motivator', 'Diplomatic', 'Visionary Communicator', 'Action-Oriented'],
    },
    'E-C': {
      title: 'The Enterprise Architect',
      description: 'You build and direct organized business operations, managing growth while safeguarding commercial integrity and efficiency.',
      traits: ['Commercial Acumen', 'Organized Leadership', 'Risk-Aware', 'Operational Driver'],
    },
    'C-I': {
      title: 'The Systematic Planner',
      description: 'You thrive when bringing structure, predictability, and rigorous quality to information, processes, and complex data.',
      traits: ['Methodical Clarity', 'Process Optimizer', 'Data Integrity', 'High Reliability'],
    },
    'C-E': {
      title: 'The Operational Director',
      description: 'You combine systematic order with leadership, making sure large operations, budgets, and projects run smoothly without friction.',
      traits: ['Execution Excellence', 'Standards Guardian', 'Logistical Precision', 'Pragmatic Leader'],
    },
  };

  const selected = archetypes[key] || archetypes[reverseKey] || {
    title: 'The Analytical Explorer',
    description: 'You enjoy understanding how things work, investigating difficult problems, and learning new information with independent, evidence-based reasoning.',
    traits: ['Analytical Mindset', 'Adaptable Problem Solver', 'Evidence-Driven', 'Curious Thinker'],
  };

  return {
    ...selected,
    dominantDimensions: [dimNames[primary], dimNames[secondary]],
  };
}

/**
 * Calculates Career Matches using the 3-Component Scoring Framework:
 * - Personality & Work Style (30%)
 * - Interests & Curiosity (30%)
 * - Academic Alignment (30%) [With deterministic Academic Gate on high-dependency careers]
 * - Lifestyle & Work Preferences (10%)
 */
export function calculateCareerMatches(profile: StudentProfile): {
  topMatches: CareerMatchResult[];
  alternativeMatches: CareerMatchResult[];
  categorizedMatches: {
    strongMatches: CareerMatchResult[];
    worthExploring: CareerMatchResult[];
    exploreWithCaution: CareerMatchResult[];
  };
} {
  const { riasecScores, interests, subjects, workPreferences, workStyleTraits } = profile;

  // Normalize student's RIASEC scores (0 to 1)
  const maxRiasec = Math.max(...Object.values(riasecScores), 1);
  const normalizedRiasec: Record<RIASECKey, number> = {
    R: (riasecScores.R || 0) / maxRiasec,
    I: (riasecScores.I || 0) / maxRiasec,
    A: (riasecScores.A || 0) / maxRiasec,
    S: (riasecScores.S || 0) / maxRiasec,
    E: (riasecScores.E || 0) / maxRiasec,
    C: (riasecScores.C || 0) / maxRiasec,
  };

  const scoredCareers: CareerMatchResult[] = CAREERS_DATABASE.map((career) => {
    // -----------------------------------------------------------------
    // 1. COMPONENT A: PERSONALITY & WORK STYLE (30% weight)
    // -----------------------------------------------------------------
    let riasecWeightedSum = 0;
    let totalRiasecWeights = 0;
    for (const [dim, weight] of Object.entries(career.riasecWeights)) {
      const k = dim as RIASECKey;
      riasecWeightedSum += (normalizedRiasec[k] || 0) * (weight || 0);
      totalRiasecWeights += weight || 0;
    }
    const baseRiasecScore = totalRiasecWeights > 0 ? (riasecWeightedSum / totalRiasecWeights) * 100 : 60;

    // Incorporate work-style alignment bonus
    let workStyleBonus = 0;
    if (workStyleTraits) {
      if (career.category.includes('Technology') || career.category.includes('Science') || career.category.includes('Finance')) {
        workStyleBonus += (workStyleTraits.analytical / 100) * 10;
      }
      if (career.category.includes('Medicine') || career.category.includes('Healthcare')) {
        workStyleBonus += (workStyleTraits.peopleOriented / 100) * 8;
      }
      if (career.category.includes('Creative') || career.category.includes('Design')) {
        workStyleBonus += (workStyleTraits.independent / 100) * 10;
      }
      if (career.category.includes('Business') || career.category.includes('Entrepreneurship')) {
        workStyleBonus += (workStyleTraits.leadershipOriented / 100) * 10;
      }
      if (career.category.includes('Accounting') || career.category.includes('Environment')) {
        workStyleBonus += (workStyleTraits.structured / 100) * 8;
      }
    }

    const personalityFit = Math.min(96, Math.max(45, Math.round(baseRiasecScore * 0.9 + workStyleBonus)));

    // -----------------------------------------------------------------
    // 2. COMPONENT B: INTERESTS (30% weight)
    // -----------------------------------------------------------------
    const isUnsureInterests = interests.some((i) => i.toLowerCase().includes('not sure') || i.toLowerCase().includes('unsure'));
    let interestFit = 70; // baseline if student selected "I'm not sure yet"

    const matchingInterests: string[] = [];
    if (!isUnsureInterests && interests.length > 0) {
      career.primaryInterests.forEach((careerInterest) => {
        const hasMatch = interests.some(
          (stuInterest) =>
            stuInterest.toLowerCase().includes(careerInterest.toLowerCase()) ||
            careerInterest.toLowerCase().includes(stuInterest.toLowerCase())
        );
        if (hasMatch) {
          matchingInterests.push(careerInterest);
        }
      });

      // Category matching
      const categoryMatches = interests.some(
        (stuInterest) =>
          career.category.toLowerCase().includes(stuInterest.toLowerCase()) ||
          stuInterest.toLowerCase().includes(career.category.toLowerCase())
      );

      const ratio = career.primaryInterests.length > 0 ? matchingInterests.length / career.primaryInterests.length : 0.5;
      interestFit = Math.min(98, Math.max(40, Math.round(ratio * 70 + (categoryMatches ? 25 : 10))));
    } else if (interests.length === 0) {
      interestFit = 65;
    }

    // -----------------------------------------------------------------
    // 3. COMPONENT C: ACADEMIC ALIGNMENT (30% weight)
    // Deterministic subject matching, benchmarks, and critical prerequisite gates
    // -----------------------------------------------------------------
    const dependencyLevel = career.subjectDependencyLevel || career.requirements?.subjectDependencyLevel || 'medium';
    const criticalPrereqs = career.requirements?.criticalPrerequisites || [];
    const prereqCheck = checkCriticalPrerequisites(criticalPrereqs, subjects);

    const subjectRelevanceList: CareerMatchResult['subjectRelevance'] = [];
    let benchmarkPointsSum = 0;
    const benchmarkEntries = Object.entries(career.minimumSubjectBenchmarks);

    for (const [reqSubj, benchmark] of benchmarkEntries) {
      const studentSub = findStudentSubject(reqSubj, subjects);
      const isCritical = criticalPrereqs.some((cp) => doesSubjectMatchRequirement(cp, reqSubj));

      if (studentSub) {
        const diff = studentSub.mark - benchmark;
        if (diff >= 0) {
          benchmarkPointsSum += 1.0;
          subjectRelevanceList.push({
            subject: reqSubj,
            studentMark: studentSub.mark,
            benchmark,
            status: 'on_track',
            note: `${studentSub.mark}% meets or exceeds benchmark (${benchmark}%).`,
            isCritical,
          });
        } else if (diff >= -8) {
          benchmarkPointsSum += 0.75;
          subjectRelevanceList.push({
            subject: reqSubj,
            studentMark: studentSub.mark,
            benchmark,
            status: 'almost_there',
            note: `${studentSub.mark}% is within ${Math.abs(diff)}% of benchmark (${benchmark}%).`,
            isCritical,
          });
        } else {
          benchmarkPointsSum += 0.4;
          subjectRelevanceList.push({
            subject: reqSubj,
            studentMark: studentSub.mark,
            benchmark,
            status: 'needs_work',
            note: `${studentSub.mark}% is ${Math.abs(diff)}% below benchmark (${benchmark}%).`,
            isCritical,
          });
        }
      } else {
        // Student does NOT take this subject
        if (isCritical && dependencyLevel === 'high') {
          // Critical prerequisite missing in high dependency career (e.g. Physics for Medical Physicist)
          benchmarkPointsSum += 0.0;
          subjectRelevanceList.push({
            subject: reqSubj,
            benchmark,
            status: 'not_taken',
            note: `Critical Prerequisite. Not currently on your subject list. Standard university entry requires this subject.`,
            isCritical: true,
          });
        } else if (dependencyLevel === 'high') {
          benchmarkPointsSum += 0.1;
          subjectRelevanceList.push({
            subject: reqSubj,
            benchmark,
            status: 'not_taken',
            note: `High-dependency subject not on your current list.`,
            isCritical,
          });
        } else if (dependencyLevel === 'medium') {
          benchmarkPointsSum += 0.35;
          subjectRelevanceList.push({
            subject: reqSubj,
            benchmark,
            status: 'not_taken',
            note: `Recommended subject. Alternative university pathways or bridging routes may be available.`,
            isCritical,
          });
        } else {
          // low dependency
          benchmarkPointsSum += 0.6;
          subjectRelevanceList.push({
            subject: reqSubj,
            benchmark,
            status: 'not_taken',
            note: `Helpful foundation, but flexible entry criteria apply.`,
            isCritical,
          });
        }
      }
    }

    // Baseline calculation of academic score
    let rawAcademicScore =
      benchmarkEntries.length > 0 ? (benchmarkPointsSum / benchmarkEntries.length) * 100 : 70;

    // Student average mark calibration
    const avgStudentMark = subjects.length > 0 ? subjects.reduce((a, s) => a + s.mark, 0) / subjects.length : 65;
    rawAcademicScore = Math.round(rawAcademicScore * 0.8 + (avgStudentMark / 100) * 20);

    // ACADEMIC GATE & CLASSIFICATION
    let academicAlignment = rawAcademicScore;
    let academicStatus: CareerMatchResult['academicStatus'] = 'aligned';
    let resultCategory: MatchResultCategory = 'strong_match';
    const cautionNotes: string[] = [];

    if (dependencyLevel === 'high' && !prereqCheck.isSatisfied) {
      // Hard gate for High Subject Dependency (e.g. Medical Physicist without Physics)
      academicAlignment = Math.min(academicAlignment, 35);
      academicStatus = 'not-currently-aligned';
      resultCategory = 'explore_with_caution';
      cautionNotes.push(
        `Your current subject list does not include ${prereqCheck.missingPrereqs.join(' and ')}, which is important for standard entry into this career.`
      );
    } else if (dependencyLevel === 'medium' && !prereqCheck.isSatisfied) {
      academicAlignment = Math.min(academicAlignment, 58);
      academicStatus = 'moderate';
      resultCategory = 'worth_exploring';
      cautionNotes.push(
        `Alternative pathways or foundation years may be needed without ${prereqCheck.missingPrereqs.join(' and ')}.`
      );
    } else if (rawAcademicScore < 60) {
      academicStatus = 'moderate';
      resultCategory = 'worth_exploring';
    }

    // -----------------------------------------------------------------
    // 4. COMPONENT D: LIFESTYLE & WORK PREFERENCES (10% weight)
    // -----------------------------------------------------------------
    let lifestyleScore = 65;
    if (workPreferences) {
      // Study duration check
      if (career.studyDurationYears <= (workPreferences.maxStudyDurationYears || 5) + 0.5) {
        lifestyleScore += 15;
      }
      // Environment check
      if (workPreferences.environment && workPreferences.environment.length > 0) {
        const envMatches = career.workEnvironments.some((ce) =>
          workPreferences.environment.some((se) => ce.toLowerCase().includes(se.toLowerCase()) || se.toLowerCase().includes(ce.toLowerCase()))
        );
        if (envMatches) lifestyleScore += 15;
      }
    }
    const lifestyleFit = Math.min(100, Math.max(50, lifestyleScore));

    // -----------------------------------------------------------------
    // 5. COMBINED FIT SCORE & FINAL CATEGORY ASSIGNMENT
    // -----------------------------------------------------------------
    const rawFit = Math.round(
      personalityFit * 0.3 + interestFit * 0.3 + academicAlignment * 0.3 + lifestyleFit * 0.1
    );

    let fitScore = rawFit;
    if (resultCategory === 'explore_with_caution') {
      // Capped so it NEVER appears as a top 90%+ match when missing critical subjects!
      fitScore = Math.min(rawFit, 68);
    } else {
      fitScore = Math.min(96, Math.max(45, rawFit));
      if (fitScore >= 78 && academicAlignment >= 65) {
        resultCategory = 'strong_match';
      } else {
        resultCategory = 'worth_exploring';
      }
    }

    // Explainable reasons
    const matchReasons: string[] = [];
    if (personalityFit >= 75) {
      matchReasons.push('Strongly matches your natural problem-solving and thinking style.');
    }
    if (matchingInterests.length > 0) {
      matchReasons.push(`Directly connects with your interest in ${matchingInterests.slice(0, 3).join(', ')}.`);
    } else if (interests.length > 0) {
      matchReasons.push(`Shares common themes with your selected curiosity areas.`);
    }

    const likedRelevantSubjects = subjects.filter(
      (s) => s.isLiked && career.keySubjects.some((ks) => doesSubjectMatchRequirement(ks, s.name))
    );
    if (likedRelevantSubjects.length > 0) {
      matchReasons.push(`You explicitly enjoy ${likedRelevantSubjects.map((s) => s.name).join(' & ')}.`);
    }

    const strengths: string[] = [];
    const areasToDevelop: string[] = [];

    subjectRelevanceList.forEach((sr) => {
      if (sr.status === 'on_track') {
        strengths.push(`Solid marks in ${sr.subject} (${sr.studentMark}% vs ${sr.benchmark}% target).`);
      } else if (sr.status === 'almost_there') {
        areasToDevelop.push(`Lift ${sr.subject} slightly (${sr.studentMark}% recorded vs ${sr.benchmark}% benchmark).`);
      } else if (sr.status === 'needs_work') {
        areasToDevelop.push(`Prioritise tutoring in ${sr.subject} (${sr.studentMark}% vs ${sr.benchmark}% benchmark).`);
      }
    });

    if (strengths.length === 0) {
      strengths.push('High curiosity and versatile foundational skills.');
    }
    if (areasToDevelop.length === 0) {
      areasToDevelop.push('Maintain consistent academic consistency and explore personal passion projects.');
    }

    return {
      career,
      fitScore,
      personalityFit,
      interestFit,
      academicAlignment,
      lifestyleFit,
      resultCategory,
      academicStatus,
      criticalMissingSubjects: prereqCheck.missingPrereqs,
      cautionNotes,
      matchReasons,
      strengths,
      areasToDevelop,
      subjectRelevance: subjectRelevanceList,
    };
  });

  // Sort: Strong matches first (sorted by fitScore), then Worth Exploring, then Explore with Caution
  const strongMatches = scoredCareers.filter((c) => c.resultCategory === 'strong_match').sort((a, b) => b.fitScore - a.fitScore);
  const worthExploring = scoredCareers.filter((c) => c.resultCategory === 'worth_exploring').sort((a, b) => b.fitScore - a.fitScore);
  const exploreWithCaution = scoredCareers.filter((c) => c.resultCategory === 'explore_with_caution').sort((a, b) => b.fitScore - a.fitScore);

  // Top matches displayed on the main dashboard
  const topMatches = [...strongMatches, ...worthExploring].slice(0, 6);
  // Alternative matches: either high-potential exploratory matches or others
  const alternativeMatches = [...worthExploring, ...exploreWithCaution].slice(0, 4);

  return {
    topMatches,
    alternativeMatches,
    categorizedMatches: {
      strongMatches,
      worthExploring,
      exploreWithCaution,
    },
  };
}

// Convert South African percentage mark (0-100) to standard NSC/IEB 1-7 level scale
export function convertPercentageToNSCLevel(mark: number): number {
  if (mark >= 80) return 7;
  if (mark >= 70) return 6;
  if (mark >= 60) return 5;
  if (mark >= 50) return 4;
  if (mark >= 40) return 3;
  if (mark >= 30) return 2;
  return 1;
}

// Calculate South African APS or international points according to verified university institutional rules
export function calculateUniversityAdmissionScore(
  programme: UniversityProgramme,
  subjects: SubjectMark[]
): { score: number; scoreName: string; explanation: string } {
  const cleanSubjects = subjects.filter((s) => s.name.trim().length > 0);

  // UCT Faculty Points Score (FPS)
  if (programme.universityName.includes('Cape Town') || programme.shortName === 'UCT') {
    const academicSubs = cleanSubjects
      .filter((s) => !s.name.toLowerCase().includes('life orientation'))
      .sort((a, b) => b.mark - a.mark)
      .slice(0, 6);

    const fps = academicSubs.reduce((sum, s) => sum + s.mark, 0);
    return {
      score: fps,
      scoreName: 'UCT Faculty Points Score (FPS)',
      explanation: `Sum of percentages across your 6 best academic subjects (excluding Life Orientation). Max 600. Your score: ${fps}.`,
    };
  }

  // Wits University APS
  if (programme.universityName.includes('Witwatersrand') || programme.shortName === 'Wits') {
    const nonLO = cleanSubjects.filter((s) => !s.name.toLowerCase().includes('life orientation'));
    let witsScore = 0;
    nonLO.forEach((s) => {
      let pts = convertPercentageToNSCLevel(s.mark);
      if (s.mark >= 80) pts = 8; // Wits bonus level
      witsScore += pts;
    });

    const top6Wits = nonLO
      .map((s) => {
        let pts = convertPercentageToNSCLevel(s.mark);
        if (s.mark >= 80) pts = 8;
        return pts;
      })
      .sort((a, b) => b - a)
      .slice(0, 6)
      .reduce((a, b) => a + b, 0);

    return {
      score: top6Wits,
      scoreName: 'Wits Admission Points Score (APS)',
      explanation: `Calculated from your 6 best subjects (excluding LO) using Wits' weighted scale (Level 7+ awarded 8 points). Your score: ${top6Wits}.`,
    };
  }

  // Standard National APS (UP, Stellenbosch, etc.)
  if (programme.admissionSystem === 'APS') {
    const nonLO = cleanSubjects
      .filter((s) => !s.name.toLowerCase().includes('life orientation'))
      .sort((a, b) => b.mark - a.mark)
      .slice(0, 6);

    const standardAps = nonLO.reduce((sum, s) => sum + convertPercentageToNSCLevel(s.mark), 0);
    return {
      score: standardAps,
      scoreName: 'Standard National APS',
      explanation: `Calculated from levels 1-7 across your 6 best subjects (excluding Life Orientation, max 42). Your score: ${standardAps}.`,
    };
  }

  // International UK / US / Australia conversions
  if (programme.admissionSystem === 'UCAS/A-Levels') {
    const avg = subjects.length > 0 ? subjects.reduce((a, s) => a + s.mark, 0) / subjects.length : 0;
    return {
      score: Math.round(avg),
      scoreName: 'Academic Equivalent Average (%)',
      explanation: `A-Level equivalent benchmark assessed against your overall academic percentage (${Math.round(avg)}%).`,
    };
  }

  if (programme.admissionSystem === 'ATAR') {
    const avg = subjects.length > 0 ? subjects.reduce((a, s) => a + s.mark, 0) / subjects.length : 0;
    const estAtar = Math.min(99.95, Math.max(50, Math.round(avg * 1.12 * 10) / 10));
    return {
      score: estAtar,
      scoreName: 'Estimated ATAR Equivalent',
      explanation: `Estimated Australian Tertiary Admission Rank derived from your high school marks profile (~${estAtar}).`,
    };
  }

  // Fallback GPA / Percentage
  const generalAvg = subjects.length > 0 ? subjects.reduce((a, s) => a + s.mark, 0) / subjects.length : 0;
  return {
    score: Math.round(generalAvg),
    scoreName: 'Grade Average (%)',
    explanation: `Calculated from overall curriculum marks average (${Math.round(generalAvg)}%).`,
  };
}

/**
 * Deterministically evaluates programme eligibility against published university rules.
 * Uses exact subject matching to prevent incorrect subject inferences.
 */
export function evaluateProgrammeEligibility(
  programme: UniversityProgramme,
  subjects: SubjectMark[]
): EligibilityEvaluation {
  const { score, scoreName, explanation } = calculateUniversityAdmissionScore(programme, subjects);
  const scoreDifference = score - programme.minAdmissionScore;

  let allSubjectsPass = true;
  let hasAlmostThereSubject = false;

  const subjectEvaluations = programme.subjectRequirements.map((req) => {
    const studentSub = findStudentSubject(req.subject, subjects);

    if (!studentSub) {
      allSubjectsPass = false;
      return {
        subjectName: req.subject,
        requiredMark: req.minPercentage,
        studentMark: undefined,
        difference: -req.minPercentage,
        status: 'not_met' as EligibilityStatus,
        feedback: `Requirement: ${req.minPercentage}%. Subject not found on your current list.`,
      };
    }

    const diff = studentSub.mark - req.minPercentage;
    let status: EligibilityStatus = 'not_met';
    let feedback = '';

    if (diff >= 0) {
      status = 'on_track';
      feedback = `✓ Currently on track (${studentSub.mark}% vs required ${req.minPercentage}%).`;
    } else if (diff >= -6) {
      status = 'almost_there';
      hasAlmostThereSubject = true;
      allSubjectsPass = false;
      feedback = `🟡 ${Math.abs(diff)} percentage points to target (${studentSub.mark}% vs required ${req.minPercentage}%). Improving this is achievable.`;
    } else {
      status = 'not_met';
      allSubjectsPass = false;
      feedback = `🔴 ${Math.abs(diff)} percentage points to target (${studentSub.mark}% vs required ${req.minPercentage}%). Recommended priority for focused tutoring.`;
    }

    return {
      subjectName: req.subject,
      requiredMark: req.minPercentage,
      studentMark: studentSub.mark,
      difference: diff,
      status,
      feedback,
    };
  });

  let overallStatus: EligibilityStatus = 'not_met';
  if (scoreDifference >= 0 && allSubjectsPass) {
    overallStatus = 'on_track';
  } else if (
    (scoreDifference >= -2 && allSubjectsPass) ||
    (scoreDifference >= 0 && hasAlmostThereSubject)
  ) {
    overallStatus = 'almost_there';
  } else {
    overallStatus = 'not_met';
  }

  let overallFeedback = '';
  if (overallStatus === 'on_track') {
    overallFeedback = `Based on published requirements, your estimated ${scoreName} (${score}) and subject marks meet published minimums for this programme.`;
  } else if (overallStatus === 'almost_there') {
    overallFeedback = `You are very close! You are within a few percentage points of meeting published criteria. Focused improvement will bring this within reach.`;
  } else {
    overallFeedback = `Your current marks are below published minimum thresholds. Consider checking academic priorities or exploring alternative pathways.`;
  }

  return {
    programmeId: programme.id,
    status: overallStatus,
    calculatedScore: score,
    scoreName,
    scoreDifference,
    scoreExplanation: explanation,
    subjectEvaluations,
    overallFeedback,
    isCompetitiveDisclaimer:
      'Meeting published minimum benchmarks does not guarantee admission. South African health and engineering programmes select students on high competitive ranking.',
  };
}

/**
 * Runs a What-If simulation comparing base subjects to simulated marks.
 * Identifies newly unlocked degrees and updated point scores.
 */
export function runWhatIfSimulation(
  baseSubjects: SubjectMark[],
  simulatedSubjects: SubjectMark[]
): {
  baseEvaluations: { programme: UniversityProgramme; eval: EligibilityEvaluation }[];
  simulatedEvaluations: { programme: UniversityProgramme; eval: EligibilityEvaluation }[];
  newlyUnlocked: {
    programme: UniversityProgramme;
    newStatus: EligibilityStatus;
    newScore: number;
  }[];
} {
  const baseEvaluations = UNIVERSITIES_DATABASE.map((p) => ({
    programme: p,
    eval: evaluateProgrammeEligibility(p, baseSubjects),
  }));
  const simulatedEvaluations = UNIVERSITIES_DATABASE.map((p) => ({
    programme: p,
    eval: evaluateProgrammeEligibility(p, simulatedSubjects),
  }));

  const newlyUnlocked: {
    programme: UniversityProgramme;
    newStatus: EligibilityStatus;
    newScore: number;
  }[] = [];

  for (let i = 0; i < UNIVERSITIES_DATABASE.length; i++) {
    const prog = UNIVERSITIES_DATABASE[i];
    const baseEval = baseEvaluations[i].eval;
    const simEval = simulatedEvaluations[i].eval;

    if (baseEval.status !== 'on_track' && simEval.status === 'on_track') {
      newlyUnlocked.push({
        programme: prog,
        newStatus: simEval.status,
        newScore: simEval.calculatedScore,
      });
    } else if (baseEval.status === 'not_met' && simEval.status === 'almost_there') {
      newlyUnlocked.push({
        programme: prog,
        newStatus: simEval.status,
        newScore: simEval.calculatedScore,
      });
    }
  }

  return {
    baseEvaluations,
    simulatedEvaluations,
    newlyUnlocked,
  };
}

