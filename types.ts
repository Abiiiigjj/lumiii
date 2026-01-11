
export interface AnalysisResult {
  text: string;
}

export interface VideoGenerationState {
  status: 'idle' | 'generating' | 'completed' | 'failed';
  videoUri?: string;
  error?: string;
}

export enum Tab {
  ANALYZER = 'ANALYZER',
  PROMPT_MAKER = 'PROMPT_MAKER',
  GENERATOR = 'GENERATOR'
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}
