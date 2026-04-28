import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import Alert from '../components/Alert';
import { apiService } from '../services/api';
import { useApp } from '../hooks/useAppState';
import { BarChart3, MessageSquare, Zap } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { setAnalysisResult, setIsAnalyzing } = useApp();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const uploadData = await apiService.uploadDataset(file);
      setIsAnalyzing(true);
      const result = await apiService.analyzeBias(uploadData.filename);
      setAnalysisResult(result);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to analyze dataset. Please try again.');
    } finally {
      setIsLoading(false);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold border border-blue-100">
              <Zap className="w-4 h-4" />
              <span>Next-Gen Bias Detection</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight">
              Ensure Fairness in Your <span className="text-blue-600">AI Datasets.</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
              FAIRCHAT helps you detect, understand, and mitigate biases in your conversational datasets before they reach production. Upload your CSV and get instant insights.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6 pt-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Instant Analysis</h3>
                  <p className="text-sm text-slate-500">Deep-dive into feature correlations and bias levels.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">AI Assistant</h3>
                  <p className="text-sm text-slate-500">Chat with Gemini to explore and mitigate biases.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-3xl" />
            
            <div className="relative space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">Upload Dataset</h2>
                <p className="text-slate-500">Choose a CSV file to begin analysis</p>
              </div>

              {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

              <FileUpload onUpload={handleUpload} isLoading={isLoading} />
              
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-center gap-6 opacity-40 grayscale">
                   {/* Logos or partner placeholder */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          © 2026 FAIRCHAT AI. All rights reserved. Built for ethical AI development.
        </div>
      </footer>
    </div>
  );
};

export default Home;
