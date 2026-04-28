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
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center animate-fade-in">
        <div className="text-7xl mb-8 animate-float">📊</div>
        <h2 className="text-3xl font-bold mb-4 gradient-text">
          No Dataset Loaded
        </h2>
        <p className="text-lg text-secondary mb-8 max-w-md">
          Please upload a CSV dataset on the home page to begin your fairness analysis.
        </p>
        <Link to="/" className="btn-primary">
          ← Back to Upload
        </Link>
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fade-in">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-white/5" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-2xl">⏳</div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Analyzing Patterns...</h2>
        <p className="text-secondary">
          Checking {uploadResult.rows.toLocaleString()} rows for potential bias
        </p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center animate-fade-in">
        <div className="text-6xl mb-8">⚠️</div>
        <h2 className="text-2xl font-bold mb-4 text-danger">Analysis Interrupted</h2>
        <p className="text-secondary mb-8 max-w-md">{error}</p>
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
    <div className="container-neat animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className={`badge ${badgeClass} py-1.5`}>
              {bias_level === 'Low' ? '✓' : bias_level === 'Medium' ? '!' : '×'}
              {bias_level} BIAS DETECTED
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight">
            Analysis Report
          </h1>
          <p className="text-lg text-secondary flex items-center gap-3">
            <span className="font-semibold text-primary">{uploadResult.original_name}</span>
            <span className="opacity-20">|</span>
            <span>{dataset_info?.rows.toLocaleString()} Samples</span>
            <span className="opacity-20">|</span>
            <span>{dataset_info?.columns} Features</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/chat" className="btn-secondary group">
            💬 Ask FAQ
          </Link>
          <Link to="/chat" className="btn-primary shadow-glow">
            💬 Interactive Chat
          </Link>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left Column: Key Stats */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <BiasCard
            icon="⚖️"
            label="Overall Bias Level"
            value={bias_level}
            description={`Detected ${bias_level.toLowerCase()} probability of systemic bias.`}
            colorClass={biasColorClass}
          />

          <BiasCard
            icon="🎯"
            label="Predictive Target"
            value={target_column || 'Outcome'}
            description="Primary variable analyzed for outcome disparities."
            colorClass="accent"
          />

          <BiasCard
            icon="🔍"
            label="Analyzed features"
            value={`${affected_features?.length || 0} Flagged`}
            description="Features showing statistically significant bias."
            colorClass={affected_features?.length > 0 ? 'danger' : 'success'}
          />

          <BiasCard
            icon="📈"
            label="Dataset Density"
            value={`${dataset_info?.columns || 0} Dim`}
            description="Total number of feature dimensions processed."
            colorClass="primary"
          />
        </div>

        {/* Right Column: Gauge */}
        <div className="lg:col-span-4 glass-card p-10 flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-bold text-secondary uppercase tracking-widest mb-8">Fairness Velocity</h3>
          <FairnessGauge score={fairness_score} />
          <div className="mt-8">
            <p className="text-2xl font-bold tracking-tight">{(fairness_score * 100).toFixed(0)}% Score</p>
            <p className="text-xs text-muted mt-1 uppercase font-semibold">Fairness Index</p>
          </div>
        </div>
      </div>

      {/* Narrative Summary */}
      <div className="glass-card mb-12 overflow-hidden border-l-4 border-l-primary/40">
        <div className="p-8 lg:p-10">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm">📄</span>
            Executive Summary
          </h3>
          <p className="text-lg leading-relaxed text-slate-300 first-letter:text-4xl first-letter:font-bold first-letter:mr-3 first-letter:float-left">
            {explanation}
          </p>
        </div>
      </div>

      {/* Technical Deep Dive */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
        {/* Imbalance Analysis */}
        {imbalance_details && imbalance_details.length > 0 && (
          <div className="glass-card flex flex-col overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <span className="text-primary font-mono text-lg">01</span>
                Representation Imbalance
              </h3>
            </div>
            <div className="p-6 space-y-6 flex-1">
              {imbalance_details.map((detail, i) => (
                <div key={i} className="group p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold uppercase tracking-wider text-slate-400">
                      Feature: <span className="text-white">{detail.column}</span>
                    </span>
                    <span className={`badge text-[10px] ${detail.imbalanced ? 'badge-high' : 'badge-low'}`}>
                      {detail.imbalanced ? 'High Variance' : 'Balanced'}
                    </span>
                  </div>

                  {detail.group_proportions && Object.entries(detail.group_proportions).map(([group, proportion]) => (
                    <div key={group} className="space-y-1.5 mt-4">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-secondary">{group}</span>
                        <span className="text-white font-mono">{(proportion * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${proportion * 100}%`,
                            background: detail.imbalanced
                              ? 'linear-gradient(90deg, #f43f5e, #fb7185)'
                              : 'linear-gradient(90deg, #10b981, #34d399)',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Parity Analysis */}
        {parity_details && parity_details.length > 0 && (
          <div className="glass-card flex flex-col overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <span className="text-accent font-mono text-lg">02</span>
                Outcome Parity (Target)
              </h3>
            </div>
            <div className="p-6 space-y-6 flex-1">
              {parity_details.map((detail, i) => (
                <div key={i} className="group p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold uppercase tracking-wider text-slate-400">
                      Variable: <span className="text-white">{detail.sensitive_column}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-muted">PARITY GAP</span>
                      <span className={`badge text-[10px] ${detail.has_disparity ? 'badge-high' : 'badge-low'}`}>
                        {(detail.parity_gap * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {detail.group_positive_rates && Object.entries(detail.group_positive_rates).map(([group, rate]) => (
                    <div key={group} className="space-y-1.5 mt-4">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-secondary">{group}</span>
                        <span className="text-white font-mono">{(rate * 100).toFixed(1)}% Positive</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${rate * 100}%`,
                            background: detail.has_disparity
                              ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                              : 'linear-gradient(90deg, #6366f1, #818cf8)',
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  {detail.has_disparity && (
                    <div className="mt-5 pt-4 border-t border-white/5 flex items-start gap-2">
                       <span className="text-sm">🏮</span>
                       <p className="text-xs text-warning/80 leading-relaxed italic">
                        The group <strong>{detail.most_favored_group}</strong> experiences considerably more favorable outcomes than <strong>{detail.least_favored_group}</strong>.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actionable Recommendations */}
      <div className="mb-20">
        <SuggestionList suggestions={suggestions} />
      </div>

      {/* Global Concierge CTA */}
      <div className="mb-12 relative overflow-hidden rounded-[32px] p-1 shadow-glow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-20" />
        <div className="relative glass-panel rounded-[30px] p-10 lg:p-16 flex flex-col lg:flex-row items-center gap-12 text-center lg:text-left">
          <div className="flex-1">
             <div className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                Deep Intelligence
             </div>
             <h2 className="text-3xl lg:text-4xl font-black mb-6 leading-tight">
                Deep Dive into <span className="gradient-text">Fairness Insights</span>
             </h2>
             <p className="text-lg text-secondary mb-0 max-w-xl">
                Ready to transform these metrics into action? Our AI specialist is standing by to translate technical analysis into clear strategic recommendations.
             </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
             <Link to="/chat" className="btn-primary px-10 py-5 text-base no-underline">
                💬 Launch FAIRCHAT AI
             </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
