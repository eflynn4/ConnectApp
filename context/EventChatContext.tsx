import React, { createContext, useContext, useMemo, useRef, useState } from "react";
import { useProfile } from "./ProfileContext";

export type EventMessage = {
  id: string;
  eventId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  createdAt: number;
};

type ChatAPI = {
  messages: EventMessage[];
  send: (text: string) => void;
};

type ChatStore = {
  getForEvent: (eventId: string) => ChatAPI;
};

const ChatContext = createContext<ChatStore | undefined>(undefined);

export function EventChatProvider({ children }: { children: React.ReactNode }) {
  // eventId -> messages
  const storeRef = useRef(new Map<string, EventMessage[]>());

  const getForEvent = (eventId: string): ChatAPI => {
    if (!storeRef.current.has(eventId)) storeRef.current.set(eventId, []);
    const messagesArr = storeRef.current.get(eventId)!;

    return {
      messages: messagesArr,
      send: (text: string) => {
        const now = Date.now();
        const id = `${eventId}-${now}`;
        // In this scope we can't read the current user, the hook below will.
        // We will wrap this with a hook that injects sender data.
      },
    };
  };

  const value = useMemo<ChatStore>(() => ({ getForEvent }), []);
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useEventChat(eventId: string): ChatAPI {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useEventChat must be used within <EventChatProvider>");

  // Bind sender info here
  const { profile } = useProfile();
  const api = ctx.getForEvent(eventId);

  // Wrap send to include sender fields
  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const now = Date.now();
    const id = `${eventId}-${now}`;

    // mutate the messages array in place to keep references stable for FlatList
    const arr = (ctx as any).getForEvent(eventId).messages as EventMessage[];
    arr.push({
      id,
      eventId,
      senderId: profile.id,
      senderName: profile.name,
      senderAvatar: profile.avatar,
      text: trimmed,
      createdAt: now,
    });
  };

  // The messages array is the same reference; React won't re-render automatically.
  // For a simple solution, mirror it into local state to trigger renders:
  const [_, force] = useState(0);
  const originalSend = send;
  const wrappedApi: ChatAPI = {
    messages: ctx.getForEvent(eventId).messages,
    send: (t) => {
      originalSend(t);
      force(x => x + 1);
    },
  };

  return wrappedApi;
}
