export default function AdminBar({ unlocked, onSecretTap, onTogglePanel, onExit }) {
  if (!unlocked) {
    return (
      <button
        type="button"
        onClick={onSecretTap}
        className="fixed top-2 right-3 z-50 rounded-full px-2 py-1 text-[10px] font-mono uppercase tracking-[0.35em] text-white/5 transition hover:text-white/20 focus:text-white/20"
        aria-label="Hidden admin access trigger"
      >
        Admin Mode
      </button>
    )
  }

  return (
    <div className="glass-dark border-b border-amber-500/20 px-4 py-2 text-amber-300/80 text-fluid-xs flex justify-between items-center">
      <span className="flex items-center gap-2">
        <span className="animate-pulse-slow">Admin</span>
        <span>Admin Mode</span>
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onTogglePanel}
          className="hover:bg-amber-500/15 px-3 py-1.5 rounded-lg transition-colors text-amber-300 touch-target"
        >
          Toggle Stats
        </button>
        <button
          type="button"
          onClick={onExit}
          className="hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors text-amber-200/80 touch-target"
        >
          Exit
        </button>
      </div>
    </div>
  )
}
