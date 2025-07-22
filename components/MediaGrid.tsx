import { ResizeMode, Video } from "expo-av"; // optional
import { Image, StyleSheet, View } from "react-native";


export default function MediaGrid({ media }: { media: string[] }) {
  return (
    <View style={styles.grid}>
      {media.map((uri, i) => (
        <View key={i} style={styles.cell}>
          {uri ? (
            uri.endsWith(".mp4") ? (
              <Video source={{ uri }} style={styles.media} resizeMode={ResizeMode.COVER} />
            ) : (
              <Image source={{ uri }} style={styles.media} />
            )
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>
      ))}
    </View>
  );
}


const styles = StyleSheet.create({
  grid:       { flexDirection: "row", flexWrap: "wrap" },
  cell:       { width: "33.33%", aspectRatio: 1, padding: 2 },
  media:      { flex: 1, borderRadius: 4 },
  placeholder:{ flex:1, backgroundColor:"#eee", borderRadius:4 },
});
