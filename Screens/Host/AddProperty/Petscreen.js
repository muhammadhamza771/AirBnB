import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { PropertyContext } from "../../../context/PropertyContext";

const primaryColor = "#FF385C";

export default function CombinedHabitPetsScreen({ navigation }) {
  const { updateMultiple } = useContext(PropertyContext);

  const [habitsAllowed, setHabitsAllowed] = useState(true);
  const [habitList, setHabitList] = useState([""]);

  const [petsAllowed, setPetsAllowed] = useState(true);
  const [petList, setPetList] = useState([""]);

  // Habit handlers
  const handleHabitChange = (index, value) => {
    const updated = [...habitList];
    updated[index] = value;
    setHabitList(updated);
  };
  const addHabit = () => setHabitList([...habitList, ""]);

  // Pet handlers
  const handlePetChange = (index, value) => {
    const updated = [...petList];
    updated[index] = value;
    setPetList(updated);
  };
  const addPet = () => setPetList([...petList, ""]);

  // Next button
  const handleNext = () => {
    const filteredHabits = habitsAllowed
      ? habitList.filter(item => item.trim() !== "")
      : [];
    const filteredPets = petsAllowed
      ? petList.filter(item => item.trim() !== "")
      : [];

    updateMultiple({
      habits: filteredHabits,
      pets: filteredPets,
    });

    navigation.navigate("PropertyImageUpload");
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>House Rules</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HABITS */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📋 Special Habits</Text>

          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, habitsAllowed && styles.activeBtn]}
              onPress={() => setHabitsAllowed(true)}
            >
              <Text
                style={[styles.toggleText, habitsAllowed && styles.activeText]}
              >
                Yes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toggleBtn, !habitsAllowed && styles.activeBtn]}
              onPress={() => setHabitsAllowed(false)}
            >
              <Text
                style={[
                  styles.toggleText,
                  !habitsAllowed && styles.activeText,
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>

          {habitsAllowed &&
            habitList.map((item, index) => (
              <TextInput
                key={index}
                placeholder="Enter habit"
                value={item}
                onChangeText={text => handleHabitChange(index, text)}
                style={styles.input}
              />
            ))}

          {habitsAllowed && (
            <TouchableOpacity style={styles.addButton} onPress={addHabit}>
              <Icon name="add" size={20} color={primaryColor} />
              <Text style={styles.addText}>Add Habit</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* PETS */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🐾 Pets Allowed</Text>

          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, petsAllowed && styles.activeBtn]}
              onPress={() => setPetsAllowed(true)}
            >
              <Text
                style={[styles.toggleText, petsAllowed && styles.activeText]}
              >
                Yes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toggleBtn, !petsAllowed && styles.activeBtn]}
              onPress={() => setPetsAllowed(false)}
            >
              <Text
                style={[styles.toggleText, !petsAllowed && styles.activeText]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>

          {petsAllowed &&
            petList.map((item, index) => (
              <TextInput
                key={index}
                placeholder="Enter pet name"
                value={item}
                onChangeText={text => handlePetChange(index, text)}
                style={styles.input}
              />
            ))}

          {petsAllowed && (
            <TouchableOpacity style={styles.addButton} onPress={addPet}>
              <Icon name="add" size={20} color={primaryColor} />
              <Text style={styles.addText}>Add Pet</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },

  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  headerTitle: { fontSize: 20, fontWeight: "700", color: "#111" },

  scrollContent: { padding: 20 },

  card: { backgroundColor: "#fff", padding: 18, borderRadius: 14, marginBottom: 20 },

  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 15 },

  toggleRow: { flexDirection: "row", marginBottom: 15 },

  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    alignItems: "center",
    marginRight: 10,
  },

  activeBtn: { backgroundColor: primaryColor, borderColor: primaryColor },

  toggleText: { fontSize: 15, color: "#666" },
  activeText: { color: "#fff", fontWeight: "600" },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: primaryColor,
    borderRadius: 10,
    padding: 10,
  },

  addText: { marginLeft: 6, color: primaryColor, fontWeight: "600" },

  bottomBar: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
  },

  backBtn: { flex: 1, padding: 14, alignItems: "center" },
  backText: { color: primaryColor, fontWeight: "600" },

  nextBtn: { flex: 1, backgroundColor: primaryColor, padding: 14, borderRadius: 25, alignItems: "center" },
  nextText: { color: "#fff", fontWeight: "600" },
});