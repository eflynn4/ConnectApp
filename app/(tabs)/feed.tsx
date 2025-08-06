import { FlatList, ImageBackground } from "react-native";
import EventCard from "../../components/EventCard";
import { useEvents } from "../../context/EventContext";

export default function FeedScreen() {
  const { events } = useEvents();

  return (
    <ImageBackground source={require("../../assets/ui/bg.png")} style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventCard event={item} />}
      />
    </ImageBackground>
  );
}
