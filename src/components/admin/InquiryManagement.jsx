"use client"

import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/ToastProvider'
async function apiFetchInquiries() {
  const res = await fetch('/api/inquiries', { method: 'GET', credentials: 'include' })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Failed to fetch inquiries')
  return data
}
async function apiUpdateInquiryStatus(id, status, appointmentAt) {
  const res = await fetch('/api/inquiries', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ id, status, appointment_at: appointmentAt || null })
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
  const [schedulingInquiryId, setSchedulingInquiryId] = useState(null)
  const [appointmentInput, setAppointmentInput] = useState('')

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

  const updateInquiryStatus = async (id, newStatus) => {
    try {
      if (newStatus === 'completed') {
        setSchedulingInquiryId(id)
        setAppointmentInput('')
        return
      } else if (newStatus === 'cancelled') {
        const ok = window.confirm('Archive this inquiry? It will be moved to Inquiry History and removed from active inquiries.')
        if (!ok) return
      }

      const updated = await apiUpdateInquiryStatus(id, newStatus, null)
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

  const submitAppointment = async () => {
    try {
      const id = schedulingInquiryId
      if (!id) return
      if (!appointmentInput) {
        alert('Please select a date and time.')
        return
      }
      const dt = new Date(appointmentInput)
      if (isNaN(dt.getTime())) {
        alert('Invalid date/time. Please try again.')
        return
      }
      const updated = await apiUpdateInquiryStatus(id, 'completed', dt.toISOString())
      setSchedulingInquiryId(null)
      setAppointmentInput('')
      await loadInquiries()
      push({ title: 'Appointment scheduled', description: `Inquiry ${id} scheduled on ${new Date(updated.appointment_at || dt.toISOString()).toLocaleString()}.`, variant: 'success' })
    } catch (error) {
      push({ title: 'Update failed', description: error?.message || 'Failed to schedule appointment', variant: 'error' })
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
    <div className="space-y-6 py-8 sm:py-12 lg:py-16 px-6 sm:px-8 lg:px-12">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredInquiries.map((inq) => (
          <div key={inq.id} className="glass-effect rounded-2xl border border-white/10 mb-2 hover:border-white/20 transition-all shadow-lg p-4 sm:p-6 md:p-8">
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
                <select
                  value={inq.status}
                  onChange={e => updateInquiryStatus(inq.id, e.target.value)}
                  className="px-3 py-2 text-xs rounded bg-white/10 text-white focus:ring-2 focus:ring-blue-500 border border-white/20 min-w-[120px]"
                >
                  <option value="accepted" className="bg-slate-800">Accepted</option>
                  <option value="in_progress" className="bg-yellow-700">In Progress</option>
                  <option value="completed" className="bg-green-700">Completed</option>
                  <option value="cancelled" className="bg-red-700">Cancelled</option>
                </select>
                <button onClick={() => deleteInquiry(inq.id)} className="ml-auto px-3 py-2 text-xs rounded bg-red-600/20 text-red-200 hover:bg-red-600/30">Delete</button>
              </div>
            </div>
        ))}
        {filteredInquiries.length === 0 && (
          <div className="col-span-full text-center text-slate-300 py-12 border border-dashed border-white/20 rounded-xl">No inquiries found</div>
        )}
      </div>

      {selectedInquiry && (
        <div className="fixed inset-0 flex items-center justify-center px-2 py-4 z-50 pointer-events-none">
          <div className="glass-effect rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-white/20 p-4 sm:p-6 md:p-8 pointer-events-auto">
            <div className="border-b border-white/10 flex items-center justify-between pb-6 mb-6">
              <h3 className="text-xl font-bold text-white">Inquiry Details</h3>
              <button onClick={() => setSelectedInquiry(null)} className="px-3 py-1 rounded-lg bg-white/10 text-slate-200 hover:bg-white/20">Close</button>
            </div>
            <div className="space-y-6">
              <div>
                <div className="text-slate-400 text-sm">Subject</div>
                <div className="text-white text-lg font-semibold">{selectedInquiry.subject || 'No subject'}</div>
              </div>
              <div className="mt-3 text-slate-400 text-xs">
                {selectedInquiry.created_at ? new Date(selectedInquiry.created_at).toLocaleString() : ''}
              </div>
            </div>

            {/* Account Information Section */}
            <div>
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

            <div>
              <div className="text-slate-400 text-sm mb-1">Message</div>
              <div className="text-slate-200 whitespace-pre-line break-words">{getCleanMessage(selectedInquiry.message)}</div>
            </div>

            {extractImageUrls(selectedInquiry.message).length > 0 && (
              <div>
                <div className="text-slate-400 text-sm mb-2">Images</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {extractImageUrls(selectedInquiry.message).map((url, idx) => (
                    <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden border border-white/20 bg-white/5">
                      <img src={url} alt={`reference-${idx + 1}`} className="w-full h-32 object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-3">
              <select
                value={selectedInquiry.status}
                onChange={e => updateInquiryStatus(selectedInquiry.id, e.target.value)}
                className="px-3 py-2 text-xs rounded bg-white/10 text-white focus:ring-2 focus:ring-blue-500 border border-white/20 min-w-[120px]"
              >
                <option value="accepted" className="bg-slate-800">Accepted</option>
                <option value="in_progress" className="bg-yellow-700">In Progress</option>
                <option value="completed" className="bg-green-700">Completed</option>
                <option value="cancelled" className="bg-red-700">Cancelled</option>
              </select>
              <button onClick={() => { deleteInquiry(selectedInquiry.id); setSelectedInquiry(null) }} className="ml-auto px-3 py-2 text-xs rounded bg-red-600/20 text-red-200 hover:bg-red-600/30">Delete</button>
            </div>
          </div>
        </div>
      )}

      {schedulingInquiryId && (
        <div className="fixed inset-0 flex items-center justify-center px-2 py-4 z-50 pointer-events-none">
          <div className="glass-effect rounded-3xl max-w-md w-full border border-white/20 p-6 pointer-events-auto">
            <div className="border-b border-white/10 pb-4 mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Schedule Appointment</h3>
              <button onClick={() => { setSchedulingInquiryId(null); setAppointmentInput('') }} className="px-3 py-1 rounded-lg bg-white/10 text-slate-200 hover:bg-white/20">Close</button>
            </div>
            <div className="space-y-4">
              <label className="text-slate-300 text-sm" htmlFor="appointmentAt">Choose date & time</label>
              <input
                id="appointmentAt"
                type="datetime-local"
                value={appointmentInput}
                onChange={(e) => setAppointmentInput(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => { setSchedulingInquiryId(null); setAppointmentInput('') }} className="px-4 py-2 rounded-lg bg-white/10 text-slate-200 hover:bg-white/20">Cancel</button>
                <button onClick={submitAppointment} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
