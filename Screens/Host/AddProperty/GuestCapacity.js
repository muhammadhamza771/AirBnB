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

const GuestCounter = ({ label, count, setCount, subtitle }) => (
  <View style={styles.counterRow}>
    <View>
      <Text style={styles.counterLabel}>{label}</Text>
      {subtitle && <Text style={styles.counterSubtitle}>{subtitle}</Text>}
    </View>

    <View style={styles.counterControls}>
      <TouchableOpacity
        style={styles.controlBtn}
        onPress={() => setCount(Math.max(0, count - 1))}
      >
        <Text style={styles.controlText}>-</Text>
      </TouchableOpacity>

      <Text style={styles.countText}>{count}</Text>

      <TouchableOpacity
        style={styles.controlBtn}
        onPress={() => setCount(count + 1)}
      >
        <Text style={styles.controlText}>+</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const GuestCapacity = ({ navigation }) => {
  const { propertyData, updatePropertyData } = useContext(PropertyContext);

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  // ✅ Auto-sync for editing existing property
  useEffect(() => {
    if (!propertyData.guests) return;

    setAdults(propertyData.guests.adults ?? 1);
    setChildren(propertyData.guests.children ?? 0);
    setInfants(propertyData.guests.infants ?? 0);
  }, [propertyData.guests]);

  const handleNext = () => {
    updatePropertyData('guests', { adults, children, infants });
    navigation.navigate('RoomsScreen');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#FF385C" />

      {/* ===== HEADER ===== */}
      <View style={styles.header}>
     
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>How many guests can stay?</Text>
        
        </View>
      </View>

      {/* ===== GUEST COUNTERS ===== */}
      <View style={styles.container}>
        <GuestCounter label="Adults" count={adults} setCount={setAdults} />
        <GuestCounter label="Children" subtitle="Ages 2–12" count={children} setCount={setChildren} />
        <GuestCounter label="Infants" subtitle="Under 2" count={infants} setCount={setInfants} />
      </View>

      {/* ===== FOOTER ===== */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default GuestCapacity;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },

  // ===== HEADER =====
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  headerSubtitle: { fontSize: 14, color: '#FFDDE0', marginTop: 2 },

  container: { flex: 1, padding: 20, paddingTop: 30 },
  counterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15 },
  counterLabel: { fontSize: 16, fontWeight: '600' },
  counterSubtitle: { fontSize: 14, color: '#666' },
  counterControls: { flexDirection: 'row', alignItems: 'center' },
  controlBtn: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: '#ccc', alignItems: 'center', justifyContent: 'center' },
  controlText: { fontSize: 18 },
  countText: { marginHorizontal: 15, fontSize: 18, fontWeight: '600' },

  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 15 },
  back: { fontSize: 16, textDecorationLine: 'underline', color: '#222' },
  nextBtn: { backgroundColor: '#FF385C', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 10 },
  nextText: { color: '#fff', fontWeight: '700' },
});