import React, { useState } from 'react';
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
import Icon from 'react-native-vector-icons/MaterialIcons'; // For location icon

const AddressScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postcode, setPostcode] = useState('');
  const [country, setCountry] = useState('');

  const parseAddress = (addr) => {
    const street = [addr.road, addr.neighbourhood].filter(Boolean).join(', ');
    const city = addr.city || addr.town || addr.village || addr.county || 'Rawalpindi';
    const state = addr.state || '';
    const postcode = addr.postcode || '';
    const country = addr.country || 'Pakistan';
    return { street, city, state, postcode, country };
  };

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
      const parsed = parseAddress(addr);

      setStreet(parsed.street);
      setCity('Rawalpindi');
      setState(parsed.state);
      setPostcode(parsed.postcode);
      setCountry(parsed.country);
    } catch (err) {
      console.log('Reverse geocode error:', err);
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
          console.log(err);
          Alert.alert('Error', 'Unable to get location');
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000 }
      );
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const goNext = () => {
    if (!location) {
      Alert.alert('Please select your location first');
      return;
    }

    navigation.navigate('PropertyImageUpload', {
      latitude: location.latitude,
      longitude: location.longitude,
      street,
      city,
      state,
      postcode,
      country,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Enter your address</Text>
          <Text style={styles.subtitle}>
            Your address is only shared with guests after they've booked.
          </Text>
        </View>

        <View style={styles.content}>
          <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
            <Icon name="location-on" size={24} color="#FF385C" />
            <Text style={styles.locationButtonText}>Use my current location</Text>
            {loading && <ActivityIndicator style={{ marginLeft: 10 }} />}
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            value={street}
            onChangeText={setStreet}
            placeholder="Street / Address"
          />
          <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="City" />
          <TextInput style={styles.input} value={country} onChangeText={setCountry} placeholder="Country" />

          {location && (
            <MapView
              style={styles.map}
              region={location}
              showsUserLocation={true}
              onPress={(e) => {
                const { latitude, longitude } = e.nativeEvent.coordinate;
                setLocation({ ...location, latitude, longitude });
                reverseGeocode(latitude, longitude);
              }}
            >
              <Marker
                coordinate={location}
                draggable
                onDragEnd={(e) => {
                  const { latitude, longitude } = e.nativeEvent.coordinate;
                  setLocation({ ...location, latitude, longitude });
                  reverseGeocode(latitude, longitude);
                }}
              />
            </MapView>
          )}

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
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 22, fontWeight: '700', color: '#111' },
  subtitle: { fontSize: 14, color: '#777', marginTop: 4 },

  content: { flex: 1, padding: 20 },

  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    marginBottom: 16,
  },
  locationButtonText: { fontSize: 16, fontWeight: '600', color: '#111', marginLeft: 8 },

  input: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    backgroundColor: '#F7F7F7',
    fontSize: 16,
  },

  map: { height: 200, borderRadius: 12, marginBottom: 20 },

  footer: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 },

  back: { fontSize: 16, textDecorationLine: 'underline', color: '#111' },

  nextBtn: { backgroundColor: '#FF385C', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 12 },
  nextText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
