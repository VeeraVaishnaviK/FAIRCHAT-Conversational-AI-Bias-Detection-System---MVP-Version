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
      <section className="relative pt-16 pb-24 sm:pt-24 sm:pb-32 px-4 overflow-hidden">
        <div className="container-tight text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold mb-10 animate-fade-in uppercase tracking-[0.1em]" style={{
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.15)',
            color: '#818cf8',
          }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Empowering Fairer AI
          </div>

          {/* Main Title */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-8 animate-slide-up tracking-tighter leading-[0.9]">
            <span className="gradient-text">FAIRCHAT</span>
          </h1>

          <p className="text-xl sm:text-2xl font-medium mb-4 animate-slide-up text-slate-300" style={{ animationDelay: '100ms' }}>
            Uncover Hidden Biases in Your Data
          </p>

          <p className="text-base sm:text-lg max-w-2xl mx-auto mb-14 animate-slide-up leading-relaxed text-slate-400" style={{ animationDelay: '200ms' }}>
            Our conversational engine scans your CSV datasets, identifies demographic disparities,
            and provides actionable AI insights to ensure your models are truly equitable.
          </p>

          {/* Upload Component */}
          <div className="animate-slide-up max-w-xl mx-auto" style={{ animationDelay: '300ms' }}>
            <div className="glass-card p-2 rounded-[28px]">
              <FileUpload onUploadSuccess={handleUploadComplete} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-slate-900/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Precision Analysis</h2>
            <p className="text-slate-400">Three simple steps to a more fair and ethical dataset.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat, i) => (
              <div
                key={i}
                className="glass-card p-10 group animate-slide-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl text-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-xl" style={{
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.1))',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}>
                  {feat.icon}
                </div>

                {/* Step number */}
                <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-indigo-400">
                  Step 0{i + 1}
                </div>

                <h3 className="text-xl font-bold mb-4">{feat.title}</h3>

                <p className="text-sm leading-relaxed text-slate-400">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 text-center">
        <div className="container-tight opacity-40">
          <div className="w-12 h-[1px] bg-white mx-auto mb-8" />
          <p className="text-xs font-medium tracking-widest uppercase">
            FAIRCHAT &copy; 2026 &mdash; Built for a Fairer Future
          </p>
        </div>
      </footer>
    </div>
  )
}
