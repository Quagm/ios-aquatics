"use client"
import NavigationBar from "@/components/navigation-bar"
import Footer from "@/components/Footer"
import AquascapeForm from "@/components/AquascapeForm"
import { ToastProvider } from "@/components/ui/ToastProvider"
import { Fish, Leaf, Sparkles, Waves } from "lucide-react"

export default function InquiryForm() {
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden w-full">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <NavigationBar />
      
      <div className="relative z-10 w-full flex-1 pt-6 sm:pt-8 lg:pt-10 pb-36 sm:pb-44 lg:pb-56 flex flex-col items-center">
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 lg:mb-10 flex flex-col items-center">
            
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-4 max-w-4xl mx-auto">
              <span className="text-white">Aquascape</span> <span className="text-slate-300">Inquiry</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-6 text-center">
              Let us help you create the perfect aquascape for your space!
            </p>
            
          </div>

          <div className="relative flex justify-center">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden w-full max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 -mt-14 sm:-mt-12 lg:-mt-10 mb-36 sm:mb-48 lg:mb-60">
              <div className="h-1 bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600"></div>
              
              <div className="p-8 sm:p-12 lg:p-16">
                <AquascapeForm />
              </div>
            </div>
            
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-500/20 rounded-full blur-sm"></div>
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-emerald-500/20 rounded-full blur-sm"></div>
            <div className="absolute top-1/2 -right-8 w-6 h-6 bg-purple-500/20 rounded-full blur-sm"></div>
          </div>
        </div>
      </div>
      
      <Footer className="mt-24 sm:mt-32" />
    </div>
    </ToastProvider>
  )
}
