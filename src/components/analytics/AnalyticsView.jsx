import { useState } from 'react'
import {
  Chart as ChartJS,
  ArcElement, BarElement, CategoryScale, LinearScale,
  Tooltip, Legend,
} from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'
import StatHeader    from './StatHeader'
import AdminPanel    from './AdminPanel'
import AdminRecordsTable from './AdminRecordsTable'
import ChartCard     from './ChartCard'
import InsightCard   from './InsightCard'
import FeedbackList  from './FeedbackList'
import ExportSection from './ExportSection'
import { useToast }  from '../../context/ToastContext'
import { Q1_OPTS, Q2_OPTS, DEPARTMENTS } from '../../lib/constants'
import { SHEET_ENDPOINT } from '../../lib/api'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const LABEL_COLOR  = 'rgba(204,251,241,0.70)'
const GRID_COLOR   = 'rgba(255,255,255,0.05)'
const TEAL_PALETTE = ['#14b8a6','#0d9488','#0f766e','#134e4a','#10b981','#f59e0b','#6366f1','#ec4899']

const baseScales = {
  x: { ticks: { color: LABEL_COLOR, font: { size: 10 } }, grid: { color: GRID_COLOR } },
  y: { beginAtZero: true, ticks: { color: LABEL_COLOR, stepSize: 1 }, grid: { color: GRID_COLOR } },
}

function buildFreqData(responses, field, opts) {
  const map = {}
  opts.forEach(o => { map[o] = 0 })
  responses.forEach(r => { if (Object.prototype.hasOwnProperty.call(map, r[field])) map[r[field]]++ })
  return map
}

export default function AnalyticsView({ responses, adminVisible, refetch }) {
  const showToast = useToast()
  const [clearing, setClearing] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const total = responses.length

  const adoptionData = buildFreqData(responses, 'q1_adoption', Q1_OPTS)
  const freqData     = buildFreqData(responses, 'q2_frequency', Q2_OPTS)
  const deptData     = buildFreqData(responses, 'department', DEPARTMENTS)

  const uxAverages = total > 0
    ? ['q3_ease','q4_speed','q5_vs_paper','q9_overall'].map(k =>
        +(responses.reduce((s, r) => s + (Number(r[k]) || 0), 0) / total).toFixed(1)
      )
    : [0, 0, 0, 0]

  // ── Clear all test data ──────────────────────────────────────
  async function handleClear() {
    if (responses.length === 0) { showToast('ไม่มีข้อมูลให้ลบ', 'info'); return }
    const pwd = prompt(`⚠️ ลบล้างข้อมูลทั้งหมด ${responses.length} รายการ\nการกระทำนี้ไม่สามารถยกเลิกได้!\n\nกรุณาใส่รหัสผ่านเพื่อยืนยัน:`)
    if (pwd === null) return // User cancelled
    if (pwd !== 'admin123') {
      showToast('รหัสผ่านไม่ถูกต้อง', 'error')
      return
    }

    if (!SHEET_ENDPOINT || SHEET_ENDPOINT === 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE') {
      showToast('Demo mode — ไม่มี endpoint', 'info'); return
    }

    setClearing(true)
    try {
      let deleted = 0
      for (const rec of responses) {
        const res  = await fetch(SHEET_ENDPOINT, {
          method: 'POST',
          body: JSON.stringify({ action: 'delete', id: rec.id }),
        })
        const json = await res.json()
        if (json.ok) deleted++
      }
      showToast(`ลบข้อมูล ${deleted} รายการเรียบร้อย!`, 'success')
      refetch?.()
    } catch {
      showToast('เกิดข้อผิดพลาดในการลบ', 'error')
    } finally {
      setClearing(false)
    }
  }

  async function handleDeleteRecord(record) {
    if (!record?.id) {
      showToast('Record id is missing', 'error')
      return
    }

    const confirmed = confirm(
      `Delete this survey row?\n\nDepartment: ${record.department || '-'}\nRole: ${record.role || '-'}`
    )
    if (!confirmed) return

    if (!SHEET_ENDPOINT || SHEET_ENDPOINT === 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE') {
      showToast('Demo mode — no endpoint configured', 'info')
      return
    }

    setDeletingId(record.id)
    try {
      const res = await fetch(SHEET_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({ action: 'delete', id: record.id }),
      })
      const json = await res.json()

      if (!json.ok) {
        throw new Error(json.error || 'Delete failed')
      }

      showToast('Row deleted successfully', 'success')
      await refetch?.()
    } catch (error) {
      showToast(error.message || 'Failed to delete row', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  const legendOpts = {
    labels: { color: LABEL_COLOR, font: { family: 'IBM Plex Sans Thai', size: 11 } },
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">

      <AdminPanel visible={adminVisible} responses={responses} onClear={handleClear} />
      <AdminRecordsTable
        visible={adminVisible}
        responses={responses}
        deletingId={deletingId}
        onDelete={handleDeleteRecord}
      />

      {/* ── Dashboard Header ──────────────────────────────────── */}
      <header className="text-center mb-10 animate-fade-in">
        {/* Decorative line above title */}
        <div className="flex items-center gap-4 justify-center mb-5">
          <div className="h-px flex-1 max-w-16 bg-gradient-to-r from-transparent to-teal-400/40" />
          <span className="text-teal-400/60 text-fluid-xs font-mono tracking-widest uppercase">Analytics</span>
          <div className="h-px flex-1 max-w-16 bg-gradient-to-l from-transparent to-teal-400/40" />
        </div>

        <h1 className="text-fluid-3xl font-bold text-white mb-2">
          📊 <span className="text-shimmer">Dashboard</span> การวิเคราะห์
        </h1>
        <p className="text-teal-200/60 text-fluid-sm">ผลวิเคราะห์ความคืบหน้าการใช้งาน EDMS</p>
        <p className="text-teal-200/30 text-fluid-xs mt-1 font-mono">
          อัปเดต: {new Date().toLocaleString('th-TH')}
        </p>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
          {/* Refresh */}
          <button
            onClick={() => { refetch?.(); showToast('รีเฟรชข้อมูลแล้ว', 'info') }}
            className="flex items-center gap-2 px-5 py-2.5 glass rounded-xl text-fluid-sm text-teal-200 hover:bg-white/10 transition-all duration-200 touch-target"
          >
            🔄 รีเฟรช
          </button>
        </div>
      </header>

      {/* KPI Stats */}
      <StatHeader responses={responses} />

      {/* Charts — 1→2 col */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <ChartCard title="📈 สถานะการใช้งาน">
          <Doughnut
            data={{
              labels: Object.keys(adoptionData),
              datasets: [{ data: Object.values(adoptionData), backgroundColor: TEAL_PALETTE, borderColor: 'rgba(255,255,255,0.04)', borderWidth: 1 }],
            }}
            options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { ...legendOpts, position: 'bottom' } } }}
          />
        </ChartCard>

        <ChartCard title="⏱️ ความถี่ในการใช้">
          <Bar
            data={{
              labels: Object.keys(freqData),
              datasets: [{ label: 'จำนวน', data: Object.values(freqData), backgroundColor: 'rgba(20,184,166,0.75)', borderRadius: 6, borderSkipped: false }],
            }}
            options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: baseScales }}
          />
        </ChartCard>

        <ChartCard title="⭐ คะแนน UX">
          <Bar
            data={{
              labels: ['ความง่าย','ความเร็ว','เทียบกระดาษ','ความพึงพอใจ'],
              datasets: [{ label: 'เฉลี่ย', data: uxAverages, backgroundColor: TEAL_PALETTE, borderRadius: 6, borderSkipped: false }],
            }}
            options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { ...baseScales, y: { ...baseScales.y, max: 5 } } }}
          />
        </ChartCard>

        <ChartCard title="🏢 ตามกอง/ฝ่าย">
          <Bar
            data={{
              labels: Object.keys(deptData),
              datasets: [{ label: 'จำนวน', data: Object.values(deptData), backgroundColor: 'rgba(13,148,136,0.75)', borderRadius: 6, borderSkipped: false }],
            }}
            options={{
              responsive: true, maintainAspectRatio: false, indexAxis: 'y',
              plugins: { legend: { display: false } },
              scales: {
                x: { ...baseScales.x, ticks: { ...baseScales.x.ticks, stepSize: 1 } },
                y: { ticks: { color: LABEL_COLOR, font: { size: 9 } }, grid: { color: GRID_COLOR } },
              },
            }}
          />
        </ChartCard>
      </div>

      {/* Insight cards — 1→2 col */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <InsightCard title="⚠️ ปัญหาหลัก"           responses={responses} field="q6_pain"     emptyText="ยังไม่มีปัญหา" />
        <InsightCard title="🔧 ปัญหาเทคนิค"         responses={responses} field="q7_technical" emptyText="ไม่พบปัญหา" />
        <InsightCard title="💡 ความต้องการสนับสนุน" responses={responses} field="q8_support"   emptyText="ไม่มีความต้องการ" />
        <div className="glass-insight p-5 md:p-6 lg:col-span-2">
          <h3 className="text-fluid-base font-semibold text-teal-100 mb-4">💬 ข้อเสนอแนะเพิ่มเติม</h3>
          <FeedbackList responses={responses} />
        </div>
        <div className="glass-insight p-5 md:p-6 lg:col-span-2">
          <h3 className="text-fluid-base font-semibold text-teal-100 mb-4">🎯 ข้อเสนอแนะจากระบบ</h3>
          <Recommendations responses={responses} />
        </div>
      </div>

      <ExportSection responses={responses} />

      <footer className="text-center mt-12 text-teal-200/20 text-fluid-xs pb-6 font-mono tracking-wider">
        EDMS Analytics · Powered by Google Sheets · {new Date().getFullYear()}
      </footer>
    </div>
  )
}

function Recommendations({ responses }) {
  const total     = responses.length
  const adoptRate = total > 0 ? (responses.filter(r => r.q1_adoption === 'ใช้งานเป็นประจำ').length / total * 100) : 0
  const avgSat    = total > 0 ? (responses.reduce((s, r) => s + (Number(r.q9_overall) || 0), 0) / total) : 0

  const recs = []
  if (total === 0)               recs.push({ icon: '📊', text: 'ยังไม่มีข้อมูล รอการตอบแบบสอบถาม' })
  else if (adoptRate < 50)      recs.push({ icon: '🎯', text: 'ต้องเพิ่มการส่งเสริม Adoption' })
  if (avgSat > 0 && avgSat < 3) recs.push({ icon: '⚠️', text: 'ความพึงพอใจต่ำ ต้องปรับปรุง UX' })
  if (total > 0 && total < 20)  recs.push({ icon: '📊', text: 'ยังต้องรวบรวมข้อมูลเพิ่มเติม' })
  if (adoptRate > 70 && avgSat > 3.5) recs.push({ icon: '🎉', text: 'ความคืบหน้าดี ต่อไปสนับสนุนระดับสูง' })
  if (recs.length === 0)         recs.push({ icon: '✅', text: 'ดำเนินการตามแผนได้สำเร็จ' })

  return (
    <ul className="space-y-3">
      {recs.map((r, i) => (
        <li key={i} className="flex items-start gap-2 text-fluid-sm text-white/80">
          <span className="flex-shrink-0">{r.icon}</span>
          <span>{r.text}</span>
        </li>
      ))}
    </ul>
  )
}
