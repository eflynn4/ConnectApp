// context/ProfilesContext.tsx
import { createContext, ReactNode, useContext } from "react";

export type UserProfile = {
  id: string;
  name: string;
  bio: string;
  avatar: string;
};

const mockProfiles: UserProfile[] = [
  {
    id: "user123",
    name: "Ape Geeky",
    bio: "Living free and vibing with strangers.",
    avatar: "https://example.com/avatar1.jpg"
  },
  {
    id: "user456",
    name: "Alice Wander",
    bio: "Climber, coder, coffee addict.",
    avatar: "https://example.com/avatar2.jpg"
  },
  {
    id: "user789",
    name: "Bob Pine",
    bio: "S'mores king. Campfire guitarist.",
    avatar: "https://example.com/avatar3.jpg"
  }
];

const ProfilesContext = createContext<{ profiles: UserProfile[] } | undefined>(undefined);

export function ProfilesProvider({ children }: { children: ReactNode }) {
  return (
    <ProfilesContext.Provider value={{ profiles: mockProfiles }}>
      {children}
    </ProfilesContext.Provider>
  );
}

export function useProfiles() {
  const context = useContext(ProfilesContext);
  if (!context) throw new Error("useProfiles must be used inside ProfilesProvider");
  return context.profiles;
}
