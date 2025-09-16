"use client"
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminProtection({ children }) {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/')
      return
    }

    // Optional: Add role-based access control here
    // For now, any authenticated user can access admin
    // You can add role checking logic here if needed
    // if (user && !user.publicMetadata?.isAdmin) {
    //   router.push('/')
    // }
  }, [isLoaded, user, router])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
