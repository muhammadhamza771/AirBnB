import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { PropertyContext } from '../../../context/PropertyContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const AmenitiesScreen = ({ navigation }) => {
  const { propertyData, updatePropertyData } = useContext(PropertyContext);

  // ✅ Load existing amenities from context
  const [selectedAmenities, setSelectedAmenities] = useState(
    propertyData?.amenities || []
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
    { id: 'balcony', name: 'Balcony', icon: 'home-outline' },
    { id: 'garden', name: 'Garden', icon: 'leaf-outline' },
    { id: 'security', name: 'Security Camera', icon: 'camera-outline' },
    { id: 'fire', name: 'Fire Extinguisher', icon: 'flame-outline' },
    { id: 'firstaid', name: 'First Aid Kit', icon: 'medkit-outline' },
    { id: 'power', name: 'Power Backup', icon: 'flash-outline' },
  ];

  const toggleAmenity = (item) => {
    if (selectedAmenities.includes(item.id)) {
      setSelectedAmenities(prev => prev.filter(a => a !== item.id));
    } else {
      setSelectedAmenities(prev => [...prev, item.id]);
    }
  };

  const handleNext = () => {
    // ✅ Save selected amenities using context update function
    updatePropertyData('amenities', selectedAmenities);

    navigation.navigate('ServicesScreen');
  };

  const renderAmenityCard = ({ item }) => {
    const isSelected = selectedAmenities.includes(item.id);

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.card, isSelected && styles.selectedCard]}
        onPress={() => toggleAmenity(item)}
      >
        <Icon
          name={item.icon}
          size={26}
          color={isSelected ? '#fff' : '#333'}
        />
        <Text style={[styles.cardText, isSelected && styles.selectedText]}>
          {item.name}
        </Text>
        {isSelected && (
          <View style={styles.checkIcon}>
            <Icon name="checkmark" size={14} color="#000" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Tell guests what your place offers</Text>
       
      </View>

      <FlatList
        data={amenitiesList}
        renderItem={renderAmenityCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.nextButton, selectedAmenities.length === 0 && styles.disabled]}
          disabled={selectedAmenities.length === 0}
          onPress={handleNext}
        >
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AmenitiesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
    // ===== HEADER =====
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
  subtitle: { fontSize: 14, color: '#666', marginTop: 6 },
  list: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 100 },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 20,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 3,
  },
  selectedCard: { backgroundColor: '#ec1010', borderColor: '#f5eded' },
  cardText: { marginTop: 10, fontSize: 14, fontWeight: '500', color: '#333', textAlign: 'center' },
  selectedText: { color: '#fff' },
  checkIcon: { position: 'absolute', top: 10, right: 10, backgroundColor: '#fff', borderRadius: 10, padding: 3 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fff',
  },
  backText: { fontSize: 16, fontWeight: '500' },
  nextButton: { backgroundColor: '#FF385C', paddingHorizontal: 35, paddingVertical: 14, borderRadius: 10 },
  disabled: { backgroundColor: '#ccc' },
  nextText: { color: '#fff', fontWeight: '700' },
});