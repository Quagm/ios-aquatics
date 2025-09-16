"use client"
import { useState } from "react"

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const payload = Object.fromEntries(data.entries())
    try {
      const list = JSON.parse(window.localStorage.getItem('contact-submissions') || '[]')
      list.push({ ...payload, createdAt: new Date().toISOString() })
      window.localStorage.setItem('contact-submissions', JSON.stringify(list))
      setSubmitted(true)
    } catch {}
  }

  if (submitted) {
    return (
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-semibold text-white">Thanks! We received your inquiry.</h3>
        <p className="text-white/80">We'll get back to you soon.</p>
        <button className="bg-[#6c47ff] text-white px-8 py-3 rounded-full font-medium hover:bg-[#5a3ae6] transition-colors" onClick={() => setSubmitted(false)}>
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-white mb-3">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c47ff] text-white placeholder-white/70"
            required
          />
        </div>
        
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-white mb-3">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c47ff] text-white placeholder-white/70"
            required
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white mb-3">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c47ff] text-white placeholder-white/70"
          required
        />
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-white mb-3">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c47ff] text-white placeholder-white/70"
        />
      </div>
      
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-white mb-3">
          Subject
        </label>
        <select
          id="subject"
          name="subject"
          className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c47ff] text-white"
          required
        >
          <option value="" className="bg-[#051C29] text-white">Select a subject</option>
          <option value="product-inquiry" className="bg-[#051C29] text-white">Product Inquiry</option>
          <option value="order-status" className="bg-[#051C29] text-white">Order Status</option>
          <option value="shipping" className="bg-[#051C29] text-white">Shipping Information</option>
          <option value="return" className="bg-[#051C29] text-white">Return/Exchange</option>
          <option value="other" className="bg-[#051C29] text-white">Other</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-white mb-3">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={8}
          className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c47ff] text-white placeholder-white/70"
          placeholder="Please describe your inquiry in detail..."
          required
        ></textarea>
      </div>
      
      <div className="text-center pt-4">
        <button
          type="submit"
          className="bg-[#6c47ff] text-white px-12 py-4 rounded-full font-medium hover:bg-[#5a3ae6] transition-colors text-lg"
        >
          Send Inquiry
        </button>
      </div>
    </form>
  )
}
