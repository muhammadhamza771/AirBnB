import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

const PricingStrategiesScreen = ({ navigation, route }) => {
  const prevData = route?.params?.data || {};

  const [weekly, setWeekly] = useState(2);
  const [monthly, setMonthly] = useState(3);
  const [earlyBird, setEarlyBird] = useState(6);

  const increase = (value, setter) => {
    if (value < 50) setter(value + 1);
  };

  const decrease = (value, setter) => {
    if (value > 0) setter(value - 1);
  };

  const handleNext = () => {
    const dataToPass = {
      ...prevData,
      pricingStrategies: {
        weeklyDiscount: weekly,
        monthlyDiscount: monthly,
        earlyBirdDiscount: earlyBird,
      },
    };

    navigation.navigate('LocationScreen', { data: dataToPass });
  };

  const DiscountCard = ({ title, subtitle, value, onMinus, onPlus }) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>

      <View style={styles.counterRow}>
        <TouchableOpacity onPress={onMinus} style={styles.iconBtn}>
          <Text style={styles.iconText}>−</Text>
        </TouchableOpacity>

        <Text style={styles.percentText}>{value}%</Text>

        <TouchableOpacity onPress={onPlus} style={styles.iconBtn}>
          <Text style={styles.iconText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Pricing Strategies</Text>

      <DiscountCard
        title="Weekly Discount"
        subtitle="7 nights or more"
        value={weekly}
        onMinus={() => decrease(weekly, setWeekly)}
        onPlus={() => increase(weekly, setWeekly)}
      />

      <DiscountCard
        title="Monthly Discount"
        subtitle="28 nights or more"
        value={monthly}
        onMinus={() => decrease(monthly, setMonthly)}
        onPlus={() => increase(monthly, setMonthly)}
      />

      <DiscountCard
        title="Early Bird Discount"
        subtitle="Booked 2+ months early"
        value={earlyBird}
        onMinus={() => decrease(earlyBird, setEarlyBird)}
        onPlus={() => increase(earlyBird, setEarlyBird)}
      />

      <View style={styles.footer}>
        <View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.stepText}>Step 12 of 13</Text>
        </View>

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PricingStrategiesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 25,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
    fontWeight: '600',
  },
  percentText: {
    marginHorizontal: 14,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
  },
  stepText: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  nextBtn: {
    backgroundColor: '#f44336',
    paddingHorizontal: 26,
    paddingVertical: 14,
    borderRadius: 12,
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
