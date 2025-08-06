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

  return (
    <Pressable onPress={handlePress} style={styles.cardWrapper}>
      <View style={styles.outerWrapper}>
        <View onLayout={handleLayout}>
          <ImageBackground
            source={require("../assets/ui/card-bg.png")}
            style={styles.card}
            imageStyle={{ borderRadius: 0 }}
          >
            <Image source={{ uri: image }} style={styles.image} />

            {host && (
              <Pressable
                style={styles.avatarHit}
                onPress={() => router.push(`/users/${host.id}`)}
              >
                <Image source={{ uri: host.avatar }} style={styles.hostAvatar} />
              </Pressable>
            )}

            <View style={styles.content}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.meta}>{date} • {location}</Text>
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
          style={ styles.borderLeft }
          resizeMode="contain"
        />
        <Image
          source={eventRight}
          style={ styles.borderRight }
          resizeMode="contain"
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({

  image: {
    width: "90%",
    height: 180,
    borderRadius: 0,
    top: "10%",
    left: "5%"
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
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  meta: {
    fontSize: 14,
    color: "#ddd",
    marginTop: 4,
  },
  outerWrapper: {
    position: "relative",
    alignSelf: "stretch", // matches parent width
  },
  
  cardWrapper: {
    marginBottom: 24,
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
  
});
