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
      <section className="relative py-20 sm:py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 animate-fade-in"
            style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              color: '#818cf8',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#10b981' }} />
            AI-Powered Bias Detection
          </div>

          {/* Main Title */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 animate-slide-up tracking-tight"
          >
            <span className="gradient-text">FAIRCHAT</span>
          </h1>

          <p
            className="text-xl sm:text-2xl font-light mb-4 animate-slide-up"
            style={{ color: '#94a3b8', animationDelay: '100ms' }}
          >
            Conversational AI Bias Detection
          </p>

          <p
            className="text-base max-w-2xl mx-auto mb-12 animate-slide-up leading-relaxed"
            style={{ color: '#64748b', animationDelay: '200ms' }}
          >
            Upload your dataset, uncover hidden biases, and get AI-powered insights
            to make your data fairer — all through a simple conversation.
          </p>

          {/* Upload Component */}
          <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <FileUpload onUploadSuccess={handleUploadComplete} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12" style={{ color: '#e2e8f0' }}>
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <div
                key={i}
                className="glass-card p-7 text-center group animate-slide-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                {/* Icon */}
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl text-2xl mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(6, 182, 212, 0.12))',
                    border: '1px solid rgba(99, 102, 241, 0.15)',
                  }}
                >
                  {feat.icon}
                </div>

                {/* Step number */}
                <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{
                  color: '#6366f1',
                }}>
                  Step {i + 1}
                </div>

                <h3 className="text-lg font-bold mb-2" style={{ color: '#f1f5f9' }}>
                  {feat.title}
                </h3>

                <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center" style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.04)',
      }}>
        <p className="text-xs" style={{ color: '#475569' }}>
          FAIRCHAT — Making AI Fair, One Dataset at a Time ⚖️
        </p>
      </footer>
    </div>
  )
}
