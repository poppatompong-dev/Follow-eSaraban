import RadioCard from './RadioCard'
import { Q1_OPTS, Q2_OPTS } from '../../lib/constants'

// Section 2 — Adoption & Frequency
export default function Section2({ formData, setField, onBack, onNext }) {
  return (
    <div className="glass-card p-5 md:p-7 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0">
          2
        </div>
        <h2 className="text-fluid-lg font-semibold text-white">การใช้งานจริง</h2>
        <span className="ml-auto text-xl">🎯</span>
      </div>

      {/* Q1 */}
      <div className="mb-6">
        <p className="text-fluid-sm font-semibold text-teal-200 mb-3">
          1. ปัจจุบันท่านใช้ระบบสารบรรณอิเล็กทรอนิกส์หรือไม่?{' '}
          <span className="text-red-400">*</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Q1_OPTS.map((opt, i) => (
            <RadioCard
              key={opt}
              id={`q1-${i}`}
              name="q1"
              value={opt}
              label={opt}
              checked={formData.q1_adoption === opt}
              onChange={() => setField('q1_adoption', opt)}
            />
          ))}
        </div>
      </div>

      {/* Q2 */}
      <div className="mb-6">
        <p className="text-fluid-sm font-semibold text-teal-200 mb-3">
          2. ท่านใช้ระบบบ่อยแค่ไหน?{' '}
          <span className="text-red-400">*</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Q2_OPTS.map((opt, i) => (
            <RadioCard
              key={opt}
              id={`q2-${i}`}
              name="q2"
              value={opt}
              label={opt}
              checked={formData.q2_frequency === opt}
              onChange={() => setField('q2_frequency', opt)}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3.5 rounded-2xl border border-teal-400/30 text-teal-300 font-semibold text-fluid-sm hover:bg-teal-500/10 transition-all duration-200 touch-target"
        >
          ← ย้อนกลับ
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-semibold text-fluid-sm transition-all duration-200 shadow-lg hover:-translate-y-0.5 active:translate-y-0 touch-target"
        >
          ถัดไป →
        </button>
      </div>
    </div>
  )
}
