"use client"
import NavigationBar from "@/components/navigation-bar"
import Footer from "@/components/footer"
import ProductCard from "@/components/ProductCard"
import { useEffect, useMemo, useState } from "react"
import { fetchProducts } from "@/lib/queries"

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
    <div className="min-h-screen bg-gradient-to-b from-[#051C29] to-[#0a2a3a] flex flex-col">
      {/* Navigation */}
      <NavigationBar />
      
      {/* Main Content */}
      <div className="flex-1 py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
              Our Store
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Discover our wide selection of freshwater fish, plants, equipment, and accessories at the best prices.
            </p>
          </div>

          {/* Filter Section */}
          <div className="mb-8 sm:mb-12 lg:mb-16">
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setVisibleCount(8) }}
                  className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 font-medium border text-sm sm:text-base ${selectedCategory === cat 
                    ? "bg-[#6c47ff] text-white hover:bg-[#5a3ae6] border-[#6c47ff] shadow-lg" 
                    : "bg-white/20 text-white hover:bg-white/30 border-white/30 hover:border-white/50"
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
              <p className="text-red-300 text-lg">{error}</p>
            </div>
          )}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-white/80 text-lg">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              {!visibleProducts.length && (
                <div className="col-span-full text-center py-12">
                  <p className="text-white/70 text-lg">No products found.</p>
                </div>
              )}
            </div>
          )}

          {/* Load More Button */}
          <div className="text-center mt-12 sm:mt-16 lg:mt-20">
            {canLoadMore ? (
              <button 
                onClick={() => setVisibleCount(c => c + 8)} 
                className="bg-white/20 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-full font-medium hover:bg-white/30 transition-all duration-300 border border-white/30 text-base sm:text-lg hover:scale-105 hover:shadow-xl"
              >
                Load More Products
              </button>
            ) : (
              <p className="text-white/70 text-lg">No more products to load</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
