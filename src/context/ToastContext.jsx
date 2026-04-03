import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

const COLORS = {
  success: 'bg-emerald-500/90 border-emerald-400/40',
  error:   'bg-red-500/90 border-red-400/40',
  warning: 'bg-amber-500/90 border-amber-400/40',
  info:    'bg-sky-500/90 border-sky-400/40',
}

const ICONS = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' }

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((msg, type = 'info') => {
    setToast({ msg, type, id: Date.now() })
    setTimeout(() => setToast(null), 2800)
  }, [])

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast && (
        <div
          key={toast.id}
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-white text-sm font-medium shadow-xl border backdrop-blur-glass animate-toast ${COLORS[toast.type]}`}
        >
          <span>{ICONS[toast.type]}</span>
          <span>{toast.msg}</span>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
