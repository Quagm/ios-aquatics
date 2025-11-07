"use client"
import { useState } from "react"
import NavigationBar from "@/components/navigation-bar"
import Footer from "@/components/Footer"
import AccountForm from "@/components/AccountForm"
import OrderHistory from "@/components/OrderHistory"
import AccountInquiryHistory from "@/components/AccountInquiryHistory"



export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('orders')
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#051C29] to-[#0a2a3a] flex flex-col">
      <NavigationBar />
      
      <main className="flex-1 pt-16 sm:pt-20 pb-16 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-white mb-4">
              My Account
            </h1>
          </div>

          {/* account container */}
        <div className="w-full px-4 sm:px-8 lg:px-16 space-y-8 lg:space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* account editing/current data */}
            <section className="w-full bg-white/5 backdrop-blur-md rounded-2xl shadow-lg p-10 border border-white/10 hover:shadow-xl transition">
              <AccountForm />
            </section>

            {/* tabbed history: orders | inquiries */}
            <section className="w-full bg-white/5 backdrop-blur-md rounded-2xl shadow-lg p-10 border border-white/10 hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">History</h2>
                <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl p-1">
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
              {activeTab === 'orders' ? (
                <OrderHistory />
              ) : (
                <AccountInquiryHistory />
              )}
            </section>
          </div>
        </div>
        </div>
      </main>
    <Footer />
    </div>
  )
}
