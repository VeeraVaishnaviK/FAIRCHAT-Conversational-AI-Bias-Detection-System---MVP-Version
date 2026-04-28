import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useAppState';
import BiasCard from '../components/BiasCard';
import ScoreBar from '../components/ScoreBar';
import { ArrowRight, Download, Share2, RefreshCw, MessageSquare } from 'lucide-react';

const Dashboard = () => {
  const { analysisResult } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!analysisResult) {
      navigate('/');
    }
  }, [analysisResult, navigate]);

  if (!analysisResult) return null;

  const handleExport = () => {
    if (!analysisResult) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analysisResult, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "fairchat_analysis.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Dashboard URL copied to clipboard!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Analysis Dashboard</h1>
          <p className="text-slate-500 mt-1">Detailed breakdown of your dataset's fairness metrics.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </button>
          <button className="btn-primary" onClick={() => navigate('/chat')}>
            Talk to Assistant
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <BiasCard 
          label="Bias Level" 
          value={analysisResult.bias_level} 
          type="bias" 
          level={analysisResult.bias_level}
          description="The overall categorized bias risk detected in the data."
        />
        <BiasCard 
          label="Affected Features" 
          value={analysisResult.affected_features.length > 0 ? analysisResult.affected_features.join(', ') : 'None'} 
          type="feature"
          description="Attributes contributing to the detected bias in the dataset."
        />
        <div className="lg:col-span-2">
          <ScoreBar score={analysisResult.fairness_score} label="Overall Fairness Score" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card h-full">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-blue-600" />
              AI Explanation & Insights
            </h3>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 leading-relaxed text-lg">
                {analysisResult.explanation}
              </p>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-100 grid sm:grid-cols-2 gap-4">
               <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-1">Recommendation</h4>
                  <p className="text-sm text-slate-500">
                    {analysisResult.affected_features.length > 0 
                      ? `Consider re-balancing the classes for ${analysisResult.affected_features[0]} to improve parity.`
                      : 'Maintain current data distribution and monitor for future shifts.'}
                  </p>
               </div>
               <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-1">Next Steps</h4>
                  <p className="text-sm text-slate-500">Use the Chat Assistant to explore specific edge cases.</p>
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Export Results</h3>
            <p className="text-sm text-slate-500 mb-6">Download the full analysis report in PDF or JSON format.</p>
            <div className="space-y-3">
              <button onClick={handleExport} className="btn-secondary w-full justify-between group">
                Download PDF Report
                <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>
              <button onClick={handleExport} className="btn-secondary w-full justify-between group">
                Export JSON Data
                <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

          <div className="card bg-blue-600 text-white border-none overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <MessageSquare className="w-24 h-24 rotate-12" />
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Need deeper insights?</h3>
              <p className="text-blue-100 text-sm mb-6">Our AI assistant can help you interpret complex patterns and suggest specific fixes.</p>
              <button 
                onClick={() => navigate('/chat')}
                className="w-full bg-white text-blue-600 font-bold py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Start Chatting
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
