import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  BookOpen,
  ShieldCheck,
  PhoneCall,
  User,
  Bot,
  RefreshCw,
} from 'lucide-react';
import { requestKnowledgeAnswer } from '../../services/aiService';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  sources?: string[];
  timestamp: string;
}

export const KnowledgeAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm_1',
      sender: 'assistant',
      text: 'Namaskaram! I am your FarmBridge Agronomic Knowledge Assistant. You can ask me questions about soil nutrient balancing (NPK), zero-budget organic pest controls, legume rotation cycles, or government subsidies like PMKSY and PMFBY.\n\nHow can I support your farming decisions today?',
      sources: ['ICAR Package of Practices', 'State Agriculture Department Handbooks'],
      timestamp: '10:00 AM',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sampleQuestions = [
    'How do I naturally control Pink Bollworm in Cotton?',
    'Why can I skip chemical Potash if my soil test shows High K?',
    'What documents are needed for the 90% Drip Irrigation subsidy?',
    'What are the mandatory water test rules before starting a farm stay?',
  ];

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await requestKnowledgeAnswer(textToSend);
      const botMsg: Message = {
        id: `bot_${Date.now()}`,
        sender: 'assistant',
        text: res.answer,
        sources: res.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Failed to get knowledge answer:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="border-b border-stone-200 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Evidence-Grounded Agronomic Q&A</span>
        </div>
        <h1 className="text-2xl font-extrabold text-stone-900">
          Agricultural Knowledge & Extension Assistant
        </h1>
        <p className="text-xs text-stone-600 mt-1">
          Grounded in Indian Council of Agricultural Research (ICAR) packages and state agricultural university manuals.
        </p>
      </div>

      {/* Suggested Questions */}
      <div className="flex flex-wrap gap-2">
        {sampleQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q)}
            className="text-xs px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 border border-stone-200 transition text-left"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Thread */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs h-[480px] flex flex-col justify-between overflow-hidden">
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-stone-900 text-white'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-emerald-700" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-stone-900 text-white rounded-tr-none'
                    : 'bg-stone-50 border border-stone-200 text-stone-800 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {msg.sources && msg.sources.length > 0 && (
                  <div className="pt-2 border-t border-stone-200/60 text-[10px] text-stone-500 space-y-0.5">
                    <span className="font-semibold block">Supporting Reference Citations:</span>
                    {msg.sources.map((s, idx) => (
                      <span key={idx} className="block">• {s}</span>
                    ))}
                  </div>
                )}

                <span className="text-[10px] text-stone-400 block text-right">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-stone-500 italic p-3">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Consulting agronomic knowledge base...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-stone-200 bg-stone-50 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your agricultural, fertilizer, or scheme question..."
            className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
