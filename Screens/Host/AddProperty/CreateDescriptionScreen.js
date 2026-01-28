import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';

const CreateDescriptionsScreen = ({ navigation, route }) => {

 
  const prevData = route?.params?.data || {};

  const [listingTitle, setListingTitle] = useState(
    prevData.listingTitle || 'MY PROPERTY 1'
  );

  const [generalDescription, setGeneralDescription] = useState(
    prevData.generalDescription ||
      "You'll have a great time at this comfortable place to stay."
  );


  const handleNext = () => {
    if (!listingTitle.trim()) {
      Alert.alert('Error', 'Listing title is required');
      return;
    }

    if (!generalDescription.trim()) {
      Alert.alert('Error', 'Description is required');
      return;
    }

   
    const finalData = {
      ...prevData,
      listingTitle: listingTitle.trim(),
      generalDescription: generalDescription.trim(),
    };

    
    Alert.alert(
      'Property Data',
      JSON.stringify(finalData, null, 2)
    );

    // ✅ Navigate with clean object
    navigation.navigate('HouseHighlights', {
      data: finalData,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Create your description</Text>

        <TextInput
          style={styles.input}
          value={listingTitle}
          onChangeText={setListingTitle}
          placeholder="Listing title"
          maxLength={50}
        />

        <TextInput
          style={styles.textArea}
          value={generalDescription}
          onChangeText={setGeneralDescription}
          placeholder="Describe your property"
          multiline
          textAlignVertical="top"
          maxLength={500}
        />

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateDescriptionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 14,
    height: 140,
    marginBottom: 25,
    fontSize: 16,
  },
  nextBtn: {
    backgroundColor: '#e10f0f',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
