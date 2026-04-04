import { useState } from 'react'
import { ToastProvider }  from './context/ToastContext'
import { useResponses }   from './hooks/useResponses'
import { useSurveyForm }  from './hooks/useSurveyForm'
import { requestAdminCode } from './lib/admin'
import AdminBar           from './components/AdminBar'
import TabNav             from './components/TabNav'
import SurveyView         from './components/survey/SurveyView'
import AnalyticsView      from './components/analytics/AnalyticsView'

// ─── Animated Background ─────────────────────────────────────────
function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">

      {/* Base deep teal gradient */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(145deg, #0c6660 0%, #0f766e 30%, #115e59 65%, #0d4b45 100%)' }}
      />

      {/* Subtle dot-grid pattern */}
      <div className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Orb 1 — large teal top-left */}
      <div className="absolute rounded-full animate-float"
        style={{
          width: 'clamp(300px,55vw,680px)', height: 'clamp(300px,55vw,680px)',
          top: '-18%', left: '-12%',
          background: 'radial-gradient(circle, rgba(20,184,166,0.28) 0%, transparent 65%)',
          animationDelay: '0s',
        }}
      />
      {/* Orb 2 — emerald bottom-right */}
      <div className="absolute rounded-full animate-float"
        style={{
          width: 'clamp(240px,42vw,540px)', height: 'clamp(240px,42vw,540px)',
          bottom: '-18%', right: '-8%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.22) 0%, transparent 65%)',
          animationDelay: '3.5s',
        }}
      />
      {/* Orb 3 — small cyan center-right */}
      <div className="absolute rounded-full animate-float"
        style={{
          width: 'clamp(140px,24vw,320px)', height: 'clamp(140px,24vw,320px)',
          top: '35%', left: '55%',
          background: 'radial-gradient(circle, rgba(45,212,191,0.14) 0%, transparent 70%)',
          animationDelay: '1.8s',
        }}
      />
      {/* Orb 4 — subtle amber accent, top-right */}
      <div className="absolute rounded-full animate-float"
        style={{
          width: 'clamp(100px,15vw,220px)', height: 'clamp(100px,15vw,220px)',
          top: '8%', right: '12%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
          animationDelay: '5s',
        }}
      />

      {/* ── Watermark ──────────────────────────────────────────── */}
      {/* Diagonal EDMS text, very low opacity — per glassmorphism skill */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        style={{ transform: 'rotate(-25deg) scale(1.4)' }}
      >
        <div className="flex flex-col gap-16 opacity-[0.04]">
          {[0, 1, 2].map(row => (
            <div key={row} className="flex gap-20 whitespace-nowrap">
              {[0, 1, 2, 3].map(col => (
                <span key={col} className="font-mono font-bold text-white leading-none"
                  style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
                  EDMS
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom light vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-40"
        style={{ background: 'linear-gradient(to top, rgba(10,40,38,0.4), transparent)' }}
      />
    </div>
  )
}

// ─── App Root ─────────────────────────────────────────────────────
export default function App() {
  const [activeTab,    setActiveTab]    = useState('survey')
  const [adminVisible, setAdminVisible] = useState(false)
  const [adminUnlocked, setAdminUnlocked] = useState(false)
  const [secretTapCount, setSecretTapCount] = useState(0)
  const [lastSecretTapAt, setLastSecretTapAt] = useState(0)

  const { responses, refetch } = useResponses()
  const form = useSurveyForm()

  async function handleSubmitSuccess() {
    await refetch()
    setActiveTab('analytics')
  }

  function handleSecretAdminTap() {
    const now = Date.now()
    const nextCount = now - lastSecretTapAt > 1500 ? 1 : secretTapCount + 1

    setLastSecretTapAt(now)
    setSecretTapCount(nextCount)

    if (nextCount < 5) return

    setSecretTapCount(0)

    if (!requestAdminCode('unlock admin mode')) {
      window.alert('Incorrect admin code.')
      return
    }

    setAdminUnlocked(true)
    setAdminVisible(true)
    setActiveTab('analytics')
  }

  function handleExitAdminMode() {
    setAdminUnlocked(false)
    setAdminVisible(false)
    setSecretTapCount(0)
  }

  return (
    <ToastProvider>
      <Background />

      <div className="relative min-h-dvh w-full overflow-x-hidden">
        <AdminBar
          unlocked={adminUnlocked}
          onSecretTap={handleSecretAdminTap}
          onTogglePanel={() => setAdminVisible(v => !v)}
          onExit={handleExitAdminMode}
        />
        <TabNav activeTab={activeTab} onSwitch={setActiveTab} />

        <main>
          {activeTab === 'survey' ? (
            <SurveyView
              form={form}
              config={null}
              responseCount={responses.length}
              onSubmitSuccess={handleSubmitSuccess}
            />
          ) : (
            <AnalyticsView
              responses={responses}
              adminVisible={adminUnlocked && adminVisible}
              refetch={refetch}
            />
          )}
        </main>
      </div>
    </ToastProvider>
  )
}
