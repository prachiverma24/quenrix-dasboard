import React from 'react';

export default function NoteViewer({ note }) {
  if (!note) return null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <span className="text-purple-400 font-semibold text-sm uppercase tracking-wider">{note.tech}</span>
        <h1 className="text-4xl font-bold text-white mt-1 mb-4">{note.title}</h1>
        <div className="p-4 bg-purple-900/20 border border-purple-500/20 rounded-xl">
          <p className="text-purple-200 text-lg leading-relaxed"><span className="font-bold text-purple-400">Definition:</span> {note.definition}</p>
        </div>
      </div>

      {/* Explanation */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-3">Detailed Explanation</h2>
        <p className="text-white/80 leading-relaxed">{note.explanation}</p>
      </div>

      {/* Syntax */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-3">Syntax</h2>
        <div className="bg-[#1c1435] border border-white/10 rounded-xl p-4 font-mono text-purple-300">
          {note.syntax}
        </div>
      </div>

      {/* Process/Flowchart */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-3">Working Process</h2>
        <div className="bg-[#1c1435] border border-white/10 rounded-xl p-4 flex items-center justify-center">
          <div className="text-white/80 text-center font-mono text-sm">
            {note.process.split('->').map((step, index) => (
              <span key={index}>
                <span className="bg-purple-600/30 px-3 py-1.5 rounded-lg border border-purple-500/20 inline-block my-1">{step.trim()}</span>
                {index < note.process.split('->').length - 1 && <span className="mx-2 text-purple-500">→</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Real-world Example */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-3">Real-world Analogy</h2>
        <div className="bg-[#251b40] border border-purple-500/10 rounded-xl p-4">
          <p className="text-white/80 leading-relaxed">💡 {note.realWorldExample}</p>
        </div>
      </div>

      {/* Code Example */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-3">Code Example</h2>
        <div className="bg-[#1c1435] border border-white/10 rounded-xl p-4 font-mono text-sm text-white/90 overflow-x-auto">
          <pre><code>{note.codeExample}</code></pre>
        </div>
      </div>

      {/* Output Example */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-3">Expected Output</h2>
        <div className="bg-[#1c1435]/50 border border-white/5 rounded-xl p-4 text-white/70 italic text-sm">
          {note.outputExample}
        </div>
      </div>

      {/* Use Cases, Advantages, Disadvantages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1c1435] border border-white/10 rounded-xl p-5">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span className="text-green-400">🎯</span> Use Cases
          </h3>
          <ul className="text-sm text-white/70 space-y-2">
            {note.useCases.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span>•</span> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-[#1c1435] border border-white/10 rounded-xl p-5">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span className="text-blue-400">👍</span> Advantages
          </h3>
          <ul className="text-sm text-white/70 space-y-2">
            {note.advantages.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span>•</span> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-[#1c1435] border border-white/10 rounded-xl p-5">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span className="text-red-400">👎</span> Disadvantages
          </h3>
          <ul className="text-sm text-white/70 space-y-2">
            {note.disadvantages.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span>•</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Interview Questions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-3">Interview Questions</h2>
        <div className="space-y-4">
          {note.interviewQuestions.map((item, index) => (
            <div key={index} className="bg-[#1c1435] border border-white/10 rounded-xl p-5">
              <p className="font-bold text-purple-300 mb-2">Q: {item.question}</p>
              <p className="text-white/70 text-sm">A: {item.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Common Mistakes & Best Practices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#1c1435] border border-white/10 rounded-xl p-5">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span className="text-red-400">⚠️</span> Common Mistakes
          </h3>
          <ul className="text-sm text-white/70 space-y-2">
            {note.commonMistakes.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span>•</span> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-[#1c1435] border border-white/10 rounded-xl p-5">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span className="text-green-400">✨</span> Best Practices
          </h3>
          <ul className="text-sm text-white/70 space-y-2">
            {note.bestPractices.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span>•</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-2">Summary / Revision Note</h2>
        <p className="text-purple-200 leading-relaxed">{note.summary}</p>
      </div>
    </div>
  );
}
