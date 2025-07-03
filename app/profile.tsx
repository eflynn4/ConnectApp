import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Button, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import MediaGrid from "../components/MediaGrid";
import { useProfile } from "../context/ProfileContext";

export default function ProfileScreen() {
  const { profile, updateProfile } = useProfile();
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [media,  setMedia]  = useState<(string|null)[]>(profile.media);

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
    updateProfile({ id: profile.id, name, bio , avatar, media });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* avatar */}
      <Pressable onPress={pickAvatar}>
        {avatar
          ? <Image source={{ uri: avatar }} style={styles.avatar} />
          : <View style={styles.avatarPlaceholder} />}
      </Pressable>

      {/* editable fields */}
      <Text>Name</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input}/>
      <Text>Bio</Text>
      <TextInput
        value={bio} onChangeText={setBio}
        multiline style={[styles.input,{height:80}]}
      />

      {/* 3×3 media grid */}
      <MediaGrid media={media} onReplace={handleReplace} />

      <Button title="Save" onPress={handleSave}/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container:{ padding:16, gap:12 },
    avatar:{ width:120, height:120, borderRadius:60, alignSelf:"center" },
    avatarPlaceholder:{ width:120, height:120, borderRadius:60, backgroundColor:"#ddd", alignSelf:"center" },
    input:{ borderWidth:1, borderColor:"#ccc", padding:8, borderRadius:6 },
});
