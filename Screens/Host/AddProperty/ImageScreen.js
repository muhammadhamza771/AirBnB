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
  Platform,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { PropertyContext } from '../../../context/PropertyContext';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - 72) / 3;

const PropertyImageUpload = ({ navigation }) => {
  const { updateMultiple, propertyData } = useContext(PropertyContext);

  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // ✅ AUTO LOAD IF USER COMES BACK
  useEffect(() => {
    if (propertyData.propertyImages) {
      setImages(propertyData.propertyImages);
    }
  }, []);

  const takePhoto = () => {
    setModalVisible(false);

    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1200,
      maxHeight: 900,
      saveToPhotos: true,
    };

    launchCamera(options, (response) => {
      if (response.didCancel || response.errorCode) return;

      if (response.assets?.length > 0) {
        const image = response.assets[0];

        const newImage = {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: image.fileName || `photo_${Date.now()}.jpg`,
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
      selectionLimit: 10 - images.length,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel || response.errorCode) return;

      if (response.assets?.length > 0) {
        const newImages = response.assets.map((image, index) => ({
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: image.fileName || `photo_${Date.now()}_${index}.jpg`,
        }));

        setImages(prev => [...prev, ...newImages].slice(0, 10));
      }
    });
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const setCoverPhoto = (index) => {
    if (index === 0) return;

    const newImages = [...images];
    const cover = newImages.splice(index, 1)[0];
    newImages.unshift(cover);
    setImages(newImages);
  };

 
  const handleNext = () => {
    if (images.length < 5) {
      Alert.alert(
        'Add More Photos',
        `Add ${5 - images.length} more photos to continue.`
      );
      return;
    }

    setUploading(true);

    setTimeout(() => {
      updateMultiple({
        propertyImages: images,  
      });

      setUploading(false);
      navigation.navigate('priceScreen');
    }, 800);
  };

  const renderImageItem = (item, index) => (
    <TouchableOpacity
      key={index}
      style={styles.imageContainer}
      onLongPress={() =>
        Alert.alert(
          'Options',
          'Choose action',
          [
            index !== 0 && { text: 'Set as Cover', onPress: () => setCoverPhoto(index) },
            { text: 'Remove', style: 'destructive', onPress: () => removeImage(index) },
            { text: 'Cancel', style: 'cancel' },
          ].filter(Boolean)
        )
      }
    >
      <Image source={{ uri: item.uri }} style={styles.image} />

      {index === 0 && (
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
        <Text style={styles.subtitle}>
          Add at least 5 photos. First photo will be cover.
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.grid}>
          {images.length < 10 && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.addText}>+</Text>
            </TouchableOpacity>
          )}

          {images.map((item, index) =>
            renderImageItem(item, index)
          )}
        </View>

        {uploading && (
          <ActivityIndicator
            size="large"
            color="#f51414"
            style={{ marginTop: 20 }}
          />
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.nextBtn,
            images.length < 5 && { backgroundColor: '#ccc' },
          ]}
          disabled={images.length < 5}
          onPress={handleNext}
        >
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <TouchableOpacity onPress={takePhoto}>
              <Text style={styles.modalOption}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={chooseFromGallery}>
              <Text style={styles.modalOption}>Choose From Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={[styles.modalOption, { color: 'red' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PropertyImageUpload;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: { padding: 20 },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { color: '#777', marginTop: 4 },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  addButton: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  addText: { fontSize: 30 },

  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 12,
  },

  image: { width: '100%', height: '100%' },

  coverBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#000',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  coverText: { color: '#fff', fontSize: 10 },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },

  back: { fontSize: 16 },

  nextBtn: {
    backgroundColor: '#f51414',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },

  nextText: { color: '#fff', fontWeight: '600' },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
  },

  modalOption: {
    fontSize: 18,
    paddingVertical: 12,
  },
});