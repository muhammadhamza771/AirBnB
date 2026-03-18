import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { PropertyContext } from '../../../context/PropertyContext';

const PriceScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const isSmall = width < 360;
  const isTablet = width >= 768;

  const { propertyData, updateMultiple } = useContext(PropertyContext);

  const [basePrice, setBasePrice] = useState('1500');
  const [cleaningFee, setCleaningFee] = useState(0);
  const [selectedServices, setSelectedServices] = useState([]);
  const SERVICE_FEE_PERCENTAGE = 3;

  useEffect(() => {
    if (propertyData?.pricing) {
      setBasePrice(propertyData.pricing.basePrice?.toString() || '1500');
      setCleaningFee(propertyData.pricing.cleaningFee || 0);
    }

    if (propertyData?.services && propertyData.services.length > 0) {
      setSelectedServices(propertyData.services);
    }
  }, [propertyData]);

  const calculateEarnings = () => {
    const base = parseInt(basePrice) || 0;
    const servicesTotal = selectedServices.reduce((sum, service) => sum + (service.price || 0), 0);
    const total = base + servicesTotal + (parseInt(cleaningFee) || 0);
    const serviceFee = (total * SERVICE_FEE_PERCENTAGE) / 100;
    const earnings = total - serviceFee;
    return { base, servicesTotal, serviceFee, earnings };
  };

  const earnings = calculateEarnings();

  const adjustBasePrice = (type) => {
    let current = parseInt(basePrice) || 1500;
    if (type === 'plus') current += 300;
    if (type === 'minus') current -= 300;
    if (current < 300) current = 300;
    if (current > 10000) current = 10000;
    setBasePrice(current.toString());
  };

  const handleNext = () => {
    if (!basePrice || parseInt(basePrice) < 300) {
      Alert.alert('Required', 'Minimum base price is Rs 300');
      return;
    }

    updateMultiple({
      pricing: {
        basePrice: parseInt(basePrice),
        cleaningFee: parseInt(cleaningFee) || 0,
        serviceFee: earnings.serviceFee,
        discounts: propertyData?.pricing?.discounts || {
          weekly: '',
          monthly: '',
          custom: '',
        },
        flexibleRates: propertyData?.pricing?.flexibleRates || {},
      },
      services: selectedServices,
    });

    navigation.navigate('AddDiscountsScreen', {
      priceData: {
        basePrice,
        servicesTotal: earnings.servicesTotal,
        totalEarnings: earnings.earnings,
      },
    });
  };

  const styles = createStyles(width, height, isSmall, isTablet);

  return (
    <SafeAreaView style={styles.container}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        
        <Text style={styles.headerTitle}>Set Your Price</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Price your place</Text>
        <Text style={styles.subtitle}>Set a competitive price to attract more guests.</Text>

        {/* Base Price */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BASE PRICE PER NIGHT</Text>
          <View style={styles.control}>
            <TouchableOpacity style={styles.circleBtn} onPress={() => adjustBasePrice('minus')}>
              <Text style={styles.btnText}>−</Text>
            </TouchableOpacity>

            <View style={styles.priceBox}>
              <Text style={styles.currency}>Rs</Text>
              <Text style={styles.price}>{basePrice}</Text>
            </View>

            <TouchableOpacity style={styles.circleBtn} onPress={() => adjustBasePrice('plus')}>
              <Text style={styles.btnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Earnings Breakdown */}
        <View style={styles.earningsCard}>
          <Text style={styles.earnTitle}>Earnings Breakdown</Text>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Base price</Text>
            <Text style={styles.rowValue}>Rs {earnings.base}</Text>
          </View>

          {selectedServices.length > 0 && (
            <View style={styles.servicesList}>
              <Text style={styles.servicesSubtitle}>Added Services:</Text>
              {selectedServices.map((service, index) => (
                <View key={service.id || index} style={styles.serviceRow}>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceIcon}>{service.icon || '•'}</Text>
                    <Text style={styles.serviceName}>{service.name}</Text>
                  </View>
                  <Text style={styles.servicePrice}>+ Rs {service.price}</Text>
                </View>
              ))}

              <View style={styles.servicesTotalRow}>
                <Text style={styles.servicesTotalLabel}>Services total</Text>
                <Text style={styles.servicesTotalValue}>Rs {earnings.servicesTotal}</Text>
              </View>
            </View>
          )}

          <View style={[styles.row, styles.serviceFeeRow]}>
            <Text style={styles.rowLabel}>Host service fee (3%)</Text>
            <Text style={styles.serviceFeeValue}>− Rs {earnings.serviceFee.toFixed(0)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalText}>YOU'LL EARN</Text>
            <Text style={styles.totalAmount}>Rs {earnings.earnings.toFixed(0)}</Text>
          </View>

          <Text style={styles.noteText}>All prices are per night</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ===== Updated Styles =====
const createStyles = (width, height, isSmall, isTablet) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
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
    headerBack: {
      width: 50,
    },
    headerBackText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 16,
    },
    headerTitle: {
      textAlign: 'center',
      color: '#fff',
      fontWeight: '700',
      fontSize: 18,
    },
    scrollContent: { paddingHorizontal: width * 0.05, paddingTop: height * 0.03 },
    title: { fontSize: isTablet ? 26 : 20, fontWeight: '700', marginBottom: 10 },
    subtitle: { fontSize: 14, color: '#666', marginBottom: 25 },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 13, fontWeight: '600', color: '#666', marginBottom: 12 },
    control: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    circleBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F3F3F3', justifyContent: 'center', alignItems: 'center' },
    btnText: { fontSize: 24, color: '#FF385C' },
    priceBox: { flexDirection: 'row', alignItems: 'baseline' },
    currency: { fontSize: 18, marginRight: 4 },
    price: { fontSize: isTablet ? 40 : 32, fontWeight: '700' },
    earningsCard: { backgroundColor: '#F8F8F8', padding: 20, borderRadius: 16, marginTop: 10 },
    earnTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    rowLabel: { fontSize: 14, color: '#666' },
    rowValue: { fontSize: 14, fontWeight: '500', color: '#333' },
    servicesList: { marginTop: 5, marginBottom: 10, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: '#FF385C30' },
    servicesSubtitle: { fontSize: 13, fontWeight: '600', color: '#666', marginBottom: 8 },
    serviceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    serviceInfo: { flexDirection: 'row', alignItems: 'center' },
    serviceIcon: { fontSize: 14, marginRight: 6, color: '#FF385C' },
    serviceName: { fontSize: 13, color: '#333' },
    servicePrice: { fontSize: 13, color: '#4CAF50', fontWeight: '500' },
    servicesTotalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#ddd' },
    servicesTotalLabel: { fontSize: 14, fontWeight: '600', color: '#333' },
    servicesTotalValue: { fontSize: 14, fontWeight: '600', color: '#4CAF50' },
    serviceFeeRow: { marginTop: 5 },
    serviceFeeValue: { fontSize: 14, color: '#FF385C' },
    divider: { height: 1, backgroundColor: '#ddd', marginVertical: 12 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    totalText: { fontSize: 16, fontWeight: '700', color: '#333' },
    totalAmount: { fontSize: 22, fontWeight: '700', color: '#FF385C' },
    noteText: { fontSize: 12, color: '#999', fontStyle: 'italic', textAlign: 'right', marginTop: 5 },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fff' },
    backBtn: { paddingVertical: 14, borderColor: '#ddd' },
    backText: { fontWeight: '600' },
    nextBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF385C', paddingVertical: 14, paddingHorizontal: 30, borderRadius: 10 },
    nextText: { color: '#fff', fontWeight: '600', marginRight: 6 },
  });

export default PriceScreen;