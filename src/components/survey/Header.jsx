export default function Header({ config, responseCount, currentSection, totalSections = 4 }) {
  const pct = Math.round(((currentSection - 1) / totalSections) * 100)

  return (
    <header className="text-center mb-8 animate-fade-in">

      {/* Decorative top line */}
      <div className="flex items-center gap-3 justify-center mb-5">
        <div className="h-px flex-1 max-w-12 bg-gradient-to-r from-transparent to-teal-400/40" />
        <span className="text-teal-400/50 text-fluid-xs font-mono tracking-widest uppercase">EDMS Survey</span>
        <div className="h-px flex-1 max-w-12 bg-gradient-to-l from-transparent to-teal-400/40" />
      </div>

      {/* Org badge */}
      <div className="inline-flex items-center gap-2 glass px-4 py-2 mb-5">
        <span className="animate-pulse-slow">📋</span>
        <span className="text-teal-200 text-fluid-sm font-medium">
          {config?.org_name || 'เทศบาลเมืองอุทัยธานี'}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-fluid-3xl font-bold text-white leading-snug mb-3 px-2">
        แบบสำรวจความคืบหน้า<br />
        <span className="text-shimmer">
          {config?.survey_title
            ? config.survey_title.replace('แบบสำรวจความคืบหน้า', '').trim()
            : 'ระบบสารบรรณอิเล็กทรอนิกส์'}
        </span>
      </h1>

      <p className="text-teal-200/60 text-fluid-sm mb-5 px-4">
        {config?.intro_text || 'กรุณาตอบแบบสอบถามตามความเป็นจริง (ใช้เวลาไม่เกิน 3 นาที)'}
      </p>

      {/* Response count badge */}
      <div className="inline-flex gap-2 text-fluid-xs text-teal-200/50 font-mono glass px-4 py-2">
        <span>🚀 ระบบใหม่</span>
        <span className="text-teal-400/40">•</span>
        <span className="font-semibold text-teal-300">{responseCount} คน</span>
      </div>

      {/* Progress bar */}
      <div className="mt-6 px-1">
        <div className="flex justify-between text-fluid-xs text-teal-200/60 mb-2">
          <span>ส่วนที่ {currentSection} / {totalSections}</span>
          <span className="font-semibold text-teal-300">{pct}%</span>
        </div>
        <div className="h-1.5 bg-white/8 rounded-full overflow-hidden relative">
          {/* Track glow */}
          <div className="absolute inset-0 rounded-full bg-white/5" />
          <div
            className="progress-fill relative h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: 'linear-gradient(90deg, #14b8a6, #34d399, #10b981)',
              boxShadow: '0 0 8px rgba(20,184,166,0.6)',
            }}
          />
        </div>
      </div>
    </header>
  )
}
