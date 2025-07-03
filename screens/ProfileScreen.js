import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';

const mockMedia = [
  { id: '1', uri: 'https://placekitten.com/300/300' },
  { id: '2', uri: 'https://placekitten.com/301/300' },
  { id: '3', uri: 'https://placekitten.com/302/300' },
  { id: '4', uri: 'https://placekitten.com/303/300' },
  { id: '5', uri: 'https://placekitten.com/304/300' },
  { id: '6', uri: 'https://placekitten.com/305/300' }
];

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>Ape</Text>
      <Text style={styles.bio}>Chronic connector. Vibe curator. Dream giraffe survivor 🦒</Text>

      <FlatList
        data={mockMedia}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <Image source={{ uri: item.uri }} style={styles.media} />
        )}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  bio: { fontSize: 14, color: '#555', marginBottom: 16 },
  grid: { gap: 4 },
  media: {
    width: '31%',
    aspectRatio: 1,
    margin: '1%',
    borderRadius: 10,
  }
});
