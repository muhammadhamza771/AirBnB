import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');
const primaryColor = "#FF385C";

export default function CombinedHabitPetsScreen({ navigation }) {

  // Habit State
  const [habitsAllowed, setHabitsAllowed] = useState(true);
  const [habitList, setHabitList] = useState([""]);

  // Pets State
  const [petsAllowed, setPetsAllowed] = useState(true);
  const [petList, setPetList] = useState([""]);

  // Habit Functions
  const handleHabitChange = (index, value) => {
    const updated = [...habitList];
    updated[index] = value;
    setHabitList(updated);
  };

  const addHabit = () => {
    setHabitList([...habitList, ""]);
  };

  // Pet Functions
  const handlePetChange = (index, value) => {
    const updated = [...petList];
    updated[index] = value;
    setPetList(updated);
  };

  const addPet = () => {
    setPetList([...petList, ""]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header - Without Back Button */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>House Rules</Text>
        
      </View>

      

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
      
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📋</Text>
            <Text style={styles.sectionTitle}>Special Habits</Text>
          </View>

          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, habitsAllowed && styles.activeBtn]}
              onPress={() => setHabitsAllowed(true)}
            >
              <Text style={[styles.toggleText, habitsAllowed && styles.activeText]}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toggleBtn, !habitsAllowed && styles.activeBtn]}
              onPress={() => setHabitsAllowed(false)}
            >
              <Text style={[styles.toggleText, !habitsAllowed && styles.activeText]}>No</Text>
            </TouchableOpacity>
          </View>

          {habitsAllowed && (
            <View style={styles.inputsContainer}>
              {habitList.map((item, index) => (
                <View key={index} style={styles.inputWrapper}>
                  <TextInput
                    placeholder="Enter habit"
                    placeholderTextColor="#999"
                    value={item}
                    onChangeText={(text) => handleHabitChange(index, text)}
                    style={styles.input}
                  />
                </View>
              ))}

              <TouchableOpacity style={styles.addButton} onPress={addHabit}>
                <Icon name="add" size={20} color={primaryColor} />
                <Text style={styles.addButtonText}>Add Habit</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* ================= PETS SECTION ================= */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🐾</Text>
            <Text style={styles.sectionTitle}>Pets Allowed</Text>
          </View>

          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, petsAllowed && styles.activeBtn]}
              onPress={() => setPetsAllowed(true)}
            >
              <Text style={[styles.toggleText, petsAllowed && styles.activeText]}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toggleBtn, !petsAllowed && styles.activeBtn]}
              onPress={() => setPetsAllowed(false)}
            >
              <Text style={[styles.toggleText, !petsAllowed && styles.activeText]}>No</Text>
            </TouchableOpacity>
          </View>

          {petsAllowed && (
            <View style={styles.inputsContainer}>
              {petList.map((item, index) => (
                <View key={index} style={styles.inputWrapper}>
                  <TextInput
                    placeholder="Enter pet name"
                    placeholderTextColor="#999"
                    value={item}
                    onChangeText={(text) => handlePetChange(index, text)}
                    style={styles.input}
                  />
                </View>
              ))}

              <TouchableOpacity style={styles.addButton} onPress={addPet}>
                <Icon name="add" size={20} color={primaryColor} />
                <Text style={styles.addButtonText}>Add Pet</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Navigation - Back and Next Buttons */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={() =>
            navigation.navigate("BookingTypeScreen", {
              habits: habitList,
              pets: petList,
            })
          }
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "#F0F0F0",
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: primaryColor,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666666",
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 100, // Space for bottom navigation
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  toggleRow: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 12,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  activeBtn: {
    backgroundColor: primaryColor,
    borderColor: primaryColor,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666666",
  },
  activeText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  inputsContainer: {
    marginTop: 10,
  },
  inputWrapper: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#1A1A1A",
    backgroundColor: "#F8F9FA",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginTop: 5,
    borderWidth: 1.5,
    borderColor: `${primaryColor}30`,
    borderRadius: 12,
    borderStyle: "dashed",
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: primaryColor,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 20,
  },
  bottomPadding: {
    height: 20,
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