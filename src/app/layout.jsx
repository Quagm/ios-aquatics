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
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground font-sans`}>
          <CartProvider>
            <main className="">{children}</main>
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
