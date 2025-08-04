import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useEventChat } from "../../../../context/EventChatContext";
import { useEvents } from "../../../../context/EventContext";
import { useProfile } from "../../../../context/ProfileContext";

export default function EventChatScreen() {
  const { id } = useLocalSearchParams();
  const eventId = Array.isArray(id) ? id[0] : (id ?? "");
  const router = useRouter();

  const { profile } = useProfile();
  const { getEventById, isMember } = useEvents();

  const event = useMemo(() => getEventById(eventId), [getEventById, eventId]);
  const member = !!(event && isMember(event.id, profile.id));

  const { messages, send } = useEventChat(eventId);
  const [text, setText] = useState("");
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!event) router.replace("/(tabs)/feed");           // event not found → home
  }, [event]);

  useEffect(() => {
    if (event && !member) router.replace(`/event/${eventId}`); // gate to members
  }, [event, member]);

  if (!event || !member) return <Text style={{ padding: 16 }}>Loading…</Text>;

  const onSend = () => {
    const t = text.trim();
    if (!t) return;
    send(t);
    setText("");
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: "padding", android: undefined })} keyboardVerticalOffset={Platform.select({ ios: 84, android: 0 })}>
      <Stack.Screen options={{ title: `${event.title} Chat` }} />
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

function Bubble({ me, name, avatar, text }: { me: boolean; name: string; avatar: string; text: string }) {
  return (
    <View style={[styles.row, me ? styles.right : styles.left]}>
      {!me && <Image source={{ uri: avatar }} style={styles.avatar} />}
      <View style={[styles.bubble, me ? styles.bubbleMe : styles.bubbleOther]}>
        {!me && <Text style={styles.name}>{name}</Text>}
        <Text>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-end" },
  left: { justifyContent: "flex-start" },
  right: { justifyContent: "flex-end" },
  avatar: { width: 28, height: 28, borderRadius: 14, marginRight: 8 },
  bubble: { maxWidth: "80%", padding: 10, borderRadius: 12 },
  bubbleOther: { backgroundColor: "#f0f0f0", borderTopLeftRadius: 0 },
  bubbleMe: { backgroundColor: "#DCF8C6", borderTopRightRadius: 0 },
  name: { fontSize: 12, fontWeight: "600", marginBottom: 2, color: "#333" },
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
  sendBtn: {
    alignSelf: "flex-end",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
});
