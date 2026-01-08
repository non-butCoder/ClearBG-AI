
export type BgColor = 'white' | 'blue' | 'sky blue' | 'red' | 'purple';

export interface ImageData {
  base64: string;
  mimeType: string;
  name: string;
  url: string;
}

export interface ProcessingState {
  isProcessing: boolean;
  error: string | null;
  progressMessage: string;
}
