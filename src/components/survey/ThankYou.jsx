// Thank-you confirmation screen — upgraded design
export default function ThankYou({ onReset }) {
  return (
    <div className="glass-card p-8 md:p-14 text-center animate-fade-in relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div className="w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #14b8a6 0%, transparent 70%)' }}
        />
      </div>

      {/* Success icon with glow ring */}
      <div className="relative inline-flex mb-6">
        <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl scale-150" />
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 flex items-center justify-center text-5xl shadow-lg">
          ✅
        </div>
      </div>

      <h2 className="text-fluid-2xl font-bold text-white mb-3">
        ขอบคุณที่ร่วมตอบ!
      </h2>
      <p className="text-teal-200/60 text-fluid-sm mb-2">
        ข้อมูลของท่านถูกบันทึกลง Google Sheets แล้ว
      </p>
      <p className="text-teal-200/40 text-fluid-xs mb-8 font-mono">
        ข้อมูลจะถูกนำไปพัฒนาระบบต่อไป
      </p>

      {/* Divider */}
      <div className="flex items-center gap-4 justify-center mb-8">
        <div className="h-px flex-1 max-w-16 bg-teal-400/20" />
        <span className="text-teal-400/40 text-fluid-xs">✦</span>
        <div className="h-px flex-1 max-w-16 bg-teal-400/20" />
      </div>

      <button
        type="button"
        onClick={onReset}
        className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-semibold text-fluid-sm transition-all duration-200 shadow-lg shadow-teal-900/30 hover:-translate-y-0.5 active:translate-y-0 touch-target"
      >
        ตอบอีกครั้ง →
      </button>
    </div>
  )
}
