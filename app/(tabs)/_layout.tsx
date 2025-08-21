import TabIcon from '@/components/TabIcon';
import { Roboto_400Regular, Roboto_700Bold, useFonts } from '@expo-google-fonts/roboto';
import { Tabs } from "expo-router/tabs";
import { ImageBackground, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

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
      initialRouteName="feed"
      screenOptions={{
        headerBackground: () => (
          <ImageBackground
            source={require("../../assets/ui/Tab Header.png")} // your background image
            style={{ flex: 1 }}
            resizeMode="cover"
          />
        ),
        headerTintColor: "#fff", // make title text visible on dark bg
        headerTitleStyle: { fontFamily: "Roboto_700Bold", color: "#FFFDE0", textShadowColor: "rgba(0,0,0,0.9)", textShadowOffset: { width: 3, height: 3 }, textShadowRadius: 2, },
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
          height: tabBarHeight,
          paddingTop: Math.round(tabBarHeight * 0.1),
          paddingBottom: Math.round(tabBarHeight * 0.1),
          borderTopWidth: 0,       // <-- removes the line
          elevation: 0,            // Android shadow
          shadowOpacity: 0,        // iOS shadow
          backgroundColor: "transparent", // so background image shows clean
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
            <TabIcon
              source={require("../../assets/ui/Connect No Back.png")}
              focused={focused}
              height={iconSize * 1.2}
              marginTop={tabBarHeight * 0.2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create Event",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              source={require("../../assets/ui/ThinPlus.png")}
              focused={focused}
              height={iconSize * 1.2}
              marginTop={tabBarHeight * 0.2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="myevents"
        options={{
          title: "My Events",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              source={require("../../assets/ui/Event Icon.png")}
              focused={focused}
              height={iconSize * 1.2}
              marginTop={tabBarHeight * 0.2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              source={require("../../assets/ui/pfp.png")}
              focused={focused}
              height={iconSize * 1.2}
              marginTop={tabBarHeight * 0.2}
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

const styles = StyleSheet.create({
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFDE0",
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 2,
    marginBottom: 4,
    alignSelf: "center"
  },
});