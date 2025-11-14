
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
        baseTheme: 'dark',
        elements: {
          formButtonPrimary: 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800',
          card: 'bg-slate-900 border border-white/20',
          headerTitle: 'text-white',
          headerSubtitle: 'text-slate-300',
          socialButtonsBlockButton: 'bg-white/10 hover:bg-white/20 border border-white/20 text-white',
          formFieldInput: 'bg-white/10 border-white/20 text-white',
          formFieldLabel: 'text-slate-300',
          footerActionLink: 'text-emerald-400 hover:text-emerald-300',
          identityPreviewText: 'text-white',
          identityPreviewEditButton: 'text-emerald-400',
          formFieldSuccessText: 'text-green-400',
          formFieldErrorText: 'text-red-400',
          formResendCodeLink: 'text-emerald-400',
          otpCodeFieldInput: 'bg-white/10 border-white/20 text-white',
          formFieldInputShowPasswordButton: 'text-slate-400 hover:text-white',
          alertText: 'text-slate-300',
          alertTextDanger: 'text-red-400',
        },
        variables: {
          colorPrimary: '#10b981',
          colorText: '#ffffff',
          colorTextSecondary: '#cbd5e1',
          colorBackground: '#0f172a',
          colorInputBackground: 'rgba(255, 255, 255, 0.1)',
          colorInputText: '#ffffff',
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
