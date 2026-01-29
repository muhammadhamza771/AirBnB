import React, { useState, useEffect } from 'react';
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
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - 72) / 3;

const PropertyImageUpload = ({ navigation, route }) => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const prevData = route?.params?.data || {};

  useEffect(() => {
    
  }, []);

 
        
     

  const takePhoto = () => {
    setModalVisible(false);
    
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1200,
      maxHeight: 900,
      saveToPhotos: true,
      cameraType: 'back',
      includeBase64: false,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        Alert.alert('Error', `Camera Error: ${response.errorMessage}`);
      } else if (response.assets && response.assets.length > 0) {
        const image = response.assets[0];
        const newImage = {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: image.fileName || `photo_${Date.now()}.jpg`,
          width: image.width,
          height: image.height,
          fileSize: image.fileSize,
        };
        setImages(prev => [...prev, newImage]);
      }
    });
  };

  const chooseFromGallery = () => {
    setModalVisible(false);
    
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1200,
      maxHeight: 900,
      selectionLimit: 10 - images.length,
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('Error', `Gallery Error: ${response.errorMessage}`);
      } else if (response.assets && response.assets.length > 0) {
        const newImages = response.assets.map((image, index) => ({
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: image.fileName || `photo_${Date.now()}_${index}.jpg`,
          width: image.width,
          height: image.height,
          fileSize: image.fileSize,
        }));
        setImages(prev => [...prev, ...newImages].slice(0, 10)); // Limit to 10 images
      }
    });
  };

  const removeImage = (index) => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const newImages = images.filter((_, i) => i !== index);
            setImages(newImages);
            
            // Update selected image index
            if (selectedImage === index) {
              setSelectedImage(null);
            } else if (selectedImage > index && selectedImage > 0) {
              setSelectedImage(selectedImage - 1);
            }
          },
        },
      ]
    );
  };

  const setCoverPhoto = (index) => {
    if (index === 0) return;
    
    const newImages = [...images];
    const coverImage = newImages.splice(index, 1)[0];
    newImages.unshift(coverImage);
    setImages(newImages);
    setSelectedImage(0);
    
    Alert.alert('Success', 'Cover photo updated!');
  };

  const handleNext = () => {
    if (images.length < 5) {
      Alert.alert(
        'Add More Photos',
        `Add ${5 - images.length} more photos to continue. High-quality photos help your listing stand out.`,
        [
          { text: 'Add Photos', onPress: () => setModalVisible(true) },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }

    setUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      setUploading(false);
      const finalData = {
        ...prevData,
        propertyImages: images,
      };
      
      // Navigate to next screen or show success
      Alert.alert('Success', `${images.length} photos uploaded successfully!`);
      
      // Example: navigation.navigate('NextScreen', { data: finalData });
    }, 1500);
  };

  const renderImageItem = (item, index) => (
    <TouchableOpacity
      key={`image-${index}`}
      style={styles.imageContainer}
      onPress={() => setSelectedImage(index === selectedImage ? null : index)}
      onLongPress={() => {
        Alert.alert(
          'Photo Options',
          'What would you like to do with this photo?',
          [
            { text: 'Cancel', style: 'cancel' },
            index === 0 
              ? null 
              : { text: 'Set as Cover', onPress: () => setCoverPhoto(index) },
            { text: 'Remove', style: 'destructive', onPress: () => removeImage(index) },
          ].filter(Boolean)
        );
      }}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: item.uri }} 
        style={styles.image}
        resizeMode="cover"
      />
      
      {index === 0 && (
        <View style={styles.coverBadge}>
          <Text style={styles.coverText}>COVER</Text>
        </View>
      )}
      
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeImage(index)}
      >
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
      
      {selectedImage === index && (
        <View style={styles.selectedOverlay} />
      )}
      
      {index > 1 && (
        <TouchableOpacity
          style={styles.reorderButton}
          onPress={() => {/* Implement reorder functionality */}}
        >
          <Text style={styles.reorderIcon}>⋮⋮</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const renderModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Photos</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeIcon}>×</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={styles.modalOption}
            onPress={takePhoto}
          >
            <Text style={styles.modalOptionIcon}>📷</Text>
            <View style={styles.modalOptionText}>
              <Text style={styles.modalOptionTitle}>Take a photo</Text>
              <Text style={styles.modalOptionSubtitle}>Use your camera</Text>
            </View>
            <Text style={styles.chevronIcon}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.modalOption}
            onPress={chooseFromGallery}
          >
            <Text style={styles.modalOptionIcon}>🖼️</Text>
            <View style={styles.modalOptionText}>
              <Text style={styles.modalOptionTitle}>Choose from gallery</Text>
              <Text style={styles.modalOptionSubtitle}>Select from your photos</Text>
            </View>
            <Text style={styles.chevronIcon}>›</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.stepIndicator}>Step 7 of 13</Text>
        <Text style={styles.title}>Add photos of your property</Text>
        <Text style={styles.subtitle}>
          Guests love photos! Add at least 5 to get started. You can add more or make changes later.
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Photo Requirements */}
        <View style={styles.requirementsCard}>
          <Text style={styles.requirementIcon}>📷</Text>
          <View style={styles.requirementsContent}>
            <Text style={styles.requirementsTitle}>Photo requirements</Text>
            <Text style={styles.requirementsText}>
              • High-quality photos (well-lit, clear)
            </Text>
            <Text style={styles.requirementsText}>
              • Show all rooms and amenities
            </Text>
            <Text style={styles.requirementsText}>
              • Include exterior shots
            </Text>
            <Text style={styles.requirementsText}>
              • No promotional text or watermarks
            </Text>
          </View>
        </View>

        {/* Image Grid Section */}
        <View style={styles.imagesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Your photos ({images.length}/10)
            </Text>
            <Text style={styles.sectionSubtitle}>
              First photo will be your cover photo
            </Text>
          </View>

          <View style={styles.imagesGrid}>
            {/* Add Photo Button */}
            {images.length < 10 && (
              <TouchableOpacity
                style={styles.addPhotoButton}
                onPress={() => setModalVisible(true)}
                disabled={uploading}
              >
                <View style={styles.addPhotoContent}>
                  <Text style={styles.addPhotoIcon}>+</Text>
                  <Text style={styles.addPhotoText}>Add photos</Text>
                  <Text style={styles.addPhotoSubtext}>
                    {images.length < 5 
                      ? `${5 - images.length} more needed` 
                      : `Up to ${10 - images.length} more`}
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {/* Existing Images */}
            {images.map((item, index) => renderImageItem(item, index))}
          </View>

          {/* Upload Progress */}
          {uploading && (
            <View style={styles.uploadProgress}>
              <ActivityIndicator size="large" color="#c51515" />
              <Text style={styles.uploadText}>Uploading photos...</Text>
            </View>
          )}
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsIcon}>💡</Text>
          <Text style={styles.tipsText}>
            Tip: Use natural daylight for best results. Shoot from corner to corner to show the full room.
          </Text>
        </View>
      </ScrollView>

      {/* Photo Selection Modal */}
      {renderModal()}

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={uploading}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.nextButton,
            (images.length < 5 || uploading) && styles.nextButtonDisabled,
          ]}
          disabled={images.length < 5 || uploading}
          onPress={handleNext}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.nextButtonText}>
              Next • {images.length}/5
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  scrollView: {
    flex: 1,
  },
  requirementsCard: {
    flexDirection: 'row',
    backgroundColor: '#F7F7F7',
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  requirementIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  requirementsContent: {
    flex: 1,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 8,
  },
  requirementsText: {
    fontSize: 14,
    color: '#717171',
    lineHeight: 20,
    marginBottom: 4,
  },
  imagesSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#717171',
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  addPhotoButton: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    borderStyle: 'dashed',
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoContent: {
    alignItems: 'center',
  },
  addPhotoIcon: {
    fontSize: 32,
    color: '#222222',
  },
  addPhotoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222222',
    marginTop: 8,
  },
  addPhotoSubtext: {
    fontSize: 12,
    color: '#717171',
    marginTop: 2,
  },
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  coverBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#222222',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  coverText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 18,
    marginTop: -2,
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 3,
    borderColor: '#FF385C',
    borderRadius: 12,
  },
  reorderButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  reorderIcon: {
    fontSize: 16,
    color: '#717171',
    fontWeight: 'bold',
  },
  uploadProgress: {
    marginTop: 16,
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 14,
    color: '#717171',
    marginTop: 8,
  },
  tipsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF8F6',
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  tipsIcon: {
    fontSize: 20,
  },
  tipsText: {
    fontSize: 14,
    color: '#222222',
    lineHeight: 20,
    marginLeft: 12,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222222',
  },
  closeIcon: {
    fontSize: 28,
    color: '#222222',
    fontWeight: '300',
    lineHeight: 24,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  modalOptionIcon: {
    fontSize: 24,
    width: 30,
  },
  modalOptionText: {
    flex: 1,
    marginLeft: 16,
  },
  modalOptionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222222',
  },
  modalOptionSubtitle: {
    fontSize: 14,
    color: '#717171',
    marginTop: 2,
  },
  chevronIcon: {
    fontSize: 24,
    color: '#717171',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
    backgroundColor: '#fff',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
   
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
  },
  nextButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#c51515',
    minWidth: 120,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default PropertyImageUpload;