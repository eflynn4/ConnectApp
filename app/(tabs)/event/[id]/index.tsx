import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Image, ImageBackground, LayoutChangeEvent, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useEvents } from "../../../../context/EventContext";
import { useProfile } from "../../../../context/ProfileContext";
import { useProfiles } from "../../../../context/ProfilesContext";

// Reuse border assets
const thumbnailTop = Image.resolveAssetSource(require("../../../../assets/ui/img-top-border.png"));
const thumnbailBot = Image.resolveAssetSource(require("../../../../assets/ui/img-bot-border.png"));
const thumbnailLeft = Image.resolveAssetSource(require("../../../../assets/ui/img-left-border.png"));
const thumbnailRight = Image.resolveAssetSource(require("../../../../assets/ui/img-right-border.png"));

const buttonTop = Image.resolveAssetSource(require("../../../../assets/ui/button-top-border.png"));
const buttonBot = Image.resolveAssetSource(require("../../../../assets/ui/button-bot-border.png"));
const buttonLeft = Image.resolveAssetSource(require("../../../../assets/ui/button-left-border.png"));
const buttonRight = Image.resolveAssetSource(require("../../../../assets/ui/button-right-border.png"));
const buttonBG = Image.resolveAssetSource(require("../../../../assets/ui/button-bg.png"));

// NEW PNGS FOR REDOING UI:

const detailsBG = Image.resolveAssetSource(require("../../../../assets/ui/DetailsBG.png"));
const detailsChatBtn = Image.resolveAssetSource(require("../../../../assets/ui/DetailsChatBtn.png"));
const detailsJoinBG = Image.resolveAssetSource(require("../../../../assets/ui/DetailsJoinBG.png"));
const detailsPictureFrame = Image.resolveAssetSource(require("../../../../assets/ui/DetailsPictureFrame.png"));



function getScaledHeight(asset: { width: number; height: number }, renderWidth: number) {
  const aspectRatio = asset.height / asset.width;
  return renderWidth * aspectRatio;
}
function getScaledWidth(asset: { width: number; height: number }, renderHeight: number) {
  const aspectRatio = asset.width / asset.height;
  return renderHeight * aspectRatio;
}

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const { events, joinEvent, leaveEvent, isMember } = useEvents();
  const { profile } = useProfile();
  const profiles = useProfiles();
  const router = useRouter();

  const userId = profile.id;
  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <View style={styles.center}>
        <Text>Event not found.</Text>
      </View>
    );
  }

  const host = profiles.find(p => p.id === event.creatorId);
  const isJoined = event.attendees.includes(userId);

  // JOIN button layout
  const [btnSize, setBtnSize] = useState({ width: 0, height: 0 });
  const handleBtnLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setBtnSize({ width, height });
  };

  const topButtonBorderHeight = getScaledHeight(buttonTop, btnSize.width);
  const bottomButtonBorderHeight = getScaledHeight(buttonBot, btnSize.width);
  const sideButtonBorderHeight = btnSize.height + topButtonBorderHeight / 2 + bottomButtonBorderHeight / 2;
  const sideButtonBorderWidth = getScaledWidth(buttonLeft, sideButtonBorderHeight);

  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const handleImageLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setImageSize({ width, height });
  };

  const topImageBorderHeight = getScaledHeight(thumbnailTop, imageSize.width);
  const bottomImageBorderHeight = getScaledHeight(thumnbailBot, imageSize.width);
  const sideImageBorderHeight = imageSize.height + topImageBorderHeight / 2 + bottomImageBorderHeight / 2;

  const STROKE_RADIUS = 2;
  const strokeOffsets = Array.from({ length: STROKE_RADIUS * 2 + 1 }, (_, i) => i - STROKE_RADIUS);
  const SHADOW_OFFSET = STROKE_RADIUS;

  const buttonText = isJoined ? "JOINED" : "JOIN";

  return (
    <ImageBackground source={require("../../../../assets/ui/bg.png")} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Main image with borders */}
        {event.image && (
          <View onLayout={handleImageLayout} style={styles.imageWrapper}>
            <Image source={{ uri: event.image }} style={styles.image} />
            
            {/* Top Border */}
            <Image
              source={thumbnailTop}
              style={{
                position: "absolute",
                top: -thumbnailTop.height / 2,
                width: imageSize.width,
              }}
              resizeMode="contain"
            />
            {/* Bottom Border */}
            <Image
              source={thumnbailBot}
              style={{
                position: "absolute",
                bottom: -thumnbailBot.height / 2,
                width: imageSize.width,
              }}
              resizeMode="contain"
            />
            {/* Left Border */}
            <Image
              source={thumbnailLeft}
              style={{
                position: "absolute",
                left: -(thumbnailLeft.width / 2),
                height: sideImageBorderHeight,
                top: -topImageBorderHeight / 2,
              }}
              resizeMode="contain"
            />
            {/* Right Border */}
            <Image
              source={thumbnailRight}
              style={{
                position: "absolute",
                right: -(thumbnailRight.width / 2),
                height: sideImageBorderHeight,
                top: -topImageBorderHeight / 2,
              }}
              resizeMode="contain"
            />
          </View>
        )}

        {/* Title */}
        <View style={styles.titleStack}>
          <Text
            style={[
              styles.title,
              { position: "absolute", left: SHADOW_OFFSET, top: SHADOW_OFFSET, color: "rgba(0,0,0,0.7)" }
            ]}
          >
            {event.title}
          </Text>
          {strokeOffsets.flatMap((dx) =>
            strokeOffsets.map((dy) => {
              if (dx === 0 && dy === 0) return null;
              return (
                <Text
                  key={`${dx}-${dy}`}
                  style={[
                    styles.title,
                    { position: "absolute", left: dx, top: dy, color: "rgba(0,0,0,0.05)" }
                  ]}
                >
                  {event.title}
                </Text>
              );
            })
          )}
          <Text style={[styles.title, { position: "absolute", color: "transparent" }]}>{event.title}</Text>
          <MaskedView
            style={{ height: 32, width: "100%" }}
            maskElement={<View style={{ height: 32, justifyContent: "center" }}>
              <Text style={[styles.title, { color: "black" }]}>{event.title}</Text>
            </View>}
          >
            <LinearGradient
              colors={["#ffffff", "#FFFDE0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{ height: 32, width: "100%" }}
            />
          </MaskedView>
        </View>

        <Text style={styles.meta}>{event.date} • {event.location}</Text>
        <Text style={styles.description}>{event.description}</Text>

        {/* Join Button */}
        <Pressable
          onLayout={handleBtnLayout}
          onPress={() => {
            if (isJoined) {
              leaveEvent(event.id, userId);
            } else {
              joinEvent(event.id, userId);
            }
          }}
          style={styles.joinButtonWrapper}
        >
          <ImageBackground source={buttonBG} style={styles.joinButtonBG} resizeMode="stretch">
            <Text style={styles.joinButtonText}>{buttonText}</Text>
          </ImageBackground>

          {/* Borders */}
          <Image
            source={buttonTop}
            style={{
              position: "absolute",
              top: -topButtonBorderHeight / 2,
              width: btnSize.width,
              height: topButtonBorderHeight,
            }}
            resizeMode="contain"
          />
          <Image
            source={buttonBot}
            style={{
              position: "absolute",
              bottom: -bottomButtonBorderHeight / 2,
              width: btnSize.width,
              height: bottomButtonBorderHeight,
            }}
            resizeMode="contain"
          />
          <Image
            source={buttonLeft}
            style={{
              position: "absolute",
              left: -(sideButtonBorderWidth / 2),
              height: sideButtonBorderHeight,
              width: sideButtonBorderWidth,
              top: -topButtonBorderHeight / 2,
            }}
            resizeMode="contain"
          />
          <Image
            source={buttonRight}
            style={{
              position: "absolute",
              right: -(sideButtonBorderWidth / 2),
              height: sideButtonBorderHeight,
              width: sideButtonBorderWidth,
              top: -topButtonBorderHeight / 2,
            }}
            resizeMode="contain"
          />
        </Pressable>

        <Text style={styles.attendance}>
          {event.attendees.length} / {event.capacity} attending
        </Text>

        {isMember(event.id, userId) && (
          <Pressable
            onPress={() => router.push(`/event/${event.id}/chat`)}
            style={{ alignSelf: "flex-end", paddingVertical: 10, paddingHorizontal: 14, backgroundColor: "#eee", borderRadius: 8, marginTop: 8 }}
          >
            <Text style={{ fontWeight: "600" }}>Open Chat</Text>
          </Pressable>
        )}

        <Text style={styles.subheader}>Attendees:</Text>
        {event.attendees.map(uid => {
          const user = profiles.find(p => p.id === uid);
          if (!user) {
            return <Text key={uid}>[Unknown User]</Text>;
          }
          return (
            <Pressable key={uid} onPress={() => router.push(`/users/${uid}`)} style={styles.attendeeRow}>
              <Image source={{ uri: user.avatar }} style={styles.avatarThumb} />
              <Text style={styles.link}>• {user.name} {uid === event.creatorId ? "[HOST]" : ""}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  imageWrapper: { width: '100%',position: "relative", alignSelf: "center", marginBottom: 16 },
  image: { height: 200, borderRadius: 0 },
  titleStack: { height: 32, justifyContent: "center", alignItems: "flex-start", position: "relative" },
  title: { fontSize: 24, fontFamily: "Roboto_700Bold", lineHeight: 32 },
  meta: {
    fontSize: 14,
    fontFamily: "Roboto_700Bold",
    color: "#FFFDE0",
    textShadowColor: "rgba(0, 0, 0, 0.9)",
    textShadowOffset: { width: 1.5, height: 1.5 },
    textShadowRadius: 2,
    marginTop: 4,
    marginBottom: 5
  },
  description: { fontSize: 16, color: "#fff", marginBottom: 12 },
  joinButtonWrapper: { alignSelf: "flex-start", position: "relative", marginTop: 12, marginBottom: 10 },
  joinButtonBG: { paddingHorizontal: 16, paddingVertical: 6, justifyContent: "center", alignItems: "center" },
  joinButtonText: {
    fontSize: 16,
    fontFamily: "Roboto_700Bold",
    color: "#FFFDE0",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1.5,
  },
  attendance: { fontSize: 16, color: "#FFFDE0", marginBottom: 12 },
  subheader: { fontSize: 18, fontWeight: "bold", marginTop: 12, color: "#FFFDE0" },
  attendeeRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  avatarThumb: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#B0FFF9",
    marginRight: 8,
  },
  link: { fontSize: 16, color: "#FFFDE0" },
});
