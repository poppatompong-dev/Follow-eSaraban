// Sticky tab navigation — mobile-first, glass-dark pill bar
export default function TabNav({ activeTab, onSwitch }) {
  const tabs = [
    { id: 'survey',    label: '📋 แบบสอบถาม' },
    { id: 'analytics', label: '📊 วิเคราะห์' },
  ]

  return (
    <div className="sticky top-0 z-40 glass-dark">
      <div className="max-w-4xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onSwitch(tab.id)}
            className={`
              touch-target px-5 py-2 rounded-xl text-fluid-sm font-semibold
              whitespace-nowrap transition-all duration-200
              ${activeTab === tab.id
                ? 'bg-teal-500/80 text-white shadow-lg shadow-teal-900/30'
                : 'text-teal-200/70 hover:bg-white/10 hover:text-teal-100'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
