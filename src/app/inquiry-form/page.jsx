"use client"
import NavigationBar from "@/components/navigation-bar"
import Footer from "@/components/footer"
import ContactForm from "@/components/ContactForm"

export default function InquiryForm() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#051C29] to-[#0a2a3a] flex flex-col">
      {/* Navigation */}
      <NavigationBar />
      
      {/* Main Content */}
      <div className="flex-1 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-12 border border-white/20">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">
                Contact Us
              </h1>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                Have a question or need assistance? We'd love to hear from you!
              </p>
            </div>
            
            {/* Contact Form */}
            <ContactForm />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
