import React, { useState } from 'react';
import { mockNotes } from '../data/mockNotes';
import NoteViewer from './NoteViewer';

export default function NotesPlatform() {
  const [selectedTech, setSelectedTech] = useState('HTML');
  const [searchTerm, setSearchTerm] = useState('');

  const technologies = [
    'HTML', 'CSS', 'JavaScript', 'DOM', 'React', 'Next.js', 
    'TypeScript', 'Node.js', 'Express.js', 'NestJS', 'MongoDB', 
    'SQL', 'PostgreSQL', 'Git & GitHub', 'API', 'JWT Authentication', 
    'CRUD Operations', 'Tailwind CSS', 'DSA', 'OOPs'
  ];

  const filteredTechs = technologies.filter(tech => 
    tech.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeNote = mockNotes.find(note => note.tech === selectedTech);

  return (
    <div className="flex h-full bg-[#1A1333] text-white">
      {/* Local Sidebar for Technologies */}
      <div className="w-64 bg-[#130e1d] border-r border-white/10 flex flex-col h-[calc(100vh-64px)]">
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-white/40">🔍</span>
            <input
              type="text"
              placeholder="Search subjects..."
              className="w-full pl-9 pr-4 py-2 bg-[#1c1435] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          <ul>
            {filteredTechs.map(tech => (
              <li key={tech} className="px-2 mb-1">
                <button
                  onClick={() => setSelectedTech(tech)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-between group ${
                    selectedTech === tech 
                      ? 'bg-purple-600/20 text-purple-300 font-semibold' 
                      : 'text-white/60 hover:text-white/90 hover:bg-white/5'
                  }`}
                >
                  <span className="text-sm">{tech}</span>
                  {selectedTech === tech && (
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(167,139,250,0.6)]"></span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8 h-[calc(100vh-64px)]">
        {activeNote ? (
          <NoteViewer note={activeNote} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white/40">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-white/70 mb-2">Premium Notes Coming Soon</h3>
            <p className="text-sm max-width-md text-center">We are currently crafting high-quality, topper-style notes for <span className="text-purple-400 font-semibold">{selectedTech}</span>.</p>
            <p className="text-sm mt-1">Try selecting <span className="text-white/60">HTML</span> or <span className="text-white/60">React</span> to see the demo.</p>
          </div>
        )}
      </div>
    </div>
  );
}
