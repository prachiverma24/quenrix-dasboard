import React, { useState } from 'react';

export default function Navbar() {
  const [notifications] = useState(3);

  return (
    <header
      className="sticky top-0 z-20 flex items-center gap-4 px-4 lg:px-6 py-3 w-full"
      style={{
        height: '64px',
        background: '#120C24',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      {/* Search bar */}
      <div className="flex-1 max-w-md">
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-full"
          style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            id="navbar-search"
            type="text"
            placeholder="Search courses, students, resources..."
            className="bg-transparent text-white/50 text-sm flex-1 outline-none placeholder-white/20"
          />
          <kbd
            className="text-white/25 text-xs px-2 py-0.5 rounded-md"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {/* Notification */}
        <button
          id="navbar-notifications"
          className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 hover:scale-105"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {notifications > 0 && (
            <span
              className="notif-badge absolute -top-1 -right-1 w-5 h-5 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6344d4, #8b6ff5)' }}
            >
              {notifications}
            </span>
          )}
        </button>

        {/* Messages */}
        <button
          id="navbar-messages"
          className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 hover:scale-105"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-white/10" />

        {/* Profile Setup Button */}
        <button
          id="navbar-profile-setup"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #6344d4, #8b6ff5)',
            boxShadow: '0 4px 15px rgba(99,68,212,0.4)',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Profile Setup
        </button>
      </div>
    </header>
  );
}
