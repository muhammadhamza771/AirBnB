import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Modal,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { PropertyContext } from '../../../context/PropertyContext';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - 72) / 3;

const PropertyImageUpload = ({ navigation }) => {
  const { updateMultiple, propertyData, updateNestedProperty } = useContext(PropertyContext);

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Load existing images from context on mount
  useEffect(() => {
    console.log('📸 Loading existing images from context...');
    
    if (propertyData.media?.houseImages || propertyData.media?.coverImage) {
      const initialImages = [];
      
      // Add cover image first
      if (propertyData.media.coverImage) {
        console.log('✅ Found cover image:', propertyData.media.coverImage.substring(0, 50) + '...');
        initialImages.push({ 
          uri: propertyData.media.coverImage,
          isCover: true 
        });
      }
      
      // Add house images
      if (propertyData.media.houseImages?.length > 0) {
        console.log(`✅ Found ${propertyData.media.houseImages.length} house images`);
        propertyData.media.houseImages.forEach((uri, index) => {
          initialImages.push({ 
            uri: uri,
            isCover: false 
          });
        });
      }
      
      setImages(initialImages);
      console.log(`📊 Total images loaded: ${initialImages.length}`);
    } else {
      console.log('ℹ️ No existing images found in context');
    }
  }, []);

  // Take photo with camera
  const takePhoto = () => {
    setModalVisible(false);

    launchCamera(
      { 
        mediaType: 'photo', 
        quality: 0.8, 
        saveToPhotos: true,
        includeBase64: false, // Don't convert to base64 here
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled camera');
          return;
        }
        if (response.errorCode) {
          console.log('Camera error:', response.errorMessage);
          return;
        }
        
        if (response.assets?.length > 0) {
          const newImage = { 
            uri: response.assets[0].uri,
            isCover: images.length === 0 // First image becomes cover
          };
          console.log('📸 New photo taken:', newImage.uri.substring(0, 50) + '...');
          setImages(prev => [...prev, newImage]);
        }
      }
    );
  };

  // Choose from gallery
  const chooseFromGallery = () => {
    setModalVisible(false);

    launchImageLibrary(
      { 
        mediaType: 'photo', 
        quality: 0.8, 
        selectionLimit: 10 - images.length,
        includeBase64: false,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled gallery');
          return;
        }
        if (response.errorCode) {
          console.log('Gallery error:', response.errorMessage);
          return;
        }
        
        if (response.assets?.length > 0) {
          console.log(`📸 Selected ${response.assets.length} images from gallery`);
          
          const newImages = response.assets.map((asset, index) => ({
            uri: asset.uri,
            isCover: images.length === 0 && index === 0 // First image becomes cover if no images exist
          }));
          
          setImages(prev => {
            const updated = [...prev, ...newImages].slice(0, 10);
            // Ensure first image is marked as cover
            if (updated.length > 0) {
              updated[0].isCover = true;
            }
            return updated;
          });
        }
      }
    );
  };

  // Remove image
  const removeImage = index => {
    console.log(`🗑️ Removing image at index ${index}`);
    setImages(prev => {
      const filtered = prev.filter((_, i) => i !== index);
      // Update cover badge - first image becomes cover
      if (filtered.length > 0) {
        filtered[0].isCover = true;
      }
      return filtered;
    });
  };

  // Set as cover photo
  const setCoverPhoto = index => {
    if (index === 0) {
      Alert.alert('Info', 'This is already the cover photo');
      return;
    }
    
    console.log(`⭐ Setting image at index ${index} as cover`);
    
    const newImages = [...images];
    // Remove cover badge from all images
    newImages.forEach(img => img.isCover = false);
    // Set selected image as cover
    newImages[index].isCover = true;
    
    // Move cover image to front
    const cover = newImages.splice(index, 1)[0];
    newImages.unshift(cover);
    
    setImages(newImages);
  };

  // Handle next - Save to context
  const handleNext = () => {
    if (images.length < 5) {
      Alert.alert(
        'Add More Photos', 
        `Add ${5 - images.length} more photos to continue.\nMinimum 5 photos required.`
      );
      return;
    }

    setUploading(true);

    try {
      // Prepare media object for context
      const coverImage = images.find(img => img.isCover)?.uri || images[0]?.uri;
      const houseImages = images
        .filter((_, index) => index > 0) // All except first
        .map(img => img.uri);

      console.log('📦 Saving to context:');
      console.log('- Cover image:', coverImage ? coverImage.substring(0, 50) + '...' : 'None');
      console.log(`- House images: ${houseImages.length}`);
      
      // Log first few house images
      houseImages.slice(0, 3).forEach((uri, i) => {
        console.log(`  House ${i + 1}:`, uri.substring(0, 50) + '...');
      });

      // Update context with multiple values
      updateMultiple({
        media: {
          coverImage: coverImage || '',
          houseImages: houseImages,
        },
      });

      // Also update image field for backward compatibility
      updateNestedProperty('media', 'coverImage', coverImage || '');
      updateNestedProperty('media', 'houseImages', houseImages);

      console.log('✅ Images saved to context successfully!');
      
      setTimeout(() => {
        setUploading(false);
        navigation.navigate('PriceScreen');
      }, 500);
      
    } catch (error) {
      console.log('❌ Error saving images:', error);
      Alert.alert('Error', 'Failed to save images. Please try again.');
      setUploading(false);
    }
  };

  // Render image item
  const renderImageItem = (item, index) => (
    <TouchableOpacity
      key={index}
      style={styles.imageContainer}
      onLongPress={() => {
        Alert.alert(
          'Image Options',
          'Choose an action',
          [
            index !== 0 && { 
              text: 'Set as Cover', 
              onPress: () => setCoverPhoto(index) 
            },
            { 
              text: 'Remove', 
              style: 'destructive', 
              onPress: () => removeImage(index) 
            },
            { text: 'Cancel', style: 'cancel' },
          ].filter(Boolean)
        );
      }}
      onPress={() => {
        // Quick preview - show image options on tap too
        Alert.alert(
          'Image',
          `Photo ${index + 1}`,
          [
            { text: 'View Full Screen', onPress: () => console.log('Preview not implemented') },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
      }}
    >
      <Image source={{ uri: item.uri }} style={styles.image} />
      {item.isCover && (
        <View style={styles.coverBadge}>
          <Text style={styles.coverText}>COVER</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Add property photos</Text>
     
        
        {/* Image count indicator */}
        <View style={styles.countContainer}>
        
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(images.length / 10) * 100}%` }
              ]} 
            />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.grid}>
          {/* Add button - only if less than 10 images */}
          {images.length < 10 && (
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.addText}>+</Text>
            </TouchableOpacity>
          )}
          
          {/* Render all images */}
          {images.map(renderImageItem)}
        </View>

        {uploading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#f51414" />
            <Text style={styles.loadingText}>Saving images...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.nextBtn, 
            images.length < 5 && styles.disabledBtn
          ]}
          disabled={images.length < 5 || uploading}
          onPress={handleNext}
        >
          <Text style={styles.nextText}>
            {uploading ? 'Saving...' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Image source modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add Photo</Text>
            
            <TouchableOpacity style={styles.modalOption} onPress={takePhoto}>
              <Text style={styles.modalOptionText}>📸 Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.modalOption} onPress={chooseFromGallery}>
              <Text style={styles.modalOptionText}>🖼️ Choose From Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalOption, styles.cancelOption]} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PropertyImageUpload;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  
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
  
  title: { 
    fontSize: 20, 
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
  },
  
  subtitle: { 
    color: '#666', 
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  
  countContainer: {
    marginTop: 8,
  },
  
  countText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  
  progressBar: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: '#f51414',
  },
  
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between',
    gap: 8,
  },
  
  addButton: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#fafafa',
  },
  
  addText: { 
    fontSize: 32,
    color: '#666',
  },
  
  imageContainer: { 
    width: IMAGE_SIZE, 
    height: IMAGE_SIZE, 
    borderRadius: 12, 
    overflow: 'hidden', 
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  
  image: { 
    width: '100%', 
    height: '100%' 
  },
  
  coverBadge: { 
    position: 'absolute', 
    top: 6, 
    left: 6, 
    backgroundColor: '#f51414', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  
  coverText: { 
    color: '#fff', 
    fontSize: 10, 
    fontWeight: '600',
  },
  
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  
  back: { 
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    padding: 8,
  },
  
  nextBtn: { 
    backgroundColor: '#f51414', 
    paddingHorizontal: 32, 
    paddingVertical: 14, 
    borderRadius: 12,
  },
  
  disabledBtn: {
    backgroundColor: '#ccc',
  },
  
  nextText: { 
    color: '#fff', 
    fontWeight: '600',
    fontSize: 16,
  },
  
  modalOverlay: { 
    flex: 1, 
    justifyContent: 'flex-end', 
    backgroundColor: 'rgba(0,0,0,0.5)' 
  },
  
  modalBox: { 
    backgroundColor: '#fff', 
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  
  modalOption: { 
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  
  modalOptionText: {
    fontSize: 16,
    color: '#222',
  },
  
  cancelOption: {
    borderBottomWidth: 0,
    marginTop: 8,
  },
  
  cancelText: {
    fontSize: 16,
    color: '#f51414',
    textAlign: 'center',
    fontWeight: '500',
  },
});