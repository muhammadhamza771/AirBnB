import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');
const primaryColor = "#FF385C";

export default function SafetyDetailsScreen({ navigation }) {

  // Safety items state
  const [safetyItems, setSafetyItems] = useState([
    { id: 1, title: "Exterior security camera present", checked: false },
    { id: 2, title: "Noise decibel monitor present", checked: false },
    { id: 3, title: "Smoke alarm present", checked: false },

  ]);

  
  const toggleCheckbox = (id) => {
    const updatedItems = safetyItems.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setSafetyItems(updatedItems);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        
        <View style={styles.content}>
        
          <Text style={styles.mainTitle}>Share safety details</Text>
          
        
          <Text style={styles.subtitle}>
            Guests want to know that they'll be safe in your home.
          </Text>

         
          <Text style={styles.sectionTitle}>Does your place have any of these?</Text>

         
          <View style={styles.checklistContainer}>
            {safetyItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.checklistItem}
                onPress={() => toggleCheckbox(item.id)}
                activeOpacity={0.7}
              >
                <View style={styles.checkboxContainer}>
                  <View style={[
                    styles.checkbox,
                    item.checked && styles.checkboxChecked
                  ]}>
                    {item.checked && (
                      <Icon name="check" size={18} color="#FFFFFF" />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

         
          <Text style={styles.noteText}>
            You can update these details anytime in your listing settings.
          </Text>
        </View>
      </ScrollView>

      
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={( ) => {
          
            const selectedItems = safetyItems.filter(item => item.checked);
            navigation.navigate("CancellationPolicyScreen", { safetyDetails: selectedItems });
          }}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    backgroundColor: "#FFFFFF",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, 
  },
  content: {
    padding: 24,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 32,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 20,
  },
  checklistContainer: {
    marginBottom: 30,
  },
  checklistItem: {
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#DDDDDD",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  checkboxChecked: {
    backgroundColor: primaryColor,
    borderColor: primaryColor,
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#1A1A1A",
    flex: 1,
    lineHeight: 22,
  },
  noteText: {
    fontSize: 14,
    color: "#999999",
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
  // Bottom Navigation Styles
  bottomNavigation: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  backButton: {
    flex: 1,
    paddingVertical: 14,
    
   
    borderColor: primaryColor,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    marginRight: 100,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: primaryColor,
  },
  nextButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 30,
    backgroundColor: primaryColor,
    alignItems: "center",
    marginLeft: 10,
    shadowColor: primaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});