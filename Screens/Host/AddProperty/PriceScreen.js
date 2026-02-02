import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';

const PriceScreen = ({ navigation, route }) => {
  const propertyData = route.params || {};

  const [basePrice, setBasePrice] = useState('');
  const [weeklyDiscount, setWeeklyDiscount] = useState('');
  const [monthlyDiscount, setMonthlyDiscount] = useState('');
  const [cleaningFee, setCleaningFee] = useState('');
  const [serviceFee, setServiceFee] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');

  const [isFlexPrice, setIsFlexPrice] = useState(false);
  const [weekendMultiplier, setWeekendMultiplier] = useState(1.2);
  const [holidayMultiplier, setHolidayMultiplier] = useState(1.5);

  // Move button handler
  const adjustMultiplier = (type, direction) => {
    const options = type === 'weekend' ? [1, 1.1, 1.2, 1.3, 1.5] : [1, 1.5, 1.8, 2.0];
    let current = type === 'weekend' ? weekendMultiplier : holidayMultiplier;
    let index = options.indexOf(current);

    if (direction === 'left' && index > 0) index--;
    if (direction === 'right' && index < options.length - 1) index++;

    if (type === 'weekend') setWeekendMultiplier(options[index]);
    else setHolidayMultiplier(options[index]);
  };

  const handleNext = () => {
    if (!basePrice) {
      Alert.alert('Required', 'Please enter a base price');
      return;
    }

    const priceData = {
      basePrice,
      weeklyDiscount,
      monthlyDiscount,
      cleaningFee,
      serviceFee,
      securityDeposit,
      isFlexPrice,
      weekendMultiplier,
      holidayMultiplier,
    };

    navigation.navigate('PreviewListing', { ...propertyData, ...priceData });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Set Your Price</Text>

        {/* Base Price */}
        <Text style={styles.label}>Base Price (PKR)</Text>
        <TextInput
          style={styles.input}
          value={basePrice}
          onChangeText={(text) => setBasePrice(text.replace(/[^0-9]/g, ''))}
          keyboardType="numeric"
          placeholder="Enter price"
        />

        {/* Discounts */}
        <Text style={styles.label}>Weekly Discount (%)</Text>
        <TextInput
          style={styles.input}
          value={weeklyDiscount}
          onChangeText={(text) => setWeeklyDiscount(text.replace(/[^0-9]/g, ''))}
          keyboardType="numeric"
          placeholder="0"
        />

        <Text style={styles.label}>Monthly Discount (%)</Text>
        <TextInput
          style={styles.input}
          value={monthlyDiscount}
          onChangeText={(text) => setMonthlyDiscount(text.replace(/[^0-9]/g, ''))}
          keyboardType="numeric"
          placeholder="0"
        />

        {/* Fees */}
        <Text style={styles.label}>Cleaning Fee (PKR)</Text>
        <TextInput
          style={styles.input}
          value={cleaningFee}
          onChangeText={(text) => setCleaningFee(text.replace(/[^0-9]/g, ''))}
          keyboardType="numeric"
          placeholder="0"
        />

        <Text style={styles.label}>Service Fee (PKR)</Text>
        <TextInput
          style={styles.input}
          value={serviceFee}
          onChangeText={(text) => setServiceFee(text.replace(/[^0-9]/g, ''))}
          keyboardType="numeric"
          placeholder="0"
        />

        <Text style={styles.label}>Security Deposit (PKR)</Text>
        <TextInput
          style={styles.input}
          value={securityDeposit}
          onChangeText={(text) => setSecurityDeposit(text.replace(/[^0-9]/g, ''))}
          keyboardType="numeric"
          placeholder="0"
        />

        {/* Flex Price */}
        <View style={styles.flexRow}>
          <Text style={styles.label}>Enable Flex Price</Text>
          <Switch value={isFlexPrice} onValueChange={setIsFlexPrice} />
        </View>

        {isFlexPrice && (
          <View style={{ marginTop: 20 }}>
            {/* Weekend Multiplier */}
            <Text style={styles.label}>Weekend Multiplier: {weekendMultiplier}x</Text>
            <View style={styles.moveRow}>
              <TouchableOpacity style={styles.moveButton} onPress={() => adjustMultiplier('weekend', 'left')}>
                <Text style={styles.moveText}>‹</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.moveButton} onPress={() => adjustMultiplier('weekend', 'right')}>
                <Text style={styles.moveText}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Holiday Multiplier */}
            <Text style={styles.label}>Holiday Multiplier: {holidayMultiplier}x</Text>
            <View style={styles.moveRow}>
              <TouchableOpacity style={styles.moveButton} onPress={() => adjustMultiplier('holiday', 'left')}>
                <Text style={styles.moveText}>‹</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.moveButton} onPress={() => adjustMultiplier('holiday', 'right')}>
                <Text style={styles.moveText}>›</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Next Button */}
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20 },
  label: { fontSize: 16, marginTop: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 16 },
  flexRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  moveRow: { flexDirection: 'row', marginTop: 10, marginBottom: 20 },
  moveButton: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 8, marginHorizontal: 5 },
  moveText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  button: { marginTop: 30, backgroundColor: '#FF385C', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});

export default PriceScreen;
