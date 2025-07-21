import { Slot } from "expo-router";
import 'react-native-gesture-handler';
import { EventProvider } from "../context/EventContext";
import { ProfileProvider } from "../context/ProfileContext";
import { ProfilesProvider } from "../context/ProfilesContext";

export default function RootLayout() {
  return (
    <EventProvider>
      <ProfilesProvider>
        <ProfileProvider>
          <Slot />
        </ProfileProvider>
      </ProfilesProvider>
    </EventProvider>
  );
}


console.log("Global layout mounted");