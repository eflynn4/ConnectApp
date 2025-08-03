import { Slot } from "expo-router";
import 'react-native-gesture-handler';
import { EventProvider } from "../context/EventContext";
import { FriendsProvider } from "../context/FriendsContext";
import { ProfileProvider } from "../context/ProfileContext";
import { ProfilesProvider } from "../context/ProfilesContext";

export default function RootLayout() {
  return (
    <EventProvider>
      <ProfilesProvider>
        <ProfileProvider>
          <FriendsProvider>
            <Slot />
          </FriendsProvider>
        </ProfileProvider>
      </ProfilesProvider>
    </EventProvider>
  );
}


console.log("Global layout mounted");