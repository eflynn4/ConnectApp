import * as ImagePicker from "expo-image-picker";
import { Link } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Button, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import EditProfileMediaGrid from "../../../components/EditProfileMediaGrid";
import { useFriends } from "../../../context/FriendsContext";
import { useProfile } from "../../../context/ProfileContext";
import { normalizeUsername, validateUsername } from "../../../utils/username";


export default function ProfileScreen() {
  const { profile, updateProfile } = useProfile();
  const [name, setName] = useState(profile.name);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [media,  setMedia]  = useState<string[]>(profile.media);

  const { friends, incoming } = useFriends();

  const onChangeUsername = (text: string) => {
    setUsername(normalizeUsername(text));
  };

  const validation = useMemo(() => validateUsername(username), [username]);

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
      // Show why it failed (adjust based on your validateUsername return shape)
      Alert.alert(
        "Invalid username",
        validation.error ??
          "Your username doesn’t meet the requirements. Please fix it and try again."
      );
      return; // ⬅️ don’t apply changes
    }
    updateProfile({ id: profile.id, username, name, bio , avatar, media, friends});
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* avatar */}
      <Pressable onPress={pickAvatar}>
        {avatar
          ? <Image source={{ uri: avatar }} style={styles.avatar} />
          : <View style={styles.avatarPlaceholder} />}
      </Pressable>

      <Link href="/profile/requests" style={{ marginTop: 12, fontWeight: "600", color: "#4CAF50" }}>
        Friend Requests ({incoming.length})
      </Link>
      <Text></Text>

      {/* editable fields */}
      <Text>Name</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input}/>
      <Text>Username</Text>
      <TextInput
        value={username}
        onChangeText={onChangeUsername}   // ⬅️ use normalizer
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {/* Optional inline hint (keeps popup behavior for Save) */}
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

      <Button title="Save" onPress={handleSave}  disabled={!validation.ok}/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container:{ padding:16, gap:12 },
    avatar:{ width:120, height:120, borderRadius:60, alignSelf:"center" },
    avatarPlaceholder:{ width:120, height:120, borderRadius:60, backgroundColor:"#ddd", alignSelf:"center" },
    input:{ borderWidth:1, borderColor:"#ccc", padding:8, borderRadius:6 },
});
