import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { PropertyContext } from "../../../context/PropertyContext";

const primaryColor = "#FF385C";

export default function BookingTypeScreen({ navigation }) {
  const { propertyData, updateMultiple } = useContext(PropertyContext);
  const { width } = useWindowDimensions();

  const cardPadding = width * 0.03; // reduced padding
  const iconSize = width * 0.07; // reduced icon size

  const existingBookingType = propertyData?.policies?.bookingType || "request";
  const [selectedType, setSelectedType] = useState(existingBookingType);

  const handleNext = () => {
    updateMultiple({
      policies: {
        ...propertyData.policies,
        bookingType: selectedType,
      },
    });
    navigation.navigate("AvailabilityScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

    
      <View style={styles.header}>
       
        <Text style={styles.headerTitle}>Booking Type</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingHorizontal: width * 0.05 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.cardContainer}>
          {/* Instant Book */}
          <TouchableOpacity
            style={[styles.card, { padding: cardPadding }, selectedType === "instant" && styles.activeCard]}
            onPress={() => setSelectedType("instant")}
          >
            <Text style={{ fontSize: iconSize }}>⚡</Text>
            <Text style={styles.title}>Instant Book</Text>
            <Text style={styles.description}>
              Guests can book automatically without waiting for your approval.
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>BEST FOR GETTING MORE BOOKINGS</Text>
            </View>
          </TouchableOpacity>

          {/* Booking Request */}
          <TouchableOpacity
            style={[styles.card, { padding: cardPadding }, selectedType === "request" && styles.activeCard]}
            onPress={() => setSelectedType("request")}
          >
            <Text style={{ fontSize: iconSize }}>📩</Text>
            <Text style={styles.title}>Booking Request</Text>
            <Text style={styles.description}>
              Guests must send a request and you have 24 hours to accept or decline.
            </Text>
            <View style={styles.grayBadge}>
              <Text style={styles.grayBadgeText}>BEST IF YOU WANT TO VET GUESTS FIRST</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ height: 120 }} /> {/* Spacer for footer */}
      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7" },

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

  scroll: { paddingTop: 20, paddingBottom: 0 },

  cardContainer: { gap: 15 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  activeCard: {
    borderColor: primaryColor,
    backgroundColor: "#FFF0F3",
  },

  title: { fontSize: 16, fontWeight: "600", marginTop: 12, marginBottom: 4 },
  description: { fontSize: 13, color: "#666", marginBottom: 70, lineHeight: 18 },

  badge: {
    backgroundColor: primaryColor,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "600" },

  grayBadge: {
    backgroundColor: "#E5E5E5",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  grayBadgeText: { color: "#777", fontSize: 10, fontWeight: "600" },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  back: { textDecorationLine: "underline", fontSize: 16, color: "#666" },
  nextBtn: {
    backgroundColor: primaryColor,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  nextText: { color: "#fff", fontWeight: "600" },
});