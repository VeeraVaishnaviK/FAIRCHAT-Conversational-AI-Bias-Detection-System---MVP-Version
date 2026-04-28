export default function SuggestionList({ suggestions }) {
  if (!suggestions || suggestions.length === 0) return null

  return (
    <div className="glass-card p-6 animate-slide-up">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#f1f5f9' }}>
        <span className="text-xl">💡</span>
        Recommendations
      </h3>

      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="p-4 rounded-xl transition-all duration-200"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              animationDelay: `${index * 100}ms`,
            }}
          >
            <p className="text-sm leading-relaxed" style={{ color: '#cbd5e1' }}>
              {formatSuggestion(suggestion)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Formats suggestion text: renders markdown bold as HTML
 */
function formatSuggestion(text) {
  // Split by **bold** markers
  const parts = text.split(/\*\*(.*?)\*\*/g)

  return parts.map((part, i) => {
    // Odd indices are the bold content
    if (i % 2 === 1) {
      return (
        <strong key={i} style={{ color: '#e2e8f0', fontWeight: 600 }}>
          {part}
        </strong>
      )
    }
    return part
  })
}
