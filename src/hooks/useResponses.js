import { useState, useEffect, useRef } from 'react'
import { SHEET_ENDPOINT } from '../lib/api'

/**
 * Fetches all survey responses from Google Sheets via Apps Script.
 * Falls back gracefully when SHEET_ENDPOINT is not yet configured.
 */
export function useResponses() {
  const [responses, setResponses]   = useState([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    fetchResponses()
  }, [])

  async function fetchResponses() {
    if (!SHEET_ENDPOINT || SHEET_ENDPOINT === 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE') {
      console.warn('⚠️ SHEET_ENDPOINT not configured — running in local demo mode')
      return
    }

    setLoading(true)
    try {
      const res  = await fetch(SHEET_ENDPOINT)
      const json = await res.json()
      if (json.ok) {
        setResponses(
          json.data.map(r => ({
            ...r,
            // Coerce numeric fields stored as strings by Sheets
            q3_ease:     Number(r.q3_ease)     || 0,
            q4_speed:    Number(r.q4_speed)    || 0,
            q5_vs_paper: Number(r.q5_vs_paper) || 0,
            q9_overall:  Number(r.q9_overall)  || 0,
          }))
        )
      }
    } catch (e) {
      setError(e.message)
      console.error('fetchResponses error:', e)
    } finally {
      setLoading(false)
    }
  }

  return { responses, setResponses, loading, error, refetch: fetchResponses }
}
