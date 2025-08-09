import { Roboto_400Regular, Roboto_700Bold, useFonts } from '@expo-google-fonts/roboto';
import { Tabs } from "expo-router/tabs";
import { Image, ImageBackground, Text, View, useWindowDimensions } from 'react-native';

export default function TabsLayout() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });
  const { height: winH } = useWindowDimensions();

  // Tab bar height based on screen height
  const tabBarHeight = Math.round(winH * 0.08); // ~9% of screen height
  const iconSize = Math.round(tabBarHeight * 0.6); // icons are 70% of bar height

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerBackground: () => (
          <ImageBackground
            source={require("../../assets/ui/Tab Header.png")} // your background image
            style={{ flex: 1 }}
            resizeMode="cover"
          />
        ),
        headerTintColor: "#fff", // make title text visible on dark bg
        headerTitleStyle: { fontFamily: "Roboto_700Bold" },
        headerTitleContainerStyle: {
          marginTop: -10, // move the title text up
        },
        headerStyle: {
          height: 85, // make it thinner
        },

        tabBarBackground: () => (
          <ImageBackground
            source={require("../../assets/ui/Tab Header.png")}
            style={{ flex: 1 }}
            resizeMode="cover"
          />
        ),
        tabBarShowLabel: false,
        tabBarLabelStyle: {
          marginTop: -6, // moves "Feed", "Create", etc. upward
        },
        tabBarStyle: {
          height: tabBarHeight,          // raise if your icons are taller
          paddingTop: 6,
          paddingBottom: 10,
        },
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarActiveTintColor: "#FFFDE0",
        tabBarInactiveTintColor: "#ccc",        
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: "Feed",
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/ui/Connect No Back.png")}
              style={{ height: iconSize *1.2, opacity: focused ? 1 : 0.85, marginTop: tabBarHeight * 0.2, }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
        }}
      />
      <Tabs.Screen
        name="myevents"
        options={{
          title: "My Events",
          
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/ui/pfp.png")}
              style={{ height: iconSize, opacity: focused ? 1 : 0.85, marginTop: tabBarHeight * 0.2, }}
              resizeMode="contain"
            />
          ),
        }}
      />

      {/* Hide these from the tab bar/linking */}
      <Tabs.Screen name="users/[id]/index" options={{ href: null }} />
      <Tabs.Screen name="users/[id]/chat" options={{ href: null }} />
      <Tabs.Screen name="event/[id]/index" options={{ href: null }} />
      <Tabs.Screen name="event/[id]/chat" options={{ href: null }} />
      <Tabs.Screen name="profile/requests" options={{ href: null }} />
    </Tabs>
  );
}
