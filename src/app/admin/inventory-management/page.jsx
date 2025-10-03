"use client"
import InventoryManagement from '@/components/admin/InventoryManagement'
import AdminProtection from '@/components/admin/AdminProtection'

export default function InventoryManagementPage() {
  return (
    <AdminProtection>
      <InventoryManagement />
    </AdminProtection>
  )
}
