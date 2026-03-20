import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Zap, Minimize2 } from 'lucide-react';
import { C } from '../lib/theme';

interface Message {
  id: number;
  role: 'user' | 'ai';
  text: string;
}

const WELCOME: Message = {
  id: 0,
  role: 'ai',
  text: 'Hej! Jestem Twoim AI asystentem Google Ads. Mogę analizować kampanie, sugerować optymalizacje i odpowiadać na pytania o Twoje dane. O co chcesz zapytać?',
};

const QUICK_PROMPTS = [
  'Które kampanie mają najniższy ROAS?',
  'Jakie słowa kluczowe tracą budżet?',
  'Podsumuj wyniki z ostatnich 30 dni',
];

const AI_RESPONSES: Record<string, string> = {
  default: 'Na podstawie Twoich danych z ostatnich 30 dni: kampania **HR Software – Generic** ma ROAS 1.93×, poniżej celu 3.0×. Rekomenduję zmianę bid strategy na Enhanced CPC lub pauzę do audytu słów kluczowych.',
  roas: 'Najniższy ROAS mają:\n1. HR Software – Generic: **1.93×** (poniżej celu 3.0×)\n2. Competitor – PMAX: **2.24×** (marginalny)\n\nPozostałe kampanie są nad targetem. Brand – Kadromierz osiąga rekordowe **5.81×**.',
  keywords: 'Frazy tracące budżet (ROAS <2×):\n• "oprogramowanie do zarządzania" — 234 PLN, ROAS 1.2×\n• "system kadrowy" — 187 PLN, ROAS 0.8×\n\nŁącznie ~23% budżetu fraz to wasted spend. Rekomendacja: pause + exact match.',
  summary: 'Ostatnie 30 dni (Kadromierz):\n• Konwersje: **661** (+14% WoW)\n• ROAS: **3.19×** (cel ✓)\n• Wydatki: **28.5k PLN**\n• Aktywne kampanie: 5/6\n\nNajwiększy problem: zmęczenie kreacji w 2 kampaniach i wasted spend ~6.5k PLN na słowach kluczowych.',
};

function pickResponse(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('roas') || t.includes('najniższy') || t.includes('kampani')) return AI_RESPONSES.roas;
  if (t.includes('słow') || t.includes('fraz') || t.includes('keyword') || t.includes('budżet')) return AI_RESPONSES.keywords;
  if (t.includes('podsumuj') || t.includes('wyniki') || t.includes('30 dni')) return AI_RESPONSES.summary;
  return AI_RESPONSES.default;
}

export default function ChatBubble() {
  const [open, setOpen]       = useState(false);
  const [msgs, setMsgs]       = useState<Message[]>([WELCOME]);
  const [input, setInput]     = useState('');
  const [typing, setTyping]   = useState(false);
  const bottomRef             = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, open]);

  function send(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: 'user', text: text.trim() };
    setMsgs(m => [...m, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMsgs(m => [...m, { id: Date.now() + 1, role: 'ai', text: pickResponse(text) }]);
      setTyping(false);
    }, 900 + Math.random() * 600);
  }

  return (
    <>
      {/* ── Floating button ─────────────────────────────────── */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed', bottom: 24, right: 24,
            width: 52, height: 52, borderRadius: 99,
            background: 'linear-gradient(135deg,#F97316,#EA580C)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(249,115,22,0.40), 0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 999,
            transition: 'transform .2s, box-shadow .2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
          title="AI Asystent"
        >
          <MessageSquare size={22} color="#fff" />
        </button>
      )}

      {/* ── Chat panel ──────────────────────────────────────── */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24,
          width: 380, height: 540,
          background: '#fff',
          border: '1px solid #E8ECF0',
          borderRadius: 16,
          boxShadow: '0 16px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)',
          display: 'flex', flexDirection: 'column',
          zIndex: 999,
          overflow: 'hidden',
          fontFamily: 'Inter, sans-serif',
          animation: 'slideUp .22s cubic-bezier(0.22,1,0.36,1)',
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 16px',
            background: 'linear-gradient(135deg,#F97316,#EA580C)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 99,
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={16} color="#fff" fill="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: '#fff', lineHeight: 1 }}>AI Asystent</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>
                <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: 99, background: '#86efac', marginRight: 4, verticalAlign: 'middle' }} />
                Online · Google Ads
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.8)', padding: 4, borderRadius: 6, display: 'flex' }}
            >
              <Minimize2 size={16} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 4px' }}>
            {msgs.map(m => (
              <div key={m.id} style={{
                marginBottom: 12,
                display: 'flex',
                flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-end', gap: 8,
              }}>
                {m.role === 'ai' && (
                  <div style={{
                    width: 26, height: 26, borderRadius: 99, flexShrink: 0,
                    background: 'linear-gradient(135deg,#F97316,#EA580C)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Zap size={12} color="#fff" fill="#fff" />
                  </div>
                )}
                <div style={{
                  maxWidth: '78%',
                  padding: '9px 13px',
                  borderRadius: m.role === 'user' ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
                  background: m.role === 'user' ? 'linear-gradient(135deg,#F97316,#EA580C)' : '#F7F8FA',
                  color: m.role === 'user' ? '#fff' : C.text,
                  fontSize: 13, lineHeight: 1.55,
                  border: m.role === 'ai' ? '1px solid #E8ECF0' : 'none',
                  whiteSpace: 'pre-line',
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 26, height: 26, borderRadius: 99, background: 'linear-gradient(135deg,#F97316,#EA580C)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={12} color="#fff" fill="#fff" />
                </div>
                <div style={{ padding: '10px 14px', borderRadius: '12px 12px 12px 3px', background: '#F7F8FA', border: '1px solid #E8ECF0', display: 'flex', gap: 4 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: 99, background: '#94A3B8', animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          {msgs.length <= 1 && (
            <div style={{ padding: '0 12px 10px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {QUICK_PROMPTS.map(p => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  style={{
                    fontSize: 11.5, padding: '5px 10px', borderRadius: 99,
                    background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.22)',
                    color: '#F97316', fontWeight: 600, cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '10px 12px',
            borderTop: '1px solid #E8ECF0',
            display: 'flex', gap: 8, alignItems: 'center',
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
              placeholder="Zapytaj o kampanie…"
              style={{
                flex: 1, padding: '9px 13px', borderRadius: 10,
                border: '1px solid #E8ECF0', background: '#F7F8FA',
                fontSize: 13, color: C.text, outline: 'none',
                fontFamily: 'Inter, sans-serif',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#F97316'; e.currentTarget.style.background = '#fff'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#E8ECF0'; e.currentTarget.style.background = '#F7F8FA'; }}
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim()}
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: input.trim() ? 'linear-gradient(135deg,#F97316,#EA580C)' : '#E8ECF0',
                border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background .15s',
                flexShrink: 0,
              }}
            >
              <Send size={15} color={input.trim() ? '#fff' : '#94A3B8'} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
