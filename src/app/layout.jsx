
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
import { PasswordRequirements } from "@/components/PasswordRequirements"

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
        baseTheme: 'light',
        elements: {
          formButtonPrimary: 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800',
          card: 'bg-white border border-gray-200 shadow-lg',
          headerTitle: 'text-gray-900',
          headerSubtitle: 'text-gray-600',
          socialButtonsBlockButton: 'bg-white hover:bg-gray-50 border border-gray-300 text-gray-700',
          formFieldInput: 'bg-white border-gray-300 text-gray-900',
          formFieldLabel: 'text-gray-700',
          footerActionLink: 'text-emerald-600 hover:text-emerald-700',
          identityPreviewText: 'text-gray-900',
          identityPreviewEditButton: 'text-emerald-600',
          formFieldSuccessText: 'text-green-600',
          formFieldErrorText: 'text-red-600',
          formResendCodeLink: 'text-emerald-600',
          otpCodeFieldInput: 'bg-white border-gray-300 text-gray-900',
          formFieldInputShowPasswordButton: 'text-gray-500 hover:text-gray-700',
          alertText: 'text-gray-700',
          alertTextDanger: 'text-red-600',
        },
        variables: {
          colorPrimary: '#10b981',
          colorText: '#111827',
          colorTextSecondary: '#4b5563',
          colorBackground: '#ffffff',
          colorInputBackground: '#ffffff',
          colorInputText: '#111827',
          borderRadius: '0.75rem',
        }
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
            <PasswordRequirements />
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
