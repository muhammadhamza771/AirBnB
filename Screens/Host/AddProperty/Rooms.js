import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Switch,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { PropertyContext } from '../../../context/PropertyContext';

const { width } = Dimensions.get('window');

// Simple bed types
const BED_TYPES = ['Queen Bed', 'Single Bed', 'Double Bed', 'Mattress'];

// Simple washroom types
const WASHROOM_TYPES = ['Attached', 'Shared'];

// Room Card Component
const RoomCard = ({ room, index, updateRoom }) => {

  // Function to pick image from gallery
  const pickImage = (imageType) => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false, // Don't convert to base64 here
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets && response.assets.length > 0) {
        const imageUri = response.assets[0].uri;
        console.log(`📸 Image selected for ${imageType}:`, imageUri);
        
        // Save image in room data
        if (imageType === 'room') {
          updateRoom(index, 'roomImage', imageUri);
        } else {
          updateRoom(index, 'bathroomImage', imageUri);
        }
      }
    });
  };

  return (
    <View style={styles.card}>

      {/* Room Number Badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Room {index + 1}</Text>
      </View>

      {/* WASHROOM TYPE */}
      <View style={styles.section}>
        <Text style={styles.label}>Washroom Type</Text>
        <View style={styles.row}>
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

      {/* ROOM LOCK */}
      <View style={styles.section}>
        <Text style={styles.label}>Room Lock</Text>
        <View style={styles.row}>
          {['Yes', 'No'].map(val => (
            <TouchableOpacity
              key={val}
              style={[
                styles.optionButton,
                room.hasLock === (val === 'Yes') && styles.optionButtonActive,
              ]}
              onPress={() => updateRoom(index, 'hasLock', val === 'Yes')}
            >
              <Text
                style={[
                  styles.optionText,
                  room.hasLock === (val === 'Yes') && styles.optionTextActive,
                ]}
              >
                {val}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* BEDS COUNT */}
      <View style={styles.section}>
        <Text style={styles.label}>Beds</Text>

        {BED_TYPES.map(type => {
          // Hide mattress if not showing
          if (type === 'Mattress' && !room.showMattress) return null;

          return (
            <View key={type} style={styles.bedRow}>
              <Text style={styles.bedName}>{type}</Text>

              <View style={styles.counter}>
                {/* Minus Button */}
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => {
                    const currentCount = room.beds[type] || 0;
                    if (currentCount > 0) {
                      updateRoom(index, type, currentCount - 1);
                    }
                  }}
                >
                  <Text style={styles.counterText}>-</Text>
                </TouchableOpacity>

                {/* Count Display */}
                <Text style={styles.count}>{room.beds[type] || 0}</Text>

                {/* Plus Button */}
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => {
                    const currentCount = room.beds[type] || 0;
                    updateRoom(index, type, currentCount + 1);
                  }}
                >
                  <Text style={styles.counterText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>

      {/* SHOW MATTRESS TOGGLE */}
      <View style={styles.toggleRow}>
        <Text style={styles.label}>Show Mattress</Text>
        <Switch
          value={room.showMattress}
          onValueChange={(val) => updateRoom(index, 'showMattress', val)}
          trackColor={{ false: '#ccc', true: '#ff385c' }}
        />
      </View>

      {/* IMAGES SECTION */}
      <View style={styles.imagesSection}>
        <Text style={styles.label}>Room Photos</Text>
        
        <View style={styles.imageRow}>

          {/* Room Image */}
          <View style={styles.imageBox}>
            <TouchableOpacity 
              style={styles.imageContainer}
              onPress={() => pickImage('room')}
            >
              {room.roomImage ? (
                <Image source={{ uri: room.roomImage }} style={styles.image} />
              ) : (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderIcon}>🛏️</Text>
                  <Text style={styles.placeholderText}>Add Room Photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Bathroom Image */}
          <View style={styles.imageBox}>
            <TouchableOpacity 
              style={styles.imageContainer}
              onPress={() => pickImage('bathroom')}
            >
              {room.bathroomImage ? (
                <Image source={{ uri: room.bathroomImage }} style={styles.image} />
              ) : (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderIcon}>🚿</Text>
                  <Text style={styles.placeholderText}>Add Bathroom Photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

        </View>
      </View>

    </View>
  );
};

// Main Screen
const RoomsScreen = ({ navigation }) => {
  
  const { updatePropertyData, propertyData } = useContext(PropertyContext);

  // Initial room data from context if exists
  const [rooms, setRooms] = useState(() => {
    // Agar context mein already rooms hain to unhe load karo
    if (propertyData.rooms && propertyData.rooms.length > 0) {
      // Convert backend format to local format
      return propertyData.rooms.map(room => ({
        washroom: room.bathroomType || 'Attached',
        beds: (room.beds || []).reduce((acc, bed) => {
          const bedType = bed.type === 'Single' ? 'Single Bed' : 
                         bed.type === 'Queen' ? 'Queen Bed' :
                         bed.type === 'Double' ? 'Double Bed' : 'Mattress';
          acc[bedType] = bed.count;
          return acc;
        }, {}),
        showMattress: room.extraMattress?.allowed || false,
        hasLock: room.hasLock || false,
        roomImage: room.images?.room || null,
        bathroomImage: room.images?.bathroom || null,
      }));
    }
    
    // Default room
    return [{
      washroom: 'Attached',
      beds: {},
      showMattress: false,
      hasLock: false,
      roomImage: null,
      bathroomImage: null,
    }];
  });

  // Add new room
  const addRoom = () => {
    setRooms([
      ...rooms,
      {
        washroom: 'Attached',
        beds: {},
        showMattress: false,
        hasLock: false,
        roomImage: null,
        bathroomImage: null,
      },
    ]);
  };

  // Remove last room
  const removeRoom = () => {
    if (rooms.length > 1) {
      setRooms(rooms.slice(0, -1));
    } else {
      Alert.alert('Cannot Remove', 'At least one room is required');
    }
  };

  // Update room data
  const updateRoom = (index, key, value) => {
    const updatedRooms = [...rooms];
    
    // Check if key is bed type
    if (BED_TYPES.includes(key)) {
      if (!updatedRooms[index].beds) {
        updatedRooms[index].beds = {};
      }
      updatedRooms[index].beds[key] = value;
    } else {
      updatedRooms[index][key] = value;
    }
    
    setRooms(updatedRooms);
    
    // Debug log
    console.log(`🔄 Room ${index + 1} updated:`, {
      [key]: value,
      roomImage: updatedRooms[index].roomImage ? '✅' : '❌',
      bathroomImage: updatedRooms[index].bathroomImage ? '✅' : '❌'
    });
  };

  // Save and go next
  const handleNext = () => {
    // Validate at least one bed selected
    const hasBeds = rooms.some(room => 
      Object.values(room.beds).some(count => count > 0)
    );
    
    if (!hasBeds) {
      Alert.alert('Error', 'Please add at least one bed in any room');
      return;
    }

    // Format rooms for backend
    const formattedRooms = rooms.map((room, index) => {
      console.log(`🖼️ Processing Room ${index + 1} images:`, {
        roomImage: room.roomImage || 'No image',
        bathroomImage: room.bathroomImage || 'No image'
      });

      // Convert beds object → array format
      const bedsArray = Object.keys(room.beds || {})
        .filter(type => room.beds[type] > 0)
        .map(type => ({
          type: type.replace(' Bed', '').replace('Mattress', 'Single'),
          count: room.beds[type],
          image: "" // Bed images not needed in this screen
        }));

      // Return formatted room with images
      return {
        id: Date.now() + index,
        name: `Room ${index + 1}`,
        type: "Bedroom",
        bathroomType: room.washroom,
        beds: bedsArray,
        images: {
          room: room.roomImage || "", // Room image URI
          bathroom: room.bathroomImage || "", // Bathroom image URI
        },
        extraMattress: {
          allowed: room.showMattress,
          count: room.beds?.Mattress || 0,
        },
        hasLock: room.hasLock,
      };
    });

    // Debug log before saving
    console.log('📦 Saving to context:', formattedRooms.map(room => ({
      name: room.name,
      roomImage: room.images.room ? '✅' : '❌',
      bathroomImage: room.images.bathroom ? '✅' : '❌'
    })));

    // ✅ Save backend-compatible structure with images
    updatePropertyData('rooms', formattedRooms);

    // Navigate to next screen
    navigation.navigate('CreateDescriptionScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rooms Details</Text>
      
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Room Counter */}
        <View style={styles.counterCard}>
          <Text style={styles.counterLabel}>Total Rooms</Text>
          
          <View style={styles.counterControls}>
            <TouchableOpacity style={styles.counterBtn} onPress={removeRoom}>
              <Text style={styles.counterBtnText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.roomCount}>{rooms.length}</Text>

            <TouchableOpacity style={styles.counterBtn} onPress={addRoom}>
              <Text style={styles.counterBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* All Rooms */}
        {rooms.map((room, index) => (
          <RoomCard
            key={index}
            room={room}
            index={index}
            updateRoom={updateRoom}
          />
        ))}

        {/* Extra Space */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  // ===== HEADER =====
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FF385C',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  backIcon: { marginRight: 12 },
  headerTextContainer: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' ,textAlign:'center'},
  headerSubtitle: { fontSize: 14, color: '#FFDDE0', marginTop: 2 },

  // Counter Card
  counterCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  counterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: '#666',
  },

  counterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  counterBtn: {
    backgroundColor: '#ff385c',
    width: 45,
    height: 45,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },

  counterBtnText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },

  roomCount: {
    fontSize: 28,
    fontWeight: 'bold',
    marginHorizontal: 25,
    color: '#333',
  },

  // Room Card
  card: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 5,
    padding: 18,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  badge: {
    backgroundColor: '#ff385c',
    padding: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },

  badgeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  // Common Section
  section: {
    marginBottom: 20,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
    color: '#555',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  optionButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },

  optionButtonActive: {
    borderColor: '#ff385c',
    backgroundColor: '#fff0f3',
  },

  optionText: {
    color: '#666',
    fontSize: 14,
  },

  optionTextActive: {
    color: '#ff385c',
    fontWeight: '600',
  },

  // Bed Row
  bedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  bedName: {
    fontSize: 14,
    color: '#555',
  },

  counter: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  counterButton: {
    backgroundColor: '#f1f1f1',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  counterText: {
    fontSize: 18,
    color: '#333',
  },

  count: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '600',
    minWidth: 25,
    textAlign: 'center',
  },

  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },

  // Images Section
  imagesSection: {
    marginTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
  },

  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  imageBox: {
    width: '48%',
  },

  imageContainer: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  placeholder: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderIcon: {
    fontSize: 24,
    marginBottom: 5,
  },

  placeholderText: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
  },

  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },

  backButton: {
    padding: 15,
  },

  backText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },

  nextButton: {
    backgroundColor: '#ff385c',
    padding: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },

  nextText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default RoomsScreen;