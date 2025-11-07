"use client"
import NavigationBar from "@/components/navigation-bar"
import Footer from "@/components/Footer"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden w-full">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <NavigationBar />
      
      <div className="relative z-10 w-full flex-1 pt-6 sm:pt-8 lg:pt-10 pb-16 sm:pb-20 lg:pb-24 flex items-center justify-center">
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              <span className="gradient-text">Privacy Policy</span>
            </h1>
          </div>

          {/* Content */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
            <div className="p-8 sm:p-12 lg:p-16 space-y-8">
              
              <section>
                <p className="text-slate-300 leading-relaxed">
                  This Privacy Policy explains how we collect, use, and protect your data when you visit our website or use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                  We collect the following types of information when you interact with our website:
                </p>
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Personal Information:</h3>
                    <p className="text-slate-300 leading-relaxed">
                      This includes details like your name, email address, shipping address, phone number, and payment information when you place an order.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Usage Data:</h3>
                    <p className="text-slate-300 leading-relaxed">
                      We may collect information about how you use our website, such as the pages you visit, the time spent on our site, and other browsing data.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                  We use the information we collect for:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                  <li><strong className="text-white">Order Processing:</strong> To process your orders, send order confirmations, and provide customer support.</li>
                  <li><strong className="text-white">Improving Our Services:</strong> To improve our website, products, and customer service based on your feedback and usage data.</li>
                  <li><strong className="text-white">Marketing:</strong> With your consent, we may send you updates about new products, special offers, and other information related to IOS Aquatics. You can opt-out at any time.</li>
                  <li><strong className="text-white">Security:</strong> To protect our website and users from fraud and abuse.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. How We Protect Your Information</h2>
                <p className="text-slate-300 leading-relaxed">
                  We take your privacy seriously and implement various security measures to safeguard your personal data. However, no method of transmission over the internet is 100% secure, so while we strive to protect your information, we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Sharing Your Information</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                  We do not sell, trade, or rent your personal information to third parties. However, we may share your information in the following cases:
                </p>
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">With Service Providers:</h3>
                    <p className="text-slate-300 leading-relaxed">
                      We may share your data with trusted third-party service providers (e.g., payment processors, shipping partners) who help us run our website and fulfill orders.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Legal Compliance:</h3>
                    <p className="text-slate-300 leading-relaxed">
                      If required by law, we may disclose your information to comply with legal processes, such as subpoenas or court orders.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights and Choices</h2>
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Access and Update:</h3>
                    <p className="text-slate-300 leading-relaxed">
                      You have the right to access and update the personal information we hold about you. You can do this by logging into your account or contacting us directly.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Opt-Out of Marketing:</h3>
                    <p className="text-slate-300 leading-relaxed">
                      You can opt-out of receiving marketing emails at any time by clicking the "unsubscribe" link in our emails or by contacting us.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Changes to This Privacy Policy</h2>
                <p className="text-slate-300 leading-relaxed">
                  We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the "Last Updated" date will be updated. Please check this page regularly for any updates.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Contact Us</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                  If you have any questions or concerns about this Privacy Policy, please contact us at:
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

