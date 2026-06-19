'use client'

import { useState } from 'react'
import { Utensils, CheckCircle, Clock, Users, Calendar } from 'lucide-react'

export default function BookPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    partySize: '2',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          partySize: parseInt(form.partySize),
        }),
      })

      if (res.ok) {
        setSuccess(true)
        setForm({
          name: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          partySize: '2',
          notes: '',
        })
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to create booking. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const timeSlots = [
    '12:00', '12:30', '13:00', '13:30',
    '14:00', '18:00', '18:30', '19:00',
    '19:30', '20:00', '20:30', '21:00',
  ]

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Booking Confirmed!</h1>
        <p className="text-gray-500 text-lg mb-8">
          Thank you for your booking. We&apos;ll send a confirmation to your email shortly.
          We look forward to seeing you!
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-indigo-700 transition-colors"
        >
          Make Another Booking
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Left: Info */}
        <div className="lg:col-span-2">
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-5">
            <Utensils size={28} className="text-amber-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book a Table</h1>
          <p className="text-gray-500 leading-relaxed mb-8">
            Reserve your table for a special occasion, family gathering, or a casual dinner.
            We&apos;ll do our best to accommodate your preferences.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                <Clock size={18} className="text-indigo-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Opening Hours</p>
                <p className="text-sm text-gray-500">Lunch: 12pm–3pm | Dinner: 6pm–10pm</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                <Users size={18} className="text-indigo-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Group Size</p>
                <p className="text-sm text-gray-500">We can accommodate up to 20 guests</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                <Calendar size={18} className="text-indigo-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Advance Booking</p>
                <p className="text-sm text-gray-500">Book up to 30 days in advance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="John Smith"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="+44 7700 900000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Time *
                  </label>
                  <select
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 bg-white"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Party Size *
                  </label>
                  <select
                    name="partySize"
                    value={form.partySize}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 bg-white"
                  >
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'guest' : 'guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Special Requests <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Dietary requirements, special occasions, seating preferences..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white py-4 rounded-xl font-bold hover:bg-amber-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-lg"
              >
                <Utensils size={20} />
                {loading ? 'Confirming booking...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
