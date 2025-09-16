"use client"
import NavigationBar from "@/components/navigation-bar"
import Footer from "@/components/footer"
import ProductCard from "@/components/ProductCard"
import ProductImageGallery from "@/components/ProductImageGallery"
import ProductDetails from "@/components/ProductDetails"
import ProductSpecifications from "@/components/ProductSpecifications"
import Breadcrumb from "@/components/Breadcrumb"

export default function ProductPage() {
  const product = {
    id: 1,
    name: "Tropical Fish - Neon Tetra",
    price: 25.00,
    originalPrice: 30.00,
    image: "/logo-aquatics.jpg",
    category: "Fish",
    description: "Beautiful and vibrant neon tetras that add color and life to your aquarium. These peaceful fish are perfect for community tanks and are easy to care for.",
    features: [
      "Peaceful temperament",
      "Easy to care for",
      "Great for beginners",
      "Community tank friendly",
      "Vibrant colors"
    ],
    specifications: {
      "Size": "1-1.5 inches",
      "Lifespan": "5-8 years",
      "Water Temperature": "70-81°F",
      "pH Level": "6.0-7.0",
      "Diet": "Omnivore"
    },
    inStock: true,
    stockCount: 15
  }

  const relatedProducts = [
    {
      id: 2,
      name: "Guppy Fish - Assorted",
      price: 20.00,
      image: "/logo-aquatics.jpg",
      category: "Fish"
    },
    {
      id: 3,
      name: "Cardinal Tetra",
      price: 28.00,
      image: "/logo-aquatics.jpg",
      category: "Fish"
    },
    {
      id: 4,
      name: "Glowlight Tetra",
      price: 22.00,
      image: "/logo-aquatics.jpg",
      category: "Fish"
    }
  ]

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Store", href: "/store-page" },
    { label: "Fish", href: "/store-page" },
    { label: product.name, isActive: true }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#051C29] to-[#0a2a3a] flex flex-col">
      {/* Navigation */}
      <NavigationBar />
      
      {/* Main Content */}
      <div className="flex-1 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Product Image */}
            <ProductImageGallery product={product} />

            {/* Product Details */}
            <div className="space-y-8">
              <ProductDetails product={product} />
              <ProductSpecifications specifications={product.specifications} />
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
