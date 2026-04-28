import { Link } from 'react-router-dom'
import ChatBox from '../components/ChatBox'

export default function Chat({ analysisResult }) {
  return (
    <div className="container-neat animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3 tracking-tighter">
            <span className="text-primary">FAIR</span>CHAT <span className="text-slate-500 font-light">Specialist</span>
          </h1>
          <p className="text-sm text-secondary mt-2">
            {analysisResult
              ? `Operational context: ${analysisResult.bias_level} bias protocol active`
              : 'Standalone intelligence mode — no dataset loaded'}
          </p>
        </div>

        <div className="flex gap-3">
          {!analysisResult ? (
            <Link to="/" className="btn-secondary py-2.5 px-6 text-xs no-underline">
              📁 Upload Source
            </Link>
          ) : (
            <Link to="/dashboard" className="btn-secondary py-2.5 px-6 text-xs no-underline">
              📊 Return to Dashboard
            </Link>
          )}
        </div>
      </div>

      {/* Context Banner */}
      {analysisResult && (
        <div className="mb-8 p-6 lg:p-8 rounded-[24px] glass-card flex items-center gap-6 border-l-4 border-l-primary/40">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl shadow-inner">
            🧠
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-1">
              Contextual Intelligence Active
            </h3>
            <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
              I've processed the <strong>{analysisResult.bias_level} bias</strong> report. You can ask for specific mitigation steps or explain technical metrics.
            </p>
          </div>
          <div className={`badge ${
            analysisResult.bias_level === 'Low' ? 'badge-low' :
            analysisResult.bias_level === 'Medium' ? 'badge-medium' : 'badge-high'
          } hidden sm:flex`}>
            {analysisResult.bias_level} Priority
          </div>
        </div>
      )}

      {/* Chat Interface */}
      <div className="glass-card overflow-hidden shadow-glow" style={{ minHeight: 'calc(100vh - 350px)' }}>
        <ChatBox analysisContext={analysisResult} />
      </div>
    </div>
  )
}
