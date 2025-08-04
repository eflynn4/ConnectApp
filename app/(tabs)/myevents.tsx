import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useEvents } from "../../context/EventContext";
import { useProfile } from "../../context/ProfileContext";

export default function MyEventsScreen() {
  const { events } = useEvents();
  const { profile } = useProfile();
  const router = useRouter();

  const mine = events.filter(e => e.attendees.includes(profile.id));

  return (
    <FlatList
      data={mine}
      keyExtractor={(e) => e.id}
      contentContainerStyle={{ padding: 16, gap: 12 }}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meta}>{item.date} • {item.location}</Text>
          <View style={styles.row}>
            <Pressable onPress={() => router.push(`/event/${item.id}`)} style={styles.btn}>
              <Text style={styles.btnText}>Details</Text>
            </Pressable>
            <Pressable onPress={() => router.push(`/event/${item.id}/chat`)} style={[styles.btn, { marginLeft: 8 }]}>
              <Text style={styles.btnText}>Chat</Text>
            </Pressable>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: { padding: 12, borderRadius: 10, backgroundColor: "#fff", elevation: 1, shadowOpacity: 0.05 },
  title: { fontSize: 16, fontWeight: "700" },
  meta: { color: "#666", marginTop: 4, marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "flex-end" },
  btn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: "#eee", borderRadius: 8 },
  btnText: { fontWeight: "600" },
});
