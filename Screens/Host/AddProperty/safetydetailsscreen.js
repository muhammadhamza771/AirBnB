import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { PropertyContext } from '../../../context/PropertyContext';
import { AuthContext } from '../../../context/AuthContext';
import { createProperty, updateProperty, BASE_URL } from '../../../BackendServices/Apiservices';
import RNFS from 'react-native-fs';

const primaryColor = '#FF385C';

export default function SafetyDetailsScreen({ navigation }) {
  const { propertyData, resetPropertyData, updatePropertyData, isEditing, editingPropertyId } = useContext(PropertyContext);
  const { user: authUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const [safetyItems, setSafetyItems] = useState({
    exteriorCamera: propertyData?.safety?.exteriorCamera || false,
    noiseMonitor: propertyData?.safety?.noiseMonitor || false,
    weapons: propertyData?.safety?.weapons || false,
  });

  const toggleItem = (key) => {
    const updatedItems = {
      ...safetyItems,
      [key]: !safetyItems[key]
    };
    setSafetyItems(updatedItems);
    updatePropertyData('safety', updatedItems);
  };

  const convertToBase64 = async (imageUri) => {
    if (!imageUri) return '';
    
    // Already base64
    if (imageUri.startsWith('data:image')) return imageUri;
    
    // Already uploaded path
    if (imageUri.startsWith('/uploads/property')) return imageUri;
    
    try {
      setUploadProgress(`Converting: ${imageUri.split('/').pop()}`);
      
      // Read file as base64
      const base64Data = await RNFS.readFile(imageUri, 'base64');
      
      // Detect mime type
      const extension = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
      const mimeType = extension === 'png' ? 'image/png' : 
                      extension === 'gif' ? 'image/gif' : 
                      extension === 'jpg' || extension === 'jpeg' ? 'image/jpeg' : 'image/jpeg';
      
      return `data:${mimeType};base64,${base64Data}`;
    } catch (error) {
      console.log('❌ Conversion error:', error);
      return '';
    }
  };

  const processAllImages = async (data) => {
    const processed = { ...data };
    let imageCount = 0;

    // 1. Main image
    if (processed.image && processed.image.startsWith('file://')) {
      processed.image = await convertToBase64(processed.image);
      if (processed.image) imageCount++;
    }

    // 2. Media images
    if (processed.media) {
      // Cover image
      if (processed.media.coverImage && processed.media.coverImage.startsWith('file://')) {
        processed.media.coverImage = await convertToBase64(processed.media.coverImage);
        if (processed.media.coverImage) imageCount++;
      }

      // House images
      if (processed.media.houseImages?.length > 0) {
        const convertedHouseImages = [];
        for (const img of processed.media.houseImages) {
          if (img.startsWith('file://')) {
            const base64 = await convertToBase64(img);
            convertedHouseImages.push(base64);
            if (base64) imageCount++;
          } else {
            convertedHouseImages.push(img);
          }
        }
        processed.media.houseImages = convertedHouseImages;
      }
    }

    // 3. Room images
    if (processed.rooms?.length > 0) {
      for (const room of processed.rooms) {
        if (room.images) {
          // Room image
          if (room.images.room && room.images.room.startsWith('file://')) {
            room.images.room = await convertToBase64(room.images.room);
            if (room.images.room) imageCount++;
          }
          // Bathroom image
          if (room.images.bathroom && room.images.bathroom.startsWith('file://')) {
            room.images.bathroom = await convertToBase64(room.images.bathroom);
            if (room.images.bathroom) imageCount++;
          }
        }
      }
    }

    console.log(`✅ Converted ${imageCount} images to base64`);
    return processed;
  };

  // ✅ Validate payload before sending
  const validatePayload = (payload) => {
    const required = ['user_id', 'name', 'propertyType', 'price'];
    const missing = required.filter(field => !payload[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
    
    // Check for circular references by attempting to stringify
    try {
      JSON.stringify(payload);
    } catch (e) {
      throw new Error('Payload contains circular references');
    }
    
    return true;
  };

  const handleUploadProperty = async () => {
    // Auth check
    if (!authUser?.id) {
      Alert.alert('Error', 'Please login first');
      navigation.navigate('Login');
      return;
    }

    if (!propertyData.propertyType) {
      Alert.alert('Missing', 'Property type required');
      return;
    }
    if (!propertyData.pricing?.basePrice) {
      Alert.alert('Missing', 'Price required');
      return;
    }

    setLoading(true);
    setUploadProgress('Converting images...');

    try {
      // Step 1: Convert all images to base64
      const processedData = await processAllImages(propertyData);
      
      setUploadProgress('Uploading to server...');
      
      const payload = {
        user_id: authUser.id,
        name: propertyData.name,
        propertyType: processedData.propertyType,
        structure: processedData.structure || '',
        placeType: processedData.placeType || '',
        status: 'active',
        isActive: true,
        price: Number(processedData.pricing?.basePrice) || 0,
        image: processedData.image || '',
        
        guests: processedData.guests || { adults: 1, children: 0, infants: 0 },
        rooms: processedData.rooms || [],
        amenities: processedData.amenities || [],
        location: processedData.location || { country: '', city: '' },
        media: processedData.media || { coverImage: '', houseImages: [] },
        description_data: processedData.description_data || {},
        pets_and_habits: processedData.pets_and_habits || {},
        policies: processedData.policies || { bookingType: 'Booking Request' },
        pricing: {
          basePrice: Number(processedData.pricing?.basePrice) || 0,
          cleaningFee: Number(processedData.pricing?.cleaningFee) || 0,
          serviceFee: Number(processedData.pricing?.serviceFee) || 0,
          discounts: processedData.pricing?.discounts || {},
          flexibleRates: processedData.pricing?.flexibleRates || {}
        },
        safety: safetyItems,
        services: processedData.services || [],
        available_from: processedData.available_from || '',
        available_to: processedData.available_to || ''
      };

      // Log payload summary
      console.log('📤 Payload summary:', {
        userId: payload.user_id,
        name: payload.name,
        price: payload.price,
        isEditing: isEditing,
        propertyId: editingPropertyId
      });

      // Validate payload
      validatePayload(payload);
      
      let response;
      
      // ✅ CHECK IF EDITING MODE - UPDATE PROPERTY
      if (isEditing && editingPropertyId) {
        console.log(`📝 UPDATING property ID: ${editingPropertyId}`);
        setUploadProgress(`Updating property #${editingPropertyId}...`);
        response = await updateProperty(editingPropertyId, payload);
        console.log('✅ Update successful:', response);
      } 
      // ✅ ELSE - CREATE NEW PROPERTY
      else {
        console.log('🆕 CREATING new property');
        setUploadProgress('Creating new property...');
        response = await createProperty(payload);
        console.log('✅ Create successful:', response);
      }
      
      setUploadProgress('');
      
      Alert.alert(
        'Success',
        isEditing 
          ? `Property updated successfully!\nID: ${editingPropertyId}`
          : `Property uploaded successfully!\nID: ${response.property_id}`,
        [
          {
            text: 'OK',
            onPress: () => {
              resetPropertyData();
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: "My Properties"
                  }
                ]
              });
            }
          }
        ]
      );

    } catch (error) {
      console.log('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });
      
      let message = isEditing ? 'Update failed.\n' : 'Upload failed.\n';
      
      if (error.response?.status === 422) {
        const detail = error.response.data.detail;
        if (Array.isArray(detail)) {
          message = detail.map(err => 
            `${err.loc.join('.')}: ${err.msg}`
          ).join('\n');
        } else if (typeof detail === 'object') {
          message += JSON.stringify(detail);
        } else {
          message += 'Validation error: ' + (detail || 'Invalid data');
        }
      } else if (error.response?.status === 413) {
        message = 'Images too large. Please compress and try again.';
      } else if (error.response?.status === 500) {
        message += `Server error: ${error.response.data?.detail || 'Internal server error'}`;
      } else if (error.response) {
        message += `Server error (${error.response.status})`;
      } else if (error.request) {
        message += `Cannot connect to server.\nPlease check if server is running at ${BASE_URL}`;
      } else {
        message += error.message;
      }
      
      Alert.alert(isEditing ? 'Update Error' : 'Upload Error', message);
    } finally {
      setLoading(false);
      setUploadProgress('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Safety details</Text>
        {isEditing && (
          <View style={styles.editBadge}>
            <Text style={styles.editBadgeText}>EDITING MODE</Text>
          </View>
        )}
      </View>

      {uploadProgress !== '' && (
        <View style={styles.progressContainer}>
          <ActivityIndicator size="small" color={primaryColor} />
          <Text style={styles.progressText}>{uploadProgress}</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.mainTitle}>Share safety details</Text>
        <Text style={styles.subtitle}>
          Guests want to know they'll be safe in your home.
        </Text>

        {Object.keys(safetyItems).map((key) => (
          <TouchableOpacity key={key} style={styles.checklistItem} onPress={() => toggleItem(key)}>
            <View style={styles.checkboxContainer}>
              <View style={[styles.checkbox, safetyItems[key] && styles.checked]}>
                {safetyItems[key] && <Icon name="check" size={20} color="#fff" />}
              </View>
              <Text style={styles.label}>
                {key === 'exteriorCamera' ? 'Exterior security camera' :
                 key === 'noiseMonitor' ? 'Noise decibel monitor' :
                 'Weapons present'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.noteContainer}>
          <Icon name="info-outline" size={20} color="#666" />
          <Text style={styles.noteText}>
            You must disclose all safety features
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <TouchableOpacity onPress={() => navigation.goBack()} disabled={loading}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.nextBtn, loading && styles.disabledBtn]} 
          onPress={handleUploadProperty}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingContent}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.nextText}> {uploadProgress}</Text>
            </View>
          ) : (
            <Text style={styles.nextText}>
              {isEditing ? 'Update Property' : 'Upload Property'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
 header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: primaryColor,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,

    
  },
  headerTitle: { fontSize: 20, fontWeight: '600',textAlign:'center' },
  editBadge: {
    backgroundColor: primaryColor,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  editBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 6,
    gap: 6,
  },
  userText: { fontSize: 12, color: '#666' },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 8,
  },
  progressText: { fontSize: 12, color: '#856404', flex: 1 },
  scroll: { padding: 20, paddingBottom: 100 },
  mainTitle: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30 },
  checklistItem: { marginBottom: 16 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checked: { backgroundColor: primaryColor, borderColor: primaryColor },
  label: { fontSize: 16, flex: 1 },
  noteContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    gap: 12,
  },
  noteText: { flex: 1, fontSize: 14, color: '#666' },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  backText: { fontSize: 16, fontWeight: '500', color: '#666' },
  nextBtn: {
    backgroundColor: primaryColor,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    minWidth: 150,
    alignItems: 'center',
  },
  disabledBtn: { backgroundColor: '#ccc' },
  nextText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  loadingContent: { flexDirection: 'row', alignItems: 'center' },
});