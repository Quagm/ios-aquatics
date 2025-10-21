"use client"
import NavigationBar from "@/components/navigation-bar"
import Footer from "@/components/Footer"
import AquascapeForm from "@/components/AquascapeForm"

export default function InquiryForm() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#051C29] to-[#0a2a3a]">
      {/* Navigation */}
      <div className="h-24 sm:h-28 lg:h-32"></div>
      <NavigationBar />
      
      {/* Main Content */}
        <div className="pt-32 sm:pt-36 lg:pt-40 pb-12 sm:pb-16 lg:pb-20 flex justify-center px-4 sm:px-8 lg:px-12">
        <div className="w-[90%] max-w-[1600px]">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-10 sm:p-14 lg:p-16 xl:p-20 border border-white/20">
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-8 sm:mb-12 lg:mb-16">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                Aquascape Inquiry
              </h1>
             <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed text-center">
                Let us help you create the perfect aquascape for your space!
              </p>
            </div>
            
            {/* Aquascape Form */}
            <div className="flex justify-center w-full px-4 sm:px-6 lg:px-10">
            <div className="w-full max-w-6xl">
              <AquascapeForm />
               </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
