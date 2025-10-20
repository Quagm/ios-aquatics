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
                <h3 className="text-lg font-semibold text-white truncate">{inq.subject || 'No subject'}</h3>
                <p className="text-slate-300 text-sm mt-1 truncate">
                  {(inq.first_name || '') + ' ' + (inq.last_name || '')} • {inq.email}
                </p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full border border-white/20 text-white/80 capitalize whitespace-nowrap">{inq.status || 'accepted'}</span>
            </div>
            <p className="text-slate-300 text-sm mt-3 line-clamp-4 whitespace-pre-line">{inq.message}</p>
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
    </div>
  )
}
