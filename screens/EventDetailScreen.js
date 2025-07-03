import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function EventDetailScreen({ route }) {
  const { event } = route.params;
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    setJoined((prev) => !prev);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.meta}>{event.date} • {event.location}</Text>
      <Text style={styles.description}>{event.description}</Text>

      <View style={styles.buttonContainer}>
        <Button
          title={joined ? 'Leave Event' : 'Join Event'}
          onPress={handleJoin}
          color={joined ? '#ff4d4d' : '#007AFF'}
        />
        <Text style={styles.status}>
          {joined ? 'You’re going!' : 'You haven’t joined yet'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    minHeight: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  meta: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonContainer: {
    marginTop: 10,
  },
  status: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
});
