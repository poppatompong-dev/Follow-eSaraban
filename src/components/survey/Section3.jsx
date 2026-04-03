import StarRating from './StarRating'
import CheckCard from './CheckCard'
import { Q6_OPTS, Q7_OPTS } from '../../lib/constants'

// Section 3 — UX ratings & Pain points
export default function Section3({ formData, setField, toggleCheckbox, onBack, onNext }) {
  return (
    <div className="glass-card p-5 md:p-7 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0">
          3
        </div>
        <h2 className="text-fluid-lg font-semibold text-white">ประสบการณ์ & ปัญหา</h2>
        <span className="ml-auto text-xl">⭐</span>
      </div>

      {/* Q3 */}
      <div className="mb-6">
        <p className="text-fluid-sm font-semibold text-teal-200 mb-1">3. ระบบใช้งานง่ายแค่ไหน?</p>
        <p className="text-fluid-xs text-teal-300/50 mb-3">1 = ยากมาก, 5 = ง่ายมาก</p>
        <StarRating value={formData.q3_ease} onChange={v => setField('q3_ease', v)} />
      </div>

      {/* Q4 */}
      <div className="mb-6">
        <p className="text-fluid-sm font-semibold text-teal-200 mb-1">4. ความรวดเร็วในการรับ-ส่งเอกสาร</p>
        <p className="text-fluid-xs text-teal-300/50 mb-3">1 = ช้ามาก, 5 = เร็วมาก</p>
        <StarRating value={formData.q4_speed} onChange={v => setField('q4_speed', v)} />
      </div>

      {/* Q5 */}
      <div className="mb-6">
        <p className="text-fluid-sm font-semibold text-teal-200 mb-1">5. เทียบกับระบบกระดาษเดิม ดีขึ้นแค่ไหน?</p>
        <p className="text-fluid-xs text-teal-300/50 mb-3">1 = แย่กว่า, 5 = ดีกว่ามาก</p>
        <StarRating value={formData.q5_vs_paper} onChange={v => setField('q5_vs_paper', v)} />
      </div>

      {/* Q6 — Pain points */}
      <div className="mb-6">
        <p className="text-fluid-sm font-semibold text-teal-200 mb-3">
          6. ปัญหาที่พบ <span className="font-normal text-teal-300/60">(เลือกได้มากกว่า 1)</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Q6_OPTS.map((opt, i) => (
            <CheckCard
              key={opt}
              id={`q6-${i}`}
              value={opt}
              label={opt}
              checked={formData.q6_pain.includes(opt)}
              onChange={() => toggleCheckbox('q6_pain', opt)}
            />
          ))}
        </div>
      </div>

      {/* Q7 — Technical issues */}
      <div className="mb-6">
        <p className="text-fluid-sm font-semibold text-teal-200 mb-3">
          7. ปัญหาทางเทคนิค <span className="font-normal text-teal-300/60">(เลือกได้มากกว่า 1)</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Q7_OPTS.map((opt, i) => (
            <CheckCard
              key={opt}
              id={`q7-${i}`}
              value={opt}
              label={opt}
              checked={formData.q7_technical.includes(opt)}
              onChange={() => toggleCheckbox('q7_technical', opt)}
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
          className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-semibold text-fluid-sm transition-all duration-200 shadow-lg hover:-translate-y-0.5 touch-target"
        >
          ถัดไป →
        </button>
      </div>
    </div>
  )
}
