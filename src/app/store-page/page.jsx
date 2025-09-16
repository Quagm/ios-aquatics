"use client"
import NavigationBar from "@/components/navigation-bar"
import Footer from "@/components/footer"
import ProductCard from "@/components/ProductCard"

export default function StorePage() {
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
              <button className="px-8 py-3 bg-[#6c47ff] text-white rounded-full hover:bg-[#5a3ae6] transition-colors font-medium">
                All Products
              </button>
              <button className="px-8 py-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors border border-white/30 font-medium">
                Fish
              </button>
              <button className="px-8 py-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors border border-white/30 font-medium">
                Plants
              </button>
              <button className="px-8 py-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors border border-white/30 font-medium">
                Equipment
              </button>
              <button className="px-8 py-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors border border-white/30 font-medium">
                Food
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-16">
            <button className="bg-white/20 text-white px-12 py-4 rounded-full font-medium hover:bg-white/30 transition-colors border border-white/30 text-lg">
              Load More Products
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
