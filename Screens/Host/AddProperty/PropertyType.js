import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { PropertyContext } from '../../../context/PropertyContext';
import Icon from 'react-native-vector-icons/Ionicons';

const PLACE_TYPES = [
  { id: 'entire_place', label: 'Entire place', description: 'Guests have the whole place to themselves.', icon: '🏠' },
  { id: 'private_room', label: 'Private room', description: 'Guests have their own room and shared spaces.', icon: '🚪' },
  { id: 'shared_room', label: 'Shared room', description: 'Guests sleep in a shared room with others.', icon: '🛏️' },
];

const PlaceTypeScreen = ({ navigation }) => {
  const { propertyData, updatePropertyData } = useContext(PropertyContext);
  const [selected, setSelected] = useState(null);

  // ✅ Auto-select previously saved placeType
  useEffect(() => {
    if (!propertyData?.placeType) return;

    const savedType = propertyData.placeType.toLowerCase().trim();
    const found = PLACE_TYPES.find(item => item.label.toLowerCase() === savedType);
    if (found) setSelected(found);
  }, [propertyData]);

  const handleNext = () => {
    if (!selected) return;
    updatePropertyData('placeType', selected.label);
    navigation.navigate('GuestCapacity'); // Next step
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#FF385C" />

      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>What type of place will guests have?</Text>
        
        </View>
      </View>

      {/* ===== PLACE TYPE CARDS ===== */}
      <View style={styles.container}>
        {PLACE_TYPES.map(item => {
          const isSelected = selected?.id === item.id;

          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, isSelected && styles.selectedCard]}
              onPress={() => setSelected(item)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.label}</Text>
                <Text style={styles.cardDesc}>{item.description}</Text>
              </View>
              <Text style={styles.icon}>{item.icon}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ===== FOOTER ===== */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.nextBtn, !selected && { backgroundColor: '#ccc' }]}
          disabled={!selected}
          onPress={handleNext}
        >
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PlaceTypeScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },

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
  backIcon: { marginRight: 12 },
  headerTextContainer: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },
  headerSubtitle: { fontSize: 14, color: '#FFDDE0', marginTop: 2 },

  container: { flex: 1, padding: 16, paddingTop: 20 },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  selectedCard: { borderColor: '#FF385C', backgroundColor: '#f9f9f9' },
  cardTitle: { fontSize: 18, fontWeight: '600' },
  cardDesc: { fontSize: 14, color: '#666', marginTop: 4 },
  icon: { fontSize: 36, marginLeft: 10 },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  back: { fontSize: 16, textDecorationLine: 'underline', color: '#222' },
  nextBtn: { backgroundColor: '#FF385C', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 10 },
  nextText: { color: '#fff', fontWeight: '700' },
});