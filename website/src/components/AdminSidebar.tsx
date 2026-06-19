'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingBag,
  Calendar,
  ClipboardList,
  BookOpen,
  Ticket,
  Plus,
} from 'lucide-react'
import { clsx } from 'clsx'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: ShoppingBag },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { href: '/admin/bookings', label: 'Bookings', icon: BookOpen },
  { href: '/admin/tickets', label: 'Tickets', icon: Ticket },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-gray-900 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <Link href="/" className="text-white font-bold text-xl">
          Harvzz
        </Link>
        <p className="text-gray-400 text-xs mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-2">
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors px-3 py-2"
        >
          <Plus size={14} /> New Product
        </Link>
        <Link
          href="/admin/events/new"
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors px-3 py-2"
        >
          <Plus size={14} /> New Event
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors px-3 py-2"
        >
          &larr; Back to Site
        </Link>
      </div>
    </aside>
  )
}
