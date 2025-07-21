import { FlatList, StyleSheet, Text, View } from "react-native";
import EventCard from "../../components/EventCard";
import { useEvents } from "../../context/EventContext";

export default function MyEventsScreen() {
  const { events } = useEvents();
  const userId = "user123"; // mock user
  const myEvents = events.filter(e => e.attendees.includes(userId));

  if (!myEvents.length) {
    return (
      <View style={styles.center}>
        <Text>No upcoming events yet.</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={myEvents}
      keyExtractor={e => e.id}
      renderItem={({ item }) => <EventCard event={item} />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
