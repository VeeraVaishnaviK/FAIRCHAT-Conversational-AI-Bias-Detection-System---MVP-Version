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

  if (!uploadResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center animate-fade-in">
        <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center text-3xl mb-8 shadow-inner">
          📊
        </div>
        <h2 className="text-3xl font-black mb-4 tracking-tight">
          No Dataset <span className="text-indigo-400">Loaded</span>
        </h2>
        <p className="text-slate-400 max-w-sm mb-10 text-sm leading-relaxed">
          Upload a CSV file from the home page to begin your conversational bias analysis journey.
        </p>
        <Link to="/" className="btn-primary no-underline scale-110">
          ← Return to Upload
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 animate-fade-in">
        <div className="relative w-16 h-16 mb-10">
          <div className="absolute inset-0 rounded-full border-2 border-indigo-500/10" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 animate-spin" />
        </div>
        <p className="text-xl font-bold tracking-tight mb-2">Analyzing Fairness...</p>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">
          Scanning {uploadResult.rows} rows &bull; {uploadResult.columns?.length} features
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center animate-fade-in">
        <div className="text-4xl mb-6">⚠️</div>
        <h2 className="text-2xl font-bold text-rose-500 mb-4 tracking-tight">
          Analysis Interrupted
        </h2>
        <p className="text-sm text-slate-400 mb-8 max-w-md">
          {error}
        </p>
        <button onClick={runAnalysis} className="btn-primary">
          Retry Analysis
        </button>
      </div>
    )
  }

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
    <div className="max-w-6xl mx-auto px-6 py-12 animate-fade-in">
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <span className={`badge ${badgeClass} !px-3 !py-1 !text-[10px]`}>
              {bias_level} Bias Detected
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-3">
             Analysis <span className="text-indigo-400">Intelligence</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium tracking-wide">
            {uploadResult.original_name} &bull; {dataset_info?.rows} Rows &bull; {dataset_info?.columns} Features
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/chat" className="btn-primary no-underline group shadow-glow">
            <span>💬</span> Start AI Chat
          </Link>
          <button className="btn-ghost text-xs font-bold" onClick={() => navigate('/')}>
             New Experiment
          </button>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Metric Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <BiasCard
            icon="⚖️"
            label="Equity Index"
            value={bias_level}
            description={`Overall dataset fairness classification`}
            colorClass={biasColorClass}
          />
          <BiasCard
            icon="🎯"
            label="Prediction Target"
            value={target_column || 'Outcome'}
            description="Objective column analyzed for parity"
            colorClass="accent"
          />
          <BiasCard
            icon="📊"
            label="Flagged Features"
            value={affected_features?.length || 0}
            description="Columns showing significant bias"
            colorClass={affected_features?.length > 0 ? 'warning' : 'success'}
          />
          <BiasCard
            icon="🏢"
            label="Compliance Score"
            value={`${fairness_score}%`}
            description="Estimated alignment with fairness standards"
            colorClass={fairness_score > 80 ? 'success' : fairness_score > 60 ? 'warning' : 'danger'}
          />
        </div>

        {/* Gauge Section */}
        <div className="lg:col-span-4 glass-card p-10 flex flex-col items-center justify-center text-center">
           <FairnessGauge score={fairness_score} />
           <p className="mt-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
             Sustainability Goal
           </p>
        </div>
      </div>

      {/* AI Interpretation Section */}
      <div className="glass-card p-10 mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 select-none text-8xl">📝</div>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-sm">🤖</span>
          AI Interpretation
        </h3>
        <p className="text-[15px] leading-relaxed text-slate-300 max-w-4xl italic">
          "{explanation}"
        </p>
      </div>

      {/* Deep-Dive Distributions */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
        {/* Distribution Plot-alike */}
        {imbalance_details && imbalance_details.length > 0 && (
          <div className="glass-card p-10">
            <h3 className="text-lg font-bold mb-8 uppercase tracking-widest text-slate-400 text-[11px]">
              Demographic Distribution
            </h3>
            <div className="space-y-8">
              {imbalance_details.map((detail, i) => (
                <div key={i} className="group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-white/90">{detail.column}</span>
                    <span className={`text-[10px] font-black transition-colors ${detail.imbalanced ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {detail.imbalanced ? 'IMBALANCE DETECTED' : 'OPTIMAL BALANCE'}
                    </span>
                  </div>
                  <div className="space-y-4 pt-1">
                    {detail.group_proportions && Object.entries(detail.group_proportions).map(([group, proportion]) => (
                      <div key={group} className="relative pt-1">
                        <div className="flex items-center justify-between mb-1.5 px-1">
                           <span className="text-xs font-medium text-slate-500 uppercase">{group}</span>
                           <span className="text-[10px] font-bold text-slate-400">{(proportion * 100).toFixed(0)}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{
                              width: `${proportion * 100}%`,
                              background: detail.imbalanced ? '#f43f5e' : '#10b981',
                              opacity: 0.6 + (proportion * 0.4)
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Parity Plots-alike */}
        {parity_details && parity_details.length > 0 && (
          <div className="glass-card p-10">
            <h3 className="text-lg font-bold mb-8 uppercase tracking-widest text-slate-400 text-[11px]">
              Outcome Parity Analysis
            </h3>
            <div className="space-y-8">
              {parity_details.map((detail, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm font-bold text-white/90">{detail.sensitive_column}</span>
                    <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black text-amber-500">
                      GAP: {(detail.parity_gap * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="space-y-4">
                    {detail.group_positive_rates && Object.entries(detail.group_positive_rates).map(([group, rate]) => (
                      <div key={group} className="flex items-center gap-4">
                        <div className="w-16 text-[10px] font-black text-slate-500 uppercase truncate text-right">
                          {group}
                        </div>
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{
                              width: `${rate * 100}%`,
                              background: detail.has_disparity ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : '#818cf8',
                            }}
                          />
                        </div>
                        <div className="w-10 text-[10px] font-mono text-slate-400">
                          {(rate * 100).toFixed(0)}%
                        </div>
                      </div>
                    ))}
                  </div>
                  {detail.has_disparity && (
                    <div className="mt-6 p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl text-[11px] font-medium text-amber-400/80 leading-relaxed">
                      AI Observation: Significant outcome disparity detected impacting accuracy for {detail.least_favored_group}.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Suggestions Section */}
      <div className="mb-12">
        <SuggestionList suggestions={suggestions} />
      </div>

      {/* Final AI Call to Action */}
      <div className="glass-card p-12 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <h3 className="text-2xl font-black mb-4 tracking-tight relative z-10">
          Refine with AI Guidance
        </h3>
        <p className="text-slate-400 text-sm mb-10 max-w-lg mx-auto leading-relaxed relative z-10">
          Need a technical mitigation plan? Start a specialized chat session to get
          source-code examples and data transformation advice.
        </p>
        <Link to="/chat" className="btn-primary no-underline scale-110 relative z-10">
          💬 Consult FAIRCHAT Assistant
        </Link>
      </div>
    </div>
  )
}
