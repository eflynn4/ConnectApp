import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEvents } from "../../context/EventContext";
import { useProfile } from "../../context/ProfileContext";

const cardBG = Image.resolveAssetSource(require("../../assets/ui/myeventcardbackground.png"));
const cardFrame = Image.resolveAssetSource(require("../../assets/ui/myeventcardframe.png"));
const pictureFrame = Image.resolveAssetSource(require("../../assets/ui/myeventpictureframe.png"));
const BG = Image.resolveAssetSource(require("../../assets/ui/MyEventsBG.png"));
const detailsBTN = Image.resolveAssetSource(require("../../assets/ui/detailsbtn.png"));
const chatBTN = Image.resolveAssetSource(require("../../assets/ui/chatbtn.png"));
const card = Image.resolveAssetSource(require("../../assets/ui/myeventcard.png"));

const frameRatio = pictureFrame.width / pictureFrame.height;

const CARD_RATIO    = cardFrame.width / cardFrame.height;      
const THUMB_RATIO   = pictureFrame.width / pictureFrame.height; 

export default function MyEventsScreen() {
  const { events } = useEvents();
  const { profile } = useProfile();
  const router = useRouter();

  const mine = events.filter((e) => e.attendees.includes(profile.id));


  const renderItem = ({ item }: any) => (
    <View style={styles.cardWrapper}>
      {/* Outer card box that respects the frame ratio */}
      <View style={styles.cardOuter}>
        <View style={styles.cardAspect}>
          {/* Card content sits inside a padded body */}
          <ImageBackground
            source={card}
            style={styles.cardBody}
            resizeMode="stretch"
          >
            <View style={styles.row}>
              {/* LEFT SIDE: text + buttons */}
              <View style={styles.leftCol}>
                <Text numberOfLines={2} style={styles.title}>{item.title}</Text>
                <Text style={styles.meta}>{item.date} • {item.location}</Text>

                <View style={styles.btnRow}>
                  <Pressable onPress={() => router.push(`/event/${item.id}` as const)} style={styles.btnWrap}>
                    <ImageBackground source={detailsBTN} style={styles.btnBG} resizeMode="stretch">
                      <Text style={styles.btnText}>Details</Text>
                    </ImageBackground>
                  </Pressable>

                  <Pressable onPress={() => router.push(`/event/${item.id}/chat` as const)} style={[styles.btnWrap, { marginLeft: 12 }]}>
                    <ImageBackground source={chatBTN} style={styles.btnBG} resizeMode="stretch">
                      <Text style={styles.btnText}>Chat</Text>
                    </ImageBackground>
                  </Pressable>
                </View>
              </View>

              {/* RIGHT SIDE: thumbnail that respects picture frame ratio */}
              <View style={styles.thumbOuter}>
                <View style={styles.thumbAspect}>
                  <Image source={{ uri: item.image }} style={styles.thumb} resizeMode="cover" />
                  {/* frame overlay (visual only) */}
                  <View pointerEvents="none" style={styles.frameFill}>
                    <Image source={pictureFrame} style={styles.frameImage} resizeMode="stretch" />
                  </View>
                </View>
              </View>
            </View>
          </ImageBackground>

        </View>
      </View>
    </View>
  );

  return (
    <ImageBackground source={BG} style={styles.screen} resizeMode="cover">
      <FlatList
        data={mine}
        keyExtractor={(e) => e.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  listContent: { padding: 12, paddingTop: 15, paddingBottom: 40 },

  // Outer spacing
  cardWrapper: { marginBottom: 24 },

  // Card sizing to match frame
  cardOuter: { width: "100%" },
  cardAspect: {
    aspectRatio: CARD_RATIO,   // <- frame dictates the box
    width: "100%",
    position: "relative",
    justifyContent: "center",
  },
  frameFill: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  frameImage: { width: "100%", height: "100%" },

  // Card body sits inside the frame; tweak padding to tuck content under the inner lip
  cardBody: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 14,
    justifyContent: "center",
  },

  row: { flexDirection: "row", alignItems: "flex-start" },

  // Left column
  leftCol: { flex: 1, paddingRight: 0, alignSelf: "center"},
  title: {
    paddingHorizontal: 10,
    fontSize: 20,
    lineHeight: 28,
    fontFamily: "Roboto_700Bold",
    color: "#FFFDE0",
    textShadowColor: "rgba(0,0,0,0.9)",
    textShadowOffset: { width: 1.5, height: 1.5 },
    textShadowRadius: 2,
  },
  meta: {
    paddingHorizontal: 10,
    marginTop: 6,
    marginBottom: 10,
    fontSize: 14,
    fontFamily: "Roboto_700Bold",
    color: "#FFFDE0",
    textShadowColor: "rgba(0,0,0,0.85)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1.5,
  },

  // Buttons
  btnRow: {
    flexDirection: "row",
    marginTop: 6,
    width: "100%",
    justifyContent: "center", // space them nicely
  },
  
  btnWrap: {
    marginHorizontal: -4,
    alignItems: "center",
    justifyContent: "center",

  },
  btnBG: {
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {

    padding: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: "Roboto_700Bold",
    color: "#FFFDE0",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1.5,
  },

  // Thumbnail sizing to match frame
  thumbOuter: {
    // tune this width so the photo/frame matches your mock
    width: 140,             // ← adjust if your frame art wants a different size
    alignSelf: "center",
    marginRight: 8,
  },
  thumbAspect: {
    aspectRatio: THUMB_RATIO,
    width: "100%",
    position: "relative",
    justifyContent: "center",
    alignItems: "center"
  },
  thumb: { width: "88%", height: "88%" },
});
