"use client"

import { useState, useEffect } from 'react'
import { fetchInquiries, updateInquiryStatus as updateInquiryStatusDb, deleteInquiryById } from '@/lib/queries'
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

  useEffect(() => {
    let isMounted = true
    fetchInquiries()
      .then((data) => {
        if (!isMounted) return
        setInquiries(data)
        setFilteredInquiries(data)
      })
      .catch((error) => console.error("Failed to fetch inquiries:", error))
    return () => { isMounted = false }
  }, [])

  useEffect(() => {
    let filtered = inquiries

    if (searchTerm) {
      filtered = filtered.filter(inquiry =>
        inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(inquiry => inquiry.status === statusFilter)
    }

    setFilteredInquiries(filtered)
  }, [searchTerm, statusFilter, inquiries])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'replied': return <Reply className="w-4 h-4 text-blue-500" />
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-500" />
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
      const updated = await updateInquiryStatusDb(id, newStatus)
      setInquiries(prev => prev.map(i => (i.id === id ? updated : i)))
    } catch (error) {
      console.error("Failed to update inquiry status:", error)
    }
  }

  const deleteInquiry = async (id) => {
    try {
      await deleteInquiryById(id)
      setInquiries(prev => prev.filter(inquiry => inquiry.id !== id))
    } catch (error) {
      console.error("Failed to delete inquiry:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* ...rest of your JSX remains the same, no other functional changes needed */}
    </div>
  )
}
