"use client"
import { useState, useEffect } from 'react'
import { supabase } from '@/supabaseClient'
import { fetchProducts, updateProduct as updateProductDb, deleteProductById } from '@/lib/queries'
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  DollarSign, 
  AlertTriangle,
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle
} from 'lucide-react'

// Helper to upload file via server-side API (avoids client RLS issues)
async function uploadViaApi(file) {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch('/api/upload', { method: 'POST', body: formData, credentials: 'include' })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Upload failed')
  return data.url
}

export default function InventoryManagement() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [stockEdits, setStockEdits] = useState({})

  // Basic stock status helper (placeholder until DB has stock fields)
  const getStockStatus = (stock = 0, minStock = 0) => {
    if (stock <= 0) return 'out-of-stock'
    if (stock <= minStock) return 'low-stock'
    return 'active'
  }

  // Server API update for toggling active
  async function apiUpdateProduct(id, updates) {
    const res = await fetch('/api/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id, updates })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.error || 'Update product failed')
    return data
  }

  const toggleActive = async (product) => {
    const next = !Boolean(product.active)
    try {
      const updated = await apiUpdateProduct(product.id, { active: next })
      setProducts(prev => prev.map(p => (p.id === product.id ? { ...p, ...updated } : p)))
    } catch (e) {
      alert(e?.message || 'Failed to update product status')
    }
  }

  useEffect(() => {
  let isMounted = true
  // Admin view: include inactive products
  fetchProducts({ includeInactive: true })
    .then((data) => {
      if (!isMounted) return
      const withStatus = data.map((p) => ({
        ...p,
        status: p.status || getStockStatus(p.stock || 0, p.minStock || 0),
        active: p.active || false,
        stock: typeof p.stock === 'number' ? p.stock : 0,
        minStock: typeof p.minStock === 'number' ? p.minStock : 0,
      }))
      setProducts(withStatus)
      setFilteredProducts(withStatus)
      setStockEdits(Object.fromEntries(withStatus.map(p => [p.id, p.stock || 0])))
    })
    .catch(() => {})
  return () => { isMounted = false }
}, [])

  useEffect(() => {
    let filtered = products

    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      filtered = filtered.filter(product =>
        (product?.name || '').toLowerCase().includes(q) ||
        (product?.sku || '').toLowerCase().includes(q) ||
        (product?.category || '').toLowerCase().includes(q)
      )
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(product => (product.status || 'active') === statusFilter)
    }

    setFilteredProducts(filtered)
  }, [searchTerm, categoryFilter, statusFilter, products])

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-300 border border-green-500/30'
      case 'low-stock':
        return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
      case 'out-of-stock':
        return 'bg-red-500/20 text-red-300 border border-red-500/30'
      default:
        return 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
    }
  }

  const deleteProduct = async (id) => {
    try {
      await deleteProductById(id)
      setProducts(prev => prev.filter(product => product.id !== id))
    } catch {}
  }

  const updateStockValue = (id, value) => {
    setStockEdits(prev => ({ ...prev, [id]: Math.max(0, Number(value) || 0) }))
  }

  const saveStock = async (product) => {
    try {
      const newStock = Math.max(0, Number(stockEdits[product.id] ?? product.stock ?? 0))
      const updated = await apiUpdateProduct(product.id, { stock: newStock })
      const next = {
        ...product,
        ...updated,
      }
      next.status = getStockStatus(next.stock || 0, next.minStock || 0)
      setProducts(prev => prev.map(p => (p.id === product.id ? next : p)))
    } catch (e) {
      alert(e?.message || 'Failed to update stock')
    }
  }

  const handleAddProduct = async (productData) => {
    try {
      let imageUrl = productData.image || '/placeholder-product.jpg'
      // If a file was provided, upload to Supabase Storage
      if (productData.imageFile) {
        imageUrl = await uploadViaApi(productData.imageFile)
      }

      const payload = {
        ...productData,
        image: imageUrl,
        price: Number(productData.price)
      }
      delete payload.imageFile
      delete payload.sku
      // Create via server API to bypass RLS
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      })
      const created = await res.json()
      if (!res.ok) throw new Error(created?.error || 'Create product failed')
      setProducts(prev => [created, ...prev])
      setShowAddModal(false)
    } catch (error) {
      console.error('Error adding product:', error)
      alert(`Add product failed: ${error?.message || 'Unknown error'}`)
    }
  }

  const handleEditProduct = async (productData) => {
    try {
      let imageUrl = productData.image || editingProduct.image || '/placeholder-product.jpg'
      if (productData.imageFile) {
        imageUrl = await uploadViaApi(productData.imageFile)
      }

      const updates = {
        ...productData,
        image: imageUrl,
        price: Number(productData.price)
      }
      delete updates.sku
      const updated = await updateProductDb(editingProduct.id, updates)
      setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)))
    } catch (error) {
      console.error('Error updating product:', error)
      alert(`Update product failed: ${error?.message || 'Unknown error'}`)
    }
    setEditingProduct(null)
  }

  const categories = ['AQUARIUMS', 'C02', 'SUBSTRATE/HARDSCAPE', 'FERTILIZER/BACTERIA', 'AIR PUMP', 'LIGHTS', 'FILTER', 'HEATER', 'Submersible Pump']

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center lg:text-left">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 backdrop-blur-sm rounded-full text-sm font-medium text-blue-300 border border-blue-500/20 mb-4">
          <Package className="w-4 h-4" />
          Inventory Management
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          <span className="gradient-text">Product</span> Inventory
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl">Manage your product inventory and stock levels for your aquatics store.</p>
      </div>

      <div className="flex justify-between items-center">
        <div></div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-blue-500/20"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Product
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
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
            >
              <option value="all" className="bg-slate-800">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category} className="bg-slate-800">{category}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
            >
              <option value="all" className="bg-slate-800">All Status</option>
              <option value="active" className="bg-slate-800">In Stock</option>
              <option value="low-stock" className="bg-slate-800">Low Stock</option>
              <option value="out-of-stock" className="bg-slate-800">Out of Stock</option>
            </select>
            <button className="flex items-center px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-300 hover:scale-105 border border-slate-500/20">
              <Filter className="w-5 h-5 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="glass-effect rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden hover:scale-105 group">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Package className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                    <p className="text-sm text-slate-400">{product.sku}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                    title="Edit Product"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                    title="Delete Product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Category:</span>
                  <span className="text-sm font-medium text-white">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Price:</span>
                  <span className="text-sm font-medium text-white">₱{product.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Status:</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(product.status)}`}>{product.status}</span>
                </div>
                <div className="flex justify-between items-center gap-3">
                  <span className="text-sm text-slate-400">Stock:</span>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-2 py-1 text-xs rounded bg-white/10 text-white hover:bg-white/20"
                      onClick={() => updateStockValue(product.id, (stockEdits[product.id] ?? product.stock ?? 0) - 1)}
                    >-</button>
                    <input
                      type="number"
                      value={stockEdits[product.id] ?? product.stock ?? 0}
                      onChange={(e) => updateStockValue(product.id, e.target.value)}
                      className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs"
                      min={0}
                    />
                    <button
                      className="px-2 py-1 text-xs rounded bg-white/10 text-white hover:bg-white/20"
                      onClick={() => updateStockValue(product.id, (stockEdits[product.id] ?? product.stock ?? 0) + 1)}
                    >+</button>
                    <button
                      className="px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => saveStock(product)}
                    >Save</button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleActive(product)}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border transition-colors 
                    ${product.active !== false 
                      ? 'bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30 hover:border-green-500/40'
                      : 'bg-slate-600/20 text-slate-200 border-slate-500/30 hover:bg-slate-600/30 hover:border-slate-500/40'}
                  `}
                  title={product.active !== false ? 'Set Inactive (hide from store)' : 'Set Active (show in store)'}
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {product.active !== false ? 'Active (Shown in Store)' : 'Inactive (Hidden)'}
                </button>
                <button
                  onClick={() => setEditingProduct(product)}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddProduct}
          categories={categories}
        />
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleEditProduct}
          categories={categories}
        />
      )}
    </div>
  )
}

// Add Product Modal Component
function AddProductModal({ onClose, onSave, categories }) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'AQUARIUMS',
    price: '',
    image: '',
    description: '',
    stock: 0,
    minStock: 0,
    imageFile: null
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      price: parseFloat(formData.price)
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-effect rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-bold text-white">Add New Product</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Product Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Product Code (SKU)</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                placeholder="e.g., FLTR-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-slate-800">{category}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm resize-none"
              placeholder="Write a short product description"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Price (₱)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Image</label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, imageFile: e.target.files?.[0] || null })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                />
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                  placeholder="Or paste an image URL"
                />
              </div>
            </div>
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
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Edit Product Modal Component
function EditProductModal({ product, onClose, onSave, categories }) {
  const [formData, setFormData] = useState({
    name: product.name,
    sku: product.sku || '',
    category: product.category,
    price: product.price.toString(),
    image: product.image || '',
    description: product.description || '',
    imageFile: null
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      price: parseFloat(formData.price)
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-effect rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-bold text-white">Edit Product</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Product Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-slate-800">{category}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm resize-none"
              placeholder="Write a short product description"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Price (₱)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Image</label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, imageFile: e.target.files?.[0] || null })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                />
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                  placeholder="Or paste an image URL"
                />
              </div>
            </div>
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
