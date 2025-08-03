import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useFriends } from "../../../context/FriendsContext";

export default function FriendRequestsScreen() {
  const { incoming, directory, acceptFriendRequest, declineFriendRequest } = useFriends();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friend Requests</Text>

      {incoming.length === 0 ? (
        <Text style={styles.empty}>No incoming requests.</Text>
      ) : (
        <FlatList
          data={incoming}
          keyExtractor={(id) => id}
          renderItem={({ item: id }) => {
            const u = directory[id];
            return (
              <View style={styles.card}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{u?.name ?? id}</Text>
                  <Text style={styles.handle}>@{u?.username ?? "unknown"}</Text>
                </View>
                <Pressable
                  onPress={() => acceptFriendRequest(id)}
                  style={[styles.btn, styles.accept]}
                >
                  <Text style={styles.btnTxt}>Accept</Text>
                </Pressable>
                <Pressable
                  onPress={() => declineFriendRequest(id)}
                  style={[styles.btn, styles.decline]}
                >
                  <Text style={styles.btnTxt}>Decline</Text>
                </Pressable>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
  empty: { color: "#666" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10
  },
  name: { fontWeight: "700" },
  handle: { color: "#777", marginTop: 2 },
  btn: { borderRadius: 10, paddingVertical: 6, paddingHorizontal: 10, marginLeft: 8 },
  accept: { backgroundColor: "#4CAF50" },
  decline: { backgroundColor: "#999" },
  btnTxt: { color: "#fff", fontWeight: "600" }
});
