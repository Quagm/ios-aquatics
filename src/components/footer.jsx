import Image from "next/image"
import Link from "next/link"
import { Waves, MapPin, Phone, Mail, ArrowRight, Facebook, Youtube, Heart} from 'lucide-react'

function Footer() {
  return (
    <footer className="mt-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t border-white/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 text-white">
          
          {/* Logo + Socials */}
          <div className="flex flex-col items-center sm:items-start space-y-6 sm:space-y-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Image 
                  className="rounded-full border-2 border-white/20" 
                  src="/logo-aquatics.jpg" 
                  alt="IOS Aquatics Logo" 
                  width={80} 
                  height={80}
                />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Waves className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">IOS Aquatics</h3>
                <p className="text-slate-400 text-sm">Premium Aquatics Store</p>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-white mb-3">Follow Us</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 group">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <img src="/facebook-icon.svg" alt="Facebook" className="w-4 h-4" />
                  </div>
                  <a 
                    href="https://web.facebook.com/iosaquatics" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-white transition-colors font-medium"
                  >
                    Facebook
                  </a>
                </li>
                <li className="flex items-center gap-3 group">
                  <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                    <img src="/youtube-icon.svg" alt="YouTube" className="w-4 h-4" />
                  </div>
                  <a 
                    href="https://www.youtube.com/@iosaquatics6010" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-white transition-colors font-medium"
                  >
                    YouTube
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Support */}
          <div className="flex flex-col space-y-6">
            <h2 className="font-semibold text-xl text-white mb-2">Contact Info</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Address</h4>
                  <p className="text-slate-300 text-sm">Moonwalk Village, Las Piñas City, Philippines</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Phone className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Phone</h4>
                  <a 
                    href="tel:+639266125840" 
                    className="text-blue-300 hover:text-blue-200 transition-colors text-sm"
                  >
                    +63 926-612-5840
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Mail className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Email</h4>
                  <a 
                    href="mailto:irasabanal08@gmail.com" 
                    className="text-blue-300 hover:text-blue-200 transition-colors text-sm"
                  >
                    irasabanal08@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Account */}
          <div className="flex flex-col space-y-6">
            <h2 className="font-semibold text-xl text-white mb-2">Account</h2>
            <ul className="space-y-3">
              <li>
                <Link href="/account-page" className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/account-page" className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  Login/Register
                </Link>
              </li>
              <li>
                <Link href="/cart-page" className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/store-page" className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  Browse Store
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-6">
            <h2 className="font-semibold text-xl text-white mb-2">Quick Links</h2>
            <ul className="space-y-3">
              <li>
                <Link href="/inquiry-form" className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/inquiry-form" className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  Aquascape Inquiry
                </Link>
              </li>
              <li>
                <span className="text-slate-500 text-sm">Privacy Policy</span>
              </li>
              <li>
                <span className="text-slate-500 text-sm">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="text-center mt-16 sm:mt-20 border-t border-white/10 pt-8 sm:pt-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm sm:text-base">
              © {new Date().getFullYear()} IOS Aquatics. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-1">Made with <Heart className="w-4 h-4 text-red-400" /> for aquarists</span>
              <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
              <span>Las Piñas, Philippines</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
