import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Event } from "../context/EventContext";
import { useProfiles } from "../context/ProfilesContext";

type EventCardProps = {
  event: Event;
};

export default function EventCard({ event }: EventCardProps) {
  const { id, title, date, location, image, creatorId } = event;

  const router = useRouter();

  const profiles = useProfiles(); // ⬅️ get profiles
  const host = profiles.find(p => p.id === creatorId);

  const handlePress = () => {
    router.push(`/event/${id}` as const);
  };

  return (
    <Pressable onPress={handlePress} style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
      {host && (
          <Pressable
            style={styles.avatarHit}
            onPress={() => router.push(`/users/${host.id}`)}
            accessibilityLabel={`Open ${host.name}'s profile`}
          >
            <Image source={{ uri: host.avatar }} style={styles.hostAvatar} />
          </Pressable>
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.meta}>{date} • {location}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
  },
  imageWrap: {
    position: "relative",        // ⬅️ enables absolute children
    width: "100%",
    height: 180,
  },
  image: {
    width: "100%",
    height: 180,
  },
  hostAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#eee",
  },
  avatarHit: {
    position: "absolute",
    right: 8,
    bottom: 8,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  meta: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});
