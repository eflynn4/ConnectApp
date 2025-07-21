import { createContext, ReactNode, useContext, useState } from "react";
import { useProfiles, useSetProfiles } from "./ProfilesContext";


type Profile = {
    id: string;
    name: string;
    bio: string;
    avatar: string;        // profile pic (URI or remote URL)
    media: (string | null)[]; // fixed-length 9-slot array
  };

type ProfileContextType = {
  profile: Profile;
  updateProfile: (profile: Profile) => void;
};

const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const profiles = useProfiles(); // 🔥 get all profiles
  const myProfile = profiles.find(p => p.id === "user123"); // or use auth ID
  const [profile, setProfile] = useState<Profile>({
    id: "user123", // ✅ temporary hardcoded, will connect to auth later
    name: "Ape Geeky",
    bio: "Living free and vibing with strangers.",
    avatar: myProfile?.avatar ?? "",
    media: new Array(9).fill(null),
  });

  const setProfiles = useSetProfiles();

  const updateProfile = (updated: Profile) => {
    setProfile(updated);

    setProfiles(prev =>
      prev.map(p => (p.id === updated.id ? updated : p))
    );
  };


  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within <ProfileProvider>");
  return ctx;
};