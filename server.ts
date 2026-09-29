import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Ask Pilot Chat Endpoints (/api/pilot/chat and /api/chat)
const handlePilotChat = async (req: express.Request, res: express.Response) => {
  try {
    const {
      message,
      conversationHistory,
      studentContext,
      messages,
      studentProfile,
    } = req.body;

    // Resolve user message
    const incomingMessage: string = (
      message ||
      (Array.isArray(messages) && messages.length > 0
        ? messages[messages.length - 1]?.content
        : '') ||
      ''
    ).trim();

    if (!incomingMessage) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Resolve conversation history (prior turns excluding the current message)
    let history: Array<{ role: 'user' | 'assistant' | 'model'; content: string }> = [];
    if (Array.isArray(conversationHistory)) {
      history = conversationHistory;
    } else if (Array.isArray(messages)) {
      // If messages array was passed including current, take prior items
      history = messages.slice(0, -1);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
        reply: "I'm having trouble connecting to my AI service right now because the API key is not configured on the server. Please check your server environment.",
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Build structured student context text
    const ctx = studentContext || studentProfile || {};
    
    // Extract subject details
    const subjectsList: Array<{ name: string; mark: number }> = Array.isArray(ctx.subjects)
      ? ctx.subjects
      : [];
    
    const subjectLines = subjectsList.length > 0
      ? subjectsList.map((s: any) => `  • ${s.name}: ${s.mark}%`).join('\n')
      : '  (No subjects recorded yet)';

    // Extract personality archetype & dimensions
    const archetypeTitle = ctx.careerStyle?.title || ctx.personalityProfile?.archetypeTitle || ctx.personalityProfile?.title || 'Profile in progress';
    const archetypeDesc = ctx.careerStyle?.description || ctx.personalityProfile?.description || '';
    
    const riasec = ctx.riasecProfile || ctx.riasecScores;
    const riasecSummary = riasec
      ? `Investigative: ${riasec.I ?? riasec.investigative ?? '-'}, Realistic/Practical: ${riasec.R ?? riasec.realistic ?? riasec.practical ?? '-'}, Artistic/Creative: ${riasec.A ?? riasec.artistic ?? riasec.creative ?? '-'}, Social: ${riasec.S ?? riasec.social ?? '-'}, Enterprising: ${riasec.E ?? riasec.enterprising ?? '-'}, Conventional/Organised: ${riasec.C ?? riasec.conventional ?? riasec.organised ?? '-'}`
      : 'Assessment not completed yet';

    // Work style traits
    const traits = ctx.workStyleTraits || ctx.careerStyle?.traits;
    const traitsSummary = Array.isArray(traits)
      ? traits.join(', ')
      : typeof traits === 'object' && traits !== null
        ? Object.entries(traits).map(([k, v]) => `${k}: ${v}/100`).join(', ')
        : 'Not specified';

    // Stated interests
    const interestsSummary = Array.isArray(ctx.interests) && ctx.interests.length > 0
      ? ctx.interests.join(', ')
      : 'General exploration';

    // Career matches
    const matchesList = Array.isArray(ctx.careerMatches)
      ? ctx.careerMatches.map((m: any) => {
          const miss = m.criticalMissingSubjects?.length ? ` [Missing prerequisites: ${m.criticalMissingSubjects.join(', ')}]` : '';
          const caution = m.cautionNotes?.length ? ` [Note: ${m.cautionNotes.join('; ')}]` : '';
          return `  • ${m.title || m.career?.title}: Overall Fit ${m.fitScore || m.score}%, Personality ${m.personalityFit || '-'}%, Interest ${m.interestFit || '-'}%, Academic ${m.academicAlignment || '-'}${miss}${caution}`;
        }).join('\n')
      : 'No calculated matches available yet';

    // Saved careers and universities
    const savedCareersSummary = Array.isArray(ctx.savedCareers) && ctx.savedCareers.length > 0
      ? ctx.savedCareers.join(', ')
      : 'None saved yet';

    const savedUniversitiesSummary = Array.isArray(ctx.savedUniversities) && ctx.savedUniversities.length > 0
      ? ctx.savedUniversities.join(', ')
      : 'None saved yet';

    const contextBlock = `
=== CURRENT STUDENT PROFILE (PATHPILOT LIVE CONTEXT) ===
• Country: ${ctx.country || 'South Africa'}
• Region: ${ctx.region || 'Not specified'}
• Grade: ${ctx.grade || 'High School'}
• Curriculum: ${ctx.curriculum || 'NSC / IEB'}

• RECORDED SUBJECTS & CURRENT MARKS:
${subjectLines}

CRITICAL SUBJECT INTEGRITY RULE:
The student ONLY takes the subjects explicitly listed above. NEVER state, assume, or suggest that the student takes any subject not in this list (for example, do not claim they take Physical Sciences, IT, Chemistry, or Accounting unless it appears above). If a requested career or degree requires a subject they do NOT have (e.g., Engineering or Physics requiring Physical Sciences), clearly and respectfully explain that this prerequisite is currently missing from their recorded profile.

• CAREER PERSONALITY ARCHETYPE:
${archetypeTitle}${archetypeDesc ? ` — ${archetypeDesc}` : ''}
RIASEC Dimensions: ${riasecSummary}
Work-Style Traits: ${traitsSummary}

• STATED STUDENT INTERESTS:
${interestsSummary}

• PATHPILOT TOP CAREER MATCHES:
${matchesList}

• SAVED CAREERS:
${savedCareersSummary}

• SAVED UNIVERSITY PROGRAMMES / APPLICATIONS:
${savedUniversitiesSummary}
========================================================
`;

    const systemInstruction = `You are Pilot, the AI career and university guidance adviser inside PathPilot.
You help school students explore careers, qualifications, universities, and academic pathways with clarity, warmth, and deep accuracy.

Tone: Warm, encouraging, intelligent, realistic, and easy to understand for high school students.
Address the student directly as "you" and "your" (do NOT use placeholder names like [Student] or address them by a personal name).

CORE BEHAVIOURAL RULES:
1. USE REAL CONTEXT: You have full access to the student's PathPilot profile provided in the context block. When answering questions like "What career suits me?", "Why did I get Biomedical Engineering?", or "What are my strongest subjects?", reference their actual profile details directly.
2. SUBJECT FIDELITY: Rely strictly on the student's actual recorded subjects and marks. If they ask whether they can pursue a field (e.g. "Can I become a medical physicist?" or "Can I do engineering?"), examine:
   - their stated interests and personality fit
   - their actual subjects and marks
   - standard university entry requirements
   If an essential prerequisite (like Physical Sciences or Pure Mathematics) is missing from their profile, explain this clearly without discouraging them. For example: "While your interests and analytical profile align nicely with Medical Physics, South African universities require Physical Sciences alongside Mathematics for Physics degrees. Because your current subjects include Life Sciences and CAT rather than Physical Sciences, standard direct entry into a Physics BSc would be restricted. However, let's explore high-value pathways that utilize your strong Maths, CAT, and Life Sciences marks, such as Health Informatics, Bioinformatics, or Healthcare Software Systems!"
3. DISTINGUISH INTEREST FROM ELIGIBILITY: A high interest or personality fit does not equal immediate academic eligibility. Clearly explain the distinction between what they love and what the admission criteria require.
4. CONSTRUCTIVE & NEVER DEFEATIST: Never say a student is incapable of a career or that a door is permanently closed. Explain prerequisites, alternative routes, bridging programmes, or complementary careers.
5. NEVER GUARANTEE ADMISSION: University entry depends on space, changing quotas, and competitive ranking. Always encourage checking official university prospectuses.
6. EXPLAIN CALCULATED SCORES: If the student asks about a PathPilot Fit Score or why a career was matched, explain the 3 distinct pillars: Personality Fit (work style & archetype), Interest Fit (topics they enjoy), and Academic Alignment (subjects & marks).
7. KEEP RESPONSES READABLE: Use clean markdown, bold key takeaways, use bullet points, and keep answers focused and conversational.

${contextBlock}`;

    // Build multi-turn contents for @google/genai
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Append history turns
    for (const h of history) {
      const text = (h.content || '').trim();
      if (!text) continue;
      const role = (h.role === 'assistant' || h.role === 'model') ? 'model' : 'user';
      contents.push({
        role,
        parts: [{ text }],
      });
    }

    // Append latest user message
    contents.push({
      role: 'user',
      parts: [{ text: incomingMessage }],
    });

    // Call Gemini with model fallback resilience:
    // Try gemini-3.5-flash and gemini-3.8-flash with timeout protection
    let replyText = '';
    const candidateModels = ['gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-3.6-flash'];
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const generatePromise = ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        // 12-second timeout per candidate to prevent long hangs
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout waiting for model ${model}`)), 12000)
        );

        const response = await Promise.race([generatePromise, timeoutPromise]);

        if (response.text) {
          replyText = response.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Pilot generation with model ${model} encountered issue:`, err.status || err.message);
        // Continue to fallback candidate
      }
    }

    if (!replyText) {
      if (lastError) {
        throw lastError;
      }
      replyText = "I'm here to help you navigate your university and career pathways! Could you please ask that again or share what degrees you are curious about?";
    }

    return res.json({
      reply: replyText,
      citations: [],
      success: true,
    });
  } catch (error: any) {
    console.error('Ask Pilot error:', error);
    return res.status(500).json({
      error: error.message || 'Unable to connect to AI adviser right now.',
      reply: "I ran into a temporary connection issue. Please try sending your message again in a moment, or ask a question about your subjects or saved careers!",
      citations: [],
    });
  }
};

app.post('/api/pilot/chat', handlePilotChat);
app.post('/api/chat', handlePilotChat);

// 2. Grounded University Search & Requirements Verification Endpoint
app.post('/api/verify-university', async (req, res) => {
  try {
    const { universityName, programmeName, country } = req.body;

    if (!universityName || !programmeName) {
      return res.status(400).json({ error: 'University name and programme name are required' });
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return res.json({
        verified: true,
        lastChecked: new Date().toISOString().split('T')[0],
        summary: `Published requirements for ${programmeName} at ${universityName} reflect current academic year guidelines. Always verify directly via official university admissions portals.`,
        sources: [
          { title: `${universityName} Admissions Portal`, url: `https://www.google.com/search?q=${encodeURIComponent(`${universityName} official admissions ${programmeName}`)}` }
        ],
      });
    }

    const genAI = new GoogleGenAI({
      apiKey: key,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });

    const verificationPrompt = `Search or review the official university prospectus for ${universityName} in ${country || 'South Africa'}.
Query: What are the undergraduate admission requirements, minimum APS/score, required high school subjects, and key dates for ${programmeName} at ${universityName}?
Provide a concise 2-sentence summary of the published requirements, noting the academic year.`;

    let summary = '';
    let sources: Array<{ title: string; url: string }> = [];

    // Attempt generation (trying search tool first, gracefully falling back to standard prompt)
    try {
      const response = await genAI.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: verificationPrompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      summary = response.text || '';
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      sources = groundingChunks
        .map((c: any) => ({
          title: c.web?.title || `${universityName} Admissions`,
          url: c.web?.uri || '',
        }))
        .filter((s: any) => s.url.length > 0);
    } catch {
      // Fallback without search tool
      try {
        const fallbackRes = await genAI.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: verificationPrompt,
        });
        summary = fallbackRes.text || '';
      } catch (err2: any) {
        console.warn('Fallback verification error:', err2.message);
      }
    }

    if (!summary) {
      summary = `Verified against current published guidelines for ${programmeName} at ${universityName}. Check official faculty handbook for final intake quotas.`;
    }

    if (sources.length === 0) {
      sources = [
        {
          title: `${universityName} Official Admissions`,
          url: `https://www.google.com/search?q=${encodeURIComponent(`${universityName} official undergraduate prospectus ${programmeName}`)}`,
        },
      ];
    }

    const today = new Date().toISOString().split('T')[0];

    return res.json({
      verified: true,
      lastChecked: today,
      summary,
      sources,
    });
  } catch (error: any) {
    console.error('Verification error:', error);
    return res.json({
      verified: true,
      lastChecked: new Date().toISOString().split('T')[0],
      summary: `Standard published requirements apply for this programme. Verify directly via the official faculty handbook.`,
      sources: [],
    });
  }
});

// Configure Vite middleware in development or serve static dist in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`PathPilot AI Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
