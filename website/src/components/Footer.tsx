import Link from 'next/link'
import { Calendar, ShoppingBag, MapPin, Mail, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <h3 className="text-white font-bold text-xl mb-3">Harvzz</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your go-to destination for quality products, unforgettable events, and great dining experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-colors flex items-center gap-2">
                  <ShoppingBag size={14} /> Shop
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white transition-colors flex items-center gap-2">
                  <Calendar size={14} /> Events
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-white transition-colors flex items-center gap-2">
                  <MapPin size={14} /> Book a Table
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/auth/login" className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  My Orders
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={14} />
                <span>hello@harvzz.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} />
                <span>+44 20 1234 5678</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} />
                <span>London, United Kingdom</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-sm text-gray-500 text-center">
          <p>&copy; {new Date().getFullYear()} Harvzz. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
