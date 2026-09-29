import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ExternalLink,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';
import { useStudent } from '../../context/StudentContext';
import { CAREERS_DATABASE } from '../../data/careersData';
import { UNIVERSITIES_DATABASE } from '../../data/universitiesData';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: { title: string; url: string }[];
}

export const AskPilotDrawer: React.FC = () => {
  const {
    isAskPilotOpen,
    setIsAskPilotOpen,
    profile,
    topMatches,
    applications,
    initialPilotQuestion,
    setInitialPilotQuestion,
  } = useStudent();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Welcome 👋 I’m **Pilot**, your AI career and university guidance adviser on PathPilot.

I have direct access to your recorded subjects, marks, personality archetype, and career matches.

You can ask me anything, such as:
• *"What careers suit my actual marks?"*
• *"Why did I get my top career match?"*
• *"Do I take the right subjects for engineering or physics?"*
• *"What if I improve my Maths mark to 80%?"*

How can I help you plan your pathway today?`,
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPilotQuestion && isAskPilotOpen) {
      handleSendMessage(initialPilotQuestion);
      setInitialPilotQuestion('');
    }
  }, [initialPilotQuestion, isAskPilotOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isAskPilotOpen) return null;

  // Build structured student context object
  const buildStudentContext = () => {
    if (!profile) return null;

    const savedCareerTitles = (profile.savedCareerIds || []).map((id) => {
      const career = CAREERS_DATABASE.find((c) => c.id === id);
      return career ? career.title : id;
    });

    const savedUniversityTitles = (profile.savedUniversityIds || []).map((id) => {
      const prog = UNIVERSITIES_DATABASE.find((u) => u.id === id);
      return prog ? `${prog.programmeName} (${prog.universityName})` : id;
    });

    const appSummaries = (applications || []).map(
      (a) => `${a.programmeName} at ${a.universityName} [Status: ${a.status}]`
    );

    return {
      country: profile.country,
      region: profile.region,
      grade: profile.grade,
      curriculum: profile.curriculum,
      subjects: profile.subjects,
      marks: profile.subjects?.map((s) => ({ subject: s.name, mark: s.mark })),
      personalityProfile: {
        archetypeTitle: profile.careerStyle?.title,
        description: profile.careerStyle?.description,
        dominantTraits: profile.careerStyle?.traits,
      },
      riasecProfile: profile.riasecScores,
      workStyleTraits: profile.workStyleTraits,
      interests: profile.interests,
      workPreferences: profile.workPreferences,
      careerMatches: (topMatches || []).slice(0, 5).map((m) => ({
        title: m.career.title,
        fitScore: m.fitScore,
        personalityFit: m.personalityFit,
        interestFit: m.interestFit,
        academicAlignment: m.academicAlignment,
        resultCategory: m.resultCategory,
        criticalMissingSubjects: m.criticalMissingSubjects || [],
        cautionNotes: m.cautionNotes || [],
        matchReasons: m.matchReasons || [],
      })),
      savedCareers: savedCareerTitles,
      savedUniversities: [...savedUniversityTitles, ...appSummaries],
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    const contextPayload = buildStudentContext();

    // Filter out initial greeting from history passed to LLM
    const conversationHistory = messages
      .filter((m) => m.id !== 'welcome' && m.id !== 'welcome-reset')
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const response = await fetch('/api/pilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory,
          studentContext: contextPayload,
          // Backwards compatibility keys
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          studentProfile: profile,
        }),
      });

      const data = await response.json();
      const assistantMessage: Message = {
        id: `pilot-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "I'm here to help! Could you please rephrase or expand on your question?",
        citations: data.citations || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `pilot-err-${Date.now()}`,
          role: 'assistant',
          content:
            "I ran into a temporary connection issue. Please check your network and try again, or ask a question about your subject marks!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: `Chat reset! Let's start fresh. Ask me anything about university admission criteria, subject benchmarks, or career pathways.`,
      },
    ]);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Generate dynamic, context-aware suggestions
  const topMatch = topMatches && topMatches.length > 0 ? topMatches[0] : null;
  const cautionMatch = topMatches?.find((m) => m.criticalMissingSubjects && m.criticalMissingSubjects.length > 0);

  const dynamicSuggestions = [
    topMatch ? `Why did I match with ${topMatch.career.title}?` : 'What career suits me best?',
    cautionMatch
      ? `Can I study ${cautionMatch.career.title} with my subjects?`
      : 'Can I become a medical physicist?',
    'What are my strongest subjects and career options?',
    'What if I improve my Maths mark to 80%?',
  ];

  // Helper to render basic Markdown formatting in text
  const renderFormattedText = (raw: string) => {
    // Split by lines to maintain structure
    const lines = raw.split('\n');
    return lines.map((line, idx) => {
      // Heading level 3 or 4
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-bold text-cyan-200 mt-2.5 mb-1 text-xs">
            {line.replace(/^###\s+/, '')}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className="font-bold text-white mt-3 mb-1 text-sm border-b border-slate-700/60 pb-1">
            {line.replace(/^##\s+/, '')}
          </h3>
        );
      }

      // Horizontal dividers
      if (line.trim() === '---' || line.trim() === '***') {
        return <hr key={idx} className="my-2 border-slate-700/60" />;
      }

      // Bullet points
      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('*') || line.trim().startsWith('-');
      const cleanLine = isBullet ? line.replace(/^[\s•*-]+/, '') : line;

      // Parse bold **text**
      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
      const parsedContent = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-bold text-cyan-200">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={idx} className="flex items-start gap-1.5 my-0.5 ml-1">
            <span className="text-cyan-400 select-none">•</span>
            <span className="flex-1">{parsedContent}</span>
          </div>
        );
      }

      return (
        <p key={idx} className={`${line.trim() === '' ? 'h-2' : 'my-0.5'}`}>
          {parsedContent}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/65 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="relative w-full max-w-lg h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/95">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="h-5 w-5 text-yellow-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-extrabold text-white font-heading">Ask Pilot ✨</h2>
                <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-500/30">
                  AI Career Adviser
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span>Grounded with your profile</span>
                {profile?.subjects && profile.subjects.length > 0 && (
                  <span className="text-[10px] bg-indigo-950 text-indigo-300 px-1.5 py-0.2 rounded border border-indigo-800">
                    {profile.subjects.length} subjects loaded
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleResetChat}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              title="Reset conversation"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsAskPilotOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              title="Close drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Profile Context Pill */}
        {profile && (
          <div className="px-4 py-2 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300">
            <div className="flex items-center gap-2 truncate">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
              <span className="font-semibold text-white truncate">
                {profile.careerStyle?.title || 'Academic Profile'}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{profile.grade || 'High School'}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{profile.curriculum}</span>
            </div>
          </div>
        )}

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => {
            const isPilot = m.role === 'assistant';
            return (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${isPilot ? 'justify-start' : 'justify-end'}`}
              >
                {isPilot && (
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-cyan-300 flex-shrink-0 mt-1">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                )}

                <div
                  className={`relative group max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    isPilot
                      ? 'bg-slate-800/90 border border-slate-700/70 text-slate-200 shadow-md'
                      : 'bg-indigo-600 text-white font-medium shadow-md'
                  }`}
                >
                  <div>{renderFormattedText(m.content)}</div>

                  {/* Copy button for Pilot answers */}
                  {isPilot && m.id !== 'welcome' && (
                    <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-cyan-400" />
                        Grounded in your subjects
                      </span>
                      <button
                        onClick={() => handleCopyMessage(m.id, m.content)}
                        className="text-[10px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded bg-slate-900/60 border border-slate-700/60"
                        title="Copy answer"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Citations if available */}
                  {m.citations && m.citations.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-700/60 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 block">Sources referenced:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {m.citations.slice(0, 3).map((c, i) => (
                          <a
                            key={i}
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-cyan-300 hover:underline bg-slate-900/60 px-2 py-0.5 rounded border border-slate-700"
                          >
                            <span>{c.title}</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {!isPilot && (
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-900 text-cyan-300 flex-shrink-0 mt-1">
                    <User className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-cyan-300 flex-shrink-0">
                <Sparkles className="h-3.5 w-3.5 animate-spin" />
              </div>
              <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-3 text-xs text-slate-300 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>Pilot is reviewing your subjects and formulating guidance...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Questions */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Suggested questions for your profile:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {dynamicSuggestions.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="text-left text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="h-2.5 w-2.5 text-cyan-400 shrink-0" />
                  <span>"{prompt}"</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/95 space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Pilot about your subjects, degrees, or requirements..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-colors flex-shrink-0 cursor-pointer disabled:cursor-not-allowed"
              title="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          <p className="text-[10px] text-center text-slate-500 flex items-center justify-center gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
            <span>Pilot offers guidance, not admission guarantees. Always verify with official prospectuses.</span>
          </p>
        </div>
      </div>
    </div>
  );
};
