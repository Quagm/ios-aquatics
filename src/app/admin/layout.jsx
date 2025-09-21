"use client"
import AdminProtection from '@/components/admin/AdminProtection'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export default function AdminLayout({ children }) {
  return (
    <AdminProtection>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminProtection>
  )
}
