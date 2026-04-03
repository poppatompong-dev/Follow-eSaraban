// Renders a ranked list of items from a pipe-separated response field
function parseFreqMap(responses, field) {
  const map = {}
  responses.forEach(r => {
    if (r[field]) {
      r[field].split('|').forEach(v => {
        if (v) map[v] = (map[v] || 0) + 1
      })
    }
  })
  return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5)
}

function InsightList({ entries, emptyText }) {
  if (entries.length === 0) {
    return <p className="text-fluid-xs text-teal-300/40">{emptyText}</p>
  }
  const max = entries[0]?.[1] || 1
  return (
    <ul className="space-y-2">
      {entries.map(([label, count]) => (
        <li key={label}>
          <div className="flex justify-between text-fluid-sm mb-1">
            <span className="text-white/80">{label}</span>
            <span className="font-bold text-teal-300">{count}</span>
          </div>
          {/* mini progress bar */}
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-400 to-emerald-300 rounded-full progress-fill"
              style={{ width: `${(count / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

export default function InsightCard({ title, responses, field, emptyText }) {
  const entries = parseFreqMap(responses, field)
  return (
    <div className="glass-insight p-5 md:p-6">
      <h3 className="text-fluid-base font-semibold text-teal-100 mb-4">{title}</h3>
      <InsightList entries={entries} emptyText={emptyText || 'ยังไม่มีข้อมูล'} />
    </div>
  )
}
