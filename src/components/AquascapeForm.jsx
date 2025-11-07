"use client"
import { useEffect, useMemo, useState } from "react"
import { useUser } from '@clerk/nextjs'
import { SignInButton } from '@clerk/nextjs'
import { createInquiry } from "@/lib/queries"
import { useToast } from "@/components/ui/ToastProvider"

export default function AquascapeForm() {
  const { isSignedIn, isLoaded } = useUser()
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [accountInfo, setAccountInfo] = useState({ name: "", email: "", phone: "", address: "", city: "", province: "", postal: "" })
  const [priceError, setPriceError] = useState("")
  const [priceMin, setPriceMin] = useState("")
  const [priceMax, setPriceMax] = useState("")
  const { push } = useToast()

  useEffect(() => {
    const loadAccountInfo = async () => {
      try {
        const res = await fetch('/api/account', {
          credentials: 'include'
        })
        if (res.ok) {
          const data = await res.json()
          if (data) {
            setAccountInfo({
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
    if (isLoaded && isSignedIn) {
      loadAccountInfo()
    }
  }, [isLoaded, isSignedIn])

  const hasCompleteAccountInfo = useMemo(() => {
    const trimmed = Object.fromEntries(
      Object.entries(accountInfo).map(([k, v]) => [k, (v || '').trim()])
    )
    return Boolean(
      trimmed.name &&
      trimmed.email &&
      trimmed.phone &&
      trimmed.address &&
      trimmed.city &&
      trimmed.province &&
      trimmed.postal
    )
  }, [accountInfo])

  const showInlineFields = !hasCompleteAccountInfo

  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault()
    }
    
    if (!isLoaded) return
    if (!isSignedIn) {
      setError("Please sign in to submit an inquiry.")
      return
    }

    let currentAccountInfo = accountInfo
    try {
      const res = await fetch('/api/account', {
        credentials: 'include'
      })
      if (res.ok) {
        const data = await res.json()
        if (data && typeof data === 'object' && data !== null) {
          const hasAnyData = Object.values(data).some(v => v && String(v).trim())
          if (hasAnyData) {
            currentAccountInfo = {
              name: data.name || "",
              email: data.email || "",
              phone: data.phone || "",
              address: data.address || "",
              city: data.city || "",
              province: data.province || "",
              postal: data.postal || ""
            }
            setAccountInfo(currentAccountInfo)
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch account info during inquiry submission:', err)
    }

    const formElement = (e && e.currentTarget) || (typeof document !== 'undefined' ? document.querySelector('form') : null)
    if (!formElement) {
      setError("Form element not found. Please refresh the page and try again.")
      return
    }

    const data = new FormData(formElement)
    const payload = Object.fromEntries(data.entries())
    console.log('[AquascapeForm] Account info being used:', currentAccountInfo)
    const fullName = (currentAccountInfo.name || '').trim()
    const [fname, ...lnameParts] = fullName.split(/\s+/)
    const derivedFirst = fname || payload.firstName || ''
    const derivedLast = (lnameParts.join(' ') || payload.lastName || '').trim()
    const derivedEmail = (currentAccountInfo.email || payload.email || '').trim()
    const derivedPhone = (currentAccountInfo.phone || payload.contactNo || '').trim()
    const derivedAddress = (currentAccountInfo.address || payload.address || '').trim()
    const derivedCity = (currentAccountInfo.city || payload.city || '').trim()
    const derivedProvince = (currentAccountInfo.province || payload.province || '').trim()
    const derivedPostal = (currentAccountInfo.postal || payload.postal || '').trim()
    console.log('[AquascapeForm] Derived customer data:', {
      first: derivedFirst,
      last: derivedLast,
      email: derivedEmail,
      phone: derivedPhone,
      address: derivedAddress,
      city: derivedCity,
      province: derivedProvince,
      postal: derivedPostal
    })

    if (!derivedFirst || !derivedLast || !derivedEmail || !derivedPhone || !derivedAddress || !derivedCity || !derivedProvince || !derivedPostal) {
      push({
        title: 'Missing details',
        description: 'Please complete your name, email, phone, and full address before submitting the inquiry.',
        variant: 'warning'
      })
      setError('Please complete the highlighted personal details.')
      setSubmitting(false)
      return
    }

    const priceMin = parseFloat(payload.priceMin) || 0
    const priceMax = parseFloat(payload.priceMax) || 0

    if (priceMin >= priceMax) {
      push({
        title: 'Invalid price range',
        description: 'The minimum price must be lower than the maximum price.',
        variant: 'error'
      })
      setPriceError('Minimum price must be lower than maximum price.')
      setSubmitting(false)
      return
    }

    setPriceError("")
    const imageFiles = data.getAll("imageReference")
    const validImageFiles = imageFiles.filter(file => file instanceof File && file.size > 0).slice(0, 5)
    
    if (payload.imageReference) {
      delete payload.imageReference
    }
    setSubmitting(true)
    setError("")
    
    try {
      const imageUrls = []
      const uploadErrors = []
      
      for (const imageFile of validImageFiles) {
        if (imageFile instanceof File && imageFile.size > 0) {
          try {
            const uploadData = new FormData()
            uploadData.append("file", imageFile)

            const uploadRes = await fetch("/api/upload", {
              method: "POST",
              body: uploadData,
              credentials: "include"
            })

            if (!uploadRes.ok) {
              let errorMessage = `Failed to upload ${imageFile.name}`
              try {
                const uploadJson = await uploadRes.json()
                errorMessage = uploadJson?.error || errorMessage
              } catch {
                errorMessage = `Server error (${uploadRes.status}): ${uploadRes.statusText}`
              }
              console.error(`Failed to upload image ${imageFile.name}:`, errorMessage)
              uploadErrors.push(`${imageFile.name}: ${errorMessage}`)
              continue
            }

            const uploadJson = await uploadRes.json()
            if (uploadJson?.url) {
              imageUrls.push(uploadJson.url)
            }
          } catch (fetchError) {
            console.error(`Network error uploading ${imageFile.name}:`, fetchError?.message || fetchError)
            const errorMsg = fetchError?.message || 'Network error'
            uploadErrors.push(`${imageFile.name}: ${errorMsg}`)
            if (errorMsg.includes('fetch failed') || errorMsg.includes('Failed to fetch')) {
              console.error(`Upload API may be unavailable. Check if SUPABASE_SERVICE_ROLE_KEY is set in environment variables.`)
            }
            continue
          }
        }
      }

      if (uploadErrors.length > 0 && imageUrls.length === 0) {
        push({
          title: 'Image upload failed',
          description: `Could not upload images. The inquiry will be submitted without images. Error: ${uploadErrors[0]}`,
          variant: 'warning'
        })
      } else if (uploadErrors.length > 0) {
        push({
          title: 'Some images failed to upload',
          description: `${uploadErrors.length} image(s) could not be uploaded. The inquiry will be submitted with ${imageUrls.length} image(s).`,
          variant: 'warning'
        })
      }

      const preferences = typeof payload.preferences === "string" && payload.preferences.trim()
        ? payload.preferences.trim()
        : "Not specified"

      const messageLines = [
        "Aquascape Inquiry Details:",
        `- Aquarium Size: ${payload.aquariumSize}`,
        `- Price Range: ₱${payload.priceMin} - ₱${payload.priceMax}`,
        `- Preferences/Suggestions: ${preferences}`
      ]

      if (imageUrls.length > 0) {
        imageUrls.forEach((url, index) => {
          messageLines.push(`- Image Reference: ${url}`)
        })
      }

      const aquascapeMessage = messageLines.filter(Boolean).join("\n")

      const customerSnapshot = {
        name: fullName,
        first_name: derivedFirst,
        last_name: derivedLast,
        email: derivedEmail,
        phone: derivedPhone || null,
        address: derivedAddress,
        city: derivedCity,
        province: derivedProvince,
        postal_code: derivedPostal
      }

      console.log('[AquascapeForm] Creating inquiry with customer_snapshot:', customerSnapshot)

      await createInquiry({
        first_name: derivedFirst,
        last_name: derivedLast,
        email: derivedEmail,
        phone: derivedPhone || null,
        subject: "Aquascape Inquiry",
        message: aquascapeMessage,
        status: "pending",
        customer_snapshot: customerSnapshot
      })
      setSubmitted(true)
      setPriceMin("")
      setPriceMax("")
      setPriceError("")
      ;(e.currentTarget).reset()
    } catch (err) {
      setError(err.message || "Failed to submit. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <p className="text-white/80">Loading...</p>
      </div>
    )
  }

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
        <p className="text-white/80">
          Message us on our{' '}
          <a
            href="https://web.facebook.com/iosaquatics"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#6c47ff] hover:underline"
          >
            Facebook page
          </a>{' '}
          for more information.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 pb-12 sm:pb-16 lg:pb-20 flex flex-col items-center">
      <div className="h-4 sm:h-6 lg:h-8 w-full"></div>
      <div className="w-full space-y-12 flex">
        <div className="w-4 sm:w-6 lg:w-8 flex-shrink-0"></div>
        <div className="flex-1 space-y-12">
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-300 text-sm sm:text-base">{error}</p>
        </div>
      )}
      
      {showInlineFields && (
        <div className="w-full space-y-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-yellow-200 mb-3">
            Account Information Required
          </h3>
          <p className="text-slate-300 text-sm mb-4">
            Please complete your account information first before submitting an inquiry. This ensures we have your correct delivery address and contact details.
          </p>
          <div className="flex justify-center">
            <a
              href="/account-page"
              className="inline-block px-6 py-3 bg-[#6c47ff] text-white rounded-lg hover:bg-[#5a3ae6] transition-colors font-medium"
            >
              Go to Account Page
            </a>
          </div>
        </div>
      )}

      <div className="w-full space-y-8">
        <h3 className="text-xl font-semibold text-white mb-8 flex items-center gap-3">
          <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
          Aquascape Preferences
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start">
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
            <div className="grid grid-cols-2 gap-4 items-start">
              <div>
                <input
                  type="number"
                  id="priceMin"
                  name="priceMin"
                  placeholder="Min (₱)"
                  className={`w-full px-4 py-4 bg-slate-800/50 border ${priceError ? 'border-red-500' : 'border-slate-600'} rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-white placeholder-slate-400 transition-all duration-300 hover:border-slate-500 backdrop-blur-sm`}
                  min="0"
                  required
                  value={priceMin}
                  onChange={(e) => {
                    const value = e.target.value
                    setPriceMin(value)
                    const min = parseFloat(value) || 0
                    const max = parseFloat(priceMax) || 0
                    if (max > 0 && min >= max) {
                      setPriceError('Minimum price must be lower than maximum price.')
                    } else {
                      setPriceError("")
                    }
                  }}
                />
              </div>
              <div>
                <input
                  type="number"
                  id="priceMax"
                  name="priceMax"
                  placeholder="Max (₱)"
                  className={`w-full px-4 py-4 bg-slate-800/50 border ${priceError ? 'border-red-500' : 'border-slate-600'} rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-white placeholder-slate-400 transition-all duration-300 hover:border-slate-500 backdrop-blur-sm`}
                  min="0"
                  required
                  value={priceMax}
                  onChange={(e) => {
                    const value = e.target.value
                    setPriceMax(value)
                    const max = parseFloat(value) || 0
                    const min = parseFloat(priceMin) || 0
                    if (min > 0 && min >= max) {
                      setPriceError('Minimum price must be lower than maximum price.')
                    } else {
                      setPriceError("")
                    }
                  }}
                />
              </div>
            </div>
            {priceError && (
              <p className="text-red-400 text-sm mt-1">{priceError}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="w-full space-y-8">
        <h3 className="text-xl font-semibold text-white mb-8 flex items-center gap-3">
          <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
          Additional Preferences
        </h3>
        
        <div className="group space-y-4">
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
        
        <div className="group space-y-4">
          <label htmlFor="imageReference" className="block text-sm font-semibold text-slate-300 mb-2 group-focus-within:text-slate-200 transition-colors text-left">
            Image Reference
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
                if (files.length > 5) {
                  alert("Please select a maximum of 5 images.")
                  e.target.value = ""
                }
              }}
              className="w-full px-5 py-4 bg-slate-800/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-white transition-all duration-300 hover:border-slate-500 backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-600 file:text-white hover:file:bg-slate-500 file:cursor-pointer"
            />
            <p className="text-slate-400 text-sm mt-3">
              Upload up to 5 reference images of aquascapes you like (optional)
            </p>
          </div>
        </div>
      </div>
      
      <div className="w-full text-center pt-12">
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
        <div className="w-4 sm:w-6 lg:w-8 flex-shrink-0"></div>
      </div>
      <div className="h-4 sm:h-6 lg:h-8 w-full"></div>
    </form>
  )
}
