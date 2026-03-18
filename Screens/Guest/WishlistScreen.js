import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

const WishlistScreen = ({ navigation }) => {

  const [wishlist, setWishlist] = useState([
    {
      id: "1",
      name: "Luxury Apartment",
      location: "Lahore",
      price: 12000,
      rating: "4.8",
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
    },
    {
      id: "2",
      name: "Modern House",
      location: "Islamabad",
      price: 15000,
      rating: "4.6",
      image:
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
    },
    {
      id: "3",
      name: "Beach Villa",
      location: "Karachi",
      price: 20000,
      rating: "4.9",
      image:
        "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
    },
  ]);

  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate("PropertyDetail", { propertyId: item.id })
      }
    >

      <View>

        <Image source={{ uri: item.image }} style={styles.image} />

        {/* rating */}
        <View style={styles.rating}>
          <Text>⭐ {item.rating}</Text>
        </View>

        {/* remove wishlist */}
        <TouchableOpacity
          style={styles.heart}
          onPress={() => removeFromWishlist(item.id)}
        >
          <Icon name="heart" size={22} color="red" />
        </TouchableOpacity>

      </View>

      <View style={styles.cardBody}>

        <Text style={styles.title} numberOfLines={1}>
          {item.name}
        </Text>

        <Text style={styles.location}>
          📍 {item.location}
        </Text>

        <Text style={styles.price}>
          Rs {item.price} <Text style={styles.night}>night</Text>
        </Text>

      </View>

    </TouchableOpacity>
  );

  const EmptyWishlist = () => (
    <View style={styles.emptyContainer}>
      <Icon name="heart-outline" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>No Wishlist Yet</Text>
      <Text style={styles.emptyText}>
        Start adding properties you love ❤️
      </Text>

      <TouchableOpacity
        style={styles.exploreBtn}
        onPress={() => navigation.navigate("Explore")}
      >
        <Text style={styles.exploreText}>Explore Properties</Text>
      </TouchableOpacity>
    </View>
  );

  return (

    <SafeAreaView style={styles.container}>

      <Text style={styles.header}>Wishlist</Text>

      {wishlist.length === 0 ? (
        <EmptyWishlist />
      ) : (
        <FlatList
          data={wishlist}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ padding: 14 }}
          showsVerticalScrollIndicator={false}
        />
      )}

    </SafeAreaView>
  );
};

export default WishlistScreen;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    fontSize: 26,
    fontWeight: "700",
    padding: 16,
  },

  card: {
    width: "48%",
    marginBottom: 18,
  },

  image: {
    width: "100%",
    height: 150,
    borderRadius: 14,
  },

  rating: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },

  heart: {
    position: "absolute",
    top: 8,
    right: 8,
  },

  cardBody: {
    marginTop: 6,
  },

  title: {
    fontSize: 14,
    fontWeight: "600",
  },

  location: {
    fontSize: 12,
    color: "#777",
  },

  price: {
    fontSize: 14,
    fontWeight: "700",
  },

  night: {
    fontSize: 12,
    fontWeight: "400",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 10,
  },

  emptyText: {
    fontSize: 14,
    color: "#777",
    marginTop: 6,
  },

  exploreBtn: {
    marginTop: 20,
    backgroundColor: "#FF385C",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },

  exploreText: {
    color: "#fff",
    fontWeight: "600",
  },

});