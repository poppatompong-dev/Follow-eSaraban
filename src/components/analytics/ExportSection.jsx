import { useState } from 'react'
import * as XLSX from 'xlsx'
import { useToast } from '../../context/ToastContext'

const PAPER_PRESETS = {
  a4_portrait: {
    label: 'A4 แนวตั้ง',
    pageSize: 'A4 portrait',
    pagePadding: '12mm 10mm 14mm',
    previewWidth: '210mm',
  },
  a4_landscape: {
    label: 'A4 แนวนอน',
    pageSize: 'A4 landscape',
    pagePadding: '12mm 12mm 14mm',
    previewWidth: '297mm',
  },
  letter_landscape: {
    label: 'Letter แนวนอน',
    pageSize: 'Letter landscape',
    pagePadding: '12mm 12mm 14mm',
    previewWidth: '279mm',
  },
}

const NO_PROBLEM_VALUES = new Set(['ไม่พบปัญหา', 'ไม่พบปัญหาเทคนิค'])
const NO_SUPPORT_VALUES = new Set(['ไม่ต้องการเพิ่มเติม'])

function formatDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatNumber(value, digits = 2) {
  return Number(value || 0).toFixed(digits)
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function averageOf(responses, key) {
  if (responses.length === 0) return 0
  return responses.reduce((sum, item) => sum + (Number(item[key]) || 0), 0) / responses.length
}

function splitMultiValue(value) {
  return String(value || '')
    .split('|')
    .map((item) => item.trim())
    .filter(Boolean)
}

function countBy(responses, mapper) {
  const map = new Map()
  responses.forEach((item) => {
    const key = mapper(item)
    if (!key) return
    map.set(key, (map.get(key) || 0) + 1)
  })
  return map
}

function topEntry(map, fallbackLabel = '-') {
  let bestLabel = fallbackLabel
  let bestCount = 0

  map.forEach((count, label) => {
    if (count > bestCount) {
      bestLabel = label
      bestCount = count
    }
  })

  return { label: bestLabel, count: bestCount }
}

function topMultiValue(responses, key, ignoredValues = new Set()) {
  const counts = new Map()

  responses.forEach((item) => {
    splitMultiValue(item[key]).forEach((entry) => {
      if (ignoredValues.has(entry)) return
      counts.set(entry, (counts.get(entry) || 0) + 1)
    })
  })

  return topEntry(counts, 'ไม่มีข้อมูล')
}

function buildMetrics(responses, paperLabel) {
  const total = responses.length
  const regularUseCount = responses.filter((item) => item.q1_adoption === 'ใช้งานเป็นประจำ').length
  const adoptionRate = total > 0 ? (regularUseCount / total) * 100 : 0
  const avgOverall = averageOf(responses, 'q9_overall')
  const avgEase = averageOf(responses, 'q3_ease')
  const avgSpeed = averageOf(responses, 'q4_speed')
  const avgPaperless = averageOf(responses, 'q5_vs_paper')
  const topDepartment = topEntry(countBy(responses, (item) => item.department), 'ไม่มีข้อมูล')
  const topPain = topMultiValue(responses, 'q6_pain', NO_PROBLEM_VALUES)
  const topTechnical = topMultiValue(responses, 'q7_technical', NO_PROBLEM_VALUES)
  const topSupport = topMultiValue(responses, 'q8_support', NO_SUPPORT_VALUES)

  return {
    paperLabel,
    total,
    regularUseCount,
    adoptionRate,
    avgOverall,
    avgEase,
    avgSpeed,
    avgPaperless,
    topDepartment,
    topPain,
    topTechnical,
    topSupport,
    generatedAt: formatDate(new Date().toISOString()),
  }
}

function buildSummaryRows(metrics) {
  return [
    ['ชื่อรายงาน', 'รายงานสรุปผลการใช้งานระบบสารบรรณอิเล็กทรอนิกส์ (EDMS)'],
    ['หน่วยงาน', 'เทศบาลเมืองอุทัยธานี'],
    ['ประเภทรายงาน', 'รายงานสรุปผลแบบสำรวจและข้อเสนอแนะเชิงบริหาร'],
    ['รูปแบบกระดาษ', metrics.paperLabel],
    ['วันเวลาที่ออกรายงาน', metrics.generatedAt],
    ['จำนวนแบบสำรวจทั้งหมด', metrics.total],
    ['จำนวนผู้ใช้งานประจำ', metrics.regularUseCount],
    ['อัตราการใช้งานประจำ', `${formatNumber(metrics.adoptionRate)}%`],
    ['ค่าเฉลี่ยความพึงพอใจโดยรวม', `${formatNumber(metrics.avgOverall)} / 5`],
    ['ค่าเฉลี่ยความง่ายในการใช้งาน', `${formatNumber(metrics.avgEase)} / 5`],
    ['ค่าเฉลี่ยความรวดเร็ว', `${formatNumber(metrics.avgSpeed)} / 5`],
    ['ค่าเฉลี่ยการลดการใช้กระดาษ', `${formatNumber(metrics.avgPaperless)} / 5`],
    ['หน่วยงานที่มีผู้ตอบมากที่สุด', `${metrics.topDepartment.label} (${metrics.topDepartment.count} ราย)`],
  ]
}

function buildExecutiveInsights(metrics) {
  const insights = []

  const adoptionRecommendation = metrics.adoptionRate < 50
    ? 'ควรเร่งสื่อสารนโยบายการใช้งานจริงทุกกอง/ฝ่าย พร้อมกำหนดผู้รับผิดชอบติดตามผลรายหน่วยงาน'
    : metrics.adoptionRate < 75
      ? 'ควรขยายการใช้งานจากกลุ่มที่ใช้ประจำไปยังหน่วยงานที่ใช้งานเป็นบางครั้ง ด้วยการอบรมเชิงปฏิบัติการ'
      : 'ควรรักษามาตรฐานการใช้งานและจัดเก็บแนวปฏิบัติที่ดีเพื่อถ่ายทอดไปยังหน่วยงานอื่น'

  insights.push({
    ประเด็น: 'ภาพรวมการยอมรับระบบ',
    สถานะ: `${formatNumber(metrics.adoptionRate)}% ของผู้ตอบใช้งานระบบเป็นประจำ`,
    ผลกระทบ: metrics.adoptionRate < 50 ? 'เสี่ยงต่อการใช้งานไม่ต่อเนื่องและข้อมูลกระจัดกระจาย' : 'มีแนวโน้มยอมรับระบบในระดับใช้งานจริง',
    ข้อเสนอแนะ: adoptionRecommendation,
  })

  const satisfactionRecommendation = metrics.avgOverall < 3.5
    ? 'ควรปรับปรุงประสบการณ์ใช้งานร่วมกับการช่วยเหลือหน้างาน และเก็บ pain point รายกระบวนการเพิ่มเติม'
    : 'ควรรักษาคุณภาพระบบและติดตามผลหลังการปรับปรุงเป็นรอบรายไตรมาส'

  insights.push({
    ประเด็น: 'ความพึงพอใจของผู้ใช้งาน',
    สถานะ: `คะแนนความพึงพอใจเฉลี่ย ${formatNumber(metrics.avgOverall)} / 5`,
    ผลกระทบ: metrics.avgOverall < 3.5 ? 'ส่งผลต่อการกลับไปใช้เอกสารกระดาษหรือการใช้งานไม่เต็มประสิทธิภาพ' : 'ระบบมีฐานความพึงพอใจเพียงพอสำหรับขยายผล',
    ข้อเสนอแนะ: satisfactionRecommendation,
  })

  insights.push({
    ประเด็น: 'ปัญหาหลักที่พบมากที่สุด',
    สถานะ: metrics.topPain.count > 0 ? `${metrics.topPain.label} (${metrics.topPain.count} ราย)` : 'ไม่พบปัญหาหลักที่เด่นชัด',
    ผลกระทบ: metrics.topPain.count > 0 ? 'เป็นคอขวดที่ทำให้การใช้งานจริงไม่ต่อเนื่อง' : 'ยังไม่พบ pain point ที่กระจุกตัว',
    ข้อเสนอแนะ: metrics.topPain.count > 0
      ? 'ควรจัดมาตรการแก้ไขเฉพาะเรื่องนี้ก่อนเป็นลำดับแรก และสื่อสารแนวทางปฏิบัติใหม่ให้ชัดเจน'
      : 'ควรติดตามข้อมูลเชิงคุณภาพเพิ่มเติมจากข้อเสนอแนะปลายเปิด',
  })

  insights.push({
    ประเด็น: 'ปัญหาทางเทคนิคสำคัญ',
    สถานะ: metrics.topTechnical.count > 0 ? `${metrics.topTechnical.label} (${metrics.topTechnical.count} ราย)` : 'ไม่พบปัญหาทางเทคนิคเด่น',
    ผลกระทบ: metrics.topTechnical.count > 0 ? 'มีผลโดยตรงต่อความเร็วและความมั่นใจในการใช้งานระบบ' : 'ความเสี่ยงเชิงเทคนิคอยู่ในระดับควบคุมได้',
    ข้อเสนอแนะ: metrics.topTechnical.count > 0
      ? 'ควรให้ทีมเทคนิคจัดลำดับความสำคัญของการแก้ไข พร้อมกำหนด SLA การช่วยเหลือ'
      : 'ควรรักษามาตรฐานโครงสร้างพื้นฐานและติดตามเหตุขัดข้องต่อเนื่อง',
  })

  insights.push({
    ประเด็น: 'ความต้องการการสนับสนุน',
    สถานะ: metrics.topSupport.count > 0 ? `${metrics.topSupport.label} (${metrics.topSupport.count} ราย)` : 'ไม่พบความต้องการสนับสนุนที่เด่นชัด',
    ผลกระทบ: metrics.topSupport.count > 0 ? 'สะท้อนทรัพยากรสนับสนุนที่ควรจัดสรรเพิ่มเติม' : 'ยังไม่จำเป็นต้องเพิ่มมาตรการใหม่ในทันที',
    ข้อเสนอแนะ: metrics.topSupport.count > 0
      ? 'ควรวางแผนงบประมาณ/บุคลากร/คู่มือ ให้สอดคล้องกับความต้องการนี้เป็นลำดับต้น'
      : 'คงมาตรการสนับสนุนเดิมและประเมินซ้ำในรอบถัดไป',
  })

  return insights
}

function buildRegisterRows(responses) {
  return responses.map((record, index) => [
    index + 1,
    record.department || '-',
    record.role || '-',
    formatDate(record.submitted_at),
    record.feedback || '-',
  ])
}

function buildScoreRows(responses) {
  return responses.map((record, index) => [
    index + 1,
    record.q1_adoption || '-',
    record.q2_frequency || '-',
    Number(record.q3_ease) || 0,
    Number(record.q4_speed) || 0,
    Number(record.q5_vs_paper) || 0,
    Number(record.q9_overall) || 0,
  ])
}

function buildSupportRows(responses) {
  return responses.map((record, index) => [
    index + 1,
    record.q6_pain || '-',
    record.q7_technical || '-',
    record.q8_support || '-',
  ])
}

function buildPdfHtml(responses, presetKey) {
  const preset = PAPER_PRESETS[presetKey] || PAPER_PRESETS.a4_portrait
  const metrics = buildMetrics(responses, preset.label)
  const summaryRows = buildSummaryRows(metrics)
  const insights = buildExecutiveInsights(metrics)
  const registerRows = buildRegisterRows(responses)
  const scoreRows = buildScoreRows(responses)
  const supportRows = buildSupportRows(responses)

  const summaryMarkup = summaryRows.map(([label, value]) => `
    <tr>
      <td class="summary-label">${escapeHtml(label)}</td>
      <td>${escapeHtml(value)}</td>
    </tr>
  `).join('')

  const insightsMarkup = insights.map((item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${escapeHtml(item.ประเด็น)}</td>
      <td>${escapeHtml(item.สถานะ)}</td>
      <td>${escapeHtml(item.ผลกระทบ)}</td>
      <td>${escapeHtml(item.ข้อเสนอแนะ)}</td>
    </tr>
  `).join('')

  const renderRows = (rows, emptyColspan) => rows.length > 0
    ? rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')
    : `<tr><td colspan="${emptyColspan}" class="empty">ไม่มีข้อมูลสำหรับแสดง</td></tr>`

  return `
    <style>
      @page {
        size: ${preset.pageSize};
        margin: 10mm;
      }
      * { box-sizing: border-box; }
      html, body {
        margin: 0;
        padding: 0;
        background: #eef2f7;
        font-family: "TH Sarabun New", Tahoma, "Times New Roman", serif;
        color: #111827;
      }
      .hint {
        width: min(100%, ${preset.previewWidth});
        margin: 0 auto;
        padding: 10px 12px 0;
        font: 600 13px/1.4 Arial, sans-serif;
        color: #334155;
      }
      .page {
        width: min(100%, ${preset.previewWidth});
        margin: 0 auto 8px;
        background: #fff;
        padding: ${preset.pagePadding};
        break-after: page;
      }
      .page:last-of-type {
        break-after: auto;
      }
      .header {
        border: 2px solid #111827;
        text-align: center;
        padding: 10px 12px;
        margin-bottom: 10px;
      }
      .header h1 {
        margin: 0;
        font-size: 18pt;
        font-weight: 700;
      }
      .header p {
        margin: 4px 0 0;
        font-size: 10.5pt;
      }
      .section-title {
        margin: 10px 0 6px;
        font-size: 12.5pt;
        font-weight: 700;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
      }
      th, td {
        border: 1px solid #111827;
        padding: 5px 6px;
        vertical-align: top;
        word-break: break-word;
        overflow-wrap: anywhere;
        font-size: 9pt;
        line-height: 1.3;
      }
      th {
        background: #e2e8f0;
        text-align: center;
        font-weight: 700;
      }
      .summary-label {
        width: 34%;
        font-weight: 700;
        background: #f8fafc;
      }
      .note {
        margin-top: 10px;
        font-size: 9pt;
        color: #475569;
      }
      .signatures {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-top: 20px;
      }
      .signature {
        text-align: center;
        font-size: 9pt;
      }
      .line {
        height: 40px;
        border-bottom: 1px solid #111827;
        margin-bottom: 6px;
      }
      .empty {
        text-align: center;
      }
      .col-no { width: 7%; }
      .col-dept { width: 22%; }
      .col-role { width: 18%; }
      .col-date { width: 21%; }
      .col-feedback { width: 32%; }
      .score-no { width: 7%; }
      .score-wide { width: 31%; }
      .score-small { width: 15.5%; }
      .support-no { width: 7%; }
      .support-wide { width: 31%; }
      .insight-no { width: 6%; }
      .insight-topic { width: 18%; }
      .insight-status { width: 20%; }
      .insight-impact { width: 24%; }
      .insight-action { width: 32%; }
      @media print {
        html, body {
          background: #fff;
        }
        .hint {
          display: none;
        }
        .page {
          width: auto;
          margin: 0;
          padding: 0;
        }
      }
    </style>
    <div class="hint">
      รูปแบบส่งออก PDF: ${escapeHtml(preset.label)} รายงานนี้จัดหน้าให้เหมาะกับการพิมพ์เอกสารราชการ และแยกสาระสำคัญเชิงบริหารไว้ส่วนต้นของรายงาน
    </div>

    <div class="page">
      <div class="header">
        <h1>รายงานสรุปผลการใช้งานระบบสารบรรณอิเล็กทรอนิกส์ (EDMS)</h1>
        <p>เทศบาลเมืองอุทัยธานี</p>
        <p>สรุปผลแบบสำรวจและข้อเสนอแนะเชิงบริหาร</p>
      </div>

      <div class="section-title">1. สรุปข้อมูลภาพรวม</div>
      <table>
        <tbody>
          ${summaryMarkup}
        </tbody>
      </table>

      <div class="section-title">2. ข้อค้นพบเชิงแนะนำสำหรับผู้บริหาร</div>
      <table>
        <colgroup>
          <col class="insight-no" />
          <col class="insight-topic" />
          <col class="insight-status" />
          <col class="insight-impact" />
          <col class="insight-action" />
        </colgroup>
        <thead>
          <tr>
            <th>ลำดับ</th>
            <th>ประเด็น</th>
            <th>สถานะ</th>
            <th>ผลกระทบ</th>
            <th>ข้อเสนอแนะ</th>
          </tr>
        </thead>
        <tbody>
          ${insightsMarkup}
        </tbody>
      </table>

      <p class="note">เอกสารฉบับนี้จัดทำขึ้นเพื่อใช้ประกอบการบริหาร ติดตามผล และกำหนดมาตรการสนับสนุนการใช้งานระบบ EDMS ภายในหน่วยงาน</p>

      <div class="signatures">
        <div class="signature">
          <div class="line"></div>
          <div>ผู้จัดทำรายงาน</div>
          <div>เจ้าหน้าที่วิเคราะห์ข้อมูล</div>
        </div>
        <div class="signature">
          <div class="line"></div>
          <div>ผู้ตรวจพิจารณา</div>
          <div>ผู้บริหาร/ผู้กำกับดูแลระบบ</div>
        </div>
      </div>
    </div>

    <div class="page">
      <div class="header">
        <h1>ทะเบียนข้อมูลผู้ตอบแบบสำรวจ</h1>
        <p>ข้อมูลหน่วยงาน ตำแหน่ง และเวลาที่ส่งแบบสำรวจ</p>
      </div>
      <table>
        <colgroup>
          <col class="col-no" />
          <col class="col-dept" />
          <col class="col-role" />
          <col class="col-date" />
          <col class="col-feedback" />
        </colgroup>
        <thead>
          <tr>
            <th>ลำดับ</th>
            <th>หน่วยงาน</th>
            <th>ประเภทบุคลากร</th>
            <th>วันเวลาที่ส่ง</th>
            <th>ข้อเสนอแนะเพิ่มเติม</th>
          </tr>
        </thead>
        <tbody>
          ${renderRows(registerRows, 5)}
        </tbody>
      </table>
    </div>

    <div class="page">
      <div class="header">
        <h1>สรุประดับการใช้งานและคะแนนประเมิน</h1>
        <p>พฤติกรรมการใช้งาน ความถี่ และคะแนนประสบการณ์ใช้งาน</p>
      </div>
      <table>
        <colgroup>
          <col class="score-no" />
          <col class="score-wide" />
          <col class="score-wide" />
          <col class="score-small" />
          <col class="score-small" />
          <col class="score-small" />
          <col class="score-small" />
        </colgroup>
        <thead>
          <tr>
            <th>ลำดับ</th>
            <th>สถานะการใช้งาน</th>
            <th>ความถี่การใช้งาน</th>
            <th>ความง่าย</th>
            <th>ความเร็ว</th>
            <th>ลดกระดาษ</th>
            <th>ความพึงพอใจรวม</th>
          </tr>
        </thead>
        <tbody>
          ${renderRows(scoreRows, 7)}
        </tbody>
      </table>
    </div>

    <div class="page">
      <div class="header">
        <h1>สรุปปัญหาและความต้องการสนับสนุน</h1>
        <p>ประเด็นปัญหา ปัญหาทางเทคนิค และความช่วยเหลือที่หน่วยงานต้องการ</p>
      </div>
      <table>
        <colgroup>
          <col class="support-no" />
          <col class="support-wide" />
          <col class="support-wide" />
          <col class="support-wide" />
        </colgroup>
        <thead>
          <tr>
            <th>ลำดับ</th>
            <th>ปัญหาหลัก</th>
            <th>ปัญหาทางเทคนิค</th>
            <th>ความต้องการสนับสนุน</th>
          </tr>
        </thead>
        <tbody>
          ${renderRows(supportRows, 4)}
        </tbody>
      </table>
    </div>
  `
}

function printHtmlDocument(title, html) {
  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.right = '0'
  iframe.style.bottom = '0'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = '0'
  document.body.appendChild(iframe)

  const doc = iframe.contentWindow?.document
  if (!doc || !iframe.contentWindow) {
    iframe.remove()
    return false
  }

  doc.open()
  doc.write(`<!doctype html><html><head><meta charset="utf-8" /><title>${escapeHtml(title)}</title></head><body>${html}</body></html>`)
  doc.close()

  iframe.onload = () => {
    iframe.contentWindow?.focus()
    iframe.contentWindow?.print()
    window.setTimeout(() => iframe.remove(), 1000)
  }

  return true
}

function createWorkbookSheet(data, columnWidths) {
  const sheet = XLSX.utils.aoa_to_sheet(data)
  sheet['!cols'] = columnWidths.map((wch) => ({ wch }))
  return sheet
}

export default function ExportSection({ responses }) {
  const showToast = useToast()
  const [paperPreset, setPaperPreset] = useState('a4_portrait')

  function handleExportPdf() {
    if (responses.length === 0) {
      showToast('ไม่มีข้อมูลสำหรับส่งออกรายงาน', 'warning')
      return
    }

    const preset = PAPER_PRESETS[paperPreset] || PAPER_PRESETS.a4_portrait
    const printed = printHtmlDocument(
      `รายงาน EDMS - ${preset.label}`,
      buildPdfHtml(responses, paperPreset)
    )

    if (!printed) {
      showToast('ไม่สามารถเปิดเอกสารสำหรับพิมพ์ PDF ได้', 'error')
      return
    }

    showToast(`เปิดเอกสาร PDF สำหรับ ${preset.label} แล้ว`, 'success')
  }

  function handleExportExcel() {
    if (responses.length === 0) {
      showToast('ไม่มีข้อมูลสำหรับส่งออกรายงาน', 'warning')
      return
    }

    const preset = PAPER_PRESETS[paperPreset] || PAPER_PRESETS.a4_portrait
    const metrics = buildMetrics(responses, preset.label)
    const workbook = XLSX.utils.book_new()

    const summarySheet = createWorkbookSheet(
      [
        ['รายงานสรุปผลการใช้งานระบบสารบรรณอิเล็กทรอนิกส์ (EDMS)'],
        ['เทศบาลเมืองอุทัยธานี'],
        ['สรุปผลแบบสำรวจและข้อเสนอแนะเชิงบริหาร'],
        [],
        ['หัวข้อ', 'รายละเอียด'],
        ...buildSummaryRows(metrics),
      ],
      [30, 56]
    )

    const insightsSheet = createWorkbookSheet(
      [
        ['ลำดับ', 'ประเด็น', 'สถานะ', 'ผลกระทบ', 'ข้อเสนอแนะ'],
        ...buildExecutiveInsights(metrics).map((item, index) => [
          index + 1,
          item.ประเด็น,
          item.สถานะ,
          item.ผลกระทบ,
          item.ข้อเสนอแนะ,
        ]),
      ],
      [8, 22, 24, 26, 36]
    )

    const registerSheet = createWorkbookSheet(
      [
        ['ลำดับ', 'หน่วยงาน', 'ประเภทบุคลากร', 'วันเวลาที่ส่ง', 'ข้อเสนอแนะเพิ่มเติม'],
        ...buildRegisterRows(responses),
      ],
      [8, 24, 22, 24, 42]
    )

    const scoresSheet = createWorkbookSheet(
      [
        ['ลำดับ', 'สถานะการใช้งาน', 'ความถี่การใช้งาน', 'ความง่าย', 'ความเร็ว', 'ลดกระดาษ', 'ความพึงพอใจรวม'],
        ...buildScoreRows(responses),
      ],
      [8, 28, 28, 10, 10, 12, 14]
    )

    const supportSheet = createWorkbookSheet(
      [
        ['ลำดับ', 'ปัญหาหลัก', 'ปัญหาทางเทคนิค', 'ความต้องการสนับสนุน'],
        ...buildSupportRows(responses),
      ],
      [8, 32, 32, 32]
    )

    XLSX.utils.book_append_sheet(workbook, summarySheet, 'สรุปผู้บริหาร')
    XLSX.utils.book_append_sheet(workbook, insightsSheet, 'ข้อเสนอแนะ')
    XLSX.utils.book_append_sheet(workbook, registerSheet, 'ทะเบียนผู้ตอบ')
    XLSX.utils.book_append_sheet(workbook, scoresSheet, 'คะแนนการใช้งาน')
    XLSX.utils.book_append_sheet(workbook, supportSheet, 'ปัญหาและการสนับสนุน')

    XLSX.writeFile(
      workbook,
      `EDMS-Thai-Executive-Report-${preset.label.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.xlsx`
    )

    showToast(`ส่งออก Excel ภาษาไทยสำหรับ ${preset.label} เรียบร้อยแล้ว`, 'success')
  }

  return (
    <div className="glass-insight p-6 mt-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="text-left">
            <h3 className="font-semibold text-white mb-2 text-fluid-base">ส่งออกรายงานทางการ</h3>
            <p className="text-teal-200/60 text-fluid-sm">
              สร้างรายงานภาษาไทยในรูปแบบทางการ พร้อมข้อค้นพบเชิงแนะนำสำหรับผู้บริหาร ทั้งในรูปแบบ PDF และ Excel
            </p>
          </div>

          <label className="text-left text-fluid-sm text-teal-100">
            <span className="block mb-2 text-teal-200/70">รูปแบบกระดาษ</span>
            <select
              value={paperPreset}
              onChange={(event) => setPaperPreset(event.target.value)}
              className="min-w-[220px] rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none transition focus:border-teal-400/60"
            >
              {Object.entries(PAPER_PRESETS).map(([key, preset]) => (
                <option key={key} value={key}>
                  {preset.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleExportPdf}
            className="px-6 py-3 bg-slate-100 text-slate-900 rounded-xl font-semibold text-fluid-sm transition-all duration-200 shadow-lg hover:-translate-y-0.5 touch-target"
          >
            ส่งออก PDF
          </button>
          <button
            type="button"
            onClick={handleExportExcel}
            className="px-6 py-3 bg-teal-500/80 hover:bg-teal-500 text-white rounded-xl font-semibold text-fluid-sm transition-all duration-200 shadow-lg hover:-translate-y-0.5 touch-target"
          >
            ส่งออก Excel
          </button>
        </div>
      </div>
    </div>
  )
}
