import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MediaGrid from "../../../components/MediaGrid";
import { useProfiles } from "../../../context/ProfilesContext";

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter(); // ✅ add this
  const profiles = useProfiles();
  const profile = profiles.find(p => p.id === id);

  if (!profile) return <Text>User not found.</Text>;

  return (
    <SafeAreaView style={styles.safe}>
    <View style={styles.container}>
      <Stack.Screen options={{ title: "User Profile" }} />
      <Text style={styles.back} onPress={() => router.back()}>← Back</Text>
      <Image source={{ uri: profile.avatar }} style={styles.avatar} />
      <Text style={styles.name}>{profile.name}</Text>
      <Text style={styles.bio}>{profile.bio}</Text>
      {profile.media && <MediaGrid media={profile.media} />}
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  name: { fontSize: 24, fontWeight: "bold", marginTop: 16 },
  bio: { marginTop: 8, fontSize: 16 },
  back: {
    color: "#007AFF",
    fontSize: 16,
    marginBottom: 12,
  },
  safe: {
    flex: 1,
    paddingHorizontal: 0,
    backgroundColor: "#fff",
  },
});
