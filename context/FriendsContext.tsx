import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { useProfile } from "./ProfileContext";
import { useProfiles } from "./ProfilesContext";

/** Minimal user directory for demo lookups */
export type User = { id: string; username: string; name: string; avatar?: string };

type FriendsState = {
  friends: Set<string>;          // confirmed friends (ids) for *me*
  incoming: Set<string>;         // people who asked to be my friend
  outgoing: Set<string>;         // requests I sent (pending)
};

type FriendsContextType = {
  directory: Record<string, User>;
  friends: string[];
  incoming: string[];
  outgoing: string[];
  isFriends: (userId: string) => boolean;
  isPendingOutgoing: (userId: string) => boolean;
  canAcceptFrom: (userId: string) => boolean;
  sendFriendRequest: (targetId: string) => void;
  cancelFriendRequest: (targetId: string) => void;
  acceptFriendRequest: (fromId: string) => void;
  declineFriendRequest: (fromId: string) => void;
  removeFriend: (userId: string) => void;
  unfriend?: (userId: string) => void;           // alias for convenience
  getFriendsOf: (userId: string) => string[];
  dumpMyFriends?: () => string[];
};

const FriendsContext = createContext<FriendsContextType | null>(null);

export function FriendsProvider({ children }: { children: ReactNode }) {
  const { profile } = useProfile();
  const me = profile.id;

  const profiles = useProfiles();

  // Map userId -> friends[] from ProfilesContext (if your profiles carry this)
  const friendMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const p of profiles) {
      map[p.id] = Array.isArray((p as any).friends) ? (p as any).friends : [];
    }
    return map;
  }, [profiles]);

  // Seed my confirmed friends from ProfilesContext (optional but helpful)
  const initialMyFriends = useMemo(
    () => new Set<string>(friendMap[me] ?? []),
    [friendMap, me]
  );

  // Demo directory (add whoever you want to be “discoverable”).
  const directory = useMemo<Record<string, User>>(
    () => ({
      [me]: { id: me, username: profile.username, name: profile.name, avatar: profile.avatar },
      "u-001": { id: "u-001", username: "riley", name: "Riley Hart" },
      "u-002": { id: "u-002", username: "skaterjoe", name: "Joe Kim" },
      "u-003": { id: "u-003", username: "sarah", name: "Sarah P." },
    }),
    [me, profile.username, profile.name, profile.avatar]
  );

  const [state, setState] = useState<FriendsState>({
    friends: initialMyFriends,
    incoming: new Set<string>(["u-001"]), // demo seed
    outgoing: new Set<string>([]),
  });

  /** -------- Bidirectional graph: userId -> Set(friendIds) -------- */
  const [friendsByUser, setFriendsByUser] = useState<Record<string, Set<string>>>(() => {
    // Seed *all* users from friendMap so lists are symmetric on load
    const base: Record<string, Set<string>> = {};
    for (const uid of Object.keys(friendMap)) {
      base[uid] = new Set(friendMap[uid] ?? []);
    }
    // Ensure "me" has at least my local confirmed set
    base[me] = new Set(initialMyFriends);
    return base;
  });

  // Keep my row in the graph synced with state.friends
  useEffect(() => {
    setFriendsByUser(prev => {
      const next = { ...prev };
      next[me] = new Set(state.friends);
      return next;
    });
  }, [me, state.friends]);

  // If profiles/friendMap changes (e.g., hot data), refresh non-me rows (avoid clobbering my local state)
  useEffect(() => {
    setFriendsByUser(prev => {
      const next: Record<string, Set<string>> = { ...prev };
      for (const uid of Object.keys(friendMap)) {
        if (uid === me) continue; // my row is controlled by state.friends
        next[uid] = new Set(friendMap[uid] ?? []);
      }
      if (!next[me]) next[me] = new Set(state.friends);
      return next;
    });
  }, [friendMap, me]); // state.friends sync is handled by the effect above

  const api: FriendsContextType = {
    directory,
    friends: Array.from(state.friends),
    incoming: Array.from(state.incoming),
    outgoing: Array.from(state.outgoing),

    // ✅ Use the live graph (my row) as the source of truth
    isFriends: (id) => !!friendsByUser[me]?.has(id),

    isPendingOutgoing: (id) => state.outgoing.has(id),

    canAcceptFrom: (id) => state.incoming.has(id),

    // ✅ Read lists from the graph so UI updates immediately on accept/unfriend
    getFriendsOf: (userId: string) => Array.from(friendsByUser[userId] ?? new Set()),

    // Debug
    dumpMyFriends: () => Array.from(state.friends),

    sendFriendRequest: (targetId) => {
      if (!targetId || targetId === me) return;
      if (state.friends.has(targetId) || state.outgoing.has(targetId)) return;
      setState(s => ({ ...s, outgoing: new Set([...s.outgoing, targetId]) }));
      // (No graph change yet; only on accept do we add edges)
    },

    cancelFriendRequest: (targetId) => {
      if (!state.outgoing.has(targetId)) return;
      const next = new Set(state.outgoing);
      next.delete(targetId);
      setState(s => ({ ...s, outgoing: next }));
    },

    acceptFriendRequest: (fromId) => {
      if (!state.incoming.has(fromId)) return;

      const nextIncoming = new Set(state.incoming);
      nextIncoming.delete(fromId);

      const nextFriends = new Set(state.friends);
      nextFriends.add(fromId);

      setState(s => ({ ...s, incoming: nextIncoming, friends: nextFriends }));

      // ⬇️ update both directions in the graph
      setFriendsByUser(prev => {
        const next = { ...prev };
        (next[me] ??= new Set()).add(fromId);
        (next[fromId] ??= new Set()).add(me);
        return next;
      });
    },

    removeFriend: (userId) => {
      if (!state.friends.has(userId)) return;

      const next = new Set(state.friends);
      next.delete(userId);
      setState(s => ({ ...s, friends: next }));

      // ⬇️ remove both directions in the graph
      setFriendsByUser(prev => {
        const nextMap = { ...prev };
        nextMap[me]?.delete(userId);
        nextMap[userId]?.delete(me);
        return nextMap;
      });
    },

    // Optional alias if your UI calls `unfriend`
    unfriend: (userId) => {
      api.removeFriend(userId);
    },

    declineFriendRequest: (fromId) => {
      if (!state.incoming.has(fromId)) return;
      const nextIncoming = new Set(state.incoming);
      nextIncoming.delete(fromId);
      setState(s => ({ ...s, incoming: nextIncoming }));
    },
  };

  return <FriendsContext.Provider value={api}>{children}</FriendsContext.Provider>;
}

export function useFriends() {
  const ctx = useContext(FriendsContext);
  if (!ctx) throw new Error("useFriends must be used inside <FriendsProvider>");
  return ctx;
}
