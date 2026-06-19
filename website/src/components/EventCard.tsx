import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, Ticket } from 'lucide-react'

type Event = {
  id: string
  name: string
  description: string
  date: string | Date
  location: string
  price: number
  image?: string | null
  capacity: number
}

export default function EventCard({ event }: { event: Event }) {
  const date = new Date(event.date)
  const formattedDate = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const formattedTime = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
      <Link href={`/events/${event.id}`}>
        <div className="relative h-52 bg-gray-100 overflow-hidden">
          <Image
            src={event.image || 'https://placehold.co/800x400/4F46E5/fff?text=Event'}
            alt={event.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
          <div className="absolute top-3 right-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            £{event.price.toFixed(2)}
          </div>
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/events/${event.id}`}>
          <h3 className="text-gray-900 font-semibold text-lg hover:text-indigo-600 transition-colors line-clamp-1">
            {event.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{event.description}</p>
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={14} className="text-indigo-500 shrink-0" />
            <span>{formattedDate} at {formattedTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={14} className="text-indigo-500 shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
        <Link
          href={`/events/${event.id}`}
          className="mt-4 flex items-center justify-center gap-2 w-full bg-indigo-600 text-white py-2.5 rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          <Ticket size={16} />
          Get Tickets
        </Link>
      </div>
    </div>
  )
}
