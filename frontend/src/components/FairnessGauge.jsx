import { useEffect, useState } from 'react'

export default function FairnessGauge({ score, size = 180 }) {
  const [animatedScore, setAnimatedScore] = useState(0)

  // Animate the score on mount
  useEffect(() => {
    let start = 0
    const duration = 1500
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(eased * score)
      setAnimatedScore(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [score])

  // SVG circle calculations
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animatedScore / 100) * circumference

  // Color based on score
  const getColor = (s) => {
    if (s >= 70) return { stroke: '#10b981', glow: 'rgba(16, 185, 129, 0.3)', label: 'Good' }
    if (s >= 40) return { stroke: '#f59e0b', glow: 'rgba(245, 158, 11, 0.3)', label: 'Fair' }
    return { stroke: '#f43f5e', glow: 'rgba(244, 63, 94, 0.3)', label: 'Poor' }
  }

  const colors = getColor(animatedScore)

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.06)"
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
            style={{
              transition: 'stroke-dashoffset 0.1s ease-out',
              filter: `drop-shadow(0 0 8px ${colors.glow})`,
            }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold" style={{ color: colors.stroke }}>
            {animatedScore}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider" style={{
            color: '#64748b',
          }}>
            / 100
          </span>
        </div>
      </div>

      {/* Label */}
      <div className="text-center">
        <span className="text-sm font-semibold" style={{ color: colors.stroke }}>
          {colors.label}
        </span>
        <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
          Fairness Score
        </p>
      </div>
    </div>
  )
}
