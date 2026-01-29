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
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.stepIndicator}>Step 5 of 13</Text>
          <Text style={styles.title}>Create your description</Text>
          <Text style={styles.subtitle}>
            Share what makes your place special.
          </Text>
        </View>

        {/* Listing Title Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Listing title</Text>
          <TextInput
            style={styles.input}
            value={listingTitle}
            onChangeText={setListingTitle}
            placeholder="e.g., Cozy apartment with city view"
            placeholderTextColor="#717171"
            maxLength={50}
          />
          <Text style={styles.charCount}>{listingTitle.length}/50</Text>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.charCount}>{generalDescription.length}/500</Text>
          </View>
          <TextInput
            style={styles.textArea}
            value={generalDescription}
            onChangeText={setGeneralDescription}
            placeholder="Describe your space, amenities, location, and what makes it unique..."
            placeholderTextColor="#717171"
            multiline
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.hint}>
            Guests will see this description when browsing listings.
          </Text>
        </View>

      
        <View style={styles.footer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
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
    flexGrow: 1,
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
  section: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#222222',
    backgroundColor: '#fff',
  },
  textArea: {
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    height: 160,
    fontSize: 16,
    color: '#222222',
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 14,
    color: '#717171',
    textAlign: 'right',
    marginTop: 4,
  },
  hint: {
    fontSize: 14,
    color: '#717171',
    marginTop: 8,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 24,
    paddingBottom: 32,
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
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
    backgroundColor: '#ed1010',
    minWidth: 100,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});