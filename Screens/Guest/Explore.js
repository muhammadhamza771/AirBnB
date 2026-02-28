
import React from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ExploreScreen({
  navigation,
  properties,
  searchText,
  setSearchText,
}) {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.cardInfo}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.location}>{item.location}</Text>
        <Text style={styles.price}>${item.price} / night</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
    
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.searchContainer}
        onPress={() =>
          navigation.navigate('SearchScreen', {
          
          })
        }
      >
        <Icon name="search" size={18} color="#777" />

        <Text style={[styles.searchInput, { color: searchText ? '#000' : '#777' }]}> 
          {searchText || 'Search destinations'}
        </Text>

        {/* Filter Icon */}
        <View style={styles.filterBtn}>
          <Icon name="options-outline" size={22} color="#000" />
        </View>
      </TouchableOpacity>

     
      <FlatList
        data={properties}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 12,
    height: 48,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },

  searchInput: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 14,
  },

  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },

  image: {
    width: '100%',
    height: 200,
  },

  cardInfo: {
    padding: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
  },

  location: {
    color: '#717171',
    marginVertical: 4,
  },

  price: {
    fontWeight: 'bold',
  },
});
