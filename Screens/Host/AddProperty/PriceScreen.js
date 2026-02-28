import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { PropertyContext } from '../../../context/PropertyContext';

const { width } = Dimensions.get('window');

const PriceScreen = ({ navigation, route }) => {
  const propertyData = route.params || {};
  const { updatePropertyData } = useContext(PropertyContext);

  const [basePrice, setBasePrice] = useState('1500');
  const [cleaningFee, setCleaningFee] = useState('0');
  
  const SERVICE_FEE_PERCENTAGE = 3; // 3% host service fee

  // Calculate earnings
  const calculateEarnings = () => {
    const base = parseInt(basePrice) || 0;
    const cleaning = parseInt(cleaningFee) || 0;
    const total = base + cleaning;
    const serviceFee = (total * SERVICE_FEE_PERCENTAGE) / 100;
    const earnings = total - serviceFee;
    
    return {
      base,
      cleaning,
      total,
      serviceFee,
      earnings
    };
  };

  const earnings = calculateEarnings();

  const adjustCleaningFee = (direction) => {
    let current = parseInt(cleaningFee) || 0;

    if (direction === 'plus') {
      current = current + 200;
    } else if (direction === 'minus') {
      current = current - 200;
    }

    // Ensure cleaning fee doesn't go below 0
    if (current < 0) {
      current = 0;
    }

    // Maximum cleaning fee of 1000
    if (current > 1000) {
      current = 1000;
    }

    setCleaningFee(current.toString());
  };

  const adjustBasePrice = (direction) => {
    let current = parseInt(basePrice) || 1500;

    if (direction === 'plus') {
      current = current + 300;
    } else if (direction === 'minus') {
      current = current - 300;
    }

  
    if (current < 300) {
      current = 300;
    }

    // Maximum base price of 10000
    if (current > 10000) {
      current = 10000;
    }

    setBasePrice(current.toString());
  };

  const handleNext = () => {
    if (!basePrice || parseInt(basePrice) < 300) {
      Alert.alert('Required', 'Please enter a valid base price (minimum Rs 300)');
      return;
     
    }

    // Save to context
    updatePropertyData('price', parseInt(basePrice));

    const priceData = {
      basePrice,
      cleaningFee,
      totalEarnings: earnings.earnings,
    };

    // Navigate to next screen with price data
    navigation.navigate('CancellationPoliciesScreen', { priceData });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Price your place</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Set a competitive price to attract more guests.
        </Text>

        {/* Base Price Section */}
        <View style={styles.priceSection}>
          <Text style={styles.sectionTitle}>BASE PRICE PER NIGHT</Text>
          
          <View style={styles.priceControl}>
            <TouchableOpacity 
              style={styles.priceButton}
              onPress={() => adjustBasePrice('minus')}
            >
              <Text style={styles.priceButtonText}>-</Text>
            </TouchableOpacity>
            
            <View style={styles.priceDisplay}>
              <Text style={styles.currencySymbol}>Rs</Text>
              <Text style={styles.priceValue}>{basePrice}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.priceButton}
              onPress={() => adjustBasePrice('plus')}
            >
              <Text style={styles.priceButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cleaning Fee Section */}
        <View style={styles.priceSection}>
          <Text style={styles.sectionTitle}>Cleaning Fee</Text>
          
          <View style={styles.priceControl}>
            <TouchableOpacity 
              style={styles.priceButton}
              onPress={() => adjustCleaningFee('minus')}
            >
              <Text style={styles.priceButtonText}>-</Text>
            </TouchableOpacity>
            
            <View style={styles.priceDisplay}>
              <Text style={styles.currencySymbol}>Rs</Text>
              <Text style={styles.priceValue}>{cleaningFee}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.priceButton}
              onPress={() => adjustCleaningFee('plus')}
            >
              <Text style={styles.priceButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Earnings Breakdown */}
        <View style={styles.earningsContainer}>
          <Text style={styles.earningsTitle}>Earnings Breakdown</Text>
          
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>Base price</Text>
            <Text style={styles.breakdownValue}>Rs {earnings.base}</Text>
          </View>
          
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>Cleaning fee</Text>
            <Text style={[styles.breakdownValue, styles.plusValue]}>
              + Rs {earnings.cleaning}
            </Text>
          </View>
          
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>Host service fee (3%)</Text>
            <Text style={[styles.breakdownValue, styles.minusValue]}>
              - Rs {earnings.serviceFee.toFixed(0)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalEarnings}>
            <Text style={styles.totalLabel}>YOU'LL EARN (PER NIGHT)</Text>
            <Text style={styles.totalValue}>Rs {earnings.earnings.toFixed(0)}</Text>
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
          <Icon name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  placeholder: {
    width: 34,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    paddingHorizontal: 20,
    paddingVertical: 20,
    lineHeight: 22,
  },
  priceSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  priceControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  priceButtonText: {
    fontSize: 24,
    fontWeight: '300',
    color: '#FF385C',
  },
  priceDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currencySymbol: {
    fontSize: 20,
    color: '#666',
    marginRight: 5,
  },
  priceValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
  },
  earningsContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
  },
  earningsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#000',
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  breakdownLabel: {
    fontSize: 16,
    color: '#666',
  },
  breakdownValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  plusValue: {
    color: '#4CAF50',
  },
  minusValue: {
    color: '#FF385C',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 15,
  },
  totalEarnings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF385C',
  },
  nextButton: {
    backgroundColor: '#FF385C',
    margin: 20,
    padding: 18,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF385C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 10,
  },
});

export default PriceScreen;
