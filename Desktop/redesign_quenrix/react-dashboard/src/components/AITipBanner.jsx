import React from 'react';

export default function AITipBanner() {
  return (
    <div
      id="ai-tip-banner"
      className="relative overflow-hidden rounded-xl p-5 flex items-center gap-5 cursor-pointer group shadow-sm"
      style={{
        background: '#120C24',
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #A78BFA, transparent)' }}
      />
      <div
        className="absolute right-24 -bottom-6 w-24 h-24 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7C5CFF, transparent)' }}
      />

      {/* AI Icon */}
      <div
        className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #7C5CFF, #A78BFA)',
          boxShadow: '0 4px 16px rgba(124,92,255,0.5)',
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0v-8m0 0l-3 3m3-3l3 3" />
        </svg>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(99, 68, 212, 0.3)', color: '#A088FF' }}
          >
            AI Study Tip
          </span>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full animate-pulse"
            style={{ background: 'rgba(56,239,125,0.15)', color: '#38ef7d' }}
          >
            ● Live
          </span>
        </div>
        <p className="text-white font-medium text-sm leading-relaxed">
          Focus on Frontend. Review the Flexbox Mini Test topics to improve your score.
        </p>
        <p className="text-white/45 text-xs mt-0.5">Personalized tip based on your recent activity</p>
      </div>

      {/* CTA */}
      <button
        id="ai-tip-cta"
        className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 group-hover:scale-105"
        style={{
          background: '#6344d4',
        }}
      >
        <span>Try Now</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
    </div>
  );
}
