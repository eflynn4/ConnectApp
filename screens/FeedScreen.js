import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import mockEvents from '../assets/mockData.json';
import EventCard from '../components/EventCard';

export default function FeedScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={mockEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={() => navigation.navigate('EventDetail', { event: item })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
});
