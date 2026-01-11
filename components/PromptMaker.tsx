
import React, { useState } from 'react';
import { enhanceVideoPrompt } from '../services/geminiService';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface PromptMakerProps {
  onUsePrompt: (prompt: string) => void;
}

export const PromptMaker: React.FC<PromptMakerProps> = ({ onUsePrompt }) => {
  const [concept, setConcept] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLipSyncMode, setIsLipSyncMode] = useState(false);

  const handleEnhance = async () => {
    if (!concept) return;
    setIsLoading(true);
    try {
      const result = await enhanceVideoPrompt(concept, isLipSyncMode);
      setEnhancedPrompt(result);
    } catch (error) {
      console.error(error);
      setEnhancedPrompt("Fehler bei der Prompt-Erstellung.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-serif text-cinematic-text">Prompt Architect</h2>
        <p className="text-cinematic-muted max-w-2xl mx-auto">
          Optimiere deine Vision für Veo 3.1. Aktiviere den Lip-Sync Modus für realistische Gesangs-Performances.
        </p>
      </div>

      <Card className="space-y-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-cinematic-muted">Konzept oder Songtext</label>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold ${isLipSyncMode ? 'text-cinematic-accent' : 'text-cinematic-600'}`}>
              LIP-SYNC MODE
            </span>
            <button 
              onClick={() => setIsLipSyncMode(!isLipSyncMode)}
              className={`w-10 h-5 rounded-full p-1 transition-colors ${isLipSyncMode ? 'bg-cinematic-accent' : 'bg-cinematic-700'}`}
            >
              <div className={`w-3 h-3 bg-white rounded-full transition-transform ${isLipSyncMode ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
        
        <textarea
          className="w-full bg-cinematic-900 border border-cinematic-700 rounded-lg p-4 text-white min-h-[120px] outline-none focus:border-cinematic-accent transition-all"
          placeholder={isLipSyncMode ? "Gib hier Songtexte oder Beschreibungen der Gesangs-Szene ein..." : "Beschreibe die Szene..."}
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
        />
        
        <Button onClick={handleEnhance} disabled={!concept} isLoading={isLoading} className="w-full">
          Prompt cinematic optimieren
        </Button>
      </Card>

      {enhancedPrompt && (
        <Card className="border-cinematic-accent/30 bg-cinematic-accent/5 animate-fade-in">
          <h3 className="text-cinematic-accent text-sm font-bold uppercase mb-3">Director's Script</h3>
          <p className="text-cinematic-text text-sm italic leading-relaxed mb-6">"{enhancedPrompt}"</p>
          <Button variant="outline" onClick={() => onUsePrompt(enhancedPrompt)} className="w-full">
            In Veo Studio übernehmen
          </Button>
        </Card>
      )}
    </div>
  );
};
