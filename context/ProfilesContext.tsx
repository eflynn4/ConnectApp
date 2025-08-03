// context/ProfilesContext.tsx
import { createContext, ReactNode, useContext, useState } from "react";

export type UserProfile = {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatar: string;
  media: string[];
  friends: string[];
};

type ProfilesContextType = {
  profiles: UserProfile[];
  setProfiles: React.Dispatch<React.SetStateAction<UserProfile[]>>;
};


const initialProfiles: UserProfile[] = [
  {
    id: "user123",
    name: "Ape Geeky",
    username: "apegeeky",
    bio: "Living free and vibing with strangers.",
    avatar: "https://media.licdn.com/dms/image/v2/D5603AQF6yqj3RhCgNw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1694802001297?e=1755734400&v=beta&t=8c8Ux2OTeYoHN0TqJr90iJqnD_RFcmJzViCsYZJxSso",
    media: [],
    friends: ["user456"]
  },
  {
    id: "user456",
    username: "alicebewandering",
    name: "Alice Wander",
    bio: "Climber, coder, coffee addict.",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    media: ["https://redrocksdc.com/wp-content/uploads/2024/06/Americano-Cofee.png"],
    friends: ["user123"],
  },
  {
    id: "user789",
    username: "bobpiney",
    name: "Bob Pine",
    bio: "S'mores king. Campfire guitarist.",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    media: ["https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Smores-Microwave.jpg/1200px-Smores-Microwave.jpg", "https://images.stockcake.com/public/a/2/f/a2f4ee03-c5be-4aee-88c6-7c410c6c0217_large/guitarist-by-campfire-stockcake.jpg"],
    friends: [],
  }
];

const ProfilesContext = createContext<ProfilesContextType | undefined>(undefined);

export function ProfilesProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState(initialProfiles);

  return (
    <ProfilesContext.Provider value={{ profiles, setProfiles }}>
      {children}
    </ProfilesContext.Provider>
  );
}

export function useProfiles() {
  const context = useContext(ProfilesContext);
  if (!context) throw new Error("useProfiles must be used inside <ProfilesProvider>");
  return context.profiles;
}

export function useSetProfiles() {
  const context = useContext(ProfilesContext);
  if (!context) throw new Error("useSetProfiles must be used inside <ProfilesProvider>");
  return context.setProfiles;
}
