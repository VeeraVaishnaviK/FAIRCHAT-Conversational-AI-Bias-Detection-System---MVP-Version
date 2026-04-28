import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AnalysisResult, ChatMessage } from '../types';

interface AppContextType {
  analysisResult: AnalysisResult | null;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  chatHistory: ChatMessage[];
  setChatHistory: (history: ChatMessage[]) => void;
  addChatMessage: (message: ChatMessage) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (status: boolean) => void;
  isChatting: boolean;
  setIsChatting: (status: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isChatting, setIsChatting] = useState(false);

  const addChatMessage = (message: ChatMessage) => {
    setChatHistory((prev) => [...prev, message]);
  };

  return (
    <AppContext.Provider
      value={{
        analysisResult,
        setAnalysisResult,
        chatHistory,
        setChatHistory,
        addChatMessage,
        isAnalyzing,
        setIsAnalyzing,
        isChatting,
        setIsChatting,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
