import RadioCard from './RadioCard'
import { DEPARTMENTS, ROLES } from '../../lib/constants'

// Section 1 — Department & Role
// Responsive grid: 1 col mobile → 2 col sm → 3 col md (departments)
export default function Section1({ formData, setField, onNext }) {
  return (
    <div className="glass-card p-5 md:p-7 animate-fade-in">
      {/* Section badge */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0">
          1
        </div>
        <h2 className="text-fluid-lg font-semibold text-white">ข้อมูลผู้ตอบ</h2>
        <span className="ml-auto text-xl">👤</span>
      </div>

      {/* Department */}
      <div className="mb-6">
        <label className="block text-fluid-sm font-semibold text-teal-200 mb-3">
          สังกัดกอง/ฝ่าย <span className="text-red-400">*</span>
        </label>
        {/* auto-fit grid — wraps naturally per responsive-design skill */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {DEPARTMENTS.map((d, i) => (
            <RadioCard
              key={d}
              id={`dept-${i}`}
              name="dept"
              value={d}
              label={d}
              checked={formData.department === d}
              onChange={() => setField('department', d)}
            />
          ))}
        </div>
      </div>

      {/* Role */}
      <div className="mb-6">
        <label className="block text-fluid-sm font-semibold text-teal-200 mb-3">
          ระดับตำแหน่ง <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ROLES.map((r, i) => (
            <RadioCard
              key={r}
              id={`role-${i}`}
              name="role"
              value={r}
              label={r}
              checked={formData.role === r}
              onChange={() => setField('role', r)}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-semibold text-fluid-sm transition-all duration-200 shadow-lg hover:shadow-teal-500/25 hover:-translate-y-0.5 active:translate-y-0 touch-target flex items-center justify-center gap-2"
      >
        ถัดไป →
      </button>
    </div>
  )
}
