"use client"
import { useState, useEffect } from 'react'
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
    // Simulate data fetching
    const mockInquiries = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1 234-567-8900',
        subject: 'Product Availability',
        message: 'Hi, I\'m interested in the Aquarium Filter Pro. Is it currently in stock?',
        status: 'pending',
        date: '2024-01-15',
        priority: 'medium'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@email.com',
        phone: '+1 234-567-8901',
        subject: 'Bulk Order Inquiry',
        message: 'We are a pet store looking to place a bulk order for fish food. Can you provide a quote?',
        status: 'replied',
        date: '2024-01-14',
        priority: 'high'
      },
      {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike.j@email.com',
        phone: '+1 234-567-8902',
        subject: 'Return Policy',
        message: 'I received a damaged product. What is your return policy?',
        status: 'resolved',
        date: '2024-01-13',
        priority: 'low'
      },
      {
        id: 4,
        name: 'Sarah Wilson',
        email: 'sarah.w@email.com',
        phone: '+1 234-567-8903',
        subject: 'Custom Aquarium Setup',
        message: 'I need help setting up a custom 50-gallon aquarium. Do you offer consultation services?',
        status: 'pending',
        date: '2024-01-12',
        priority: 'high'
      }
    ]
    setInquiries(mockInquiries)
    setFilteredInquiries(mockInquiries)
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
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'replied':
        return <Reply className="w-4 h-4 text-blue-500" />
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const updateInquiryStatus = (id, newStatus) => {
    setInquiries(prev => 
      prev.map(inquiry => 
        inquiry.id === id ? { ...inquiry, status: newStatus } : inquiry
      )
    )
  }

  const deleteInquiry = (id) => {
    setInquiries(prev => prev.filter(inquiry => inquiry.id !== id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Inquiry Management</h1>
        <p className="text-gray-600 mt-2">Manage customer inquiries and support requests</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="replied">Replied</option>
              <option value="resolved">Resolved</option>
            </select>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Inquiries ({filteredInquiries.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredInquiries.map((inquiry) => (
            <div key={inquiry.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{inquiry.name}</h4>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(inquiry.priority)}`}>
                      {inquiry.priority}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {getStatusIcon(inquiry.status)}
                      <span className="ml-1 capitalize">{inquiry.status}</span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{inquiry.subject}</p>
                  <p className="text-gray-700 mb-3">{inquiry.message}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {inquiry.email}
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {inquiry.phone}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {inquiry.date}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => setSelectedInquiry(inquiry)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => updateInquiryStatus(inquiry.id, 'replied')}
                    className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                    title="Mark as Replied"
                  >
                    <Reply className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => updateInquiryStatus(inquiry.id, 'resolved')}
                    className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                    title="Mark as Resolved"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteInquiry(inquiry.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Inquiry Details</h3>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                  <p className="mt-1 text-gray-900">{selectedInquiry.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-gray-900">{selectedInquiry.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-gray-900">{selectedInquiry.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <p className="mt-1 text-gray-900">{selectedInquiry.subject}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <p className="mt-1 text-gray-900">{selectedInquiry.date}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    updateInquiryStatus(selectedInquiry.id, 'replied')
                    setSelectedInquiry(null)
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
