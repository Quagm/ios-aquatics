"use client"
import { useState, useEffect } from 'react'
import { Info, X } from 'lucide-react'

export function PasswordRequirements() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const checkForSignUpModal = () => {
      const clerkModal = document.querySelector('[data-clerk-element="card"]')
      const passwordInput = clerkModal?.querySelector('input[type="password"]')
      const signUpForm = clerkModal?.querySelector('form')
      
      if (clerkModal && passwordInput && signUpForm) {
        const emailInput = clerkModal.querySelector('input[type="email"]')
        if (emailInput) {
          setIsVisible(true)
        }
      } else {
        setIsVisible(false)
      }
    }

    checkForSignUpModal()
    const interval = setInterval(checkForSignUpModal, 300)

    const observer = new MutationObserver(checkForSignUpModal)
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => {
      clearInterval(interval)
      observer.disconnect()
    }
  }, [])

  if (!isVisible) return null

  return (
    <div 
      className="fixed bottom-4 right-4 z-[10000] bg-slate-900/95 backdrop-blur-sm border border-emerald-500/30 rounded-xl p-4 shadow-2xl max-w-sm"
      style={{ 
        animation: 'slideUp 0.3s ease-out',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
      }}
    >
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-white font-semibold mb-3 text-sm">Password Requirements</h4>
          <ul className="text-slate-300 text-xs space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">✓</span>
              <span>At least 8 characters long</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">✓</span>
              <span>Contains uppercase letter (A-Z)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">✓</span>
              <span>Contains lowercase letter (a-z)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">✓</span>
              <span>Contains number (0-9)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">✓</span>
              <span>Contains special character (!@#$%^&*)</span>
            </li>
          </ul>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-slate-400 hover:text-white transition-colors p-1 -mt-1 -mr-1"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

