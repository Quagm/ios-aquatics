"use client"
import NavigationBar from "@/components/navigation-bar"
import Footer from "@/components/footer"
import { UserButton } from "@clerk/nextjs"
import AccountForm from "@/components/AccountForm"
import OrderHistory from "@/components/OrderHistory"
import QuickActions from "@/components/QuickActions"

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#051C29] to-[#0a2a3a] flex flex-col">
      {/* Navigation */}
      <NavigationBar />
      
      {/* Main Content */}
      <div className="flex-1 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/20">
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-white mb-6">
                My Account
              </h1>
              <div className="flex justify-center">
                <UserButton />
              </div>
            </div>

            {/* Account Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Account Information */}
              <AccountForm />

              {/* Order History */}
              <OrderHistory />
            </div>

            {/* Quick Actions */}
            <QuickActions />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
