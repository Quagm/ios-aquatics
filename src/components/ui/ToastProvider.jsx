"use client"

import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'

const ToastContext = createContext(null)

let idSeq = 1

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const push = useCallback((toast) => {
    const id = idSeq++
    const t = { id, title: '', description: '', variant: 'default', duration: 3000, ...toast }
    setToasts(prev => [...prev, t])
    if (t.duration !== 0) {
      setTimeout(() => remove(id), t.duration)
    }
    return id
  }, [remove])

  const value = useMemo(() => ({ push, remove }), [push, remove])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={remove} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

function ToastContainer({ toasts, onClose }) {
  return (
    <div className="fixed top-4 right-4 z-[1000] space-y-3">
      {toasts.map(t => (
        <Toast key={t.id} toast={t} onClose={() => onClose(t.id)} />
      ))}
    </div>
  )
}

function Toast({ toast, onClose }) {
  const color = toast.variant === 'success' ? 'from-green-500 to-green-600'
    : toast.variant === 'error' ? 'from-red-500 to-red-600'
    : toast.variant === 'warning' ? 'from-yellow-500 to-yellow-600'
    : 'from-blue-500 to-blue-600'

  return (
    <div className="glass-effect rounded-xl border border-white/10 shadow-lg min-w-[280px] max-w-[380px]">
      <div className={`px-4 py-3 bg-gradient-to-r ${color} rounded-t-xl text-white font-medium`}>{toast.title}</div>
      <div className="px-4 py-3 text-slate-100 flex items-start justify-between gap-4">
        <div className="text-sm opacity-90">{toast.description}</div>
        <button onClick={onClose} className="text-slate-200/80 hover:text-white">×</button>
      </div>
    </div>
  )
}
