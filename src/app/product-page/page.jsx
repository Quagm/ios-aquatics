"use client"
import NavigationBar from "@/components/navigation-bar"
import Footer from "@/components/Footer"
import ProductImageGallery from "@/components/ProductImageGallery"
import ProductDetails from "@/components/ProductDetails"
import ProductSpecifications from "@/components/ProductSpecifications"
import Link from "next/link"
import { ArrowLeft } from 'lucide-react'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { fetchProductById } from '@/lib/queries'
import { supabase } from '@/supabaseClient'

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

  useEffect(() => {
    if (!id) return
    const channel = supabase
      .channel(`product_${id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'products',
        filter: `id=eq.${id}`,
      }, (payload) => {
        const next = payload?.new || payload?.record
        if (next) {
          setProduct(prev => ({ ...(prev || {}), ...next }))
        }
      })
      .subscribe()

    return () => {
      try { supabase.removeChannel(channel) } catch {}
    }
  }, [id])

  

  return (
    <div className="max-w-7xl mx-auto">

      <div className="mt-4 mb-8">
        <Link href="/store-page" className="inline-flex items-center gap-2 px-4 py-2 glass-effect rounded-lg border border-white/20 text-white/90 hover:bg-white/20 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Store</span>
        </Link>
        <div className="h-8 sm:h-12 lg:h-16 w-full"></div>
      </div>

      {loading ? (
        <div className="text-white/80">Loading...</div>
      ) : error ? (
        <div className="text-red-300">{error}</div>
      ) : !product ? (
        <div className="text-white/80">Product not found</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-12 lg:gap-16 xl:gap-20">
          <div className="w-full flex justify-center">
            <ProductImageGallery product={product} />
          </div>
          <div className="space-y-10 w-full max-w-xl justify-self-start">
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
