import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { PropertyContext } from '../../../context/PropertyContext';

const PROPERTY_TYPES = [
  { id: 'house', label: 'House', icon: '🏠' },
  { id: 'apartment', label: 'Apartment', icon: '🏢' },
  { id: 'villa', label: 'Villa', icon: '🏬' },
];

const Step1PropertyTypeScreen = ({ navigation, route }) => {
  const { propertyData, updatePropertyData } = useContext(PropertyContext);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    // Check route params first
    if (route.params?.propertyType) {
      const propertyType = route.params.propertyType;
      const found = PROPERTY_TYPES.find(
        item => item.label.toLowerCase() === propertyType.toLowerCase()
      );
      if (found) {
        setSelected(found);
        updatePropertyData('propertyType', found.label);
        return;
      }
    }
    // Fallback to context
    if (propertyData?.propertyType) {
      const propertyType = propertyData.propertyType;
      const found = PROPERTY_TYPES.find(
        item => item.label.toLowerCase() === propertyType.toLowerCase()
      );
      if (found) setSelected(found);
    }
  }, [route.params?.propertyType, propertyData?.propertyType]);

  const handleNext = () => {
    if (!selected) return;
    updatePropertyData('propertyType', selected.label);
    navigation.navigate('Step2PropertyType', { 
      isEditing: route.params?.isEditing || false 
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* ===== HEADER ===== */}
      <View style={styles.header}>
       
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>
            {route.params?.isEditing ? 'Edit Property Type' : 'Select Property Type'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {route.params?.isEditing 
             }
          </Text>
        </View>
      </View>

      {/* ===== PROPERTY TYPE LIST ===== */}
      <View style={styles.container}>
        <FlatList
          data={PROPERTY_TYPES}
          numColumns={2}
          keyExtractor={item => item.id}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => {
            const isSelected = selected?.id === item.id;
            return (
              <TouchableOpacity
                style={[styles.card, isSelected && styles.selectedCard]}
                onPress={() => setSelected(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.icon}>{item.icon}</Text>
                <Text style={styles.label}>{item.label}</Text>
              </TouchableOpacity>
            );
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>

      {/* ===== FOOTER BUTTONS ===== */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.nextButton, !selected && styles.disabledButton]}
          disabled={!selected}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {route.params?.isEditing ? 'Update & Continue' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Step1PropertyTypeScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },

// ===== HEADER =====
header: { 
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingVertical: 12,
  backgroundColor: '#FF385C',       // <-- header color
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
headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },       // <-- white text
headerSubtitle: { fontSize: 14, color: '#FFDDE0', marginTop: 2 },     // <-- soft pink subtitle
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 24 },
  listContent: { paddingBottom: 20 },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 16 },
  card: { 
    width: '48%', 
    backgroundColor: '#fff', 
    borderWidth: 1.5, 
    borderColor: '#CCC', 
    borderRadius: 12, 
    padding: 20, 
    alignItems: 'center' 
  },
  selectedCard: { borderColor: '#FF385C', backgroundColor: '#F7F7F7' },
  icon: { fontSize: 32, marginBottom: 12 },
  label: { fontSize: 16, fontWeight: '600', color: '#222', textAlign: 'center' },

  footer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingVertical: 16, 
    borderTopWidth: 1, 
    borderTopColor: '#EBEBEB', 
    backgroundColor: '#fff' 
  },
  backButton: { paddingVertical: 12, paddingHorizontal: 24 },
  backButtonText: { fontSize: 16, fontWeight: '600', color: '#222' },
  nextButton: { 
    backgroundColor: '#FF385C', 
    paddingHorizontal: 24, 
    paddingVertical: 12, 
    borderRadius: 8, 
    minWidth: 100, 
    alignItems: 'center' 
  },
  disabledButton: { backgroundColor: '#CCC' },
  nextButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});