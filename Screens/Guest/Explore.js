import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { getAllProperties, BASE_URL } from "../../BackendServices/Apiservices";

const primaryColor = "#FF385C";

const ExploreScreen = ({ navigation }) => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showSearchOptions, setShowSearchOptions] = useState(false);
  const [selectedType, setSelectedType] = useState("All");
  const [searchLocation, setSearchLocation] = useState("in Lahore");
  const [searchDates, setSearchDates] = useState("Add dates");
  const [searchGuests, setSearchGuests] = useState("Add guests");

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await getAllProperties();
      const active = response.filter((p) => p.status === "active" || p.isActive === true);

      const mapped = active.map((p) => ({
        id: p.id,
        name: p.name || "Beautiful Property",
        location: p.location?.city || "Unknown",
        price: p.price || 100,
        rating: p.rating || "4.5",
        type:
          p.type ||
          ["Room", "Villa", "Apartment"][Math.floor(Math.random() * 3)],
        image: getImage(p),
      }));

      setProperties(mapped);
      setFilteredProperties(mapped);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getImage = (property) => {
    if (property.media?.coverImage) return `${BASE_URL}${property.media.coverImage}`;
    if (property.media?.houseImages?.length > 0) return `${BASE_URL}${property.media.houseImages[0]}`;
    return "https://images.unsplash.com/photo-1568605114967-8130f3a36994";
  };

  const filterByType = (type) => {
    setSelectedType(type);
    if (type === "All") setFilteredProperties(properties);
    else setFilteredProperties(properties.filter((item) => item.type.toLowerCase() === type.toLowerCase()));
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const renderProperty = ({ item }) => {
    const liked = wishlist.includes(item.id);
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("PropertyDetail", { propertyId: item.id })}
      >
        <View style={styles.imageWrapper}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.badge}>
            <Text style={styles.ratingText}>⭐ {item.rating}</Text>
          </View>
          <TouchableOpacity style={styles.heart} onPress={() => toggleWishlist(item.id)}>
            <Icon name={liked ? "heart" : "heart-outline"} size={22} color={liked ? primaryColor : "#fff"} />
          </TouchableOpacity>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.location}>📍 {item.location}</Text>
          <Text style={styles.price}>Rs {item.price}<Text style={styles.night}> night</Text></Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <LinearGradient colors={[primaryColor, "#FF5A5F"]} style={styles.header}>
        <Text style={styles.headerTitle}>Explore Lahore</Text>

        {/* SEARCH BOX - Redesigned to match image */}
        <TouchableOpacity
          style={styles.searchBox}
          onPress={() => setShowSearchOptions(!showSearchOptions)}
        >
          <View style={styles.searchRow}>
            <Icon name="search-outline" size={18} color={primaryColor} />
            <View style={styles.searchTextContainer}>
              <Text style={styles.searchLabel}>Where</Text>
              <Text style={styles.searchValue}>{searchLocation}</Text>
            </View>
          </View>
          
          <View style={styles.searchDivider} />
          
          <View style={styles.searchRow}>
            <Icon name="calendar-outline" size={18} color={primaryColor} />
            <View style={styles.searchTextContainer}>
              <Text style={styles.searchLabel}>When</Text>
              <Text style={styles.searchValue}>{searchDates}</Text>
            </View>
          </View>
          
          <View style={styles.searchDivider} />
          
          <View style={styles.searchRow}>
            <Icon name="person-outline" size={18} color={primaryColor} />
            <View style={styles.searchTextContainer}>
              <Text style={styles.searchLabel}>Who</Text>
              <Text style={styles.searchValue}>{searchGuests}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => navigation.navigate("Filter")}
        >
          <Icon name="options-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* QUICK FILTER TAGS - From image */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagContainer}>
        <TouchableOpacity style={styles.tag}>
          <Text style={styles.tagText}>Room in Lahore</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tag}>
          <Text style={styles.tagText}>Apartment in Lahore</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tag, styles.favoriteTag]}>
          <Icon name="star" size={14} color="#fff" />
          <Text style={[styles.tagText, styles.favoriteTagText]}>Guest favorite</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tag}>
          <Text style={styles.tagText}>Prices include all fees</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tag}>
          <Icon name="boat-outline" size={14} color="#555" />
          <Text style={styles.tagText}>Horse</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tag}>
          <Text style={styles.tagText}>Condo in Lahore</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* TYPE FILTER */}
      <View style={styles.typeContainer}>
        {["All", "Room", "Villa", "Apartment"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.typeButton, selectedType === type && styles.activeTypeButton]}
            onPress={() => filterByType(type)}
          >
            <Text style={[styles.typeText, selectedType === type && styles.activeTypeText]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* PROPERTY LIST */}
      <FlatList
        data={filteredProperties}
        renderItem={renderProperty}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchProperties} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },

  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 15,
  },

  // Redesigned search box matching the image
  searchBox: {
    backgroundColor: "#fff",
    borderRadius: 40,
    padding: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  searchTextContainer: {
    marginLeft: 10,
    flex: 1,
  },

  searchLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },

  searchValue: {
    fontSize: 14,
    color: "#222",
    fontWeight: "500",
  },

  searchDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 12,
  },

  filterButton: {
    position: "absolute",
    top: 45,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
    padding: 10,
    borderRadius: 30,
  },

  // Tag container from image
  tagContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 30,
    marginRight: 8,
  },

  favoriteTag: {
    backgroundColor: primaryColor,
  },

  tagText: {
    fontSize: 13,
    color: "#555",
    fontWeight: "500",
    marginLeft: 4,
  },

  favoriteTagText: {
    color: "#fff",
  },

  typeContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },

  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
    backgroundColor: "#f5f5f5",
    marginRight: 8,
  },

  activeTypeButton: { 
    backgroundColor: primaryColor,
  },

  typeText: { 
    fontSize: 13, 
    color: "#555", 
    fontWeight: "500" 
  },

  activeTypeText: { 
    color: "#fff" 
  },

  // Larger cards to match image size
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  imageWrapper: { 
    position: "relative" 
  },

  image: {
    width: "100%",
    height: 180, // Increased height for larger cards
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  badge: { 
    position: "absolute", 
    top: 10, 
    left: 10, 
    backgroundColor: "#fff", 
    paddingHorizontal: 8, 
    paddingVertical: 4,
    borderRadius: 12,
  },

  ratingText: {
    fontSize: 12,
    fontWeight: "600",
  },

  heart: { 
    position: "absolute", 
    top: 10, 
    right: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 6,
    borderRadius: 20,
  },

  cardContent: { 
    padding: 12 
  },

  title: { 
    fontSize: 16, // Increased font size
    fontWeight: "600", 
    color: "#222",
    marginBottom: 2,
  },

  location: { 
    fontSize: 13, 
    color: "#777", 
    marginVertical: 3,
  },

  price: { 
    fontSize: 16, 
    fontWeight: "700", 
    color: primaryColor,
    marginTop: 4,
  },

  night: { 
    fontSize: 13, 
    color: "#999",
    fontWeight: "400", 
  },

  loader: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
});