import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import BiasCard from '../components/BiasCard'
import FairnessGauge from '../components/FairnessGauge'
import SuggestionList from '../components/SuggestionList'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export default function Dashboard({ uploadResult, analysisResult, setAnalysisResult }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Fetch analysis when upload result is available
  useEffect(() => {
    if (uploadResult && !analysisResult) {
      runAnalysis()
    }
  }, [uploadResult])

  const runAnalysis = async () => {
    if (!uploadResult?.filename) return

    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(`${API_URL}/analyze`, {
        params: { filename: uploadResult.filename },
      })
      setAnalysisResult(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // No upload result — prompt user to upload
  if (!uploadResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="text-6xl mb-6">📊</div>
        <h2 className="text-2xl font-bold mb-3" style={{ color: '#f1f5f9' }}>
          No Dataset Loaded
        </h2>
        <p className="text-sm mb-6" style={{ color: '#64748b' }}>
          Upload a CSV file first to see bias analysis results.
        </p>
        <Link to="/" className="btn-primary no-underline">
          ← Upload a File
        </Link>
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full" style={{
            border: '3px solid rgba(99, 102, 241, 0.1)',
          }} />
          <div className="absolute inset-0 rounded-full animate-spin" style={{
            border: '3px solid transparent',
            borderTopColor: '#6366f1',
          }} />
        </div>
        <p className="text-lg font-semibold mb-1" style={{ color: '#f1f5f9' }}>
          Analyzing your dataset...
        </p>
        <p className="text-sm" style={{ color: '#64748b' }}>
          Checking for bias across {uploadResult.rows} rows and {uploadResult.columns?.length} columns
        </p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="text-5xl mb-6">⚠️</div>
        <h2 className="text-xl font-bold mb-3" style={{ color: '#fb7185' }}>
          Analysis Failed
        </h2>
        <p className="text-sm mb-6 max-w-md" style={{ color: '#94a3b8' }}>
          {error}
        </p>
        <button onClick={runAnalysis} className="btn-primary">
          Retry Analysis
        </button>
      </div>
    )
  }

  // No results yet
  if (!analysisResult) return null

  const {
    bias_level,
    fairness_score,
    affected_features,
    explanation,
    suggestions,
    dataset_info,
    target_column,
    imbalance_details,
    parity_details,
  } = analysisResult

  const biasColorClass =
    bias_level === 'Low' ? 'success' : bias_level === 'Medium' ? 'warning' : 'danger'

  const badgeClass =
    bias_level === 'Low' ? 'badge-low' : bias_level === 'Medium' ? 'badge-medium' : 'badge-high'

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#f1f5f9' }}>
            Bias Analysis Results
          </h1>
          <p className="text-sm" style={{ color: '#64748b' }}>
            {uploadResult.original_name} • {dataset_info?.rows} rows • {dataset_info?.columns} columns
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className={`badge ${badgeClass}`}>
            {bias_level === 'Low' ? '✅' : bias_level === 'Medium' ? '⚠️' : '🔴'}
            {bias_level} Bias
          </span>

          <Link to="/chat" className="btn-primary text-sm no-underline">
            💬 Chat About This
          </Link>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <BiasCard
            icon="⚖️"
            label="Bias Level"
            value={bias_level}
            description={`Your dataset shows ${bias_level.toLowerCase()} levels of bias`}
            colorClass={biasColorClass}
          />

          <BiasCard
            icon="🎯"
            label="Target Column"
            value={target_column || 'Auto-detected'}
            description="The outcome column used for parity analysis"
            colorClass="accent"
          />

          <BiasCard
            icon="📋"
            label="Features Analyzed"
            value={`${dataset_info?.columns || 0} columns`}
            description={`${affected_features?.length || 0} features flagged for bias`}
            colorClass="primary"
          />

          <BiasCard
            icon="⚡"
            label="Affected Features"
            value={affected_features?.length > 0 ? affected_features.join(', ') : 'None'}
            description="Features showing significant bias or imbalance"
            colorClass={affected_features?.length > 0 ? 'warning' : 'success'}
          />
        </div>

        {/* Gauge */}
        <div className="glass-card p-6 flex items-center justify-center">
          <FairnessGauge score={fairness_score} />
        </div>
      </div>

      {/* Explanation Card */}
      <div className="glass-card p-6 mb-8 animate-slide-up">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: '#f1f5f9' }}>
          <span>📝</span> Analysis Summary
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: '#cbd5e1' }}>
          {explanation}
        </p>
      </div>

      {/* Detailed Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Imbalance Details */}
        {imbalance_details && imbalance_details.length > 0 && (
          <div className="glass-card p-6 animate-slide-up">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#f1f5f9' }}>
              <span>📊</span> Group Distribution
            </h3>
            <div className="space-y-4">
              {imbalance_details.map((detail, i) => (
                <div key={i} className="p-3 rounded-xl" style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>
                      {detail.column}
                    </span>
                    <span className={`badge text-xs ${detail.imbalanced ? 'badge-high' : 'badge-low'}`}>
                      {detail.imbalanced ? 'Imbalanced' : 'Balanced'}
                    </span>
                  </div>

                  {/* Group bars */}
                  {detail.group_proportions && Object.entries(detail.group_proportions).map(([group, proportion]) => (
                    <div key={group} className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs w-20 truncate" style={{ color: '#94a3b8' }}>
                        {group}
                      </span>
                      <div className="flex-1 h-2 rounded-full" style={{
                        background: 'rgba(255,255,255,0.06)',
                      }}>
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${Math.max(proportion * 100, 2)}%`,
                            background: detail.imbalanced
                              ? 'linear-gradient(90deg, #f43f5e, #fb7185)'
                              : 'linear-gradient(90deg, #10b981, #34d399)',
                          }}
                        />
                      </div>
                      <span className="text-xs font-mono w-12 text-right" style={{ color: '#94a3b8' }}>
                        {(proportion * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Parity Details */}
        {parity_details && parity_details.length > 0 && (
          <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#f1f5f9' }}>
              <span>🎯</span> Outcome Parity
            </h3>
            <div className="space-y-4">
              {parity_details.map((detail, i) => (
                <div key={i} className="p-3 rounded-xl" style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>
                      {detail.sensitive_column}
                    </span>
                    <span className={`badge text-xs ${detail.has_disparity ? 'badge-high' : 'badge-low'}`}>
                      Gap: {(detail.parity_gap * 100).toFixed(1)}%
                    </span>
                  </div>

                  {/* Group positive rates */}
                  {detail.group_positive_rates && Object.entries(detail.group_positive_rates).map(([group, rate]) => (
                    <div key={group} className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs w-20 truncate" style={{ color: '#94a3b8' }}>
                        {group}
                      </span>
                      <div className="flex-1 h-2 rounded-full" style={{
                        background: 'rgba(255,255,255,0.06)',
                      }}>
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${Math.max(rate * 100, 2)}%`,
                            background: detail.has_disparity
                              ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                              : 'linear-gradient(90deg, #6366f1, #818cf8)',
                          }}
                        />
                      </div>
                      <span className="text-xs font-mono w-12 text-right" style={{ color: '#94a3b8' }}>
                        {(rate * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}

                  {detail.has_disparity && (
                    <p className="text-xs mt-2" style={{ color: '#fbbf24' }}>
                      ⚠️ {detail.most_favored_group} is favored over {detail.least_favored_group}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      <SuggestionList suggestions={suggestions} />

      {/* Chat CTA */}
      <div className="mt-8 text-center animate-slide-up" style={{ animationDelay: '200ms' }}>
        <div className="glass-card p-8 inline-block">
          <p className="text-lg font-semibold mb-2" style={{ color: '#f1f5f9' }}>
            Need help understanding these results?
          </p>
          <p className="text-sm mb-5" style={{ color: '#64748b' }}>
            Chat with our AI assistant for plain-English explanations and personalized suggestions.
          </p>
          <Link to="/chat" className="btn-primary no-underline">
            💬 Chat with FAIRCHAT
          </Link>
        </div>
      </div>
    </div>
  )
}
