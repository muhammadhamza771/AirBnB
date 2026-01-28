import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

const GuestCounter = ({ label, count, setCount, subtitle }) => (
  <View style={styles.counterRow}>
    <View>
      <Text style={styles.counterLabel}>{label}</Text>
      {subtitle && (
        <Text style={styles.counterSubtitle}>{subtitle}</Text>
      )}
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

const GuestCapacity = ({ navigation, route }) => {
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(1);
  const [infants, setInfants] = useState(0);

  // previous screen ka data
  const prevData = route.params || {};

  const handleNext = () => {
  const finalData = {
    ...prevData,
    guests: {
      adults,
      children,
      infants,
    },
  };

  Alert.alert(
    'Complete Listing Data',
    `
Property Name:
${finalData.propertyName?.label}

Property Type:
${finalData.propertyType?.label}

Guests:
Adults: ${finalData.guests.adults}
Children: ${finalData.guests.children}
Infants: ${finalData.guests.infants}
    `,
    [
      {
        text: 'OK',
        onPress: () => {
         navigation.navigate('RoomsScreen', { data: finalData }); 
        },
      },
    ]
  );
};


  return (
    <View style={styles.container}>
      <Text style={styles.step}>STEP 4 OF 11</Text>

      <Text style={styles.title}>
        Share some basics about your place
      </Text>

      <Text style={styles.subtitle}>
        You’ll add more details later.
      </Text>

      <View style={styles.card}>
        <GuestCounter
          label="Adults"
          count={adults}
          setCount={setAdults}
        />
        <GuestCounter
          label="Children"
          subtitle="Ages 2–12"
          count={children}
          setCount={setChildren}
        />
        <GuestCounter
          label="Infants"
          subtitle="Under 2"
          count={infants}
          setCount={setInfants}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextBtn}
          onPress={handleNext}
        >
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GuestCapacity;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  step: {
    fontSize: 12,
    color: '#777',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
    padding: 15,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  counterLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  counterSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  counterControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlText: {
    fontSize: 18,
  },
  countText: {
    marginHorizontal: 15,
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  back: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  nextBtn: {
    backgroundColor: '#FF385C',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  nextText: {
    color: '#fff',
    fontWeight: '700',
  },
});
