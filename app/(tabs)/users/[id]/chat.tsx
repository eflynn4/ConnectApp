import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { FlatList, Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useDmChat } from "../../../../context/DirectChatContext";
import { useFriends } from "../../../../context/FriendsContext"; // if you want to gate to friends
import { useProfile } from "../../../../context/ProfileContext";
import { useProfiles } from "../../../../context/ProfilesContext";

export default function DirectChatScreen() {
  const { id } = useLocalSearchParams();
  const peerId = Array.isArray(id) ? id[0] : (id ?? "");
  const router = useRouter();

  const { profile } = useProfile();
  const profiles = useProfiles();
  const peer = useMemo(() => profiles.find(p => p.id === peerId) ?? null, [peerId, profiles]);

  const { isFriends } = useFriends();      // or skip if you don't want to gate
  const canChat = peer && peer.id !== profile.id && (isFriends?.(peer.id) ?? true);

  const { messages, send } = useDmChat(peerId);
  const [text, setText] = useState("");
  const listRef = useRef<FlatList>(null);

  if (!peer) return <Text style={{ padding: 16 }}>User not found.</Text>;
  if (!canChat) return <Text style={{ padding: 16 }}>You can only message friends.</Text>;

  const onSend = () => {
    const t = text.trim();
    if (!t) return;
    send(t);
    setText("");
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: "padding", android: undefined })} keyboardVerticalOffset={Platform.select({ ios: 84, android: 0 })}>
      <Stack.Screen options={{ title: peer.name || "Chat" }} />

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 12, gap: 8 }}
        renderItem={({ item }) => (
          <Bubble
            me={item.senderId === profile.id}
            name={item.senderName}
            avatar={item.senderAvatar}
            text={item.text}
            timestamp={item.createdAt}
          />
        )}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Message"
          multiline
        />
        <Pressable onPress={onSend} style={styles.sendBtn}>
          <Text style={{ fontWeight: "700" }}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function Bubble({ me, name, avatar, text, timestamp }:{
  me:boolean; name:string; avatar:string; text:string; timestamp?: number|string;
}) {
  return (
    <View style={[styles.msgContainer, me ? styles.alignRight : styles.alignLeft]}>
      <View style={styles.msgHeader}>
        <Image source={{ uri: avatar }} style={styles.headerAvatar} />
        <Text style={styles.headerName} numberOfLines={1}>{name}</Text>
        {timestamp ? (
          <Text style={styles.headerTime}>
            {typeof timestamp === "number" ? new Date(timestamp).toLocaleTimeString() : timestamp}
          </Text>
        ) : null}
      </View>
      <View style={[styles.bubble, me ? styles.bubbleMe : styles.bubbleOther]}>
        <Text>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: "row",
    padding: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ddd",
    gap: 8,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  sendBtn: { alignSelf: "flex-end", paddingHorizontal: 14, paddingVertical: 10, backgroundColor: "#eee", borderRadius: 8 },

  msgContainer: { marginBottom: 10, maxWidth: "90%" },
  alignLeft: { alignSelf: "flex-start" },
  alignRight: { alignSelf: "flex-end" },

  msgHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4, paddingHorizontal: 2 },
  headerAvatar: { width: 16, height: 16, borderRadius: 8 },
  headerName: { fontSize: 11, color: "#444", maxWidth: 160 },
  headerTime: { fontSize: 10, color: "#888" },

  bubble: { maxWidth: "80%", padding: 10, borderRadius: 12 },
  bubbleOther: { backgroundColor: "#f0f0f0", borderTopLeftRadius: 0 },
  bubbleMe: { backgroundColor: "#DCF8C6", borderTopRightRadius: 0 },
});
