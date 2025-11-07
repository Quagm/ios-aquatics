"use client"
import { useEffect, useState } from "react"
import { useUser } from '@clerk/nextjs'

export default function AccountForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", province: "", postal: "" })
  const [errors, setErrors] = useState({})
  const { user, isLoaded: isClerkLoaded } = useUser()
  const clerkEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || ""

  useEffect(() => {
    const loadAccountInfo = async () => {
      try {
        const res = await fetch('/api/account', {
          credentials: 'include'
        })
        if (res.ok) {
          const data = await res.json()
          if (data) {
            setForm({ 
              name: data.name || "", 
              email: data.email || "", 
              phone: data.phone || "",
              address: data.address || "",
              city: data.city || "",
              province: data.province || "",
              postal: data.postal || ""
            })
          }
        }
      } catch (err) {
        console.error('Failed to load account info:', err)
      }
    }
    if (isClerkLoaded && user) {
      loadAccountInfo()
    }
  }, [isClerkLoaded, user])

  useEffect(() => {
    if (!isClerkLoaded) return
    if (clerkEmail) {
      setForm(prev => ({ ...prev, email: clerkEmail }))
    }
  }, [isClerkLoaded, clerkEmail])

  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const handleSave = async () => {
    const nextErrors = {}

    const nameRegex = /^(?=.{2,100}$)[A-Za-zÀ-ÿ]+(?:[ '\-][A-Za-zÀ-ÿ]+)*$/
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const phoneRegex = /^(?:\+63\s?9\d{2}\s?\d{3}\s?\d{4}|09\d{9})$/
    const cityProvRegex = /^(?=.{2,50}$)[A-Za-zÀ-ÿ]+(?:[ .,'-][A-Za-zÀ-ÿ]+)*$/
    const postalRegex = /^\d{4}$/

    if (!nameRegex.test((form.name || '').trim())) nextErrors.name = 'Enter a valid full name'
    if (!emailRegex.test((form.email || '').trim())) nextErrors.email = 'Enter a valid email address'
    if (!phoneRegex.test((form.phone || '').replace(/\s+/g, ''))) nextErrors.phone = 'Use +63 9xx xxx xxxx or 09xxxxxxxxx'
    if ((form.address || '').trim().length < 5) nextErrors.address = 'Enter a valid street address'
    if (!cityProvRegex.test((form.city || '').trim())) nextErrors.city = 'Enter a valid city'
    if (!cityProvRegex.test((form.province || '').trim())) nextErrors.province = 'Enter a valid province'
    if (!postalRegex.test((form.postal || '').trim())) nextErrors.postal = 'Enter a 4-digit postal code'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    try {
      const trimmed = {
        name: (form.name || '').trim(),
        email: (clerkEmail || form.email || '').trim(),
        phone: (form.phone || '').replace(/\s+/g, ''),
        address: (form.address || '').trim(),
        city: (form.city || '').trim(),
        province: (form.province || '').trim(),
        postal: (form.postal || '').trim()
      }
      
      const res = await fetch('/api/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(trimmed)
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Failed to save account information')
      }

      alert('Account information updated!')
    } catch (err) {
      console.error('Failed to save account info:', err)
      alert(`Failed to save: ${err?.message || 'Unknown error'}`)
    }
  }

  const handleReset = async () => {
    const confirmed = window.confirm('Reset all account information?')
    if (!confirmed) return
    
    try {
      const res = await fetch('/api/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: "",
          email: clerkEmail || "",
          phone: "",
          address: "",
          city: "",
          province: "",
          postal: ""
        })
      })

      if (res.ok) {
        setForm({ name: "", email: clerkEmail || "", phone: "", address: "", city: "", province: "", postal: "" })
        setErrors({})
        alert('Account information reset!')
      } else {
        throw new Error('Failed to reset account information')
      }
    } catch (err) {
      console.error('Failed to reset account info:', err)
      alert(`Failed to reset: ${err?.message || 'Unknown error'}`)
    }
  }

  return (
    <div className="space-y-10">
      <div className="h-4 sm:h-6 lg:h-8"></div>
      <div className="flex">
        <div className="w-4 sm:w-6 lg:w-8 flex-shrink-0"></div>
        <div className="flex-1 space-y-10">
      {}
      <div className="text-center md:text-left mb-4">
        <h2 className="text-2xl font-bold text-white mb-3">Account Information</h2>
        <div className="h-5"></div>
      </div>

      {}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white mb-3">
            Full Name
          </label>
          <input
            type="text"
            className="w-full px-5 py-5 glass-effect border border-white/20 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50
                       text-white placeholder-slate-400 transition-all duration-300"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            pattern="^(?=.{2,100}$)[A-Za-zÀ-ÿ]+(?:[ '\\-][A-Za-zÀ-ÿ]+)*$"
            title="Letters, spaces, apostrophes, hyphens; 2-100 chars"
          />
          {errors.name && <p className="text-red-300 text-xs mt-2">{errors.name}</p>}
        </div>
        <div className="h-2 sm:h-3 lg:h-4"></div>
        
        <div>
          <label className="block text-sm font-medium text-white mb-3">
            Email Address
          </label>
          <input
            type="email"
            className="w-full px-5 py-5 glass-effect border border-white/20 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50
                       text-white placeholder-slate-400 transition-all duration-300"
            placeholder="john@example.com"
            value={clerkEmail || form.email}
            onChange={(e) => update('email', e.target.value)}
            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
            title="Enter a valid email address (example@domain.com)"
            disabled={!!clerkEmail}
          />
          {!clerkEmail && errors.email && (
            <p className="text-red-300 text-xs mt-2">{errors.email}</p>
          )}
        </div>
        <div className="h-2 sm:h-3 lg:h-4"></div>
        
        <div>
          <label className="block text-sm font-medium text-white mb-3">
            Phone Number
          </label>
          <input
            type="tel"
            className="w-full px-5 py-5 glass-effect border border-white/20 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50
                       text-white placeholder-slate-400 transition-all duration-300"
            placeholder="+63 912 345 6789"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            pattern="^(?:\+63\s?9\d{2}\s?\d{3}\s?\d{4}|09\d{9})$"
            title="Use +63 9xx xxx xxxx or 09xxxxxxxxx"
          />
          {errors.phone && <p className="text-red-300 text-xs mt-2">{errors.phone}</p>}
        </div>
        <div className="h-2 sm:h-3 lg:h-4"></div>

        <div>
          <label className="block text-sm font-medium text-white mb-3">
            Address
          </label>
          <input
            type="text"
            className="w-full px-5 py-5 glass-effect border border-white/20 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50
                       text-white placeholder-slate-400 transition-all duration-300"
            placeholder="123 Main Street"
            value={form.address}
            onChange={(e) => update('address', e.target.value)}
          />
          {errors.address && <p className="text-red-300 text-xs mt-2">{errors.address}</p>}
        </div>
        <div className="h-2 sm:h-3 lg:h-4"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-white mb-3">
              City
            </label>
            <input
              type="text"
              className="w-full px-5 py-5 glass-effect border border-white/20 rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50
                         text-white placeholder-slate-400 transition-all duration-300"
              placeholder="Quezon City"
              value={form.city}
              onChange={(e) => update('city', e.target.value)}
              pattern="^(?=.{2,50}$)[A-Za-zÀ-ÿ]+(?:[ .,'-][A-Za-zÀ-ÿ]+)*$"
              title="Letters, spaces, punctuation; 2-50 chars"
            />
            {errors.city && <p className="text-red-300 text-xs mt-2">{errors.city}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-3">
              Province
            </label>
            <input
              type="text"
              className="w-full px-5 py-5 glass-effect border border-white/20 rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50
                         text-white placeholder-slate-400 transition-all duration-300"
              placeholder="Metro Manila"
              value={form.province}
              onChange={(e) => update('province', e.target.value)}
              pattern="^(?=.{2,50}$)[A-Za-zÀ-ÿ]+(?:[ .,'-][A-Za-zÀ-ÿ]+)*$"
              title="Letters, spaces, punctuation; 2-50 chars"
            />
            {errors.province && <p className="text-red-300 text-xs mt-2">{errors.province}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-3">
              Postal Code
            </label>
            <input
              type="text"
              className="w-full px-5 py-5 glass-effect border border-white/20 rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50
                         text-white placeholder-slate-400 transition-all duration-300"
              placeholder="1747"
              value={form.postal}
              onChange={(e) => update('postal', e.target.value)}
              pattern="^\d{4}$"
              title="Enter a 4-digit postal code (e.g., 1747)"
            />
            {errors.postal && <p className="text-red-300 text-xs mt-2">{errors.postal}</p>}
          </div>
        </div>
        <div className="h-2 sm:h-3 lg:h-4"></div>
      </div>

      {}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button 
          className="flex-1 group bg-gradient-to-r from-blue-600 to-blue-700 text-white py-5 rounded-2xl font-semibold 
                     hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-blue-500/20"
          onClick={handleSave}
        >
          Update Information
        </button>
        <button 
          className="sm:w-40 bg-white/10 text-white py-5 rounded-2xl font-semibold border border-white/20 hover:bg-white/20 transition-colors"
          onClick={handleReset}
          type="button"
        >
          Reset
        </button>
      </div>
        </div>
        <div className="w-4 sm:w-6 lg:w-8 flex-shrink-0"></div>
      </div>
      <div className="h-4 sm:h-6 lg:h-8"></div>
    </div>
  )
}
