// Intro landing page — shown before the survey starts
// Gives users full context before clicking "เริ่มทำแบบสอบถาม"
export default function Intro({ responseCount, onStart }) {
  const sections = [
    { icon: '👤', title: 'ข้อมูลผู้ตอบ',      desc: 'กอง/ฝ่าย และประเภทบุคลากร' },
    { icon: '🎯', title: 'การใช้งานจริง',      desc: 'สถานะและความถี่การใช้ระบบ' },
    { icon: '⭐', title: 'ประสบการณ์ & ปัญหา', desc: 'คะแนน UX และปัญหาที่พบ' },
    { icon: '💡', title: 'ข้อเสนอแนะ & สรุป', desc: 'ความต้องการและความพึงพอใจ' },
  ]

  const highlights = [
    { icon: '⏱️', text: 'ใช้เวลาไม่เกิน 3 นาที' },
    { icon: '🔒', text: 'ข้อมูลเป็นความลับ' },
    { icon: '📊', text: 'เพื่อพัฒนาระบบ EDMS' },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 md:py-12 animate-fade-in">

      {/* Hero card */}
      <div className="glass-card p-6 md:p-10 mb-5 relative overflow-hidden">
        {/* Background glow accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-500 rounded-t-[20px]" />

        {/* Org badge */}
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex items-center gap-2 glass px-4 py-2">
            <span className="animate-pulse-slow">🏛️</span>
            <span className="text-teal-200 text-fluid-sm font-medium">เทศบาลเมืองอุทัยธานี</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="flex items-center gap-3 justify-center mb-3">
            <div className="h-px flex-1 max-w-10 bg-gradient-to-r from-transparent to-teal-400/40" />
            <span className="text-teal-400/60 text-fluid-xs font-mono tracking-widest uppercase">EDMS Survey 2569</span>
            <div className="h-px flex-1 max-w-10 bg-gradient-to-l from-transparent to-teal-400/40" />
          </div>
          <h1 className="text-fluid-2xl font-bold text-white leading-snug mb-3">
            แบบสำรวจความคืบหน้า<br />
            <span className="text-shimmer">ระบบสารบรรณอิเล็กทรอนิกส์</span>
          </h1>
          <p className="text-teal-200/60 text-fluid-sm leading-relaxed">
            แบบสำรวจนี้จัดทำขึ้นเพื่อ<strong className="text-teal-200/90">ติดตามความก้าวหน้า</strong>การใช้งาน
            ระบบสารบรรณอิเล็กทรอนิกส์ (eSaraban) และนำข้อมูลไปใช้ใน
            <strong className="text-teal-200/90">ปรับปรุงระบบ</strong>ให้ตอบสนองความต้องการของบุคลากรได้ดียิ่งขึ้น
          </p>
        </div>

        {/* Highlights row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {highlights.map(({ icon, text }) => (
            <div key={text} className="glass-stat py-3 px-2 text-center">
              <div className="text-xl mb-1">{icon}</div>
              <p className="text-fluid-xs text-teal-200/70">{text}</p>
            </div>
          ))}
        </div>

        {/* Section breakdown */}
        <div className="mb-8">
          <p className="text-fluid-xs text-teal-300/60 font-mono uppercase tracking-wider mb-3 text-center">
            แบบสอบถามประกอบด้วย 4 ส่วน
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sections.map(({ icon, title, desc }, i) => (
              <div key={title}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/8 bg-white/4 hover:bg-white/7 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500/40 to-teal-700/40 flex items-center justify-center flex-shrink-0 text-sm">
                  {icon}
                </div>
                <div>
                  <div className="text-fluid-sm font-semibold text-white/90">
                    <span className="text-teal-400/70 font-mono mr-1">{i + 1}.</span>{title}
                  </div>
                  <div className="text-fluid-xs text-teal-200/50">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notice box */}
        <div className="rounded-2xl border border-amber-400/20 bg-amber-500/8 px-4 py-3 mb-8 flex gap-3">
          <span className="text-amber-400 flex-shrink-0 mt-0.5">📌</span>
          <p className="text-fluid-xs text-amber-200/80 leading-relaxed">
            ขอความร่วมมือบุคลากร<strong className="text-amber-200">ทุกท่าน</strong>ตอบแบบสอบถามตามความเป็นจริง
            ข้อมูลที่ได้จะถูกเก็บเป็นความลับ และ<strong className="text-amber-200">ไม่ระบุตัวตน</strong>ผู้ตอบ
            ใช้เพื่อการพัฒนาระบบเท่านั้น
          </p>
        </div>

        {/* Start button */}
        <button
          onClick={onStart}
          className="w-full py-4 rounded-2xl font-bold text-fluid-lg text-white transition-all duration-200 touch-target flex items-center justify-center gap-3 group relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0d9488 0%, #10b981 50%, #14b8a6 100%)',
            boxShadow: '0 4px 24px rgba(13,148,136,0.4)',
          }}
        >
          <span className="relative z-10">เริ่มทำแบบสอบถาม</span>
          <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-200">→</span>
          {/* Hover shimmer overlay */}
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/8 transition-colors duration-200" />
        </button>
      </div>

      {/* Response count footer */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 glass px-4 py-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow" />
          <span className="text-teal-200/60 text-fluid-xs font-mono">
            ผู้ตอบแล้ว: <strong className="text-teal-300">{responseCount}</strong> คน
          </span>
        </div>
      </div>

      <footer className="text-center mt-8 text-teal-200/20 text-fluid-xs pb-4 font-mono tracking-wider">
        EDMS · เทศบาลเมืองอุทัยธานี · 2569
      </footer>
    </div>
  )
}
