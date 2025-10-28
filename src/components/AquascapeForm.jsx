"use client"
import { useState } from "react"
import { useUser } from '@clerk/nextjs'
import { SignInButton } from '@clerk/nextjs'
import { createInquiry } from "@/lib/queries"

export default function AquascapeForm() {
  const { isSignedIn, isLoaded } = useUser()
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Check if user is signed in
    if (!isLoaded) return // Wait for Clerk to load
    if (!isSignedIn) {
      setError("Please sign in to submit an inquiry.")
      return
    }
    
    const data = new FormData(e.currentTarget)
    const payload = Object.fromEntries(data.entries())
    setSubmitting(true)
    setError("")
    
    try {
      // Create a detailed message for aquascape inquiry
const aquascapeMessage = `
    Aquascape Inquiry Details:
    - Contact: ${payload.contactNo}
    - Address: ${payload.address}
    - Aquarium Size: ${payload.aquariumSize}
    - Price Range: ₱${payload.priceMin} - ₱${payload.priceMax}
    - Preferences/Suggestions: ${payload.preferences}
    ${payload.imageReference ? `- Image Reference: ${payload.imageReference.name}` : ''}
          `.trim()

      await createInquiry({
        first_name: payload.firstName,
        last_name: payload.lastName,
        email: payload.email,
        phone: payload.contactNo || null,
        subject: "Aquascape Inquiry",
        message: aquascapeMessage,
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

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <p className="text-white/80">Loading...</p>
      </div>
    )
  }

  // Show login prompt if not signed in
  if (!isSignedIn) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center w-full max-w-lg">
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-yellow-300 mb-3">Sign In Required</h3>
            <p className="text-white/90 mb-4 text-sm">
              Please sign in to submit an aquascape inquiry. This helps us keep track of your requests and provide better service.
            </p>
            <SignInButton mode="modal">
              <button className="bg-[#6c47ff] text-white px-6 py-2 rounded-full font-medium hover:bg-[#5a3ae6] transition-colors">
                Sign In to Continue
              </button>
            </SignInButton>
          </div>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-semibold text-white mt-6">Thanks! We received your aquascape inquiry.</h3>
        <p className="text-white/80">Our aquascape specialists will get back to you soon with a customized proposal.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="space-y-10 px-2 sm:px-4">
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-300 text-sm sm:text-base">{error}</p>
        </div>
      )}
      
      {/* Personal Information */}
      <div className="space-y-6 px-1 sm:px-2">
        <h3 className="text-xl font-semibold text-white mb-8 flex items-center gap-3">
          <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
          Personal Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group space-y-3">
            <label htmlFor="firstName" className="block text-sm font-semibold text-slate-300 mb-2 group-focus-within:text-slate-200 transition-colors text-left">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="w-full px-5 py-4 bg-slate-800/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-white placeholder-slate-400 transition-all duration-300 hover:border-slate-500 backdrop-blur-sm"
              placeholder="Enter your first name"
              required
            />
          </div>
          
          <div className="group space-y-3">
            <label htmlFor="lastName" className="block text-sm font-semibold text-slate-300 mb-2 group-focus-within:text-slate-200 transition-colors text-left">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="w-full px-5 py-4 bg-slate-800/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-white placeholder-slate-400 transition-all duration-300 hover:border-slate-500 backdrop-blur-sm"
              placeholder="Enter your last name"
              required
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-6 px-1 sm:px-2">
        <h3 className="text-xl font-semibold text-white mb-8 flex items-center gap-3">
          <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
          Contact Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group space-y-3">
            <label htmlFor="contactNo" className="block text-sm font-semibold text-slate-300 mb-2 group-focus-within:text-slate-200 transition-colors text-left">
              Contact Number *
            </label>
            <input
              type="tel"
              id="contactNo"
              name="contactNo"
              className="w-full px-5 py-4 bg-slate-800/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-white placeholder-slate-400 transition-all duration-300 hover:border-slate-500 backdrop-blur-sm"
              placeholder="e.g., +63 912 345 6789"
              required
            />
          </div>
          
          <div className="group space-y-3">
            <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-2 group-focus-within:text-slate-200 transition-colors text-left">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-5 py-4 bg-slate-800/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-white placeholder-slate-400 transition-all duration-300 hover:border-slate-500 backdrop-blur-sm"
              placeholder="Enter your email address"
              required
            />
          </div>
        </div>
      </div>
      
      {/* Location Information */}
      <div className="space-y-6 px-1 sm:px-2">
        <h3 className="text-xl font-semibold text-white mb-8 flex items-center gap-3">
          <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
          Location Information
        </h3>
        
        <div className="group space-y-3">
          <label htmlFor="address" className="block text-sm font-semibold text-slate-300 mb-2 group-focus-within:text-slate-200 transition-colors text-left">
            Full Address *
          </label>
          <textarea
            id="address"
            name="address"
            rows={4}
            className="w-full px-5 py-4 bg-slate-800/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-white placeholder-slate-400 transition-all duration-300 hover:border-slate-500 resize-none backdrop-blur-sm"
            placeholder="Please provide your full address for site visit planning"
            required
          ></textarea>
        </div>
      </div>

      {/* Aquascape Preferences */}
      <div className="space-y-6 px-1 sm:px-2">
        <h3 className="text-xl font-semibold text-white mb-8 flex items-center gap-3">
          <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
          Aquascape Preferences
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group space-y-3">
            <label htmlFor="aquariumSize" className="block text-sm font-semibold text-slate-300 mb-2 group-focus-within:text-slate-200 transition-colors text-left">
              Aquarium Size *
            </label>
            <select
              id="aquariumSize"
              name="aquariumSize"
              className="w-full px-5 py-4 bg-slate-800/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-white transition-all duration-300 hover:border-slate-500 backdrop-blur-sm"
              required
            >
              <option value="" className="bg-slate-800 text-white">Select aquarium size</option>
              <option value="nano-10-20L" className="bg-slate-800 text-white">Nano (10-20L)</option>
              <option value="small-20-50L" className="bg-slate-800 text-white">Small (20-50L)</option>
              <option value="medium-50-100L" className="bg-slate-800 text-white">Medium (50-100L)</option>
              <option value="large-100-200L" className="bg-slate-800 text-white">Large (100-200L)</option>
              <option value="xl-200L+" className="bg-slate-800 text-white">Extra Large (200L+)</option>
              <option value="custom" className="bg-slate-800 text-white">Custom Size</option>
            </select>
          </div>
          
          <div className="group space-y-3">
            <label className="block text-sm font-semibold text-slate-300 mb-2 group-focus-within:text-slate-200 transition-colors text-left">
              Price Range *
            </label>
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <input
                  type="number"
                  id="priceMin"
                  name="priceMin"
                  placeholder="Min (₱)"
                  className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-white placeholder-slate-400 transition-all duration-300 hover:border-slate-500 backdrop-blur-sm"
                  min="0"
                  required
                />
              </div>
              <div>
                <input
                  type="number"
                  id="priceMax"
                  name="priceMax"
                  placeholder="Max (₱)"
                  className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-white placeholder-slate-400 transition-all duration-300 hover:border-slate-500 backdrop-blur-sm"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional Preferences */}
      <div className="space-y-6 px-1 sm:px-2">
        <h3 className="text-xl font-semibold text-white mb-8 flex items-center gap-3">
          <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
          Additional Preferences
        </h3>
        
        <div className="group space-y-3">
          <label htmlFor="preferences" className="block text-sm font-semibold text-slate-300 mb-2 group-focus-within:text-slate-200 transition-colors text-left">
            Preferences/Suggestions
          </label>
          <textarea
            id="preferences"
            name="preferences"
            rows={6}
            className="w-full px-5 py-4 bg-slate-800/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-white placeholder-slate-400 transition-all duration-300 hover:border-slate-500 backdrop-blur-sm"
            placeholder="Tell us about your vision! Include details about:
• Preferred aquascape style (Nature, Dutch, Iwagumi, etc.)
• Plant preferences
• Fish species you'd like to keep
• Lighting preferences
• Maintenance level you're comfortable with
• Any specific themes or inspirations"
          ></textarea>
        </div>
        
        <div className="group space-y-3">
          <label htmlFor="imageReference" className="block text-sm font-semibold text-slate-300 mb-2 group-focus-within:text-slate-200 transition-colors text-left">
            Image Reference Attachment
          </label>
          <div className="relative">
            <input
              type="file"
              id="imageReference"
              name="imageReference"
              accept="image/*"
              className="w-full px-5 py-4 bg-slate-800/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-white transition-all duration-300 hover:border-slate-500 backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-600 file:text-white hover:file:bg-slate-500 file:cursor-pointer"
            />
            <p className="text-slate-400 text-sm mt-3">
              Upload reference images of aquascapes you like (optional)
            </p>
          </div>
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="text-center pt-10">
        <button
          type="submit"
          disabled={submitting || !isSignedIn}
          className="group relative inline-flex items-center justify-center px-12 py-4 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-slate-500/25 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          <span className="relative z-10 flex items-center gap-3">
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting Inquiry...
              </>
            ) : (
              <>
                Submit Inquiry
                <div className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300">→</div>
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
        </button>
        {!isSignedIn && (
          <p className="text-yellow-300 text-sm mt-4">
            Please sign in to submit your inquiry
          </p>
        )}
      </div>
      </div>
    </form>
  )
}
