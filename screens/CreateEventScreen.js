import React, { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { useProfile } from "../context/ProfileContext";

export default function CreateEventScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const { addEvent } = useEvents();
  const { profile } = useProfile(); // ✅ gets userId and other data

  const userId = profile.id;

  const handleSubmit = () => {
    Alert.alert('Event Created!', `Title: ${title}`);
    setTitle('');
    setDate('');
    setLocation('');
    setDescription('');
    navigation.navigate('Feed');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Create New Event</Text>
      <TextInput
        style={styles.input}
        placeholder="Event Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Date (e.g. July 7)"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Create Event" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#f0f0f0',
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
  },
});
