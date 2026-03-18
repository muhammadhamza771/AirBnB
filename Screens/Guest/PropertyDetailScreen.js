// screens/Guest/PropertyDetailScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
  StatusBar,
  ActivityIndicator
} from "react-native";
import { getPropertyById, BASE_URL } from "../../BackendServices/Apiservices";
import Icon from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

// Dummy comments data
const DUMMY_COMMENTS = [
  {
    id: 1,
    user: "Alice",
    avatar: null,
    date: "December 2023",
    comment: "Amazing place! Very clean and exactly as described. The host was super responsive and helpful.",
    rating: 5
  },
  {
    id: 2,
    user: "Bob",
    avatar: null,
    date: "November 2023",
    comment: "Great location and beautiful property. Would definitely recommend to anyone visiting the area.",
    rating: 5
  },
  {
    id: 3,
    user: "Sarah",
    avatar: null,
    date: "October 2023",
    comment: "Perfect stay! The rooms were spacious and the amenities were top notch.",
    rating: 4
  }
];

const PropertyDetailScreen = ({ navigation, route }) => {
  const { propertyId } = route.params || {};
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProperty();
  }, []);

  const fetchProperty = async () => {
    try {
      setIsLoading(true);
      const data = await getPropertyById(propertyId);
      console.log("Property data:", data);
      setProperty(data);
    } catch (error) {
      console.log("Error fetching property:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextPress = () => {
    // Pass services data and property price to the next page
    navigation.navigate('Booking', {
      services: property?.services || [], // Passing services array
      propertyId: propertyId,
      propertyPrice: property?.price || 0, // Passing property price
      propertyName: property?.name || '', // Optional: pass property name for display
      propertyType: property?.propertyType || '' // Optional: pass property type
    });
  };

  const getAllImages = () => {
    let images = [];
    
    if (property?.media?.coverImage) {
      images.push({
        url: property.media.coverImage,
        type: 'cover',
        id: 'cover'
      });
    }
    
    if (property?.media?.houseImages?.length > 0) {
      property.media.houseImages.forEach((img, index) => {
        images.push({
          url: img,
          type: 'house',
          id: `house-${index}`
        });
      });
    }

    return images;
  };

  const getTotalRooms = () => {
    const bedrooms = property?.rooms?.length || 0;
    const bathrooms = property?.rooms?.filter(r => r.bathroomType).length || 0;
    return { bedrooms, bathrooms };
  };

  // Calculate average rating
  const averageRating = () => {
    const total = DUMMY_COMMENTS.reduce((sum, comment) => sum + comment.rating, 0);
    return (total / DUMMY_COMMENTS.length).toFixed(1);
  };

  // Image Gallery Component
  const ImageGallery = () => {
    const images = getAllImages();

    return (
      <View style={styles.galleryContainer}>
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Image
              source={{ uri: `${BASE_URL}${item.url}` }}
              style={styles.galleryImage}
              resizeMode="cover"
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  };

  // Room Card Component
  const RoomCard = ({ room }) => {
    const hasRoomImage = room.images?.room && room.images.room !== "";
    const hasBathroomImage = room.images?.bathroom && room.images.bathroom !== "";

    return (
      <View style={styles.roomCard}>
        <Text style={styles.roomName}>{room.name}</Text>
        
        {(hasRoomImage || hasBathroomImage) && (
          <View style={styles.roomImagesContainer}>
            {hasRoomImage && (
              <View style={styles.roomImageWrapper}>
                <Image 
                  source={{ uri: `${BASE_URL}${room.images.room}` }}
                  style={styles.roomImage}
                />
                <View style={styles.imageLabel}>
                  <Icon name="bed-outline" size={12} color="#fff" />
                  <Text style={styles.imageLabelText}>Bedroom</Text>
                </View>
              </View>
            )}
            
            {hasBathroomImage && (
              <View style={styles.roomImageWrapper}>
                <Image 
                  source={{ uri: `${BASE_URL}${room.images.bathroom}` }}
                  style={styles.roomImage}
                />
                <View style={styles.imageLabel}>
                  <Icon name="water-outline" size={12} color="#fff" />
                  <Text style={styles.imageLabelText}>Bathroom</Text>
                </View>
              </View>
            )}
          </View>
        )}

        <View style={styles.bedsInfo}>
          {room.beds.map((bed, index) => (
            <View key={index} style={styles.bedItem}>
              <Icon name="bed-outline" size={16} color="#666" />
              <Text style={styles.bedText}>
                {bed.count} {bed.type} Bed{bed.count > 1 ? 's' : ''}
              </Text>
            </View>
          ))}
        </View>

        {room.bathroomType && (
          <View style={styles.bathroomInfo}>
            <Icon name="water-outline" size={16} color="#666" />
            <Text style={styles.bathroomText}>
              {room.bathroomType === 'Attached' ? 'Private' : 'Shared'} bathroom
            </Text>
          </View>
        )}

        {room.extraMattress?.allowed && (
          <View style={styles.extraMattress}>
            <Icon name="add-circle-outline" size={16} color="#FF385C" />
            <Text style={styles.extraMattressText}>
              Extra mattress available ({room.extraMattress.count})
            </Text>
          </View>
        )}

        {room.hasLock && (
          <View style={styles.roomFeature}>
            <Icon name="lock-closed-outline" size={16} color="#666" />
            <Text style={styles.featureText}>Private lock</Text>
          </View>
        )}
      </View>
    );
  };

  // Services Section - MODIFIED: Now display only, no selection
  const ServicesSection = () => {
    if (!property?.services?.length) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Services</Text>
        <FlatList
          horizontal
          data={property.services}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.serviceCard}>
              <Text style={styles.serviceName}>{item.name}</Text>
              <Text style={styles.servicePrice}>Rs {item.price}</Text>
              <View style={styles.serviceBadge}>
                <Icon name="information-circle-outline" size={16} color="#FF385C" />
                <Text style={styles.serviceBadgeText}>Available</Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    );
  };

  // Comments Section
  const CommentsSection = () => {
    return (
      <View style={styles.section}>
        <View style={styles.commentsHeader}>
          <Icon name="star" size={22} color="#FF385C" />
          <Text style={styles.commentsTitle}> {averageRating()} · {DUMMY_COMMENTS.length} reviews</Text>
        </View>
        
        {DUMMY_COMMENTS.map((comment) => (
          <View key={comment.id} style={styles.commentItem}>
            <View style={styles.commentUserInfo}>
              <View style={styles.commentAvatar}>
                {comment.avatar ? (
                  <Image source={{ uri: comment.avatar }} style={styles.commentAvatarImage} />
                ) : (
                  <Icon name="person-circle-outline" size={40} color="#FF385C" />
                )}
              </View>
              <View style={styles.commentUserDetails}>
                <Text style={styles.commentUserName}>{comment.user}</Text>
                <Text style={styles.commentDate}>{comment.date}</Text>
              </View>
            </View>
            <Text style={styles.commentText}>{comment.comment}</Text>
            <View style={styles.commentRating}>
              {[...Array(5)].map((_, i) => (
                <Icon 
                  key={i} 
                  name={i < comment.rating ? "star" : "star-outline"} 
                  size={14} 
                  color="#FF385C" 
                />
              ))}
            </View>
          </View>
        ))}
        
        <TouchableOpacity style={styles.showAllCommentsBtn}>
          <Text style={styles.showAllCommentsText}>Show all {DUMMY_COMMENTS.length} reviews</Text>
          <Icon name="chevron-forward" size={16} color="#FF385C" />
        </TouchableOpacity>
      </View>
    );
  };

  // Price Section Component
  const PriceSection = () => {
    if (!property?.price) return null;
    
    return (
      <View style={styles.priceSection}>
        <Text style={styles.priceLabel}>Price per night</Text>
        <Text style={styles.priceValue}>Rs {property.price}</Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FF385C" />
        <Text style={styles.loadingText}>Loading property...</Text>
      </View>
    );
  }

  if (!property) {
    return (
      <View style={styles.loader}>
        <Icon name="alert-circle-outline" size={50} color="#FF385C" />
        <Text style={styles.loadingText}>Property not found</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchProperty}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { bedrooms, bathrooms } = getTotalRooms();
  const totalGuests = (property.guests?.adults || 0) + (property.guests?.children || 0);
  const hostName = property.owner?.fullname || `Host ${property.user_id}`;
  const hostImage = property.owner?.profile_picture 
    ? `${BASE_URL}${property.owner.profile_picture}` 
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Fixed Back Button */}
      <TouchableOpacity 
        style={styles.fixedBackBtn}
        onPress={() => navigation.goBack()}
      >
        <Icon name="chevron-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* Fixed Next Button */}
      <TouchableOpacity 
        style={styles.fixedNextBtn}
        onPress={handleNextPress}
      >
        <Text style={styles.nextBtnText}>Next</Text>
        <Icon name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Image Gallery */}
        <ImageGallery />

        {/* Content */}
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.propertyType}>
              {property.propertyType} in {property.location?.city}
            </Text>
            <Text style={styles.propertyName}>{property.name}</Text>
            
            <View style={styles.ratingContainer}>
              <Icon name="star" size={16} color="#FF385C" />
              <Text style={styles.ratingText}>{averageRating()} · {DUMMY_COMMENTS.length} reviews</Text>
            </View>

            {/* Price Display */}
            <PriceSection />
          </View>

          {/* Host Info */}
          <View style={styles.hostSection}>
            <View style={styles.hostAvatar}>
              {hostImage ? (
                <Image 
                  source={{ uri: hostImage }}
                  style={styles.hostAvatarImage}
                />
              ) : (
                <Icon name="person-circle-outline" size={48} color="#FF385C" />
              )}
            </View>
            <View style={styles.hostInfo}>
              <Text style={styles.hostName}>
                Hosted by {hostName}
              </Text>
              <Text style={styles.hostDetails}>
                {bedrooms} bedroom{bedrooms !== 1 ? 's' : ''} · {bathrooms} bathroom{bathrooms !== 1 ? 's' : ''} · {totalGuests} guest{totalGuests !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>

          {/* Location Details */}
          <View style={styles.locationSection}>
            <View style={styles.locationHeader}>
              <Icon name="location-outline" size={20} color="#FF385C" />
              <Text style={styles.locationTitle}>Location</Text>
            </View>
            
            <View style={styles.locationDetails}>
              <Text style={styles.locationText}>
                <Text style={styles.locationLabel}>Country: </Text>
                {property.location?.country}
              </Text>
              <Text style={styles.locationText}>
                <Text style={styles.locationLabel}>City: </Text>
                {property.location?.city}
              </Text>
              <Text style={styles.locationText}>
                <Text style={styles.locationLabel}>Area: </Text>
                {property.location?.area}
              </Text>
              <Text style={styles.locationText}>
                <Text style={styles.locationLabel}>Address: </Text>
                {property.location?.address}
              </Text>
            </View>

            {/* Nearby Places */}
            {property.location?.nearbyPlaces?.length > 0 && (
              <View style={styles.nearbySection}>
                <Text style={styles.nearbyTitle}>Nearby places</Text>
                <View style={styles.nearbyList}>
                  {property.location.nearbyPlaces.map((place, index) => (
                    <View key={index} style={styles.nearbyItem}>
                      <Icon name="location" size={14} color="#FF385C" />
                      <Text style={styles.nearbyText}>{place}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this place</Text>
            <Text style={styles.description}>
              {property.description_data?.text}
            </Text>
            
            {/* Highlights */}
            {property.description_data?.highlights?.length > 0 && (
              <View style={styles.highlights}>
                {property.description_data.highlights.map((highlight, index) => (
                  <View key={index} style={styles.highlightItem}>
                    <Icon name="star" size={14} color="#FF385C" />
                    <Text style={styles.highlightText}>{highlight}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Rooms */}
          {property.rooms?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Where you'll sleep</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.roomsContainer}>
                  {property.rooms.map((room) => (
                    <RoomCard key={room.id} room={room} />
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Amenities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What this place offers</Text>
            <View style={styles.amenitiesGrid}>
              {property.amenities?.slice(0, 8).map((amenity, index) => (
                <View key={index} style={styles.amenityItem}>
                  <Icon name="checkmark-circle-outline" size={20} color="#FF385C" />
                  <Text style={styles.amenityText}>
                    {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Services - MODIFIED: Now display only */}
          <ServicesSection />

          {/* Habits */}
          {property.pets_and_habits?.habits?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Habits</Text>
              <View style={styles.habitsList}>
                {property.pets_and_habits.habits.map((habit, index) => (
                  <View key={index} style={styles.habitItem}>
                    <Icon name="heart-outline" size={16} color="#FF385C" />
                    <Text style={styles.habitText}>{habit}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Pets */}
          {property.pets_and_habits?.allowed && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pets</Text>
              <View style={styles.petItem}>
                <Icon name="paw-outline" size={20} color="#666" />
                <Text style={styles.petText}>Pets allowed</Text>
              </View>
              {property.pets_and_habits.names?.length > 0 && (
                <Text style={styles.petDetail}>Names: {property.pets_and_habits.names.join(', ')}</Text>
              )}
            </View>
          )}

          {/* Policies */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Policies</Text>
            <View style={styles.policyItem}>
              <Icon name="calendar-outline" size={20} color="#666" />
              <Text style={styles.policyText}>
                Cancellation: {property.policies?.cancellation}
              </Text>
            </View>
            <View style={styles.policyItem}>
              <Icon name="book-outline" size={20} color="#666" />
              <Text style={styles.policyText}>
                Booking: {property.policies?.bookingType === 'request' ? 'Request to book' : 'Instant book'}
              </Text>
            </View>
          </View>

          {/* Safety */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Safety</Text>
            <View style={styles.safetyItem}>
              <Icon 
                name={property.safety?.exteriorCamera ? 'videocam-outline' : 'videocam-off-outline'} 
                size={20} 
                color="#666" 
              />
              <Text style={styles.safetyText}>
                Exterior camera: {property.safety?.exteriorCamera ? 'Yes' : 'No'}
              </Text>
            </View>
            <View style={styles.safetyItem}>
              <Icon 
                name={property.safety?.noiseMonitor ? 'volume-high-outline' : 'volume-mute-outline'} 
                size={20} 
                color="#666" 
              />
              <Text style={styles.safetyText}>
                Noise monitor: {property.safety?.noiseMonitor ? 'Yes' : 'No'}
              </Text>
            </View>
            <View style={styles.safetyItem}>
              <Icon 
                name={property.safety?.weapons ? 'warning-outline' : 'shield-checkmark-outline'} 
                size={20} 
                color="#666" 
              />
              <Text style={styles.safetyText}>
                Weapons: {property.safety?.weapons ? 'Allowed' : 'Not allowed'}
              </Text>
            </View>
          </View>

          {/* Comments Section with Dummy Data */}
          <CommentsSection />

          {/* Bottom Padding for Buttons */}
          <View style={styles.bottomPadding} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fixedBackBtn: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fixedNextBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: '#FF385C',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 80,
  },
  galleryContainer: {
    height: 300,
  },
  galleryImage: {
    width: width,
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  titleSection: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 16,
  },
  propertyType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  propertyName: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF385C',
  },
  hostSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 16,
  },
  hostAvatar: {
    marginRight: 12,
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hostAvatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  hostInfo: {
    flex: 1,
  },
  hostName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  hostDetails: {
    fontSize: 14,
    color: '#666',
  },
  locationSection: {
    marginBottom: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  locationDetails: {
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  locationLabel: {
    fontWeight: '500',
    color: '#666',
  },
  nearbySection: {
    marginTop: 8,
  },
  nearbyTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  nearbyList: {
    gap: 6,
  },
  nearbyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nearbyText: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginBottom: 12,
  },
  highlights: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 4,
  },
  highlightText: {
    fontSize: 12,
    color: '#666',
  },
  roomsContainer: {
    flexDirection: 'row',
    paddingRight: 16,
  },
  roomCard: {
    width: 280,
    marginRight: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  roomName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  roomImagesContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  roomImageWrapper: {
    flex: 1,
    position: 'relative',
  },
  roomImage: {
    width: '100%',
    height: 90,
    borderRadius: 8,
  },
  imageLabel: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  imageLabelText: {
    color: '#fff',
    fontSize: 10,
  },
  bedsInfo: {
    marginBottom: 8,
  },
  bedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  bedText: {
    fontSize: 14,
    color: '#666',
  },
  bathroomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  bathroomText: {
    fontSize: 14,
    color: '#666',
  },
  extraMattress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  extraMattressText: {
    fontSize: 12,
    color: '#FF385C',
  },
  roomFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#666',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 14,
    color: '#333',
  },
  serviceCard: {
    width: 150,
    marginRight: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FF385C',
    borderRadius: 10,
    backgroundColor: '#fff1f3',
    position: 'relative',
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  servicePrice: {
    fontSize: 14,
    color: '#FF385C',
    fontWeight: '600',
    marginBottom: 6,
  },
  serviceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  serviceBadgeText: {
    fontSize: 12,
    color: '#FF385C',
    fontWeight: '500',
  },
  habitsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  habitText: {
    fontSize: 14,
    color: '#666',
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  policyText: {
    fontSize: 14,
    color: '#333',
  },
  safetyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  safetyText: {
    fontSize: 14,
    color: '#333',
  },
  petItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },
  petText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  petDetail: {
    fontSize: 14,
    color: '#666',
    marginLeft: 32,
    marginBottom: 2,
  },
  // Comments Styles
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  commentItem: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  commentUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    overflow: 'hidden',
  },
  commentAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentUserDetails: {
    flex: 1,
  },
  commentUserName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  commentDate: {
    fontSize: 12,
    color: '#666',
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginBottom: 8,
  },
  commentRating: {
    flexDirection: 'row',
    gap: 2,
  },
  showAllCommentsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 8,
    gap: 4,
  },
  showAllCommentsText: {
    fontSize: 14,
    color: '#FF385C',
    fontWeight: '500',
  },
  bottomPadding: {
    height: 60,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#FF385C',
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PropertyDetailScreen;