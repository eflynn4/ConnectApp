import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet, Text, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FriendButton from "../../../components/FriendButton";
import MediaGrid from "../../../components/MediaGrid";
import { useFriends } from "../../../context/FriendsContext";
import { useProfiles } from "../../../context/ProfilesContext";

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const targetId = Array.isArray(id) ? id[0] : id ?? ""; // ✅ ensure a string
  const router = useRouter();
  const profiles = useProfiles();

  const profile = useMemo(
    () => profiles.find(p => p.id === targetId) ?? null,
    [profiles, targetId]
  );
  const [showFriends, setShowFriends] = useState(false);

  const { isFriends, isPendingOutgoing, canAcceptFrom, getFriendsOf } = useFriends();

  // ✅ bail out before using `profile`

  const friendIds = useMemo(
    () => (profile ? getFriendsOf(profile.id) : []),
    [profile?.id, getFriendsOf] // include getFriendsOf in deps
  );

  // Decide what to render only after hooks have run
  const isLoaded = profiles.length > 0; // or use a loading flag from context if you have one
  if (!isLoaded) return <Text>Loading…</Text>;
  if (!profile)  return <Text>User not found.</Text>;

  type Profile = {
    id: string;
    bio: string;
    media: string[];
    friends: string[];
    avatar: string;
    name: string;
    username: string;
  };

  const friendProfiles = useMemo(
    () =>
      friendIds
        .map(fid => profiles.find(p => p.id === fid))
        //       ^ may be undefined
        .filter((p): p is Profile => !!p), // <-- narrows to Profile[]
    [friendIds, profiles]
  );

  if (!profile) {
    return <Text>Loading…</Text>;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: profile.username,
          }}
        />

        <Text style={styles.back} onPress={() => router.back()}>← Back</Text>

        <Image source={{ uri: profile.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.bio}>{profile.bio}</Text>

        {/* Friends + FriendButton row */}
        <View style={styles.headerActions}>
          <Pressable onPress={() => setShowFriends(true)} style={styles.friendsBtn}>
            <Text style={styles.friendsBtnText}>Friends</Text>
          </Pressable>

          <FriendButton
            userId={profile.id}
            style={styles.friendBtnInline}      // spacing/height align with Friends btn
            textStyle={styles.headerFriendTxt}
          />
        </View>

        <MediaGrid media={profile.media} />

        {/* Friends Modal */}
        <Modal
          visible={showFriends}
          transparent
          animationType="slide"
          onRequestClose={() => setShowFriends(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={{ alignItems: "center", paddingTop: 8 }}>
                <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: "#ddd" }} />
              </View>

              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Friends</Text>
                <Pressable onPress={() => setShowFriends(false)}>
                  <Text style={styles.closeText}>Close</Text>
                </Pressable>
              </View>

              {friendProfiles.length === 0 ? (
                <Text style={{ padding: 12 }}>No friends yet.</Text>
              ) : (
                <FlatList<Profile>
                  data={friendProfiles}
                  keyExtractor={(item) => String(item.id)}
                  renderItem={({ item }) => (
                    <Pressable
                      style={styles.friendRow}
                      onPress={() => {
                        setShowFriends(false);
                        router.push(`/users/${item.id}`);
                      }}
                    >
                      <Image source={{ uri: item.avatar }} style={styles.friendAvatar} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.friendName}>{item.name}</Text>
                        <Text style={styles.friendUsername}>@{item.username}</Text>
                      </View>
                    </Pressable>
                  )}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  name: { fontSize: 24, fontWeight: "bold", marginTop: 16 },
  bio: { marginTop: 8, fontSize: 16 },
  back: { color: "#007AFF", fontSize: 16, marginBottom: 12 },
  safe: { flex: 1, paddingHorizontal: 0, backgroundColor: "#fff" },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  headerBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#eee",
    marginRight: 8,
  },
  headerBtnText: { fontWeight: "600" },

  friendsBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#eee",
    minHeight: 40,
    justifyContent: "center",
    marginRight: 12,
  },
  friendsBtnText: { fontWeight: "600" },

  // Align FriendButton visually with Friends button
  friendBtnInline: {
    marginTop: 0,             // remove FriendButton's default top margin
    minHeight: 40,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: "center",
  },
  headerFriendTxt: {
    fontSize: 14,
    fontWeight: "600",
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalCard: {
    minHeight: "50%",
    height: "50%",
    maxHeight: "85%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
  },
  modalTitle: { fontSize: 18, fontWeight: "700" },
  closeText: { color: "#007AFF", fontWeight: "600" },

  friendRow: { flexDirection: "row", alignItems: "center", padding: 12 },
  friendAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  friendName: { fontSize: 16, fontWeight: "600" },
  friendUsername: { fontSize: 13, color: "#666" },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: "#eee", marginLeft: 64 },
});
