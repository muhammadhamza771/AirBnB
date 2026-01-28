import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';

const HIGHLIGHTS = [
  { id: 'peaceful', label: 'Peaceful', icon: '🌿' },
  { id: 'unique', label: 'Unique', icon: '✨' },
  { id: 'family', label: 'Family-friendly', icon: '👨‍👩‍👧' },
  { id: 'stylish', label: 'Stylish', icon: '💎' },
  { id: 'central', label: 'Central', icon: '📍' },
  { id: 'spacious', label: 'Spacious', icon: '🏛️' },
];

const HouseHighlights = ({ navigation, route }) => {
  // ✅ Previous screen data
  const prevData = route?.params?.data || {};

  const [selected, setSelected] = useState([]);

  // 🔙 Back
  const handleBack = () => {
    navigation.goBack();
  };

  // ▶️ Next
  const handleNext = () => {
    if (selected.length === 0) {
      Alert.alert('Required', 'Select at least one highlight');
      return;
    }

    // ✅ FINAL DATA (no duplication)
    const finalData = {
      ...prevData,
      highlights: selected,
    };

    // ✅ Show only ONE clean object
    Alert.alert(
      'Property Data',
      JSON.stringify(finalData, null, 2)
    );

    // ✅ Navigate with clean data
    navigation.navigate('AmenitiesScreen', {
      data: finalData,
    });
  };

  // 🔄 Toggle highlight (max 2)
  const toggleHighlight = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      if (selected.length < 2) {
        setSelected([...selected, id]);
      } else {
        Alert.alert('Limit reached', 'You can select only 2 highlights');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Choose highlights</Text>

      <Text style={styles.subtitle}>
        Select up to 2 highlights that best describe your property
      </Text>

      <View style={styles.grid}>
        {HIGHLIGHTS.map((item) => {
          const isSelected = selected.includes(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, isSelected && styles.selected]}
              onPress={() => toggleHighlight(item.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.icon}>{item.icon}</Text>
              <Text style={styles.label}>{item.label}</Text>

              {isSelected && (
                <View style={styles.selectedIndicator}>
                  <Text style={styles.selectedIcon}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.nextBtn,
            selected.length === 0 && styles.nextBtnDisabled,
          ]}
          onPress={handleNext}
          disabled={selected.length === 0}
        >
          <Text style={styles.nextText}>
            Next {selected.length > 0 ? `(${selected.length}/2)` : ''}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HouseHighlights;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    padding: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 16,
    marginBottom: 15,
    alignItems: 'center',
    backgroundColor: '#fafafa',
    position: 'relative',
  },
  selected: {
    borderColor: '#000',
    borderWidth: 2,
    backgroundColor: '#f0f0f0',
  },
  icon: {
    fontSize: 36,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIcon: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 30,
  },
  backBtn: {
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  backText: {
    fontSize: 16,
    fontWeight: '500',
  },
  nextBtn: {
    flex: 1,
    backgroundColor: '#000',
    marginLeft: 15,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextBtnDisabled: {
    backgroundColor: '#ccc',
  },
  nextText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
