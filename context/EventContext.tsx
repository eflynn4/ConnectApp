import { createContext, ReactNode, useContext, useState } from "react";

/* ---------- Types ---------- */
export type Event = {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    image: string;
    capacity: number;           // NEW
    attendees: string[];        // NEW
  };
  

  type EventContextValue = {
    events: Event[];
    addEvent: (event: Event) => void;
    joinEvent: (userId: string, eventId: string) => void;
    leaveEvent: (userId: string, eventId: string) => void;
  };
  

/* ---------- Initial Seed ---------- */
const initialEvents: Event[] = [
    {
      id: "1",
      title: "Sunset Hike at Blue Ridge",
      description: "Join us for a chill hike to watch the sunset. Bring snacks & layers!",
      date: "July 4",
      location: "Blue Ridge Trail",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      capacity: 5,
      attendees: ["user123"]
    },
    {
      id: "2",
      title: "Bonfire & Jam Night",
      description: "We’ve got guitars, s’mores, and good vibes. Come through!",
      date: "July 5",
      location: "Riley’s Backyard",
      image: "https://images.unsplash.com/photo-1600047504608-3f09f9d1b7d0",
      capacity: 10,
      attendees: []
    }
  ];
  

/* ---------- Context ---------- */
const EventContext = createContext<EventContextValue | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(initialEvents);

  const addEvent = (event: Event) => setEvents(prev => [event, ...prev]);

  const joinEvent = (eventId: string, userId: string) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId && !event.attendees.includes(userId)
          ? { ...event, attendees: [...event.attendees, userId] }
          : event
      )
    );
  };
  
  const leaveEvent = (eventId: string, userId: string) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId
          ? { ...event, attendees: event.attendees.filter(id => id !== userId) }
          : event
      )
    );
  };
  
  

  return (
    <EventContext.Provider value={{ events, addEvent, joinEvent, leaveEvent }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error("useEvents must be used inside <EventProvider>");
  return ctx;
}
