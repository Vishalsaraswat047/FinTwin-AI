import React, { useState, useRef, useEffect } from 'react';
import { Send, AlertCircle, Bot, User, RefreshCw, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { ChatMessage } from '../types';

interface Props { financials: any; }

function Markdown({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-2 text-xs font-sans text-surface-300 leading-relaxed">
      {lines.map((line, idx) => {
        const t = line.trim();
        if (t.startsWith('###')) return <h4 key={idx} className="font-semibold text-white mt-2 text-xs">{t.replace(/^###\s*/, '')}</h4>;
        if (t.startsWith('##')) return <h3 key={idx} className="font-bold text-white mt-3 text-sm border-b border-surface-700/30 pb-1">{t.replace(/^##\s*/, '')}</h3>;
        if (t.startsWith('#')) return <h2 key={idx} className="font-bold text-white mt-3 text-base">{t.replace(/^#\s*/, '')}</h2>;
        if (t.startsWith('*') || t.startsWith('-')) return <div key={idx} className="flex items-start gap-1.5 pl-3"><span className="text-primary-500 mt-1 select-none font-bold">•</span><span>{B(t.replace(/^[*-\s]+/, ''))}</span></div>;
        if (/^\d+\./.test(t)) return <div key={idx} className="flex items-start gap-1.5 pl-3"><span className="text-primary-400 font-mono select-none font-semibold">{t.match(/^\d+\./)?.[0]}</span><span>{B(t.replace(/^\d+\.\s*/, ''))}</span></div>;
        if (t === '') return <div key={idx} className="h-1" />;
        return <p key={idx}>{B(t)}</p>;
      })}
    </div>
  );
}

function B(text: string) {
  const parts: (string | React.ReactNode)[] = [];
  let last = 0, m;
  const re = /\*\*(.*?)\*\*/g;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.substring(last, m.index));
    parts.push(<strong key={m.index} className="text-white font-semibold">{m[1]}</strong>);
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.substring(last));
  return parts.length ? parts : text;
}

const SUGGESTIONS = [
  "Why is profit decreasing?",
  "How can we improve cash flow?",
  "What is our biggest financial risk?",
  "Should we expand next quarter?"
];

export default function FinancialCopilot({ financials }: Props) {
  const [msgs, setMsgs] = useState<ChatMessage[]>([{
    id: 'welcome', role: 'assistant',
    content: `Hello! I'm FinTwin's Copilot. I've mapped the twin schema for **${financials?.companyName || 'your company'}**.\n\nAsk me about your financials:\n\n* **Why is profit decreasing?**\n* **How can we improve cash flow?**\n* **Should we expand next quarter?**`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }]);
  const [val, setVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setErr(null);
    setMsgs(p => [...p, { id: `u_${Date.now()}`, role: 'user', content: text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setVal(''); setLoading(true);
    try {
      const res = await fetch('/api/copilot', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: msgs.map(m => ({ role: m.role, content: m.content })), financials }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Request failed');
      const d = await res.json();
      setMsgs(p => [...p, { id: `a_${Date.now()}`, role: 'assistant', content: d.reply, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } catch (e: any) { setErr(e.message); toast.error('Copilot error', { description: e.message }); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col h-[600px] bg-surface-900/80 border-l border-surface-700/30 overflow-hidden">
      <div className="bg-surface-900 border-b border-surface-700/30 p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white font-mono uppercase tracking-wider">AI Advisor</h2>
            <span className="text-[9px] text-primary-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live twin sync
            </span>
          </div>
        </div>
        <button onClick={() => { setMsgs([{ id: 'w', role: 'assistant', content: 'Session cleared. Ask me anything!', timestamp: '' }]); setErr(null); }}
          className="p-1.5 rounded-lg border border-surface-700/30 text-surface-400 hover:text-white hover:bg-surface-800 transition-all">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 bg-surface-950/30">
        {msgs.map((m) => (
          <div key={m.id} className={`flex items-start gap-2 max-w-[90%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
            <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 border ${m.role === 'user' ? 'bg-surface-800 text-surface-200 border-surface-700' : 'bg-gradient-to-br from-primary-500 to-accent-500 text-white border-0'}`}>
              {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>
            <div className={`p-3 rounded-xl border ${m.role === 'user' ? 'bg-surface-800 border-surface-700/60 rounded-tr-none' : 'bg-surface-900/80 border-surface-700/20 rounded-tl-none'}`}>
              <Markdown text={m.content} />
              {m.timestamp && <span className="text-[8px] text-surface-600 font-mono block text-right mt-1.5">{m.timestamp}</span>}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-2 max-w-[80%]">
            <div className="p-1.5 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 animate-bounce shrink-0"><Bot className="w-3.5 h-3.5 text-white" /></div>
            <div className="bg-surface-900/80 border border-surface-700/20 p-3 rounded-xl rounded-tl-none">
              <span className="text-[10px] font-mono text-primary-400 animate-pulse">Analyzing...</span>
              <div className="flex space-x-1 pt-2">{[0, 150, 300].map((d) => <div key={d} className="w-1.5 h-1.5 bg-surface-600 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}</div>
            </div>
          </div>
        )}
        {err && (
          <div className="bg-rose-950/15 border border-rose-900/40 p-3 rounded-xl flex items-start gap-1.5 text-[11px] text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div><span>{err}</span><span className="block text-[9px] text-surface-500 font-mono mt-0.5">Check your GROQ_API_KEY.</span></div>
          </div>
        )}
        <div ref={ref} />
      </div>

      {!loading && msgs.length <= 2 && (
        <div className="px-3.5 py-2 bg-surface-950/40 border-t border-surface-700/30">
          <span className="text-[8px] uppercase font-mono tracking-wider font-semibold text-surface-500 block mb-1.5">Quick questions</span>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)}
                className="text-[9px] bg-surface-800/60 hover:bg-surface-800 border border-surface-700/30 text-surface-400 hover:text-white px-2.5 py-1 rounded-full transition-all">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-3 bg-surface-900 border-t border-surface-700/30">
        <div className="flex items-center gap-2">
          <input value={val} onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(val)} disabled={loading}
            placeholder="Ask about your twin..."
            className="flex-1 text-xs bg-surface-800 border border-surface-700/60 text-white p-2.5 rounded-xl focus:outline-none focus:border-primary-500/50 placeholder-surface-600 transition-all" />
          <button onClick={() => send(val)} disabled={loading || !val.trim()}
            className="p-2.5 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-400 hover:to-accent-400 disabled:from-surface-800 disabled:to-surface-800 disabled:text-surface-600 text-white rounded-xl transition-all shadow-lg shadow-primary-500/20">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
