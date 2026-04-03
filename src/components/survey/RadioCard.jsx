// Reusable glass radio selection card
// touch-target: min-h-[44px] per responsive-design skill
export default function RadioCard({ id, name, value, label, checked, onChange }) {
  return (
    <div className="relative">
      <input
        type="radio"
        id={id}
        name={name}
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
        {/* Dot indicator */}
        <span className={`
          w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all duration-200
          ${checked
            ? 'border-teal-400 bg-teal-400 shadow-[0_0_0_3px_rgba(20,184,166,0.25)]'
            : 'border-white/30 bg-transparent'
          }
        `} />
        {label}
      </label>
    </div>
  )
}
