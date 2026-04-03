import { useState, useCallback } from 'react'

const INITIAL_FORM = {
  department: '',
  role: '',
  q1_adoption: '',
  q2_frequency: '',
  q3_ease: 0,
  q4_speed: 0,
  q5_vs_paper: 0,
  q6_pain: [],
  q7_technical: [],
  q8_support: [],
  q9_overall: 0,
  feedback: '',
}

export function useSurveyForm() {
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [currentSection, setCurrentSection] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setField = useCallback((key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }, [])

  const toggleCheckbox = useCallback((key, value) => {
    setFormData(prev => {
      const arr = prev[key]
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value],
      }
    })
  }, [])

  /** Returns null if valid, or an error string if not */
  const validate = useCallback((section) => {
    if (section === 1 && (!formData.department || !formData.role))
      return 'กรุณาเลือกสังกัดและระดับตำแหน่ง'
    if (section === 2 && (!formData.q1_adoption || !formData.q2_frequency))
      return 'กรุณาตอบคำถามให้ครบ'
    return null
  }, [formData])

  const goSection = useCallback((n, showToast) => {
    if (n > currentSection) {
      const err = validate(currentSection)
      if (err) { showToast(err, 'warning'); return }
    }
    setCurrentSection(n)
    window.scrollTo?.({ top: 0, behavior: 'smooth' })
  }, [currentSection, validate])

  const reset = useCallback(() => {
    setFormData(INITIAL_FORM)
    setCurrentSection(1)
    setSubmitted(false)
  }, [])

  return {
    formData,
    currentSection,
    submitted,
    isSubmitting,
    setField,
    toggleCheckbox,
    goSection,
    setSubmitted,
    setIsSubmitting,
    reset,
  }
}
