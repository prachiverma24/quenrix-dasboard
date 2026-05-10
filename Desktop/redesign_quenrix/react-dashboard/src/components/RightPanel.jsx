import React, { useState } from 'react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function buildCalendar(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const rows = [];
  let week = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) {
      rows.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    rows.push(week);
  }
  return rows;
}

export default function RightPanel({ isMobile }) {
  const now = new Date();
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(3); // April
  const [selectedDay, setSelectedDay] = useState(10);

  const rows = buildCalendar(year, month);

  const goMonth = (dir) => {
    let m = month + dir;
    let y = year;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setMonth(m);
    setYear(y);
    setSelectedDay(null);
  };

  const monthLabel = new Date(year, month).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <aside
      id="right-panel"
      className={isMobile ? "w-full overflow-y-visible" : "fixed top-0 right-0 h-screen overflow-y-auto"}
      style={isMobile ? {
        paddingTop: '24px',
        paddingBottom: '24px',
        paddingLeft: '16px',
        paddingRight: '16px',
        background: 'transparent',
      } : {
        width: '300px',
        paddingTop: '80px',
        paddingBottom: '24px',
        paddingLeft: '8px',
        paddingRight: '24px',
        background: 'transparent',
      }}
    >
      <div className="flex flex-col gap-6 animate-fade-in">

        {/* ── Calendar Section ─────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold text-lg mb-2">My Schedule</h3>
          
          {/* Month nav */}
          <div className="flex items-center justify-between px-2">
            <button onClick={() => goMonth(-1)} className="text-white font-bold">&lt;</button>
            <span className="text-white font-bold text-sm">{monthLabel}</span>
            <button onClick={() => goMonth(1)} className="text-white font-bold">&gt;</button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 text-center mt-2">
            {DAYS.map((d) => (
              <span key={d} className="text-purple-300 text-[10px] font-bold uppercase tracking-wider py-1">
                {d}
              </span>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 text-center gap-y-2 mt-1">
            {rows.flat().map((d, i) => {
              if (d === null) return <span key={`e${i}`} />;

              const sel = d === selectedDay;

              return (
                <button
                  key={`d${i}`}
                  onClick={() => setSelectedDay(d)}
                  className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full text-xs transition-all duration-200 ${
                    sel
                      ? 'text-white font-bold'
                      : 'text-purple-200 hover:text-white font-medium hover:bg-purple-800/50'
                  }`}
                  style={
                    sel
                      ? { background: 'linear-gradient(135deg, #7C5CFF, #A78BFA)' } // vibrant active state
                      : {}
                  }
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Schedule Sub-section ──────────────────────────── */}
        <div className="flex flex-col gap-3 mt-2">
          <h4 className="text-purple-300 text-[10px] font-bold uppercase tracking-wider">
            Schedule for 29 Apr
          </h4>
          
          <div className="p-4 rounded-xl border border-white/10" style={{ background: '#2A1E5C' }}>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <span className="text-purple-300 text-[10px] uppercase">Today</span>
                <span className="text-white font-bold text-lg leading-none">29</span>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <span className="text-white text-sm font-medium">Regular Batch Session</span>
            </div>
          </div>
        </div>

        {/* ── Upcoming Deadlines ────────────────────────── */}
        <div className="flex flex-col gap-3 mt-4">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-white font-bold text-sm">Upcoming Deadlines</h4>
            <button className="text-xs font-semibold px-3 py-1 rounded-full border border-purple-500/30 text-purple-200 bg-purple-900/40 shadow-sm">
              Open
            </button>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <span className="text-purple-200 text-xs">Build REST API Integration</span>
            <span className="text-white font-bold text-xs">29 Apr</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <span className="text-purple-200 text-xs">Binary Tree Practice Set</span>
            <span className="text-white font-bold text-xs">01 May</span>
          </div>
        </div>

      </div>
    </aside>
  );
}
