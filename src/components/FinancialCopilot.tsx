import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, AlertCircle, Bot, User, RefreshCw, Key } from 'lucide-react';
import { ChatMessage } from '../types';

// Simple, React 19 safe Markdown to HTML translator to display elegant bullets, bolding, and headings
function CustomMarkdown({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-2 text-xs md:text-sm font-sans text-zinc-300 leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        
        // Headers
        if (trimmed.startsWith('###')) {
          return <h4 key={idx} className="font-semibold text-white tracking-tight mt-3 text-xs md:text-sm">{trimmed.replace(/^###\s*/, '')}</h4>;
        }
        if (trimmed.startsWith('##')) {
          return <h3 key={idx} className="font-bold text-white tracking-tight mt-4 text-sm border-b border-zinc-800 pb-1">{trimmed.replace(/^##\s*/, '')}</h3>;
        }
        if (trimmed.startsWith('#')) {
          return <h2 key={idx} className="font-bold text-white tracking-tight mt-4 text-base">{trimmed.replace(/^#\s*/, '')}</h2>;
        }

        // Bullet lists
        if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
          const content = trimmed.replace(/^[*-\s]+/, '');
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-3">
              <span className="text-indigo-500 mt-1 select-none font-bold">•</span>
              <span>{parseBold(content)}</span>
            </div>
          );
        }

        // Numeric lists
        if (/^\d+\./.test(trimmed)) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-3">
              <span className="text-indigo-400 font-mono select-none font-semibold">{trimmed.match(/^\d+\./)?.[0]}</span>
              <span>{parseBold(trimmed.replace(/^\d+\.\s*/, ''))}</span>
            </div>
          );
        }

        // Empty lines
        if (trimmed === '') {
          return <div key={idx} className="h-1.5"></div>;
        }

        // Standalone text
        return <p key={idx}>{parseBold(trimmed)}</p>;
      })}
    </div>
  );
}

// Helper to do safe regex bold token substitution
function parseBold(text: string) {
  const regex = /\*\*(.*?)\*\*/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(<strong key={match.index} className="text-white font-semibold">{match[1]}</strong>);
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}


interface FinancialCopilotProps {
  financials: any;
}

export default function FinancialCopilot({ financials }: FinancialCopilotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am FinTwin's Financial Copilot. I have mapped the entire digital twin schema for ${financials?.companyName || 'StellarTech Solutions Solutions Inc.'}.\n\nAsk me anything about your actual financials! For example: \n\n* **Why is profit decreasing?**\n* **How can we optimize cloud cost or CAC payload?**\n* **Should we expand next quarter or hold liquidity?**`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestionPrompts = [
    "Why is profit decreasing?",
    "How can we improve cash flow?",
    "What is our biggest financial risk?",
    "Should we expand next quarter?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    setErrorMsg(null);
    const userMsg: ChatMessage = {
      id: `m_user_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Append user message and set loader
    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setLoading(true);

    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          financials // Dynamic baseline financials passed to the model
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Cognitive co-pilot pipeline timed out.');
      }

      const resData = await response.json();
      const assistantMsg: ChatMessage = {
        id: `m_assistant_${Date.now()}`,
        role: 'assistant',
        content: resData.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Copilot err:', err);
      setErrorMsg(err.message || 'Unable to connect to financial agent brain. Double check your GEMINI_API_KEY value.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden" id="financial_copilot_module">
      
      {/* Header bar */}
      <div className="bg-zinc-950 border-b border-zinc-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-950 text-indigo-400 border border-indigo-900 rounded-lg">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white tracking-tight uppercase font-mono">Autonomous Advisor</h2>
            <span className="text-[9px] text-indigo-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-505 bg-indigo-500 animate-pulse"></span>
              Synchronized to live ledger
            </span>
          </div>
        </div>
        <button 
          onClick={() => {
            setMessages([
              {
                id: 'welcome',
                role: 'assistant',
                content: "Chat session refreshed. Model sync active. What financial scenarios can I assist you with today?",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]);
            setErrorMsg(null);
          }}
          className="p-1 hover:text-white rounded border border-zinc-800 hover:border-zinc-700 bg-zinc-900 transition-all text-zinc-400"
          title="Clear session"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages body scrolling */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 min-h-0 bg-zinc-950/20">
        
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex items-start gap-2.5 max-w-[85%] ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            {/* Avatar icon bubble */}
            <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 border ${
              msg.role === 'user' 
                ? 'bg-zinc-800 text-zinc-200 border-zinc-700' 
                : 'bg-indigo-950 text-indigo-400 border-indigo-900'
            }`}>
              {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            {/* Bubble body wrapper */}
            <div className={`p-3 rounded-xl border ${
              msg.role === 'user'
                ? 'bg-zinc-900 border-zinc-800 rounded-tr-none text-zinc-150'
                : 'bg-zinc-900/60 border-zinc-805 border-zinc-800/80 rounded-tl-none'
            }`}>
              <CustomMarkdown text={msg.content} />
              <span className="text-[9px] text-zinc-500 font-mono block text-right mt-1.5">{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {/* Loading placeholder */}
        {loading && (
          <div className="flex items-start gap-2.5 max-w-[80%]">
            <div className="p-1.5 bg-indigo-955 bg-indigo-950 text-indigo-400 border border-indigo-900 rounded-lg shrink-0 animate-bounce">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl rounded-tl-none space-y-1.5">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider animate-pulse">CFO Agent Thinking...</span>
              </div>
              <div className="flex space-x-1.5 items-center py-1">
                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Local Error alert bar */}
        {errorMsg && (
          <div className="bg-rose-950/25 border border-rose-900 p-3 rounded-lg flex items-start gap-1.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span>{errorMsg}</span>
              <span className="block text-[10px] text-zinc-500 font-mono">Ensure GEMINI_API_KEY is registered.</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion prompt micro pills (only show when not actively computing) */}
      {!loading && messages.length <= 3 && (
        <div className="px-4 py-2 bg-zinc-950/40 border-t border-zinc-850/50 space-y-1.5">
          <span className="text-[9px] uppercase font-mono tracking-wider font-semibold text-zinc-500">Suggested Inquiries:</span>
          <div className="flex flex-wrap gap-1.5 pb-1">
            {suggestionPrompts.map((sug, i) => (
              <button 
                key={i}
                onClick={() => handleSendMessage(sug)}
                className="text-[10px] bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white px-2.5 py-1 rounded-full transition-all"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input row */}
      <div className="p-3 bg-zinc-950 border-t border-zinc-800">
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputVal)}
            disabled={loading}
            placeholder="Interrogate digital twin model..."
            className="flex-1 text-xs bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-lg focus:outline-none focus:border-indigo-500 placeholder-zinc-500"
          />
          <button
            onClick={() => handleSendMessage(inputVal)}
            disabled={loading || !inputVal.trim()}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-lg transition-all"
            title="Transmit message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
