"use client"

import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/ToastProvider'

// Reuse the same API used by InquiryManagement
async function apiFetchInquiries() {
  const res = await fetch('/api/inquiries', { method: 'GET', credentials: 'include' })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Failed to fetch inquiries')
  return data
}

export default function InquiryHistory() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const { push } = useToast()

  useEffect(() => {
    let mounted = true
    apiFetchInquiries()
      .then((data) => {
        if (!mounted) return
        const archived = (data || []).filter(i => i.status === 'completed' || i.status === 'cancelled')
        setInquiries(archived)
        if (archived.length === 0) {
          push({ title: 'No archived inquiries', description: 'No completed or cancelled inquiries found.', variant: 'default' })
        }
      })
      .catch((e) => {
        push({ title: 'Load failed', description: e?.message || 'Could not load inquiry history', variant: 'error' })
      })
      .finally(() => setLoading(false))
    return () => { mounted = false }
  }, [])

  return (
    <div className="space-y-8 ml-6">
      <div className="text-center lg:text-left">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 backdrop-blur-sm rounded-full text-sm font-medium text-blue-300 border border-blue-500/20 mb-4">
          Inquiry History
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          <span className="gradient-text">Inquiry</span> History
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl">Archived inquiries (completed or cancelled).</p>
      </div>

      <div className="glass-effect rounded-2xl border border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">Archived Inquiries ({inquiries.length})</h3>
        </div>
        <div className="divide-y divide-white/10">
          {inquiries.map(inq => (
            <div key={inq.id} className="px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{inq.subject || 'No subject'}</h3>
                  <p className="text-slate-300 text-sm mt-1">
                    {(inq.first_name || '') + ' ' + (inq.last_name || '')} • {inq.email}
                  </p>
                  <p className="text-slate-300 text-sm mt-2 whitespace-pre-line">{inq.message}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs px-2 py-1 rounded border border-white/20 text-white/80 capitalize">{inq.status}</span>
                  <span className="text-xs text-slate-400">{new Date(inq.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
          {(!loading && inquiries.length === 0) && (
            <div className="px-6 py-10 text-center text-slate-300">No archived inquiries.</div>
          )}
        </div>
      </div>
    </div>
  )
}
