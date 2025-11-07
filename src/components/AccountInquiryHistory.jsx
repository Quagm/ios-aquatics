"use client"

import { useEffect, useMemo, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { fetchInquiries } from "@/lib/queries"

const STATUS_STYLES = {
  pending: "bg-yellow-500/20 text-yellow-200",
  accepted: "bg-blue-500/20 text-blue-200",
  in_progress: "bg-blue-500/20 text-blue-200",
  completed: "bg-green-500/20 text-green-200",
  cancelled: "bg-red-500/20 text-red-200"
}

const truncate = (value, max = 180) => {
  if (!value) return ""
  const clean = String(value).trim()
  return clean.length > max ? `${clean.slice(0, max - 1).trim()}…` : clean
}

const extractImageUrls = (text) => {
  if (!text || typeof text !== "string") return []
  const urlRegex = /(https?:\/\/[^\s)]+)(?=\s|$)/g
  const knownImageExt = /\.(png|jpe?g|gif|webp|bmp|svg|tiff|heic|heif)(\?|#|$)/i
  const urls = []
  let match
  while ((match = urlRegex.exec(text)) !== null) {
    const url = match[1]
    if (knownImageExt.test(url) || url.includes('/storage/v1/object/public/')) {
      urls.push(url)
    }
  }
  return Array.from(new Set(urls))
}

const getCleanMessage = (text) => {
  if (!text || typeof text !== "string") return ""
  const lines = text.split(/\r?\n/)
  const cleaned = lines.filter((line) => {
    const trimmed = line.trim().toLowerCase()
    if (trimmed.startsWith('- image reference')) return false
    if (/^https?:\/\//i.test(trimmed)) return false
    return true
  })
  return cleaned.join('\n').trim()
}

export default function AccountInquiryHistory() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const { user, isLoaded } = useUser()

  const userEmail = useMemo(() => {
    return (
      user?.primaryEmailAddress?.emailAddress ||
      user?.emailAddresses?.[0]?.emailAddress ||
      ""
    )
  }, [user])

  useEffect(() => {
    if (!isLoaded) return
    let mounted = true
    const load = async () => {
      try {
        if (mounted) {
          setError("")
          setLoading(true)
        }

        if (!userEmail) {
          if (mounted) {
            setInquiries([])
            setLoading(false)
          }
          return
        }

        const data = await fetchInquiries()
        if (!mounted) return

        const mine = (data || [])
          .filter((inq) => String(inq.email || "").toLowerCase() === userEmail.toLowerCase())
          .map((inq) => ({
            id: inq.id,
            subject: inq.subject || "Aquascape Inquiry",
            message: inq.message || "",
            status: inq.status || "pending",
            created_at: inq.created_at || "",
            first_name: inq.first_name || "",
            last_name: inq.last_name || ""
          }))

        setInquiries(mine)
      } catch (err) {
        if (!mounted) return
        console.error("Failed to load inquiries", err)
        setError(err?.message || "Failed to load inquiries. Please try again later.")
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [isLoaded, userEmail])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-3">
        Inquiry History
      </h2>

      {error && (
        <div className="text-sm text-red-300 bg-red-500/20 border border-red-500/30 rounded-lg p-3">
          {error}
        </div>
      )}

      {!loading && !error && inquiries.length === 0 && (
        <div className="text-slate-300 text-sm">No inquiries submitted yet.</div>
      )}

      <div className="space-y-3">
        {inquiries.map((inquiry) => {
          const labelClass = STATUS_STYLES[inquiry.status?.toLowerCase?.()] || STATUS_STYLES.pending
          const createdAt = inquiry.created_at ? new Date(inquiry.created_at) : null
          const preview = truncate(getCleanMessage(inquiry.message), 120)
          return (
            <button
              key={inquiry.id}
              type="button"
              className="w-full text-left border border-white/20 rounded-xl p-4 bg-white/5 hover:bg-white/10 transition-colors"
              onClick={() => setSelectedInquiry(inquiry)}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold text-white truncate">{inquiry.subject}</h3>
                  <p className="text-xs text-white/60 truncate">
                    {preview}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {createdAt && (
                    <span className="text-xs text-white/60 whitespace-nowrap">
                      {createdAt.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  )}
                  <span className={`text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-full ${labelClass}`}>
                    {inquiry.status.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedInquiry(null)}></div>
          <div className="relative w-full max-w-xl bg-slate-900 border border-white/20 rounded-2xl shadow-xl p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="min-w-0">
                <h3 className="text-xl font-semibold text-white break-words">{selectedInquiry.subject}</h3>
                <p className="text-sm text-white/70">
                  {`${(selectedInquiry.first_name || "").trim()} ${(selectedInquiry.last_name || "").trim()}`.trim() || user?.fullName || "You"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {selectedInquiry.created_at && (
                  <span className="text-xs text-white/60 whitespace-nowrap">
                    {new Date(selectedInquiry.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                )}
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_STYLES[selectedInquiry.status?.toLowerCase?.()] || STATUS_STYLES.pending}`}>
                  {selectedInquiry.status.replace(/_/g, " ")}
                </span>
              </div>
            </div>
            {selectedInquiry.message && (
              <div className="text-sm text-white/80 whitespace-pre-line leading-relaxed">
                {getCleanMessage(selectedInquiry.message)}
              </div>
            )}
            {extractImageUrls(selectedInquiry.message).length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {extractImageUrls(selectedInquiry.message).map((url, idx) => (
                  <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden border border-white/20 bg-white/5">
                    <img src={url} alt={`reference-${idx + 1}`} className="w-full h-28 object-cover" />
                  </a>
                ))}
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20"
                onClick={() => setSelectedInquiry(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

