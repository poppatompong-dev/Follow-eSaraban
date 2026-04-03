import StarRating from './StarRating'
import CheckCard from './CheckCard'
import { Q8_OPTS } from '../../lib/constants'

// Section 4 — Support needs, overall satisfaction & submit
export default function Section4({ formData, setField, toggleCheckbox, onBack, onSubmit, isSubmitting }) {
  return (
    <div className="glass-card p-5 md:p-7 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0">
          4
        </div>
        <h2 className="text-fluid-lg font-semibold text-white">ข้อเสนอแนะ & สรุป</h2>
        <span className="ml-auto text-xl">💡</span>
      </div>

      {/* Q8 — Support needs */}
      <div className="mb-6">
        <p className="text-fluid-sm font-semibold text-teal-200 mb-3">
          8. สิ่งที่ต้องการให้สนับสนุน{' '}
          <span className="font-normal text-teal-300/60">(เลือกได้มากกว่า 1)</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Q8_OPTS.map((opt, i) => (
            <CheckCard
              key={opt}
              id={`q8-${i}`}
              value={opt}
              label={opt}
              checked={formData.q8_support.includes(opt)}
              onChange={() => toggleCheckbox('q8_support', opt)}
            />
          ))}
        </div>
      </div>

      {/* Q9 — Overall satisfaction */}
      <div className="mb-8">
        <p className="text-fluid-sm font-semibold text-teal-200 mb-1">9. ความพึงพอใจโดยรวมต่อระบบ</p>
        <p className="text-fluid-xs text-teal-300/50 mb-3">1 = ไม่พอใจ, 5 = พอใจมาก</p>
        <StarRating value={formData.q9_overall} onChange={v => setField('q9_overall', v)} />
      </div>

      {/* Q10 — Additional Feedback */}
      <div className="mb-8">
        <label className="block text-fluid-sm font-semibold text-teal-200 mb-3" htmlFor="feedback">
          10. ข้อเสนอแนะเพิ่มเติมเพื่อการพัฒนาระบบ
        </label>
        <textarea
          id="feedback"
          className="w-full bg-white/5 border border-teal-400/20 rounded-xl p-4 text-white text-fluid-sm focus:outline-none focus:border-teal-400/60 focus:ring-1 focus:ring-teal-400/60 transition-all placeholder:text-teal-200/30 resize-y min-h-[100px]"
          placeholder="พิมพ์ข้อเสนอแนะของท่านที่นี่..."
          value={formData.feedback}
          onChange={(e) => setField('feedback', e.target.value)}
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-white/10 mb-6" />

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
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-60 text-white font-semibold text-fluid-sm transition-all duration-200 shadow-lg hover:-translate-y-0.5 active:translate-y-0 touch-target flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              กำลังส่ง...
            </>
          ) : (
            <>📤 ส่งแบบสอบถาม</>
          )}
        </button>
      </div>
    </div>
  )
}
