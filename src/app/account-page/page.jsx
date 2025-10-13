"use client"
import NavigationBar from "@/components/navigation-bar"
import Footer from "@/components/footer"
import { UserButton } from "@clerk/nextjs"
import AccountForm from "@/components/AccountForm"
import OrderHistory from "@/components/OrderHistory"

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#051C29] to-[#0a2a3a] flex flex-col">
      {/* Navigation */}
      <div className="h-24 sm:h-28 lg:h-32"></div>
      <NavigationBar />
      
      {/* Main Content */}
      <main className="flex-1 py-16 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-white mb-4">
              My Account
            </h1>
            <p className="text-white/70 text-lg">
              Manage your profile, orders, and quick actions here.
            </p>
            <div className="flex justify-center mt-6">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonBox:
                      "border border-white/20 bg-white/10 p-1 rounded-full shadow-md hover:bg-white/20 transition",
                  },
                }}
              />
            </div>
          </div>

          {/* Account Content */}
<div className="space-y-12 w-full px-4 sm:px-8 lg:px-16">
  {/* Account Information */}
  <section className="bg-white/5 backdrop-blur-md rounded-2xl shadow-lg p-10 border border-white/10 hover:shadow-xl transition">
    <h2 className="text-2xl font-semibold text-white mb-6 border-b border-white/10 pb-3">
      Account Information
    </h2>
    <AccountForm />
  </section>

  {/* Order History */}
  <section className="bg-white/5 backdrop-blur-md rounded-2xl shadow-lg p-10 border border-white/10 hover:shadow-xl transition">
    <h2 className="text-2xl font-semibold text-white mb-6 border-b border-white/10 pb-3">
      Order History
    </h2>
    <OrderHistory />
  </section>
</div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
