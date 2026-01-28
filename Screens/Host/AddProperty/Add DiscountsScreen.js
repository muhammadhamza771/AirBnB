import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';

const discountsData = [
  {
    id: '1',
    title: 'New listing promotion',
    description: 'Offer 20% off your first 3 bookings',
    percent: 20,
  },
  {
    id: '2',
    title: 'Last-minute discount',
    description: 'For stays booked 14 days or less before arrival',
    percent: 0,
  },
  {
    id: '3',
    title: 'Weekly discount',
    description: 'For stays of 7 nights or more',
    percent: 10,
  },
   {
    id: '4',
    title: 'Monthly discount',
    description: 'For stays of 1 Months or more',
    percent: 20,
  },
];

const AddDiscountsScreen = ({ navigation, route }) => {

  const prevData = route?.params?.data || {};
  
  const [selectedDiscounts, setSelectedDiscounts] = useState({});

  
  useEffect(() => {
    if (prevData.selectedDiscounts) {
      setSelectedDiscounts(prevData.selectedDiscounts);
    }
  }, [prevData]);

  const toggleDiscount = (id) => {
    setSelectedDiscounts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderDiscount = ({ item }) => {
    const isSelected = selectedDiscounts[item.id];
    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={() => toggleDiscount(item.id)}
      >
        <View style={styles.percentBox}>
          <Text style={styles.percentText}>{item.percent}%</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
        <View style={styles.checkbox}>
          {isSelected && <View style={styles.checked} />}
        </View>
      </TouchableOpacity>
    );
  };

  const handleNext = () => {
    const dataToPass = {
      ...prevData,
      selectedDiscounts,
    };
    Alert.alert('Property Data', JSON.stringify({ dataToPass }, null, 2));
 
  };

  return (
    <SafeAreaView style={styles.container}>
     

      <Text style={styles.pageTitle}>Add discounts</Text>
      <Text style={styles.pageSubtitle}>
        Help your place stand out to get booked faster and earn your first reviews.
      </Text>

      <FlatList
        data={discountsData}
        keyExtractor={(item) => item.id}
        renderItem={renderDiscount}
        style={{ marginTop: 20 }}
      />

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} style={styles.nextBtn}>
          <Text style={styles.nextBtnText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  headerBtn: { fontSize: 16, color: '#000' },
  pageTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 5 },
  pageSubtitle: { fontSize: 14, color: '#555' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 15,
  },
  cardSelected: { borderColor: '#000' },
  percentBox: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  percentText: { fontWeight: 'bold', fontSize: 16 },
  infoBox: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600' },
  description: { fontSize: 12, color: '#555', marginTop: 5 },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    width: 12,
    height: 12,
    backgroundColor: '#000',
    borderRadius: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backBtn: { fontSize: 16, color: '#000' },
  nextBtn: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  nextBtnText: { color: '#fff', fontSize: 16 },
});

export default AddDiscountsScreen;
