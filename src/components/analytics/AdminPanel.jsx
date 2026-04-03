// Admin panel — dashed amber section, shown when toggled
export default function AdminPanel({ visible, responses, onClear }) {
  if (!visible) return null

  const total      = responses.length
  const adoptCount = responses.filter(r => r.q1_adoption === 'ใช้งานเป็นประจำ').length
  const adoptRate  = total > 0 ? Math.round((adoptCount / total) * 100) : 0
  const avgSat     = total > 0
    ? (responses.reduce((s, r) => s + (r.q9_overall || 0), 0) / total).toFixed(1)
    : 0

  return (
    <div className="rounded-2xl border-2 border-dashed border-amber-500/30 bg-amber-500/5 backdrop-blur-glass p-5 mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-amber-300 flex items-center gap-2">
          🔧 Admin Tools
        </h3>
        <button
          onClick={onClear}
          className="px-3 py-1.5 bg-red-500/80 hover:bg-red-500 text-white text-fluid-xs rounded-lg transition-colors touch-target"
        >
          🗑️ ล้างข้อมูล
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3 text-fluid-xs text-amber-200/80">
        {[
          { label: 'Total Responses', value: total },
          { label: 'Adoption Rate',   value: adoptRate + '%' },
          { label: 'Avg Satisfaction',value: avgSat },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white/5 rounded-xl p-3 text-center">
            <div className="font-bold text-fluid-xl text-amber-300">{value}</div>
            <div className="mt-1">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
