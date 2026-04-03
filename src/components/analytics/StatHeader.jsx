// KPI stat header cards — 2 col mobile → 4 col md (responsive-design grid)
export default function StatHeader({ responses }) {
  const total = responses.length
  const adoptCount = responses.filter(r => r.q1_adoption === 'ใช้งานเป็นประจำ').length
  const adoptRate  = total > 0 ? Math.round((adoptCount / total) * 100) : 0
  const avgSat = total > 0
    ? (responses.reduce((s, r) => s + (r.q9_overall || 0), 0) / total).toFixed(1)
    : 0
  const avgUX = total > 0
    ? (responses.reduce((s, r) => s + ((r.q3_ease || 0) + (r.q4_speed || 0) + (r.q5_vs_paper || 0)) / 3, 0) / total).toFixed(1)
    : 0

  const stats = [
    { label: 'การตอบแบบฟอร์ม', value: total,           icon: '📝' },
    { label: 'Adoption Rate',   value: adoptRate + '%', icon: '📈' },
    { label: 'ความพึงพอใจ',     value: avgSat + '/5',   icon: '⭐' },
    { label: 'UX Score',        value: avgUX + '/5',    icon: '🎯' },
  ]

  return (
    /* auto-fit grid: 2 cols on xs, 4 on md */
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      {stats.map(({ label, value, icon }) => (
        <div key={label} className="glass-stat px-4 py-4 text-center">
          <div className="text-2xl mb-1">{icon}</div>
          <div className="text-fluid-2xl font-bold text-teal-300">{value}</div>
          <div className="text-fluid-xs text-teal-200/60 mt-1">{label}</div>
        </div>
      ))}
    </div>
  )
}
