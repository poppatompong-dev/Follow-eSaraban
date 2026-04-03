// Admin bar — top strip shown in admin/preview mode
export default function AdminBar({ onTogglePanel }) {
  return (
    <div className="glass-dark border-b border-amber-500/20 px-4 py-2 text-amber-300/80 text-fluid-xs flex justify-between items-center">
      <span className="flex items-center gap-2">
        <span className="animate-pulse-slow">🔧</span>
        Admin Mode
      </span>
      <button
        onClick={onTogglePanel}
        className="hover:bg-amber-500/15 px-3 py-1.5 rounded-lg transition-colors text-amber-300 touch-target"
      >
        Toggle Stats
      </button>
    </div>
  )
}
