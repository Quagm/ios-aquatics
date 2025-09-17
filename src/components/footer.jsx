import Image from "next/image"
import Link from "next/link"

function Footer() {
  return (
    <footer className="mt-16 bg-gradient-to-r from-[#051C29] to-[#0a2a3a] border-t border-white/20 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 text-white">
          
          {/* Logo + Socials */}
          <div className="flex flex-col items-center sm:items-start space-y-4 sm:space-y-6">
            <Image 
              className="rounded-full" 
              src="/logo-aquatics.jpg" 
              alt="Logo" 
              width={80} 
              height={80}
            />
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-center gap-3">
                <img src="/facebook-icon.svg" alt="Facebook" className="w-5 h-5" />
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li className="flex items-center gap-3">
                <img src="/youtube-icon.svg" alt="YouTube" className="w-5 h-5" />
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  YouTube
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="flex flex-col space-y-4">
            <h2 className="font-semibold text-lg sm:text-xl">Support</h2>
            <ul className="space-y-2 text-sm sm:text-base text-white/80 leading-relaxed">
              <li>Relay, Las Piñas, Philippines, 1747</li>
              <li>
                <a 
                  href="tel:+639266125840" 
                  className="hover:text-white transition-colors"
                >
                  +63 926-612-5840
                </a>
              </li>
              <li>
                <a 
                  href="mailto:irasabanal08@gmail.com" 
                  className="hover:text-white transition-colors"
                >
                  irasabanal08@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="flex flex-col space-y-4">
            <h2 className="font-semibold text-lg sm:text-xl">Account</h2>
            <ul className="space-y-2 text-sm sm:text-base text-white/80">
              <li>
                <Link href="/account-page" className="hover:text-white transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/account-page" className="hover:text-white transition-colors">
                  Login/Register
                </Link>
              </li>
              <li>
                <Link href="/cart-page" className="hover:text-white transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <span className="text-white/60">Wishlist</span>
              </li>
              <li>
                <Link href="/store-page" className="hover:text-white transition-colors">
                  Shop
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-4">
            <h2 className="font-semibold text-lg sm:text-xl">Quick Links</h2>
            <ul className="space-y-2 text-sm sm:text-base text-white/80">
              <li>
                <span className="text-white/60">Privacy Policy</span>
              </li>
              <li>
                <span className="text-white/60">Terms of Service</span>
              </li>
              <li>
                <Link href="/inquiry-form" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="text-center mt-12 sm:mt-16 border-t border-white/10 pt-6 sm:pt-8">
          <p className="text-white/80 text-base sm:text-lg">
            © {new Date().getFullYear()} Web iOS Aquatics
          </p>
          <p className="text-white/60 text-sm sm:text-base mt-3">
            Your trusted source for freshwater aquarium supplies
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
