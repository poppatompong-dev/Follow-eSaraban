// Survey header: org badge, title (from SDK config), progress bar
// Fluid typography applied via --text-* custom properties
export default function Header({ config, responseCount, currentSection, totalSections = 4 }) {
  const pct = Math.round(((currentSection - 1) / totalSections) * 100)

  return (
    <header className="text-center mb-8 animate-fade-in">
      {/* Org badge */}
      <div className="inline-flex items-center gap-2 glass px-4 py-2 mb-5">
        <span className="animate-pulse-slow text-base">📋</span>
        <span className="text-teal-200 text-fluid-sm font-medium">
          {config?.org_name || 'เทศบาลเมืองอุทัยธานี'}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-fluid-3xl font-bold text-white leading-snug mb-3 px-2">
        แบบสำรวจความคืบหน้า<br />
        <span className="bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
          {config?.survey_title
            ? config.survey_title.replace('แบบสำรวจความคืบหน้า', '').trim()
            : 'ระบบสารบรรณอิเล็กทรอนิกส์'}
        </span>
      </h1>

      <p className="text-teal-200/70 text-fluid-sm mb-4 px-4">
        {config?.intro_text || 'กรุณาตอบแบบสอบถามตามความเป็นจริง (ใช้เวลาไม่เกิน 3 นาที)'}
      </p>

      {/* Response count badge */}
      <div className="inline-flex gap-2 text-fluid-xs text-teal-200/50 font-mono glass px-3 py-1.5">
        <span>🚀 ระบบใหม่</span>
        <span>•</span>
        <span className="font-semibold text-teal-200">{responseCount} คน</span>
      </div>

      {/* Progress bar */}
      <div className="mt-6 px-1">
        <div className="flex justify-between text-fluid-xs text-teal-200/70 mb-1.5">
          <span>ส่วนที่ {currentSection} / {totalSections}</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="progress-fill h-full bg-gradient-to-r from-teal-400 to-emerald-300 rounded-full"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </header>
  )
}
