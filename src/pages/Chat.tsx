import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Check, X, AlertTriangle, Loader, Zap } from 'lucide-react';
import { C, G, S, card } from '../lib/theme';
import type { ChatMessage, ChangePreview } from '../lib/types';

const SUGGESTED = [
  'Jaki jest ROAS moich kampanii w tym tygodniu?',
  'Zwieksz budzet kampanii Brand o 20%',
  'Wstrzymaj wszystkie kampanie z ROAS ponizej 2',
  'Porownaj koszty z poprzednim tygodniem',
  'Ktore slowa kluczowe generuja najwiecej konwersji?',
  'Stwórz nowa kampanie Search dla produktu X',
];

function RiskBadge({ level }: { level: ChangePreview['riskLevel'] }) {
  const cfg = {
    low:    { color: C.accent, bg: C.accentBg, bdr: C.greenBdr,  label: 'Niskie ryzyko'  },
    medium: { color: C.orange, bg: C.orangeBg, bdr: C.orangeBdr, label: 'Srednie ryzyko' },
    high:   { color: C.rose,   bg: C.roseBg,   bdr: C.roseBdr,   label: 'Wysokie ryzyko' },
  }[level];
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.bdr}`,
    }}>{cfg.label}</span>
  );
}

function ChangePreviewCard({ preview, onConfirm, onReject }: {
  preview: ChangePreview; onConfirm: () => void; onReject: () => void;
}) {
  return (
    <div style={{
      ...card, marginTop: 10, padding: '16px',
      border: `1px solid rgba(249,115,22,0.28)`,
      background: `rgba(249,115,22,0.03)`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, background: G.amber,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AlertTriangle size={14} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 13, color: C.text }}>Podglad zmiany</span>
        </div>
        <RiskBadge level={preview.riskLevel} />
      </div>
      <p style={{ fontSize: 13, color: C.text2, margin: '0 0 12px', lineHeight: 1.5 }}>{preview.description}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
        {Object.keys(preview.before).map(key => (
          <div key={key} style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, background: C.roseBg, borderRadius: 10, padding: '10px 12px', border: `1px solid ${C.roseBdr}` }}>
              <div style={{ fontSize: 9, color: C.text3, marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 }}>PRZED</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: C.rose }}>{String(preview.before[key])}</div>
            </div>
            <div style={{ flex: 1, background: C.accentBg, borderRadius: 10, padding: '10px 12px', border: `1px solid ${C.greenBdr}` }}>
              <div style={{ fontSize: 9, color: C.text3, marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 }}>PO</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: C.accent }}>{String(preview.after[key])}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onConfirm} className="btn-cta" style={{
          flex: 1, padding: '10px', borderRadius: 9, background: G.orange,
          border: 'none', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          boxShadow: S.orange,
        }}>
          <Check size={14} /> Zatwierdz zmiane
        </button>
        <button onClick={onReject} style={{
          padding: '10px 16px', borderRadius: 9, background: C.roseBg,
          border: `1px solid ${C.roseBdr}`, color: C.rose, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700,
        }}>
          <X size={14} /> Anuluj
        </button>
      </div>
    </div>
  );
}

function MessageBubble({ msg, onConfirm, onReject }: {
  msg: ChatMessage; onConfirm: (id: string) => void; onReject: (id: string) => void;
}) {
  const isUser = msg.role === 'user';
  return (
    <div style={{
      display: 'flex', gap: 10, alignItems: 'flex-start',
      flexDirection: isUser ? 'row-reverse' : 'row', marginBottom: 18,
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
        background: isUser ? G.orange : C.c2,
        border: isUser ? 'none' : `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: isUser ? `0 3px 10px ${C.glow}` : undefined,
      }}>
        {isUser ? <User size={15} color="#fff" /> : <Bot size={15} color={C.navy} />}
      </div>
      <div style={{ maxWidth: '80%', minWidth: 60 }}>
        <div style={{
          padding: '12px 16px', lineHeight: 1.6, fontSize: 14, whiteSpace: 'pre-line',
          borderRadius: isUser ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
          background: isUser ? G.orange : '#fff',
          color: isUser ? '#fff' : C.text,
          border: isUser ? 'none' : `1px solid ${C.border}`,
          boxShadow: isUser ? `0 4px 16px ${C.glow}` : S.card,
        }}>
          {msg.content}
        </div>
        {msg.changePreview && !msg.changePreview.confirmed && (
          <ChangePreviewCard preview={msg.changePreview} onConfirm={() => onConfirm(msg.id)} onReject={() => onReject(msg.id)} />
        )}
        {msg.changePreview?.confirmed === true && (
          <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: C.accent, fontWeight: 600 }}>
            <Check size={12} /> Zmiana zastosowana
          </div>
        )}
        {msg.changePreview?.confirmed === false && (
          <div style={{ marginTop: 6, fontSize: 12, color: C.text3 }}>Zmiana anulowana.</div>
        )}
        <div style={{ fontSize: 10, color: C.text3, marginTop: 4, textAlign: isUser ? 'right' : 'left' }}>
          {msg.timestamp.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}

function simulateResponse(userMsg: string): { content: string; changePreview?: ChangePreview } {
  const lower = userMsg.toLowerCase();

  if (lower.includes('roas')) {
    return { content: `ROAS Twoich kampanii (ostatnie 7 dni):\n\nBrand – Kadromierz [Search]: 5.81x\nRetargeting – Display: 12.14x\nCompetitor – PMAX: 2.64x\nHR Software – Generic: 1.93x\n\nSredni ROAS: 3.19x. Polecam skupic sie na kampanii HR Software – Generic — jest ponizej progu rentownosci 2.5x.` };
  }
  if (lower.includes('budz') || lower.includes('budget') || lower.includes('zwieksz')) {
    return {
      content: `Rozumiem — chcesz zmienic budzet kampanii Brand – Kadromierz. Oto podglad zmiany przed zastosowaniem:`,
      changePreview: {
        type: 'budget_change', description: 'Zwiekszenie dziennego budzetu kampanii "Brand – Kadromierz [Search]" o 20%.',
        before: { 'Budzet dzienny': '150 PLN' }, after: { 'Budzet dzienny': '180 PLN' }, riskLevel: 'low',
      },
    };
  }
  if (lower.includes('wstrzymaj') || lower.includes('pause') || lower.includes('pauza')) {
    return {
      content: `Znalazlem kampanie z ROAS ponizej 2.0:\n\nHR Software – Generic [Search] — ROAS: 1.93x, koszt: 8 996 PLN\n\nCzy chcesz wstrzymac te kampanie?`,
      changePreview: {
        type: 'status_change', description: 'Wstrzymanie kampanii "HR Software – Generic" z powodu niskiego ROAS.',
        before: { Status: 'AKTYWNA', ROAS: '1.93x' }, after: { Status: 'WSTRZYMANA', 'Szac. oszczednosci': '300 PLN/d' }, riskLevel: 'medium',
      },
    };
  }
  if (lower.includes('porown') || lower.includes('poprzedni')) {
    return { content: `Porownanie tygodniowe:\n\nWydatki: 6 620 PLN vs 6 142 PLN (+7.8%)\nKlikniecia: 3 218 vs 2 994 (+7.5%)\nKonwersje: 156 vs 131 (+19.1%)\nROAS: 3.41x vs 3.08x (+10.7%)\n\nDobra wiadomosc — konwersje rosna szybciej niz wydatki!` };
  }
  if (lower.includes('stworz') || lower.includes('nowa kampania') || lower.includes('utworz')) {
    return { content: `Chetnie pomoge stworzyc nowa kampanie Search. Potrzebuje kilku informacji:\n\n1. Nazwa produktu/uslugi — co reklamujesz?\n2. Docelowy URL — strona docelowa\n3. Budzet dzienny — ile PLN/dzien?\n4. Docelowe slowa kluczowe — lub moge zaproponowac\n\nPodaj te dane, a przygotujem podglad kampanii do zatwierdzenia.` };
  }
  return { content: `Rozumiem Twoje zapytanie dotyczace "${userMsg}". Na podstawie danych z konta:\n\nAktywne kampanie: 4\nLaczne wydatki (30 dni): 28 330 PLN\nAvg. ROAS: 3.19x\n\nCzy chcesz zebym zaglebil sie w konkretna kampanie lub metryke?` };
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: '0', role: 'assistant',
    content: 'Czesc! Jestem Twoim asystentem Google Ads. Moge analizowac kampanie, zmieniac budzety, wstrzymywac reklamy i generowac raporty — wszystko przez naturalny jezyk. Co chcesz zrobic?',
    timestamp: new Date(),
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput(''); setShowSuggestions(false);
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: msg, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setTimeout(() => {
      const resp = simulateResponse(msg);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: resp.content, timestamp: new Date(), changePreview: resp.changePreview }]);
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: 820, margin: '0 auto', padding: '0 24px' }}>

      {/* Header */}
      <div style={{ padding: '16px 0 12px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, background: C.c2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `1px solid ${C.border}`,
          }}>
            <Bot size={20} color={C.navy} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: C.text }}>AdsAI Assistant</div>
            <div style={{ fontSize: 12, color: C.accent, display: 'flex', alignItems: 'center', gap: 5, fontWeight: 600 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent, display: 'inline-block' }} className="pulse-dot" />
              Polaczony z Google Ads (DEMO)
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: G.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 2px 8px ${C.glow}` }}>
              <Zap size={13} color="#fff" />
            </div>
            <span style={{ fontSize: 12, color: C.accent, fontWeight: 700 }}>Claude Opus</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 0', scrollbarWidth: 'thin' }}>
        {messages.map(msg => (
          <MessageBubble key={msg.id} msg={msg} onConfirm={confirmChange} onReject={rejectChange} />
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: C.c2, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={15} color={C.navy} />
            </div>
            <div style={{ padding: '12px 16px', borderRadius: '4px 18px 18px 18px', background: '#fff', border: `1px solid ${C.border}`, boxShadow: S.card }}>
              <Loader size={14} color={C.accent} className="spin" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {showSuggestions && (
        <div style={{ padding: '6px 0', flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: C.text3, marginBottom: 8, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>Sugerowane pytania</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {SUGGESTED.map(s => (
              <button key={s} onClick={() => send(s)} className="btn-secondary" style={{
                padding: '6px 12px', borderRadius: 99, background: '#fff',
                border: `1px solid ${C.border}`, color: C.text2, cursor: 'pointer', fontSize: 12,
              }}>{s}</button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{ padding: '12px 0 18px', flexShrink: 0 }}>
        <div style={{
          display: 'flex', gap: 8, alignItems: 'flex-end',
          background: '#fff', border: `1px solid ${C.border}`,
          borderRadius: 16, padding: '10px 12px',
          boxShadow: S.card,
        }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Napisz komende... (Enter = wyslij, Shift+Enter = nowa linia)"
            rows={2}
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: C.text, fontSize: 14, resize: 'none', fontFamily: 'Inter, sans-serif', lineHeight: 1.5,
            }}
          />
          <button onClick={() => send()} disabled={!input.trim() || loading} className="btn-cta" style={{
            width: 40, height: 40, borderRadius: 11, flexShrink: 0,
            background: input.trim() ? G.orange : C.c2,
            border: 'none', cursor: input.trim() ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: input.trim() ? S.orange : 'none',
          }}>
            <Send size={16} color={input.trim() ? '#fff' : C.text3} />
          </button>
        </div>
        <div style={{ fontSize: 10, color: C.text3, textAlign: 'center', marginTop: 6 }}>
          Zmiany pokazywane do podgladu przed zastosowaniem · Tryb DEMO
        </div>
      </div>
    </div>
  );
}
