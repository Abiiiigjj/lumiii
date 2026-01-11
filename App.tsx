
import React, { useState } from 'react';
import { ImageAnalyzer } from './components/ImageAnalyzer';
import { VideoGenerator } from './components/VideoGenerator';
import { PromptMaker } from './components/PromptMaker';
import { Tab } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.ANALYZER);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');

  const handleUsePrompt = (prompt: string) => {
    setGeneratedPrompt(prompt);
    setActiveTab(Tab.GENERATOR);
  };

  return (
    <div className="min-h-screen bg-cinematic-900 text-cinematic-text font-sans selection:bg-cinematic-accent selection:text-black">
      {/* Header */}
      <header className="border-b border-cinematic-700 bg-cinematic-800/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-cinematic-accent rounded-sm rotate-45 flex items-center justify-center">
               <span className="text-black font-bold -rotate-45 text-lg">L</span>
             </div>
             <h1 className="text-2xl font-serif tracking-wider text-white">Lumière & Lens</h1>
          </div>
          
          <nav className="flex items-center gap-1 bg-cinematic-900/80 p-1 rounded-lg border border-cinematic-700">
            <button
              onClick={() => setActiveTab(Tab.ANALYZER)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === Tab.ANALYZER 
                ? 'bg-cinematic-700 text-white shadow-lg' 
                : 'text-cinematic-muted hover:text-white'
              }`}
            >
              Photo Analyst
            </button>
            <button
              onClick={() => setActiveTab(Tab.PROMPT_MAKER)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === Tab.PROMPT_MAKER
                ? 'bg-cinematic-700 text-white shadow-lg' 
                : 'text-cinematic-muted hover:text-white'
              }`}
            >
              Prompt Architect
            </button>
            <button
              onClick={() => setActiveTab(Tab.GENERATOR)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === Tab.GENERATOR 
                ? 'bg-cinematic-accent text-black shadow-lg shadow-yellow-500/20' 
                : 'text-cinematic-muted hover:text-white'
              }`}
            >
              Veo Studio
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="transition-all duration-500 ease-in-out">
          {activeTab === Tab.ANALYZER && <ImageAnalyzer />}
          {activeTab === Tab.PROMPT_MAKER && <PromptMaker onUsePrompt={handleUsePrompt} />}
          {activeTab === Tab.GENERATOR && <VideoGenerator initialPrompt={generatedPrompt} />}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-cinematic-800 mt-12 py-8 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 text-center text-cinematic-600 text-sm">
          <p>© {new Date().getFullYear()} Lumière & Lens. Powered by Gemini 3 Pro & Veo 3.1.</p>
        </div>
      </footer>
    </div>
  );
}
