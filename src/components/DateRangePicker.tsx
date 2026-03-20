import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Check, Calendar } from 'lucide-react';
import { C } from '../lib/theme';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface DateRange {
  from: Date;
  to: Date;
  label: string;
}

interface Props {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function today() { const d = new Date(); d.setHours(0,0,0,0); return d; }
function addDays(d: Date, n: number) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth() + 1, 0); }
function sameDay(a: Date, b: Date) { return a.toDateString() === b.toDateString(); }
function isBefore(a: Date, b: Date) { return a < b; }
function isBetween(d: Date, from: Date, to: Date) { return d >= from && d <= to; }

const MONTH_NAMES_PL = ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'];
const MONTH_FULL_PL  = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
const WEEKDAYS_PL    = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd'];

// ─── Preset definitions ───────────────────────────────────────────────────────
function buildPresets() {
  const t = today();
  return [
    { id: 'today',     label: 'Dziś',                from: t,                             to: t },
    { id: 'yesterday', label: 'Wczoraj',              from: addDays(t, -1),                to: addDays(t, -1) },
    { id: 'last7',     label: 'Ostatnie 7 dni',       from: addDays(t, -6),                to: t },
    { id: 'last14',    label: 'Ostatnie 14 dni',      from: addDays(t, -13),               to: t },
    { id: 'last30',    label: 'Ostatnie 30 dni',      from: addDays(t, -29),               to: t },
    { id: 'last90',    label: 'Ostatnie 90 dni',      from: addDays(t, -89),               to: t },
    { id: 'thisMonth', label: 'Bieżący miesiąc',      from: startOfMonth(t),               to: t },
    { id: 'lastMonth', label: 'Poprzedni miesiąc',    from: startOfMonth(addDays(startOfMonth(t), -1)), to: endOfMonth(addDays(startOfMonth(t), -1)) },
    { id: 'last12m',   label: 'Ostatnie 12 miesięcy', from: addDays(t, -364),              to: t },
    { id: 'custom',    label: 'Niestandardowy…',      from: t,                             to: t },
  ];
}

function formatDate(d: Date) {
  return d.toLocaleDateString('pl-PL', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─── Single month calendar ─────────────────────────────────────────────────
function MonthCalendar({
  year, month, selStart, selEnd, hovered, onDayClick, onDayHover, isSelecting,
}: {
  year: number; month: number;
  selStart: Date | null; selEnd: Date | null; hovered: Date | null;
  onDayClick: (d: Date) => void;
  onDayHover: (d: Date | null) => void;
  isSelecting: boolean;
}) {
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
  // Convert to Mon-start: Mon=0, Tue=1... Sun=6
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Compute effective range for highlighting
  const rangeEnd = isSelecting && hovered && selStart
    ? (isBefore(hovered, selStart) ? selStart : hovered)
    : selEnd;
  const rangeStart = isSelecting && hovered && selStart
    ? (isBefore(hovered, selStart) ? hovered : selStart)
    : selStart;

  const t = today();

  return (
    <div style={{ width: 240 }}>
      {/* Weekday headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0, marginBottom: 6 }}>
        {WEEKDAYS_PL.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: C.text3, padding: '4px 0' }}>{d}</div>
        ))}
      </div>
      {/* Day cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0 }}>
        {/* Empty offset cells */}
        {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum  = i + 1;
          const date    = new Date(year, month, dayNum);
          const isStart = selStart ? sameDay(date, selStart) : false;
          const isEnd   = rangeEnd ? sameDay(date, rangeEnd) : false;
          const inRange = rangeStart && rangeEnd ? isBetween(date, rangeStart, rangeEnd) : false;
          const isToday = sameDay(date, t);
          const isFuture = date > t;

          let bg = 'transparent', color = isFuture ? C.text3 : C.text;
          if (isStart || isEnd) { bg = C.accent; color = '#fff'; }
          else if (inRange) { bg = 'rgba(249,115,22,0.10)'; color = C.text; }

          return (
            <div
              key={dayNum}
              onClick={() => !isFuture && onDayClick(date)}
              onMouseEnter={() => onDayHover(date)}
              onMouseLeave={() => onDayHover(null)}
              style={{
                height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: isStart || isEnd ? 7 : inRange ? 0 : 7,
                background: bg, color,
                fontSize: 12.5, fontWeight: (isStart || isEnd || isToday) ? 700 : 400,
                cursor: isFuture ? 'default' : 'pointer',
                position: 'relative',
                outline: isToday && !isStart && !isEnd ? `1.5px solid ${C.accent}` : 'none',
                outlineOffset: -1,
                transition: 'background .1s',
                opacity: isFuture ? 0.35 : 1,
              }}
            >
              {dayNum}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main DateRangePicker ─────────────────────────────────────────────────────
export default function DateRangePicker({ value, onChange }: Props) {
  const [open, setOpen]                 = useState(false);
  const [activePreset, setActivePreset] = useState('last30');
  const [customStart, setCustomStart]   = useState<Date | null>(null);
  const [customEnd, setCustomEnd]       = useState<Date | null>(null);
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);
  const [hovered, setHovered]           = useState<Date | null>(null);
  const [includeToday, setIncludeToday] = useState(true);
  const [showCustom, setShowCustom]     = useState(false);
  const [pendingFrom, setPendingFrom]   = useState<Date>(value.from);
  const [pendingTo, setPendingTo]       = useState<Date>(value.to);

  const t = today();
  const [leftMonth, setLeftMonth]   = useState({ y: t.getFullYear(), m: t.getMonth() });
  const [rightMonth, setRightMonth] = useState({
    y: t.getMonth() === 11 ? t.getFullYear() + 1 : t.getFullYear(),
    m: t.getMonth() === 11 ? 0 : t.getMonth() + 1,
  });

  const ref = useRef<HTMLDivElement>(null);
  const presets = buildPresets();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handlePresetClick(preset: typeof presets[0]) {
    if (preset.id === 'custom') {
      setShowCustom(true);
      setCustomStart(null);
      setCustomEnd(null);
      setIsSelectingEnd(false);
      setActivePreset('custom');
      return;
    }
    setShowCustom(false);
    setActivePreset(preset.id);
    setPendingFrom(preset.from);
    setPendingTo(preset.to);
    setCustomStart(null);
    setCustomEnd(null);
  }

  function handleDayClick(date: Date) {
    if (!isSelectingEnd) {
      setCustomStart(date);
      setCustomEnd(null);
      setIsSelectingEnd(true);
    } else {
      const start = customStart!;
      const from = isBefore(date, start) ? date : start;
      const to   = isBefore(date, start) ? start : date;
      setCustomStart(from);
      setCustomEnd(to);
      setPendingFrom(from);
      setPendingTo(to);
      setIsSelectingEnd(false);
    }
  }

  function handleApply() {
    const label = showCustom
      ? `${formatDate(pendingFrom)} – ${formatDate(pendingTo)}`
      : presets.find(p => p.id === activePreset)?.label ?? value.label;
    onChange({ from: pendingFrom, to: pendingTo, label });
    setOpen(false);
  }

  function navLeft() {
    setLeftMonth(prev => {
      const m = prev.m === 0 ? 11 : prev.m - 1;
      const y = prev.m === 0 ? prev.y - 1 : prev.y;
      return { y, m };
    });
    setRightMonth(prev => {
      const m = prev.m === 0 ? 11 : prev.m - 1;
      const y = prev.m === 0 ? prev.y - 1 : prev.y;
      return { y, m };
    });
  }
  function navRight() {
    setLeftMonth(prev => {
      const m = prev.m === 11 ? 0 : prev.m + 1;
      const y = prev.m === 11 ? prev.y + 1 : prev.y;
      return { y, m };
    });
    setRightMonth(prev => {
      const m = prev.m === 11 ? 0 : prev.m + 1;
      const y = prev.m === 11 ? prev.y + 1 : prev.y;
      return { y, m };
    });
  }

  const displaySelStart = showCustom ? customStart : pendingFrom;
  const displaySelEnd   = showCustom ? (customEnd ?? null) : pendingTo;

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      {/* ── Trigger button ── */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '8px 14px', borderRadius: 8,
          background: open ? C.accent : '#fff',
          border: `1.5px solid ${open ? C.accent : C.borderMd}`,
          color: open ? '#fff' : C.text,
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
          boxShadow: open ? `0 4px 16px rgba(249,115,22,0.25)` : '0 1px 3px rgba(0,0,0,0.06)',
          transition: 'all .15s',
          whiteSpace: 'nowrap',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <Calendar size={14} />
        {value.label}
        <ChevronDown size={13} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
      </button>

      {/* ── Dropdown panel ── */}
      {open && (
        <div className="slide-down" style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 500,
          background: '#fff',
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          boxShadow: '0 8px 40px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.07)',
          display: 'flex', overflow: 'hidden',
          fontFamily: 'Inter, sans-serif',
        }}>
          {/* ── Preset list ── */}
          <div style={{
            width: 210, borderRight: `1px solid ${C.border}`,
            padding: '8px 0',
          }}>
            {/* Include today toggle */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 16px 10px',
              borderBottom: `1px solid ${C.border}`,
              marginBottom: 4,
            }}>
              <button
                onClick={() => setIncludeToday(v => !v)}
                style={{
                  width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                  border: `2px solid ${includeToday ? C.accent : C.borderMd}`,
                  background: includeToday ? C.accent : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                {includeToday && <Check size={10} color="#fff" strokeWidth={3} />}
              </button>
              <span style={{ fontSize: 12, color: C.text2, fontWeight: 500 }}>Uwzględnij bieżący dzień</span>
            </div>

            {presets.map(p => (
              <button
                key={p.id}
                onClick={() => handlePresetClick(p)}
                style={{
                  width: '100%', textAlign: 'left',
                  padding: '8px 16px',
                  background: activePreset === p.id ? 'rgba(249,115,22,0.07)' : 'transparent',
                  border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: activePreset === p.id ? 600 : 400,
                  color: activePreset === p.id ? C.accent : C.text2,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  transition: 'background .1s',
                }}
                onMouseEnter={e => { if (activePreset !== p.id) (e.currentTarget as HTMLButtonElement).style.background = C.c2; }}
                onMouseLeave={e => { if (activePreset !== p.id) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
              >
                {p.label}
                {activePreset === p.id && <Check size={13} color={C.accent} />}
              </button>
            ))}
          </div>

          {/* ── Right panel ── */}
          <div style={{ padding: '16px 20px', minWidth: showCustom ? 540 : 340 }}>
            {/* Selected range display */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              marginBottom: 16, padding: '10px 14px',
              background: C.c2, borderRadius: 8, border: `1px solid ${C.border}`,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.text3, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 }}>Data rozpoczęcia</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                  {displaySelStart ? formatDate(displaySelStart) : '—'}
                </div>
              </div>
              <div style={{ width: 1, height: 32, background: C.border }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.text3, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 }}>Data zakończenia</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                  {displaySelEnd ? formatDate(displaySelEnd) : isSelectingEnd ? 'Wybierz…' : '—'}
                </div>
              </div>
            </div>

            {showCustom ? (
              <>
                {/* Dual calendar */}
                {isSelectingEnd && (
                  <div style={{ fontSize: 11, color: C.accent, fontWeight: 600, marginBottom: 10, textAlign: 'center' }}>
                    Kliknij datę zakończenia zakresu
                  </div>
                )}
                <div style={{ display: 'flex', gap: 28 }}>
                  {/* Left calendar */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <button onClick={navLeft} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: C.text2, borderRadius: 5, display: 'flex' }}>
                        <ChevronLeft size={16} />
                      </button>
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
                        {MONTH_FULL_PL[leftMonth.m]} {leftMonth.y}
                      </span>
                      <div style={{ width: 24 }} />
                    </div>
                    <MonthCalendar
                      year={leftMonth.y} month={leftMonth.m}
                      selStart={displaySelStart} selEnd={displaySelEnd}
                      hovered={hovered} onDayClick={handleDayClick}
                      onDayHover={setHovered} isSelecting={isSelectingEnd}
                    />
                  </div>

                  {/* Right calendar */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ width: 24 }} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
                        {MONTH_FULL_PL[rightMonth.m]} {rightMonth.y}
                      </span>
                      <button onClick={navRight} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: C.text2, borderRadius: 5, display: 'flex' }}>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                    <MonthCalendar
                      year={rightMonth.y} month={rightMonth.m}
                      selStart={displaySelStart} selEnd={displaySelEnd}
                      hovered={hovered} onDayClick={handleDayClick}
                      onDayHover={setHovered} isSelecting={isSelectingEnd}
                    />
                  </div>
                </div>
              </>
            ) : (
              /* Preset summary */
              <div style={{ padding: '8px 0' }}>
                {activePreset !== 'custom' && (() => {
                  const p = presets.find(x => x.id === activePreset);
                  if (!p) return null;
                  const days = Math.round((p.to.getTime() - p.from.getTime()) / 86400000) + 1;
                  return (
                    <div>
                      <div style={{ fontSize: 13, color: C.text2, marginBottom: 8 }}>
                        <span style={{ fontWeight: 600, color: C.text }}>
                          {formatDate(p.from)}
                        </span>
                        {' → '}
                        <span style={{ fontWeight: 600, color: C.text }}>
                          {formatDate(p.to)}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: C.text3 }}>
                        {days} {days === 1 ? 'dzień' : 'dni'} · dane demo (Kadromierz, marzec 2026)
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Apply button */}
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleApply}
                disabled={showCustom && (!customStart || !customEnd)}
                style={{
                  padding: '9px 22px', borderRadius: 8,
                  background: (showCustom && (!customStart || !customEnd)) ? C.c3 : C.accent,
                  border: 'none', color: '#fff',
                  fontSize: 13.5, fontWeight: 700, cursor: 'pointer',
                  boxShadow: (showCustom && (!customStart || !customEnd)) ? 'none' : '0 4px 14px rgba(249,115,22,0.30)',
                  transition: 'all .15s',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Zastosuj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
