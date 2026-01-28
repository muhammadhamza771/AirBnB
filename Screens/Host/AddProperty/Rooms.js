import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';

const BED_TYPES = ['Queen Bed', 'Single Bed', 'Double Bed', 'Mattress'];
const WASHROOM_TYPES = ['Attached', 'Shared'];

/* Room Card Component */
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

    {/* Beds */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Beds</Text>
      {BED_TYPES.map(type => (
        <View key={type} style={styles.counterRow}>
          <Text style={styles.bedTypeLabel}>{type}</Text>
          <View style={styles.counterControls}>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => updateRoom(index, type, Math.max(0, room.beds[type] - 1))}
            >
              <Text style={styles.counterButtonText}>-</Text>
            </TouchableOpacity>
            <View style={styles.counterDisplay}>
              <Text style={styles.counterText}>{room.beds[type] || 0}</Text>
            </View>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => updateRoom(index, type, (room.beds[type] || 0) + 1)}
            >
              <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  </View>
);

const RoomsScreen = ({ route, navigation }) => {
  const prevData = route?.params?.data || { propertyName: 'N/A' };

  const [rooms, setRooms] = useState([{ washroom: 'Attached', beds: {} }]);

  const addRoom = () => setRooms([...rooms, { washroom: 'Attached', beds: {} }]);
  const removeRoom = () => {
    if (rooms.length > 1) setRooms(rooms.slice(0, -1));
  };

  /* Simple update function */
  const updateRoom = (index, key, value) => {
    const newRooms = [...rooms];
    if (BED_TYPES.includes(key)) {
      newRooms[index].beds[key] = value;
    } else {
      newRooms[index][key] = value;
    }
    setRooms(newRooms);
  };

  const handleNext = () => {
    Alert.alert('Property Data', JSON.stringify({ ...prevData, rooms }, null, 2));
    navigation.navigate('CreateDescriptionScreen', { data: { ...prevData, rooms } });
  };

  const totalBeds = rooms.reduce(
    (sum, room) => sum + Object.values(room.beds).reduce((a, b) => a + b, 0),
    0
  );

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
            <RoomCard room={item} index={index} updateRoom={updateRoom} />
          )}
          keyExtractor={(_, i) => `room-${i}`}
          contentContainerStyle={styles.listContent}
        />

        {/* Buttons Row */}
        <View style={styles.buttonRow}>
          {/* Back Button */}
          <TouchableOpacity style={styles.rowButton} onPress={() => navigation.goBack()}>
            <Text style={styles.nextButtonText}>Back</Text>
          </TouchableOpacity>

          {/* Next Button */}
          <TouchableOpacity style={styles.rowButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RoomsScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#f8f9fa' },

  counterSection: { backgroundColor: '#fff', padding: 20, marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#e9ecef' },
  counterLabel: { fontSize: 16, fontWeight: '600', color: '#212529', marginBottom: 16, justifyContent: 'center' },
  counterContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8f9fa', borderRadius: 12, padding: 8 },
  counterActionButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#ff385c', justifyContent: 'center', alignItems: 'center' },
  counterActionText: { fontSize: 24, fontWeight: '600', color: '#fff', lineHeight: 28 },
  roomCountContainer: { alignItems: 'center' },
  roomCount: { fontSize: 32, fontWeight: '700', color: '#212529' },
  roomLabel: { fontSize: 12, color: '#6c757d', fontWeight: '500', marginTop: -4 },
  listContent: { padding: 16 },

  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  roomNumberBadge: { backgroundColor: '#ff385c', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  roomNumberText: { color: '#fff', fontWeight: '600', fontSize: 14 },

  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#212529', marginBottom: 12 },
  optionRow: { flexDirection: 'row', gap: 12 },
  optionButton: { flex: 1, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, borderWidth: 1, borderColor: '#dee2e6', alignItems: 'center', backgroundColor: '#fff' },
  optionButtonActive: { backgroundColor: '#fff0f3', borderColor: '#ff385c' },
  optionText: { fontSize: 14, fontWeight: '500', color: '#495057' },
  optionTextActive: { color: '#ff385c', fontWeight: '600' },

  counterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingVertical: 8 },
  bedTypeLabel: { fontSize: 15, color: '#495057', flex: 1 },
  counterControls: { flexDirection: 'row', alignItems: 'center' },
  counterButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f8f9fa', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e9ecef' },
  counterDisplay: { width: 40, alignItems: 'center' },
  counterText: { fontSize: 16, fontWeight: '600', color: '#212529' },

  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 16, marginVertical: 20 },
  rowButton: {
    flex: 1,
    backgroundColor: '#ff385c',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    
    
  },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});




