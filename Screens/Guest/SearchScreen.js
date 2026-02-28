import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Switch,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const FilterScreen = ({ navigation }) => {

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  
  
  const [petsAllowed, setPetsAllowed] = useState(false);
  
 
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  

  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(null);
  
  
  const [apartment, setApartment] = useState(false);
  const [house, setHouse] = useState(false);
  const [villa, setVilla] = useState(false);
  
 
  const [wifi, setWifi] = useState(false);
  const [parking, setParking] = useState(false);
  const [pool, setPool] = useState(false);

  const showDatePickerModal = (type) => {
    setShowDatePicker(type);
  };

  const applyFilters = () => {
    const filters = {
      adults,
      children,
      infants,
      petsAllowed,
      minPrice,
      maxPrice,
      checkInDate,
      checkOutDate,
      apartment,
      house,
      villa,
      wifi,
      parking,
      pool,
    };
    navigation.goBack();
  };


  const SimpleCheckbox = ({ label, isChecked, onPress }) => (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
      <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
        {isChecked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );

  
  const ToggleRow = ({ label, value, onValueChange, subLabel }) => (
    <View style={styles.toggleRow}>
      <View>
        <Text style={styles.toggleLabel}>{label}</Text>
        {subLabel && <Text style={styles.toggleSubLabel}>{subLabel}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#767577', true: '#FF385C' }}
        thumbColor={value ? '#FFF' : '#f4f3f4'}
      />
    </View>
  );

  // Guest Counter Component - DIRECTLY ON MAIN SCREEN
  const GuestCounter = ({ label, value, setValue, subLabel, minValue = 0 }) => (
    <View style={styles.guestCounterRow}>
      <View>
        <Text style={styles.guestCounterLabel}>{label}</Text>
        {subLabel && <Text style={styles.guestCounterSubLabel}>{subLabel}</Text>}
      </View>
      <View style={styles.counterControls}>
        <TouchableOpacity 
          style={[styles.counterButton, value === minValue && styles.counterButtonDisabled]}
          onPress={() => value > minValue && setValue(value - 1)}
          disabled={value === minValue}
        >
          <Text style={[styles.counterButtonText, value === minValue && styles.counterButtonTextDisabled]}>-</Text>
        </TouchableOpacity>
        <Text style={styles.counterValue}>{value}</Text>
        <TouchableOpacity 
          style={styles.counterButton}
          onPress={() => setValue(value + 1)}
        >
          <Text style={styles.counterButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeButton}>X</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filters</Text>
        <TouchableOpacity onPress={() => {
          setAdults(1);
          setChildren(0);
          setInfants(0);
          setPetsAllowed(false);
          setMinPrice('');
          setMaxPrice('');
          setCheckInDate(null);
          setCheckOutDate(null);
          setApartment(false);
          setHouse(false);
          setVilla(false);
          setWifi(false);
          setParking(false);
          setPool(false);
        }}>
          <Text style={styles.clearButton}>Clear all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Pets Allowed Toggle */}
        <View style={styles.section}>
          <ToggleRow
            label="Pets Allowed"
            value={petsAllowed}
            onValueChange={setPetsAllowed}
            subLabel="Bringing a service animal?"
          />
        </View>

        {/* Guests Section - ALL COUNTERS DIRECTLY ON MAIN SCREEN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Guests</Text>
          
          {/* Adults - DIRECT COUNTER */}
          <GuestCounter
            label="Adults"
            value={adults}
            setValue={setAdults}
            subLabel="Ages 13 or above"
            minValue={1}
          />
          
          {/* Children - DIRECT COUNTER */}
          <GuestCounter
            label="Children"
            value={children}
            setValue={setChildren}
            subLabel="Ages 2–12"
          />
          
          {/* Infants - DIRECT COUNTER */}
          <GuestCounter
            label="Infants"
            value={infants}
            setValue={setInfants}
            subLabel="Under 2"
          />
          
        
          <View style={styles.guestSummary}>
            <Text style={styles.guestSummaryText}>
              Total: {adults + children} {adults + children === 1 ? 'guest' : 'guests'}
              {infants > 0 && `, ${infants} ${infants === 1 ? 'infant' : 'infants'}`}

            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Range (PKR)</Text>
          <View style={styles.priceRow}>
            <TextInput
              style={styles.priceInput}
              placeholder="Min price"
              value={minPrice}
              onChangeText={setMinPrice}
              keyboardType="number-pad"
            />
            <Text style={styles.toText}>to</Text>
            <TextInput
              style={styles.priceInput}
              placeholder="Max price"
              value={maxPrice}
              onChangeText={setMaxPrice}
              keyboardType="number-pad"
            />
          </View>
        </View>

        {/* Dates Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dates</Text>
          <View style={styles.dateRow}>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => showDatePickerModal('checkin')}
            >
              <Text style={styles.dateLabel}>Check-in</Text>
              <Text style={styles.dateValue}>
                {checkInDate ? checkInDate.toDateString().substring(0, 10) : 'Select date'}
              </Text>
            </TouchableOpacity>
            
            <Text style={styles.arrow}>→</Text>
            
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => showDatePickerModal('checkout')}
            >
              <Text style={styles.dateLabel}>Check-out</Text>
              <Text style={styles.dateValue}>
                {checkOutDate ? checkOutDate.toDateString().substring(0, 10) : 'Select date'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Property Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Type</Text>
          <View style={styles.checkboxRow}>
            <SimpleCheckbox
              label="Apartment"
              isChecked={apartment}
              onPress={() => setApartment(!apartment)}
            />
            <SimpleCheckbox
              label="House"
              isChecked={house}
              onPress={() => setHouse(!house)}
            />
            <SimpleCheckbox
              label="Villa"
              isChecked={villa}
              onPress={() => setVilla(!villa)}
            />
          </View>
        </View>

        {/* Amenities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.checkboxRow}>
            <SimpleCheckbox
              label="Wi-Fi"
              isChecked={wifi}
              onPress={() => setWifi(!wifi)}
            />
            <SimpleCheckbox
              label="Parking"
              isChecked={parking}
              onPress={() => setParking(!parking)}
            />
            <SimpleCheckbox
              label="Swimming Pool"
              isChecked={pool}
              onPress={() => setPool(!pool)}
            />
          </View>
        </View>

        {/* Spacer at bottom */}
        <View style={styles.spacer} />
      </ScrollView>

      {/* Apply Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
          <Text style={styles.applyButtonText}>Show  homes</Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker Modal - ONLY FOR DATES */}
      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(null);
            if (selectedDate) {
              if (showDatePicker === 'checkin') {
                setCheckInDate(selectedDate);
              } else {
                setCheckOutDate(selectedDate);
              }
            }
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    fontSize: 24,
    color: 'black',
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },
  clearButton: {
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    marginBottom: 15,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
    marginBottom: 4,
  },
  toggleSubLabel: {
    fontSize: 14,
    color: '#666',
  },
 
  guestCounterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
  },
  guestCounterLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
  },
  guestCounterSubLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  counterControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  counterButtonDisabled: {
    borderColor: '#f0f0f0',
    backgroundColor: '#f8f8f8',
  },
  counterButtonText: {
    fontSize: 24,
    color: 'black',
    fontWeight: '300',
  },
  counterButtonTextDisabled: {
    color: '#ccc',
  },
  counterValue: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 15,
    minWidth: 30,
    textAlign: 'center',
    color: 'black',
  },
  guestSummary: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  guestSummaryText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  toText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: '#666',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  dateLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  dateValue: {
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
  },
  arrow: {
    fontSize: 20,
    color: '#666',
    marginHorizontal: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#666',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#FF385C',
    borderColor: '#FF385C',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: 'black',
  },
  spacer: {
    height: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  applyButton: {
    backgroundColor: '#FF385C',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default FilterScreen;