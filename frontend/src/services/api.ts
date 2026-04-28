import axios from 'axios';
import type { AnalysisResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const apiService = {
  uploadDataset: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  analyzeBias: async (filename: string) => {
    const response = await api.get<AnalysisResult>(`/analyze?filename=${filename}`);
    return response.data;
  },

  sendChatMessage: async (message: string, context?: AnalysisResult) => {
    const response = await api.post<{ response: string }>('/chat', { 
      message,
      context
    });
    return response.data;
  },
};

export default apiService;
