import { useState } from 'react';
import { useApp } from '../hooks/useAppState';
import ChatBox from '../components/ChatBox';
import Alert from '../components/Alert';
import { apiService } from '../services/api';
import { MessageSquare, Settings, Info, Sparkles } from 'lucide-react';

const ChatPage = () => {
  const { chatHistory, addChatMessage, setIsChatting, isChatting, analysisResult } = useApp();
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async (message: string) => {
    // Add user message locally
    addChatMessage({ role: 'user', message, timestamp: Date.now() });
    
    setIsChatting(true);
    setError(null);
    
    try {
      const response = await apiService.sendChatMessage(message, analysisResult || undefined);
      addChatMessage({ role: 'ai', message: response.response, timestamp: Date.now() });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to get a response from the assistant.');
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="hidden lg:block space-y-6">
          <div className="card bg-slate-50 border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Chat Assistant
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Ask about:
            </p>
            <ul className="space-y-2">
              {['Why is my score low?', 'How to fix feature bias?', 'What is fairness score?', 'Show examples'].map((tip) => (
                <li key={tip}>
                  <button 
                    onClick={() => handleSendMessage(tip)}
                    className="w-full text-left p-2 rounded-lg hover:bg-white text-xs text-slate-600 border border-transparent hover:border-slate-200 transition-all"
                  >
                    "{tip}"
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-slate-400" />
              System Info
            </h4>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                <span>Model</span>
                <span className="text-blue-600">Gemini 1.5 Pro</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                <span>Context</span>
                <span className="text-blue-600">Active Dataset</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between lg:hidden mb-4">
             <h1 className="text-xl font-bold flex items-center gap-2">
               <MessageSquare className="w-5 h-5 text-blue-600" />
               Bias Assistant
             </h1>
             <button className="p-2 bg-slate-100 rounded-lg">
                <Settings className="w-4 h-4" />
             </button>
          </div>

          {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
          
          <ChatBox 
            messages={chatHistory} 
            onSendMessage={handleSendMessage} 
            isLoading={isChatting} 
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
