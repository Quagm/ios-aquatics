"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { SignedOut, SignInButton, SignUpButton, SignedIn, UserButton, useUser } from "@clerk/nextjs"
import { ShoppingCart, Bell } from "lucide-react"
import { supabase } from "@/supabaseClient"
import { useCart } from "@/components/CartContext"
import { usePathname } from "next/navigation"

const formatStatus = (status) => {
  if (!status) return 'Unknown'
  const text = String(status).replace(/_/g, ' ').toLowerCase()
  return text.replace(/\b\w/g, (char) => char.toUpperCase())
}

const buildStatusChangeDetail = (label, previousStatus, nextStatus) => {
  const prevLabel = previousStatus != null ? formatStatus(previousStatus) : 'Unknown'
  const nextLabel = formatStatus(nextStatus)
  if (
    previousStatus != null &&
    String(previousStatus).toLowerCase() === String(nextStatus).toLowerCase()
  ) {
    return `${label} status is ${nextLabel}`
  }
  if (previousStatus == null) {
    return `${label} status has been set to ${nextLabel}`
  }
  return `${label} status has been changed from ${prevLabel} to ${nextLabel}`
}

const buildAppointmentDetail = (nextValue, previousValue) => {
  if (nextValue && nextValue !== previousValue) {
    try {
      const appointmentDate = new Date(nextValue)
      const formattedDate = appointmentDate.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
      const formattedTime = appointmentDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
      return `Appointment scheduled for ${formattedDate} at ${formattedTime}`
    } catch {
      return `Appointment: ${nextValue}`
    }
  }
  if (!nextValue && previousValue) {
    return 'Appointment removed'
  }
  return ''
}

export default function NavigationBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  
  const { items, animationState } = useCart()
  const { user } = useUser()
  const role = user?.publicMetadata?.role || user?.unsafeMetadata?.role || user?.privateMetadata?.role
  const isAdmin = role === 'admin'
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || user?.primaryEmailAddress?.emailAddress
  const pathname = usePathname()

  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [notifs, setNotifs] = useState([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('notifications')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed)) {
            setNotifs(parsed)
          }
        }
      } catch (e) {
        console.warn('Failed to load notifications from localStorage:', e)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && notifs.length > 0) {
      try {
        localStorage.setItem('notifications', JSON.stringify(notifs))
      } catch (e) {
        console.warn('Failed to save notifications to localStorage:', e)
      }
    }
  }, [notifs])

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!userEmail) return
    const maxItems = 50
    const addNotif = (n) => {
      setNotifs((prev) => {

        const exists = prev.some(existing => 
          existing.id === n.id || 
          (existing.type === n.type && existing.title === n.title && existing.detail === n.detail)
        )
        if (exists) return prev
        
        const next = [n, ...prev]
        const limited = next.slice(0, maxItems)

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('notifications', JSON.stringify(limited))
          } catch (e) {
            console.warn('Failed to save notifications:', e)
          }
        }
        
        return limited
      })
    }


    const chInq = supabase
      .channel(`inq_status_${isAdmin ? 'admin_all' : userEmail}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inquiries' }, (payload) => {
        const row = payload?.new || payload?.record
        if (!row) return

        if (!isAdmin && (row.email || '').toLowerCase() !== (userEmail || '').toLowerCase()) return
        if (payload.eventType === 'UPDATE' && (payload.old?.status !== row.status || payload.old?.appointment_at !== row.appointment_at)) {
          const subject = row.subject || 'Inquiry'
          const detailParts = [
            buildStatusChangeDetail(subject, payload.old?.status, row.status)
          ]
          const appointmentDetail = buildAppointmentDetail(row.appointment_at, payload.old?.appointment_at)
          if (appointmentDetail) detailParts.push(appointmentDetail)
          const isAppointmentScheduled = row.status === 'completed' && row.appointment_at
          addNotif({
            id: `inq_${row.id}_${Date.now()}`,
            type: 'inquiry',
            title: isAppointmentScheduled 
              ? 'Appointment Scheduled' 
              : `Your inquiry status has been changed to ${formatStatus(row.status)}`,
            detail: isAppointmentScheduled && appointmentDetail 
              ? appointmentDetail 
              : detailParts.join(' • '),
            at: new Date().toISOString(),
          })
        }
      })
      .subscribe()

    const chBroadcast = supabase
      .channel('user_notifications')
      .on('broadcast', { event: 'inquiry_update' }, (payload) => {
        const p = payload?.payload || {}
        if (!p?.email) return
        if (!isAdmin && String(p.email).toLowerCase() !== String(userEmail).toLowerCase()) return
        const detailParts = [
          buildStatusChangeDetail(p.subject || 'Inquiry', p.previous_status, p.status)
        ]
        const apptDetail = buildAppointmentDetail(p.appointment_at, p.previous_appointment_at)
        if (apptDetail) detailParts.push(apptDetail)
        const isAppointmentScheduled = p.status === 'completed' && p.appointment_at
        addNotif({
          id: `inqbc_${p.id || 'unknown'}_${Date.now()}`,
          type: 'inquiry',
          title: isAppointmentScheduled 
            ? 'Appointment Scheduled' 
            : `Your inquiry status has been changed to ${formatStatus(p.status)}`,
          detail: isAppointmentScheduled && apptDetail 
            ? apptDetail 
            : detailParts.join(' • '),
          at: p.updated_at || new Date().toISOString(),
        })
      })
      .on('broadcast', { event: 'order_update' }, (payload) => {
        const p = payload?.payload || {}
        if (!p?.email) return
        if (!isAdmin && String(p.email).toLowerCase() !== String(userEmail).toLowerCase()) return
        addNotif({
          id: `ordbc_${p.id || 'unknown'}_${Date.now()}`,
          type: 'order',
          title: `Your order status has been changed to ${formatStatus(p.status)}`,
          detail: buildStatusChangeDetail(`Order #${p.id}`, p.previous_status, p.status),
          at: p.updated_at || new Date().toISOString(),
        })
      })
      .subscribe()

    const chOrder = supabase
      .channel(`order_status_${isAdmin ? 'admin_all' : userEmail}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        const row = payload?.new || payload?.record
        if (!row) return
        const email = (row.customer_email || row.customer?.email || '').toLowerCase()

        if (!isAdmin && email !== (userEmail || '').toLowerCase()) return
        if (payload.eventType === 'UPDATE' && payload.old?.status !== row.status) {
          addNotif({
            id: `ord_${row.id}_${Date.now()}`,
            type: 'order',
            title: `Your order status has been changed to ${formatStatus(row.status)}`,
            detail: buildStatusChangeDetail(`Order #${row.id}`, payload.old?.status, row.status),
            at: new Date().toISOString(),
          })
        }
      })
      .subscribe()

    return () => {
      try { supabase.removeChannel(chInq) } catch {}
      try { supabase.removeChannel(chOrder) } catch {}
      try { supabase.removeChannel(chBroadcast) } catch {}
    }
  }, [userEmail, isAdmin])

  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('nav')) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#contact", label: "Contact" },
  ]

  const handleSmoothScroll = (e, href) => {
    e.preventDefault()

    if (window.location.pathname !== '/') {
      window.location.href = `/${href}`
      return
    }

    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  return (
    <>
    <nav
      className={`fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 transition-all duration-300 flex justify-center ${
        isScrolled
          ? "bg-white shadow-lg border-b border-slate-200"
          : "bg-slate-800"
      }`}
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3 sm:gap-4 lg:gap-6">
        <Link href="/" className="flex items-center space-x-3 sm:space-x-4 hover:opacity-80 transition-opacity flex-shrink-0">
          <Image
            src="/logo-aquatics.jpg"
            alt="IOS Aquatics Logo"
            width={40}
            height={40}
            className="rounded-full w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14"
          />
          <h2
            className={`text-lg sm:text-xl lg:text-2xl font-bold transition-colors ${
              isScrolled ? "text-slate-800" : "text-white"
            }`}
          >
            IOS Aquatics
          </h2>
        </Link>

        <div className="hidden md:flex items-center gap-3 lg:gap-5 xl:gap-6 flex-wrap justify-end">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => handleSmoothScroll(e, href)}
              className={`px-3 lg:px-4 xl:px-5 py-2.5 rounded-lg font-medium text-sm lg:text-base transition-colors cursor-pointer ${
                isScrolled
                  ? "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                  : "text-white/90 hover:text-white hover:bg-white/20"
              }`}
            >
              {label}
            </a>
          ))}
          <Link
            href="/store-page"
            className={`px-3 lg:px-4 xl:px-5 py-2.5 rounded-lg font-medium text-sm lg:text-base transition-colors ${
              isScrolled
                ? "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                : "text-white/90 hover:text-white hover:bg-white/20"
            }`}
          >
            Store
          </Link>
          <Link
            href="/inquiry-form"
            className={`px-3 lg:px-4 xl:px-5 py-2.5 rounded-lg font-medium text-sm lg:text-base transition-colors ${
              isScrolled
                ? "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                : "text-white/90 hover:text-white hover:bg-white/20"
            }`}
          >
            Aquascape
          </Link>
          <SignedIn>
            <Link
              href="/checkout-page"
              className={`relative px-3 lg:px-4 xl:px-5 py-2.5 rounded-lg font-medium text-sm lg:text-base transition-colors ${
                isScrolled
                  ? "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                  : "text-white/90 hover:text-white hover:bg-white/20"
              }`}
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className={`w-5 h-5 transition-transform duration-300 ${
                  animationState.isVisible ? 'animate-cart-bounce' : ''
                }`} />
                <span>Cart</span>
                {cartItemCount > 0 && (
                  <span className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold transition-all duration-300 ${
                    animationState.isVisible ? 'animate-cart-pulse' : ''
                  }`}>
                    {cartItemCount}
                  </span>
                )}
              </div>
            </Link>
            
          </SignedIn>

          <div className="ml-2 lg:ml-4 flex gap-2">
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  className={`px-4 lg:px-5 xl:px-6 py-2.5 lg:py-3 rounded-lg font-semibold text-sm lg:text-base transition-all duration-300 backdrop-blur-sm ${
                    isScrolled
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 hover:shadow-lg hover:shadow-white/10"
                  }`}
                >
                  Login
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  className={`px-4 lg:px-5 xl:px-6 py-2.5 lg:py-3 rounded-lg font-semibold text-sm lg:text-base transition-all duration-300 backdrop-blur-sm ${
                    isScrolled
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
                      : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10"
                  }`}
                >
                  Register
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-2 lg:gap-3 xl:gap-4">
                <Link
                  href="/account-page"
                  className={`px-3 lg:px-4 xl:px-5 py-2.5 rounded-lg font-medium text-sm lg:text-base transition-colors ${
                    isScrolled
                      ? "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                      : "text-white/90 hover:text-white hover:bg-white/20"
                  }`}
                >
                  Account
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className={`px-3 lg:px-4 xl:px-5 py-2.5 rounded-lg font-medium text-sm lg:text-base transition-colors ${
                      isScrolled
                        ? "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                        : "text-white/90 hover:text-white hover:bg-white/20"
                    }`}
                  >
                    Admin
                  </Link>
                )}
                <div className="relative">
                  <button
                    onClick={() => setIsNotifOpen((v) => !v)}
                    className={`relative p-2.5 rounded-lg transition-colors ${
                      isScrolled ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100' : 'text-white/90 hover:text-white hover:bg-white/20'
                    }`}
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5 relative top-[1px]" />
                    {notifs.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] rounded-full min-w-[16px] h-[16px] px-1 flex items-center justify-center font-bold">
                        {Math.min(notifs.length, 9)}{notifs.length > 9 ? '+' : ''}
                      </span>
                    )}
                  </button>
                  {isNotifOpen && (
                    <div className={`absolute right-0 mt-2 w-72 glass-effect rounded-xl border border-white/20 shadow-xl z-50`}>
                      <div className="p-3 border-b border-white/10">
                        <span className="text-sm font-semibold text-white">Updates</span>
                      </div>
                      <div className="max-h-80 overflow-y-auto divide-y divide-white/10">
                        {notifs.length === 0 ? (
                          <div className="p-4 text-slate-300 text-sm">No notifications yet.</div>
                        ) : (
                          notifs.map((n) => (
                            <div key={n.id} className="p-3 text-sm">
                              <p className="text-white font-medium">{n.title}</p>
                              <p className="text-slate-300 mt-1">{n.detail}</p>
                              <p className="text-slate-400 text-xs mt-1">{new Date(n.at).toLocaleString()}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <UserButton />
              </div>
            </SignedIn>
          </div>
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5 p-3 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`h-0.5 w-6 transition-all duration-300 ${
              isScrolled ? "bg-slate-800" : "bg-white"
            } ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`h-0.5 w-6 transition-all duration-300 ${
              isScrolled ? "bg-slate-800" : "bg-white"
            } ${isMobileMenuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`h-0.5 w-6 transition-all duration-300 ${
              isScrolled ? "bg-slate-800" : "bg-white"
            } ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-slate-200 transition-all duration-300 z-40 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="px-6 py-8 space-y-5">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => {
                handleSmoothScroll(e, href)
                setIsMobileMenuOpen(false)
              }}
              className="block py-3 px-2 font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              {label}
            </a>
          ))}
          <Link
            href="/store-page"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-3 px-2 font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
          >
            Store
          </Link>
          <Link
            href="/inquiry-form"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-3 px-2 font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
          >
            Aquascape
          </Link>
          <SignedIn>
            <Link
              href="/checkout-page"
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative block py-3 px-2 font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className={`w-5 h-5 transition-transform duration-300 ${
                  animationState.isVisible ? 'animate-cart-bounce' : ''
                }`} />
                <span>Cart</span>
                {cartItemCount > 0 && (
                  <span className={`bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold transition-all duration-300 ${
                    animationState.isVisible ? 'animate-cart-pulse' : ''
                  }`}>
                    {cartItemCount}
                  </span>
                )}
              </div>
            </Link>
          </SignedIn>

          <div className="pt-6 mt-6 border-t border-slate-200">
            <SignedOut>
              <div className="space-y-3">
                <SignInButton mode="modal">
                  <button className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-4 px-6 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30">
                    Login
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 py-4 px-6 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30">
                    Register
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="space-y-4">
                <Link
                  href="/account-page"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-4 px-3 font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Account
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-4 px-3 font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    Admin
                  </Link>
                )}
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>

    {pathname !== '/' && (
      <div className="h-20 sm:h-24 lg:h-28" aria-hidden="true"></div>
    )}

    </>
  )
}