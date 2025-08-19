import { useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { Event, useEvents } from "../../context/EventContext";
import { useProfile } from "../../context/ProfileContext";

export default function CreateEventScreen() {
  const fieldTop = Image.resolveAssetSource(require("../../assets/ui/createfieldtop.png"));
  const fieldBot = Image.resolveAssetSource(require("../../assets/ui/createfieldbot.png"));
  const fieldLeft = Image.resolveAssetSource(require("../../assets/ui/createfieldleft.png"));
  const fieldRight = Image.resolveAssetSource(require("../../assets/ui/createfieldright.png"));
  const fieldBG1 = Image.resolveAssetSource(require("../../assets/ui/CreateField1.png"));
  const fieldBG2 = Image.resolveAssetSource(require("../../assets/ui/CreateField2.png"));
  const fieldBG3 = Image.resolveAssetSource(require("../../assets/ui/CreateField3.png"));
  const fieldBG4 = Image.resolveAssetSource(require("../../assets/ui/CreateField4.png"));
  const fieldBG5 = Image.resolveAssetSource(require("../../assets/ui/CreateField5.png"));
  const createBG = Image.resolveAssetSource(require("../../assets/ui/CreateBG.png"));
  const buttonTop = Image.resolveAssetSource(require("../../assets/ui/button-top-border.png"));
  const buttonBot = Image.resolveAssetSource(require("../../assets/ui/button-bot-border.png"));
  const buttonLeft = Image.resolveAssetSource(require("../../assets/ui/button-left-border.png"));
  const buttonRight = Image.resolveAssetSource(require("../../assets/ui/button-right-border.png"));
  const buttonBG = Image.resolveAssetSource(require("../../assets/ui/button-bg.png"));

  const { addEvent } = useEvents();
  const { profile } = useProfile();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [capacity, setCapacity] = useState("");

  const [btnSize, setBtnSize] = useState({ width: 0, height: 0 });

  const handleBtnLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setBtnSize({ width, height });
  };

  const [fieldSize, setFieldSize] = useState({ width: 0, height: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setFieldSize({ width, height });
  };

  

  const getScaledHeight = (asset: { width: number; height: number }, renderWidth: number) => {
    const aspectRatio = asset.height / asset.width;
    return renderWidth * aspectRatio;
  };

  const handleCreate = () => {
    if (!title || !date || !location || !description) {
      Alert.alert("Missing info", "Please fill out every field except image.");
      return;
    }

    const parsedCap = parseInt(capacity);
    const safeCapacity = Math.max(2, isNaN(parsedCap) ? 5 : parsedCap);

    const newEvent: Event = {
      id: Date.now().toString(),
      title,
      description,
      date,
      location,
      image,
      capacity: safeCapacity,
      attendees: [profile.id],
      creatorId: profile.id,
    };

    addEvent(newEvent);
    Alert.alert("Event created!", "Check the Feed tab to see it.");
    setTitle(""); setDate(""); setLocation(""); setDesc(""); setImage(""); setCapacity("");
  };




  const renderField = (placeholder: string, value: string, onChangeText: (text: string) => void, backgroundSource: any, height?: number, keyboardType?: "default" | "numeric") => {
    return (
      <View style={styles.fieldWrapper} onLayout={onLayout}>
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
            style={[styles.textInput, height ? { height } : {}]}
            multiline={!!height}
            keyboardType={keyboardType}
          />
        </ImageBackground>

        

        {/* Top Border */}
        
        <Image
          source={fieldTop}
          style={{
            position: "absolute",
            top: -fieldTop.height/2,
            width: fieldSize.width*1.03,
            left: -(fieldSize.width*1.03-fieldSize.width)/2
          }}
          resizeMode="contain"
        />

        {/* Bottom Border */}
        <Image
          source={fieldBot}
          style={{
            position: "absolute",
            bottom: -fieldBot.height/2,
            width: fieldSize.width*1.03,
            left: -(fieldSize.width*1.03-fieldSize.width)/2
          }}
          resizeMode="contain"
        />

        {/* Left Border */}
        <Image
          source={fieldLeft}
          style={{
            position: "absolute",
            left: -(fieldLeft.width / 2),
            height: fieldSize.height + getScaledHeight(fieldTop, fieldSize.width) - 4,
            top: -getScaledHeight(fieldTop, fieldSize.width)/2 + 2
          }}
          resizeMode="contain"
        />

        {/* Right Border */}
        <Image
          source={fieldRight}
          style={{
            position: "absolute",
            right: -(fieldRight.width / 2),
            height: fieldSize.height + getScaledHeight(fieldTop, fieldSize.width) - 4,
            top: -getScaledHeight(fieldTop, fieldSize.width)/2 + 2
          }}
          resizeMode="contain"
        />
      </View>
    );
  };

  return (
    <ImageBackground source={createBG} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {renderField("Title", title, setTitle, fieldBG1)}
        {renderField("Date", date, setDate, fieldBG2)}
        {renderField("Capacity", capacity, setCapacity, fieldBG3, undefined, "numeric")}
        {renderField("Location", location, setLocation, fieldBG4)}
        {renderField("Description", description, setDesc, fieldBG5, 100)}
        {renderField("Image URL (optional)", image, setImage, fieldBG4)}

        <Pressable onLayout={handleBtnLayout} onPress={handleCreate} style={styles.btnWrapper}>
          <ImageBackground source={buttonBG} style={styles.btnBG} resizeMode="stretch">
            <Text style={styles.btnText}>Create Event</Text>
          </ImageBackground>

          {/* Button borders */}
          <Image source={buttonTop} style={{
            position: "absolute", top: -getScaledHeight(buttonTop, btnSize.width) / 2,
            width: btnSize.width,
            height: getScaledHeight(buttonTop, btnSize.width),
          }} resizeMode="contain" />
          <Image source={buttonBot} style={{
            position: "absolute", bottom: -getScaledHeight(buttonBot, btnSize.width) / 2,
            width: btnSize.width,
            height: getScaledHeight(buttonBot, btnSize.width),
          }} resizeMode="contain" />
          <Image source={buttonLeft} style={{
            position: "absolute",
            left: -(buttonLeft.width / 2),
            height: btnSize.height + getScaledHeight(buttonTop, btnSize.width),
            top: -getScaledHeight(buttonTop, btnSize.width) / 2
          }} resizeMode="contain" />
          <Image source={buttonRight} style={{
            position: "absolute",
            right: -(buttonRight.width / 2),
            height: btnSize.height + getScaledHeight(buttonTop, btnSize.width),
            top: -getScaledHeight(buttonTop, btnSize.width) / 2
          }} resizeMode="contain" />
        </Pressable>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFDE0",
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 2,
    marginBottom: 4,
    alignSelf: "center"
  },
  fieldWrapper: {
    position: "relative",
    width: "100%",
    alignSelf: "center",
    marginTop: 10,
  },
  fieldBG: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: "center",
  },
  textInput: {
    fontSize: 16,
    fontFamily: "Roboto_700Bold",
    color: "#FFFDE0",
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1.5,
  },
  borderTop: {
    position: "absolute",
    top: -10,
    width: "100%",
  },
  borderBottom: {
    position: "absolute",
    bottom: -10,
    width: "100%",
  },
  borderSide: {
    position: "absolute",
    height: "100%",
  },
  borderLeft: {
    left: -10,
  },
  borderRight: {
    right: -10,
  },
  btnWrapper: {
    position: "relative",
    alignSelf: "flex-start",
    marginTop: 16,
  },
  btnBG: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFDE0",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1.5,
  }
});
