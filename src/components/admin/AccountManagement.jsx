"use client"
import { useState, useEffect } from 'react'
import { supabase } from '@/supabaseClient'
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  MoreVertical,
  CheckCircle,
  XCircle
} from 'lucide-react'

export default function AccountManagement() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  useEffect(() => {
    let isMounted = true
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).then(({ data, error }) => {
      if (!isMounted) return
      if (error) return
      const normalized = (data || []).map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role || 'staff',
        status: u.status || 'active',
        joinDate: u.created_at?.split('T')[0],
        lastLogin: u.last_login || 'Never'
      }))
      setUsers(normalized)
      setFilteredUsers(normalized)
    })
    return () => { isMounted = false }
  }, [])

  useEffect(() => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter)
    }

    setFilteredUsers(filtered)
  }, [searchTerm, roleFilter, statusFilter, users])

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'manager':
        return 'bg-blue-100 text-blue-800'
      case 'staff':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const toggleUserStatus = async (id) => {
    const target = users.find(u => u.id === id)
    if (!target) return
    const nextStatus = target.status === 'active' ? 'inactive' : 'active'
    const { data, error } = await supabase.from('profiles').update({ status: nextStatus }).eq('id', id).select().single()
    if (!error && data) {
      setUsers(prev => prev.map(u => (u.id === id ? { ...u, status: data.status } : u)))
    }
  }

  const deleteUser = async (id) => {
    const { error } = await supabase.from('profiles').delete().eq('id', id)
    if (!error) setUsers(prev => prev.filter(user => user.id !== id))
  }

  const handleAddUser = async (userData) => {
    const { data, error } = await supabase.from('profiles').insert({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      status: userData.status
    }).select().single()
    if (!error && data) {
      const normalized = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        status: data.status,
        joinDate: data.created_at?.split('T')[0],
        lastLogin: 'Never'
      }
      setUsers(prev => [normalized, ...prev])
      setShowAddModal(false)
    }
  }

  const handleEditUser = async (userData) => {
    const { data, error } = await supabase.from('profiles').update({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      status: userData.status
    }).eq('id', editingUser.id).select().single()
    if (!error && data) {
      setUsers(prev => prev.map(u => (u.id === editingUser.id ? {
        ...u,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        status: data.status
      } : u)))
    }
    setEditingUser(null)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center lg:text-left">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 backdrop-blur-sm rounded-full text-sm font-medium text-blue-300 border border-blue-500/20 mb-4">
          <User className="w-4 h-4" />
          Account Management
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          <span className="gradient-text">User</span> Management
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl">Manage user accounts and permissions for your aquatics store.</p>
      </div>

      <div className="flex justify-between items-center">
        <div></div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-blue-500/20"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add User
        </button>
      </div>

      {/* Filters and Search */}
      <div className="glass-effect rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
            >
              <option value="all" className="bg-slate-800">All Roles</option>
              <option value="admin" className="bg-slate-800">Admin</option>
              <option value="manager" className="bg-slate-800">Manager</option>
              <option value="staff" className="bg-slate-800">Staff</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
            >
              <option value="all" className="bg-slate-800">All Status</option>
              <option value="active" className="bg-slate-800">Active</option>
              <option value="inactive" className="bg-slate-800">Inactive</option>
            </select>
            <button className="flex items-center px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-300 hover:scale-105 border border-slate-500/20">
              <Filter className="w-5 h-5 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-effect rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            Users ({filteredUsers.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/5 divide-y divide-white/10">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-white">{user.name}</div>
                        <div className="text-sm text-slate-400">{user.email}</div>
                        <div className="text-sm text-slate-400">{user.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'admin' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                      user.role === 'manager' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                      'bg-green-500/20 text-green-300 border border-green-500/30'
                    }`}>
                      <Shield className="w-3 h-3 mr-1" />
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      user.status === 'active' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                      'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      {user.status === 'active' ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {user.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-500/20 transition-colors"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.status === 'active' 
                            ? 'text-red-400 hover:text-red-300 hover:bg-red-500/20' 
                            : 'text-green-400 hover:text-green-300 hover:bg-green-500/20'
                        }`}
                        title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {user.status === 'active' ? (
                          <XCircle className="w-4 h-4" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddUser}
        />
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleEditUser}
        />
      )}
    </div>
  )
}

// Add User Modal Component
function AddUserModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'staff',
    status: 'active'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-effect rounded-2xl max-w-md w-full border border-white/20">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-bold text-white">Add New User</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              placeholder="Enter full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
            >
              <option value="staff" className="bg-slate-800">Staff</option>
              <option value="manager" className="bg-slate-800">Manager</option>
              <option value="admin" className="bg-slate-800">Admin</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-white/20 rounded-xl text-slate-300 hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 border border-blue-500/20"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Edit User Modal Component
function EditUserModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-effect rounded-2xl max-w-md w-full border border-white/20">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-bold text-white">Edit User</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              placeholder="Enter full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
            >
              <option value="staff" className="bg-slate-800">Staff</option>
              <option value="manager" className="bg-slate-800">Manager</option>
              <option value="admin" className="bg-slate-800">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
            >
              <option value="active" className="bg-slate-800">Active</option>
              <option value="inactive" className="bg-slate-800">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-white/20 rounded-xl text-slate-300 hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 border border-blue-500/20"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
