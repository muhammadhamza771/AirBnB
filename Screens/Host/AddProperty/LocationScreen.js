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

const AddressScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postcode, setPostcode] = useState('');
  const [country, setCountry] = useState('');

  // Parse address from Nominatim response
  const parseAddress = (addr) => {
    const street = [addr.road, addr.neighbourhood].filter(Boolean).join(', ');
    const city = addr.city || addr.town || addr.village || addr.county || 'Rawalpindi';
    const state = addr.state || '';
    const postcode = addr.postcode || '';
    const country = addr.country || 'Pakistan';
    return { street, city, state, postcode, country };
  };

  // Reverse geocode
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

  // Get current location
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

  // Next button
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
        </View>

        <View style={styles.content}>
          <TouchableOpacity style={styles.button} onPress={getCurrentLocation}>
            <Text style={styles.buttonText}>Use my current location</Text>
            {loading && <ActivityIndicator style={{ marginLeft: 10 }} />}
          </TouchableOpacity>

          <TextInput style={styles.input} value={street} onChangeText={setStreet} placeholder="Street / Address" />
          <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="City" />
          <TextInput style={styles.input} value={state} onChangeText={setState} placeholder="State" />
          <TextInput style={styles.input} value={postcode} onChangeText={setPostcode} placeholder="Postcode" />
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
  title: { fontSize: 22, fontWeight: '600', color: '#111' },
  content: { flex: 1, padding: 20 },

  button: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#eee', borderRadius: 8, marginBottom: 16 },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#111' },

  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12, backgroundColor: '#f7f7f7' },

  map: { height: 220, borderRadius: 12, marginBottom: 20 },

  footer: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 15 },

  back: { fontSize: 16, textDecorationLine: 'underline' },

  nextBtn: { backgroundColor: '#FF385C', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 10 },
  nextText: { color: '#fff', fontWeight: '700' },
});
