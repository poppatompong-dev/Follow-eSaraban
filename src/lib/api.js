// ─── Google Sheets API Endpoint ──────────────────────────────────
//
// SETUP INSTRUCTIONS:
// 1. Open your Google Sheet
// 2. Go to Extensions → Apps Script
// 3. Paste the code from `google-apps-script.gs` (in this project root)
// 4. Click Deploy → New deployment → Web App
//    - Execute as: Me
//    - Who has access: Anyone
// 5. Copy the Web App URL and paste it below
//
export const SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwdazvXW_oWAAmxy-K7WCdCnK7Yy8PVZY-ewL51znSnV-xX3_w9M1zl2DnJvL9vZgI/exec'

// Column order — must match the Apps Script header row
export const COLUMNS = [
  'id',
  'department',
  'role',
  'q1_adoption',
  'q2_frequency',
  'q3_ease',
  'q4_speed',
  'q5_vs_paper',
  'q6_pain',
  'q7_technical',
  'q8_support',
  'q9_overall',
  'submitted_at',
]
