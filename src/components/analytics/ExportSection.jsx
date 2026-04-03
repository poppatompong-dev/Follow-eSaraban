import { useToast } from '../../context/ToastContext'

export default function ExportSection({ responses }) {
  const showToast = useToast()

  function exportCSV() {
    if (responses.length === 0) {
      showToast('ไม่มีข้อมูลให้ส่งออก', 'warning')
      return
    }

    const header = ['Department','Role','Q1-Adoption','Q2-Frequency','Q3-Ease','Q4-Speed','Q5-vs-Paper','Q6-Pain','Q7-Technical','Q8-Support','Q9-Overall','Feedback','Submitted']
    const rows = responses.map(r => [
      r.department, r.role, r.q1_adoption, r.q2_frequency,
      r.q3_ease, r.q4_speed, r.q5_vs_paper,
      r.q6_pain, r.q7_technical, r.q8_support,
      r.q9_overall, r.feedback, r.submitted_at,
    ])

    const csv = [header, ...rows]
      .map(row => row.map(cell => `"${cell ?? ''}"`).join(','))
      .join('\n')

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const link  = document.createElement('a')
    link.href   = URL.createObjectURL(blob)
    link.download = `EDMS-Survey-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    showToast('ส่งออก CSV เรียบร้อย!', 'success')
  }

  return (
    <div className="glass-insight p-6 text-center mt-6">
      <h3 className="font-semibold text-white mb-3 text-fluid-base">📥 ส่งออกข้อมูล</h3>
      <button
        onClick={exportCSV}
        className="px-6 py-3 bg-teal-500/70 hover:bg-teal-500 text-white rounded-xl font-semibold text-fluid-sm transition-all duration-200 shadow-lg hover:-translate-y-0.5 touch-target"
      >
        📊 ดาวน์โหลด CSV
      </button>
    </div>
  )
}
