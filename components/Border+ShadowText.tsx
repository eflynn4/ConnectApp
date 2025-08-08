import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, ImageBackground, LayoutChangeEvent, Pressable, StyleSheet, Text, View } from "react-native";
import { Event } from "../context/EventContext";
import { useProfiles } from "../context/ProfilesContext";


const eventTop = Image.resolveAssetSource(require("../assets/ui/event-top-border.png"));
const eventBot = Image.resolveAssetSource(require("../assets/ui/event-bot-border.png"));
const eventLeft = Image.resolveAssetSource(require("../assets/ui/event-left-border.png"));
const eventRight = Image.resolveAssetSource(require("../assets/ui/event-right-border.png"));

const thumbnailTop = Image.resolveAssetSource(require("../assets/ui/img-top-border.png"));
const thumnbailBot = Image.resolveAssetSource(require("../assets/ui/img-bot-border.png"));
const thumbnailLeft = Image.resolveAssetSource(require("../assets/ui/img-left-border.png"));
const thumbnailRight = Image.resolveAssetSource(require("../assets/ui/img-right-border.png"));

const borderWidth = eventTop.height;

type EventCardProps = {
  event: Event;
};



export default function EventCard({ event }: EventCardProps) {
  const { id, title, date, location, image, creatorId } = event;
  const [cardSize, setCardSize] = useState({ width: 0, height: 0 });
  const router = useRouter();
  const profiles = useProfiles();
  const host = profiles.find(p => p.id === creatorId);

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setCardSize({ width, height });
  };

  const handlePress = () => {
    router.push(`/event/${id}` as const);
  };

  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const handleImageLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setImageSize({ width, height });
  };

  function getScaledHeight(asset: { width: number; height: number }, renderWidth: number) {
    const aspectRatio = asset.height / asset.width;
    return renderWidth * aspectRatio;
  }
  
  const topBorderHeight = getScaledHeight(eventTop, cardSize.width);
  const bottomBorderHeight = getScaledHeight(eventBot, cardSize.width);

  const sideBorderHeight = cardSize.height + topBorderHeight/2 + bottomBorderHeight/2;

  const STROKE_RADIUS = 2;
  const strokeOffsets = Array.from({ length: STROKE_RADIUS * 2 + 1 }, (_, i) => i - STROKE_RADIUS);
  const SHADOW_OFFSET = STROKE_RADIUS;


  

  return (
    <Pressable onPress={handlePress} style={styles.cardWrapper}>
      <View style={styles.outerWrapper}>
        <View onLayout={handleLayout}>
          <ImageBackground
            source={require("../assets/ui/card-bg.png")}
            style={styles.card}
            imageStyle={{ borderRadius: 0 }}
          >
            <View onLayout={handleImageLayout} style={styles.imageWrapper}>
              <Image source={{ uri: image }} style={styles.image} />

              {/* Top Border */}
              <Image
                source={thumbnailTop}
                style={{
                  position: "absolute",
                  top: -thumbnailTop.height/2,
                  width: imageSize.width,
                }}
                resizeMode="contain"
              />

              {/* Bottom Border */}
              <Image
                source={thumnbailBot}
                style={{
                  position: "absolute",
                  bottom: -thumnbailBot.height/2,
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
                  height: imageSize.height + getScaledHeight(thumbnailTop, imageSize.width) - 4,
                  top: -getScaledHeight(thumbnailTop, imageSize.width)/2 + 2
                }}
                resizeMode="contain"
              />

              {/* Right Border */}
              <Image
                source={thumbnailRight}
                style={{
                  position: "absolute",
                  right: -(thumbnailRight.width / 2),
                  height: imageSize.height + getScaledHeight(thumbnailTop, imageSize.width) - 4,
                  top: -getScaledHeight(thumbnailTop, imageSize.width)/2 + 2
                }}
                resizeMode="contain"
              />
            </View>

            {host && (
              <Pressable
                style={styles.avatarHit}
                onPress={() => router.push(`/users/${host.id}`)}
              >
                <Image source={{ uri: host.avatar }} style={styles.hostAvatar} />
              </Pressable>
            )}

            <View style={styles.content}>
              <View style={styles.titleStack}>
                {/* Shadow layer — pick one */}
                <Text
                  style={[
                    styles.title,
                    {
                      position: "absolute",
                      // ⬇️ bottom-right (change to -SHADOW_OFFSET for left if you want bottom-left)
                      left: SHADOW_OFFSET,
                      top: SHADOW_OFFSET,
                      color: "rgba(0,0,0,0.6)",
                      // zIndex:-1 can get clipped; keep it 0 and rely on render order
                    },
                  ]}
                >
                  {title}
                </Text>

                {/* Stroke layer — use the centralized offsets */}
                {strokeOffsets.flatMap((dx) =>
                  strokeOffsets.map((dy) => {
                    if (dx === 0 && dy === 0) return null;
                    return (
                      <Text
                        key={`${dx}-${dy}`}
                        style={[
                          styles.title,
                          {
                            position: "absolute",
                            left: dx,
                            top: dy,
                            color: "rgba(0,0,0,0.05)",
                          },
                        ]}
                      >
                        {title}
                      </Text>
                    );
                  })
                )}

                {/* Transparent text for gradient mask */}
                <Text style={[styles.title, { position: "absolute", color: "transparent" }]}>{title}</Text>

                {/* Gradient on top */}
                <MaskedView
                  style={{ height: 28, width: "100%" }}
                  maskElement={
                    <View style={{ height: 28, justifyContent: "center" }}>
                      <Text style={[styles.title, { color: "black" }]}>{title}</Text>
                    </View>
                  }
                >
                  <LinearGradient
                    colors={["#ffffff", "#cccccc"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{ height: 28, width: "100%" }}
                  />
                </MaskedView>
              </View>

            </View>



          </ImageBackground>
        </View>

        {/* Borders scaled dynamically */}
        <Image
          source={eventTop}
          style={ styles.borderTop }
          resizeMode="contain"
        />
        <Image
          source={eventBot}
          style={ styles.borderBottom }
          resizeMode="contain"
        />
        <Image
          source={eventLeft}
          style={{position: "absolute",
            left: -(eventLeft.width/2),
            height: sideBorderHeight - 4,
            top: -topBorderHeight/2 + 2,
            zIndex: 1, }}
          resizeMode="contain"
        />
        <Image
          source={eventRight}
          style={{position: "absolute",
            right: -(eventLeft.width/2),
            top: -topBorderHeight/2 + 2,
            height: sideBorderHeight -4,
            zIndex: 1, }}
          resizeMode="contain"
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 0,
  },
  hostAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#eee",
  },
  avatarHit: {
    position: "absolute",
    right: 12,
    bottom: 12,
    zIndex: 10,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    marginTop: 32,
  },
  titleLayout: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    height: 28, // match the MaskedView height
    justifyContent: "center",
  },
  
  titleStack: {
    height: 28,
    justifyContent: "center",
    alignItems: "flex-start",
    position: "relative", // anchor for absolute stroke layers
  },
  
  title: {
    fontSize: 20,
    fontFamily: "Roboto_700Bold",
    lineHeight: 28,
  },
  
  
  strokeText: {
    color: "black",
    zIndex: 0,
  },
  
  
  titleMaskContainer: {
    height: 28,
    justifyContent: "center",
    position: "relative",
  },
  

  meta: {
    fontSize: 14,
    fontFamily: "Roboto_400Regular",
    color: "#ddd",
  },
  outerWrapper: {
    position: "relative",
    alignSelf: "stretch", // matches parent width
  },
  
  cardWrapper: {
    marginBottom: 48,
  },
  
  card: {
    paddingBottom: 12,
    backgroundColor: "transparent",
  },
  
  borderTop: {
    position: "absolute",
    top: -(eventTop.height/2),
    width: "100%",
    zIndex: 10,
  },
  
  borderBottom: {
    position: "absolute",
    bottom: -(eventBot.height/2),
    width: "100%",
    zIndex: 10,
  },
  
  borderLeft: {
    position: "absolute",
    left: -(eventLeft.width/2),
    height: "100%",
    zIndex: 10,
  },
  
  borderRight: {
    position: "absolute",
    right: -(eventRight.width/2),
    height: "100%",
    zIndex: 10,
  },
  imageWrapper: {
    position: "relative",
    width: "90%",
    height: 180,
    top: "10%",
    left: "5%",
  },
});
