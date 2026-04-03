// Thank-you confirmation screen
export default function ThankYou({ onReset }) {
  return (
    <div className="glass-card p-8 md:p-12 text-center animate-fade-in">
      {/* Success icon */}
      <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mx-auto mb-6 text-4xl">
        ✅
      </div>

      <h2 className="text-fluid-2xl font-bold text-white mb-3">
        ขอบคุณที่ร่วมตอบ!
      </h2>
      <p className="text-teal-200/70 text-fluid-sm mb-8">
        ข้อมูลของท่านจะถูกนำไปพัฒนาระบบต่อไป
      </p>

      <button
        type="button"
        onClick={onReset}
        className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-semibold text-fluid-sm transition-all duration-200 shadow-lg hover:-translate-y-0.5 touch-target"
      >
        ตอบอีกครั้ง →
      </button>
    </div>
  )
}
