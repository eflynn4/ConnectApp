import { useState } from "react";
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { Event, useEvents } from "../../context/EventContext";
import { useProfile } from "../../context/ProfileContext"; // adjust path if needed



export default function CreateEventScreen() {
  const { addEvent } = useEvents();
  const { profile } = useProfile(); // ✅ gets access to current user

  /* local form state */
  const [title, setTitle]         = useState("");
  const [date, setDate]           = useState("");
  const [location, setLocation]   = useState("");
  const [description, setDesc]    = useState("");
  const [image, setImage]         = useState("");
  const [capacity, setCapacity] = useState(""); // default to 5


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
        capacity: Math.max(2, parseInt(capacity) || 5), // ⬅️ Enforce minimum of 2
        attendees: [profile.id], // start with no one joined
    };
      

    addEvent(newEvent);
    Alert.alert("Event created!", "Check the Feed tab to see it.");

    /* reset form */
    setTitle(""); setDate(""); setLocation(""); setDesc(""); setImage("");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Create New Event</Text>
      <TextInput style={styles.input} placeholder="Title"       value={title}       onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Date"        value={date}        onChangeText={setDate} />
      <TextInput
      style={styles.input}
      placeholder="Capacity"
      keyboardType="numeric"
      value={capacity}
      onChangeText={setCapacity}
      />
      <TextInput style={styles.input} placeholder="Location"    value={location}    onChangeText={setLocation} />
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        placeholder="Description"
        value={description}
        onChangeText={setDesc}
      />
      <TextInput style={styles.input} placeholder="Image URL (optional)" value={image} onChangeText={setImage} />
      <Button title="Create Event" onPress={handleCreate} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 12, backgroundColor: "#fff", flexGrow: 1 },
  header:    { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  input:     { backgroundColor: "#f0f0f0", padding: 12, borderRadius: 8 }
});
