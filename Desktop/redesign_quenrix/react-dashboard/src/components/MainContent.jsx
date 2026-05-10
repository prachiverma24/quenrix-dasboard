import React from 'react';
import StatsCards from './StatsCards';
import AITipBanner from './AITipBanner';
import MiddleCards from './MiddleCards';
import LowerSection from './LowerSection';

export default function MainContent() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      {/* ── Page Header ───────────────────────────────────── */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="text-white font-bold text-3xl tracking-tight leading-tight">
            Trainer Dashboard
          </h1>
          <p className="text-purple-300 text-sm mt-1.5 leading-relaxed">
            Your daily classes, progress, and learning tools in one place.
          </p>
        </div>


      </div>

      {/* ── Stats Cards ───────────────────────────────────── */}
      <StatsCards />

      {/* ── AI Tip Banner ─────────────────────────────────── */}
      <AITipBanner />

      {/* ── Middle Status Cards ───────────────────────────── */}
      <MiddleCards />

      {/* ── Lower Section ─────────────────────────────────── */}
      <LowerSection />
    </div>
  );
}
