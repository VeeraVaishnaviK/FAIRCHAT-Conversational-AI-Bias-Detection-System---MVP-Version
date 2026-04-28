export default function BiasCard({ icon, label, value, description, colorClass }) {
  const colorMap = {
    primary: { accent: '#818cf8', bg: 'rgba(99, 102, 241, 0.05)' },
    success: { accent: '#10b981', bg: 'rgba(16, 185, 129, 0.05)' },
    warning: { accent: '#f59e0b', bg: 'rgba(245, 158, 11, 0.05)' },
    danger: { accent: '#f43f5e', bg: 'rgba(244, 63, 94, 0.05)' },
    accent: { accent: '#22d3ee', bg: 'rgba(6, 182, 212, 0.05)' },
  }

  const colors = colorMap[colorClass] || colorMap.primary

  return (
    <div className="glass-card p-6 border-white/5 hover:border-white/10 transition-all duration-500 group">
      <div className="flex items-center gap-4 mb-4">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-inner transition-transform group-hover:scale-110"
          style={{ background: colors.bg, border: `1px solid ${colors.accent}20` }}
        >
          {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          {label}
        </span>
      </div>

      <div className="space-y-1">
        <h4 className="text-2xl font-black tracking-tighter" style={{ color: colors.accent }}>
          {value}
        </h4>
        {description && (
          <p className="text-[11px] font-medium text-slate-500 leading-relaxed uppercase tracking-wider">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
