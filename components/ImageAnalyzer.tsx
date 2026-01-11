import React, { useState, useRef } from 'react';
import { analyzeImage } from '../services/geminiService';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

export const ImageAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          // We keep the full string for display, pass generic base64 to service
          setImage(base64String); 
        }
      };
      reader.readAsDataURL(file);
      setResult('');
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    
    setIsLoading(true);
    setResult('');
    try {
      // Strip header for API call
      const base64Data = image.split(',')[1];
      const analysis = await analyzeImage(base64Data, mimeType, prompt);
      setResult(analysis);
    } catch (error) {
      setResult("An error occurred during analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-serif text-cinematic-text">Hyper-Realistic Analysis</h2>
        <p className="text-cinematic-muted max-w-2xl mx-auto">
          Upload a photograph to receive a professional breakdown of its lighting, composition, and artistic merit powered by Gemini 3 Pro.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <div 
              className="border-2 border-dashed border-cinematic-600 rounded-lg p-8 text-center hover:border-cinematic-accent transition-colors cursor-pointer bg-cinematic-900/50"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
              {image ? (
                <div className="relative group">
                  <img src={image} alt="Upload preview" className="max-h-64 mx-auto rounded shadow-lg object-contain" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
                    <span className="text-white font-medium">Click to change</span>
                  </div>
                </div>
              ) : (
                <div className="py-12">
                  <svg className="mx-auto h-12 w-12 text-cinematic-muted mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-cinematic-muted">Click to upload or drag and drop</p>
                  <p className="text-xs text-cinematic-600 mt-2">PNG, JPG, WEBP up to 10MB</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-cinematic-muted mb-2">Specific Questions (Optional)</label>
                <textarea
                  className="w-full bg-cinematic-900 border border-cinematic-700 rounded-lg p-3 text-cinematic-text focus:border-cinematic-accent focus:ring-1 focus:ring-cinematic-accent outline-none transition-all placeholder-cinematic-700"
                  rows={3}
                  placeholder="E.g., Evaluate the color grading and skin texture detail..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={handleAnalyze} 
                disabled={!image} 
                isLoading={isLoading}
                className="w-full"
              >
                Analyze Photograph
              </Button>
            </div>
          </Card>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          <Card className="h-full min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-4 border-b border-cinematic-700 pb-4">
              <h3 className="text-xl font-medium text-cinematic-accent">Analysis Report</h3>
              <span className="text-xs text-cinematic-600 uppercase tracking-wider">Gemini 3 Pro</span>
            </div>
            
            <div className="flex-grow overflow-y-auto">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4 text-cinematic-muted opacity-50">
                  <div className="w-16 h-16 border-t-2 border-cinematic-accent rounded-full animate-spin"></div>
                  <p>Examining pixels...</p>
                </div>
              ) : result ? (
                <div className="prose prose-invert prose-yellow max-w-none">
                  <div className="whitespace-pre-wrap leading-relaxed text-cinematic-text/90">
                    {result}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-cinematic-700 italic">
                  Analysis results will appear here.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};