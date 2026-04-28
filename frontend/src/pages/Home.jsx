import { useNavigate } from 'react-router-dom'
import FileUpload from '../components/FileUpload'

export default function Home({ onUploadSuccess }) {
  const navigate = useNavigate()

  const handleUploadComplete = (result) => {
    onUploadSuccess(result)
    navigate('/dashboard')
  }

  const features = [
    {
      icon: '🔍',
      title: 'Detect Bias',
      description: 'Automatically scan datasets for group imbalances and demographic disparities.',
    },
    {
      icon: '📊',
      title: 'Analyze Fairness',
      description: 'Get a comprehensive fairness score with detailed breakdowns by feature.',
    },
    {
      icon: '💬',
      title: 'Chat with AI',
      description: 'Ask our AI assistant to explain results and suggest improvements in plain English.',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          {/* Main Title Area */}
          <div className="relative z-10 mb-16">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-10 animate-fade-in glass-card border-primary/20 text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              AI Bias Intelligence
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-8 animate-slide-up tracking-tighter leading-[0.9]">
              <span className="gradient-text">FAIRCHAT</span>
            </h1>

            <p className="text-xl sm:text-2xl font-medium text-slate-100 max-w-2xl mx-auto mb-8 animate-slide-up animation-delay-100">
              Unmask bias. Build trust. <span className="text-secondary opacity-60 font-light">Democratizing data fairness for everyone.</span>
            </p>

            <p className="text-lg text-secondary max-w-2xl mx-auto mb-12 animate-slide-up animation-delay-200 leading-relaxed">
              Upload your dataset to reveal hidden disparities and get actionable, AI-driven insights to make your machine learning models more equitable.
            </p>

            {/* Upload Area */}
            <div className="w-full max-w-lg mx-auto animate-slide-up animation-delay-300">
              <FileUpload onUploadSuccess={handleUploadComplete} />
              <p className="mt-6 text-xs text-muted">
                FastAPI + Gemini 2.0 Backend • Supports CSV up to 10MB
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Flow Section */}
      <section className="py-24 px-4 bg-white/[0.01] border-y border-white/5 relative z-10">
        <div className="container-neat">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
            <h2 className="text-3xl font-black tracking-tight">The Analysis <span className="text-primary">Pipeline</span></h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-primary/20 to-transparent hidden md:block mx-8" />
            <p className="text-secondary max-w-xs text-right hidden lg:block">Our proprietary heuristic engine scans for demographic parity and outcome variance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat, i) => (
              <div
                key={i}
                className="glass-card group p-8 lg:p-10 flex flex-col items-center text-center animate-slide-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                {/* Icon Container */}
                <div className="w-20 h-20 rounded-3xl mb-8 flex items-center justify-center text-3xl transition-all duration-500 group-hover:rotate-[360deg] group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(6, 182, 212, 0.08))',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}>
                  {feat.icon}
                </div>

                <div className="mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Stage 0{i + 1}</span>
                </div>

                <h3 className="text-xl font-bold mb-4">{feat.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 text-center">
        <div className="container-neat">
          <div className="flex flex-col items-center gap-6">
            <div className="text-2xl font-black tracking-tighter opacity-20">FAIRCHAT</div>
            <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-muted">
              <span>Platform</span>
              <span>Methodology</span>
              <span>Privacy</span>
            </div>
            <p className="text-[10px] text-muted uppercase tracking-widest mt-4">
              © 2026 FAIRCHAT AI • Advanced Bias Intelligence Platform 
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
