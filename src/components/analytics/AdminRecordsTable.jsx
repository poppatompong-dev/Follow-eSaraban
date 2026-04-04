import { requestAdminCode } from '../../lib/admin'

function formatSubmittedAt(value) {
  if (!value) return '-'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)

  return date.toLocaleString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AdminRecordsTable({ visible, responses, deletingId, onDelete }) {
  if (!visible) return null

  return (
    <section className="glass-insight p-5 md:p-6 mb-6 animate-fade-in">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-fluid-base font-semibold text-teal-100">Admin Records</h3>
          <p className="text-fluid-xs text-teal-200/50">
            Delete specific survey rows without clearing the whole dataset.
          </p>
        </div>
        <span className="text-fluid-xs font-mono text-teal-300/60">
          {responses.length} rows
        </span>
      </div>

      {responses.length === 0 ? (
        <p className="text-fluid-sm text-teal-200/40">No survey rows available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-fluid-xs text-teal-50/85">
            <thead>
              <tr className="border-b border-white/10 text-teal-300/55">
                <th className="py-3 pr-4 font-medium">Submitted</th>
                <th className="py-3 pr-4 font-medium">Department</th>
                <th className="py-3 pr-4 font-medium">Role</th>
                <th className="py-3 pr-4 font-medium">Feedback</th>
                <th className="py-3 pr-0 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((record) => (
                <tr key={record.id} className="border-b border-white/5 align-top">
                  <td className="py-3 pr-4 text-teal-100/80">
                    {formatSubmittedAt(record.submitted_at)}
                  </td>
                  <td className="py-3 pr-4">{record.department || '-'}</td>
                  <td className="py-3 pr-4">{record.role || '-'}</td>
                  <td className="py-3 pr-4 max-w-[320px] text-teal-100/70">
                    <p className="line-clamp-2 break-words">{record.feedback || '-'}</p>
                  </td>
                  <td className="py-3 pl-4 pr-0 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        if (!requestAdminCode('delete this survey row')) return
                        onDelete(record)
                      }}
                      disabled={deletingId === record.id}
                      className="inline-flex items-center justify-center rounded-lg border border-red-400/25 px-3 py-1.5 text-fluid-xs font-semibold text-red-200 transition-all duration-200 hover:bg-red-500/15 hover:border-red-400/40 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === record.id ? 'Deleting...' : 'Delete row'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
