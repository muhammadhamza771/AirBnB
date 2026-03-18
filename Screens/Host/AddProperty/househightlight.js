import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Dimensions,
  FlatList,
} from 'react-native';
import { PropertyContext } from '../../../context/PropertyContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

const HIGHLIGHTS = [
  { id: 'peaceful', label: 'Peaceful', icon: '🌿' },
  { id: 'unique', label: 'Unique', icon: '✨' },
  { id: 'family', label: 'Family-friendly', icon: '👨‍👩‍👧' },
  { id: 'stylish', label: 'Stylish', icon: '💎' },
  { id: 'central', label: 'Central', icon: '📍' },
  { id: 'spacious', label: 'Spacious', icon: '🏛️' },
];

const HouseHighlights = ({ navigation }) => {
  const { propertyData, updatePropertyData } = useContext(PropertyContext);

  // ✅ Load existing highlights properly
  const [selected, setSelected] = useState(
    propertyData?.description_data?.highlights || []
  );

  const toggleHighlight = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(item => item !== id));
    } else {
      if (selected.length < 2) {
        setSelected([...selected, id]);
      } else {
        Alert.alert('Limit reached', 'You can select only 2 highlights');
      }
    }
  };

  const handleNext = () => {
    if (selected.length === 0) {
      Alert.alert('Required', 'Select at least one highlight');
      return;
    }

    // ✅ Use updatePropertyData instead of setPropertyData
    updatePropertyData('description_data', {
      ...propertyData.description_data,
      highlights: selected,
    });

    navigation.navigate('AmenitiesScreen');
  };

  const renderItem = ({ item }) => {
    const isSelected = selected.includes(item.id);

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.card,
          isSelected && styles.selectedCard,
        ]}
        onPress={() => toggleHighlight(item.id)}
      >
        <Text style={styles.icon}>{item.icon}</Text>
        <Text style={[
          styles.label,
          isSelected && styles.selectedText
        ]}>
          {item.label}
        </Text>

        {isSelected && (
          <View style={styles.checkContainer}>
            <Text style={styles.check}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose highlights</Text>
      
      </View>

      <FlatList
        data={HIGHLIGHTS}
        renderItem={renderItem}
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
          style={[
            styles.nextBtn,
            selected.length === 0 && styles.disabledBtn,
          ]}
          disabled={selected.length === 0}
          onPress={handleNext}
        >
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HouseHighlights;

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
  subtitle: { fontSize: 14, color: '#666', marginTop: 8 },
  list: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 120 },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 25,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 3,
  },
  selectedCard: { backgroundColor: '#eb0c0c', borderColor: '#ebe1e1' },
  icon: { fontSize: 34, marginBottom: 12 },
  label: { fontSize: 15, fontWeight: '600', color: '#333', textAlign: 'center' },
  selectedText: { color: '#fff' },
  checkContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: { fontSize: 14, fontWeight: 'bold', color: '#000' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  backText: { fontSize: 16, fontWeight: '500' },
  nextBtn: {
    backgroundColor: '#FF385C',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 10,
  },
  disabledBtn: { backgroundColor: '#ccc' },
  nextText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});