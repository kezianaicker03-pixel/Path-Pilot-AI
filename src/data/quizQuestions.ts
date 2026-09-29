import { QuizQuestion } from '../types';

/**
 * Career Personality & Interests Assessment
 * 32 broad, neutral scenarios assessing:
 * - RIASEC dimensions: Realistic (Practical), Investigative, Artistic (Creative), Social, Enterprising, Conventional (Organised)
 * - Work-style traits: Analytical, Collaborative, Independent, Structured, Adaptable, Detail-oriented, Leadership-oriented, People-oriented
 * - Cognitive preferences: abstract vs practical, risk tolerance, routine vs variety, data vs people vs ideas vs objects
 *
 * NOTE: Questions are intentionally interleaved/randomized so no single category dominates.
 * They describe everyday habits, group interactions, and thinking styles WITHOUT leading career titles.
 */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Q1: Problem-solving reflex (Analytical vs Practical vs Creative vs Social vs Strategic vs Structured)
  {
    id: 1,
    type: 'choice_cards',
    scenario: 'When facing a complex problem you do not understand, what is your immediate natural reflex?',
    subtext: 'Trust your first instinct — how does your brain naturally start?',
    dimensionCategory: 'multidimensional',
    options: [
      { id: '1a', label: 'Break it into logical parts', description: 'Deconstruct the components to understand cause and effect step by step', icon: '🧩', riasecEffect: { I: 4 }, workStyleEffect: { analytical: 4, independent: 2 } },
      { id: '1b', label: 'Experiment and test things hands-on', description: 'Interact directly with it to see what physically happens', icon: '🛠️', riasecEffect: { R: 4 }, workStyleEffect: { practical: 4, adaptable: 2 } },
      { id: '1c', label: 'Look at it from an unconventional angle', description: 'Brainstorm creative, out-of-the-box metaphors or alternative views', icon: '💡', riasecEffect: { A: 4 }, workStyleEffect: { adaptable: 3, independent: 2 } },
      { id: '1d', label: 'Discuss it with others', description: 'Exchange perspectives and talk it through with people to gain clarity', icon: '💬', riasecEffect: { S: 4 }, workStyleEffect: { collaborative: 4, peopleOriented: 3 } },
      { id: '1e', label: 'Determine the end objective and drive forward', description: 'Focus on the desired outcome, mobilize help, and find a fast path', icon: '🎯', riasecEffect: { E: 4 }, workStyleEffect: { leadershipOriented: 4 } },
      { id: '1f', label: 'Check the guidelines, facts, and checklists', description: 'Gather reliable reference material and document standard steps', icon: '📋', riasecEffect: { C: 4 }, workStyleEffect: { structured: 4, detailOriented: 3 } },
    ],
  },

  // Q2: Group collaboration role (Social vs Enterprising vs Analytical vs Practical)
  {
    id: 2,
    type: 'choice_cards',
    scenario: 'In a group project, which contribution feels most genuinely fulfilling to you?',
    subtext: 'Think about where your energy naturally goes without being asked.',
    dimensionCategory: 'social',
    options: [
      { id: '2a', label: 'The Facilitator & Communicator', description: 'Ensuring everyone is engaged, listening to concerns, and keeping morale high', icon: '🤝', riasecEffect: { S: 4 }, workStyleEffect: { collaborative: 4, peopleOriented: 4 } },
      { id: '2b', label: 'The Project Captain', description: 'Setting targets, coordinating the roadmap, pitching ideas, and taking responsibility', icon: '🚀', riasecEffect: { E: 4 }, workStyleEffect: { leadershipOriented: 4 } },
      { id: '2c', label: 'The Deep Analyst & Fact-Checker', description: 'Investigating background data, verifying logic, and ensuring sound reasoning', icon: '🔍', riasecEffect: { I: 4 }, workStyleEffect: { analytical: 4, detailOriented: 3 } },
      { id: '2d', label: 'The Visual & Experience Crafter', description: 'Designing the look, interactive elements, tone, and overall aesthetic', icon: '✨', riasecEffect: { A: 4 }, workStyleEffect: { independent: 2 } },
      { id: '2e', label: 'The Master Organiser', description: 'Managing shared documents, tracking deadlines, and maintaining quality standards', icon: '📂', riasecEffect: { C: 4 }, workStyleEffect: { structured: 4, detailOriented: 3 } },
      { id: '2f', label: 'The Functional Builder', description: 'Constructing the physical prototype, technical apparatus, or functional model', icon: '⚙️', riasecEffect: { R: 4 }, workStyleEffect: { practical: 4 } },
    ],
  },

  // Q3: Tolerance for Routine vs Variety (Workstyle trait: Structured vs Adaptable)
  {
    id: 3,
    type: 'single_choice',
    scenario: 'How do you feel about working with predictable routines day to day?',
    subtext: 'Every style has unique strengths.',
    dimensionCategory: 'workstyle',
    options: [
      { id: '3a', label: 'I thrive with clear structure and predictable rhythm', description: 'Knowing what to expect allows me to focus deeply and maintain high quality', icon: '📐', riasecEffect: { C: 4 }, workStyleEffect: { structured: 4, detailOriented: 3 } },
      { id: '3b', label: 'I like a balanced mix of steady routine and new tasks', description: 'A stable base with occasional fresh challenges suits me best', icon: '⚖️', riasecEffect: { C: 2, I: 2 }, workStyleEffect: { structured: 2, adaptable: 2 } },
      { id: '3c', label: 'I prefer fast variety and unpredictable new situations', description: 'I get energized by changing priorities, novel problems, and fluid environments', icon: '⚡', riasecEffect: { E: 3, A: 2 }, workStyleEffect: { adaptable: 4, independent: 2 } },
    ],
  },

  // Q4: Satisfying activities (Creativity & Originality)
  {
    id: 4,
    type: 'choice_cards',
    scenario: 'Which of these creative activities sounds most deeply satisfying?',
    subtext: 'Imagine spending an afternoon on it purely for your own enjoyment.',
    dimensionCategory: 'creative',
    options: [
      { id: '4a', label: 'Developing an original concept or story', description: 'Expressing mood, themes, writing, or visual storytelling that moves people', icon: '🎨', riasecEffect: { A: 4 }, workStyleEffect: { independent: 3 } },
      { id: '4b', label: 'Inventing a clever mechanism or physical device', description: 'Using materials and tools to solve a physical inconvenience', icon: '🔧', riasecEffect: { R: 4, I: 2 }, workStyleEffect: { practical: 3, analytical: 2 } },
      { id: '4c', label: 'Uncovering a hidden pattern in complex data', description: 'Connecting separate clues or numbers to discover something unexpected', icon: '📊', riasecEffect: { I: 4, C: 2 }, workStyleEffect: { analytical: 4, detailOriented: 2 } },
      { id: '4d', label: 'Designing a compelling campaign or initiative', description: 'Rallying a community around an exciting new vision or goal', icon: '📣', riasecEffect: { E: 4, S: 2 }, workStyleEffect: { leadershipOriented: 3, peopleOriented: 2 } },
    ],
  },

  // Q5: Interaction with Primary Medium (People vs Data vs Ideas vs Objects)
  {
    id: 5,
    type: 'single_choice',
    scenario: 'If you had to pick one medium you naturally enjoy working with most, what would it be?',
    dimensionCategory: 'multidimensional',
    options: [
      { id: '5a', label: 'People and human dynamics', description: 'Relationships, teaching, guiding, emotional support, and shared discussions', icon: '👥', riasecEffect: { S: 5 }, workStyleEffect: { peopleOriented: 5, collaborative: 3 } },
      { id: '5b', label: 'Data, facts, and precision systems', description: 'Figures, organized files, algorithms, and verifiable evidence', icon: '🔢', riasecEffect: { C: 4, I: 2 }, workStyleEffect: { analytical: 4, detailOriented: 4 } },
      { id: '5c', label: 'Abstract ideas, concepts, and theories', description: 'Philosophical questions, conceptual models, and future possibilities', icon: '🌌', riasecEffect: { I: 4, A: 3 }, workStyleEffect: { analytical: 3, independent: 3 } },
      { id: '5d', label: 'Physical objects, tools, and environments', description: 'Equipment, materials, natural settings, hardware, and physical builds', icon: '🌲', riasecEffect: { R: 5 }, workStyleEffect: { practical: 5 } },
    ],
  },

  // Q6: Practical Curiosity & Hands-on orientation
  {
    id: 6,
    type: 'single_choice',
    scenario: 'When a household appliance, bicycle, or physical device stops working, what do you usually do?',
    dimensionCategory: 'practical',
    options: [
      { id: '6a', label: 'Take it apart to see the internal mechanism', description: 'I want to physically inspect the gears, circuits, or moving parts', icon: '🧰', riasecEffect: { R: 4, I: 2 }, workStyleEffect: { practical: 4, analytical: 2 } },
      { id: '6b', label: 'Look up the technical manual or diagnostic guide', description: 'I check documented error codes and follow the structured troubleshooting steps', icon: '📖', riasecEffect: { C: 4, I: 2 }, workStyleEffect: { structured: 3, detailOriented: 3 } },
      { id: '6c', label: 'Ask someone experienced or look for a trusted repair person', description: 'I value consulting someone who knows how to fix it safely', icon: '🤝', riasecEffect: { S: 3 }, workStyleEffect: { collaborative: 2, peopleOriented: 2 } },
      { id: '6d', label: 'Assess the cost and decide whether to replace or upgrade it', description: 'I think about practical value, warranties, and practical economics', icon: '🏷️', riasecEffect: { E: 3, C: 2 }, workStyleEffect: { analytical: 2, leadershipOriented: 2 } },
    ],
  },

  // Q7: Evidence vs Intuition in decision-making
  {
    id: 7,
    type: 'single_choice',
    scenario: 'When you need to make an important decision, what gives you the highest confidence?',
    dimensionCategory: 'investigative',
    options: [
      { id: '7a', label: 'Thorough research, empirical data, and verifiable proof', description: 'I feel confident when solid numbers and objective evidence back the choice', icon: '🔬', riasecEffect: { I: 4 }, workStyleEffect: { analytical: 4, detailOriented: 3 } },
      { id: '7b', label: 'Personal intuition, creative instinct, and emotional resonance', description: 'I trust my internal gut feel and how meaningful the choice feels', icon: '✨', riasecEffect: { A: 4 }, workStyleEffect: { adaptable: 2, independent: 3 } },
      { id: '7c', label: 'Consulting trusted mentors and considering how it affects others', description: 'I value the advice of experienced guides and the impact on my community', icon: '🗣️', riasecEffect: { S: 4 }, workStyleEffect: { peopleOriented: 4, collaborative: 3 } },
      { id: '7d', label: 'Strategic advantage, growth opportunities, and tangible upside', description: 'I evaluate which path opens the biggest doors and delivers momentum', icon: '📈', riasecEffect: { E: 4 }, workStyleEffect: { leadershipOriented: 3 } },
    ],
  },

  // Q8: Risk tolerance and ambiguity
  {
    id: 8,
    type: 'single_choice',
    scenario: 'How comfortable are you starting a challenge where the outcome is uncertain and there is no guidebook?',
    dimensionCategory: 'workstyle',
    options: [
      { id: '8a', label: 'Very excited — I love uncharted territory and high autonomy', description: 'Ambiguity gives me room to innovate, pivot, and take calculated bets', icon: '🚀', riasecEffect: { E: 3, A: 3 }, workStyleEffect: { adaptable: 4, independent: 3 } },
      { id: '8b', label: 'Comfortable once I formulate a sound theoretical hypothesis', description: 'I like testing the unknown as long as I can apply rigorous logic', icon: '🔭', riasecEffect: { I: 4 }, workStyleEffect: { analytical: 4, adaptable: 2 } },
      { id: '8c', label: 'Cautious — I prefer established parameters and clear safety nets', description: 'Clarity and defined benchmarks allow me to execute with zero wasted effort', icon: '🛡️', riasecEffect: { C: 4 }, workStyleEffect: { structured: 4, detailOriented: 3 } },
    ],
  },

  // Q9: Empathy and human support
  {
    id: 9,
    type: 'choice_cards',
    scenario: 'When a friend or peer comes to you visibly distressed or stuck, how do you naturally react?',
    dimensionCategory: 'social',
    options: [
      { id: '9a', label: 'Listen deeply and provide empathetic warmth', description: 'Creating a safe, non-judgmental space for them to process their feelings', icon: '❤️', riasecEffect: { S: 4 }, workStyleEffect: { peopleOriented: 4, collaborative: 2 } },
      { id: '9b', label: 'Help them logically analyze the root cause', description: 'Calmly helping them identify what triggered the issue and find rational options', icon: '🧠', riasecEffect: { I: 3, S: 2 }, workStyleEffect: { analytical: 3, peopleOriented: 2 } },
      { id: '9c', label: 'Draft an actionable, step-by-step recovery plan', description: 'Organizing their immediate priorities so they know what to do next', icon: '📋', riasecEffect: { C: 3, S: 2 }, workStyleEffect: { structured: 3, detailOriented: 2 } },
      { id: '9d', label: 'Inspire and encourage them to take bold action', description: 'Boosting their confidence and motivating them to overcome the hurdle', icon: '🔥', riasecEffect: { E: 3, S: 2 }, workStyleEffect: { leadershipOriented: 3, peopleOriented: 2 } },
    ],
  },

  // Q10: Attention to detail and quality standards
  {
    id: 10,
    type: 'single_choice',
    scenario: 'Before handing in a significant assignment or project, what is your review habit?',
    dimensionCategory: 'organised',
    options: [
      { id: '10a', label: 'Meticulous line-by-line inspection', description: 'I spot tiny formatting misalignments, spelling errors, or data discrepancies instantly', icon: '🔍', riasecEffect: { C: 4 }, workStyleEffect: { detailOriented: 5, structured: 3 } },
      { id: '10b', label: 'Big-picture narrative and impact review', description: 'I check whether the core message is persuasive and powerful', icon: '🎯', riasecEffect: { E: 3, A: 2 }, workStyleEffect: { leadershipOriented: 2 } },
      { id: '10c', label: 'Conceptual soundness check', description: 'I make sure the underlying theories and logic hold up to strict scrutiny', icon: '📚', riasecEffect: { I: 4 }, workStyleEffect: { analytical: 4 } },
      { id: '10d', label: 'Visual elegance and presentation polish', description: 'I ensure the typography, spacing, and visual harmony look professional', icon: '🎨', riasecEffect: { A: 4 }, workStyleEffect: { detailOriented: 2 } },
    ],
  },

  // Q11: Social impact & contribution
  {
    id: 11,
    type: 'choice_cards',
    scenario: 'If you had the opportunity to launch a community initiative, which goal would resonate most?',
    dimensionCategory: 'social',
    options: [
      { id: '11a', label: 'Mentoring and educating younger youth', description: 'Helping others learn foundational skills and discover their confidence', icon: '🌱', riasecEffect: { S: 4 }, workStyleEffect: { peopleOriented: 4, collaborative: 3 } },
      { id: '11b', label: 'Building or restoring community infrastructure', description: 'Constructing physical garden beds, repair cafes, or clean spaces', icon: '🏡', riasecEffect: { R: 4 }, workStyleEffect: { practical: 4 } },
      { id: '11c', label: 'Conducting scientific research on local water or health', description: 'Gathering environmental samples and publishing factual findings', icon: '🧪', riasecEffect: { I: 4 }, workStyleEffect: { analytical: 4, independent: 2 } },
      { id: '11d', label: 'Organizing a cultural or arts festival', description: 'Bringing creative expression, music, and performance to life', icon: '🎭', riasecEffect: { A: 4 }, workStyleEffect: { collaborative: 2 } },
      { id: '11e', label: 'Creating an enterprise or fund that creates jobs', description: 'Driving economic independence, self-sufficiency, and commercial opportunities', icon: '💼', riasecEffect: { E: 4 }, workStyleEffect: { leadershipOriented: 4 } },
      { id: '11f', label: 'Setting up an efficient distribution or relief log', description: 'Making sure supplies reach those in need with zero waste and precise tracking', icon: '📦', riasecEffect: { C: 4 }, workStyleEffect: { structured: 4, detailOriented: 3 } },
    ],
  },

  // Q12: Abstract vs Practical thinking
  {
    id: 12,
    type: 'single_choice',
    scenario: 'Which type of conversation leaves you feeling most intellectually stimulated?',
    dimensionCategory: 'investigative',
    options: [
      { id: '12a', label: 'Deep theoretical or philosophical debates', description: 'Debating abstract questions about the nature of time, mind, justice, or the cosmos', icon: '🌌', riasecEffect: { I: 4, A: 2 }, workStyleEffect: { analytical: 3, independent: 2 } },
      { id: '12b', label: 'Tactical discussions about how things are actually made and operated', description: 'Examining real machinery, materials, construction techniques, or practical systems', icon: '⚙️', riasecEffect: { R: 4 }, workStyleEffect: { practical: 4 } },
      { id: '12c', label: 'Human psychology, interpersonal stories, and cultural motives', description: 'Exploring why people act, love, change, and experience life the way they do', icon: '👥', riasecEffect: { S: 4 }, workStyleEffect: { peopleOriented: 4 } },
      { id: '12d', label: 'Strategy, market competition, and ambitious plans', description: 'Analyzing market trends, negotiations, competitive advantage, and future ventures', icon: '🏆', riasecEffect: { E: 4 }, workStyleEffect: { leadershipOriented: 3 } },
    ],
  },

  // Q13: Work Environment & Physical Energy
  {
    id: 13,
    type: 'choice_cards',
    scenario: 'Where do you naturally picture your ideal working energy taking place?',
    dimensionCategory: 'practical',
    options: [
      { id: '13a', label: 'In dynamic open spaces or active fieldwork', description: 'Being on your feet, moving between sites, outdoors or in active workshops', icon: '🌲', riasecEffect: { R: 4 }, workStyleEffect: { practical: 4, adaptable: 2 } },
      { id: '13b', label: 'In a quiet, focused studio or research hub', description: 'A calm space where you can concentrate deeply for hours without interruptions', icon: '🎧', riasecEffect: { I: 3, A: 2 }, workStyleEffect: { independent: 4, analytical: 2 } },
      { id: '13c', label: 'In a buzzing, collaborative community center or team space', description: 'Surrounded by active discussions, constant teamwork, and human energy', icon: '☕', riasecEffect: { S: 3, E: 2 }, workStyleEffect: { collaborative: 4, peopleOriented: 4 } },
      { id: '13d', label: 'In a neat, modern, and impeccably organized office', description: 'Ergonomic dual monitors, tidy documentation, and clear administrative workflows', icon: '🖥️', riasecEffect: { C: 4 }, workStyleEffect: { structured: 4, detailOriented: 3 } },
    ],
  },

  // Q14: Leadership and Persuasion
  {
    id: 14,
    type: 'single_choice',
    scenario: 'When you want to convince a group to adopt your preferred proposal, what is your approach?',
    dimensionCategory: 'enterprising',
    options: [
      { id: '14a', label: 'Deliver an inspiring, high-energy pitch', description: 'Paint an exciting vision of the future that gets people genuinely fired up', icon: '🎤', riasecEffect: { E: 4 }, workStyleEffect: { leadershipOriented: 4, adaptable: 2 } },
      { id: '14b', label: 'Present irrefutable logical arguments and benchmarks', description: 'Walk through clear evidence, citations, and mathematical proofs', icon: '📊', riasecEffect: { I: 3, C: 2 }, workStyleEffect: { analytical: 4, structured: 2 } },
      { id: '14c', label: 'Build consensus by listening to everyone’s underlying needs', description: 'Find common ground so everyone feels ownership and respected', icon: '🤝', riasecEffect: { S: 4 }, workStyleEffect: { peopleOriented: 4, collaborative: 3 } },
      { id: '14d', label: 'Show a working physical demo or proof-of-concept prototype', description: 'Let the tangible results speak for themselves', icon: '🔨', riasecEffect: { R: 3, A: 2 }, workStyleEffect: { practical: 3 } },
    ],
  },

  // Q15: Communication style
  {
    id: 15,
    type: 'single_choice',
    scenario: 'Which communication style feels most natural and effortless for you?',
    dimensionCategory: 'workstyle',
    options: [
      { id: '15a', label: 'Direct, clear, concise, and results-focused', description: 'No fluff — getting straight to the point and deciding next actions', icon: '⚡', riasecEffect: { E: 3, C: 2 }, workStyleEffect: { leadershipOriented: 3, structured: 2 } },
      { id: '15b', label: 'Warm, encouraging, empathetic, and relational', description: 'Checking in on people, asking thoughtful questions, and making people comfortable', icon: '🌟', riasecEffect: { S: 4 }, workStyleEffect: { peopleOriented: 4, collaborative: 3 } },
      { id: '15c', label: 'Precise, nuanced, technical, and accurate', description: 'Using exact terms, making careful distinctions, and avoiding vague claims', icon: '📐', riasecEffect: { I: 4 }, workStyleEffect: { analytical: 4, detailOriented: 3 } },
      { id: '15d', label: 'Expressive, visual, metaphoric, and storytelling', description: 'Using vivid examples, diagrams, humor, and analogies', icon: '🎨', riasecEffect: { A: 4 }, workStyleEffect: { adaptable: 2 } },
    ],
  },

  // Q16: Handling rules and guidelines
  {
    id: 16,
    type: 'single_choice',
    scenario: 'How do you view established rules and institutional procedures?',
    dimensionCategory: 'organised',
    options: [
      { id: '16a', label: 'Essential safeguards that ensure fairness, safety, and efficiency', description: 'Clear rules prevent chaos, keep standards consistent, and protect everyone', icon: '🛡️', riasecEffect: { C: 4 }, workStyleEffect: { structured: 4, detailOriented: 3 } },
      { id: '16b', label: 'Flexible guidelines that can be bent or updated for better results', description: 'If a rule slows down progress or stifles common sense, I look for workarounds', icon: '🔄', riasecEffect: { E: 3, A: 2 }, workStyleEffect: { adaptable: 4, independent: 2 } },
      { id: '16c', label: 'Hypotheses to be investigated — I want to know the logic behind them', description: 'I want to know who created the rule and whether the data still justifies it', icon: '❓', riasecEffect: { I: 4 }, workStyleEffect: { analytical: 4 } },
      { id: '16d', label: 'Something that should serve human compassion above all else', description: 'Rules should always flex if a human being is hurting or in need', icon: '🤝', riasecEffect: { S: 4 }, workStyleEffect: { peopleOriented: 4 } },
    ],
  },

  // Q17: Personal Autonomy vs Supervision
  {
    id: 17,
    type: 'single_choice',
    scenario: 'When given a major assignment, what level of independence do you prefer?',
    dimensionCategory: 'workstyle',
    options: [
      { id: '17a', label: 'Total freedom — tell me the goal and leave me to figure out the path', description: 'I do my best work with maximum autonomy and zero micro-management', icon: '🦅', riasecEffect: { I: 2, A: 3, E: 2 }, workStyleEffect: { independent: 5 } },
      { id: '17b', label: 'Clear milestones with regular, constructive check-ins', description: 'I appreciate benchmark check-ins to make sure my progress is on track', icon: '🧭', riasecEffect: { C: 3, S: 2 }, workStyleEffect: { structured: 3, collaborative: 2 } },
      { id: '17c', label: 'Continuous collaboration with peers throughout', description: 'I work best bouncing thoughts back and forth in real time with a team', icon: '👥', riasecEffect: { S: 4 }, workStyleEffect: { collaborative: 5, peopleOriented: 3 } },
    ],
  },

  // Q18: Curiosity in media & reading
  {
    id: 18,
    type: 'choice_cards',
    scenario: 'When browsing articles, podcasts, or documentaries purely out of curiosity, what topic wins?',
    dimensionCategory: 'investigative',
    options: [
      { id: '18a', label: 'How the natural world or physical cosmos works', description: 'Space exploration, quantum oddities, wildlife adaptations, or earth systems', icon: '🪐', riasecEffect: { I: 4, R: 2 }, workStyleEffect: { analytical: 3 } },
      { id: '18b', label: 'Stories of human courage, psychology, and personal transformation', description: 'Biography, memoirs, behavioral psychology, and cultural empathy', icon: '📖', riasecEffect: { S: 4, A: 2 }, workStyleEffect: { peopleOriented: 3 } },
      { id: '18c', label: 'The origins of iconic businesses, bold inventions, or strategic triumphs', description: 'How founders scaled movements, negotiated power, or transformed industries', icon: '💼', riasecEffect: { E: 4 }, workStyleEffect: { leadershipOriented: 3 } },
      { id: '18d', label: 'Creative design, avant-garde architecture, or music evolution', description: 'Visual culture, architectural concepts, musical movements, and craft aesthetics', icon: '🎨', riasecEffect: { A: 4 }, workStyleEffect: { independent: 2 } },
      { id: '18e', label: 'Forensic audits, mysterious data anomalies, or organized archives', description: 'Complex true-crime paper trails, archival discoveries, and decoding facts', icon: '📂', riasecEffect: { C: 4, I: 2 }, workStyleEffect: { detailOriented: 4, structured: 2 } },
      { id: '18f', label: 'DIY engineering, mechanical rebuilds, or physical craftsmanship', description: 'Restoring classic machines, woodcraft, tool modifications, or robotics tests', icon: '🔧', riasecEffect: { R: 4 }, workStyleEffect: { practical: 4 } },
    ],
  },

  // Q19: Handling pressure & deadlines
  {
    id: 19,
    type: 'single_choice',
    scenario: 'When a tight deadline is looming, how does your mind react?',
    dimensionCategory: 'workstyle',
    options: [
      { id: '19a', label: 'Calm and steady — I stick to my planned schedule', description: 'Because I pace myself early, deadlines rarely create panic', icon: '⏱️', riasecEffect: { C: 4 }, workStyleEffect: { structured: 4, detailOriented: 3 } },
      { id: '19b', label: 'High energy — adrenaline sharpens my focus and quickens decisions', description: 'I actually perform exceptionally well under high-stakes momentum', icon: '⚡', riasecEffect: { E: 4 }, workStyleEffect: { adaptable: 3, leadershipOriented: 3 } },
      { id: '19c', label: 'Intensely focused on solving the hardest theoretical hurdle first', description: 'I zero in on the core challenge and block out all external noise', icon: '🎯', riasecEffect: { I: 4 }, workStyleEffect: { analytical: 4, independent: 3 } },
      { id: '19d', label: 'Team-rallying — I make sure everyone stays calm and supported', description: 'I prioritize mutual support and distributing tasks fairly so no one burns out', icon: '🤝', riasecEffect: { S: 4 }, workStyleEffect: { collaborative: 4, peopleOriented: 3 } },
    ],
  },

  // Q20: Craftsmanship & physical tools
  {
    id: 20,
    type: 'single_choice',
    scenario: 'How satisfying do you find working with physical materials (wood, metal, plants, circuits, clay)?',
    dimensionCategory: 'practical',
    options: [
      { id: '20a', label: 'Extremely satisfying — tangible results feel much more real than screen pixels', description: 'Touching, shaping, and feeling the weight of real materials is rewarding', icon: '🪵', riasecEffect: { R: 5 }, workStyleEffect: { practical: 5 } },
      { id: '20b', label: 'I enjoy it if it involves creative artistic expression', description: 'Using materials to create striking visual or decorative objects', icon: '🎨', riasecEffect: { A: 4, R: 2 }, workStyleEffect: { practical: 2 } },
      { id: '20c', label: 'I prefer working with conceptual ideas, digital interfaces, or people', description: 'I feel more energized by strategy, writing, software, or conversations', icon: '💻', riasecEffect: { I: 2, S: 2, E: 2 }, workStyleEffect: { analytical: 2, peopleOriented: 2 } },
    ],
  },

  // Q21: Systematic categorization & sorting
  {
    id: 21,
    type: 'choice_cards',
    scenario: 'When your digital files, workspace, or notes become disorganized, what do you do?',
    dimensionCategory: 'organised',
    options: [
      { id: '21a', label: 'Design a clean folder hierarchy and tag everything systematically', description: 'Creating logical folders, naming conventions, and archival categories', icon: '🗂️', riasecEffect: { C: 5 }, workStyleEffect: { structured: 5, detailOriented: 4 } },
      { id: '21b', label: 'Tidy up just enough to keep working smoothly', description: 'I maintain functional order without obsessing over minor filing aesthetics', icon: '⚖️', riasecEffect: { I: 2, R: 2 }, workStyleEffect: { adaptable: 2 } },
      { id: '21c', label: 'I operate comfortably in creative, organized chaos', description: 'My mind knows where everything is, even if it looks unconventional to others', icon: '🌀', riasecEffect: { A: 4 }, workStyleEffect: { adaptable: 3, independent: 2 } },
    ],
  },

  // Q22: Motivating Others & Public Expression
  {
    id: 22,
    type: 'single_choice',
    scenario: 'How do you feel about speaking in front of an audience or pitching an idea?',
    dimensionCategory: 'enterprising',
    options: [
      { id: '22a', label: 'I enjoy commanding the room and engaging people directly', description: 'Public speaking, presenting, and moving an audience feels natural or exciting', icon: '📢', riasecEffect: { E: 4, S: 2 }, workStyleEffect: { leadershipOriented: 4 } },
      { id: '22b', label: 'I am comfortable if I am sharing well-researched, factual expertise', description: 'When I know the subject deeply, presenting the evidence feels rewarding', icon: '🔬', riasecEffect: { I: 4 }, workStyleEffect: { analytical: 3 } },
      { id: '22c', label: 'I prefer intimate, one-on-one or small-circle conversations', description: 'I connect far more authentically when speaking individually or in small groups', icon: '☕', riasecEffect: { S: 4 }, workStyleEffect: { peopleOriented: 4, collaborative: 2 } },
      { id: '22d', label: 'I prefer expressing my thoughts through writing, code, or visual media', description: 'Letting my written work or created artifacts represent me', icon: '✍️', riasecEffect: { A: 3, I: 2 }, workStyleEffect: { independent: 4 } },
    ],
  },

  // Q23: Intellectual persistence
  {
    id: 23,
    type: 'single_choice',
    scenario: 'When working through a difficult puzzle or mathematical logic problem that seems stuck, what happens?',
    dimensionCategory: 'investigative',
    options: [
      { id: '23a', label: 'I cannot let it go — I keep thinking about it until I crack it', description: 'The challenge itself becomes an obsession until the puzzle reveals its secret', icon: '🧩', riasecEffect: { I: 5 }, workStyleEffect: { analytical: 4, independent: 3 } },
      { id: '23b', label: 'I step back, look for a creative shortcut or alternative angle', description: 'Taking a breather and looking at the meta-picture often sparks the breakthrough', icon: '💡', riasecEffect: { A: 3, I: 2 }, workStyleEffect: { adaptable: 3 } },
      { id: '23c', label: 'I prefer collaborating with a peer to brainstorm together', description: 'Two heads are better than one to spot blind spots quickly', icon: '👥', riasecEffect: { S: 3 }, workStyleEffect: { collaborative: 4 } },
      { id: '23d', label: 'I evaluate if solving it is practically worth the time investment', description: 'I focus on practical efficiency and move to high-leverage tasks', icon: '⏱️', riasecEffect: { E: 3, C: 2 }, workStyleEffect: { leadershipOriented: 2 } },
    ],
  },

  // Q24: Empathy in community conflict
  {
    id: 24,
    type: 'single_choice',
    scenario: 'When you notice tension or conflict between two friends or team members, what is your role?',
    dimensionCategory: 'social',
    options: [
      { id: '24a', label: 'The mediator who listens to both sides objectively', description: 'Helping each person understand the other’s emotional standpoint to restore harmony', icon: '🕊️', riasecEffect: { S: 5 }, workStyleEffect: { peopleOriented: 4, collaborative: 3 } },
      { id: '24b', label: 'The decisive arbiter who reviews the facts and proposes a solution', description: 'Cutting through the emotional noise to establish what is objectively fair', icon: '⚖️', riasecEffect: { E: 3, C: 2 }, workStyleEffect: { leadershipOriented: 3, analytical: 2 } },
      { id: '24c', label: 'Focus on getting the actual project done despite interpersonal drama', description: 'Keeping the work moving forward regardless of side disputes', icon: '🛠️', riasecEffect: { R: 3, I: 2 }, workStyleEffect: { practical: 3, independent: 2 } },
    ],
  },

  // Q25: Aesthetic sensitivity
  {
    id: 25,
    type: 'single_choice',
    scenario: 'When you visit a new space (a cafe, school building, or website), what catches your attention first?',
    dimensionCategory: 'creative',
    options: [
      { id: '25a', label: 'The lighting, textures, colors, and overall artistic mood', description: 'I am immediately sensitive to the visual atmosphere and design harmony', icon: '🎨', riasecEffect: { A: 5 }, workStyleEffect: { detailOriented: 2 } },
      { id: '25b', label: 'How efficiently people move and how well the space is arranged', description: 'I notice queues, bottlenecks, ergonomics, and practical layout flow', icon: '📐', riasecEffect: { C: 3, R: 3 }, workStyleEffect: { structured: 3, practical: 3 } },
      { id: '25c', label: 'The social vibe and welcoming nature of the people inside', description: 'I pay attention to the smiles, warmth, and interpersonal community feel', icon: '☕', riasecEffect: { S: 4 }, workStyleEffect: { peopleOriented: 4 } },
      { id: '25d', label: 'How the space operates commercially and attracts visitors', description: 'I think about pricing, branding, business concept, and audience draw', icon: '💼', riasecEffect: { E: 4 }, workStyleEffect: { leadershipOriented: 3 } },
    ],
  },

  // Q26: Adaptability to sudden change
  {
    id: 26,
    type: 'single_choice',
    scenario: 'When sudden, unexpected news requires discarding your weekend plan entirely, how do you feel?',
    dimensionCategory: 'workstyle',
    options: [
      { id: '26a', label: 'Quickly energized to adapt and make the most of the unexpected', description: 'Spontaneity is fun — I can pivot immediately without frustration', icon: '🌊', riasecEffect: { E: 3, A: 2 }, workStyleEffect: { adaptable: 5 } },
      { id: '26b', label: 'Slightly frustrated initially, but I quickly build a replacement schedule', description: 'I adjust once I can establish a new orderly structure', icon: '🔄', riasecEffect: { C: 3, I: 2 }, workStyleEffect: { structured: 3, adaptable: 2 } },
      { id: '26c', label: 'Very disrupted — I invest effort in plans and dislike unpredictable derailments', description: 'I strongly value follow-through, reliability, and established commitments', icon: '🛑', riasecEffect: { C: 4 }, workStyleEffect: { structured: 4, detailOriented: 3 } },
    ],
  },

  // Q27: Teaching & Explaining concepts
  {
    id: 27,
    type: 'single_choice',
    scenario: 'When someone asks you to explain something you know well, how do you teach them?',
    dimensionCategory: 'social',
    options: [
      { id: '27a', label: 'Break it into encouraging steps and check their emotional comfort', description: 'Praising their effort, using patient analogies, and celebrating when it clicks', icon: '🌟', riasecEffect: { S: 5 }, workStyleEffect: { peopleOriented: 5, collaborative: 3 } },
      { id: '27b', label: 'Show them the fundamental first-principles logic behind it', description: 'Explaining the underlying theoretical mechanism so they understand the "why"', icon: '🧠', riasecEffect: { I: 4 }, workStyleEffect: { analytical: 4 } },
      { id: '27c', label: 'Put the tool or pen in their hand and guide them hands-on', description: 'Learning by doing physically teaches ten times faster than lecturing', icon: '✍️', riasecEffect: { R: 4 }, workStyleEffect: { practical: 4 } },
      { id: '27d', label: 'Provide a structured summary diagram or cheat-sheet checklist', description: 'A clear one-page reference they can keep for repeatable accuracy', icon: '📋', riasecEffect: { C: 4 }, workStyleEffect: { structured: 4, detailOriented: 3 } },
    ],
  },

  // Q28: Strategic initiative & negotiation
  {
    id: 28,
    type: 'single_choice',
    scenario: 'When you want to barter, trade, or negotiate terms with someone, what is your approach?',
    dimensionCategory: 'enterprising',
    options: [
      { id: '28a', label: 'Confident, assertive, and focused on mutual value creation', description: 'I understand what the other party wants and pitch a mutually beneficial deal', icon: '🤝', riasecEffect: { E: 5 }, workStyleEffect: { leadershipOriented: 4 } },
      { id: '28b', label: 'Compare fair market data and historical price benchmarks', description: 'I rely on objective numbers, comparisons, and recorded values', icon: '📊', riasecEffect: { C: 4, I: 2 }, workStyleEffect: { analytical: 3, detailOriented: 3 } },
      { id: '28c', label: 'Generous and accommodating to prioritize the relationship', description: 'The long-term goodwill matters far more to me than winning every penny', icon: '❤️', riasecEffect: { S: 4 }, workStyleEffect: { peopleOriented: 4 } },
    ],
  },

  // Q29: Scientific curiosity & systematic observation
  {
    id: 29,
    type: 'single_choice',
    scenario: 'If you were given access to a world-class observation device (telescope, particle detector, or field recording kit), what would you investigate?',
    dimensionCategory: 'investigative',
    options: [
      { id: '29a', label: 'Record precise measurements to verify or disprove a scientific theory', description: 'Testing whether current models predict nature accurately with hard data', icon: '🔭', riasecEffect: { I: 5 }, workStyleEffect: { analytical: 5, detailOriented: 3 } },
      { id: '29b', label: 'Document the raw beauty and create a multimedia art piece', description: 'Translating the sensory wonder into soundscapes, imagery, or visual stories', icon: '🌌', riasecEffect: { A: 4, I: 2 }, workStyleEffect: { independent: 3 } },
      { id: '29c', label: 'Study how to calibrate and engineer the physical sensors to work better', description: 'Optimizing the mechanical hardware and signal capture technology', icon: '⚙️', riasecEffect: { R: 4, I: 2 }, workStyleEffect: { practical: 4 } },
      { id: '29d', label: 'Share the live findings in a public broadcast to inspire students', description: 'Hosting an interactive session so ordinary people can experience discovery', icon: '📡', riasecEffect: { S: 3, E: 2 }, workStyleEffect: { peopleOriented: 3 } },
    ],
  },

  // Q30: Precision & Error detection
  {
    id: 30,
    type: 'single_choice',
    scenario: 'When looking through a table of numerical calculations or a written document, how do you handle small errors?',
    dimensionCategory: 'organised',
    options: [
      { id: '30a', label: 'I can’t ignore them — precision and correctness matter deeply to me', description: 'Leaving inaccuracies uncorrected bothers me; I fix them right away', icon: '🎯', riasecEffect: { C: 5 }, workStyleEffect: { detailOriented: 5, structured: 3 } },
      { id: '30b', label: 'I correct them if they alter the overall conclusion, but ignore trivia', description: 'I keep my eye on the macro validity rather than minor formatting slips', icon: '📈', riasecEffect: { E: 3, I: 2 }, workStyleEffect: { analytical: 2 } },
      { id: '30c', label: 'I care much more about the emotional resonance and intent behind it', description: 'Perfectionism can kill creativity; the heart of the idea comes first', icon: '✨', riasecEffect: { A: 4, S: 2 }, workStyleEffect: { adaptable: 2 } },
    ],
  },

  // Q31: Independent working energy
  {
    id: 31,
    type: 'single_choice',
    scenario: 'How do you feel after spending several consecutive hours working alone in complete silence?',
    dimensionCategory: 'workstyle',
    options: [
      { id: '31a', label: 'Deeply satisfied, focused, and mentally recharged', description: 'Solitary focus gives me clarity and produces my very best work', icon: '🧘', riasecEffect: { I: 3, A: 2 }, workStyleEffect: { independent: 5 } },
      { id: '31b', label: 'Productive for a while, but eventually I crave interaction and conversation', description: 'I need a healthy balance of solo focus and social connection to stay vibrant', icon: '⚖️', riasecEffect: { S: 3, C: 2 }, workStyleEffect: { collaborative: 3, independent: 2 } },
      { id: '31c', label: 'Drained and restless — I get my energy from being around people and movement', description: 'I feel most alive when collaborating, talking, and actively bouncing ideas', icon: '⚡', riasecEffect: { S: 4, E: 3 }, workStyleEffect: { peopleOriented: 4, collaborative: 4 } },
    ],
  },

  // Q32: Primary Life & Career Legacy
  {
    id: 32,
    type: 'choice_cards',
    scenario: 'Looking forward into your future, which type of legacy would bring you the greatest pride?',
    subtext: 'What kind of mark would you genuinely love to leave on the world?',
    dimensionCategory: 'multidimensional',
    options: [
      { id: '32a', label: 'Discovering knowledge or solving a deep scientific enigma', description: 'Expanding human understanding through rigorous investigation and discovery', icon: '🔬', riasecEffect: { I: 5 }, workStyleEffect: { analytical: 4, independent: 3 } },
      { id: '32b', label: 'Directly healing, mentoring, and elevating human lives', description: 'Knowing individuals and families lived healthier, happier lives because of your care', icon: '❤️', riasecEffect: { S: 5 }, workStyleEffect: { peopleOriented: 5 } },
      { id: '32c', label: 'Creating enduring art, media, or cultural inspiration', description: 'Works of imagination, music, or design that inspire generations of creators', icon: '🎨', riasecEffect: { A: 5 }, workStyleEffect: { independent: 3 } },
      { id: '32d', label: 'Building physical structures, machines, or tangible environments', description: 'Physical bridges, sustainable buildings, or engineered systems that stand the test of time', icon: '🏗️', riasecEffect: { R: 5 }, workStyleEffect: { practical: 5 } },
      { id: '32e', label: 'Building enterprises, creating jobs, and driving bold ventures', description: 'Leading organizations, transforming markets, and pioneering economic progress', icon: '🚀', riasecEffect: { E: 5 }, workStyleEffect: { leadershipOriented: 5 } },
      { id: '32f', label: 'Designing flawless systems, institutions, and data trust', description: 'Creating robust governance, financial integrity, and reliable public infrastructure', icon: '🏛️', riasecEffect: { C: 5 }, workStyleEffect: { structured: 5, detailOriented: 4 } },
    ],
  },
];
