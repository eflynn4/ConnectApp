import { Tabs } from "expo-router/tabs";
import 'react-native-gesture-handler';
import { EventProvider } from "../context/EventContext";
import { ProfileProvider } from "../context/ProfileContext";


export default function Layout() {
  return (
    <EventProvider>
      <ProfileProvider>
        <Tabs>
          <Tabs.Screen name="feed"    options={{ title: "Feed"    }} />
          <Tabs.Screen name="create"  options={{ title: "Create"  }} />
          <Tabs.Screen name="profile" options={{ title: "Profile" }} />
          <Tabs.Screen name="index"   options={{ href: null }} />
          <Tabs.Screen name="myevents" options={{ title: "My Events" }} />
        </Tabs>
      </ProfileProvider>
    </EventProvider>
  );
}
