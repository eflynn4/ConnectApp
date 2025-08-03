// components/FriendButton.tsx
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextStyle, ViewStyle } from "react-native";
import { useFriends } from "../context/FriendsContext";
import { useProfile } from "../context/ProfileContext";

type Props = {
  userId: string;                 // target user
  style?: ViewStyle;              // optional container override
  textStyle?: TextStyle;          // optional label override
  confirm?: boolean;              // show confirms for destructive actions (default: true)
  disabled?: boolean;             // force-disable (rare)
};

export default function FriendButton({
  userId,
  style,
  textStyle,
  confirm = true,
  disabled = false,
}: Props) {
  const { profile } = useProfile();
  const me = profile?.id;

  const {
    isFriends,
    isPendingOutgoing,
    canAcceptFrom,
    sendFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    removeFriend,
  } = useFriends();

  const [loading, setLoading] = useState(false);

  // never render for self
  if (!userId || me === userId) return null;

  const friends = isFriends(userId);
  const pendingOut = isPendingOutgoing(userId);
  const canAccept = canAcceptFrom(userId);

  const baseLabel =
    friends ? "Friends ✓" :
    pendingOut ? "Requested • Cancel" :
    canAccept ? "Accept Friend" :
    "Request Friend";

  const onConfirm = (title: string, message: string, onYes: () => void, yesLabel = "Yes") => {
    if (!confirm) return onYes();
    Alert.alert(title, message, [
      { text: "Cancel", style: "cancel" },
      { text: yesLabel, style: "destructive", onPress: onYes },
    ]);
  };

  const handlePress = async () => {
    if (loading || disabled) return;

    try {
      setLoading(true);

      if (friends) {
        // unfriend flow
        setLoading(false); // let alert feel snappy
        return onConfirm("Unfriend?", "Remove this person from your friends?", async () => {
          setLoading(true);
          await removeFriend(userId);
          setLoading(false);
        }, "Unfriend");
      }

      if (pendingOut) {
        // cancel outgoing request
        setLoading(false);
        return onConfirm("Cancel request?", "Cancel your friend request?", async () => {
          setLoading(true);
          await cancelFriendRequest(userId);
          setLoading(false);
        }, "Cancel request");
      }

      if (canAccept) {
        await acceptFriendRequest(userId);
        return;
      }

      // send new request
      await sendFriendRequest(userId);
    } finally {
      setLoading(false);
    }
  };

  const btnStyle = [
    styles.btn,
    friends ? styles.neutral : styles.primary,
    disabled ? styles.disabled : null,
    style,
  ];

  const labelStyle = [
    styles.txt,
    friends ? styles.neutralTxt : null,
    textStyle,
  ];

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={btnStyle}
      accessibilityRole="button"
      accessibilityLabel={baseLabel}
    >
      {loading ? <ActivityIndicator /> : <Text style={labelStyle}>{baseLabel}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  primary: { backgroundColor: "#4CAF50" },
  neutral: { backgroundColor: "#e5e5e5" },
  disabled: { opacity: 0.6 },
  txt: { color: "#fff", fontWeight: "600" },
  neutralTxt: { color: "#333" },
});
