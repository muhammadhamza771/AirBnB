import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { PropertyContext } from '../../../context/PropertyContext';

const AddressScreen = ({ navigation }) => {
  const { updatePropertyData } = useContext(PropertyContext);

  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [newPlace, setNewPlace] = useState('');

  // Reverse geocode to get street, city, country
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        {
          headers: {
            'User-Agent': 'AirbnbReplica/1.0',
            'Accept-Language': 'en',
          },
        }
      );

      const addr = res.data.address || {};
      setStreet(addr.road || addr.street || addr.suburb || '');
      setCity(addr.city || addr.town || addr.village || '');
      setCountry(addr.country || '');
    } catch (err) {
      Alert.alert('Error', 'Unable to fetch address');
    }
  };

  // Get current user location
  const getCurrentLocation = async () => {
    setLoading(true);

    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission denied');
          setLoading(false);
          return;
        }
      }

      Geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const region = {
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          setLocation(region);
          await reverseGeocode(latitude, longitude);
          setLoading(false);
        },
        (err) => {
          Alert.alert('Location error', err.message);
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 20000 }
      );
    } catch (err) {
      setLoading(false);
    }
  };

  // Add nearby place
  const addPlace = () => {
    if (!newPlace.trim()) return;
    setNearbyPlaces([...nearbyPlaces, newPlace.trim()]);
    setNewPlace('');
  };

  // Remove nearby place
  const removePlace = (index) => {
    const updated = nearbyPlaces.filter((_, i) => i !== index);
    setNearbyPlaces(updated);
  };

  // Save and go next
  const goNext = () => {
    if (!street || !city || !country) {
      Alert.alert('Error', 'Please complete address');
      return;
    }

    updatePropertyData('location', {
      country,
      city,
      area: street,
      address: street,
      mapPin: '',
      useCurrent: !!location,
      nearbyPlaces,
      latitude: location?.latitude || null,
      longitude: location?.longitude || null,
      mapImageUrl: '',
    });

    navigation.navigate('PetsStepScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/* Scrollable content */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Enter your address</Text>
          
          </View>

          <View style={styles.content}>
            <TouchableOpacity
              style={styles.locationButton}
              onPress={getCurrentLocation}
            >
              <Icon name="location-on" size={22} color="#FF385C" />
              <Text style={styles.locationText}>Use my current location</Text>
              {loading && <ActivityIndicator style={{ marginLeft: 10 }} />}
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Street / Area"
              value={street}
              onChangeText={setStreet}
            />
            <TextInput
              style={styles.input}
              placeholder="City"
              value={city}
              onChangeText={setCity}
            />
            <TextInput
              style={styles.input}
              placeholder="Country"
              value={country}
              onChangeText={setCountry}
            />

            {location && (
              <View style={styles.mapWrapper}>
                <MapView
                  style={styles.map}
                  region={location}
                  showsUserLocation={true}
                >
                  <Marker coordinate={location}>
                    <View style={styles.markerContainer}>
                      <View style={styles.markerDot} />
                    </View>
                  </Marker>
                </MapView>
                <Text style={styles.attribution}>© OpenStreetMap</Text>
              </View>
            )}

            {/* Nearby places */}
            <View style={styles.nearbySection}>
              <Text style={styles.sectionTitle}>Nearby Places</Text>
              <View style={styles.addRow}>
                <TextInput
                  style={styles.addInput}
                  placeholder="Add nearby place"
                  value={newPlace}
                  onChangeText={setNewPlace}
                />
                <TouchableOpacity style={styles.addBtn} onPress={addPlace}>
                  <Text style={styles.addBtnText}>Add</Text>
                </TouchableOpacity>
              </View>

              {nearbyPlaces.map((place, index) => (
                <View key={index} style={styles.placeItem}>
                  <Icon name="place" size={20} color="#FF385C" />
                  <Text style={styles.placeText}>{place}</Text>
                  <TouchableOpacity onPress={() => removePlace(index)}>
                    <Icon name="delete" size={20} color="#999" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Footer always visible */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.back}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.nextBtn} onPress={goNext}>
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingBottom: 120 }, // space for footer
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FF385C',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  title: { fontSize: 20, fontWeight: '700', color: '#111' },
  subtitle: { fontSize: 14, color: '#777', marginTop: 4 },
  content: { padding: 20 },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  locationText: { marginLeft: 8, fontWeight: '600', fontSize: 15, flex: 1 },
  input: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    backgroundColor: '#F9F9F9',
  },
  mapWrapper: {
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  map: { flex: 1 },
  markerContainer: { alignItems: 'center', justifyContent: 'center' },
  markerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF385C',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  attribution: {
    position: 'absolute',
    bottom: 4,
    right: 8,
    fontSize: 10,
    color: '#666',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  nearbySection: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  addRow: { flexDirection: 'row', marginBottom: 10 },
  addInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#F9F9F9',
  },
  addBtn: {
    backgroundColor: '#FF385C',
    paddingHorizontal: 18,
    justifyContent: 'center',
    borderRadius: 10,
    marginLeft: 8,
  },
  addBtnText: { color: '#fff', fontWeight: '600' },
  placeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  placeText: { fontSize: 15, flex: 1, marginLeft: 8 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  back: { textDecorationLine: 'underline', fontSize: 16, color: '#666' },
  nextBtn: {
    backgroundColor: '#FF385C',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 10,
  },
  nextText: { color: '#fff', fontWeight: '700' },
});
