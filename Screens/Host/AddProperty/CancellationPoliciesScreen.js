import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { PropertyContext } from '../../../context/PropertyContext';

const CancellationPoliciesScreen = ({ navigation }) => {
  const { propertyData, updateMultiple } = useContext(PropertyContext);

  // Initialize from context if already selected
  const existingCancellation = propertyData?.policies?.cancellation || null;
  const [selected, setSelected] = useState(existingCancellation);

  const policies = [
    {
      title: 'Flexible',
      description: 'Full refund if cancelled 24 hours before check-in.',
    },
    {
      title: 'Moderate',
      description: 'Free cancellation up to 5 days before check-in.',
    },
    {
      title: 'Strict',
      description: 'Full refund within 48 hours of booking only.',
    },
  ];

  const handleNext = () => {
    if (!selected) return;

    updateMultiple({
      policies: {
        ...propertyData.policies,
        cancellation: selected,
      },
    });

    navigation.navigate('BookingTypeScreen');
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* ===== HEADER ===== */}
      <View style={styles.header}>
    
        <Text style={styles.headerTitle}>Cancellation Policy</Text>
        <View style={{ width: 50 }} /> {/* placeholder to balance back button */}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Choose your policy</Text>

        {policies.map((item, index) => {
          const isSelected = selected === item.title;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.card, isSelected && styles.selectedCard]}
              onPress={() => setSelected(item.title)}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, isSelected && styles.selectedText]}>
                  {item.title}
                </Text>
                {isSelected && <Icon name="checkmark-circle" size={22} color="#007BFF" />}
              </View>

              <Text style={styles.description}>{item.description}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          style={[styles.nextBtn, !selected && styles.disabledBtn]}
          disabled={!selected}
        >
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CancellationPoliciesScreen;

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
  headerBack: { color: '#fff', fontWeight: '700', fontSize: 16 },
  headerTitle: { flex: 1, textAlign: 'center', color: '#fff', fontWeight: '700', fontSize: 18 },

  content: { padding: 20, paddingBottom: 100 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },

  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  selectedCard: { borderColor: '#007BFF', backgroundColor: '#F0F8FF' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  description: { fontSize: 13, color: '#555', marginTop: 8 },
  selectedText: { color: '#007BFF' },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  backBtn: { paddingVertical: 12, paddingHorizontal: 25, borderColor: '#ccc' },
  backText: { fontSize: 14, fontWeight: '600' },
  nextBtn: { backgroundColor: '#eb1123', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8 },
  disabledBtn: { backgroundColor: '#A0C4FF' },
  nextText: { color: '#fff', fontWeight: '600' },
});