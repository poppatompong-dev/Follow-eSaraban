import { useState } from 'react'
import { ToastProvider }  from './context/ToastContext'
import { useResponses }   from './hooks/useResponses'
import { useSurveyForm }  from './hooks/useSurveyForm'
import AdminBar           from './components/AdminBar'
import TabNav             from './components/TabNav'
import SurveyView         from './components/survey/SurveyView'
import AnalyticsView      from './components/analytics/AnalyticsView'

// ─── Animated orb background ─────────────────────────────────────
// Per glassmorphism skill: must have rich, colorful background for frost effect
function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Base gradient */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, #0f766e 0%, #115e59 45%, #134e4a 100%)' }}
      />
      {/* Orb 1 — large teal top-left, fluid size */}
      <div className="absolute rounded-full animate-float"
        style={{
          width: 'clamp(280px,50vw,600px)', height: 'clamp(280px,50vw,600px)',
          top: '-12%', left: '-10%',
          background: 'radial-gradient(circle, rgba(20,184,166,0.22) 0%, transparent 70%)',
          animationDelay: '0s',
        }}
      />
      {/* Orb 2 — emerald bottom-right */}
      <div className="absolute rounded-full animate-float"
        style={{
          width: 'clamp(220px,40vw,500px)', height: 'clamp(220px,40vw,500px)',
          bottom: '-15%', right: '-8%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)',
          animationDelay: '3.5s',
        }}
      />
      {/* Orb 3 — mid-screen accent, small */}
      <div className="absolute rounded-full animate-float"
        style={{
          width: 'clamp(120px,22vw,280px)', height: 'clamp(120px,22vw,280px)',
          top: '38%', left: '58%',
          background: 'radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%)',
          animationDelay: '1.8s',
        }}
      />
    </div>
  )
}

// ─── App Root ─────────────────────────────────────────────────────
export default function App() {
  const [activeTab,    setActiveTab]    = useState('survey')
  const [adminVisible, setAdminVisible] = useState(false)

  const { responses, refetch } = useResponses()
  const form = useSurveyForm()

  return (
    <ToastProvider>
      <Background />

      <div className="relative min-h-dvh w-full overflow-x-hidden">
        {/* Admin bar */}
        <AdminBar onTogglePanel={() => setAdminVisible(v => !v)} />

        {/* Tab navigation */}
        <TabNav activeTab={activeTab} onSwitch={setActiveTab} />

        {/* Page content */}
        <main>
          {activeTab === 'survey' ? (
            <SurveyView
              form={form}
              config={null}
              responseCount={responses.length}
              onSubmitSuccess={refetch}
            />
          ) : (
            <AnalyticsView
              responses={responses}
              adminVisible={adminVisible}
              refetch={refetch}
            />
          )}
        </main>
      </div>
    </ToastProvider>
  )
}
