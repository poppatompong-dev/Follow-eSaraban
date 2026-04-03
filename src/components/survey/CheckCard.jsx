// Reusable glass checkbox card
// touch-target: min-h-[44px] per responsive-design skill
export default function CheckCard({ id, value, label, checked, onChange }) {
  return (
    <div className="relative">
      <input
        type="checkbox"
        id={id}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <label
        htmlFor={id}
        className={`
          flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer
          border transition-all duration-200 text-fluid-sm font-medium
          touch-target
          text-white/80
          border-white/10 bg-white/5
          peer-checked:bg-teal-500/15 peer-checked:border-teal-400/50 peer-checked:text-white
          hover:bg-white/10 hover:border-white/20
        `}
      >
        {/* Checkbox indicator */}
        <span className={`
          w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center
          transition-all duration-200
          ${checked
            ? 'border-teal-400 bg-teal-500'
            : 'border-white/30 bg-transparent'
          }
        `}>
          {checked && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </span>
        {label}
      </label>
    </div>
  )
}
