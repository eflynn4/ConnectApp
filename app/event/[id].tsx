import { useLocalSearchParams } from "expo-router";
import { Button, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useEvents } from "../../context/EventContext";

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const { events, joinEvent, leaveEvent } = useEvents();

  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <View style={styles.center}>
        <Text>Event not found.</Text>
      </View>
    );
  }

  const userId = "user123"; // mock user
  const isJoined = event.attendees.includes(userId);

  const isAlreadyJoined = event.attendees.includes(userId);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {event.image && (
        <Image source={{ uri: event.image }} style={styles.image} />
      )}
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.date}>{event.date}</Text>
      <Text style={styles.location}>📍 {event.location}</Text>
      <Text style={styles.description}>{event.description}</Text>

      <Text style={styles.attendance}>
        {event.attendees.length} / {event.capacity} attending
      </Text>

      <Button
      title={isJoined ? "Leave Event" : "Join"}
      onPress={() => {
      if (isJoined) {
        leaveEvent(event.id, userId);
      } else {
        joinEvent(event.id, userId);
      }
  }}
  color={isJoined ? "#f44336" : "#4CAF50"} // red for leave, green for join
/>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: "#888",
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 12,
  },
  attendance: {
    fontSize: 16,
    marginBottom: 12,
    color: "#444",
  },
});
