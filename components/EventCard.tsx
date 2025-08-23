import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { memo, useCallback, useMemo, useState } from "react";
import {
  Image,
  ImageBackground,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Event, useEvents } from "../context/EventContext";
import { useProfile } from "../context/ProfileContext";
import { useProfiles } from "../context/ProfilesContext";

/* ---------- static assets (resolved once) ---------- */
const feedCard         = Image.resolveAssetSource(require("../assets/ui/FeedCard.png"));            // bg + border baked in
const feedPictureFrame = Image.resolveAssetSource(require("../assets/ui/FeedPictureFrame.png"));    // transparent center
const avatarRingImg    = Image.resolveAssetSource(require("../assets/ui/Avatar Ring.png"));         // transparent center
const buttonTop        = Image.resolveAssetSource(require("../assets/ui/button-top-border-2.png"));
const buttonBot        = Image.resolveAssetSource(require("../assets/ui/button-bot-border-2.png"));
const buttonLeft       = Image.resolveAssetSource(require("../assets/ui/button-left-border-2.png"));
const buttonRight      = Image.resolveAssetSource(require("../assets/ui/button-right-border-2.png"));
const buttonBG         = Image.resolveAssetSource(require("../assets/ui/FeedJoinButton3.png"));

/* ---------- layout helpers ---------- */
const CARD_RATIO  = feedCard.width / feedCard.height;
const FRAME_RATIO = feedPictureFrame.width / feedPictureFrame.height;

/* Title stroke/shadow config */
const TITLE_STROKE_RADIUS = 2;
const TITLE_SHADOW_OFFSET = TITLE_STROKE_RADIUS;
/* Precompute offsets once */
const TITLE_OFFSETS: Array<[number, number]> = [];
for (let dx = -TITLE_STROKE_RADIUS; dx <= TITLE_STROKE_RADIUS; dx++) {
  for (let dy = -TITLE_STROKE_RADIUS; dy <= TITLE_STROKE_RADIUS; dy++) {
    if (dx !== 0 || dy !== 0) TITLE_OFFSETS.push([dx, dy]);
  }
}

/* Button text stroke config */
const BTN_STROKE_RADIUS = 2;
const BTN_OFFSETS: Array<[number, number]> = [];
for (let dx = -BTN_STROKE_RADIUS; dx <= BTN_STROKE_RADIUS; dx++) {
  for (let dy = -BTN_STROKE_RADIUS; dy <= BTN_STROKE_RADIUS; dy++) {
    if (dx !== 0 || dy !== 0) BTN_OFFSETS.push([dx, dy]);
  }
}
/* Match shadow insets so it doesn’t clip */
const BTN_SHADOW_DX = 3;
const BTN_SHADOW_DY = 3;

/* Small helper */
const getScaledHeight = (asset: { width: number; height: number }, renderW: number) =>
  (asset.height / asset.width) * renderW;

type EventCardProps = { event: Event };

const EventCard = memo(function EventCard({ event }: EventCardProps) {
  const { id, title, date, location, image, creatorId, attendees } = event;

  const router = useRouter();
  const { joinEvent, leaveEvent } = useEvents();
  const { profile } = useProfile();
  const profiles = useProfiles();

  const host = profiles.find((p) => p.id === creatorId);
  const isJoined = attendees.includes(profile.id);
  const buttonText = isJoined ? "JOINED" : "JOIN";

  /* Button border math (needs size once from layout) */
  const [btnSize, setBtnSize] = useState({ width: 0, height: 0 });
  const onBtnLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    // set only if changed to avoid extra renders
    if (width !== btnSize.width || height !== btnSize.height) {
      setBtnSize({ width, height });
    }
  }, [btnSize.width, btnSize.height]);

  const topBtnH = useMemo(() => getScaledHeight(buttonTop, btnSize.width), [btnSize.width]);
  const botBtnH = useMemo(() => getScaledHeight(buttonBot, btnSize.width), [btnSize.width]);
  const sideBtnH = btnSize.height + topBtnH / 2 + botBtnH / 2;

  // simplest: accept any non-empty string
  const imgSource = useMemo(() => {
    if (typeof image === "string" && image.trim().length > 0) {
      return { uri: image }; // works for http(s), file://, content://, ph://, etc.
    }
    return require("../assets/ui/Avatar Ring.png"); // use require() for local fallback
  }, [image]);

  const goEvent = useCallback(() => {
    router.push(`/event/${id}` as const);
  }, [router, id]);

  const onToggleJoin = useCallback(() => {
    if (isJoined) leaveEvent(id, profile.id);
    else joinEvent(id, profile.id);
  }, [isJoined, leaveEvent, joinEvent, id, profile.id]);

  return (
    <Pressable onPress={goEvent} style={styles.cardWrapper}>
      <ImageBackground source={feedCard} style={styles.card} resizeMode="stretch">
        {/* Photo + frame */}
        <View style={styles.photoArea}>
          <View style={styles.frameBox}>
            <Image source={imgSource as any} style={styles.photo} resizeMode="cover" />
            <Image source={feedPictureFrame} style={styles.frameOverlay} resizeMode="stretch" />
          </View>
        </View>

        {/* Avatar + ring */}
        {host && (
          <Pressable
            style={styles.avatarWrap}
            onPress={() => router.push(`/users/${host.id}` as const)}
          >
            <Image source={{ uri: host.avatar }} style={styles.avatar} />
            <Image source={avatarRingImg} style={styles.avatarRing} resizeMode="contain" />
          </Pressable>
        )}

        {/* Text/content */}
        <View style={styles.content}>
          <View style={styles.titleStack}>
            {/* subtle strokes (precomputed offsets) */}
            {TITLE_OFFSETS.map(([dx, dy]) => (
              <Text
                key={`${dx},${dy}`}
                style={[
                  styles.titleStrokes,
                  { position: "absolute", left: dx, top: dy, color: "rgba(0,0,0,0.07)" },
                ]}
              >
                {title}
              </Text>
            ))}

            {/* shadow */}
            <Text style={[styles.titleShadow, { position: "absolute", color: "black" }]}>
              {title}
            </Text>

            {/* gradient fill */}
            <Text style={[styles.title, { position: "absolute", color: "transparent" }]}>
              {title}
            </Text>
            <MaskedView
              style={{ height: 28, width: "100%" }}
              maskElement={
                <View style={{ height: 28, justifyContent: "center" }}>
                  <Text style={[styles.title, { color: "black" }]}>{title}</Text>
                </View>
              }
            >
              <LinearGradient
                colors={["#ffffff", "#FFFDE0"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ height: 28, width: "100%" }}
              />
            </MaskedView>
          </View>


          <View style={styles.metaStack}>
            {TITLE_OFFSETS.map(([dx, dy]) => (
              <Text
                key={`${dx},${dy}`}
                style={[
                  styles.metaStrokes,
                  { position: "absolute", left: dx, top: dy, color: "rgba(0,0,0,0.05)" },
                ]}
              >
                {date} • {location}
              </Text>
            ))}
            <Text style={styles.meta}>
              {date} • {location}
            </Text>
          </View>

          {/* Join button */}
          <Pressable onLayout={onBtnLayout} onPress={onToggleJoin} style={styles.joinButtonWrapper}>
            <ImageBackground source={buttonBG} style={styles.joinButtonBG} resizeMode="stretch">
              <View style={styles.btnTextStack}>
                {/* strokes */}
                {BTN_OFFSETS.map(([dx, dy]) => (
                  <Text
                    key={`${dx},${dy}`}
                    style={[
                      styles.joinButtonStrokes,
                      { position: "absolute", left: dx, top: dy, color: "rgba(0,0,0,0.07)" },
                    ]}
                  >
                    {buttonText}
                  </Text>
                ))}
                {/* main */}
                <Text style={styles.joinButtonText}>{buttonText}</Text>
              </View>
            </ImageBackground>

            {/* decorative borders */}
            <Image
              source={buttonTop}
              style={{ position: "absolute", top: -topBtnH / 2, width: btnSize.width, height: topBtnH }}
              resizeMode="contain"
            />
            <Image
              source={buttonBot}
              style={{ position: "absolute", bottom: -botBtnH / 2, width: btnSize.width, height: botBtnH }}
              resizeMode="contain"
            />
            <Image
              source={buttonLeft}
              style={{ position: "absolute", left: -(buttonLeft.width / 2), height: sideBtnH, top: -topBtnH / 2 }}
              resizeMode="contain"
            />
            <Image
              source={buttonRight}
              style={{ position: "absolute", right: -(buttonRight.width / 2), height: sideBtnH, top: -topBtnH / 2 }}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      </ImageBackground>
    </Pressable>
  );
});

export default EventCard;

const styles = StyleSheet.create({
  cardWrapper: {
    width: "95%",
    aspectRatio: CARD_RATIO,
    alignSelf: "center",
    marginBottom: 24,
  },
  card: {
    flex: 1,
    backgroundColor: "transparent",
    paddingBottom: 12,
  },

  /* Photo area */
  photoArea: {
    alignItems: "center",
    marginTop: "9%",
  },
  frameBox: {
    width: "82%",
    aspectRatio: FRAME_RATIO,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  photo: {
    width: "94%",
    height: "94%",
  },
  frameOverlay: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },

  /* Avatar */
  avatarWrap: {
    position: "absolute",
    right: "11%",
    bottom: "9%",
    width: "18%",
    aspectRatio: 1, // square
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: "82%",
    height: "82%",
    borderRadius: 9999,
    backgroundColor: "#eee",
  },
  avatarRing: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  /* Text */
  content: {
    paddingTop: "1.5%",
    paddingHorizontal: "12%",
  },
  titleStack: {
    height: 28,
    justifyContent: "center",
    alignItems: "flex-start",
    position: "relative",
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: "Roboto_700Bold",
    paddingRight: 3
  },
  titleShadow: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: "Roboto_700Bold",
    textShadowColor: "rgba(0, 0, 0, 0.9)",
    textShadowOffset: { width: 1.5, height: 1.5 },
    paddingRight: 3,
    opacity: 0.7
  },
  titleStrokes: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: "Roboto_700Bold",
    paddingRight: 3
  },
  metaStack: {
    position: "relative",
    justifyContent: "center",
    marginTop: 7,            // keep your vertical spacing here
    marginBottom: 2,

  },
  
  meta: {
    fontSize: 18,
    lineHeight: 24,          // match stack height
    fontFamily: "Roboto_700Bold",
    color: "#FFFDE0",
    textShadowColor: "rgba(0, 0, 0, 0.9)",
    textShadowOffset: { width: 1.5, height: 1.5 },
    textShadowRadius: 2,
    paddingRight: 3,
    paddingBottom: 3
  },
  
  metaStrokes: {
    fontSize: 18,
    lineHeight: 24,          // exact same
    fontFamily: "Roboto_700Bold",
    paddingRight: 3,
    paddingBottom: 3
  },
  

  /* Join button */
  joinButtonWrapper: {
    alignSelf: "flex-start",
    position: "relative",
    marginTop: "11%",
    marginLeft: "3%",
  },
  joinButtonBG: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  btnTextStack: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    // ensure text shadow & strokes never clip on right/bottom
  },
  joinButtonText: {
    fontSize: 28,
    fontFamily: "Roboto_700Bold",
    color: "#FFFCD4",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: BTN_SHADOW_DX, height: BTN_SHADOW_DY },
    textShadowRadius: 2,
    paddingRight: 3
  },
  joinButtonStrokes: {
    fontSize: 28,
    fontFamily: "Roboto_700Bold",
  },
});

