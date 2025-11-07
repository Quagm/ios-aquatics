"use client"
import NavigationBar from "@/components/navigation-bar"
import Footer from "@/components/Footer"

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden w-full">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <NavigationBar />
      
      <div className="relative z-10 w-full flex-1 pt-6 sm:pt-8 lg:pt-10 pb-16 sm:pb-20 lg:pb-24 flex items-center justify-center">
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          {}
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              <span className="gradient-text">Terms of Service</span>
            </h1>
          </div>

          {}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
            <div className="p-8 sm:p-12 lg:p-16 space-y-8">
              
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                <p className="text-slate-300 leading-relaxed">
                  By using our website or services, you agree to these Terms and our Privacy Policy. If you don't agree, please don't use our site.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. Eligibility</h2>
                <p className="text-slate-300 leading-relaxed">
                  You must be 18 or older to use our services. If you're using our site on behalf of a business, you confirm you have the right to do so.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. Products and Services</h2>
                <p className="text-slate-300 leading-relaxed">
                  We sell aquarium products like tanks, filters, and accessories. All products depend on availability, and we can update or change what we offer at any time.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Orders and Inquiries</h2>
                <p className="text-slate-300 leading-relaxed">
                  You can ask questions about products through our inquiry system. When you place an order, you'll get an email confirming your purchase. Orders are subject to approval and stock availability.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Pricing and Payment</h2>
                <p className="text-slate-300 leading-relaxed">
                  Prices may change at any time. Payments must be made in full before we process your order. We accept various payment methods through our payment partners.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Shipping and Delivery</h2>
                <p className="text-slate-300 leading-relaxed">
                  We aim to ship your order as quickly as possible, but shipping times may vary. Once shipped, you'll get tracking information. We're not responsible for shipping delays caused by third parties.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Account Security</h2>
                <p className="text-slate-300 leading-relaxed">
                  If you create an account on our site, you're responsible for keeping your login details safe. If someone uses your account without permission, let us know immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">8. User Conduct</h2>
                <p className="text-slate-300 leading-relaxed">
                  You agree not to use our website for illegal activities or to disrupt our services. Please use the inquiry and ordering systems responsibly.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">9. Intellectual Property</h2>
                <p className="text-slate-300 leading-relaxed">
                  All content on our site (like text, images, and logos) is owned by IOS Aquatics. You can't copy or use it without our permission.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">10. Limitation of Liability</h2>
                <p className="text-slate-300 leading-relaxed">
                  We're not responsible for any damage, loss, or issue that happens from using our products or services, except for the amount you paid for the product.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">11. Privacy</h2>
                <p className="text-slate-300 leading-relaxed">
                  We care about your privacy. Please read our <a href="/privacy-policy" className="text-blue-400 hover:text-blue-300 underline">Privacy Policy</a> to understand how we collect and protect your information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">12. Changes to These Terms</h2>
                <p className="text-slate-300 leading-relaxed">
                  We may update these Terms at any time. Any changes will be posted on this page, and the "Last Updated" date will be updated. By continuing to use our website, you accept the updated Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">13. Contact Us</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                  If you have any questions or concerns about these Terms, please contact us at:
                </p>
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-3">
                  <p className="text-slate-300">
                    <span className="font-semibold text-white">Email:</span>{" "}
                    <a href="mailto:irasabanal08@gmail.com" className="text-blue-400 hover:text-blue-300 underline">
                      irasabanal08@gmail.com
                    </a>
                  </p>
                  <p className="text-slate-300">
                    <span className="font-semibold text-white">Phone:</span>{" "}
                    <a href="tel:09266125840" className="text-blue-400 hover:text-blue-300 underline">
                      0926 612 5840
                    </a>
                  </p>
                  <p className="text-slate-300">
                    <span className="font-semibold text-white">Address:</span> Relay 1747, Las Piñas, Philippines
                  </p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

