/**
 * EDMS Survey — Google Apps Script Backend
 * =========================================
 * วิธีติดตั้ง:
 * 1. เปิด Google Sheets ที่ต้องการเก็บข้อมูล
 * 2. ไปที่ Extensions → Apps Script
 * 3. ลบโค้ดเดิมทั้งหมด แล้ว copy โค้ดนี้วางแทน
 * 4. กด Deploy → New deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. คัดลอก Web App URL ไปวางใน src/lib/api.js
 */

const SHEET_NAME = 'Responses'; // ชื่อ sheet tab
const HEADERS = [
  'id', 'department', 'role', 'q1_adoption', 'q2_frequency',
  'q3_ease', 'q4_speed', 'q5_vs_paper',
  'q6_pain', 'q7_technical', 'q8_support',
  'q9_overall', 'submitted_at'
];

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

// ─── GET — ดึงข้อมูลทั้งหมด ────────────────────────────────────
function doGet(e) {
  try {
    const sheet = getSheet();
    const data  = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      // No data rows yet
      return jsonResponse({ ok: true, data: [] });
    }
    const headers = data[0];
    const rows    = data.slice(1).map(row => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i]; });
      return obj;
    });
    return jsonResponse({ ok: true, data: rows });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

// ─── POST — บันทึก / ลบ ────────────────────────────────────────
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);

    if (payload.action === 'delete') {
      return handleDelete(payload.id);
    }
    return handleCreate(payload);
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

function handleCreate(payload) {
  const sheet = getSheet();
  const id    = Utilities.getUuid();
  const row   = HEADERS.map(h => h === 'id' ? id : (payload[h] ?? ''));
  sheet.appendRow(row);
  return jsonResponse({ ok: true, id });
}

function handleDelete(id) {
  const sheet = getSheet();
  const data  = sheet.getDataRange().getValues();
  const idCol = 0; // 'id' is first column
  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][idCol] === id) {
      sheet.deleteRow(i + 1);
      return jsonResponse({ ok: true });
    }
  }
  return jsonResponse({ ok: false, error: 'Record not found' });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
