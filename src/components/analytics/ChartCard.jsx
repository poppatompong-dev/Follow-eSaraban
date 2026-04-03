// Glassmorphism chart wrapper — limits to 3-5 glass layers per view per skill spec
export default function ChartCard({ title, children }) {
  return (
    <div className="glass-card p-5 md:p-6">
      <h3 className="text-fluid-base font-semibold text-teal-100 mb-4 flex items-center gap-2">
        {title}
      </h3>
      {/* Fixed height container for Chart.js */}
      <div style={{ position: 'relative', height: '260px' }}>
        {children}
      </div>
    </div>
  )
}
