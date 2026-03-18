import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { PropertyContext } from "../../../context/PropertyContext";

const { width } = Dimensions.get("window");
const primaryColor = "#FF385C";

export default function AvailabilityScreen({ navigation }) {
  const { updateMultiple } = useContext(PropertyContext);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const formatDate = (date) => {
    if (!date) return "mm/dd/yyyy";
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const formatDisplayDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleFromDateChange = (event, selectedDate) => {
    setShowFrom(false);
    if (selectedDate) {
      setFromDate(selectedDate);
      setShowSummary(true);
    }
  };

  const handleToDateChange = (event, selectedDate) => {
    setShowTo(false);
    if (selectedDate) {
      setToDate(selectedDate);
      setShowSummary(true);
    }
  };

  const handleConfirm = () => {
    if (!fromDate || !toDate) {
      Alert.alert("Error", "Please select both dates");
      return;
    }
    if (toDate < fromDate) {
      Alert.alert("Error", "End date must be after start date");
      return;
    }
    updateMultiple({
      available_from: fromDate.toISOString(),
      available_to: toDate.toISOString(),
    });
    navigation.navigate("SafetyDetailsScreen");
  };

  const handleEdit = () => setShowSummary(false);
  const clearDates = () => {
    setFromDate(null);
    setToDate(null);
    setShowSummary(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Custom Header */}
      <View style={styles.header}>
       
        <Text style={styles.headerTitle}>Availability</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>When is your place available?</Text>
        <Text style={styles.subtitle}>Set the date range during which guests can book your property.</Text>

        {/* Date Selection Card */}
        <View style={styles.card}>
          <View style={styles.dateBox}>
            <Text style={styles.label}>AVAILABLE FROM</Text>
            <TouchableOpacity style={[styles.input, fromDate && styles.inputSelected]} onPress={() => setShowFrom(true)}>
              <Text style={[styles.dateText, fromDate && styles.dateTextSelected]}>{formatDate(fromDate)}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dateBox}>
            <Text style={styles.label}>AVAILABLE TO</Text>
            <TouchableOpacity style={[styles.input, toDate && styles.inputSelected]} onPress={() => setShowTo(true)}>
              <Text style={[styles.dateText, toDate && styles.dateTextSelected]}>{formatDate(toDate)}</Text>
            </TouchableOpacity>
          </View>

          {(fromDate || toDate) && (
            <TouchableOpacity style={styles.clearBtn} onPress={clearDates}>
              <Text style={styles.clearText}>Clear Dates</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Summary Card */}
        {showSummary && fromDate && toDate && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}># Availability Summary</Text>
              <TouchableOpacity onPress={handleEdit}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>CHECK-IN START</Text>
                <Text style={styles.summaryDate}>{formatDisplayDate(fromDate)}</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>CHECK-OUT END</Text>
                <Text style={styles.summaryDate}>{formatDisplayDate(toDate)}</Text>
              </View>
            </View>

            <Text style={styles.summaryDescription}>
              This range defines when your listing will be active in search results. You can always change these dates later in your dashboard.
            </Text>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Date Pickers */}
      {showFrom && <DateTimePicker value={fromDate || new Date()} mode="date" display={Platform.OS === "ios" ? "spinner" : "default"} onChange={handleFromDateChange} />}
      {showTo && <DateTimePicker value={toDate || new Date()} mode="date" display={Platform.OS === "ios" ? "spinner" : "default"} onChange={handleToDateChange} />}

      {/* Bottom Buttons */}
      <View style={styles.bottom}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.nextBtn, (!fromDate || !toDate) && styles.nextBtnDisabled]} onPress={handleConfirm} disabled={!fromDate || !toDate}>
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

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
  headerTitle: { flex: 1, textAlign: "center", color: "#fff", fontSize: 20, fontWeight: "600" },
  headerBack: { color: "#fff", fontSize: 20 },

  scrollContainer: { padding: 20, paddingTop: 20, paddingBottom: 20 },
  title: { fontSize: width < 375 ? 22 : 24, fontWeight: "bold", marginBottom: 8 },
  subtitle: { color: "gray", marginBottom: 20, fontSize: width < 375 ? 14 : 16 },

  card: { backgroundColor: "#f5f5f5", borderRadius: 15, padding: 15, marginBottom: 20 },
  dateBox: { marginBottom: 15 },
  label: { fontSize: 12, fontWeight: "bold", color: "gray", marginBottom: 5 },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 10, borderWidth: 1, borderColor: "#ddd" },
  inputSelected: { borderColor: primaryColor, borderWidth: 2 },
  dateText: { fontSize: 15, color: "#999" },
  dateTextSelected: { color: "#333", fontWeight: "500" },
  clearBtn: { alignSelf: "flex-end", padding: 8 },
  clearText: { color: primaryColor, fontSize: 14, fontWeight: "600" },

  summaryCard: { backgroundColor: "#fff", borderRadius: 15, borderWidth: 1, borderColor: "#e0e0e0", padding: 20, marginBottom: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  summaryHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  summaryTitle: { fontSize: 17, fontWeight: "bold" },
  editText: { fontSize: 14, color: primaryColor, fontWeight: "600" },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15, backgroundColor: "#f8f8f8", padding: 12, borderRadius: 10 },
  summaryItem: { flex: 1, alignItems: "center" },
  summaryDivider: { width: 1, height: 40, backgroundColor: "#ddd", marginHorizontal: 10 },
  summaryLabel: { fontSize: 11, fontWeight: "bold", color: "#666", marginBottom: 5 },
  summaryDate: { fontSize: 14, fontWeight: "600", color: "#000" },
  summaryDescription: { fontSize: 13, color: "#666", lineHeight: 20, textAlign: "left" },

  bottom: { position: "absolute", bottom: Platform.OS === "ios" ? 40 : 20, left: 20, right: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#f0f0f0" },
  back: { fontSize: 16, fontWeight: "bold", color: "#000" },
  nextBtn: { backgroundColor: primaryColor, paddingVertical: 12, paddingHorizontal: 35, borderRadius: 25 },
  nextBtnDisabled: { backgroundColor: "#ccc" },
  nextText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});