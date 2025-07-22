import { ResizeMode, Video } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { Image, Pressable, StyleSheet, View } from "react-native";

export default function EditProfileMediaGrid({ media, onReplace }: {
  media: string[];
  onReplace: (index: number, uri: string) => void;
}) {
  const pickMedia = async (index: number) => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.8,
    });
    if (!res.canceled && res.assets.length) {
      onReplace(index, res.assets[0].uri);
    }
  };

  const padded = [...media];
  while (padded.length < 9) padded.push("");

  return (
    <View style={styles.grid}>
      {padded.map((uri, idx) => (
        <Pressable key={idx} style={styles.cell} onPress={() => pickMedia(idx)}>
          {uri ? (
            uri.endsWith(".mp4") ? (
              <Video
                source={{ uri }}
                style={styles.media}
                resizeMode={ResizeMode.COVER}
                isMuted
                shouldPlay={false}
              />
            ) : (
              <Image source={{ uri }} style={styles.media} />
            )
          ) : (
            <View style={styles.placeholder} />
          )}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap" },
  cell: { width: "33.33%", aspectRatio: 1, padding: 2 },
  media: { flex: 1, borderRadius: 4 },
  placeholder: { flex: 1, backgroundColor: "#eee", borderRadius: 4 },
});
