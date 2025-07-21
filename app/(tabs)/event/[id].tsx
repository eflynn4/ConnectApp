import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useEvents } from "../../../context/EventContext";
import { useProfile } from "../../../context/ProfileContext";
import { useProfiles } from "../../../context/ProfilesContext";

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const { events, joinEvent, leaveEvent } = useEvents();

  const { profile } = useProfile();
  const userId = profile.id;
  const router = useRouter();

  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <View style={styles.center}>
        <Text>Event not found.</Text>
      </View>
    );
  }

  const profiles = useProfiles();
  
  const isJoined = event.attendees.includes(userId);

  const isAlreadyJoined = event.attendees.includes(userId);

  console.log("Attendees for event:", event.attendees);
  console.log("Profiles loaded:", profiles.map(p => p.id));


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

      <Text style={styles.subheader}>Attendees:</Text>

      {event.attendees.map(uid => {
        const user = profiles.find(p => p.id === uid);
        if (!user) {
          console.warn(`Missing profile for uid: ${uid}`);
          return <Text key={uid}>[Unknown User]</Text>;
        }
        return (
          <Pressable
            key={uid}
            onPress={() => router.push(`/users/${uid}`)}
            style={styles.attendeeRow}
          >
            <Image source={{ uri: user.avatar }} style={styles.avatarThumb} />
            <Text
              key={uid}
              style={styles.link}
              onPress={() => router.push(`/users/${uid}`)}
            >
              • {user.name}
            </Text>
          </Pressable>
        );
      })}

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
  subheader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
  },
  link: {
    fontSize: 16,
    color: "#007AFF",
    marginBottom: 4,
  },
  attendeeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatarThumb: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  nameText: {
    fontSize: 16,
  }
  
});
