import { useEffect, useState } from 'react'

export default function FairnessGauge({ score, size = 180 }) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 2000
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4) // Quartic ease-out for smoother feel
      const current = Math.round(eased * score)
      setAnimatedScore(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [score])

  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animatedScore / 100) * circumference

  const getColor = (s) => {
    if (s >= 75) return { stroke: '#10b981', glow: 'rgba(16, 185, 129, 0.4)', detail: '#059669', label: 'EXCELLENT' }
    if (s >= 50) return { stroke: '#6366f1', glow: 'rgba(99, 102, 241, 0.4)', detail: '#4f46e5', label: 'FAIR' }
    if (s >= 30) return { stroke: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)', detail: '#d97706', label: 'CONCERNING' }
    return { stroke: '#f43f5e', glow: 'rgba(244, 63, 94, 0.4)', detail: '#e11d48', label: 'CRITICAL' }
  }

  const colors = getColor(animatedScore)

  return (
    <div className="flex flex-col items-center">
      <div className="relative group" style={{ width: size, height: size }}>
        {/* Glow effect */}
        <div 
          className="absolute inset-0 rounded-full blur-[30px] opacity-20 transition-all duration-1000 group-hover:opacity-30" 
          style={{ background: colors.stroke }}
        />
        
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="relative z-10 transform -rotate-90"
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.03)"
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-300"
            style={{
              filter: `drop-shadow(0 0 6px ${colors.glow})`,
            }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center relative z-20">
          <div className="flex flex-col items-center">
             <span className="text-5xl font-black tracking-tighter leading-none" style={{ color: colors.stroke }}>
              {animatedScore}
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] mt-2 text-slate-500">
              Score
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center animate-fade-in">
        <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-2">
          <span className="text-[10px] font-black tracking-[0.2em]" style={{ color: colors.stroke }}>
            STATUS: {colors.label}
          </span>
        </div>
      </div>
    </div>
  )
}
