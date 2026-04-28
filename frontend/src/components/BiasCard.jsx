export default function BiasCard({ icon, label, value, description, colorClass }) {
  const colorMap = {
    primary: {
      bg: 'rgba(99, 102, 241, 0.1)',
      border: 'rgba(99, 102, 241, 0.2)',
      text: '#818cf8',
      iconBg: 'rgba(99, 102, 241, 0.15)',
    },
    success: {
      bg: 'rgba(16, 185, 129, 0.1)',
      border: 'rgba(16, 185, 129, 0.2)',
      text: '#34d399',
      iconBg: 'rgba(16, 185, 129, 0.15)',
    },
    warning: {
      bg: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.2)',
      text: '#fbbf24',
      iconBg: 'rgba(245, 158, 11, 0.15)',
    },
    danger: {
      bg: 'rgba(244, 63, 94, 0.1)',
      border: 'rgba(244, 63, 94, 0.2)',
      text: '#fb7185',
      iconBg: 'rgba(244, 63, 94, 0.15)',
    },
    accent: {
      bg: 'rgba(6, 182, 212, 0.1)',
      border: 'rgba(6, 182, 212, 0.2)',
      text: '#22d3ee',
      iconBg: 'rgba(6, 182, 212, 0.15)',
    },
  }

  const colors = colorMap[colorClass] || colorMap.primary

  return (
    <div
      className="glass-card p-5 animate-fade-in"
      style={{
        background: colors.bg,
        borderColor: colors.border,
      }}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-xl"
          style={{ background: colors.iconBg }}
        >
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{
            color: '#64748b',
          }}>
            {label}
          </p>
          <p className="text-xl font-bold" style={{ color: colors.text }}>
            {value}
          </p>
          {description && (
            <p className="text-xs mt-1 leading-relaxed" style={{ color: '#94a3b8' }}>
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
