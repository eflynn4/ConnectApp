import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import FriendButton from "../../../../components/FriendButton";
import { useEvents } from "../../../../context/EventContext";
import { useProfile } from "../../../../context/ProfileContext";
import { useProfiles } from "../../../../context/ProfilesContext";

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();

  const { events, joinEvent, leaveEvent } = useEvents();

  const { profile } = useProfile();
  const userId = profile.id;
  const router = useRouter();

  const { isMember } = useEvents();

  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <View style={styles.center}>
        <Text>Event not found.</Text>
      </View>
    );
  }

  const profiles = useProfiles();

  const host = profiles.find(p => p.id === event.creatorId);
  
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
      {host && (
        <View style={styles.hostContainer}>
          <Pressable
            onPress={() => router.push(`/users/${host.id}`)}
            style={styles.hostRow}
          >
            <Image source={{ uri: host.avatar }} style={styles.avatarThumb} />
            <Text style={styles.hostName}>{host.name}</Text>
          </Pressable>

          {/* Only show FriendButton if I'm not the host */}
          {host.id !== userId && <FriendButton userId={host.id} />}
        </View>
      )}
      <Text style={styles.date}>{event.date}</Text>
      <Text style={styles.location}>📍 {event.location}</Text>
      <Text style={styles.description}>{event.description}</Text>

      <Text style={styles.attendance}>
        {event.attendees.length} / {event.capacity} attending
      </Text>

      {isMember(event.id, userId) && (
        <Pressable
          onPress={() => router.push(`/event/${event.id}/chat`)}
          style={{ alignSelf: "flex-end", paddingVertical: 10, paddingHorizontal: 14, backgroundColor: "#eee", borderRadius: 8, marginTop: 8 }}
        >
          <Text style={{ fontWeight: "600" }}>Open Chat</Text>
        </Pressable>
      )}

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
              style={styles.link}
              onPress={() => router.push(`/users/${uid}`)}
            >
              • {user.name} {uid === event.creatorId ? "[HOST]" : ""}
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
  },
  hostContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  hostRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  hostName: {
    fontSize: 18,
    fontWeight: "600",
  },
  
  
});
