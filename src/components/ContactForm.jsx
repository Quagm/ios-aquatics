"use client"
import { useState } from "react"
import { createInquiry } from "@/lib/queries"
import { CheckCircle, ArrowRight } from 'lucide-react'

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const payload = Object.fromEntries(data.entries())
    setSubmitting(true)
    setError("")
    try {
      await createInquiry({
        first_name: payload.firstName,
        last_name: payload.lastName,
        email: payload.email,
        phone: payload.phone || null,
        subject: payload.subject,
        message: payload.message,
        status: "pending"
      })
      setSubmitted(true)
      ;(e.currentTarget).reset()
    } catch (err) {
      setError(err.message || "Failed to submit. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center space-y-6">
        <div className="glass-effect rounded-3xl p-12 max-w-md mx-auto border border-green-500/20">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
          <h3 className="text-3xl font-bold text-white mb-4">Thank You!</h3>
          <p className="text-slate-300 text-lg mb-8">We received your inquiry and will get back to you soon.</p>
          <button 
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-blue-500/20"
            onClick={() => setSubmitted(false)}
          >
            <span>Send Another Message</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      {error && (
        <div className="glass-effect rounded-xl p-4 border border-red-500/20 bg-red-500/10">
          <p className="text-red-300 font-medium">{error}</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-white mb-3">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className="w-full px-4 py-4 glass-effect border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 text-white placeholder-slate-400 transition-all duration-300"
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
            className="w-full px-4 py-4 glass-effect border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 text-white placeholder-slate-400 transition-all duration-300"
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
          className="w-full px-4 py-4 glass-effect border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 text-white transition-all duration-300"
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
          disabled={submitting}
          className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-12 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-blue-500/20 text-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {submitting ? "Sending..." : "Send Inquiry"}
        </button>
      </div>
    </form>
  )
}
