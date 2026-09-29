import { SubjectMark } from '../types';

/**
 * Normalization & Exact-Subject Matching Engine
 *
 * CRITICAL RULE:
 * - "CAT" (Computer Applications Technology) is NOT "Information Technology" (IT).
 * - "Mathematical Literacy" is NOT "Pure Mathematics".
 * - "Life Sciences" / "Biology" is NOT "Physical Sciences" / "Physics".
 * - Equivalents like "Physical Science" <-> "Physical Sciences" <-> "Physics" ARE recognized.
 */

// Normalized category identifiers
export type NormalizedSubjectCategory =
  | 'pure_mathematics'
  | 'mathematical_literacy'
  | 'physical_sciences'
  | 'life_sciences'
  | 'chemistry'
  | 'information_technology'
  | 'cat'
  | 'accounting'
  | 'business_studies'
  | 'economics'
  | 'english'
  | 'geography'
  | 'history'
  | 'visual_arts'
  | 'dramatic_arts'
  | 'engineering_graphics_and_design'
  | 'consumer_studies'
  | 'music'
  | 'tourism'
  | 'other';

/**
 * Classifies a raw subject name into a canonical subject category.
 */
export function classifySubject(rawName: string): NormalizedSubjectCategory {
  const s = rawName.toLowerCase().trim();

  // 1. Mathematical Literacy vs Pure Mathematics
  if (s.includes('literacy') || s.includes('maths lit') || s.includes('math lit')) {
    return 'mathematical_literacy';
  }
  if (
    s === 'mathematics' ||
    s === 'pure mathematics' ||
    s === 'maths' ||
    s === 'math' ||
    s === 'core mathematics' ||
    s === 'pure maths' ||
    s.includes('calculus') ||
    s === 'a level mathematics' ||
    s === 'ib mathematics'
  ) {
    return 'pure_mathematics';
  }

  // 2. Physical Sciences vs Life Sciences vs Chemistry
  if (
    s === 'physical sciences' ||
    s === 'physical science' ||
    s === 'physics' ||
    s === 'physics & chemistry' ||
    s === 'physics and chemistry' ||
    s === 'natural physical science' ||
    s === 'a level physics' ||
    s === 'ib physics'
  ) {
    return 'physical_sciences';
  }
  if (
    s === 'life sciences' ||
    s === 'life science' ||
    s === 'biology' ||
    s === 'biological sciences' ||
    s === 'human biology' ||
    s === 'a level biology' ||
    s === 'ib biology'
  ) {
    return 'life_sciences';
  }
  if (s === 'chemistry' || s === 'pure chemistry' || s === 'a level chemistry') {
    return 'chemistry';
  }

  // 3. Information Technology (IT) vs Computer Applications Technology (CAT)
  if (
    s === 'computer applications technology' ||
    s === 'cat' ||
    s === 'computer applications'
  ) {
    return 'cat';
  }
  if (
    s === 'information technology' ||
    s === 'it' ||
    s === 'computer science' ||
    s === 'software engineering' ||
    s === 'informatics' ||
    s === 'coding & robotics'
  ) {
    return 'information_technology';
  }

  // 4. Commercial subjects
  if (s === 'accounting' || s === 'accountancy' || s === 'financial accounting') {
    return 'accounting';
  }
  if (s === 'business studies' || s === 'business management' || s === 'business') {
    return 'business_studies';
  }
  if (s === 'economics' || s === 'economic science') {
    return 'economics';
  }

  // 5. English
  if (s.includes('english')) {
    return 'english';
  }

  // 6. Geography & History
  if (s.includes('geography')) {
    return 'geography';
  }
  if (s.includes('history')) {
    return 'history';
  }

  // 7. Visual Arts & Design
  if (s.includes('visual art') || s.includes('fine art') || s === 'design' || s === 'art') {
    return 'visual_arts';
  }
  if (s.includes('dramatic art') || s.includes('drama') || s.includes('theatre')) {
    return 'dramatic_arts';
  }

  // 8. Engineering Graphics & Design (EGD)
  if (
    s.includes('engineering graphics') ||
    s.includes('egd') ||
    s.includes('technical drawing')
  ) {
    return 'engineering_graphics_and_design';
  }

  // 9. Consumer Studies & Tourism
  if (s.includes('consumer studies') || s.includes('home economics')) {
    return 'consumer_studies';
  }
  if (s.includes('tourism')) {
    return 'tourism';
  }
  if (s.includes('music')) {
    return 'music';
  }

  return 'other';
}

/**
 * Checks whether a student's entered subject matches a career required benchmark subject.
 */
export function doesSubjectMatchRequirement(requiredSubjectName: string, studentSubjectName: string): boolean {
  const reqCategory = classifySubject(requiredSubjectName);
  const stuCategory = classifySubject(studentSubjectName);

  // If both classify into the same canonical category (and not "other")
  if (reqCategory !== 'other' && reqCategory === stuCategory) {
    return true;
  }

  // Special cases for Physical Sciences in SA vs International:
  // In international curricula, Physics and Chemistry are distinct. If career requires "Physical Sciences",
  // a student with "Physics" matches.
  if (reqCategory === 'physical_sciences' && stuCategory === 'chemistry') {
    // Chemistry alone does not fulfill a strict physics requirement, but note: in SA Physical Sciences includes both.
    return false;
  }

  // Fallback for custom / niche subjects: strict clean string equality
  const cleanReq = requiredSubjectName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanStu = studentSubjectName.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (cleanReq === cleanStu && cleanReq.length >= 3) {
    return true;
  }

  return false;
}

/**
 * Finds the student's entered SubjectMark that corresponds to a requirement.
 */
export function findStudentSubject(
  requiredSubjectName: string,
  studentSubjects: SubjectMark[]
): SubjectMark | undefined {
  return studentSubjects.find((s) => doesSubjectMatchRequirement(requiredSubjectName, s.name));
}

/**
 * Checks whether all critical prerequisites are present in the student's entered subjects.
 */
export function checkCriticalPrerequisites(
  criticalPrereqs: string[] | undefined,
  studentSubjects: SubjectMark[]
): { isSatisfied: boolean; missingPrereqs: string[]; presentPrereqs: string[] } {
  if (!criticalPrereqs || criticalPrereqs.length === 0) {
    return { isSatisfied: true, missingPrereqs: [], presentPrereqs: [] };
  }

  const missing: string[] = [];
  const present: string[] = [];

  for (const prereq of criticalPrereqs) {
    const match = findStudentSubject(prereq, studentSubjects);
    if (match) {
      present.push(prereq);
    } else {
      missing.push(prereq);
    }
  }

  return {
    isSatisfied: missing.length === 0,
    missingPrereqs: missing,
    presentPrereqs: present,
  };
}
