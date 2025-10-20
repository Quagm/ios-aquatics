"use client"
import { useEffect, useState } from "react"

export default function AccountForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", province: "", postal: "" })

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem('account-info') : null
      if (raw) {
        const parsed = JSON.parse(raw)
        setForm({ 
          name: parsed.name || "", 
          email: parsed.email || "", 
          phone: parsed.phone || "",
          address: parsed.address || "",
          city: parsed.city || "",
          province: parsed.province || "",
          postal: parsed.postal || ""
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
            className="w-full px-4 py-4 glass-effect border border-white/20 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50
                       text-white placeholder-slate-400 transition-all duration-300"
            placeholder="James Ygain"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            pattern="^[a-zA-Z]+(?: [a-zA-Z]+)*$"
            title="Name may contain letters and single spaces between words"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Email Address
          </label>
          <input
            type="email"
            className="w-full px-4 py-4 glass-effect border border-white/20 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50
                       text-white placeholder-slate-400 transition-all duration-300"
            placeholder="john@example.com"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
            title="Enter a valid email address (example@domain.com)"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            className="w-full px-4 py-4 glass-effect border border-white/20 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50
                       text-white placeholder-slate-400 transition-all duration-300"
            placeholder="+63 912 345 6789"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Address
          </label>
          <input
            type="text"
            className="w-full px-4 py-4 glass-effect border border-white/20 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50
                       text-white placeholder-slate-400 transition-all duration-300"
            placeholder="123 Main Street"
            value={form.address}
            onChange={(e) => update('address', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              City
            </label>
            <input
              type="text"
              className="w-full px-4 py-4 glass-effect border border-white/20 rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50
                         text-white placeholder-slate-400 transition-all duration-300"
              placeholder="Quezon City"
              value={form.city}
              onChange={(e) => update('city', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Province
            </label>
            <input
              type="text"
              className="w-full px-4 py-4 glass-effect border border-white/20 rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50
                         text-white placeholder-slate-400 transition-all duration-300"
              placeholder="Metro Manila"
              value={form.province}
              onChange={(e) => update('province', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Postal Code
            </label>
            <input
              type="text"
              className="w-full px-4 py-4 glass-effect border border-white/20 rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50
                         text-white placeholder-slate-400 transition-all duration-300"
              placeholder="1747"
              value={form.postal}
              onChange={(e) => update('postal', e.target.value)}
              pattern="^\d{5}(?:[-\s]?\d{4})?$"
              title="Enter a 5-digit postal code or ZIP+4 (e.g., 12345 or 12345-6789)"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button 
        className="group w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-2xl font-semibold 
                   hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-blue-500/20"
        onClick={handleSave}
      >
        Update Information
      </button>
    </div>
  )
}
