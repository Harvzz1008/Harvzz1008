import Link from 'next/link'
import Image from 'next/image'
import { db } from '@/lib/db'
import { Plus, Calendar, MapPin } from 'lucide-react'

export default async function AdminEventsPage() {
  const events = await db.event.findMany({
    orderBy: { date: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-500 mt-1">{events.length} events total</p>
        </div>
        <Link
          href="/admin/events/new"
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors font-medium"
        >
          <Plus size={18} />
          Add Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-xl font-medium text-gray-700">No events yet</p>
          <Link href="/admin/events/new" className="mt-4 inline-block text-indigo-600 hover:underline">
            Add your first event
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="relative h-36 bg-gray-100">
                <Image
                  src={event.image || 'https://placehold.co/800x300/4F46E5/fff?text=Event'}
                  alt={event.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute top-3 right-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${event.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {event.active ? 'Active' : 'Hidden'}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-gray-900">{event.name}</h3>
                  <span className="font-bold text-indigo-600 shrink-0">
                    £{event.price.toFixed(2)}
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={13} className="text-indigo-400" />
                    {new Date(event.date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={13} className="text-indigo-400" />
                    {event.location}
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/events/${event.id}`}
                    className="text-sm text-indigo-600 hover:underline font-medium"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
