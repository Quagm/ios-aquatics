"use client"
import { useState, useEffect } from "react"
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { Waves, Fish, Leaf, Wrench, Utensils, Pill, Palette, MapPin, Phone, Mail, Clock, Truck, ShoppingCart, CheckCircle, AlertTriangle, Search, Sparkles, Lightbulb, FileText, ArrowRight } from 'lucide-react'
import Footer from '@/components/footer'
import NavigationBar from "@/components/navigation-bar"

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

  // Handle hash navigation when coming from other pages
  useEffect(() => {
    const handleHashNavigation = () => {
      const hash = window.location.hash
      if (hash) {
        const element = document.querySelector(hash)
        if (element) {
          // Small delay to ensure page is fully loaded
          setTimeout(() => {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
          }, 100)
        }
      }
    }

    // Handle initial load
    handleHashNavigation()

    // Handle hash changes
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

      <NavigationBar />

      {/* Hero Section with Slideshow */}
      <section id="home" className="relative h-screen overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
              style={{ backgroundImage: `url(${slide})` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60" />

          {/* Slideshow Controls */}
          <button
            className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-8 text-white text-2xl sm:text-3xl px-4 sm:px-6 py-3 sm:py-4 rounded-full glass-effect hover:bg-white/30 transition-all duration-300 z-10 group"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-300">&#8249;</span>
          </button>
          <button
            className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-8 text-white text-2xl sm:text-3xl px-4 sm:px-6 py-3 sm:py-4 rounded-full glass-effect hover:bg-white/30 transition-all duration-300 z-10 group"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <span className="group-hover:translate-x-1 transition-transform duration-300">&#8250;</span>
          </button>

          {/* Slide Indicators */}
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

        {/* Welcome Message Overlay */}
        <div className="relative z-10 text-center text-white max-w-5xl px-4 sm:px-6 lg:px-8 animate-fade-in">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm sm:text-base font-medium border border-white/20 mb-4">
              <Waves className="w-4 h-4" />
              Premium Aquatics Store
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight">
            <span className="gradient-text">Welcome to</span>
            <br />
            <span className="text-white">IOS Aquatics</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed font-light">
            Experience the beauty of <span className="text-blue-300 font-medium">underwater gardens</span> and create stunning aquascapes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <Link href="/store-page">
              <button className="group w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white px-12 py-6 text-sm sm:text-base rounded-xl transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:scale-105 hover:shadow-2xl font-semibold border border-blue-500/20">
                <span className="flex items-center justify-center gap-3">
                  Shop Now
                </span>
              </button>
            </Link>
            <Link href="/inquiry-form">
              <button className="group w-full sm:w-auto glass-effect text-white px-12 py-6 text-sm sm:text-base rounded-xl transition-all duration-300 hover:bg-white/30 hover:scale-105 hover:shadow-xl font-semibold border border-white/30">
                <span className="flex items-center justify-center gap-3">
                  Inqure Aquascape
                  <Lightbulb className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                </span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section id="about" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-[1600px] mx-auto sm:px-4 lg:px-6">
          <div className="w-full flex flex-col items-center text-center mb-12">
            <div className="inline-flex items-center gap-4 px-4 top- py-2 bg-blue-500/10 backdrop-blur-sm rounded-full text-sm font-medium text-blue-300 border border-blue-500/20 mb-6">
              <Fish className="w-4 h-4" />
              About Our Store
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white text-center">
              <span className="gradient-text lg:text-6xl">About</span> IOS Aquatics
            </h2>
            <p className="text-lg sm:text-xl lg:text-xl text-slate-300 leading-relaxed text-center max-w-5xl px-8">
              Your trusted partner in creating beautiful underwater ecosystems
            </p>
          </div>
          <div className="w-full flex justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 lg:gap-10 items-center w-full max-w-7xl px-6 sm:px-10 lg:px-16">


              <div className="space-y-6 lg:pl-16 xl:pl-28 lg:translate-x-12 xl:translate-x-18 transition-all duration-300">
                <div className="glass-effect rounded-2xl border border-white/10">
                  <div className="p-8 sm:p-10 lg:p-12 text-center">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Our Story</h3>
                    <p className="text-slate-300 leading-relaxed text-base sm:text-lg">
                      IOS Aquatics is a home-based aquarium and accessories store located in Moonwalk Village,
                      Las Piñas City. We specialize in providing a wide variety of freshwater livestock, plants,
                      fish foods, aquatic equipment, and accessories at the most competitive prices.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-10 relative top-6">
                  <div className="glass-effect rounded-xl p-6 sm:p-8 text-center border border-white/10">
                    <div className="text-3xl font-bold text-blue-400 mb-1">5+</div>
                    <div className="text-slate-300">Years Experience</div>
                  </div>
                  <div className="glass-effect rounded-xl p-6 sm:p-8 text-center border border-white/10">
                    <div className="text-3xl font-bold text-blue-400 mb-1">1000+</div>
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

      <section id="services" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6">
          <div className="text-center mb-8 flex flex-col items-center">
            <h2 className="text-4xl sm:text-5xl lg:text-4xl font-bold mb-6 text-white text-center">
              <span className="gradient-text lg:text-4xl">IOS Aquatics</span> Services
            </h2>
            <p className="text-lg sm:text-xl lg:text-xl text-slate-300 leading-relaxed text-center max-w-5xl px-6">
              From equipment to livestock, we provide everything you need for your aquatic journey
            </p>
          </div>

          {/* Services Grid */}
          <div className="w-full flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16 w-full max-w-6xl px-6 sm:px-8 lg:px-12">
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
                  <div className="p-8 flex flex-col items-center text-center">
                    <div className="mb-4">
                      <service.icon className="w-12 h-12 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{service.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-16 sm:h-20"></div>

          {/* Services Slideshow */}
          <div className="relative h-96 sm:h-[500px] lg:h-[600px] overflow-hidden rounded-3xl shadow-2xl border border-white/10 mt-12 sm:mt-16">
            <div className="absolute inset-0">
              {serviceSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === currentServiceSlide ? "opacity-100" : "opacity-0"}`}
                  style={{ backgroundImage: `url(${slide})` }}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-slate-900/40" />

              {/* Slideshow Controls */}
              <button
                className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-8 text-white text-2xl sm:text-3xl px-4 sm:px-6 py-3 sm:py-4 rounded-full glass-effect hover:bg-white/30 transition-all duration-300 z-10 group"
                onClick={prevServiceSlide}
                aria-label="Previous service slide"
              >
                <span className="group-hover:-translate-x-1 transition-transform duration-300">&#8249;</span>
              </button>
              <button
                className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-8 text-white text-2xl sm:text-3xl px-4 sm:px-6 py-3 sm:py-4 rounded-full glass-effect hover:bg-white/30 transition-all duration-300 z-10 group"
                onClick={nextServiceSlide}
                aria-label="Next service slide"
              >
                <span className="group-hover:translate-x-1 transition-transform duration-300">&#8250;</span>
              </button>

              {/* Slide Indicators */}
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

              {/* Service Info Overlay */}

            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-slate-800 to-slate-900 relative z-10">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6">
          <div className="text-center mb-8">

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white">
              <span className="gradient-text">Contact</span> Us
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 leading-relaxed max-w-4xl mx-auto">
              Ready to start your aquatic journey? We're here to help you every step of the way
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="glass-effect rounded-2xl border border-white/10 p-12">
                <h3 className="text-2xl font-bold text-white mb-5">Visit Our Store</h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Address</h4>
                      <p className="text-slate-300">Moonwalk Village, Las Piñas City, Philippines</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Phone</h4>
                      <a href="tel:+639266125840" className="text-blue-300 hover:text-blue-200 transition-colors">
                        +63 926-612-5840
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Email</h4>
                      <a href="mailto:irasabanal08@gmail.com" className="text-blue-300 hover:text-blue-200 transition-colors">
                        irasabanal08@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              
            </div>

            {/* Contact Actions */}
            <div className="space-y-6">
              <div className="glass-effect rounded-2xl p-10 sm:p-12 border border-white/10 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h3>
                <p className="text-slate-300 mb-8 leading-relaxed">
                  Whether you're a beginner or an experienced aquarist, we have everything you need to create beautiful underwater ecosystems.
                </p>

                <div className="space-y-4">
                  <a href="https://web.facebook.com/iosaquatics" target="_blank" rel="noopener noreferrer">
                    <button className="group w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:scale-105 hover:shadow-2xl font-semibold border border-blue-500/20">
                      <span className="flex items-center justify-center gap-2">
                        Message us on Facebook
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </button>
                  </a>

                  <Link href="/store-page">
                    <button className="group w-full glass-effect text-white px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:bg-white/30 hover:scale-105 hover:shadow-xl font-semibold border border-white/30">
                      <span className="flex items-center justify-center gap-2">
                        Browse Store
                        <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                      </span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
