import Header from './Header'
import Section1 from './Section1'
import Section2 from './Section2'
import Section3 from './Section3'
import Section4 from './Section4'
import ThankYou from './ThankYou'
import { useToast } from '../../context/ToastContext'
import { SHEET_ENDPOINT } from '../../lib/api'

// Orchestrates the multi-step survey form
export default function SurveyView({ form, config, responseCount, onSubmitSuccess }) {
  const showToast = useToast()
  const { formData, currentSection, submitted, isSubmitting,
          setField, toggleCheckbox, goSection,
          setSubmitted, setIsSubmitting, reset } = form

  async function handleSubmit() {
    if (isSubmitting) return

    // ── Demo mode (no endpoint configured) ──────────────────────
    if (!SHEET_ENDPOINT || SHEET_ENDPOINT === 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE') {
      showToast('Demo mode — ยังไม่ได้ตั้งค่า SHEET_ENDPOINT', 'info')
      setSubmitted(true)
      return
    }

    setIsSubmitting(true)
    const record = {
      department:   formData.department,
      role:         formData.role,
      q1_adoption:  formData.q1_adoption,
      q2_frequency: formData.q2_frequency,
      q3_ease:      formData.q3_ease     || 0,
      q4_speed:     formData.q4_speed    || 0,
      q5_vs_paper:  formData.q5_vs_paper || 0,
      q6_pain:      (formData.q6_pain      || []).join('|'),
      q7_technical: (formData.q7_technical || []).join('|'),
      q8_support:   (formData.q8_support   || []).join('|'),
      q9_overall:   formData.q9_overall  || 0,
      submitted_at: new Date().toISOString(),
    }

    try {
      const res  = await fetch(SHEET_ENDPOINT, {
        method:  'POST',
        body:    JSON.stringify(record),
      })
      const json = await res.json()
      if (json.ok) {
        setSubmitted(true)
        showToast('บันทึกข้อมูลเรียบร้อย!', 'success')
        onSubmitSuccess?.()   // trigger refetch in parent
      } else {
        showToast('เกิดข้อผิดพลาด: ' + (json.error || 'unknown'), 'error')
      }
    } catch (e) {
      showToast('เชื่อมต่อไม่ได้ กรุณาลองใหม่', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const goNext = (n) => goSection(n, showToast)

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {submitted ? (
        <ThankYou onReset={reset} />
      ) : (
        <>
          <Header
            config={config}
            responseCount={responseCount}
            currentSection={currentSection}
            totalSections={4}
          />

          <form onSubmit={e => e.preventDefault()}>
            {currentSection === 1 && (
              <Section1
                formData={formData}
                setField={setField}
                onNext={() => goNext(2)}
              />
            )}
            {currentSection === 2 && (
              <Section2
                formData={formData}
                setField={setField}
                onBack={() => goNext(1)}
                onNext={() => goNext(3)}
              />
            )}
            {currentSection === 3 && (
              <Section3
                formData={formData}
                setField={setField}
                toggleCheckbox={toggleCheckbox}
                onBack={() => goNext(2)}
                onNext={() => goNext(4)}
              />
            )}
            {currentSection === 4 && (
              <Section4
                formData={formData}
                setField={setField}
                toggleCheckbox={toggleCheckbox}
                onBack={() => goNext(3)}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </form>
        </>
      )}

      <footer className="text-center mt-12 text-teal-200/30 text-fluid-xs pb-4 font-mono">
        EDMS Digital Survey System · 2025
      </footer>
    </div>
  )
}
