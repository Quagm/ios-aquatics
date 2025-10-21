"use client"
import NavigationBar from "@/components/navigation-bar"
import Footer from "@/components/footer"
import AccountForm from "@/components/AccountForm"
import OrderHistory from "@/components/OrderHistory"

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#051C29] to-[#0a2a3a] flex flex-col">
      <div className="h-24 sm:h-28 lg:h-32"></div>
      <NavigationBar />
      
      {/* content */}
      <main className="flex-1 py-16 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-white mb-4">
              My Account
            </h1>
          </div>

          {/* account container */}
        <div className="w-full px-4 sm:px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* account editing/current data */}
          <section className="w-full bg-white/5 backdrop-blur-md rounded-2xl shadow-lg p-10 border border-white/10 hover:shadow-xl transition">
            <AccountForm />
          </section>

          {/* order history */}
          <section className="w-full bg-white/5 backdrop-blur-md rounded-2xl shadow-lg p-10 border border-white/10 hover:shadow-xl transition">
            <h2 className="text-2xl font-semibold text-white mb-6 border-b border-white/10 pb-3">
              Order History
            </h2>
            <OrderHistory />
          </section>
        </div>
        </div>
      </main>
    <Footer />
    </div>
  )
}
