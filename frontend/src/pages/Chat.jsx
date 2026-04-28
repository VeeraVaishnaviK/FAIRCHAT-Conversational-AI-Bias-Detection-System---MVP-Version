import { Link } from 'react-router-dom'
import ChatBox from '../components/ChatBox'

export default function Chat({ analysisResult }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2" style={{ color: '#f1f5f9' }}>
            <span>💬</span> Chat with FAIRCHAT
          </h1>
          <p className="text-xs mt-1" style={{ color: '#64748b' }}>
            {analysisResult
              ? `Discussing: ${analysisResult.bias_level} bias (score: ${analysisResult.fairness_score}/100)`
              : 'Upload a dataset first for context-aware responses'}
          </p>
        </div>

        {!analysisResult && (
          <Link to="/" className="btn-ghost text-xs no-underline">
            📁 Upload File
          </Link>
        )}

        {analysisResult && (
          <Link to="/dashboard" className="btn-ghost text-xs no-underline">
            📊 Dashboard
          </Link>
        )}
      </div>

      {/* Context Banner */}
      {analysisResult && (
        <div
          className="mb-4 p-3 rounded-xl flex items-center gap-3 animate-fade-in"
          style={{
            background: 'rgba(99, 102, 241, 0.06)',
            border: '1px solid rgba(99, 102, 241, 0.12)',
          }}
        >
          <span className="text-lg">📊</span>
          <div className="flex-1">
            <p className="text-xs font-semibold" style={{ color: '#818cf8' }}>
              Analysis Context Loaded
            </p>
            <p className="text-xs" style={{ color: '#64748b' }}>
              Bias Level: {analysisResult.bias_level} • Score: {analysisResult.fairness_score}/100
              {analysisResult.affected_features?.length > 0 &&
                ` • Affected: ${analysisResult.affected_features.join(', ')}`}
            </p>
          </div>
          <span className={`badge text-xs ${
            analysisResult.bias_level === 'Low' ? 'badge-low' :
            analysisResult.bias_level === 'Medium' ? 'badge-medium' : 'badge-high'
          }`}>
            {analysisResult.bias_level}
          </span>
        </div>
      )}

      {/* Chat Interface */}
      <div className="glass-card overflow-hidden" style={{ minHeight: 'calc(100vh - 240px)' }}>
        <ChatBox analysisContext={analysisResult} />
      </div>
    </div>
  )
}
