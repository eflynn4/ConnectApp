import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Event } from "../context/EventContext";
type EventCardProps = {
  event: Event;
};

export default function EventCard({ event }: EventCardProps) {
  const { id, title, date, location, image } = event;

  const router = useRouter();

  const handlePress = () => {
    router.push(`/event/${id}` as const);
  };

  return (
    <Pressable onPress={handlePress} style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
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
  image: {
    width: "100%",
    height: 180,
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
