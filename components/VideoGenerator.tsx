
import React, { useState, useEffect, useRef } from 'react';
import { generateVideo, extendVideo, fetchVideoBlob } from '../services/geminiService';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface VideoGeneratorProps {
  initialPrompt?: string;
}

export const VideoGenerator: React.FC<VideoGeneratorProps> = ({ initialPrompt }) => {
  const [hasKey, setHasKey] = useState(false);
  const [prompt, setPrompt] = useState(initialPrompt || '');
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [lastVideoObject, setLastVideoObject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (window.aistudio?.hasSelectedApiKey) {
      window.aistudio.hasSelectedApiKey().then(setHasKey);
    }
  }, []);

  useEffect(() => {
    if (initialPrompt) setPrompt(initialPrompt);
  }, [initialPrompt]);

  const handleSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  // Added handleFileChange to process the uploaded image for video generation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Extract raw base64 and mime type
        const matches = base64String.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          setMimeType(matches[1]);
          setImage(base64String); 
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAction = async (isExtension: boolean) => {
    if (!prompt) return;
    setIsLoading(true);
    setErrorMessage('');
    
    const messages = isExtension 
      ? ["Synchronisiere Frames...", "Erweitere Mundbewegungen...", "Rendere nächste Sequenz...", "Lip-Sync Optimierung läuft..."]
      : ["Initialisiere Veo 3.1...", "Analysiere Performance...", "Scharfstellung der Gesichtsanatomie...", "Rendere Meisterwerk..."];
    
    let msgIndex = 0;
    setStatusMessage(messages[0]);
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      setStatusMessage(messages[msgIndex]);
    }, 10000);

    try {
      let result;
      if (isExtension && lastVideoObject) {
        result = await extendVideo(prompt, lastVideoObject);
      } else {
        const base64Data = image ? image.split(',')[1] : undefined;
        result = await generateVideo(prompt, base64Data, mimeType || undefined);
      }
      
      const playableUrl = await fetchVideoBlob(result.uri);
      setVideoUrl(playableUrl);
      setLastVideoObject(result.videoObject);
      setStatusMessage('');
    } catch (error: any) {
      setErrorMessage(`Technischer Fehler: ${error.message || error}`);
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  if (!hasKey) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
        <div className="w-16 h-16 bg-cinematic-accent/10 rounded-full flex items-center justify-center mb-6 border border-cinematic-accent/20">
          <svg className="w-8 h-8 text-cinematic-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={1.5}/></svg>
        </div>
        <h2 className="text-2xl font-serif mb-2">Bereit für Veo 3.1?</h2>
        <p className="text-cinematic-muted mb-8 max-w-xs">Verbinde dein Google Cloud Projekt um Videos zu generieren.</p>
        <Button onClick={handleSelectKey} className="px-12">Projekt verbinden</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in px-4">
      <div className="flex items-end justify-between border-b border-cinematic-700 pb-4">
        <div>
          <h2 className="text-3xl font-serif text-white">Veo Studio</h2>
          <p className="text-cinematic-muted text-sm">Präzise Lip-Sync & Video-Verlängerung</p>
        </div>
        {lastVideoObject && (
          <div className="flex items-center gap-2 px-3 py-1 bg-cinematic-accent/10 rounded-full border border-cinematic-accent/30">
            <div className="w-2 h-2 bg-cinematic-accent rounded-full animate-pulse" />
            <span className="text-[10px] text-cinematic-accent font-bold uppercase tracking-widest">Extension Mode</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-cinematic-600 uppercase mb-2 block tracking-widest">
                  {lastVideoObject ? "Anschluss-Aktion (Gesang/Bewegung)" : "Szenen-Konfiguration"}
                </label>
                <textarea
                  className="w-full bg-cinematic-900 border border-cinematic-700 rounded-lg p-4 text-white focus:border-cinematic-accent outline-none h-32 text-sm leading-relaxed"
                  placeholder={lastVideoObject ? "Beschreibe die nächsten Phoneme oder Bewegungen..." : "Tipp: Nutze den 'Prompt Architect' für perfekten Lip-Sync..."}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              {!lastVideoObject && (
                <div 
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${image ? 'border-cinematic-accent bg-cinematic-accent/5' : 'border-cinematic-700 hover:border-cinematic-600'}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  <span className="text-xs text-cinematic-muted uppercase tracking-tighter">
                    {image ? "Quellbild für Lip-Sync geladen" : "Referenzbild hochladen (Optional)"}
                  </span>
                </div>
              )}

              <div className="pt-2 flex flex-col gap-3">
                {!lastVideoObject ? (
                  <Button onClick={() => handleAction(false)} disabled={!prompt || isLoading} isLoading={isLoading}>
                    Initial-Video generieren
                  </Button>
                ) : (
                  <>
                    <Button onClick={() => handleAction(true)} disabled={!prompt || isLoading} isLoading={isLoading} className="w-full">
                      Nahtlos um 7s verlängern
                    </Button>
                    <button 
                      onClick={() => { setLastVideoObject(null); setVideoUrl(null); }}
                      className="text-xs text-cinematic-600 hover:text-white transition-colors uppercase tracking-widest text-center"
                    >
                      Projekt zurücksetzen
                    </button>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="aspect-video bg-cinematic-900 flex items-center justify-center relative overflow-hidden group">
            {videoUrl ? (
              <video src={videoUrl} controls autoPlay loop className="w-full h-full object-contain" />
            ) : isLoading ? (
              <div className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-6">
                  <div className="absolute inset-0 border-2 border-cinematic-700 rounded-full"></div>
                  <div className="absolute inset-0 border-t-2 border-cinematic-accent rounded-full animate-spin"></div>
                </div>
                <p className="text-cinematic-accent text-xs font-bold uppercase tracking-[0.2em]">{statusMessage}</p>
              </div>
            ) : (
              <div className="text-center opacity-20">
                <svg className="w-20 h-20 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" strokeWidth={1}/><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={1}/></svg>
                <p className="text-xs uppercase tracking-widest italic">Monitor bereit</p>
              </div>
            )}
          </Card>
          
          {errorMessage && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded text-red-500 text-xs font-medium">
              {errorMessage}
            </div>
          )}
          
          {videoUrl && (
            <div className="flex justify-between items-center px-2">
              <span className="text-[10px] text-cinematic-600 uppercase font-bold tracking-widest">Veo 3.1 Native Output</span>
              <a href={videoUrl} download="veo_lip_sync.mp4" className="text-xs text-cinematic-accent hover:underline uppercase font-bold tracking-widest">Export MP4</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
