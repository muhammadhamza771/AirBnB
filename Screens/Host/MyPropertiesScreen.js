import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../context/AuthContext';
import { PropertyContext } from '../../context/PropertyContext';
import {
  getAllProperties,
  deleteProperty,
  updatePropertyStatus,
  BASE_URL
} from '../../BackendServices/Apiservices';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x200?text=No+Image';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function MyPropertiesScreen({ navigation }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const fadeAnim = useState(new Animated.Value(0))[0];

  const { user } = useContext(AuthContext) || {};
  const propertyContext = useContext(PropertyContext);
  const {
    setPropertyData,
    resetPropertyData,
    setIsEditing,
    setEditingPropertyId,
  } = propertyContext;

  useEffect(() => {
    fetchMyProperties();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchMyProperties = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'Please login first');
      navigation.navigate('Login');
      return;
    }
    try {
      setLoading(true);
      const allProperties = await getAllProperties();
      const userProperties = allProperties.filter(prop => prop.user_id === user.id);
      const sortedProperties = userProperties.sort((a, b) => {
        if (a.created_at && b.created_at) return new Date(b.created_at) - new Date(a.created_at);
        return b.id - a.id;
      });
      setProperties(sortedProperties);
      setImageErrors({});
    } catch (error) {
      Alert.alert('Error', 'Failed to load properties: ' + error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMyProperties();
  };

  const confirmDelete = (property) => {
    Alert.alert(
      'Delete listing?',
      `Permanently delete "${property.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => handleDelete(property.id) },
      ]
    );
  };

  const handleDelete = async (propertyId) => {
    try {
      setLoading(true);
      await deleteProperty(propertyId);
      setProperties(prev => prev.filter(p => p.id !== propertyId));
      Alert.alert('Success', 'Listing deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete listing');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED handleUpdate
  const handleUpdate = (propertyId) => {
    const propertyToEdit = properties.find(p => p.id === propertyId);
    
    if (!propertyToEdit) {
      Alert.alert('Error', 'Property not found');
      return;
    }

    console.log('========== EDITING PROPERTY ==========');
    console.log('Property ID:', propertyToEdit.id);
    console.log('Property Type:', propertyToEdit.propertyType);
    console.log('======================================');

    // Reset mat karo - IMPORTANT
    // resetPropertyData();
    
    setIsEditing(true);
    setEditingPropertyId(propertyToEdit.id);

    // Context mein save karo
    setPropertyData({
      id: propertyToEdit.id,
      name: propertyToEdit.name || '',
      propertyType: propertyToEdit.propertyType || '',
      structure: propertyToEdit.structure || '',
      placeType: propertyToEdit.placeType || '',
      status: propertyToEdit.status || 'active',
      isActive: propertyToEdit.isActive ?? true,
      image: propertyToEdit.image || null,
      guests: propertyToEdit.guests || { adults: 1, children: 0, infants: 0 },
      rooms: propertyToEdit.rooms || [],
      amenities: propertyToEdit.amenities || [],
      location: propertyToEdit.location || {
        country: '',
        city: '',
        area: '',
        address: '',
        mapPin: '',
        useCurrent: false,
        nearbyPlaces: [],
        latitude: null,
        longitude: null,
        mapImageUrl: '',
      },
      media: propertyToEdit.media || { coverImage: '', houseImages: [] },
      description_data: propertyToEdit.description_data || { title: '', highlights: [], text: '' },
      pets_and_habits: propertyToEdit.pets_and_habits || { allowed: false, habitsAllowed: false, names: [], habits: [] },
      policies: propertyToEdit.policies || { cancellation: '', bookingType: 'Booking Request' },
      pricing: propertyToEdit.pricing || { 
        basePrice: 0, 
        cleaningFee: 0, 
        serviceFee: 0, 
        discounts: { weekly: '', monthly: '', custom: '' }, 
        flexibleRates: {} 
      },
      safety: propertyToEdit.safety || { exteriorCamera: false, noiseMonitor: false, weapons: false },
      services: propertyToEdit.services || [],
      available_from: propertyToEdit.available_from || null,
      available_to: propertyToEdit.available_to || null,
      user_id: propertyToEdit.user_id || null,
      created_at: propertyToEdit.created_at || null,
      updated_at: propertyToEdit.updated_at || null,
    });

    // Navigate - Simple approach
    navigation.navigate('AddProperty', {
      screen: 'Step1Basic',
      params: {
        isEditing: true,
        propertyId: propertyToEdit.id,
        propertyType: propertyToEdit.propertyType
      }
    });
  };

  const handleToggleActive = async (property) => {
    try {
      const newStatus = !property.isActive;
      setProperties(prev => prev.map(p => p.id === property.id ? { ...p, isActive: newStatus } : p));
      const statusData = { isActive: newStatus, status: newStatus ? 'active' : 'inactive' };
      await updatePropertyStatus(property.id, statusData);
      Alert.alert('Success', `Property ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      setProperties(prev => prev.map(p => p.id === property.id ? { ...p, isActive: property.isActive } : p));
      Alert.alert('Error', 'Failed to update property status');
    }
  };

  const getCoverImageUrl = (propertyId, property) => {
    if (imageErrors[propertyId]) return PLACEHOLDER_IMAGE;
    const img = property.media?.coverImage || property.image || property.media?.houseImages?.[0];
    if (!img) return PLACEHOLDER_IMAGE;
    if (img.startsWith('http') || img.startsWith('data:image')) return img;
    return `${BASE_URL}${img}`;
  };

  const handleImageError = (propertyId) => {
    setImageErrors(prev => ({ ...prev, [propertyId]: true }));
  };

  const renderItem = ({ item }) => {
    const imageUrl = getCoverImageUrl(item.id, item);
    const imageCount = item.media?.houseImages?.length || 0;

    return (
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.image} onError={() => handleImageError(item.id)} />
          {imageCount > 0 && !imageErrors[item.id] && (
            <View style={styles.imageCountBadge}>
              <Icon name="images" size={14} color="#fff" />
              <Text style={styles.imageCountText}>{imageCount}</Text>
            </View>
          )}
          <View style={[styles.statusBadge, { backgroundColor: item.isActive ? '#00A699' : '#FF5A5F' }]}>
            <Text style={styles.statusText}>{item.isActive ? '● ACTIVE' : '○ INACTIVE'}</Text>
          </View>
        </View>

        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.price}>
              Rs{item.pricing?.basePrice || item.price || 0}
              <Text style={styles.perNight}>/night</Text>
            </Text>
          </View>

          <View style={styles.locationContainer}>
            <Icon name="location-outline" size={14} color="#767676" />
            <Text style={styles.location} numberOfLines={1}>
              {item.location?.city || 'No city'}, {item.location?.country || 'No country'}
            </Text>
          </View>

          <View style={styles.typeContainer}>
            <Icon name="home-outline" size={14} color="#767676" />
            <Text style={styles.typeText}>
              {item.propertyType || 'Property'} • {item.rooms?.length || 1} room{item.rooms?.length !== 1 ? 's' : ''}
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.actionBtn, styles.updateBtn]} 
              onPress={() => handleUpdate(item.id)} 
              activeOpacity={0.8}
            >
              <Icon name="pencil" size={18} color="#fff" />
              <Text style={styles.actionText}>Edit listing</Text>
            </TouchableOpacity>

            <View style={styles.quickActions}>
              <TouchableOpacity 
                style={[styles.quickAction, item.isActive ? styles.deactivateBtn : styles.activateBtn]} 
                onPress={() => handleToggleActive(item)}
              >
                <Icon name={item.isActive ? 'eye-off' : 'eye'} size={18} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.quickAction, styles.deleteBtn]} 
                onPress={() => confirmDelete(item)}
              >
                <Icon name="trash" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF385C" />
        <Text style={styles.loadingText}>Loading your listings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <View style={styles.header}>
  <View style={styles.headerRow}>
    <Text style={styles.headerTitle}>Your listings</Text>
    <Text style={styles.headerSubtitle}>
      {properties.length} {properties.length === 1 ? 'property' : 'properties'}
    </Text>
  </View>
  <TouchableOpacity 
    style={styles.headerIcon} 
    onPress={() => {
      resetPropertyData();
      navigation.navigate('AddProperty', { screen: 'Step1Basic' });
    }}
  >
    <Icon name="add-circle" size={28} color="#FF385C" />
  </TouchableOpacity>
</View>
        <TouchableOpacity 
          style={styles.headerIcon} 
          onPress={() => {
            resetPropertyData();
            navigation.navigate('AddProperty', { screen: 'Step1Basic' });
          }}
        >
          <Icon name="add-circle" size={32} color="#FF385C" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={properties}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={['#FF385C']} 
            tintColor="#FF385C" 
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },

  // ===== HEADER =====
// ===== HEADER =====
header: {
  paddingHorizontal: 16,
  paddingVertical: 8,       // smaller vertical padding
  backgroundColor: '#FF385C',
  borderBottomLeftRadius: 20,
  borderBottomRightRadius: 20,
  flexDirection: 'row',      // row layout
  justifyContent: 'space-between',
  alignItems: 'center',
  elevation: 4,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 6,
},

headerRow: {
  flexDirection: 'row',      // row for title + subtitle
  alignItems: 'center',
  gap: 8,                     // spacing between title & count
},

headerTitle: {
  fontSize: 18,               // smaller title
  fontWeight: '700',
  color: '#fff',
},

headerSubtitle: {
  fontSize: 12,               // smaller subtitle
  color: '#FFDDE0',
},

  // ===== LIST =====
  list: { padding: 16, paddingBottom: 32 },

  card: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    marginBottom: 20, 
    overflow: 'hidden', 
    width: SCREEN_WIDTH - 32, 
    alignSelf: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  imageContainer: { position: 'relative', height: SCREEN_WIDTH * 0.5 },
  image: { width: '100%', height: '100%', backgroundColor: '#F7F7F7' },
  imageCountBadge: { 
    position: 'absolute', 
    top: 12, 
    right: 12, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    borderRadius: 20, 
    gap: 6, 
    zIndex: 2 
  },
  imageCountText: { color: '#fff', fontSize: 13, fontWeight: '500' },
  statusBadge: { position: 'absolute', top: 12, left: 12, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, zIndex: 2 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },

  info: { padding: 16 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  name: { fontSize: 18, fontWeight: '600', color: '#222222', flex: 1, marginRight: 12 },
  price: { fontSize: 18, fontWeight: '700', color: '#FF385C' },
  perNight: { fontSize: 14, fontWeight: '400', color: '#767676' },

  locationContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 6 },
  location: { fontSize: 14, color: '#767676', flex: 1 },

  typeContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  typeText: { fontSize: 14, color: '#767676' },

  actions: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  actionBtn: { flex: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 8, gap: 8 },
  updateBtn: { backgroundColor: '#FF385C' },
  quickActions: { flex: 2, flexDirection: 'row', gap: 8 },
  quickAction: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 8 },
  activateBtn: { backgroundColor: '#00A699' },
  deactivateBtn: { backgroundColor: '#FFB400' },
  deleteBtn: { backgroundColor: '#FF5A5F' },
  actionText: { color: '#fff', fontWeight: '600', fontSize: 14 },

  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F6FA' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#767676' },
});