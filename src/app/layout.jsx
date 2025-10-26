// src/app/layout.jsx
import "./globals.css"


import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import { CartProvider } from "@/components/CartContext"
import CartAnimationWrapper from "@/components/CartAnimationWrapper"

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})


export const metadata = {
  title: "Web iOS Aquatics",
  description: "Responsive site with Next.js + Tailwind",
}

export default function RootLayout({ children }) {
  return (  
    <ClerkProvider
      appearance={{
        baseTheme: 'dark'
      }}
    >
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground font-sans`}>
          <CartProvider>
            <main className="w-full flex justify-center">
              <div className="page-container w-full">
                {children}
              </div>
            </main>
            <CartAnimationWrapper />
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
