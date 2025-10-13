"use client"
import NavigationBar from "@/components/navigation-bar"
import Footer from "@/components/footer"
import ProductCard from "@/components/ProductCard"
import { useEffect, useMemo, useState } from "react"
import { fetchProducts } from "@/lib/queries"
import { ShoppingCart, AlertTriangle, Search, Sparkles, ArrowDown, Fish, Leaf, Wrench, Utensils, Pill, Palette } from 'lucide-react'

export default function StorePage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [visibleCount, setVisibleCount] = useState(8)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [query, setQuery] = useState("")

  // Services slideshow state (ported from HomePage)
  const [currentServiceSlide, setCurrentServiceSlide] = useState(0)
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
    const interval = setInterval(() => {
      setCurrentServiceSlide((prev) => (prev + 1) % serviceSlides.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [serviceSlides.length])

  const nextServiceSlide = () => setCurrentServiceSlide((p) => (p + 1) % serviceSlides.length)
  const prevServiceSlide = () => setCurrentServiceSlide((p) => (p - 1 + serviceSlides.length) % serviceSlides.length)
  const goToServiceSlide = (index) => setCurrentServiceSlide(index)

  const categories = ["all", "Equipment", "Food", "Chemicals", "Lighting", "Decorations", "Accessories"]

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError("")
    fetchProducts({ category: selectedCategory })
      .then((data) => {
        if (!isMounted) return
        setProducts(data)
        setVisibleCount(8)
      })
      .catch((e) => {
        if (!isMounted) return
        setError(e.message || "Failed to load products")
      })
      .finally(() => {
        if (!isMounted) return
        setLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [selectedCategory])

  const filteredProducts = useMemo(() => {
    let list = selectedCategory === "all" ? products : products.filter(p => p.category === selectedCategory)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter(p => (
        (p.name || '').toLowerCase().includes(q) ||
        (p.sku || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
      ))
    }
    return list
  }, [products, selectedCategory, query])

  const visibleProducts = filteredProducts.slice(0, visibleCount)

  const canLoadMore = visibleCount < filteredProducts.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <div className="h-24 sm:h-28 lg:h-32"></div>
      <NavigationBar />
      
      {/* Main Content */}
      <div className="flex-1 py-16 sm:py-20 lg:py-24">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 backdrop-blur-sm rounded-full text-sm font-medium text-blue-300 border border-blue-500/20 mb-6">
              <ShoppingCart className="w-4 h-4" />
              Our Store
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="gradient-text">Premium</span> Aquatics Store
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Discover our wide selection of freshwater fish, plants, equipment, and accessories at the best prices
            </p>
          </div>

          {/* Services Slideshow (smaller, no heading) */}
          <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden rounded-3xl shadow-2xl border border-white/10 mb-12">
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
                    className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                      index === currentServiceSlide 
                        ? "bg-white border-white scale-125" 
                        : "border-white/50 hover:bg-white/50 hover:border-white hover:scale-110"
                    }`}
                    onClick={() => goToServiceSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Search + Filter Section */}
          <div className="mb-12 space-y-6">
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                />
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setVisibleCount(8) }}
                  className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 font-semibold border text-sm sm:text-base ${
                    selectedCategory === cat 
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 border-blue-500/50 shadow-lg shadow-blue-500/25" 
                      : "glass-effect text-white hover:bg-white/30 border-white/30 hover:border-white/50 hover:scale-105"
                  }`}
                >
                  {cat === "all" ? "All Products" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {error && (
            <div className="text-center mb-8">
              <div className="glass-effect rounded-2xl p-8 border border-red-500/20 max-w-md mx-auto">
                <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-300 text-lg font-semibold mb-2">Oops! Something went wrong</p>
                <p className="text-slate-400">{error}</p>
              </div>
            </div>
          )}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="glass-effect rounded-2xl overflow-hidden border border-white/10">
                  <div className="aspect-square skeleton"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 skeleton rounded"></div>
                    <div className="h-4 skeleton rounded w-3/4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 skeleton rounded w-20"></div>
                      <div className="h-10 skeleton rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              {!visibleProducts.length && (
                <div className="col-span-full text-center py-16">
                  <div className="glass-effect rounded-2xl p-12 border border-white/10 max-w-md mx-auto">
                    <Search className="w-16 h-16 text-slate-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-white mb-4">No products found</h3>
                    <p className="text-slate-300 mb-6">Try adjusting your filters or check back later for new arrivals</p>
                    <button 
                      onClick={() => setSelectedCategory("all")}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105"
                    >
                      View All Products
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Load More Button */}
          <div className="text-center mt-16 sm:mt-20 lg:mt-24">
            {canLoadMore ? (
              <button 
                onClick={() => setVisibleCount(c => c + 8)} 
                className="group glass-effect text-white px-8 sm:px-12 py-4 sm:py-5 rounded-2xl font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30 text-base sm:text-lg hover:scale-105 hover:shadow-xl"
              >
                <span className="flex items-center justify-center gap-2">
                  Load More Products
                  <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
                </span>
              </button>
            ) : (
              <div className="glass-effect rounded-2xl p-6 border border-white/10 max-w-sm mx-auto">
                <Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-slate-300 font-medium">You've seen all our products!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
