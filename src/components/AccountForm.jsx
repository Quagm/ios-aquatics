"use client"
import { useEffect, useState } from "react"

export default function AccountForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" })

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem('account-info') : null
      if (raw) {
        const parsed = JSON.parse(raw)
        setForm({ 
          name: parsed.name || "", 
          email: parsed.email || "", 
          phone: parsed.phone || "" 
        })
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
      {/* Title */}
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-white mb-2">Account Information</h2>
        <p className="text-sm text-white/60">Update your personal details below</p>
      </div>

      {/* Form */}
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Full Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-[#6c47ff] 
                       text-white placeholder-white/50 transition"
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Email Address
          </label>
          <input
            type="email"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-[#6c47ff] 
                       text-white placeholder-white/50 transition"
            placeholder="john@example.com"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-[#6c47ff] 
                       text-white placeholder-white/50 transition"
            placeholder="+63 912 345 6789"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
          />
        </div>
      </div>

      {/* Save Button */}
      <button 
        className="w-full bg-[#6c47ff] text-white py-3 rounded-lg font-semibold 
                   hover:bg-[#5a3ae6] transition-colors shadow-md hover:shadow-lg"
        onClick={handleSave}
      >
        Update Information
      </button>
    </div>
  )
}
