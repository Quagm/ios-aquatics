"use client"
import { useState } from "react"
import { createInquiry } from "@/lib/queries"

export default function AquascapeForm() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [imageFiles, setImageFiles] = useState([]) // selected image references
  const MAX_IMAGES = 5
  const MAX_PRICE = 1_000_000_000_000 // one trillion

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const payload = Object.fromEntries(data.entries())
    setSubmitting(true)
    setError("")
    
    try {
      // Create a detailed message for aquascape inquiry
      const fileLine = imageFiles.length
        ? `- Image References (${imageFiles.length}): ${imageFiles.map(f => f.name).join(', ')}`
        : ''
      const aquascapeMessage = `
    Aquascape Inquiry Details:
    - Contact: ${payload.contactNo}
    - Address: ${payload.address}
    - Aquarium Size: ${payload.aquariumSize}
    - Price Range: ₱${payload.priceMin} - ₱${payload.priceMax}
    - Preferences/Suggestions: ${payload.preferences}
    ${fileLine}
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
      setImageFiles([])
    } catch (err) {
      setError(err.message || "Failed to submit. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">Aquascape Inquiry</h1>
        <p className="text-lg sm:text-xl text-white/80">Let us help you create the perfect aquascape for your space!</p>
        <h3 className="text-2xl font-semibold text-white mt-6">Thanks! We received your aquascape inquiry.</h3>
        <p className="text-white/80">Our aquascape specialists will get back to you soon with a customized proposal.</p>
      </div>
    )
  }

  return (
    <form
   onSubmit={handleSubmit} className="w-full">
  <div className="mx-auto w-full max-w-6xl px-6 sm:px-10 lg:px-16 xl:px-20 py-10 space-y-8">
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-300 text-sm sm:text-base">{error}</p>
        </div>
      )}
      
      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
        <div>
          <label htmlFor="firstName" className="block text-sm sm:text-base font-medium text-white mb-2 sm:mb-3">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className="w-full px-4 py-3 sm:py-4 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c47ff] text-white placeholder-white/70 transition-all duration-300 hover:border-white/50"
            placeholder="Enter your first name"
            required
          />
        </div>
        
        <div>
          <label htmlFor="lastName" className="block text-sm sm:text-base font-medium text-white mb-2 sm:mb-3">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className="w-full px-4 py-3 sm:py-4 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c47ff] text-white placeholder-white/70 transition-all duration-300 hover:border-white/50"
            placeholder="Enter your last name"
            required
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
        <div>
          <label htmlFor="contactNo" className="block text-sm sm:text-base font-medium text-white mb-2 sm:mb-3">
            Contact Number *
          </label>
          <input
            type="tel"
            id="contactNo"
            name="contactNo"
            className="w-full px-4 py-3 sm:py-4 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c47ff] text-white placeholder-white/70 transition-all duration-300 hover:border-white/50"
            placeholder="e.g., +63 912 345 6789"
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm sm:text-base font-medium text-white mb-2 sm:mb-3">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-4 py-3 sm:py-4 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c47ff] text-white placeholder-white/70 transition-all duration-300 hover:border-white/50"
            placeholder="Enter your email address"
            required
          />
        </div>
      </div>
      
      {/* Address */}
      <div>
        <label htmlFor="address" className="block text-sm sm:text-base font-medium text-white mb-2 sm:mb-3">
          Address *
        </label>
        <textarea
          id="address"
          name="address"
          rows={4}
          className="w-full px-4 py-3 sm:py-4 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c47ff] text-white placeholder-white/70 transition-all duration-300 hover:border-white/50 resize-none"
          placeholder="Please provide your full address for site visit planning"
          required
        ></textarea>
      </div>

      {/* Aquarium Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
        <div>
          <label htmlFor="aquariumSize" className="block text-sm font-medium text-white mb-3">
            Aquarium Size *
          </label>
          <select
            id="aquariumSize"
            name="aquariumSize"
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c47ff] text-white"
            required
          >
            <option value="" className="bg-[#051C29] text-white">Select aquarium size</option>
            <option value="nano-10-20L" className="bg-[#051C29] text-white">Nano (10-20L)</option>
            <option value="small-20-50L" className="bg-[#051C29] text-white">Small (20-50L)</option>
            <option value="medium-50-100L" className="bg-[#051C29] text-white">Medium (50-100L)</option>
            <option value="large-100-200L" className="bg-[#051C29] text-white">Large (100-200L)</option>
            <option value="xl-200L+" className="bg-[#051C29] text-white">Extra Large (200L+)</option>
            <option value="custom" className="bg-[#051C29] text-white">Custom Size</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white mb-3">
            Price Range *
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                id="priceMin"
                name="priceMin"
                placeholder="Min (₱)"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c47ff] text-white placeholder-white/70"
                min="0"
                max={MAX_PRICE}
                onChange={(e) => {
                  const v = e.target.valueAsNumber
                  if (Number.isFinite(v) && v > MAX_PRICE) {
                    e.target.value = String(MAX_PRICE)
                  } else if (v < 0) {
                    e.target.value = '0'
                  }
                }}
                required
              />
            </div>
            <div>
              <input
                type="number"
                id="priceMax"
                name="priceMax"
                placeholder="Max (₱)"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c47ff] text-white placeholder-white/70"
                min="0"
                max={MAX_PRICE}
                onChange={(e) => {
                  const v = e.target.valueAsNumber
                  if (Number.isFinite(v) && v > MAX_PRICE) {
                    e.target.value = String(MAX_PRICE)
                  } else if (v < 0) {
                    e.target.value = '0'
                  }
                }}
                required
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Preferences/Suggestions */}
      <div>
        <label htmlFor="preferences" className="block text-sm font-medium text-white mb-3">
          Preferences/Suggestions
        </label>
        <textarea
          id="preferences"
          name="preferences"
          rows={6}
          className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c47ff] text-white placeholder-white/70"
          placeholder="Tell us about your vision! Include details about:
• Preferred aquascape style (Nature, Dutch, Iwagumi, etc.)
• Plant preferences
• Fish species you'd like to keep
• Lighting preferences
• Maintenance level you're comfortable with
• Any specific themes or inspirations"
        ></textarea>
      </div>

      {/* Image References (multiple with limit) */}
      <div>
        <label htmlFor="imageReference" className="block text-sm font-medium text-white mb-3">
          Image Reference Attachments <span className="text-white/60">(up to {MAX_IMAGES})</span>
        </label>
        <div className="relative">
          <input
            type="file"
            id="imageReference"
            name="imageReference"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || [])
              const next = [...imageFiles, ...files]
              if (next.length > MAX_IMAGES) {
                const allowed = next.slice(0, MAX_IMAGES)
                setImageFiles(allowed)
                setError(`You can attach up to ${MAX_IMAGES} images.`)
              } else {
                setImageFiles(next)
              }
              // Clear the input so selecting the same file again re-triggers change
              e.target.value = ''
            }}
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c47ff] text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#6c47ff] file:text-white hover:file:bg-[#5a3ae6] file:cursor-pointer"
          />
          <p className="text-white/60 text-sm mt-2">
            Upload reference images of aquascapes you like (optional)
          </p>
        </div>
        {imageFiles.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {imageFiles.map((file, idx) => {
              const url = URL.createObjectURL(file)
              return (
                <div key={idx} className="relative group rounded-lg overflow-hidden border border-white/20 bg-white/10">
                  <img src={url} alt={file.name} className="w-full h-32 object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-xs px-2 py-1 truncate">{file.name}</div>
                  <button
                    type="button"
                    onClick={() => setImageFiles(prev => prev.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 bg-red-600/80 hover:bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Remove ${file.name}`}
                  >
                    Remove
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
      
      <div className="text-center pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="bg-[#6c47ff] text-white px-12 py-4 rounded-full font-medium hover:bg-[#5a3ae6] transition-colors text-lg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting Inquiry..." : "Submit Aquascape Inquiry"}
        </button>
      </div>
      </div>
    </form>
  )
}
