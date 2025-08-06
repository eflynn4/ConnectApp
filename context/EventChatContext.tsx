import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useProfile } from "./ProfileContext";
import { useProfiles } from "./ProfilesContext";
  
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
    subscribe: (cb: () => void) => () => void; // notify UI when messages change
};

type ChatStore = {
    getForEvent: (eventId: string) => ChatAPI;
    // DEV only helper to inject a message as any user
    devSendAs?: (eventId: string, userId: string, text: string) => boolean;
};

const ChatContext = createContext<ChatStore | undefined>(undefined);

export function EventChatProvider({ children }: { children: React.ReactNode }) {
    // eventId -> messages
    const storeRef = useRef(new Map<string, EventMessage[]>());
    // eventId -> listeners
    const listenersRef = useRef(new Map<string, Set<() => void>>());
    const profiles = useProfiles();

    const getMsgs = (eventId: string) => storeRef.current.get(eventId) ?? [];
    const setMsgs = (eventId: string, arr: EventMessage[]) => {
        storeRef.current.set(eventId, arr);
    };
    const ensureEvent = (eventId: string) => {
        if (!storeRef.current.has(eventId)) storeRef.current.set(eventId, []);
        if (!listenersRef.current.has(eventId)) listenersRef.current.set(eventId, new Set());
    };
    const notify = (eventId: string) => {
        const ls = listenersRef.current.get(eventId);
        ls?.forEach((fn) => fn());
    };

    const addMessage = (eventId: string, msg: EventMessage) => {
        ensureEvent(eventId);
        const arr = getMsgs(eventId).slice();
        arr.push(msg);
        setMsgs(eventId, arr);
        notify(eventId);
    };

    const getForEvent = (eventId: string): ChatAPI => {
        ensureEvent(eventId);
        return {
        messages: getMsgs(eventId),
        // This "send" is a placeholder; the hook will inject sender info.
        send: (_text: string) => {},
        subscribe: (cb: () => void) => {
            ensureEvent(eventId);
            const set = listenersRef.current.get(eventId)!;
            set.add(cb);
            return () => set.delete(cb);
        },
        };
    };

    // DEV helper exposed to console
    const devSendAs = (eventId: string, userId: string, text: string): boolean => {
        const p = profiles.find((pp) => pp.id === userId);
        if (!p) return false;
        const t = text.trim();
        if (!t) return false;
        const now = Date.now();
        addMessage(eventId, {
        id: `${eventId}-${now}`,
        eventId,
        senderId: p.id,
        senderName: p.name,
        senderAvatar: p.avatar,
        text: t,
        createdAt: now,
        });
        return true;
    };

    // Attach global console command in DEV builds:
    useEffect(() => {
        if (__DEV__) {
        (globalThis as any).sendAs = devSendAs;
        // Example in console:
        // sendAs("1", "user456", "Hello from Alice")
        }
    }, [profiles]);

    const value = useMemo<ChatStore>(() => ({ getForEvent, devSendAs }), []);
    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useEventChat(eventId: string): { messages: EventMessage[]; send: (text: string) => void } {
    const ctx = useContext(ChatContext);
    if (!ctx) throw new Error("useEventChat must be used within <EventChatProvider>");
    const api = ctx.getForEvent(eventId);
    const { profile } = useProfile();

    // Re-render when provider notifies changes
    const [, force] = useState(0);
    useEffect(() => api.subscribe(() => force((x) => x + 1)), [eventId]);

    const send = (text: string) => {
        const t = text.trim();
        if (!t) return;
        // Reuse devSendAs to centralize add+notify logic
        ctx.devSendAs?.(eventId, profile.id, t);
    };

    // Always read latest messages from store on each render
    return { messages: ctx.getForEvent(eventId).messages, send };
}

export default EventChatProvider;