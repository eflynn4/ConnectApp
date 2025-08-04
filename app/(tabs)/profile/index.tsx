import * as ImagePicker from "expo-image-picker";
import { Link, useRouter } from "expo-router"; // NEW
import { useMemo, useState } from "react";
import {
  Alert, Button,
  FlatList,
  Image,
  Modal,
  Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from "react-native";
import EditProfileMediaGrid from "../../../components/EditProfileMediaGrid";
import { useFriends } from "../../../context/FriendsContext";
import { useProfile } from "../../../context/ProfileContext";
import { useProfiles } from "../../../context/ProfilesContext"; // NEW
import { normalizeUsername, validateUsername } from "../../../utils/username";

type ProfileRow = { id: string; avatar: string; name: string; username: string }; // NEW

export default function ProfileScreen() {
  const router = useRouter();                                   // NEW
  const { profile, updateProfile } = useProfile();
  const [name, setName] = useState(profile.name);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [media,  setMedia]  = useState<string[]>(profile.media);

  const { friends, incoming } = useFriends();
  const allProfiles = useProfiles();                            // NEW
  const [showFriends, setShowFriends] = useState(false);        // NEW

  const onChangeUsername = (text: string) => {
    setUsername(normalizeUsername(text));
  };

  const validation = useMemo(() => validateUsername(username), [username]);

  // Build friend profile rows safely (no undefined)
  const friendProfiles = useMemo<ProfileRow[]>(() =>           // NEW
    friends
      .map(fid => allProfiles.find(p => p.id === fid))
      .filter((p): p is any => !!p)
      .map(p => ({ id: p.id, avatar: p.avatar, name: p.name, username: p.username })),
    [friends, allProfiles]
  );

  /* ---- pick avatar ---- */
  const pickAvatar = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1,1],
      quality: 0.8,
    });
    if (!res.canceled && res.assets.length) setAvatar(res.assets[0].uri);
  };

  /* ---- replace grid slot ---- */
  const handleReplace = (index: number, uri: string) => {
    const next = [...media];
    next[index] = uri;
    setMedia(next);
  };

  const handleSave = () => {
    if (!validation.ok) {
      Alert.alert("Invalid username",
        validation.error ?? "Your username doesn’t meet the requirements. Please fix it and try again."
      );
      return;
    }
    updateProfile({ id: profile.id, username, name, bio , avatar, media, friends });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* avatar */}
      <Pressable onPress={pickAvatar}>
        {avatar
          ? <Image source={{ uri: avatar }} style={styles.avatar} />
          : <View style={styles.avatarPlaceholder} />}
      </Pressable>

      {/* Top row: Friend Requests + Friends button */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginTop: 12 }}> {/* NEW */}
      <Link href="/profile/requests" asChild>
        <Pressable>
          <Text style={{ marginTop: 12, fontWeight: "600", color: "#4CAF50" }}>
            Friend Requests ({incoming.length})
          </Text>
        </Pressable>
      </Link>
        <View style={{ flex: 0.5 }} />   {/* spacer pushes next item right */}
        <Pressable onPress={() => setShowFriends(true)} style={styles.friendsBtn}> {/* NEW */}
          <Text style={styles.friendsBtnText}>Friends ({friendProfiles.length})</Text>
        </Pressable>
      </View>

      <Text />

      {/* editable fields */}
      <Text>Name</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input}/>
      <Text>Username</Text>
      <TextInput
        value={username}
        onChangeText={onChangeUsername}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {!validation.ok && !!username && (
        <Text style={{ color: "#d00" }}>
          {validation.error ?? "Username is invalid."}
        </Text>
      )}
      <Text>Bio</Text>
      <TextInput
        value={bio} onChangeText={setBio}
        multiline style={[styles.input,{height:80}]}
      />

      {/* 3×3 media grid */}
      <EditProfileMediaGrid media={media} onReplace={handleReplace} />

      <Button title="Save" onPress={handleSave} disabled={!validation.ok}/>

      {/* Friends Modal */}                                          {/* NEW */}
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
              <FlatList<ProfileRow>
                data={friendProfiles}
                keyExtractor={(item) => String(item.id)}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
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
              />
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{ padding:16, gap:12 },
  avatar:{ width:120, height:120, borderRadius:60, alignSelf:"center" },
  avatarPlaceholder:{ width:120, height:120, borderRadius:60, backgroundColor:"#ddd", alignSelf:"center" },
  input:{ borderWidth:1, borderColor:"#ccc", padding:8, borderRadius:6 },

  // NEW — Friends button + modal styles (reused from your other page)
  friendsBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#eee",
    minHeight: 40,
    justifyContent: "center",
  },
  friendsBtnText: { fontWeight: "600" },

  modalBackdrop: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "flex-end",
  },
  modalCard: {
    minHeight: "50%", height: "50%", maxHeight: "85%",
    backgroundColor: "#fff", borderTopLeftRadius: 16, borderTopRightRadius: 16, overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#ddd",
  },
  modalTitle: { fontSize: 18, fontWeight: "700" },
  closeText: { color: "#007AFF", fontWeight: "600" },
  friendRow: { flexDirection: "row", alignItems: "center", padding: 12 },
  friendAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  friendName: { fontSize: 16, fontWeight: "600" },
  friendUsername: { fontSize: 13, color: "#666" },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: "#eee", marginLeft: 64 },
});
