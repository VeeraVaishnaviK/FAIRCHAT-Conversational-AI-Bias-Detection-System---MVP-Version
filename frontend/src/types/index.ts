export interface AnalysisResult {
  bias_level: 'Low' | 'Medium' | 'High';
  affected_features: string[];
  explanation: string;
  fairness_score: number;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  message: string;
  timestamp?: number;
}

export interface UploadResponse {
  message: string;
  filename: string;
}
