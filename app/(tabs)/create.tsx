import * as ImagePicker from "expo-image-picker";
import React, { memo, useCallback, useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { Event, useEvents } from "../../context/EventContext";
import { useProfile } from "../../context/ProfileContext";

// ✅ load once, outside component
const fieldBG1 = Image.resolveAssetSource(require("../../assets/ui/borderedfield1.png"));
const fieldBG2 = Image.resolveAssetSource(require("../../assets/ui/borderedfield2.png"));
const fieldBG3 = Image.resolveAssetSource(require("../../assets/ui/borderedfield3.png"));
const fieldBG4 = Image.resolveAssetSource(require("../../assets/ui/borderedfield4.png"));
const fieldBG5 = Image.resolveAssetSource(require("../../assets/ui/borderedfield5.png"));
const createBG = Image.resolveAssetSource(require("../../assets/ui/CreateBG.png"));
const createBtn = Image.resolveAssetSource(require("../../assets/ui/CreateBtn.png"));
const buttonBG = Image.resolveAssetSource(require("../../assets/ui/buttonBG.png"));

// ✅ memoized bordered field so typing in one input doesn’t re-render all of them
const BorderedField = memo(function BorderedField({
  placeholder,
  value,
  onChangeText,
  backgroundSource,
  height,
  keyboardType = "default",
}: {
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  backgroundSource: any;
  height?: number;
  keyboardType?: "default" | "numeric";
}) {
  return (
    <View style={styles.fieldWrapper}>
      <ImageBackground
        source={backgroundSource}
        style={[styles.fieldBG, height ? { height } : {}]}
        resizeMode="stretch"
      >
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#b5b5b5"
          value={value}
          onChangeText={onChangeText}
          style={[
            styles.textInput,
            { flex: 1, width: "100%", height: "100%", paddingVertical: 18 }
          ]}
          multiline={!!height}
          keyboardType={keyboardType}
        />
      </ImageBackground>
    </View>
  );
});

export default function CreateEventScreen() {
  const { addEvent } = useEvents();
  const { profile } = useProfile();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [capacity, setCapacity] = useState("");
  const [imageUrl, setImageUrl] = useState("");   // keep your URL input (optional)
  const [imageUri, setImageUri] = useState<string | null>(null); // picked photo


  // helper
  const pickFromLibrary = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow photo library access.");
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,       // optional crop UI
      quality: 0.9,              // compress a bit
      exif: false,
    });

    if (!res.canceled) {
      setImageUri(res.assets[0].uri);  // e.g. file:///...
    }
  }, []);

  const handleCreate = useCallback(() => {
    if (!title || !date || !location || !description) {
      Alert.alert("Missing info", "Please fill out every field except image.");
      return;
    }

    const parsedCap = parseInt(capacity);
    const safeCapacity = Math.max(2, isNaN(parsedCap) ? 5 : parsedCap);

    const img = imageUri ?? imageUrl;

    const newEvent: Event = {
      id: Date.now().toString(),
      title,
      description,
      date,
      location,
      image: img,
      capacity: safeCapacity,
      attendees: [profile.id],
      creatorId: profile.id,
    };

    addEvent(newEvent);
    Alert.alert("Event created!", "Check the Feed tab to see it.");
    setTitle(""); setDate(""); setLocation(""); setDesc(""); setImageUrl(""); setImageUri(null); setCapacity("");
  }, [title, date, location, description, imageUrl, imageUri, capacity, addEvent, profile.id]);

  return (
    <ImageBackground source={createBG} style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled" // 👈 important
          >
      
            <BorderedField placeholder="Title" value={title} onChangeText={setTitle} backgroundSource={fieldBG1} />
            <BorderedField placeholder="Date" value={date} onChangeText={setDate} backgroundSource={fieldBG2} />
            <BorderedField placeholder="Capacity" value={capacity} onChangeText={setCapacity} keyboardType="numeric" backgroundSource={fieldBG3} />
            <BorderedField placeholder="Location" value={location} onChangeText={setLocation} backgroundSource={fieldBG4} />
            <BorderedField placeholder="Description" value={description} onChangeText={setDesc} backgroundSource={fieldBG5} height={120} />
            {/* --- OR pick from camera roll --- */}
            <View style={{ alignItems: "center", gap: 10 }}>
              {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    style={{ width: "100%", height: 180, borderRadius: 6, marginVertical: 10 }}
                    resizeMode="cover"
                  />
              ) : null}
              <Pressable onPress={pickFromLibrary} style={styles.btnWrapper} hitSlop={8}>
                <ImageBackground source={createBtn} style={styles.btnBG} resizeMode="stretch">
                  <Text style={styles.btnText}>{imageUri ? "Change Photo" : "Upload Photo"}</Text>
                </ImageBackground>
              </Pressable>
            </View>

            <Pressable onPress={handleCreate} style={styles.btnWrapper}>
              <ImageBackground source={buttonBG} style={styles.createBtnBG} resizeMode="stretch">
                <Text style={styles.createBtnText}>Create Event</Text>
              </ImageBackground>
            </Pressable>
          </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, gap: 16, flexGrow: 1 },
  fieldWrapper: { width: "100%", alignSelf: "center" },
  fieldBG: { paddingHorizontal: 16, minHeight: 60, justifyContent: "center" },
  textInput: {
    fontSize: 16,
    fontFamily: "Roboto_700Bold",
    color: "#FFFDE0",
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1.5,
    paddingLeft: 2,
    textAlignVertical: "top", // 👈 key
  },
  btnWrapper: { alignSelf: "center", marginTop: 0 },
  btnBG: { paddingHorizontal: 25, paddingVertical: 20, justifyContent: "center", alignItems: "center" },
  createBtnBG: { paddingHorizontal: 25, paddingVertical: 20, justifyContent: "center", alignItems: "center", marginTop: 10 },
  btnText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFCD4",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1.5,
  },
  createBtnText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFCD4",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1.5,
  },
});
