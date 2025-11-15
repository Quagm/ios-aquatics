"use client"
import { useState, useEffect } from "react"
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { Waves, Fish, Leaf, Wrench, Utensils, Pill, Palette, MapPin, Phone, Mail, Clock, Truck, ShoppingCart, CheckCircle, AlertTriangle, Search, Sparkles, Lightbulb, FileText, ArrowRight, MessageSquare } from 'lucide-react'
import Footer from '@/components/Footer'
import NavigationBar from "@/components/navigation-bar"
import ContactForm from '@/components/ContactForm'

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentServiceSlide, setCurrentServiceSlide] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const slides = [
    "/bg-image.png",
    "/slide-img/slide-img.png",
    "/slide-img/slide-img1.png"
  ]

  const serviceSlides = [
    "/services-slides/planted-aquarium.png",
    "/services-slides/koi-ponds.png",
    "/services-slides/large-scale-projects.png",
    "/services-slides/monster-tanks.png",
    "/services-slides/moss-wall-design.png",
    "/services-slides/paludarium-system.png",
    "/services-slides/terrarium-enclosures.png",
    "/services-slides/slide-img.png",
    "/services-slides/slide-img1.png"
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentServiceSlide((prev) => (prev + 1) % serviceSlides.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [serviceSlides.length])

  useEffect(() => {
    const handleHashNavigation = () => {
      const hash = window.location.hash
      if (hash) {
        const element = document.querySelector(hash)
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
          }, 100)
        }
      }
    }

    handleHashNavigation()

    window.addEventListener('hashchange', handleHashNavigation)
    return () => window.removeEventListener('hashchange', handleHashNavigation)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const nextServiceSlide = () => {
    setCurrentServiceSlide((prev) => (prev + 1) % serviceSlides.length)
  }

  const prevServiceSlide = () => {
    setCurrentServiceSlide((prev) => (prev - 1 + serviceSlides.length) % serviceSlides.length)
  }

  const goToServiceSlide = (index) => {
    setCurrentServiceSlide(index)
  }

  const getServiceTitle = (index) => {
    const titles = [
      "Planted Aquariums",
      "Koi Ponds",
      "Large Scale Projects",
      "Monster Tanks",
      "Moss Wall Design",
      "Paludarium Systems",
      "Terrarium Enclosures",
      "Custom Aquascapes",
      "Aquarium Maintenance"
    ]
    return titles[index] || "Our Services"
  }

  const getServiceDescription = (index) => {
    const descriptions = [
      "Beautiful underwater gardens with live plants and natural aquascaping",
      "Stunning outdoor water features with colorful koi fish and aquatic plants",
      "Custom large-scale aquarium installations for commercial and residential spaces",
      "Massive custom tanks for large fish species and unique aquatic displays",
      "Living wall designs featuring moss and aquatic plants for vertical gardens",
      "Hybrid ecosystems combining aquatic and terrestrial environments",
      "Self-contained ecosystems for reptiles, amphibians, and tropical plants",
      "Personalized aquascape designs tailored to your space and preferences",
      "Regular maintenance and care services to keep your aquarium healthy and beautiful"
    ]
    return descriptions[index] || "Professional aquarium and aquatic design services"
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 w-full">
      <main className="flex-1 w-full flex flex-col items-center pb-16 sm:pb-20 lg:pb-24">

      <NavigationBar />

      <section id="home" className="relative h-screen w-full overflow-hidden flex items-center justify-center pt-12 sm:pt-16 lg:pt-20">
        <div className="absolute inset-0 w-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
              style={{ backgroundImage: `url(${slide})` }}
            />
          ))}
          <div className="absolute inset-0 w-full bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60" />

          <button
            className="absolute left-0 top-0 w-1/2 h-full z-10 cursor-pointer"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <div className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-8 text-white text-2xl sm:text-3xl px-4 sm:px-6 py-3 sm:py-4 rounded-full group">
              <span className="group-hover:-translate-x-1 transition-transform duration-300">&#8249;</span>
            </div>
          </button>
          <button
            className="absolute right-0 top-0 w-1/2 h-full z-10 cursor-pointer"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <div className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-8 text-white text-2xl sm:text-3xl px-4 sm:px-6 py-3 sm:py-4 rounded-full group">
              <span className="group-hover:translate-x-1 transition-transform duration-300">&#8250;</span>
            </div>
          </button>

          <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                aria-label={`Go to slide ${index + 1}`}
                className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${index === currentSlide
                    ? "bg-white border-white scale-125"
                    : "border-white/50 hover:bg-white/50 hover:border-white hover:scale-110"
                  }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 text-center text-white w-full max-w-6xl mx-auto px-4 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 leading-tight text-center">
            <span className="gradient-text">Welcome to</span>
            <br />
            <span className="text-white">IOS Aquatics</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 opacity-90 leading-relaxed font-light text-center px-4">
            Experience the beauty of <span className="text-blue-300 font-medium">underwater gardens</span> and create stunning aquascapes
          </p>
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center items-center px-4 py-2">
            <Link href="/store-page">
              <button className="group w-full sm:w-auto my-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-24 py-9 text-sm sm:text-base rounded-xl transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:scale-105 hover:shadow-2xl font-semibold border border-blue-500/20" style={{padding: '10px 18px'}}>
                <span className="flex items-center justify-center gap-3">
                  Shop Now
                </span>
              </button>
            </Link>
            <Link href="/inquiry-form">
              <button className="group w-full sm:w-auto my-2 glass-effect text-white px-24 py-9 text-sm sm:text-base rounded-xl transition-all duration-300 hover:bg-white/30 hover:scale-105 hover:shadow-xl font-semibold border border-white/30" style={{padding: '10px 18px'}}>
                <span className="flex items-center justify-center gap-3">
                  Inquire Aquascape
                  <Lightbulb className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                </span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section id="about" className="py-12 sm:py-16 lg:py-20 w-full flex justify-center" style={{marginTop: '20px', backgroundColor: 'transparent'}}>
        <div className="max-w-[1600px] mx-auto w-full" style={{paddingTop: '30px', paddingLeft: '20px', paddingRight: '20px'}}>
          <div className="w-full flex flex-col items-center text-center" style={{marginBottom: '40px'}}>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 text-white text-center">
              <span className="gradient-text lg:text-6xl">About</span> IOS Aquatics
            </h2>
            <p className="text-lg sm:text-xl lg:text-xl text-slate-300 leading-relaxed text-center max-w-5xl">
              Your trusted partner in creating beautiful underwater ecosystems
            </p>
          </div>
          <div className="w-full flex justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center w-full max-w-7xl px-8 sm:px-12 lg:px-20">

              <div className="space-y-8 lg:pl-16 xl:pl-28 lg:translate-x-12 xl:translate-x-18 transition-all duration-300">
                <div className="glass-effect rounded-2xl border border-white/10">
                  <div className="p-10 sm:p-12 lg:p-14 text-center">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Our Story</h3>
                    <p className="text-slate-300 leading-relaxed text-base sm:text-lg">
                      IOS Aquatics is a home-based aquarium and accessories store located in Moonwalk Village,
                      Las Piñas City. We specialize in providing a wide variety of freshwater livestock, plants,
                      fish foods, aquatic equipment, and accessories at the most competitive prices.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-12 relative top-8">
                  <div className="glass-effect rounded-xl p-8 sm:p-10 text-center border border-white/10">
                    <div className="text-3xl font-bold text-blue-400 mb-2">5+</div>
                    <div className="text-slate-300">Years Experience</div>
                  </div>
                  <div className="glass-effect rounded-xl p-8 sm:p-10 text-center border border-white/10">
                    <div className="text-3xl font-bold text-blue-400 mb-2">1000+</div>
                    <div className="text-slate-300">Happy Customers</div>
                  </div>
                </div>
              </div>


              <div className="relative flex justify-center lg:justify-end -translate-x-2 lg:-translate-x-6">
                <div className="aspect-square w-[85%] sm:w-[80%] md:w-[70%] lg:w-[75%] xl:w-[70%] rounded-2xl overflow-hidden glass-effect border border-white/10">
                  <Image
                    src="/store-front-image.jpg"
                    alt="IOS Aquatics Store"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-12 sm:py-16 lg:py-20 w-full flex justify-center" style={{marginTop: '20px', backgroundColor: 'transparent'}}>
        <div className="max-w-[1600px] mx-auto w-full" style={{paddingTop: '30px', paddingLeft: '20px', paddingRight: '20px'}}>
          <div className="text-center flex flex-col items-center" style={{marginBottom: '40px'}}>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 text-white text-center">
              <span className="gradient-text lg:text-6xl">IOS Aquatics</span> Services
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 leading-relaxed text-center max-w-5xl">
              From equipment to livestock, we provide everything you need for your aquatic journey
            </p>
          </div>

          <div className="w-full flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-20 w-full max-w-6xl px-8 sm:px-10 lg:px-16">
              {[
                { icon: Fish, title: "Freshwater Livestock", desc: "Healthy fish, shrimp, and aquatic creatures" },
                { icon: Leaf, title: "Aquatic Plants", desc: "Live plants for natural aquascaping" },
                { icon: Wrench, title: "Equipment & Tools", desc: "Filters, lights, and maintenance tools" },
                { icon: Utensils, title: "Fish Food & Nutrition", desc: "Premium feeds and supplements" },
                { icon: Pill, title: "Water Treatment", desc: "Medications and water conditioners" },
                { icon: Palette, title: "Aquascaping Materials", desc: "Substrates, rocks, and decorations" },
              ].map((service, index) => (
                <div
                  key={index}
                  className="glass-effect rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="p-10 flex flex-col items-center text-center">
                    <div className="mb-6">
                      <service.icon className="w-14 h-14 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{service.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-20 sm:h-24"></div>

          <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden rounded-3xl shadow-2xl border border-white/10 mt-16 sm:mt-20">
            <div className="absolute inset-0">
              {serviceSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === currentServiceSlide ? "opacity-100" : "opacity-0"}`}
                  style={{ backgroundImage: `url(${slide})` }}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-slate-900/40" />

              <button
                className="absolute left-0 top-0 w-1/2 h-full z-10 cursor-pointer"
                onClick={prevServiceSlide}
                aria-label="Previous service slide"
              >
                <div className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-8 text-white text-2xl sm:text-3xl px-4 sm:px-6 py-3 sm:py-4 rounded-full group">
                  <span className="group-hover:-translate-x-1 transition-transform duration-300">&#8249;</span>
                </div>
              </button>
              <button
                className="absolute right-0 top-0 w-1/2 h-full z-10 cursor-pointer"
                onClick={nextServiceSlide}
                aria-label="Next service slide"
              >
                <div className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-8 text-white text-2xl sm:text-3xl px-4 sm:px-6 py-3 sm:py-4 rounded-full group">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">&#8250;</span>
                </div>
              </button>

              <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                {serviceSlides.map((_, index) => (
                  <button
                    key={index}
                    aria-label={`Go to service slide ${index + 1}`}
                    className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${index === currentServiceSlide
                        ? "bg-white border-white scale-125"
                        : "border-white/50 hover:bg-white/50 hover:border-white hover:scale-110"
                      }`}
                    onClick={() => goToServiceSlide(index)}
                  />
                ))}
              </div>


            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-12 sm:py-16 lg:py-20 relative z-10 w-full flex justify-center" style={{marginTop: '20px', backgroundColor: 'transparent'}}>
        <div className="max-w-[1600px] mx-auto w-full" style={{paddingTop: '30px', paddingLeft: '20px', paddingRight: '20px'}}>
          <div className="text-center flex flex-col items-center justify-center" style={{marginBottom: '40px'}}>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 text-white">
              <span className="gradient-text">Contact</span> Us
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 leading-relaxed max-w-4xl mx-auto text-center">
              Ready to start your aquatic journey? We're here to help you every step of the way
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div className="space-y-10">
              <div className="glass-effect rounded-2xl border border-white/10 p-10 sm:p-12 lg:p-14" style={{padding: '16px 48px'}}>
                <div className="px-8 sm:px-12 lg:px-16 py-4 sm:py-5">
                  <h3 className="text-2xl font-bold text-white mb-5">Visit Our Store</h3>
                  <div className="space-y-5">
                   <div className="flex items-start gap-6 py-3">
                    <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-7 h-7 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">Address</h4>
                      <p className="text-slate-300">Relay 1747 Las Piñas, Philippines</p>
                    </div>
                  </div>

                   <div className="flex items-start gap-6 py-3">
                    <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-7 h-7 text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">Phone</h4>
                      <a href="tel:+639266125840" className="text-blue-300 hover:text-blue-200 transition-colors">
                        +63 926-612-5840
                      </a>
                    </div>
                  </div>

                   <div className="flex items-start gap-6 py-3">
                    <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-7 h-7 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">Email</h4>
                      <a href="mailto:irasabanal08@gmail.com" className="text-blue-300 hover:text-blue-200 transition-colors">
                        irasabanal08@gmail.com
                      </a>
                    </div>
                  </div>
                  </div>
                </div>
              </div>

              
            </div>

            <div className="space-y-8">
              <div className="glass-effect rounded-2xl border border-white/10 mt-12 sm:mt-16 md:mt-20 lg:mt-24" style={{ padding: '3rem 4rem' }}>
                <div className="flex items-center gap-3 mb-12">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Feedback & Contact</h3>
                    <p className="text-slate-300 text-sm">We'd love to hear from you!</p>
                  </div>
                </div>
                <div className="w-full mt-8">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      </main>
      <Footer />
    </div>
  )
}
