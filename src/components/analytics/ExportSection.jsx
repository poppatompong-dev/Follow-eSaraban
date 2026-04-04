import { useToast } from '../../context/ToastContext'

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

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildSummary(responses) {
  const total = responses.length
  const adoptionCount = responses.filter((r) => r.q1_adoption === 'ใช้งานเป็นประจำ').length
  const avgOverall = total > 0
    ? (responses.reduce((sum, r) => sum + (Number(r.q9_overall) || 0), 0) / total).toFixed(2)
    : '0.00'
  const avgEase = total > 0
    ? (responses.reduce((sum, r) => sum + (Number(r.q3_ease) || 0), 0) / total).toFixed(2)
    : '0.00'

  return [
    { label: 'Report title', value: 'EDMS usage progress report' },
    { label: 'Agency', value: 'Uthai Thani Municipality' },
    { label: 'Report type', value: 'Formal survey analytics summary' },
    { label: 'Generated at', value: formatDate(new Date().toISOString()) },
    { label: 'Total responses', value: String(total) },
    { label: 'Regular adoption count', value: String(adoptionCount) },
    { label: 'Average overall score', value: `${avgOverall} / 5` },
    { label: 'Average ease-of-use score', value: `${avgEase} / 5` },
  ]
}

function buildTableRows(responses) {
  return responses.map((record, index) => ([
    index + 1,
    record.department || '-',
    record.role || '-',
    record.q1_adoption || '-',
    record.q2_frequency || '-',
    record.q3_ease || 0,
    record.q4_speed || 0,
    record.q5_vs_paper || 0,
    record.q9_overall || 0,
    record.feedback || '-',
    formatDate(record.submitted_at),
  ]))
}

function openPrintWindow(title, html) {
  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=1200,height=900')
  if (!printWindow) return null

  printWindow.document.open()
  printWindow.document.write(`<!doctype html><html><head><meta charset="utf-8" /><title>${escapeHtml(title)}</title></head><body>${html}</body></html>`)
  printWindow.document.close()
  printWindow.focus()
  return printWindow
}

function buildReportHtml(responses) {
  const summary = buildSummary(responses)
  const rows = buildTableRows(responses)

  const summaryMarkup = summary.map((item) => `
    <tr>
      <td class="label">${escapeHtml(item.label)}</td>
      <td class="value">${escapeHtml(item.value)}</td>
    </tr>
  `).join('')

  const rowsMarkup = rows.map((row) => `
    <tr>
      ${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}
    </tr>
  `).join('')

  return `
    <style>
      :root {
        --border: #111827;
        --text: #111827;
        --muted: #4b5563;
        --soft: #e5e7eb;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: "TH Sarabun New", "Times New Roman", serif;
        color: var(--text);
        background: #fff;
      }
      .page {
        width: 210mm;
        min-height: 297mm;
        margin: 0 auto;
        padding: 18mm 16mm 20mm;
      }
      .header {
        text-align: center;
        border: 2px solid var(--border);
        padding: 12px 16px;
        margin-bottom: 12px;
      }
      .header h1 {
        margin: 0;
        font-size: 22pt;
        font-weight: 700;
        letter-spacing: 0.02em;
      }
      .header p {
        margin: 6px 0 0;
        font-size: 13pt;
      }
      .section-title {
        margin: 18px 0 8px;
        font-size: 15pt;
        font-weight: 700;
      }
      .summary-table,
      .data-table {
        width: 100%;
        border-collapse: collapse;
      }
      .summary-table td,
      .data-table th,
      .data-table td {
        border: 1px solid var(--border);
        padding: 6px 8px;
        vertical-align: top;
        font-size: 11.5pt;
      }
      .summary-table .label {
        width: 34%;
        font-weight: 700;
        background: #f8fafc;
      }
      .summary-table .value {
        width: 66%;
      }
      .data-table th {
        background: #eef2f7;
        text-align: center;
        font-weight: 700;
      }
      .note {
        margin-top: 12px;
        font-size: 11pt;
        color: var(--muted);
      }
      .signatures {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
        margin-top: 28px;
      }
      .signature-box {
        text-align: center;
        font-size: 11.5pt;
      }
      .signature-line {
        border-bottom: 1px solid var(--border);
        height: 48px;
        margin-bottom: 8px;
      }
      @media print {
        .page {
          margin: 0;
          padding: 15mm 14mm 18mm;
        }
      }
    </style>
    <div class="page">
      <div class="header">
        <h1>Official EDMS Survey Report</h1>
        <p>Uthai Thani Municipality</p>
        <p>Electronic Document Management System analytics summary</p>
      </div>

      <div class="section-title">1. Executive Summary</div>
      <table class="summary-table">
        ${summaryMarkup}
      </table>

      <div class="section-title">2. Survey Record Register</div>
      <table class="data-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Department</th>
            <th>Role</th>
            <th>Adoption</th>
            <th>Frequency</th>
            <th>Ease</th>
            <th>Speed</th>
            <th>Paperless</th>
            <th>Overall</th>
            <th>Feedback</th>
            <th>Submitted at</th>
          </tr>
        </thead>
        <tbody>
          ${rowsMarkup || '<tr><td colspan="11" style="text-align:center;">No records available</td></tr>'}
        </tbody>
      </table>

      <p class="note">
        This document was generated electronically for internal administrative review and archive purposes.
      </p>

      <div class="signatures">
        <div class="signature-box">
          <div class="signature-line"></div>
          <div>Prepared by</div>
          <div>Analytics Officer</div>
        </div>
        <div class="signature-box">
          <div class="signature-line"></div>
          <div>Approved by</div>
          <div>Supervising Administrator</div>
        </div>
      </div>
    </div>
  `
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

export default function ExportSection({ responses }) {
  const showToast = useToast()

  function handleExportPdf() {
    if (responses.length === 0) {
      showToast('No data available for export', 'warning')
      return
    }

    const printWindow = openPrintWindow('EDMS Official Report', buildReportHtml(responses))
    if (!printWindow) {
      showToast('Unable to open the print window', 'error')
      return
    }

    printWindow.onload = () => {
      printWindow.print()
    }
    showToast('Print-ready PDF template opened successfully', 'success')
  }

  function handleExportExcel() {
    if (responses.length === 0) {
      showToast('No data available for export', 'warning')
      return
    }

    const summary = buildSummary(responses)
    const rows = buildTableRows(responses)
    const summaryRows = summary.map((item) => `
      <tr>
        <td style="font-weight:bold; background:#e2e8f0;">${escapeHtml(item.label)}</td>
        <td>${escapeHtml(item.value)}</td>
      </tr>
    `).join('')

    const dataRows = rows.map((row) => `
      <tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>
    `).join('')

    const workbookHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:x="urn:schemas-microsoft-com:office:excel"
            xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="utf-8" />
          <!--[if gte mso 9]><xml>
            <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                  <x:Name>Official Report</x:Name>
                  <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
                </x:ExcelWorksheet>
              </x:ExcelWorksheets>
            </x:ExcelWorkbook>
          </xml><![endif]-->
          <style>
            body { font-family: "TH Sarabun New", Tahoma, sans-serif; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #1f2937; padding: 6px 8px; vertical-align: top; }
            th { background: #dbeafe; font-weight: bold; text-align: center; }
            .title { font-size: 18pt; font-weight: bold; text-align: center; border: none; }
            .subtitle { font-size: 12pt; text-align: center; border: none; }
            .blank { border: none; height: 10px; }
          </style>
        </head>
        <body>
          <table>
            <tr><td class="title" colspan="11">Official EDMS Survey Report</td></tr>
            <tr><td class="subtitle" colspan="11">Uthai Thani Municipality</td></tr>
            <tr><td class="subtitle" colspan="11">Electronic Document Management System analytics summary</td></tr>
            <tr><td class="blank" colspan="11"></td></tr>
            <tr><th colspan="11">Executive Summary</th></tr>
            ${summaryRows}
            <tr><td class="blank" colspan="11"></td></tr>
            <tr>
              <th>No.</th>
              <th>Department</th>
              <th>Role</th>
              <th>Adoption</th>
              <th>Frequency</th>
              <th>Ease</th>
              <th>Speed</th>
              <th>Paperless</th>
              <th>Overall</th>
              <th>Feedback</th>
              <th>Submitted at</th>
            </tr>
            ${dataRows}
          </table>
        </body>
      </html>
    `

    downloadFile(
      '\uFEFF' + workbookHtml,
      `EDMS-Official-Report-${new Date().toISOString().split('T')[0]}.xls`,
      'application/vnd.ms-excel;charset=utf-8;'
    )
    showToast('Formal Excel report exported successfully', 'success')
  }

  return (
    <div className="glass-insight p-6 mt-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-left">
          <h3 className="font-semibold text-white mb-2 text-fluid-base">Official Report Export</h3>
          <p className="text-teal-200/60 text-fluid-sm">
            Generate formal export files prepared in a government-style reporting layout for archive, review, and submission.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleExportPdf}
            className="px-6 py-3 bg-slate-100 text-slate-900 rounded-xl font-semibold text-fluid-sm transition-all duration-200 shadow-lg hover:-translate-y-0.5 touch-target"
          >
            Export PDF Template
          </button>
          <button
            type="button"
            onClick={handleExportExcel}
            className="px-6 py-3 bg-teal-500/80 hover:bg-teal-500 text-white rounded-xl font-semibold text-fluid-sm transition-all duration-200 shadow-lg hover:-translate-y-0.5 touch-target"
          >
            Export Excel Template
          </button>
        </div>
      </div>
    </div>
  )
}
