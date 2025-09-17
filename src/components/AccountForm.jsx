"use client"
import { useEffect, useState } from "react"

export default function AccountForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" })

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem('account-info') : null
      if (raw) {
        const parsed = JSON.parse(raw)
        setForm({ name: parsed.name || "", email: parsed.email || "", phone: parsed.phone || "" })
      }
    } catch {}
  }, [])

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSave = () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('account-info', JSON.stringify(form))
        alert('Account information updated!')
      }
    } catch {}
  }

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-white border-b border-white/30 pb-3">
        Account Information
      </h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white mb-3">
            Full Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c47ff] text-white placeholder-white/70"
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white mb-3">
            Email Address
          </label>
          <input
            type="email"
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c47ff] text-white placeholder-white/70"
            placeholder="john@example.com"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white mb-3">
            Phone Number
          </label>
          <input
            type="tel"
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c47ff] text-white placeholder-white/70"
            placeholder="+63 912 345 6789"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
          />
        </div>
      </div>
      
      <button className="w-full bg-[#6c47ff] text-white py-3 rounded-full hover:bg-[#5a3ae6] transition-colors font-medium" onClick={handleSave}>
        Update Information
      </button>
    </div>
  )
}
