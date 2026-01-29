// AmenitiesScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const AmenitiesScreen = ({ navigation, route }) => {

  // ✅ CORRECT: get previous data
  const prevData = route?.params?.data || {};

  const [selectedAmenities, setSelectedAmenities] = useState(
    prevData.amenities || []
  );

  const amenitiesList = [
    { id: 'wifi', name: 'Wi-Fi', icon: 'wifi-outline' },
    { id: 'ac', name: 'Air Conditioning', icon: 'snow-outline' },
    { id: 'heating', name: 'Heating', icon: 'thermometer-outline' },
    { id: 'kitchen', name: 'Kitchen', icon: 'restaurant-outline' },
    { id: 'washing', name: 'Washing Machine', icon: 'water-outline' },
    { id: 'parking', name: 'Parking', icon: 'car-outline' },
    { id: 'tv', name: 'TV', icon: 'tv-outline' },
    { id: 'hotwater', name: 'Hot Water', icon: 'flame-outline' },
    { id: 'iron', name: 'Iron', icon: 'shirt-outline' },
    { id: 'workspace', name: 'Workspace', icon: 'desktop-outline' },
    { id: 'fridge', name: 'Refrigerator', icon: 'ice-cream-outline' },
    { id: 'microwave', name: 'Microwave', icon: 'nuclear-outline' },
    { id: 'elevator', name: 'Elevator', icon: 'business-outline' },
    { id: 'balcony', name: 'Balcony', icon: 'home-outline' },
    { id: 'garden', name: 'Garden', icon: 'leaf-outline' },
    { id: 'security', name: 'Security Camera', icon: 'camera-outline' },
    { id: 'fire', name: 'Fire Extinguisher', icon: 'flame-outline' },
    { id: 'firstaid', name: 'First Aid Kit', icon: 'medkit-outline' },
    { id: 'power', name: 'Power Backup', icon: 'flash-outline' },
    { id: 'pet', name: 'Pet Friendly', icon: 'paw-outline' },
  ];

  const toggleAmenity = (item) => {
    if (selectedAmenities.includes(item.id)) {
      setSelectedAmenities(prev =>
        prev.filter(a => a !== item.id)
      );
    } else {
      setSelectedAmenities(prev => [...prev, item.id]);
    }
  };

  const handleNext = () => {
    
    const finalData = {
      ...prevData,
      amenities: selectedAmenities,
    };

    
    Alert.alert(
      'Property Data',
      JSON.stringify(finalData, null, 2)
    );

   
    navigation.navigate('AddDiscountsScreen', {
      data: finalData,
    });
  };

  const renderAmenityCard = ({ item }) => {
    const isSelected = selectedAmenities.includes(item.id);
    return (
      <TouchableOpacity
        style={[styles.amenityCard, isSelected && styles.selectedCard]}
        onPress={() => toggleAmenity(item)}
      >
        <Icon
          name={item.icon}
          size={24}
          color={isSelected ? '#FFF' : '#222'}
        />
        <Text style={[styles.amenityText, isSelected && styles.selectedText]}>
          {item.name}
        </Text>
        {isSelected && (
          <Icon
            name="checkmark-circle"
            size={20}
            color="#FFF"
            style={{ position: 'absolute', top: 8, right: 8 }}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <ScrollView>
        <Text style={styles.title}>Tell guests what your place offers</Text>

        <FlatList
          data={amenitiesList}
          renderItem={renderAmenityCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={styles.grid}
        />
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.nextButton,
            selectedAmenities.length === 0 && styles.disabled,
          ]}
          onPress={handleNext}
          disabled={selectedAmenities.length === 0}
        >
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AmenitiesScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', padding: 20 },
  grid: { paddingHorizontal: 16 },
  amenityCard: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  selectedCard: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  amenityText: { marginTop: 8, color: '#222' },
  selectedText: { color: '#fff' },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  backText: { fontSize: 16 },
  nextButton: {
    backgroundColor: '#FF385C',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 8,
  },
  disabled: { backgroundColor: '#ccc' },
  nextText: { color: '#fff', fontWeight: 'bold' },
});
