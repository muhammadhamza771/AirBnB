import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const wishlistData = [
  {
    id: '1',
    title: 'Luxury Apartment',
    location: 'Islamabad, Pakistan',
    price: '$120 / night',
    image:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
  },
  {
    id: '2',
    title: 'Cozy Mountain House',
    location: 'Murree, Pakistan',
    price: '$90 / night',
    image:
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
  },
];

const WishlistScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />

      <TouchableOpacity style={styles.heartIcon}>
        <Icon name="heart" size={22} color="#FF385C" />
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.location}>{item.location}</Text>
        <Text style={styles.price}>{item.price}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Wishlists</Text>

      <FlatList
        data={wishlistData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default WishlistScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  card: {
    marginBottom: 12,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  image: {
    width: '100%',
    height: 110,
  },
  heartIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 18,
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 15,
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