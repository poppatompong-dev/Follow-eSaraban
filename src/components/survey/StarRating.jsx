// 1–5 star rating widget
// touch-target: min 44px buttons per responsive-design skill
export default function StarRating({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className={`
            touch-target flex items-center justify-center
            w-11 h-11 rounded-xl transition-all duration-150
            hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-teal-400/50
            ${i <= value ? 'text-amber-400' : 'text-white/20 hover:text-white/40'}
          `}
          aria-label={`${i} ดาว`}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </button>
      ))}
    </div>
  )
}
