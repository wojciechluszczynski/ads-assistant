import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Check, X, AlertTriangle, Loader, Zap } from 'lucide-react';
import { C, card } from '../lib/theme';
import type { ChatMessage, ChangePreview } from '../lib/types';

const SUGGESTED = [
  'Jaki jest ROAS moich kampanii w tym tygodniu?',
  'Zwiększ budżet kampanii Brand o 20%',
  'Wstrzymaj wszystkie kampanie z ROAS poniżej 2',
  'Porównaj koszty z poprzednim tygodniem',
  'Które słowa kluczowe generują najwięcej konwersji?',
  'Stwórz nową kampanię Search dla produktu X',
];

function RiskBadge({ level }: { level: ChangePreview['riskLevel'] }) {
  const cfg = {
    low:    { color: C.accent,  bg: C.greenBg,   label: 'Niskie ryzyko'  },
    medium: { color: C.orange,  bg: C.orangeBg,  label: 'Srednie ryzyko' },
    high:   { color: C.rose,    bg: C.roseBg,    label: 'Wysokie ryzyko' },
  }[level];
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}33`,
    }}>{cfg.label}</span>
  );
}

function ChangePreviewCard({ preview, onConfirm, onReject }: {
  preview: ChangePreview;
  onConfirm: () => void;
  onReject: () => void;
}) {
  return (
    <div style={{
      ...card, marginTop: 10, padding: '14px 16px',
      border: `1px solid rgba(249,115,22,0.30)`,
      background: `rgba(249,115,22,0.04)`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <AlertTriangle size={15} color={C.accent} />
          <span style={{ fontWeight: 700, fontSize: 13, color: C.text }}>Podgląd zmiany</span>
        </div>
        <RiskBadge level={preview.riskLevel} />
      </div>
      <p style={{ fontSize: 13, color: C.text2, margin: '0 0 10px' }}>{preview.description}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
        {Object.keys(preview.before).map(key => (
          <div key={key} style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, background: C.roseBg, borderRadius: 8, padding: '8px 10px' }}>
              <div style={{ fontSize: 10, color: C.text3, marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.5 }}>PRZED</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.rose }}>{String(preview.before[key])}</div>
            </div>
            <div style={{ flex: 1, background: C.greenBg, borderRadius: 8, padding: '8px 10px' }}>
              <div style={{ fontSize: 10, color: C.text3, marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.5 }}>PO</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.accent }}>{String(preview.after[key])}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onConfirm} style={{
          flex: 1, padding: '9px', borderRadius: 8,
          background: C.accent, border: 'none',
          color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
          boxShadow: `0 2px 8px ${C.glow}`, transition: 'all .15s',
        }}>
          <Check size={14} /> Zatwierdź zmianę
        </button>
        <button onClick={onReject} style={{
          padding: '9px 14px', borderRadius: 8,
          background: C.roseBg, border: `1px solid rgba(239,68,68,0.25)`,
          color: C.rose, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600,
        }}>
          <X size={14} /> Anuluj
        </button>
      </div>
    </div>
  );
}

function MessageBubble({ msg, onConfirm, onReject }: {
  msg: ChatMessage;
  onConfirm: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const isUser = msg.role === 'user';
  return (
    <div style={{
      display: 'flex', gap: 10, alignItems: 'flex-start',
      flexDirection: isUser ? 'row-reverse' : 'row',
      marginBottom: 16,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
        background: isUser
          ? `linear-gradient(135deg, ${C.accent}, ${C.accent2})`
          : C.c2,
        border: isUser ? 'none' : `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: isUser ? `0 2px 8px ${C.glow}` : undefined,
      }}>
        {isUser ? <User size={15} color="#fff" /> : <Bot size={15} color={C.navy} />}
      </div>
      <div style={{ maxWidth: '80%', minWidth: 60 }}>
        <div style={{
          padding: '10px 14px', borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
          background: isUser ? `linear-gradient(135deg, ${C.accent}, ${C.accent2})` : C.c1,
          border: isUser ? 'none' : `1px solid ${C.border}`,
          fontSize: 14, color: isUser ? '#fff' : C.text, lineHeight: 1.6,
          boxShadow: isUser ? `0 4px 14px ${C.glow}` : '0 1px 4px rgba(0,0,0,0.04)',
        }}>
          {msg.content}
        </div>
        {msg.changePreview && !msg.changePreview.confirmed && (
          <ChangePreviewCard
            preview={msg.changePreview}
            onConfirm={() => onConfirm(msg.id)}
            onReject={() => onReject(msg.id)}
          />
        )}
        {msg.changePreview?.confirmed === true && (
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: C.accent }}>
            <Check size={13} /> Zmiana zastosowana
          </div>
        )}
        {msg.changePreview?.confirmed === false && (
          <div style={{ marginTop: 8, fontSize: 12, color: C.text3 }}>Zmiana anulowana.</div>
        )}
        <div style={{ fontSize: 10, color: C.text3, marginTop: 4, textAlign: isUser ? 'right' : 'left' }}>
          {msg.timestamp.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}

// Simulated AI responses
function simulateResponse(userMsg: string): { content: string; changePreview?: ChangePreview } {
  const lower = userMsg.toLowerCase();

  if (lower.includes('roas')) {
    return {
      content: `ROAS Twoich kampanii (ostatnie 7 dni):\n\nBrand - Kadromierz [Search]: 5.81x\nRetargeting - Display: 12.14x\nCompetitor - PMAX: 2.64x\nHR Software - Generic: 1.93x\n\nSredni ROAS: 3.19x. Polecam skupić się na kampanii HR Software - Generic, jest poniżej progu rentowności 2.5x. Rozważmy obniżenie stawek lub pauzę.`,
    };
  }

  if (lower.includes('budżet') || lower.includes('budget') || lower.includes('zwiększ') || lower.includes('zwieksz')) {
    return {
      content: `Rozumiem — chcesz zmienić budżet kampanii Brand - Kadromierz. Oto podgląd zmiany przed zastosowaniem:`,
      changePreview: {
        type: 'budget_change',
        description: 'Zwiększenie dziennego budżetu kampanii "Brand - Kadromierz [Search]" o 20%.',
        before: { 'Budżet dzienny': '150 PLN' },
        after:  { 'Budżet dzienny': '180 PLN' },
        riskLevel: 'low',
      },
    };
  }

  if (lower.includes('wstrzymaj') || lower.includes('pause') || lower.includes('pauza')) {
    return {
      content: `Znalazłem kampanie z ROAS poniżej 2.0:\n\nHR Software - Generic [Search] — ROAS: 1.93x, koszt: 8 996 PLN\n\nCzy chcesz wstrzymać tę kampanię?`,
      changePreview: {
        type: 'status_change',
        description: 'Wstrzymanie kampanii "HR Software - Generic [Search]" z powodu niskiego ROAS.',
        before: { Status: 'AKTYWNA', ROAS: '1.93x' },
        after:  { Status: 'WSTRZYMANA', 'Szacowane oszczędności': '300 PLN/d' },
        riskLevel: 'medium',
      },
    };
  }

  if (lower.includes('porównaj') || lower.includes('compare') || lower.includes('poprzedni')) {
    return {
      content: `Porównanie tygodniowe:\n\nWydatki: 6 620 PLN vs 6 142 PLN (+7.8%)\nKliknięcia: 3 218 vs 2 994 (+7.5%)\nKonwersje: 156 vs 131 (+19.1%)\nROAS: 3.41x vs 3.08x (+10.7%)\n\nDobra wiadomość — konwersje rosną szybciej niż wydatki. Warto zwiększyć budżety na kampaniach z najwyższym ROAS.`,
    };
  }

  if (lower.includes('stwórz') || lower.includes('nowa kampania') || lower.includes('utwórz')) {
    return {
      content: `Chętnie pomogę stworzyć nową kampanię Search. Potrzebuję kilku informacji:\n\n1. Nazwa produktu/usługi — co reklamujesz?\n2. Docelowy URL — strona docelowa\n3. Budżet dzienny — ile PLN/dzień?\n4. Docelowe słowa kluczowe — lub mogę zaproponować na podstawie Twojej strony\n\nPodaj te dane, a przygotuję podgląd kampanii do zatwierdzenia.`,
    };
  }

  return {
    content: `Rozumiem Twoje zapytanie dotyczące "${userMsg}". Na podstawie danych z konta:\n\nAktywne kampanie: 4\nLączne wydatki (30 dni): 28 330 PLN\nAvg. ROAS: 3.19x\n\nCzy chcesz żebym zagłębił się w konkretną kampanię lub metrykę? Mogę też przygotować rekomendacje optymalizacyjne.`,
  };
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: 'Cześć! Jestem Twoim asystentem Google Ads. Mogę analizować kampanie, zmieniać budżety, wstrzymywać reklamy i generować raporty — wszystko przez naturalny język. Co chcesz zrobić?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput('');
    setShowSuggestions(false);
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: msg, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setTimeout(() => {
      const resp = simulateResponse(msg);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: resp.content,
        timestamp: new Date(),
        changePreview: resp.changePreview,
      };
      setMessages(prev => [...prev, aiMsg]);
      setLoading(false);
    }, 900 + Math.random() * 600);
  }

  function confirmChange(id: string) {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, changePreview: m.changePreview ? { ...m.changePreview, confirmed: true } : undefined } : m));
  }
  function rejectChange(id: string) {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, changePreview: m.changePreview ? { ...m.changePreview, confirmed: false } : undefined } : m));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 58px)', maxWidth: 860, margin: '0 auto', padding: '0 16px' }}>

      {/* Chat header */}
      <div style={{ padding: '16px 0 12px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: C.c2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `1px solid ${C.border}`,
          }}>
            <Bot size={18} color={C.navy} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>AdsAI Assistant</div>
            <div style={{ fontSize: 12, color: C.accent, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent, display: 'inline-block' }} />
              Połączony z Google Ads (DEMO)
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
            <Zap size={13} color={C.accent} />
            <span style={{ fontSize: 11, color: C.accent, fontWeight: 700 }}>Claude Opus</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0', scrollbarWidth: 'thin' }}>
        {messages.map(msg => (
          <MessageBubble key={msg.id} msg={msg} onConfirm={confirmChange} onReject={rejectChange} />
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: C.c2, border: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Bot size={15} color={C.navy} />
            </div>
            <div style={{ padding: '10px 14px', borderRadius: '4px 16px 16px 16px', background: C.c1, border: `1px solid ${C.border}` }}>
              <Loader size={14} color={C.accent} style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {showSuggestions && (
        <div style={{ padding: '8px 0', flexShrink: 0 }}>
          <div style={{ fontSize: 11, color: C.text3, marginBottom: 8, fontWeight: 600, letterSpacing: 0.5 }}>SUGEROWANE PYTANIA</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {SUGGESTED.map(s => (
              <button key={s} onClick={() => send(s)} style={{
                padding: '6px 12px', borderRadius: 99,
                background: C.c1, border: `1px solid ${C.border}`,
                color: C.text2, cursor: 'pointer', fontSize: 12,
                transition: 'all .12s',
              }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{ padding: '12px 0 16px', flexShrink: 0 }}>
        <div style={{
          display: 'flex', gap: 8, alignItems: 'flex-end',
          background: C.c1, border: `1px solid ${C.border}`,
          borderRadius: 14, padding: '8px 10px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Napisz komendę... (Enter = wyślij, Shift+Enter = nowa linia)"
            rows={2}
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: C.text, fontSize: 14, resize: 'none', fontFamily: 'Inter, sans-serif',
              lineHeight: 1.5,
            }}
          />
          <button onClick={() => send()} disabled={!input.trim() || loading} style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: input.trim() ? C.accent : C.c2,
            border: 'none', cursor: input.trim() ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: input.trim() ? `0 4px 12px ${C.glow}` : 'none',
            transition: 'all .15s',
          }}>
            <Send size={15} color={input.trim() ? '#fff' : C.text3} />
          </button>
        </div>
        <div style={{ fontSize: 10, color: C.text3, textAlign: 'center', marginTop: 6 }}>
          Zmiany są pokazywane do podglądu przed zastosowaniem · Tryb DEMO
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
