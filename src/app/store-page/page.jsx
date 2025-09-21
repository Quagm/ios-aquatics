"use client"
import NavigationBar from "@/components/navigation-bar"
import Footer from "@/components/footer"
import ProductCard from "@/components/ProductCard"
import { useEffect, useMemo, useState } from "react"
import { fetchProducts } from "@/lib/queries"
import { ShoppingCart, AlertTriangle, Search, Sparkles, ArrowDown } from 'lucide-react'

export default function StorePage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [visibleCount, setVisibleCount] = useState(8)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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
    if (selectedCategory === "all") return products
    return products.filter(p => p.category === selectedCategory)
  }, [products, selectedCategory])

  const visibleProducts = filteredProducts.slice(0, visibleCount)

  const canLoadMore = visibleCount < filteredProducts.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Navigation */}
      <NavigationBar />
      
      {/* Main Content */}
      <div className="flex-1 py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16 sm:mb-20 lg:mb-24">
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

          {/* Filter Section */}
          <div className="mb-12 sm:mb-16 lg:mb-20">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
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
