"use client"

export default function AccountForm() {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-white border-b border-white/30 pb-3">
        Account Information
      </h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white mb-3">
            Full Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c47ff] text-white placeholder-white/70"
            placeholder="John Doe"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white mb-3">
            Email Address
          </label>
          <input
            type="email"
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c47ff] text-white placeholder-white/70"
            placeholder="john@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white mb-3">
            Phone Number
          </label>
          <input
            type="tel"
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c47ff] text-white placeholder-white/70"
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>
      
      <button className="w-full bg-[#6c47ff] text-white py-3 rounded-full hover:bg-[#5a3ae6] transition-colors font-medium">
        Update Information
      </button>
    </div>
  )
}
