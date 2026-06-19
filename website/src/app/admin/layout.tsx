import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import AdminSidebar from '@/components/AdminSidebar'

export const metadata = {
  title: 'Admin Panel - Harvzz',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session || session.role !== 'ADMIN') {
    redirect('/auth/login?redirect=/admin')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </div>
    </div>
  )
}
