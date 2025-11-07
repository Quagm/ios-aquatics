"use client"

import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/ToastProvider'

async function apiFetchInquiries() {
  const res = await fetch('/api/inquiries', { method: 'GET', credentials: 'include' })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Failed to fetch inquiries')
  return data
}
async function apiDeleteInquiry(id) {
  const res = await fetch('/api/inquiries', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ id })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Failed to delete inquiry')
  return data
}

export default function InquiryHistory() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const { push } = useToast()

  const extractImageUrls = (text) => {
    if (!text || typeof text !== 'string') return []
    const urlRegex = /(https?:\/\/[^\s)]+)(?=\s|$)/g
    const knownImageExt = /\.(png|jpe?g|gif|webp|bmp|svg|tiff|heic|heif)(\?|#|$)/i
    const urls = []
    let m
    while ((m = urlRegex.exec(text)) !== null) {
      const u = m[1]
      if (knownImageExt.test(u) || u.includes('/storage/v1/object/public/')) {
        urls.push(u)
      }
    }
    return Array.from(new Set(urls))
  }

  const getCleanMessage = (text) => {
    if (!text || typeof text !== 'string') return ''
    const lines = text.split(/\r?\n/)
    const cleaned = lines.filter((line) => {
      const l = line.trim()
      if (l.toLowerCase().startsWith('- image reference')) return false
      if (l.toLowerCase().startsWith('- image references')) return false
      if (l.toLowerCase().startsWith('- image urls')) return false
      if (/^https?:\/\//i.test(l)) return false
      return true
    })
    return cleaned.join('\n').trim()
  }

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
    <div className="space-y-8 py-8 sm:py-12 lg:py-16 px-6 sm:px-8 lg:px-12">
      <div className="text-center lg:text-left">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 backdrop-blur-sm rounded-full text-sm font-medium text-blue-300 border border-blue-500/20 mb-4">
          Inquiry History
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          <span className="gradient-text">Inquiry</span> History
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl">Archived inquiries (completed or cancelled).</p>
      </div>

      <div>
        <div className="px-1 py-2">
          <h3 className="text-lg font-semibold text-white">Archived Inquiries ({inquiries.length})</h3>
        </div>
        <div className="space-y-3">
          {inquiries.map(inq => (
            <div
              key={inq.id}
              className="w-full glass-effect rounded-xl border border-white/10 p-4 hover:border-white/20 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedInquiry(inq)}
                  className="flex-1 text-left min-w-0"
                >
                  <h4 className="text-sm sm:text-base font-semibold text-white truncate">{inq.subject || 'No subject'}</h4>
                  <p className="text-slate-300 text-xs mt-0.5 truncate">
                    {(inq.first_name || '') + ' ' + (inq.last_name || '')} • {inq.email}
                  </p>
                </button>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full border border-white/20 text-white/80 capitalize whitespace-nowrap">{inq.status}</span>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{new Date(inq.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <button
                    type="button"
                    className="px-3 py-1.5 text-xs rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30"
                    onClick={async () => {
                      const ok = window.confirm('Delete this inquiry? This action cannot be undone.')
                      if (!ok) return
                      try {
                        await apiDeleteInquiry(inq.id)
                        setInquiries(prev => prev.filter(i => i.id !== inq.id))
                        if (selectedInquiry?.id === inq.id) setSelectedInquiry(null)
                        push({ title: 'Inquiry deleted', description: 'The inquiry was deleted successfully.', variant: 'success' })
                      } catch (e) {
                        push({ title: 'Delete failed', description: e?.message || 'Failed to delete inquiry', variant: 'error' })
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {(!loading && inquiries.length === 0) && (
            <div className="text-center text-slate-300 py-12 border border-dashed border-white/20 rounded-xl">No archived inquiries.</div>
          )}
        </div>
      </div>

      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-white/20 rounded-2xl shadow-xl p-6 pointer-events-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="min-w-0">
                <h3 className="text-xl font-semibold text-white break-words">{selectedInquiry.subject || 'No subject'}</h3>
                <p className="text-sm text-white/70 break-words">{(selectedInquiry.first_name || '') + ' ' + (selectedInquiry.last_name || '')} • {selectedInquiry.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-white/60 whitespace-nowrap">{new Date(selectedInquiry.created_at).toLocaleString()}</span>
                <span className="text-xs px-3 py-1 rounded-full border border-white/20 text-white/80 capitalize whitespace-nowrap">{selectedInquiry.status}</span>
              </div>
            </div>
            {}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-4">Account Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <div className="text-slate-400 text-sm">Full Name</div>
                  <div className="text-white">
                    {selectedInquiry.customer_snapshot?.name || 
                     `${(selectedInquiry.first_name || '')} ${(selectedInquiry.last_name || '')}`.trim() || '—'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Email Address</div>
                  <div className="text-white break-all">
                    {selectedInquiry.customer_snapshot?.email || selectedInquiry.email || '—'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Phone Number</div>
                  <div className="text-white">
                    {selectedInquiry.customer_snapshot?.phone || selectedInquiry.phone || '—'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Address</div>
                  <div className="text-white">
                    {selectedInquiry.customer_snapshot?.address || '—'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">City</div>
                  <div className="text-white">
                    {selectedInquiry.customer_snapshot?.city || '—'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Province</div>
                  <div className="text-white">
                    {selectedInquiry.customer_snapshot?.province || '—'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Postal Code</div>
                  <div className="text-white">
                    {selectedInquiry.customer_snapshot?.postal_code || '—'}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm text-white/80 whitespace-pre-line leading-relaxed">
              {getCleanMessage(selectedInquiry.message)}
            </div>
            {extractImageUrls(selectedInquiry.message).length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {extractImageUrls(selectedInquiry.message).map((url, idx) => (
                  <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden border border-white/20 bg-white/5">
                    <img src={url} alt={`reference-${idx + 1}`} className="w-full h-28 object-cover" />
                  </a>
                ))}
              </div>
            )}
            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-white border border-red-500/40"
                onClick={async () => {
                  const ok = window.confirm('Delete this inquiry? This action cannot be undone.')
                  if (!ok) return
                  try {
                    await apiDeleteInquiry(selectedInquiry.id)
                    setInquiries(prev => prev.filter(i => i.id !== selectedInquiry.id))
                    setSelectedInquiry(null)
                    push({ title: 'Inquiry deleted', description: 'The inquiry was deleted successfully.', variant: 'success' })
                  } catch (e) {
                    push({ title: 'Delete failed', description: e?.message || 'Failed to delete inquiry', variant: 'error' })
                  }
                }}
              >
                Delete
              </button>
              <div className="flex-1" />
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20"
                onClick={() => setSelectedInquiry(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
