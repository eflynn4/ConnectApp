import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useProfile } from "./ProfileContext";
import { useProfiles } from "./ProfilesContext";

export type DirectMessage = {
  id: string;
  convoId: string;          // "dm:userA|userB" (sorted)
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  createdAt: number;
};

type DmAPI = {
  messages: DirectMessage[];
  send: (text: string) => void;
  subscribe: (cb: () => void) => () => void;
};

type Store = {
  getForConvo: (convoId: string) => DmAPI;
  devSendDmAs?: (convoId: string, userId: string, text: string) => boolean; // optional
};

const Ctx = createContext<Store | undefined>(undefined);

// deterministic id for a pair
export const convoIdFor = (a: string, b: string) => {
  const [x, y] = [a, b].sort();
  return `dm:${x}|${y}`;
};

export function DirectChatProvider({ children }: { children: React.ReactNode }) {
  const mapRef = useRef(new Map<string, DirectMessage[]>());           // convoId -> msgs
  const subsRef = useRef(new Map<string, Set<() => void>>());      // convoId -> listeners
  const profiles = useProfiles();

  const getMsgs = (id: string) => mapRef.current.get(id) ?? [];
  const ensure = (id: string) => {
    if (!mapRef.current.has(id)) mapRef.current.set(id, []);
    if (!subsRef.current.has(id)) subsRef.current.set(id, new Set());
  };
  const pushMsg = (id: string, m: DirectMessage) => {
    ensure(id);
    const next = getMsgs(id).slice();
    next.push(m);
    mapRef.current.set(id, next);
    subsRef.current.get(id)?.forEach(fn => fn());
  };

  const getForConvo = (id: string): DmAPI => {
    ensure(id);
    return {
      messages: getMsgs(id),
      send: () => {},
      subscribe: (cb) => {
        ensure(id);
        const s = subsRef.current.get(id)!;
        s.add(cb);
        return () => s.delete(cb);
      },
    };
  };

  const devSendDmAs = (id: string, userId: string, text: string): boolean => {
    const p = profiles.find(pp => pp.id === userId);
    if (!p) return false;
    const t = text.trim();
    if (!t) return false;
    const now = Date.now();
    pushMsg(id, {
      id: `${id}-${now}`,
      convoId: id,
      senderId: p.id,
      senderName: p.name,
      senderAvatar: p.avatar,
      text: t,
      createdAt: now,
    });
    return true;
  };

  useEffect(() => {
    if (__DEV__) {
      (globalThis as any).sendDmAs = devSendDmAs;
      (globalThis as any).convoIdFor = convoIdFor; // <-- add this
  
      // (optional) convenience helper: senderId, recipientId, text
      (globalThis as any).sendDmBetween = (senderId: string, recipientId: string, text: string) =>
        devSendDmAs(convoIdFor(senderId, recipientId), senderId, text);
    }
  }, [profiles]);

  const value = useMemo<Store>(() => ({ getForConvo, devSendDmAs }), []);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDmChat(peerId: string): { messages: DirectMessage[]; send: (text: string) => void; convoId: string } {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDmChat must be used within <DirectChatProvider>");
  const { profile } = useProfile();

  const id = useMemo(() => convoIdFor(profile.id, peerId), [profile.id, peerId]);
  const api = ctx.getForConvo(id);

  const [, force] = useState(0);
  useEffect(() => api.subscribe(() => force(x => x + 1)), [id]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    ctx.devSendDmAs?.(id, profile.id, t); // reuse central push/notify
  };

  return { messages: ctx.getForConvo(id).messages, send, convoId: id };
}
