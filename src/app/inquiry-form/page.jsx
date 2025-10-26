"use client"
import NavigationBar from "@/components/navigation-bar"
import Footer from "@/components/Footer"
import AquascapeForm from "@/components/AquascapeForm"
import { Fish, Leaf, Sparkles, Waves } from "lucide-react"

export default function InquiryForm() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <div className="h-24 sm:h-28 lg:h-32"></div>
      <NavigationBar />
      
      {/* Main Content */}
      <div className="relative z-10 w-full" style={{paddingTop: '120px', paddingBottom: '120px'}}>
        <div className="max-w-6xl mx-auto w-full" style={{paddingLeft: '0px', paddingRight: '0px'}}>
          {/* Header Section */}
          <div className="text-center" style={{marginBottom: '80px'}}>
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold text-slate-300 border border-white/20" style={{padding: '16px 32px', marginBottom: '48px'}}>
              <Fish className="w-5 h-5" />
              <span>Aquascape Design Service</span>
              <Leaf className="w-5 h-5" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight" style={{marginBottom: '48px'}}>
              <span className="text-white">Aquascape</span>
              <br />
              <span className="text-slate-300">Inquiry</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed" style={{marginBottom: '48px'}}>
              Let us help you create the perfect aquascape for your space!
            </p>
            
            <div className="flex items-center justify-center gap-3 text-slate-400">
              <Sparkles className="w-5 h-5" />
              <span className="text-lg">Professional Design & Installation</span>
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

          {/* Form Container */}
          <div className="relative">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
              {/* Decorative Top Border */}
              <div className="h-1 bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600"></div>
              
              <div className="p-12 sm:p-16 lg:p-20" style={{padding: '80px'}}>
                <AquascapeForm />
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-500/20 rounded-full blur-sm"></div>
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-emerald-500/20 rounded-full blur-sm"></div>
            <div className="absolute top-1/2 -right-8 w-6 h-6 bg-purple-500/20 rounded-full blur-sm"></div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
