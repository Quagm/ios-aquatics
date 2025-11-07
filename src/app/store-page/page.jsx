"use client"
import NavigationBar from "@/components/navigation-bar"
import Footer from "@/components/Footer"
import ProductCard from "@/components/ProductCard"
import { useEffect, useMemo, useState } from "react"
import { fetchProducts } from "@/lib/queries"
import { supabase } from "@/supabaseClient"
import { ShoppingCart, AlertTriangle, Search, Sparkles, ArrowDown, Fish, Leaf, Wrench, Utensils, Pill, Palette } from 'lucide-react'

export default function StorePage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [visibleCount, setVisibleCount] = useState(8)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [query, setQuery] = useState("")

  const [currentServiceSlide, setCurrentServiceSlide] = useState(0)
  const serviceSlides = [
    "/services-slides/planted-aquarium.png",
    "/services-slides/koi-ponds.png",
    "/services-slides/large-scale-projects.png",
    "/services-slides/monster-tanks.png",
    "/services-slides/moss-wall-design.png",
    "/services-slides/paludarium-system.png",
    "/services-slides/terrarium-enclosures.png"
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

  const categories = [
    "all",
    "AQUARIUMS",
    "C02",
    "SUBSTRATE/HARDSCAPE",
    "FERTILIZER/BACTERIA",
    "AIR PUMP",
    "LIGHTS",
    "FILTER",
    "HEATER",
    "SUBMERSIBLE PUMP"
  ]

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

  useEffect(() => {
    const channel = supabase
      .channel('store-products-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
        if (payload.eventType === 'DELETE') {
          setProducts(prev => prev.filter((p) => p.id !== payload.old.id))
        } else {
          fetchProducts({ category: selectedCategory })
            .then((data) => {
              setProducts(data)
              setVisibleCount(8)
            })
        }
      })
      .subscribe()
    return () => {
      try { supabase.removeChannel(channel) } catch {}
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 w-full flex flex-col">
      <NavigationBar />
      
      <div className="flex-1 w-full flex flex-col items-center pb-16 sm:pb-20 lg:pb-24 pt-28 sm:pt-32">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center mb-20 sm:mb-24 bg-white/5 rounded-3xl border border-white/10" style={{padding: '60px 40px'}}>
            <div className="inline-flex items-center gap-2 bg-blue-500/10 backdrop-blur-sm rounded-full text-sm font-medium text-blue-300 border border-blue-500/20" style={{padding: '16px 32px', marginBottom: '48px'}}>
              <ShoppingCart className="w-4 h-4" />
              Our Store
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight" style={{marginBottom: '48px'}}>
              <span className="gradient-text">IOS Aquatics</span>  Store
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed" style={{marginBottom: '48px'}}>
              Discover our wide selection of freshwater fish, plants, equipment, and accessories at the best prices
            </p>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-20 sm:mb-24" />

          <div className="flex justify-center mb-20 sm:mb-24">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/10 h-[360px] sm:h-[400px] w-full max-w-5xl">
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
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-20 sm:mb-24" />

          <div className="flex flex-col items-center justify-center mb-20 sm:mb-24 bg-white/5 rounded-2xl border border-white/10 px-6 sm:px-8 py-8">
            <div className="w-full max-w-2xl mb-10">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-12 pr-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm text-base"
                  style={{padding: '16px', fontSize: '16px'}}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-3 w-full">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setVisibleCount(8) }}
                  className={`rounded-full transition-all duration-300 font-semibold border text-sm sm:text-base ${selectedCategory === cat 
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 border-blue-500/50 shadow-lg shadow-blue-500/25" 
                      : "glass-effect text-white hover:bg-white/30 border-white/30 hover:border-white/50 hover:scale-105"
                  }`}
                  style={{padding: '8px 16px', fontSize: '13px', minWidth: '100px'}}
                >
                  {cat === "all" ? "All Products" : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-20 sm:mb-24" />

          <div className="flex flex-col items-center mb-20 sm:mb-24">
          {error && (
              <div className="text-center mb-12">
              <div className="glass-effect rounded-2xl p-8 border border-red-500/20 max-w-md mx-auto">
                <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-300 text-lg font-semibold mb-2">Oops! Something went wrong</p>
                <p className="text-slate-400">{error}</p>
              </div>
            </div>
          )}
          {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-7xl">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-7xl">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              {!visibleProducts.length && (
                  <div className="col-span-full text-center py-20">
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
          </div>

          <div className="flex justify-center items-center mt-20 sm:mt-24">
            {canLoadMore ? (
              <button 
                onClick={() => setVisibleCount(c => c + 8)} 
                className="group glass-effect text-white rounded-2xl font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30 text-base sm:text-lg hover:scale-105 hover:shadow-xl"
                style={{padding: '20px 40px'}}
              >
                <span className="flex items-center justify-center gap-2">
                  Load More Products
                  <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
                </span>
              </button>
            ) : (
              <div className="glass-effect rounded-2xl p-10 sm:p-12 lg:p-16 border border-white/10 max-w-sm mx-auto">
                <div className="flex flex-col items-center space-y-6">
                  <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
                  <p className="text-slate-300 font-medium text-center text-base sm:text-lg leading-relaxed px-4 py-2">
                    You've seen all our products!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
