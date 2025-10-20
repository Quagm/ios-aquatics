"use client"

import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/ToastProvider'
// Use server API to bypass RLS
async function apiFetchInquiries() {
  const res = await fetch('/api/inquiries', { method: 'GET', credentials: 'include' })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Failed to fetch inquiries')
  return data
}
async function apiUpdateInquiryStatus(id, status) {
  const res = await fetch('/api/inquiries', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ id, status })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Failed to update inquiry')
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
import { 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Calendar, 
  Eye, 
  Reply, 
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

export default function InquiryManagement() {
  const [inquiries, setInquiries] = useState([])
  const [filteredInquiries, setFilteredInquiries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const { push } = useToast()

  const loadInquiries = async () => {
    try {
      const data = await apiFetchInquiries()
      setInquiries(data)
      setFilteredInquiries(data)
    } catch (e) {
      push({ title: 'Load failed', description: e?.message || 'Could not load inquiries', variant: 'error' })
    }
  }

  useEffect(() => {
    let isMounted = true
    loadInquiries().catch(() => {})
    return () => { isMounted = false }
  }, [])

  useEffect(() => {
    let filtered = inquiries

    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      filtered = filtered.filter(inquiry => {
        const fullName = `${inquiry.first_name || ''} ${inquiry.last_name || ''}`.trim().toLowerCase()
        return (
          fullName.includes(q) ||
          (inquiry.email || '').toLowerCase().includes(q) ||
          (inquiry.subject || '').toLowerCase().includes(q)
        )
      })
    }

    // Exclude archived (completed/cancelled) from active by default
    filtered = filtered.filter(inquiry => inquiry.status !== 'completed' && inquiry.status !== 'cancelled')

    if (statusFilter !== 'all') {
      filtered = filtered.filter(inquiry => inquiry.status === statusFilter)
    }

    setFilteredInquiries(filtered)
  }, [searchTerm, statusFilter, inquiries])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return <Reply className="w-4 h-4 text-blue-500" />
      case 'in_progress': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'cancelled': return <AlertCircle className="w-4 h-4 text-red-500" />
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Extract image URLs from free-form message text
  const extractImageUrls = (text) => {
    if (!text || typeof text !== 'string') return []
    // Look for any http/https URLs, keep those that look like images or Supabase public links
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

  // Clean message by removing image reference metadata lines
  const getCleanMessage = (text) => {
    if (!text || typeof text !== 'string') return ''
    const lines = text.split(/\r?\n/)
    const cleaned = lines.filter((line) => {
      const l = line.trim()
      if (l.toLowerCase().startsWith('- image references')) return false
      if (l.toLowerCase().startsWith('- image urls')) return false
      // Drop bare URL-only lines that are part of the image block
      if (/^https?:\/\//i.test(l)) return false
      return true
    })
    return cleaned.join('\n').trim()
  }

  const updateInquiryStatus = async (id, newStatus) => {
    try {
      if (newStatus === 'completed' || newStatus === 'cancelled') {
        const ok = window.confirm('Archive this inquiry? It will be moved to Inquiry History and removed from active inquiries.')
        if (!ok) return
      }
      const updated = await apiUpdateInquiryStatus(id, newStatus)
      await loadInquiries()
      if (updated.status === 'completed' || updated.status === 'cancelled') {
        push({ title: 'Inquiry archived', description: `Inquiry ${id} moved to history.`, variant: 'success' })
      } else {
        push({ title: 'Inquiry updated', description: `Inquiry ${id} set to ${updated.status}.`, variant: 'success' })
      }
    } catch (error) {
      push({ title: 'Update failed', description: error?.message || 'Failed to update inquiry', variant: 'error' })
    }
  }

  const deleteInquiry = async (id) => {
    try {
      const ok = window.confirm('Delete this inquiry? This action cannot be undone.')
      if (!ok) return
      await apiDeleteInquiry(id)
      await loadInquiries()
      push({ title: 'Inquiry deleted', description: `Inquiry ${id} has been deleted.`, variant: 'success' })
    } catch (error) {
      push({ title: 'Delete failed', description: error?.message || 'Failed to delete inquiry', variant: 'error' })
    }
  }

  return (
    <div className="space-y-6 ml-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by name, email, subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
        >
          <option value="all" className="bg-slate-800">All Status</option>
          <option value="accepted" className="bg-slate-800">Accepted</option>
          <option value="in_progress" className="bg-slate-800">In Progress</option>
          <option value="completed" className="bg-slate-800">Completed</option>
          <option value="cancelled" className="bg-slate-800">Cancelled</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInquiries.map((inq) => (
          <div key={inq.id} className="glass-effect rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3
                  onClick={() => setSelectedInquiry(inq)}
                  className="text-lg font-semibold text-white truncate cursor-pointer hover:underline"
                >
                  {inq.subject || 'No subject'}
                </h3>
                <p className="text-slate-300 text-sm mt-1 truncate">
                  {(inq.first_name || '') + ' ' + (inq.last_name || '')} • {inq.email}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedInquiry(inq)}
                  className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <span className="text-xs px-2 py-1 rounded-full border border-white/20 text-white/80 capitalize whitespace-nowrap">{inq.status || 'accepted'}</span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => updateInquiryStatus(inq.id, 'accepted')} className="px-3 py-2 text-xs rounded bg-white/10 text-white hover:bg-white/20">Accepted</button>
              <button onClick={() => updateInquiryStatus(inq.id, 'in_progress')} className="px-3 py-2 text-xs rounded bg-yellow-600/20 text-yellow-200 hover:bg-yellow-600/30">In Progress</button>
              <button onClick={() => updateInquiryStatus(inq.id, 'completed')} className="px-3 py-2 text-xs rounded bg-green-600/20 text-green-200 hover:bg-green-600/30">Completed</button>
              <button onClick={() => updateInquiryStatus(inq.id, 'cancelled')} className="px-3 py-2 text-xs rounded bg-red-600/20 text-red-200 hover:bg-red-600/30">Cancelled</button>
              <button onClick={() => deleteInquiry(inq.id)} className="ml-auto px-3 py-2 text-xs rounded bg-red-600/20 text-red-200 hover:bg-red-600/30">Delete</button>
            </div>
          </div>
        ))}
        {filteredInquiries.length === 0 && (
          <div className="col-span-full text-center text-slate-300 py-12 border border-dashed border-white/20 rounded-xl">No inquiries found</div>
        )}
      </div>

      {/* View Inquiry Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-effect rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Inquiry Details</h3>
              <button onClick={() => setSelectedInquiry(null)} className="px-3 py-1 rounded-lg bg-white/10 text-slate-200 hover:bg-white/20">Close</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-slate-400 text-sm">Subject</div>
                    <div className="text-white text-lg font-semibold">{selectedInquiry.subject || 'No subject'}</div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full border border-white/20 text-white/80 capitalize whitespace-nowrap">{selectedInquiry.status || 'accepted'}</span>
                </div>
                <div className="mt-2 text-slate-400 text-xs">
                  {selectedInquiry.created_at ? new Date(selectedInquiry.created_at).toLocaleString() : ''}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-slate-400 text-sm">Name</div>
                  <div className="text-white">{(selectedInquiry.first_name || '') + ' ' + (selectedInquiry.last_name || '')}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Email</div>
                  <div className="text-white break-all">{selectedInquiry.email}</div>
                </div>
                {selectedInquiry.phone && (
                  <div>
                    <div className="text-slate-400 text-sm">Phone</div>
                    <div className="text-white">{selectedInquiry.phone}</div>
                  </div>
                )}
              </div>

              <div>
                <div className="text-slate-400 text-sm mb-1">Message</div>
                <div className="text-slate-200 whitespace-pre-line break-words">{getCleanMessage(selectedInquiry.message)}</div>
              </div>

              {extractImageUrls(selectedInquiry.message).length > 0 && (
                <div>
                  <div className="text-slate-400 text-sm mb-2">Images</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {extractImageUrls(selectedInquiry.message).map((url, idx) => (
                      <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden border border-white/20 bg-white/5">
                        <img src={url} alt={`reference-${idx + 1}`} className="w-full h-32 object-cover" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                <button onClick={() => updateInquiryStatus(selectedInquiry.id, 'accepted')} className="px-3 py-2 text-xs rounded bg-white/10 text-white hover:bg-white/20">Accepted</button>
                <button onClick={() => updateInquiryStatus(selectedInquiry.id, 'in_progress')} className="px-3 py-2 text-xs rounded bg-yellow-600/20 text-yellow-200 hover:bg-yellow-600/30">In Progress</button>
                <button onClick={() => updateInquiryStatus(selectedInquiry.id, 'completed')} className="px-3 py-2 text-xs rounded bg-green-600/20 text-green-200 hover:bg-green-600/30">Completed</button>
                <button onClick={() => updateInquiryStatus(selectedInquiry.id, 'cancelled')} className="px-3 py-2 text-xs rounded bg-red-600/20 text-red-200 hover:bg-red-600/30">Cancelled</button>
                <button onClick={() => { deleteInquiry(selectedInquiry.id); setSelectedInquiry(null) }} className="ml-auto px-3 py-2 text-xs rounded bg-red-600/20 text-red-200 hover:bg-red-600/30">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
