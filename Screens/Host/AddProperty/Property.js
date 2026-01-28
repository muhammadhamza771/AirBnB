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
} from 'react-native';

const PROPERTY_TYPES = [
  { id: 'house', label: 'House', icon: '🏠' },
  { id: 'apartment', label: 'Apartment', icon: '🏢' },
  { id: 'barn', label: 'Barn', icon: '🏚️' },
  { id: 'boat', label: 'Boat', icon: '⛵' },
  { id: 'cabin', label: 'Cabin', icon: '🏕️' },
  { id: 'rv', label: 'Camper/RV', icon: '🚐' },
  { id: 'casa', label: 'Casa particular', icon: '🏡' },
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
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
        
          <View style={styles.progressContainer}>
            <Text style={styles.stepIndicator}>STEP 2 OF 11</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '18%' }]} />
            </View>
            <Text style={styles.progressText}>2/11</Text>
          </View>

          <Text style={styles.title}>
            Which of these best describes your place?
          </Text>

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
                    
                    {isSelected && (
                      <View style={styles.selectedIndicator}>
                        <View style={styles.selectedDot} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.6}
          >
            <Text style={styles.backText}>Back</Text>
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  progressContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  stepIndicator: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF385C',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    textAlign: 'right',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 24,
    lineHeight: 34,
  },
  flatListContainer: {
    flex: 1,
    minHeight: 400,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedCard: {
    borderColor: '#FF385C',
    backgroundColor: '#FFF1F2',
    shadowColor: '#FF385C',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    fontSize: 36,
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF385C',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: '#FF385C',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
    shadowColor: '#FF385C',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#d1d5db',
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default PropertyName;