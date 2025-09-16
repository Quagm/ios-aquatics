"use client"
import NavigationBar from "@/components/navigation-bar"
import Footer from "@/components/footer"
import ProductCard from "@/components/ProductCard"
import { useMemo, useState } from "react"

export default function StorePage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [visibleCount, setVisibleCount] = useState(8)

  const products = [
    {
      id: 1,
      name: "Tropical Fish - Neon Tetra",
      price: 25.00,
      image: "/logo-aquatics.jpg",
      category: "Fish"
    },
    {
      id: 2,
      name: "Aquarium Filter",
      price: 45.00,
      image: "/logo-aquatics.jpg",
      category: "Equipment"
    },
    {
      id: 3,
      name: "Aquatic Plants Bundle",
      price: 35.00,
      image: "/logo-aquatics.jpg",
      category: "Plants"
    },
    {
      id: 4,
      name: "Fish Food - Premium",
      price: 15.00,
      image: "/logo-aquatics.jpg",
      category: "Food"
    },
    {
      id: 5,
      name: "Aquarium Heater",
      price: 30.00,
      image: "/logo-aquatics.jpg",
      category: "Equipment"
    },
    {
      id: 6,
      name: "Guppy Fish - Assorted",
      price: 20.00,
      image: "/logo-aquatics.jpg",
      category: "Fish"
    }
  ]

  const categories = ["all", "Fish", "Plants", "Equipment", "Food"]

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
      <div className="flex-1 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">Our Store</h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Discover our wide selection of freshwater fish, plants, equipment, and accessories at the best prices.
            </p>
          </div>

          {/* Filter Section */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setVisibleCount(8) }}
                  className={`px-8 py-3 rounded-full transition-colors font-medium border border-white/30 ${selectedCategory === cat ? "bg-[#6c47ff] text-white hover:bg-[#5a3ae6]" : "bg-white/20 text-white hover:bg-white/30"}`}
                >
                  {cat === "all" ? "All Products" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-16">
            {canLoadMore ? (
              <button onClick={() => setVisibleCount(c => c + 8)} className="bg-white/20 text-white px-12 py-4 rounded-full font-medium hover:bg-white/30 transition-colors border border-white/30 text-lg">
                Load More Products
              </button>
            ) : (
              <p className="text-white/70">No more products to load</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
