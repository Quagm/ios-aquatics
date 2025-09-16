import Image from "next/image"

function Footer() {
  return (
    <footer className="mt-16 bg-gradient-to-r from-[#051C29] to-[#0a2a3a] border-t border-white/20 py-12 px-8">
      {/* Top Section */}
      <div className="max-w-6xl mx-auto flex flex-wrap justify-between text-white gap-12">
        
        {/* Logo + Socials */}
        <div className="flex flex-col items-start space-y-6 min-w-[180px]">
          <Image className="rounded-full"src="/logo-aquatics.jpg" alt="Logo" width={120} height={120}/>
          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex items-center gap-3">
              <img src="/facebook-icon.svg" alt="Facebook" className="w-5 h-5" />
              <span>Facebook</span>
            </li>
            <li className="flex items-center gap-3">
              <img src="/youtube-icon.svg" alt="YouTube" className="w-5 h-5" />
              <span>YouTube</span>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div className="flex flex-col space-y-4 min-w-[180px]">
          <h1 className="font-semibold text-lg">Support</h1>
          <ul className="space-y-2 text-sm text-white/80 leading-relaxed">
            <li>Relay, Las Piñas, Philippines, 1747</li>
            <li>+63 926-612-5840</li>
            <li>irasabanal08@gmail.com</li>
          </ul>
        </div>

        {/* Account */}
        <div className="flex flex-col space-y-4 min-w-[180px]">
          <h1 className="font-semibold text-lg">Account</h1>
          <ul className="space-y-2 text-sm text-white/80">
            <li>My Account</li>
            <li>Login/Register</li>
            <li>Cart</li>
            <li>Wishlist</li>
            <li>Shop</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col space-y-4 min-w-[180px]">
          <h1 className="font-semibold text-lg">Quick Links</h1>
          <ul className="space-y-2 text-sm text-white/80">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Contact Us</li>
          </ul>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="max-w-6xl mx-auto text-center mt-12 border-t border-white/10 pt-6">
        <p className="text-white/80 text-lg">
          © {new Date().getFullYear()} Web iOS Aquatics
        </p>
        <p className="text-white/60 text-sm mt-3">
          Your trusted source for freshwater aquarium supplies
        </p>
      </div>
    </footer>
  )
}

export default Footer
