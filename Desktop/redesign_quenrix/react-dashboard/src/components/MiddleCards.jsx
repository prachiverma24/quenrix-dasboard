import React from 'react';

const cards = [
  {
    id: 'profile-status',
    title: 'Profile Status',
    value: 'Incomplete',
    sub: '60% complete',
    progress: 60,
    statusColor: '#FF6B6B',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    iconBg: 'linear-gradient(135deg, #FF6B6B55, #FF8E5322)',
    iconColor: '#FF8E53',
    action: 'Complete Now',
    actionColor: 'rgba(255,107,107,0.15)',
    actionBorder: 'rgba(255,107,107,0.3)',
    actionText: '#FF8E53',
  },
  {
    id: 'active-batch',
    title: 'Active Batch',
    value: 'Not Assigned',
    sub: 'No batch yet',
    progress: 0,
    statusColor: '#A78BFA',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    iconBg: 'linear-gradient(135deg, #7C5CFF33, #A78BFA22)',
    iconColor: '#A78BFA',
    action: 'Request Batch',
    actionColor: 'rgba(124,92,255,0.15)',
    actionBorder: 'rgba(124,92,255,0.35)',
    actionText: '#A78BFA',
  },
  {
    id: 'upcoming-exams',
    title: 'Upcoming Exams',
    value: '0 Upcoming',
    sub: 'No exams scheduled',
    progress: 0,
    statusColor: '#38ef7d',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    iconBg: 'linear-gradient(135deg, #11998e33, #38ef7d22)',
    iconColor: '#38ef7d',
    action: 'View Schedule',
    actionColor: 'rgba(56,239,125,0.12)',
    actionBorder: 'rgba(56,239,125,0.3)',
    actionText: '#38ef7d',
  },
  {
    id: 'readiness',
    title: 'Readiness',
    value: '50% Ready',
    sub: 'Keep improving!',
    progress: 50,
    statusColor: '#F59E0B',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    iconBg: 'linear-gradient(135deg, #F59E0B33, #FBBF2422)',
    iconColor: '#FBBF24',
    action: 'Boost Now',
    actionColor: 'rgba(245,158,11,0.15)',
    actionBorder: 'rgba(245,158,11,0.3)',
    actionText: '#FBBF24',
  },
];

export default function MiddleCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.id}
          id={`middle-card-${card.id}`}
          className="glass-card p-5 flex flex-col justify-center"
        >
          <p className="text-[#5C5970] text-[10px] font-bold uppercase tracking-wider mb-1">
            {card.title}
          </p>
          <p className="text-[#120C24] font-bold text-2xl leading-tight">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
