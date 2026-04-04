# 📄 System Document
## ระบบแบบสำรวจความคืบหน้า EDMS (eSaraban Survey System)
### เทศบาลเมืองอุทัยธานี · เวอร์ชัน 1.0 · พ.ศ. 2569

---

## 1. ภาพรวมระบบ (System Overview)

### 1.1 วัตถุประสงค์
ระบบแบบสำรวจความคืบหน้าการใช้งานระบบสารบรรณอิเล็กทรอนิกส์ (EDMS Survey System) พัฒนาขึ้นเพื่อ:

- **ติดตาม** สถานะการเปลี่ยนผ่านจากระบบกระดาษไปสู่ระบบ eSaraban ของบุคลากรเทศบาลฯ
- **วิเคราะห์** ปัญหาและอุปสรรคในการใช้งานระบบ EDMS
- **รวบรวม** ข้อเสนอแนะจากผู้ปฏิบัติงานเพื่อนำไปพัฒนาระบบต่อไป
- **แสดงผล** ภาพรวมสถิติเชิงวิเคราะห์แบบ Real-time ผ่าน Dashboard

### 1.2 กลุ่มเป้าหมาย
| กลุ่ม | บทบาท |
|-------|-------|
| **บุคลากรเทศบาลฯ** | ผู้กรอกแบบสอบถาม (Survey Respondent) |
| **ผู้บริหาร / ผู้ดูแลระบบ** | ผู้ดูข้อมูล Dashboard และ Analytics |
| **ทีม IT** | ผู้บำรุงรักษาระบบ |

### 1.3 URL การเข้าถึงระบบ
| ชื่อ | URL |
|------|-----|
| **Production (Vercel)** | *(กำหนดหลัง deploy บน Vercel)* |
| **Source Code** | `https://github.com/poppatompong-dev/Follow-eSaraban` |
| **Google Sheets (ฐานข้อมูล)** | Sheet ID: `1d-Svs7iHX3Vmcnm5Vrh5Xg8_wQD70yRyrtx6R37uSJQ` |

---

## 2. สถาปัตยกรรมระบบ (System Architecture)

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                          │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              React SPA (Vite + Tailwind CSS)            │   │
│   │                                                          │   │
│   │  ┌──────────────┐      ┌──────────────────────────┐    │   │
│   │  │  Survey View │      │     Analytics Dashboard   │    │   │
│   │  │  (4 Sections)│      │  Charts + Insight + CSV  │    │   │
│   │  └──────┬───────┘      └────────────┬─────────────┘    │   │
│   │         │                           │                    │   │
│   │         └──────────┬────────────────┘                   │   │
│   │                    │ fetch() POST / GET                  │   │
│   └────────────────────┼────────────────────────────────────┘   │
│                        │                                         │
└────────────────────────┼─────────────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              Google Apps Script (Web App Endpoint)               │
│   URL: script.google.com/macros/s/AKfycb.../exec                │
│                                                                  │
│   doGet()  → ดึงข้อมูลทั้งหมดเป็น JSON                        │
│   doPost() → บันทึก (create) / ลบ (delete) ข้อมูล             │
└────────────────────────┬─────────────────────────────────────────┘
                         │ Sheets API
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Google Sheets (Database)                       │
│   Sheet: "Responses"                                             │
│   13 คอลัมน์: id, department, role, ... feedback, submitted_at  │
└─────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────┐
│              CI/CD Pipeline (Vercel)                             │
│                                                                  │
│  git push → Vercel detects push → Build (npm run build) →       │
│  Deploy → Vercel CDN (SPA routing via vercel.json)               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Stack เทคโนโลยี (Technology Stack)

| ชั้น | เทคโนโลยี | เวอร์ชัน | จุดประสงค์ |
|------|-----------|---------|-----------|
| **Frontend Framework** | React | 18.x | Component-based UI |
| **Build Tool** | Vite | 5.x | Fast bundling, HMR |
| **CSS Framework** | Tailwind CSS | 3.x | Utility-first styling |
| **Design** | Glassmorphism | — | Visual design language |
| **Charts** | Chart.js + react-chartjs-2 | 4.x | Data visualization |
| **Icons** | Lucide React | — | UI Icons |
| **Backend** | Google Apps Script | — | REST-like API |
| **Database** | Google Sheets | — | Data storage |
| **Hosting** | Vercel | — | Static file hosting + SPA routing |
| **CI/CD** | Vercel (Git Integration) | — | Auto build & deploy on push |

---

## 4. โครงสร้างโปรเจกต์ (Project Structure)

```
eSaraban_Survay/
│
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions — auto deploy to Pages
│
├── src/
│   ├── App.jsx                     # Root component + animated background
│   ├── main.jsx                    # React entry point
│   ├── index.css                   # Global styles + Glassmorphism classes
│   │
│   ├── context/
│   │   └── ToastContext.jsx        # Global toast notification system
│   │
│   ├── hooks/
│   │   ├── useSurveyForm.js        # Form state, navigation, validation
│   │   └── useResponses.js         # Fetch data from Google Sheets
│   │
│   ├── lib/
│   │   ├── api.js                  # SHEET_ENDPOINT config (← URL ตั้งที่นี่)
│   │   └── constants.js            # DEPARTMENTS, ROLES, Q1–Q8 options
│   │
│   └── components/
│       ├── AdminBar.jsx            # Top bar: Admin Mode toggle
│       ├── TabNav.jsx              # Tab switcher: Survey ↔ Analytics
│       │
│       ├── survey/
│       │   ├── Intro.jsx           # หน้าแรก: คำอธิบายแบบสอบถาม
│       │   ├── Header.jsx          # Title + progress bar
│       │   ├── SurveyView.jsx      # Orchestrator: ควบคุม flow ทั้งหมด
│       │   ├── Section1.jsx        # ข้อมูลผู้ตอบ (กอง/ฝ่าย, ประเภทบุคลากร)
│       │   ├── Section2.jsx        # การใช้งานจริง (Adoption, Frequency)
│       │   ├── Section3.jsx        # UX ratings + Pain points
│       │   ├── Section4.jsx        # Support needs + Overall satisfaction + Feedback
│       │   ├── ThankYou.jsx        # หน้าขอบคุณหลังส่ง
│       │   ├── RadioCard.jsx       # Glassmorphism radio button card
│       │   ├── CheckCard.jsx       # Glassmorphism checkbox card
│       │   └── StarRating.jsx      # Star rating (1–5)
│       │
│       └── analytics/
│           ├── AnalyticsView.jsx   # Dashboard หลัก + Chart + ปุ่มล้างข้อมูล
│           ├── StatHeader.jsx      # KPI cards 4 ใบ (การตอบ, Adoption, Satisfaction, UX)
│           ├── AdminPanel.jsx      # Admin panel (amber dashed border)
│           ├── ChartCard.jsx       # Glass wrapper สำหรับ Chart.js
│           ├── InsightCard.jsx     # Ranked list จาก pipe-delimited fields
│           ├── FeedbackList.jsx    # แสดงข้อเสนอแนะ text จากผู้ตอบ
│           └── ExportSection.jsx   # ปุ่มดาวน์โหลด CSV
│
├── google-apps-script.gs           # โค้ด Backend (copy ไปวางใน Apps Script)
├── index.html                      # HTML entry point
├── vercel.json                     # Vercel SPA routing config
├── package.json                    # Dependencies
├── vite.config.js                  # Vite config (base: '/')
├── tailwind.config.js              # Tailwind + custom tokens
├── postcss.config.js               # PostCSS config
└── .gitignore
```

---

## 5. การทำงานของระบบ (System Workflow)

### 5.1 Flow การกรอกแบบสอบถาม

```
เปิด URL
    │
    ▼
หน้า Intro ← แสดงคำอธิบาย วัตถุประสงค์ จำนวนผู้ตอบ
    │
    ▼ กด "เริ่มทำแบบสอบถาม"
    │
    ├─▶ Section 1: ข้อมูลผู้ตอบ (กอง/ฝ่าย + ประเภทบุคลากร) [บังคับ]
    │       ↓ validate: ต้องเลือกทั้งคู่
    ├─▶ Section 2: การใช้งานจริง (Adoption + Frequency) [บังคับ]
    │       ↓ validate: ต้องเลือกทั้งคู่
    ├─▶ Section 3: ประสบการณ์ & ปัญหา (Star ratings + Checkboxes)
    │
    ├─▶ Section 4: ข้อเสนอแนะ & สรุป (Support + Overall + Feedback text)
    │       ↓ กด "ส่งแบบสอบถาม"
    │       ↓ fetch POST → Apps Script → Google Sheets
    │
    └─▶ หน้า ThankYou → กด "ตอบอีกครั้ง" → กลับ Intro
```

### 5.2 Flow การดู Analytics

```
กดแท็บ "📊 วิเคราะห์"
    │
    ▼
useResponses hook → fetch GET → Apps Script → ดึงข้อมูลทั้งหมด
    │
    ▼
AnalyticsView render:
    ├── StatHeader: 4 KPI cards
    ├── 4 Charts (Doughnut + 3 Bar)
    ├── InsightCards: Top problems, Tech issues, Support needs
    ├── FeedbackList: ข้อความเสนอแนะ
    ├── Recommendations: ข้อเสนอแนะจากระบบ (auto-generated)
    └── ExportSection: Download CSV
```

---

## 6. โครงสร้างข้อมูล (Data Schema)

### 6.1 ตาราง Google Sheets — "Responses"

| คอลัมน์ | ชื่อ | ประเภท | ตัวอย่าง |
|---------|------|--------|---------|
| A | `id` | UUID string | `3f2a1b4c-...` |
| B | `department` | string | `กองคลัง` |
| C | `role` | string | `พนักงานเทศบาล` |
| D | `q1_adoption` | string | `ใช้งานเป็นประจำ` |
| E | `q2_frequency` | string | `ทุกวัน` |
| F | `q3_ease` | number (1–5) | `4` |
| G | `q4_speed` | number (1–5) | `3` |
| H | `q5_vs_paper` | number (1–5) | `5` |
| I | `q6_pain` | pipe-delimited | `ระบบช้า\|Login บ่อย` |
| J | `q7_technical` | pipe-delimited | `Internet ช้า` |
| K | `q8_support` | pipe-delimited | `คู่มือ\|อบรม` |
| L | `q9_overall` | number (1–5) | `4` |
| M | `feedback` | string | `ควรมีแอปมือถือ` |
| N | `submitted_at` | ISO 8601 | `2026-04-03T08:30:00.000Z` |

### 6.2 ตัวเลือกคำถาม (Constants)

**แผนก/กอง (`DEPARTMENTS`):**
กองยุทธศาสตร์, กองคลัง, กองช่าง, กองสาธารณสุข, กองการศึกษา, กองสวัสดิการ, สำนักปลัด

**ประเภทบุคลากร (`ROLES`):**
พนักงานเทศบาล, ลูกจ้างประจำ, พนักงานจ้างตามภารกิจ, พนักงานจ้างทั่วไป

**Q1 — สถานะ Adoption:**
ใช้งานเป็นประจำ, ใช้งานบางครั้ง, ยังไม่ได้ใช้

**Q2 — ความถี่:**
ทุกวัน, สัปดาห์ละ 3-4 ครั้ง, สัปดาห์ละ 1-2 ครั้ง, นานๆครั้งใช้, ยังไม่ได้ใช้

---

## 7. API Reference — Google Apps Script

**Base URL:**
```
https://script.google.com/macros/s/AKfycbwdazvXW_oWAAmxy-K7WCdCnK7Yy8PVZY-ewL51znSnV-xX3_w9M1zl2DnJvL9vZgI/exec
```

### 7.1 GET — ดึงข้อมูลทั้งหมด

```http
GET {BASE_URL}
```

**Response (Success):**
```json
{
  "ok": true,
  "data": [
    {
      "id": "uuid-...",
      "department": "กองคลัง",
      "role": "พนักงานเทศบาล",
      "q1_adoption": "ใช้งานเป็นประจำ",
      ...
    }
  ]
}
```

**Response (Empty):**
```json
{ "ok": true, "data": [] }
```

### 7.2 POST — บันทึกข้อมูลใหม่

```http
POST {BASE_URL}
Content-Type: application/json

{
  "department": "กองคลัง",
  "role": "พนักงานเทศบาล",
  "q1_adoption": "ใช้งานเป็นประจำ",
  "q2_frequency": "ทุกวัน",
  "q3_ease": 4,
  "q4_speed": 3,
  "q5_vs_paper": 5,
  "q6_pain": "ระบบช้า|Login บ่อย",
  "q7_technical": "Internet ช้า",
  "q8_support": "คู่มือ|อบรม",
  "q9_overall": 4,
  "feedback": "ควรมีแอปมือถือ",
  "submitted_at": "2026-04-03T08:30:00.000Z"
}
```

**Response (Success):**
```json
{ "ok": true, "id": "uuid-ที่สร้างใหม่" }
```

### 7.3 POST — ลบข้อมูล (Admin Only)

```http
POST {BASE_URL}
Content-Type: application/json

{
  "action": "delete",
  "id": "uuid-ที่ต้องการลบ"
}
```

**Response (Success):**
```json
{ "ok": true }
```

**Response (Not Found):**
```json
{ "ok": false, "error": "Record not found" }
```

> [!CAUTION]
> การลบข้อมูลต้องผ่านรหัสผ่าน `admin123` ซึ่งตรวจสอบฝั่ง Client-side อ่านส่วน Security สำหรับข้อจำกัด

---

## 8. Components อธิบายโดยละเอียด

### 8.1 Hooks

#### `useResponses.js`
```javascript
const { responses, refetch } = useResponses()
```
- เรียก `fetch(SHEET_ENDPOINT)` (GET) เมื่อ mount ครั้งแรก
- คืนค่า `responses[]` (array of records) และ `refetch()` function
- Coerce numeric fields (`q3_ease`, `q4_speed`, ฯลฯ) ด้วย `Number()` เพราะ Sheets คืนค่าเป็น string

#### `useSurveyForm.js`
```javascript
const { formData, currentSection, goSection, setField, toggleCheckbox, reset } = useSurveyForm()
```
- เก็บ state ของฟอร์มทั้งหมดใน `formData` object
- `goSection(n, showToast)` — validate section ปัจจุบันก่อนเดินหน้า
- `toggleCheckbox(key, value)` — สำหรับ multi-select (Q6, Q7, Q8)
- `reset()` — คืน state กลับเป็น initial และ scroll ขึ้นบน

#### `ToastContext.jsx`
```javascript
const showToast = useToast()
showToast('ข้อความ', 'success' | 'error' | 'warning' | 'info')
```
- Global notification ที่แสดงมุมล่างขวา
- Auto-dismiss หลัง 3 วินาที

### 8.2 Survey Components

| Component | ข้อมูลที่รับ | ข้อมูลที่ให้ |
|-----------|------------|------------|
| `Intro` | `responseCount`, `onStart` | แสดงหน้าแนะนำ, ปุ่มเริ่ม |
| `Section1` | `formData`, `setField`, `onNext` | เลือกกอง + ประเภทบุคลากร |
| `Section2` | `formData`, `setField`, `onBack`, `onNext` | Adoption + Frequency |
| `Section3` | `formData`, `setField`, `toggleCheckbox`, `onBack`, `onNext` | Star ratings + Pain/Tech checkboxes |
| `Section4` | `formData`, `setField`, `toggleCheckbox`, `onBack`, `onSubmit`, `isSubmitting` | Support + Overall + Feedback textarea |
| `ThankYou` | `onReset` | หน้าขอบคุณ |

### 8.3 Analytics Components

| Component | หน้าที่ |
|-----------|--------|
| `StatHeader` | คำนวณและแสดง KPI 4 ค่า: total, adoptRate, avgSat, avgUX |
| `ChartCard` | Glass wrapper ขนาดสูง 260px สำหรับ Chart.js |
| `InsightCard` | Parse pipe-delimited fields → ranked bar list (top 5) |
| `FeedbackList` | กรองและแสดง `feedback` ที่ไม่ว่าง พร้อม scroll |
| `AdminPanel` | amber dashed panel แสดงสถิติ + ปุ่มลบข้อมูล (toggle by Admin Mode) |
| `ExportSection` | สร้าง CSV ด้วย BOM (`\uFEFF`) ให้รองรับภาษาไทยใน Excel |

---

## 9. Design System — Glassmorphism

### 9.1 CSS Classes หลัก

| Class | ใช้สำหรับ | bg opacity | blur |
|-------|----------|-----------|------|
| `.glass-card` | Card หลัก | 9% | 18px |
| `.glass-dark` | Nav bar | 50% | 24px |
| `.glass-stat` | KPI cards | 7% | 14px |
| `.glass-insight` | Insight / Export cards | 10% (teal) | 15px |
| `.glass` | Badge / pill | 8% | 12px |
| `.glass-danger` | Destructive button | 12% (red) | 14px |

### 9.2 Fluid Typography (clamp)

```css
--text-xs:   clamp(0.70rem, 0.65rem + 0.25vw, 0.80rem)
--text-sm:   clamp(0.83rem, 0.78rem + 0.25vw, 0.95rem)
--text-base: clamp(0.95rem, 0.88rem + 0.35vw, 1.05rem)
--text-lg:   clamp(1.10rem, 1.00rem + 0.50vw, 1.30rem)
--text-2xl:  clamp(1.50rem, 1.25rem + 1.25vw, 2.10rem)
```

### 9.3 Responsive Breakpoints

| Breakpoint | ขนาดหน้าจอ | ตัวอย่าง |
|-----------|-----------|---------|
| Mobile (default) | < 640px | Grid 1 col, Section cards เต็มหน้าจอ |
| `sm:` | ≥ 640px | Grid 2 cols (departments, roles) |
| `md:` | ≥ 768px | Grid 2 cols (insight, KPI 4 cols) |
| `lg:` | ≥ 1024px | Grid 2 cols (charts) |

### 9.4 Background Animation
3 Floating Orbs + Dot Grid Pattern + EDMS Watermark (opacity 4%) หมุน -25°

---

## 10. Deployment

### 10.1 Vercel Configuration

**ไฟล์:** `vercel.json`

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Rewrite rule นี้ทำให้ทุก URL ชี้ไปที่ `index.html` ซึ่งจำเป็นสำหรับ React SPA

**`vite.config.js`:** `base: '/'` (ต่างจาก GitHub Pages ที่ต้องระบุ sub-path)

**เวลาที่ใช้:** ประมาณ 30–60 วินาทีหลัง `git push`

### 10.2 ขั้นตอนการ Deploy ครั้งแรก (Vercel)

1. ไปที่ [vercel.com](https://vercel.com) → **Add New Project**
2. เชื่อม GitHub repo: `poppatompong-dev/Follow-eSaraban`
3. Framework Preset: **Vite** (จะตั้งค่า Build Command: `npm run build`, Output: `dist` อัตโนมัติ)
4. กด **Deploy**
5. รับ URL เช่น `https://follow-esaraban.vercel.app`

### 10.3 ขั้นตอนการ Deploy ปรับปรุงโค้ด

```bash
git add .
git commit -m "feat: description"
git push
```

Vercel จะ build + deploy อัตโนมัติทุกครั้งที่ push ไปที่ branch main

### 10.4 ขั้นตอน Deploy Google Apps Script (เมื่อแก้ไข .gs)

> [!IMPORTANT]
> ทุกครั้งที่แก้ไขโค้ดใน `google-apps-script.gs` ต้อง Deploy ใหม่ใน Apps Script

1. เข้า [Google Sheets] → **Extensions → Apps Script**
2. วางโค้ดใหม่ทับของเดิม
3. กด **Deploy → New deployment** (ไม่ใช่ Manage)
4. Type: **Web App** / Execute as: **Me** / Access: **Anyone**
5. Copy URL ใหม่ → อัปเดตที่ `src/lib/api.js` → `SHEET_ENDPOINT`

---

## 11. Security

### 11.1 การป้องกันปัจจุบัน

| ฟีเจอร์ | วิธีการ | ระดับ |
|--------|--------|-------|
| ปุ่มล้างข้อมูล | รหัสผ่าน `admin123` (Client-side) | ⚠️ ต่ำ |
| Google Sheets | URL ยาวของ Apps Script (Security by obscurity) | ⚠️ ต่ำ |
| ข้อมูลผู้ตอบ | ไม่เก็บข้อมูลส่วนตัว (นิรนาม) | ✅ ดี |

> [!WARNING]
> รหัสผ่าน `admin123` ตรวจสอบ **ฝั่ง Client-side** เท่านั้น ผู้ที่มีความรู้ด้านเทคนิคสามารถ bypass ได้โดยการเรียก API โดยตรง เนื่องจากข้อมูลมีน้อยและไม่มีความลับ ถือว่ายอมรับได้ในบริบทนี้

### 11.2 ข้อควรระวัง
- Google Apps Script endpoint เปิดเป็น **Anyone** (ไม่จำกัดผู้เข้าถึง) เพื่อให้ React สามารถ POST ได้โดยไม่ต้อง Login
- หากต้องการความปลอดภัยสูงขึ้น ให้พิจารณาย้ายไป Firebase Firestore หรือ Supabase พร้อมระบบ Authentication

---

## 12. การบำรุงรักษา (Maintenance Guide)

### 12.1 การแก้ไขข้อมูล (Constants)

**ไฟล์:** `src/lib/constants.js`

- เพิ่ม/แก้ไขแผนก → แก้ `DEPARTMENTS[]`
- เพิ่ม/แก้ไขประเภทบุคลากร → แก้ `ROLES[]`
- เพิ่มตัวเลือกคำถาม → แก้ `Q1_OPTS[]` ถึง `Q8_OPTS[]`

> [!IMPORTANT]
> เมื่อเพิ่มตัวเลือกใหม่ใน `DEPARTMENTS` หรือ `ROLES` ข้อมูลเก่าใน Google Sheets จะยังคงถูกรวมใน Analytics (field `department` หรือ `role`) แต่จะไม่ตรงกับ options ใหม่ในกราฟ

### 12.2 การเพิ่มคำถามใหม่

1. เพิ่มค่าเริ่มต้นใน `useSurveyForm.js` → `INITIAL_FORM`
2. เพิ่ม field ใน `SurveyView.jsx` → `record` object
3. เพิ่ม field ใน `google-apps-script.gs` → `HEADERS[]`
4. เพิ่ม UI ใน Section ที่ต้องการ
5. เพิ่ม field ใน `src/lib/api.js` → `COLUMNS[]`
6. Deploy Apps Script ใหม่
7. Push โค้ด

### 12.3 การล้างข้อมูลทดสอบ

1. ไปที่ Tab **📊 วิเคราะห์**
2. กดปุ่ม **🗑️ ล้างข้อมูลทดสอบ**
3. ใส่รหัสผ่าน: **`admin123`**
4. ระบบจะลบทุก record ทีละรายการผ่าน API

*หรือ* เข้า Google Sheets โดยตรงแล้วลบแถวด้วยมือ (ยกเว้นแถวหัวตาราง แถวที่ 1)

### 12.4 การ Export ข้อมูล

1. ไปที่ Tab **📊 วิเคราะห์**
2. เลื่อนลงมาหาส่วน **📥 ส่งออกข้อมูล**
3. กด **📊 ดาวน์โหลด CSV**
4. ไฟล์จะชื่อ `EDMS-Survey-YYYY-MM-DD.csv` (UTF-8 BOM รองรับ Excel ภาษาไทย)

---

## 13. Troubleshooting

| ปัญหา | สาเหตุ | วิธีแก้ |
|------|--------|--------|
| ข้อมูลไม่แสดงใน Analytics | SHEET_ENDPOINT ผิด | ตรวจสอบ URL ใน `src/lib/api.js` |
| ส่งแบบสอบถามแล้วไม่บันทึก | Apps Script ไม่ได้ Deploy | Deploy ใหม่แบบ New Deployment |
| CSV เปิดแล้วอักษรภาษาไทยเสีย | Excel ไม่รู้จัก encoding | เปิดผ่าน Data → From Text/CSV แล้วเลือก UTF-8 |
| ไม่เห็น column `feedback` ใน Sheets | ใช้ Apps Script เวอร์ชันเก่า | Deploy เวอร์ชันใหม่ที่มี `feedback` ใน HEADERS |
| Vercel แสดง 404 เมื่อ refresh | ขาด `vercel.json` rewrite rule | ตรวจสอบว่ามี `vercel.json` ที่ rewrite ทุก path → `index.html` |
| Vercel แสดงหน้าขาว (blank) | `base` ใน vite.config.js ผิด | ต้องเป็น `base: '/'` ไม่ใช่ `/Follow-eSaraban/` |
| ปุ่มล้างข้อมูลไม่ทำงาน | ไม่มีข้อมูล หรือ endpoint ไม่พร้อม | ตรวจสอบ console error + ยืนยันมี records |

---

## 14. ข้อมูลทางเทคนิคเพิ่มเติม

### 14.1 Dependencies หลัก (`package.json`)

```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "chart.js": "^4.x",
  "react-chartjs-2": "^5.x",
  "lucide-react": "^0.x",
  "tailwindcss": "^3.x",
  "vite": "^5.x",
  "@vitejs/plugin-react": "^4.x",
  "autoprefixer": "^10.x",
  "postcss": "^8.x"
}
```

### 14.2 Build Output

```
dist/
├── index.html          ~1.24 kB
├── assets/
│   ├── index-*.css     ~20.66 kB (gzip: 4.87 kB)
│   └── index-*.js      ~337.48 kB (gzip: 112.96 kB)
```

### 14.3 ข้อจำกัดของ Google Sheets

| รายการ | ขีดจำกัด |
|--------|---------|
| จำนวนแถวสูงสุด | 10,000,000 cells |
| ขนาดไฟล์สูงสุด | 100 MB |
| Apps Script execution time | 6 นาที/ครั้ง |
| URL Fetch quota | 20,000 request/day |

สำหรับโปรเจกต์นี้ที่คาดว่าจะมีไม่เกิน 50 records ถือว่าไม่มีปัญหาด้านขีดจำกัดเลย

---

## 15. ผู้พัฒนาและผู้รับผิดชอบ

| บทบาท | ชื่อ |
|-------|------|
| **Project Owner** | เทศบาลเมืองอุทัยธานี |
| **Developer** | poppatompong-dev |
| **GitHub Repository** | `poppatompong-dev/Follow-eSaraban` |
| **วันที่พัฒนา** | เมษายน 2569 |

---

*เอกสารฉบับนี้จัดทำขึ้นสำหรับ eSaraban Survey System v1.0 · Last Updated: April 2026*
