import { Slot } from "expo-router";
import 'react-native-gesture-handler';
import { EventProvider } from "../context/EventContext";
import { ProfileProvider } from "../context/ProfileContext";
import { ProfilesProvider } from "../context/ProfilesContext";

export default function RootLayout() {
  return (
    <EventProvider>
      <ProfileProvider>
        <ProfilesProvider>
          <Slot />
        </ProfilesProvider>
      </ProfileProvider>
    </EventProvider>
  );
}


console.log("Global layout mounted");