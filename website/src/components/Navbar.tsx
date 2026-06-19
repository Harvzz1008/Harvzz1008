'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCart, Calendar, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react'
import { useCart } from './CartProvider'
import { logout } from '@/app/actions/auth'

type NavbarProps = {
  session?: {
    userId: string
    email: string
    role: string
    name?: string
  } | null
}

export default function Navbar({ session }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { count } = useCart()

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/events', label: 'Events' },
    { href: '/book', label: 'Book a Table' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-indigo-600">Harvzz</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-4">
            {session?.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="flex items-center gap-1 text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <LayoutDashboard size={18} />
                <span className="text-sm font-medium">Admin</span>
              </Link>
            )}

            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors">
              <ShoppingCart size={22} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>

            {session ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/account"
                  className="flex items-center gap-1 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <User size={18} />
                  <span className="text-sm font-medium">{session.name || session.email}</span>
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors text-sm"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-3">
            <Link href="/cart" className="relative p-2 text-gray-600">
              <ShoppingCart size={22} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-gray-600 hover:text-indigo-600"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white py-4 px-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-gray-700 hover:text-indigo-600 font-medium py-2"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {session?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="block text-gray-700 hover:text-indigo-600 font-medium py-2"
              onClick={() => setMobileOpen(false)}
            >
              Admin Panel
            </Link>
          )}
          <div className="pt-2 border-t border-gray-100">
            {session ? (
              <div className="space-y-2">
                <Link
                  href="/account"
                  className="block text-gray-700 font-medium py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  My Account ({session.name || session.email})
                </Link>
                <form action={logout}>
                  <button type="submit" className="text-red-500 font-medium py-2">
                    Logout
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/auth/login"
                  className="text-gray-700 font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
