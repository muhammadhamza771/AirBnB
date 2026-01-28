
import React from 'react';
import { View, FlatList, Text, StyleSheet, TextInput } from 'react-native';

export default function PropertyListScreen({ properties, searchText, setSearchText }) {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search destinations"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
      </View>
      <FlatList
        data={properties}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.name}</Text>
            <Text>{item.location}</Text>
            <Text>{item.price}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: { margin: 16 },
  searchInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 },
  card: { margin: 16, padding: 16, borderWidth: 1, borderColor: '#eee', borderRadius: 10 },
});
