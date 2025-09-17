"use client"
import NavigationBar from "@/components/navigation-bar"
import Footer from "@/components/footer"
import AquascapeForm from "@/components/AquascapeForm"

export default function InquiryForm() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#051C29] to-[#0a2a3a] flex flex-col">
      {/* Navigation */}
      <NavigationBar />
      
      {/* Main Content */}
      <div className="flex-1 py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-12 border border-white/20">
            {/* Header */}
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                Aquascape Inquiry
              </h1>
              <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                Let us help you create the perfect aquascape for your space!
              </p>
            </div>
            
            {/* Aquascape Form */}
            <AquascapeForm />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
