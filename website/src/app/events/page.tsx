import { Calendar } from 'lucide-react'
import EventCard from '@/components/EventCard'

async function getEvents() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/events`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function EventsPage() {
  const events = await getEvents()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900">Upcoming Events</h1>
        <p className="text-gray-500 mt-2">
          Find your next experience — concerts, art shows, comedy nights and more
        </p>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event: {
            id: string
            name: string
            description: string
            date: string
            location: string
            price: number
            image?: string | null
            capacity: number
          }) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-28 text-gray-500">
          <Calendar size={56} className="mx-auto mb-5 text-gray-300" />
          <p className="text-xl font-medium">No upcoming events</p>
          <p className="text-sm mt-2 text-gray-400">
            Check back soon — new events are added regularly.
          </p>
        </div>
      )}
    </div>
  )
}
