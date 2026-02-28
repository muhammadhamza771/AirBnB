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
  const { updateMultiple } = useContext(PropertyContext);

  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [newPlace, setNewPlace] = useState('');

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

      setStreet(addr.road || '');
      setCity(addr.city || addr.town || '');
      setCountry(addr.country || '');
    } catch (err) {
      Alert.alert('Error', 'Unable to fetch address');
    }
  };

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
        { enableHighAccuracy: true }
      );
    } catch (err) {
      setLoading(false);
    }
  };

  const addPlace = () => {
    if (!newPlace.trim()) return;
    setNearbyPlaces([...nearbyPlaces, newPlace.trim()]);
    setNewPlace('');
  };

  const removePlace = (index) => {
    const updated = nearbyPlaces.filter((_, i) => i !== index);
    setNearbyPlaces(updated);
  };

  const goNext = () => {
    if (!street || !city || !country) {
      Alert.alert('Error', 'Please complete address');
      return;
    }

    updateMultiple({
      address: {
        street,
        city,
        country,
      },
      location: location
        ? {
            latitude: location.latitude,
            longitude: location.longitude,
          }
        : null,
      nearbyPlaces,
    });

    navigation.navigate('PetsStepScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Enter your address</Text>
          <Text style={styles.subtitle}>
            Your address is only shared after booking.
          </Text>
        </View>

        <View style={styles.content}>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={getCurrentLocation}
          >
            <Icon name="location-on" size={22} color="#FF385C" />
            <Text style={styles.locationText}>
              Use my current location
            </Text>
            {loading && <ActivityIndicator style={{ marginLeft: 10 }} />}
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Street"
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
            <MapView style={styles.map} region={location} showsUserLocation>
              <Marker coordinate={location} />
            </MapView>
          )}

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
                <Text style={styles.placeText}>{place}</Text>
                <TouchableOpacity onPress={() => removePlace(index)}>
                  <Icon name="delete" size={20} color="#FF385C" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.back}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.nextBtn} onPress={goNext}>
              <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: { padding: 20, borderBottomWidth: 1, borderColor: '#eee' },
  title: { fontSize: 22, fontWeight: '700', color: '#111' },
  subtitle: { fontSize: 14, color: '#777', marginTop: 4 },

  content: { padding: 20 },

  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
  },
  locationText: { marginLeft: 8, fontWeight: '600', fontSize: 15 },

  input: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    backgroundColor: '#F9F9F9',
  },

  map: {
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  placeText: { fontSize: 15 },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  back: { textDecorationLine: 'underline', fontSize: 16 },

  nextBtn: {
    backgroundColor: '#FF385C',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 10,
  },
  nextText: { color: '#fff', fontWeight: '700' },
});
