import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Switch,
} from 'react-native';
import { PropertyContext } from '../../../context/PropertyContext';

const BED_TYPES = ['Queen Bed', 'Single Bed', 'Double Bed', 'Mattress'];
const WASHROOM_TYPES = ['Attached', 'Shared'];

/* ---------------- ROOM CARD ---------------- */

const RoomCard = ({ room, index, updateRoom }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.roomNumberBadge}>
        <Text style={styles.roomNumberText}>Room {index + 1}</Text>
      </View>
    </View>

    {/* Washroom Selector */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Washroom Type</Text>
      <View style={styles.optionRow}>
        {WASHROOM_TYPES.map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.optionButton,
              room.washroom === type && styles.optionButtonActive,
            ]}
            onPress={() => updateRoom(index, 'washroom', type)}
          >
            <Text
              style={[
                styles.optionText,
                room.washroom === type && styles.optionTextActive,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>

    {/* Lock Selector */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Does room have a lock?</Text>
      <View style={styles.optionRow}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            room.hasLock === true && styles.optionButtonActive,
          ]}
          onPress={() => updateRoom(index, 'hasLock', true)}
        >
          <Text
            style={[
              styles.optionText,
              room.hasLock === true && styles.optionTextActive,
            ]}
          >
            Yes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButton,
            room.hasLock === false && styles.optionButtonActive,
          ]}
          onPress={() => updateRoom(index, 'hasLock', false)}
        >
          <Text
            style={[
              styles.optionText,
              room.hasLock === false && styles.optionTextActive,
            ]}
          >
            No
          </Text>
        </TouchableOpacity>
      </View>
    </View>

    {/* Beds Section */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Beds</Text>

      {BED_TYPES.map(type => {
        if (type === 'Mattress' && !room.showMattress) return null;

        return (
          <View key={type} style={styles.counterRow}>
            <Text style={styles.bedTypeLabel}>{type}</Text>

            <View style={styles.counterControls}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() =>
                  updateRoom(index, type, Math.max(0, (room.beds[type] || 0) - 1))
                }
              >
                <Text style={styles.counterButtonText}>-</Text>
              </TouchableOpacity>

              <View style={styles.counterDisplay}>
                <Text style={styles.counterText}>
                  {room.beds[type] || 0}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.counterButton}
                onPress={() =>
                  updateRoom(index, type, (room.beds[type] || 0) + 1)
                }
              >
                <Text style={styles.counterButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>

    {/* Mattress Toggle */}
    <View style={[styles.section, styles.toggleRow]}>
      <Text style={styles.sectionTitle}>Show Mattress?</Text>
      <Switch
        value={room.showMattress}
        onValueChange={value => updateRoom(index, 'showMattress', value)}
        trackColor={{ false: '#ccc', true: '#ff385c' }}
        thumbColor="#fff"
      />
    </View>
  </View>
);

/* ---------------- MAIN SCREEN ---------------- */

const RoomsScreen = ({ route, navigation }) => {
  const prevData = route?.params?.data || {};

  const [rooms, setRooms] = useState([
    {
      washroom: 'Attached',
      beds: {},
      showMattress: false,
      hasLock: false,
    },
  ]);

  const addRoom = () =>
    setRooms([
      ...rooms,
      {
        washroom: 'Attached',
        beds: {},
        showMattress: false,
        hasLock: false,
      },
    ]);

  const removeRoom = () => {
    if (rooms.length > 1) {
      setRooms(rooms.slice(0, -1));
    }
  };

  const updateRoom = (index, key, value) => {
    const newRooms = [...rooms];

    if (BED_TYPES.includes(key)) {
      newRooms[index].beds[key] = value;
    } else {
      newRooms[index][key] = value;
    }

    setRooms(newRooms);
  };

  const { updatePropertyData } = useContext(PropertyContext);

  const handleNext = () => {
    updatePropertyData('rooms', rooms);
    const finalData = { ...prevData, rooms };
    Alert.alert('Property Data', JSON.stringify(finalData, null, 2));
    navigation.navigate('CreateDescriptionScreen', { data: finalData });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>

        {/* Room Counter */}
        <View style={styles.counterSection}>
          <Text style={styles.counterLabel}>Number of Rooms</Text>

          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={styles.counterActionButton}
              onPress={removeRoom}
            >
              <Text style={styles.counterActionText}>−</Text>
            </TouchableOpacity>

            <View style={styles.roomCountContainer}>
              <Text style={styles.roomCount}>{rooms.length}</Text>
              <Text style={styles.roomLabel}>ROOMS</Text>
            </View>

            <TouchableOpacity
              style={styles.counterActionButton}
              onPress={addRoom}
            >
              <Text style={styles.counterActionText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Rooms List */}
        <FlatList
          data={rooms}
          renderItem={({ item, index }) => (
            <RoomCard
              room={item}
              index={index}
              updateRoom={updateRoom}
            />
          )}
          keyExtractor={(_, i) => `room-${i}`}
          contentContainerStyle={{ padding: 16 }}
        />

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.rowButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.nextButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rowButton}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

export default RoomsScreen;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#f8f9fa' },

  counterSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },

  counterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },

  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  counterActionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ff385c',
    justifyContent: 'center',
    alignItems: 'center',
  },

  counterActionText: {
    fontSize: 24,
    color: '#fff',
  },

  roomCountContainer: { alignItems: 'center' },

  roomCount: { fontSize: 28, fontWeight: '700' },

  roomLabel: { fontSize: 12, color: '#6c757d' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
  },

  cardHeader: { marginBottom: 15 },

  roomNumberBadge: {
    backgroundColor: '#ff385c',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  roomNumberText: { color: '#fff', fontWeight: '600' },

  section: { marginBottom: 20 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },

  optionRow: {
    flexDirection: 'row',
    gap: 12,
  },

  optionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },

  optionButtonActive: {
    backgroundColor: '#fff0f3',
    borderColor: '#ff385c',
  },

  optionText: { color: '#555' },

  optionTextActive: {
    color: '#ff385c',
    fontWeight: '600',
  },

  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  bedTypeLabel: { fontSize: 15 },

  counterControls: { flexDirection: 'row', alignItems: 'center' },

  counterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f1f1',
    justifyContent: 'center',
    alignItems: 'center',
  },

  counterButtonText: { fontSize: 18 },

  counterDisplay: {
    width: 40,
    alignItems: 'center',
  },

  counterText: { fontWeight: '600' },

  buttonRow: {
    flexDirection: 'row',
    margin: 16,
  },

  rowButton: {
    flex: 1,
    backgroundColor: '#ff385c',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },

  nextButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
