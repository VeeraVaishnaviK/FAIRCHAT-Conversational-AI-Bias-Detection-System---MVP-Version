export default function SuggestionList({ suggestions }) {
  if (!suggestions || suggestions.length === 0) return null

  return (
    <div className="animate-slide-up">
      <div className="flex items-center gap-3 mb-8">
         <span className="w-8 h-[1px] bg-indigo-500/30" />
         <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
           Mitigation Strategies
         </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="group glass-card p-6 border-white/5 hover:border-indigo-500/20 transition-all duration-500"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <div className="flex items-start gap-4">
              <div className="mt-1 w-2 h-2 rounded-full bg-indigo-500/40 group-hover:bg-indigo-500 transition-colors" />
              <div className="flex-1">
                <p className="text-[13px] leading-relaxed text-slate-300 font-medium">
                  {formatSuggestion(suggestion)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function formatSuggestion(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g)

  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return (
        <span key={i} className="text-white font-bold tracking-tight">
          {part}
        </span>
      )
    }
    return part
  })
}
