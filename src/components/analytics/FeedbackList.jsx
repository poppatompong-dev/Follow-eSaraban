export default function FeedbackList({ responses }) {
  const feedbacks = responses
    .filter(r => r.feedback && r.feedback.trim() !== '')
    .map(r => r.feedback.trim())

  if (feedbacks.length === 0) {
    return <p className="text-fluid-xs text-teal-300/40">ยังไม่มีข้อเสนอแนะเพิ่มเติม</p>
  }

  return (
    <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
      {feedbacks.map((text, i) => (
        <li key={i} className="bg-white/5 rounded-xl p-4 text-fluid-sm text-white/90 border border-white/10 relative">
           <span className="absolute top-2 right-3 text-2xl opacity-10 font-serif">"</span>
           <p className="relative z-10 leading-relaxed italic pr-4">{text}</p>
        </li>
      ))}
    </ul>
  )
}
