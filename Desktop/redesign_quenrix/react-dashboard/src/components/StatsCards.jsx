import React from 'react';

const stats = [
  {
    id: 'study-streak',
    label: 'Study Streak',
    value: '6',
    unit: 'Days',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
      </svg>
    ),
    iconBg: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
    iconShadow: 'rgba(255,107,107,0.4)',
    trend: '+2 from last week',
    trendUp: true,
    barColor: 'linear-gradient(90deg, #FF6B6B, #FF8E53)',
    barPercent: 85,
  },
  {
    id: 'avg-grade',
    label: 'Avg Grade',
    value: '84',
    unit: '%',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    iconBg: 'linear-gradient(135deg, #7C5CFF, #A78BFA)',
    iconShadow: 'rgba(124,92,255,0.4)',
    trend: '+5% improvement',
    trendUp: true,
    barColor: 'linear-gradient(90deg, #7C5CFF, #A78BFA)',
    barPercent: 84,
  },
  {
    id: 'study-week',
    label: 'Study This Week',
    value: '195',
    unit: 'min',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    iconBg: 'linear-gradient(135deg, #11998e, #38ef7d)',
    iconShadow: 'rgba(17,153,142,0.4)',
    trend: '3h 15min today',
    trendUp: true,
    barColor: 'linear-gradient(90deg, #11998e, #38ef7d)',
    barPercent: 65,
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.id}
          id={`stat-card-${stat.id}`}
          className="glass-card p-5 cursor-pointer flex flex-col justify-center"
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'rgba(99, 68, 212, 0.1)',
                color: '#6344d4',
              }}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-[#5C5970] text-[10px] font-bold uppercase tracking-widest mb-0.5">{stat.label}</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[#120C24] font-bold text-3xl leading-none">{stat.value}</span>
                <span className="text-[#5C5970] text-sm font-bold mb-0.5">{stat.unit}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
