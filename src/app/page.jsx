"use client"
import { useState, useEffect } from "react"
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/components/footer'

export default function HomePage(){
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentServiceSlide, setCurrentServiceSlide] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const slides = [
    "/bg-image.png",
    "/logo-aquatics.jpg",
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
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Bar */}
      <nav className={`${isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200" : "bg-transparent"} fixed inset-x-0 top-0 z-50 py-4 transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image 
              src="/logo-aquatics.jpg" 
              alt="IOS Aquatics Logo" 
              width={40} 
              height={40} 
              className="rounded-full"
            />
            <h2 className={`${isScrolled ? "text-slate-800" : "text-white"} text-xl font-bold transition-colors`}>
              IOS Aquatics
            </h2>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { href: "#home", label: "Home" },
              { href: "#about", label: "About" },
              { href: "#services", label: "Services" },
              { href: "#contact", label: "Contact" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`${isScrolled ? "text-slate-700 hover:text-slate-900" : "text-white/90 hover:text-white"} font-medium transition-colors px-3 py-2 rounded-md hover:bg-white/10`}
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/store-page"
              className={`${isScrolled ? "text-slate-700 hover:text-slate-900" : "text-white/90 hover:text-white"} font-medium transition-colors px-3 py-2 rounded-md hover:bg-white/10`}
            >
              Store
            </Link>
            <Link
              href="/cart-page"
              className={`${isScrolled ? "text-slate-700 hover:text-slate-900" : "text-white/90 hover:text-white"} font-medium transition-colors px-3 py-2 rounded-md hover:bg-white/10`}
            >
              Cart
            </Link>
            <SignedOut>
              <SignInButton>
                <button className={`${isScrolled ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-white/20 hover:bg-white/30 text-white border border-white/30"} font-medium transition-all px-4 py-2 rounded-md`}>
                  Login
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/account-page"
                className={`${isScrolled ? "text-slate-700 hover:text-slate-900" : "text-white/90 hover:text-white"} font-medium transition-colors px-3 py-2 rounded-md hover:bg-white/10`}
              >
                Account
              </Link>
              <Link
                href="/admin"
                className={`${isScrolled ? "text-slate-700 hover:text-slate-900" : "text-white/90 hover:text-white"} font-medium transition-colors px-3 py-2 rounded-md hover:bg-white/10`}
              >
                Admin
              </Link>
              <UserButton />
            </SignedIn>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`${isScrolled ? "bg-slate-800" : "bg-white"} h-0.5 w-6 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`${isScrolled ? "bg-slate-800" : "bg-white"} h-0.5 w-6 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`${isScrolled ? "bg-slate-800" : "bg-white"} h-0.5 w-6 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-slate-200 transition-all duration-300 ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
          <div className="px-4 py-6 space-y-4">
            {[
              { href: "#home", label: "Home" },
              { href: "#about", label: "About" },
              { href: "#services", label: "Services" },
              { href: "#contact", label: "Contact" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block text-slate-700 hover:text-slate-900 font-medium py-2 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/store-page"
              className="block text-slate-700 hover:text-slate-900 font-medium py-2 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Store
            </Link>
            <Link
              href="/cart-page"
              className="block text-slate-700 hover:text-slate-900 font-medium py-2 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Cart
            </Link>
            <div className="pt-4 border-t border-slate-200">
              <SignedOut>
                <SignInButton>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors">
                    Login
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <div className="space-y-2">
                  <Link
                    href="/account-page"
                    className="block text-slate-700 hover:text-slate-900 font-medium py-2 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Account
                  </Link>
                  <Link
                    href="/admin"
                    className="block text-slate-700 hover:text-slate-900 font-medium py-2 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

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
          <div className="absolute inset-0 bg-black/40" />

          {/* Slideshow Controls */}
          <button
            className="absolute top-1/2 -translate-y-1/2 left-8 text-white text-3xl px-6 py-4 rounded bg-white/20 hover:bg-white/30 backdrop-blur-sm transition z-10"
            onClick={prevSlide}
          >
            &#8249;
          </button>
          <button
            className="absolute top-1/2 -translate-y-1/2 right-8 text-white text-3xl px-6 py-4 rounded bg-white/20 hover:bg-white/30 backdrop-blur-sm transition z-10"
            onClick={nextSlide}
          >
            &#8250;
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                aria-label={`Go to slide ${index + 1}`}
                className={`w-3 h-3 rounded-full border-2 transition ${index === currentSlide ? "bg-white border-white" : "border-white/50 hover:bg-white"}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* Welcome Message Overlay */}
        <div className="relative z-10 text-center text-white max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-lg">
            Welcome to IOS Aquatics
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-12 opacity-90 drop-shadow max-w-2xl mx-auto leading-relaxed">
            Experience beautiful Aquascapes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <Link href="/store-page">
              <button className="w-full sm:w-auto bg-white/20 text-white border-2 border-white px-8 py-4 text-base sm:text-lg rounded-lg transition-all duration-300 backdrop-blur hover:bg-white hover:text-neutral-800 hover:scale-105 hover:shadow-xl">
                Shop Now
              </button>
            </Link>
            <Link href="/inquiry-form">
              <button className="w-full sm:w-auto bg-white/20 text-white border-2 border-white px-8 py-4 text-base sm:text-lg rounded-lg transition-all duration-300 backdrop-blur hover:bg-white hover:text-neutral-800 hover:scale-105 hover:shadow-xl">
                Aquascape Inquiry
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section id="about" className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 sm:mb-12 text-neutral-800">
            About Us
          </h2>
          <p className="text-lg sm:text-xl text-neutral-600 leading-relaxed max-w-4xl mx-auto">
            IOS Aquatics is a home based aquarium and accessories store located in Moonwalk Village, Las Piñas City. It offers variety of fresh water livestocks, plants, fish foods, aquatic equipments and accessories at the lowest price possible.
          </p>
        </div>
      </section>

      <section id="services" className="py-16 sm:py-20 lg:py-24 bg-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 text-neutral-800">
              Our Services
            </h2>
            <p className="text-lg sm:text-xl text-neutral-600 leading-relaxed max-w-4xl mx-auto">
              The IOS Aquatics store contains basic aquarium keeping tools and equipment such as lights and filters, aquascaping materials and hardscapes. Livestock care products like feeds and water medication and of course a variety of livestock and plants.
            </p>
          </div>

          {/* Services Slideshow */}
          <div className="relative h-96 sm:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl shadow-2xl">
            <div className="absolute inset-0">
              {serviceSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === currentServiceSlide ? "opacity-100" : "opacity-0"}`}
                  style={{ backgroundImage: `url(${slide})` }}
                />
              ))}
              <div className="absolute inset-0 bg-black/30" />

              {/* Slideshow Controls */}
              <button
                className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-8 text-white text-2xl sm:text-3xl px-4 sm:px-6 py-3 sm:py-4 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition z-10"
                onClick={prevServiceSlide}
              >
                &#8249;
              </button>
              <button
                className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-8 text-white text-2xl sm:text-3xl px-4 sm:px-6 py-3 sm:py-4 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition z-10"
                onClick={nextServiceSlide}
              >
                &#8250;
              </button>

              {/* Slide Indicators */}
              <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-10">
                {serviceSlides.map((_, index) => (
                  <button
                    key={index}
                    aria-label={`Go to service slide ${index + 1}`}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full border-2 transition ${index === currentServiceSlide ? "bg-white border-white" : "border-white/50 hover:bg-white"}`}
                    onClick={() => goToServiceSlide(index)}
                  />
                ))}
              </div>

              {/* Service Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12">
                <div className="text-center text-white">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4 drop-shadow-lg">
                    {getServiceTitle(currentServiceSlide)}
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg opacity-90 drop-shadow max-w-2xl mx-auto">
                    {getServiceDescription(currentServiceSlide)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 sm:mb-12 text-neutral-800">
            Contact Us
          </h2>
          <p className="text-lg sm:text-xl text-neutral-600 leading-relaxed max-w-4xl mx-auto mb-12">
            Get in touch with us for all your aquarium needs. Visit our store in Moonwalk Village, Las Piñas City or contact us through our inquiry form.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <Link href="/inquiry-form">
              <button className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 text-base sm:text-lg rounded-lg transition-all duration-300 hover:bg-blue-700 hover:scale-105 hover:shadow-xl">
                Contact Us
              </button>
            </Link>
            <Link href="/inquiry-form">
              <button className="w-full sm:w-auto bg-white/20 text-neutral-800 border-2 border-neutral-300 px-8 py-4 text-base sm:text-lg rounded-lg transition-all duration-300 hover:bg-neutral-100 hover:scale-105 hover:shadow-xl">
                Inquire
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
