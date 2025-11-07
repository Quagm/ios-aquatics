"use client"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import NavigationBar from "@/components/navigation-bar"
import Footer from "@/components/Footer"
import AccountForm from "@/components/AccountForm"
import OrderHistory from "@/components/OrderHistory"
import AccountInquiryHistory from "@/components/AccountInquiryHistory"
import AquascapeForm from "@/components/AquascapeForm"
import { ToastProvider } from "@/components/ui/ToastProvider"
import { X } from "lucide-react"



export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('orders')
  const [showAquascapeModal, setShowAquascapeModal] = useState(false)
  const pathname = usePathname()

  useEffect(() => {

    if (typeof window !== 'undefined' && window.location.hash === '#aquascape-inquiry') {
      setShowAquascapeModal(true)

      window.history.replaceState(null, '', pathname)
    }

    const handleOpenModal = () => setShowAquascapeModal(true)
    window.addEventListener('openAquascapeModal', handleOpenModal)
    
    return () => {
      window.removeEventListener('openAquascapeModal', handleOpenModal)
    }
  }, [pathname])
  return (
    <ToastProvider>
    <div className="min-h-screen bg-gradient-to-b from-[#051C29] to-[#0a2a3a] flex flex-col">
      <NavigationBar />
      
      <main className="flex-1 pt-16 sm:pt-20 pb-16 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-white mb-4">
              My Account
            </h1>
            <div className="h-4 sm:h-6 lg:h-8"></div>
          </div>

          {}
        <div className="w-full px-4 sm:px-8 lg:px-16 space-y-8 lg:space-y-12 flex flex-col items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start w-full max-w-6xl mx-auto">
            {}
            <section className="w-full bg-white/5 backdrop-blur-md rounded-2xl shadow-lg p-8 sm:p-10 lg:p-12 border border-white/10 hover:shadow-xl transition">
              <AccountForm />
            </section>

            {}
            <section className="w-full bg-white/5 backdrop-blur-md rounded-2xl shadow-lg p-10 border border-white/10 hover:shadow-xl transition overflow-hidden">
              <div className="h-4 sm:h-6 lg:h-8"></div>
              <div className="flex min-w-0">
                <div className="w-4 sm:w-6 lg:w-8 flex-shrink-0"></div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="flex items-center justify-between mb-6 min-w-0">
                    <h2 className="text-2xl font-semibold text-white">History</h2>
                    <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl p-1 shrink-0">
                      <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-[#6c47ff] text-white' : 'text-white/80 hover:text-white'}`}
                      >
                        Orders
                      </button>
                      <button
                        onClick={() => setActiveTab('inquiries')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'inquiries' ? 'bg-[#6c47ff] text-white' : 'text-white/80 hover:text-white'}`}
                      >
                        Inquiries
                      </button>
                    </div>
                  </div>
                  <div className="min-w-0 overflow-hidden">
                    {activeTab === 'orders' ? (
                      <OrderHistory />
                    ) : (
                      <AccountInquiryHistory />
                    )}
                  </div>
                </div>
                <div className="w-4 sm:w-6 lg:w-8 flex-shrink-0"></div>
              </div>
              <div className="h-4 sm:h-6 lg:h-8"></div>
            </section>
          </div>
        </div>
        </div>
      </main>
    <Footer />
    
    {}
    {showAquascapeModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 pointer-events-none">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAquascapeModal(false)}></div>
        <div className="relative w-full max-w-4xl xl:max-w-5xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl border border-white/10 pointer-events-auto">
          <div className="sticky top-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-10 border-b border-white/10 p-6 flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              <span className="text-white">Aquascape</span> <span className="text-slate-300">Inquiry</span>
            </h2>
            <button
              onClick={() => setShowAquascapeModal(false)}
              className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6 sm:p-8 lg:p-12">
            <AquascapeForm />
          </div>
        </div>
      </div>
    )}
    </div>
    </ToastProvider>
  )
}
