import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';

const PROPERTY_TYPES = [
  {
    id: 'entire_place',
    label: 'Entire place',
    description: 'Guests have the whole place to themselves.',
    icon: '🏠',
  },
  {
    id: 'private_room',
    label: 'Private room',
    description: 'Guests have their own room and shared spaces.',
    icon: '🚪',
  },
];

const PropertyType = ({ navigation, route }) => {
  const [selected, setSelected] = useState(null);

  const prevData = route.params || {};

  const handleNext = () => {
  if (!selected) return;

  const dataToSend = {
    ...prevData,
    propertyType: {
      id: selected.id,
      label: selected.label,
    },
  };

  navigation.navigate('GuestCapacity', dataToSend);
};

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.step}>STEP 3 OF 11</Text>

      <Text style={styles.title}>
        What type of place will guests have?
      </Text>

      {PROPERTY_TYPES.map(item => {
        const isSelected = selected?.id === item.id;

        return (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.card,
              isSelected && styles.selectedCard,
            ]}
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

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.nextBtn,
            !selected && { backgroundColor: '#ccc' },
          ]}
          disabled={!selected}
          onPress={handleNext}
        >
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PropertyType;

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
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  selectedCard: {
    borderColor: '#000',
    backgroundColor: '#f9f9f9',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  icon: {
    fontSize: 36,
    marginLeft: 10,
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
