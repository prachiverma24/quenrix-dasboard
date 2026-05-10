import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import MainContent from './components/MainContent';
import RightPanel from './components/RightPanel';
import NotesPlatform from './components/NotesPlatform';

export default function App() {
  const [activeItem, setActiveItem] = useState('notes');

  return (
    <div
      className="font-inter bg-[#130e1d] min-h-screen text-white flex"
    >
      {/* Sidebar - hidden on small screens, fixed on lg */}
      <div className="hidden lg:block">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 lg:ml-[210px]">
        {/* Navbar */}
        <Navbar />

        {/* Body: offset for sidebar + navbar */}
        <div
          className="flex flex-col lg:flex-row min-h-screen"
          style={{
            background: '#1A1333',
            borderTopLeftRadius: '32px',
            boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.2)',
          }}
        >
          {/* Scrollable main content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8 min-w-0 lg:mr-[300px]">
            {activeItem === 'notes' ? <NotesPlatform /> : <MainContent />}
          </main>

          {/* Right Panel - block at bottom on small screens, fixed on right for lg */}
          <div className="block lg:hidden w-full border-t border-white/10 bg-[#130e1d]">
            <RightPanel isMobile />
          </div>
          <div className="hidden lg:block">
            <RightPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
