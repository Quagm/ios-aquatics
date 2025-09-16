"use client"
import { useState, useEffect } from "react"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import Link from "next/link"

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const slides = ["/bg-image.png", "/logo-aquatics.jpg"]

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % slides.length),
      5000
    )
    return () => clearInterval(interval)
  }, [slides.length])

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  const goToSlide = (index) => setCurrentSlide(index)

  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <nav
        className={`${
          isScrolled
            ? "bg-neutral-400/95 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        } fixed inset-x-0 top-0 z-[1000] py-4 transition-all duration-300`}
      >
        <div className="max-w-[1200px] mx-auto px-8 flex items-center justify-between">
          <h2
            className={`${
              isScrolled ? "text-neutral-800" : "text-white"
            } text-xl font-bold`}
          >
            IOS Aquatics
          </h2>

          {/* Desktop menu */}
          <div className="hidden md:flex gap-8 list-none">
            {[
              { href: "#home", label: "Home" },
              { href: "#about", label: "About" },
              { href: "#services", label: "Services" },
              { href: "#contact", label: "Contact" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`${
                  isScrolled
                    ? "text-neutral-800 hover:bg-black/10"
                    : "text-white hover:bg-white/20"
                } font-medium transition-all px-4 py-2 rounded`}
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/store-page"
              className={`${
                isScrolled
                  ? "text-neutral-800 hover:bg-black/10"
                  : "text-white hover:bg-white/20"
              } font-medium transition-all px-4 py-2 rounded`}
            >
              Store
            </Link>
            <Link
              href="/cart-page"
              className={`${
                isScrolled
                  ? "text-neutral-800 hover:bg-black/10"
                  : "text-white hover:bg-white/20"
              } font-medium transition-all px-4 py-2 rounded`}
            >
              Cart
            </Link>
            <SignedOut>
              <SignInButton>
                <button
                  className={`${
                    isScrolled
                      ? "text-neutral-800 hover:bg-black/10"
                      : "text-white hover:bg-white/20"
                  } font-medium transition-all px-4 py-2 rounded`}
                >
                  Login
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/account-page"
                className={`${
                  isScrolled
                    ? "text-neutral-800 hover:bg-black/10"
                    : "text-white hover:bg-white/20"
                } font-medium transition-all px-4 py-2 rounded`}
              >
                Account
              </Link>
              <Link
                href="/admin"
                className={`${
                  isScrolled
                    ? "text-neutral-800 hover:bg-black/10"
                    : "text-white hover:bg-white/20"
                } font-medium transition-all px-4 py-2 rounded`}
              >
                Admin
              </Link>
              <UserButton />
            </SignedIn>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`${
                isScrolled ? "bg-neutral-800" : "bg-white"
              } h-[3px] w-6 transition-all`}
            />
            <span
              className={`${
                isScrolled ? "bg-neutral-800" : "bg-white"
              } h-[3px] w-6 transition-all`}
            />
            <span
              className={`${
                isScrolled ? "bg-neutral-800" : "bg-white"
              } h-[3px] w-6 transition-all`}
            />
          </button>
        </div>

        {/* Mobile menu drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-[64px] transition-[right] duration-300">
            <div className="absolute inset-0 bg-black/80"></div>
            <div className="absolute inset-y-0 right-0 w-full bg-black/95 flex flex-col items-center justify-center gap-6">
              {[
                { href: "#home", label: "Home" },
                { href: "#about", label: "About" },
                { href: "#services", label: "Services" },
                { href: "#contact", label: "Contact" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-white font-medium px-4 py-2 rounded hover:bg-white/20 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <Link
                href="/store-page"
                className="text-white font-medium px-4 py-2 rounded hover:bg-white/20 transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Store
              </Link>
              <Link
                href="/cart-page"
                className="text-white font-medium px-4 py-2 rounded hover:bg-white/20 transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Cart
              </Link>
              <SignedOut>
                <SignInButton>
                  <button className="text-white font-medium px-4 py-2 rounded hover:bg-white/20 transition">
                    Login
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/account-page"
                  className="text-white font-medium px-4 py-2 rounded hover:bg-white/20 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Account
                </Link>
                <Link
                  href="/admin"
                  className="text-white font-medium px-4 py-2 rounded hover:bg-white/20 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </Link>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Slideshow */}
      <section
        id="home"
        className="relative h-screen overflow-hidden flex items-center justify-center"
      >
        <div className="absolute inset-0">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
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
                className={`w-3 h-3 rounded-full border-2 transition ${
                  index === currentSlide
                    ? "bg-white border-white"
                    : "border-white/50 hover:bg-white"
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* Welcome Message Overlay */}
        <div className="relative z-10 text-center text-white max-w-[800px] px-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow lg:drop-shadow-lg">
            Welcome to IOS Aquatics
          </h1>
          <p className="text-base md:text-lg mb-8 opacity-90 drop-shadow">
            Experience beautiful Aquascapes
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/inquiry-form">
              <button className="bg-white/20 text-white border-2 border-white px-8 py-4 text-base rounded transition backdrop-blur hover:bg-white hover:text-neutral-800 hover:-translate-y-0.5">
                Inquire
              </button>
            </Link>
            <Link href="/store-page">
              <button className="bg-white/20 text-white border-2 border-white px-8 py-4 text-base rounded transition backdrop-blur hover:bg-white hover:text-neutral-800 hover:-translate-y-0.5">
                Shop
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section id="about" className="py-20">
        <div className="max-w-[1200px] mx-auto px-8 text-center">
          <h2 className="text-4xl mb-8 text-neutral-800">About Us</h2>
          <p className="text-[17.6px] text-neutral-600 leading-8 max-w-[600px] mx-auto">
            IOS Aquatics is a home based aquarium and accessories store located
            in Moonwalk Village, Las Piñas City. It offers variety of fresh
            water livestock, plants, fish foods, aquatic equipment and
            accessories at the lowest price possible.
          </p>
        </div>
      </section>

      <section id="services" className="py-20 bg-neutral-100">
        <div className="max-w-[1200px] mx-auto px-8 text-center">
          <h2 className="text-4xl mb-8 text-neutral-800">Our Services</h2>
          <p className="text-[17.6px] text-neutral-600 leading-8 max-w-[600px] mx-auto">
            The IOS Aquatics store contains basic aquarium keeping tools and
            equipment such as lights and filters, aquascaping materials and
            hardscapes. Livestock care products like feeds and water medication
            and of course a variety of livestock and plants.
          </p>
        </div>
      </section>

      <section id="contact" className="py-20">
        <div className="max-w-[1200px] mx-auto px-8 text-center">
          <h2 className="text-4xl mb-8 text-neutral-800">Contact Us</h2>
          <p className="text-[17.6px] text-neutral-600 leading-8 max-w-[600px] mx-auto">
            Get in touch with us for all your aquarium needs. Visit our store in
            Moonwalk Village, Las Piñas City or contact us through our inquiry
            form.
          </p>
          <div className="mt-8">
            <Link href="/inquiry-form">
              <button className="bg-blue-600 text-white px-8 py-4 text-base rounded transition hover:bg-blue-700 hover:-translate-y-0.5">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
