import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';

const PROPERTY_TYPES = [
  { id: 'house', label: 'House', icon: '🏠' },
  { id: 'apartment', label: 'Apartment', icon: '🏢' },
  { id: 'room', label: 'Room', icon: '🏬' },
];

const PropertyName = ({ navigation, route }) => {
  const [selected, setSelected] = useState(null);
  const prevData = route.params || {};

  const handleNext = () => {
    if (!selected) return;

    const dataToSend = {
      ...prevData,
      propertyName: {
        id: selected.id,
        label: selected.label,
      },
    };

    navigation.navigate('Step2PropertyType', dataToSend);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.stepIndicator}>Step 2 of 13</Text>
        <Text style={styles.title}>
          Which of these best describes your place?
        </Text>
        <Text style={styles.subtitle}>
          Choose the category that fits your property.
        </Text>
      </View>

      <View style={styles.container}>
        <View style={styles.flatListContainer}>
          <FlatList
            data={PROPERTY_TYPES}
            numColumns={2}
            keyExtractor={(item) => item.id}
            columnWrapperStyle={styles.columnWrapper}
            renderItem={({ item }) => {
              const isSelected = selected?.id === item.id;

              return (
                <TouchableOpacity
                  style={[
                    styles.card,
                    isSelected && styles.selectedCard,
                  ]}
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
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.6}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.nextButton,
            !selected && styles.disabledButton,
          ]}
          disabled={!selected}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  stepIndicator: {
    fontSize: 14,
    color: '#717171',
    marginBottom: 8,
    fontWeight: '500',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#717171',
    lineHeight: 22,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  flatListContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  selectedCard: {
    borderColor: '#222222',
    backgroundColor: '#F7F7F7',
  },
  icon: {
    fontSize: 32,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
    textAlign: 'center',
  },
 
 
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
    backgroundColor: '#ffffff',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  
    borderColor: '#222222',
    
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
  },
  nextButton: {
    backgroundColor: '#e31515',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default PropertyName;