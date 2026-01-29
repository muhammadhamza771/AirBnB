import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  ScrollView,
  SafeAreaView 
} from 'react-native';

const AddressScreen = ({navigation}) => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepText}>Step 6 of 13</Text>
        <Text style={styles.title}>Enter your address</Text>
        <Text style={styles.subtitle}>
          Your address is only shared with guests after they've booked.
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <TouchableOpacity style={styles.locationButton}>
            <Text style={styles.locationButtonText}>Use my current location</Text>
            <Text style={styles.chevron}>&gt;</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.section}>
          <Text style={styles.inputLabel}>Full Address / Street</Text>
          <TextInput
            style={styles.input}
            placeholder="-"
            placeholderTextColor="#717171"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.inputLabel}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="-"
            placeholderTextColor="#717171"
            value={city}
            onChangeText={setCity}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.inputLabel}>Country</Text>
          <TextInput
            style={styles.input}
            placeholder="-"
            placeholderTextColor="#717171"
            value={country}
            onChangeText={setCountry}
          />
        </View>

        <View style={styles.mapPlaceholder}>
          <View style={styles.mapHeader}>
            <Text style={styles.mapText}>MAP SIMULATION</Text>
          </View>
          <View style={styles.mapContent}>
            <Text style={styles.mapPlaceholderText}>Map would appear here</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('PropertyImageUpload')}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  stepText: {
    fontSize: 12,
    color: '#717171',
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#717171',
    lineHeight: 18,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 16,
  },
  locationButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#222222',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  locationButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
  },
  chevron: {
    fontSize: 18,
    color: '#222222',
    fontWeight: '300',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#EBEBEB',
  },
  dividerText: {
    paddingHorizontal: 12,
    fontSize: 12,
    color: '#717171',
    fontWeight: '500',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#222222',
  },
  mapPlaceholder: {
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 24,
    overflow: 'hidden',
  },
  mapHeader: {
    backgroundColor: '#F7F7F7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  mapText: {
    fontSize: 12,
    color: '#717171',
    fontWeight: '500',
    textAlign: 'center',
  },
  mapContent: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
  },
  mapPlaceholderText: {
    fontSize: 14,
    color: '#717171',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
    backgroundColor: '#fff',
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
   
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
  },
  nextButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: '#f60c0c',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default AddressScreen;