"use client"
import NavigationBar from "@/components/navigation-bar"
import Footer from "@/components/footer"
import ProductImageGallery from "@/components/ProductImageGallery"
import ProductDetails from "@/components/ProductDetails"
import ProductSpecifications from "@/components/ProductSpecifications"
import Breadcrumb from "@/components/Breadcrumb"
import Link from "next/link"
import { ArrowLeft } from 'lucide-react'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { fetchProductById } from '@/lib/queries'

function ProductPageContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    async function load() {
      setLoading(true)
      setError('')
      try {
        if (!id) throw new Error('Missing product id')
        const p = await fetchProductById(id)
        if (!isMounted) return
        setProduct(p)
      } catch (e) {
        if (!isMounted) return
        setError(e.message || 'Failed to load product')
      } finally {
        if (!isMounted) return
        setLoading(false)
      }
    }
    load()
    return () => { isMounted = false }
  }, [id])

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Store", href: "/store-page" },
    { label: product?.category || 'Product', href: "/store-page" },
    { label: product?.name || 'Loading...', isActive: true }
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mt-4 mb-8">
        <Link href="/store-page" className="inline-flex items-center gap-2 px-4 py-2 glass-effect rounded-lg border border-white/20 text-white/90 hover:bg-white/20 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Store</span>
        </Link>
      </div>

      {loading ? (
        <div className="text-white/80">Loading...</div>
      ) : error ? (
        <div className="text-red-300">{error}</div>
      ) : !product ? (
        <div className="text-white/80">Product not found</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <ProductImageGallery product={product} />
          <div className="space-y-10">
            <ProductDetails product={product} />
            {product.specifications && (
              <ProductSpecifications specifications={product.specifications} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#051C29] to-[#0a2a3a] flex flex-col">
      <NavigationBar />
      <div className="flex-1 py-20 px-4">
        <Suspense fallback={<div className="text-white/80 max-w-7xl mx-auto">Loading...</div>}>
          <ProductPageContent />
        </Suspense>
      </div>
      <Footer />
    </div>
  )
}
