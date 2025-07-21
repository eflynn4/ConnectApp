import { FlatList, View } from "react-native";
import EventCard from "../../components/EventCard";
import { useEvents } from "../../context/EventContext";

export default function FeedScreen() {
  const { events } = useEvents();

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#f2f2f2" }}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <EventCard event={item} />
          )}
          
      />
    </View>
  );
}
