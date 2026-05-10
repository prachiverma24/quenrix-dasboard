import React from 'react';

const courses = [
  { name: 'React Fundamentals', progress: 78, color: '#7C5CFF', lessons: '14/18 lessons' },
  { name: 'Data Structures', progress: 45, color: '#FF6B6B', lessons: '9/20 lessons' },
  { name: 'UI/UX Design', progress: 92, color: '#38ef7d', lessons: '11/12 lessons' },
  { name: 'Node.js Backend', progress: 30, color: '#F59E0B', lessons: '6/20 lessons' },
];

const announcements = [
  { id: 1, title: 'New Assignment Posted', desc: 'React Final Project uploaded to portal.', time: '2h ago', dot: '#7C5CFF', unread: true },
  { id: 2, title: 'Exam Rescheduled', desc: 'Mid-term moved to next Friday, 10 AM.', time: '5h ago', dot: '#FF6B6B', unread: true },
  { id: 3, title: 'New Resource Added', desc: 'Chapter 7 notes uploaded to LMS.', time: '1d ago', dot: '#38ef7d', unread: false },
];

const gradeData = [
  { subject: 'React', grade: 92, color: '#7C5CFF' },
  { subject: 'DSA', grade: 75, color: '#FF6B6B' },
  { subject: 'Design', grade: 88, color: '#38ef7d' },
  { subject: 'Node', grade: 70, color: '#F59E0B' },
  { subject: 'SQL', grade: 82, color: '#A78BFA' },
];

function LMSProgress() {
  return (
    <div id="lms-progress-card" className="glass-card p-6 flex flex-col gap-5" >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[#120C24] font-semibold text-base">LMS Learning Progress</h3>
          <p className="text-[#5C5970] text-xs mt-0.5">Your active courses overview</p>
        </div>
        <button id="lms-view-all" className="text-[#6344d4] text-xs font-semibold hover:text-[#5238b1] flex items-center gap-1">
          View All
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {courses.map((c, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: c.color, boxShadow: `0 0 6px ${c.color}` }} />
                <span className="text-[#120C24] text-sm font-medium">{c.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#5C5970] text-xs">{c.lessons}</span>
                <span className="text-[#120C24] font-bold text-sm">{c.progress}%</span>
              </div>
            </div>
            <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.05)' }}>
              <div className="h-2 rounded-full" style={{ width: `${c.progress}%`, background: `linear-gradient(90deg, ${c.color}99, ${c.color})` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(99, 68, 212, 0.05)', border: '1px solid rgba(99, 68, 212, 0.1)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(124,92,255,0.2)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#6344d4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <p className="text-[#5C5970] text-xs font-medium">Overall Completion</p>
          <p className="text-[#6344d4] text-sm font-bold">61.25% across 4 courses</p>
        </div>
      </div>
    </div>
  );
}

function UnreadAnnouncements() {
  return (
    <div id="announcements-card" className="glass-card p-6 flex flex-col gap-5" >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[#120C24] font-semibold text-base">Unread Announcements</h3>
          <p className="text-[#5C5970] text-xs mt-0.5">Stay up to date</p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white bg-[#120C24] leading-none">2</span>
      </div>
      <div className="flex flex-col gap-3 flex-1">
        {/* We just show a blank space or simplified list based on reference if needed. Wait, in reference it just has '2' and an 'Open' button at bottom. */}
      </div>
      <button id="view-all-announcements" className="w-full py-1.5 rounded-xl text-sm font-semibold text-white hover:scale-[1.01] transition-all shadow-lg" style={{ background: 'linear-gradient(135deg, #6344d4, #8b6ff5)' }}>
        Open
      </button>
    </div>
  );
}

function AverageGrade() {
  const avg = 84;
  return (
    <div id="avg-grade-card" className="glass-card p-6 flex flex-col gap-5" >
      <div>
        <h3 className="text-[#120C24] font-semibold text-base">Average Grade</h3>
        <p className="text-[#5C5970] text-xs mt-0.5">Across all subjects</p>
      </div>
      <div className="flex flex-col flex-1 justify-center">
        <span className="text-[#120C24] font-bold text-4xl">{avg}%</span>
      </div>
      <button id="avg-grade-report" className="w-full py-1.5 rounded-xl text-sm font-semibold text-white hover:scale-[1.02] transition-all shadow-lg" style={{ background: 'linear-gradient(135deg, #6344d4, #8b6ff5)' }}>
        View Gradebook
      </button>
    </div>
  );
}

export default function LowerSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <LMSProgress />
      <UnreadAnnouncements />
      <AverageGrade />
    </div>
  );
}
