import React, { useState, useLayoutEffect, useContext } from "react";
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

  const cardPadding = width * 0.05;
  const iconSize = width * 0.08;

  const existingBookingType = propertyData?.policies?.bookingType || "request";
  const [selectedType, setSelectedType] = useState(existingBookingType);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: true, title: "Booking Type" });
  }, [navigation]);

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
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingHorizontal: width * 0.05 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.cardContainer}>
          {/* Instant Book Card */}
          <TouchableOpacity
            style={[styles.card, { padding: cardPadding }, selectedType === "instant" && styles.activeCard]}
            onPress={() => setSelectedType("instant")}
          >
            <Text style={[styles.icon, { fontSize: iconSize }]}>⚡</Text>
            <Text style={styles.title}>Instant Book</Text>
            <Text style={styles.description}>
              Guests can book automatically without waiting for your approval.
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>BEST FOR GETTING MORE BOOKINGS</Text>
            </View>
          </TouchableOpacity>

          {/* Booking Request Card */}
          <TouchableOpacity
            style={[styles.card, { padding: cardPadding }, selectedType === "request" && styles.activeCard]}
            onPress={() => setSelectedType("request")}
          >
            <Text style={[styles.icon, { fontSize: iconSize }]}>📩</Text>
            <Text style={styles.title}>Booking Request</Text>
            <Text style={styles.description}>
              Guests must send a request and you have 24 hours to accept or decline.
            </Text>
            <View style={styles.grayBadge}>
              <Text style={styles.grayBadgeText}>BEST IF YOU WANT TO VET GUESTS FIRST</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Spacer to prevent content overlap with footer */}
        <View style={{ height: 120 }} />
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
  container: { 
    flex: 1, 
    backgroundColor: "#F7F7F7" 
  },

  scroll: {
    paddingTop: 40,
    paddingBottom: 0,
  },

  cardContainer: {
    gap: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  activeCard: {
    borderColor: primaryColor,
    backgroundColor: "#FFF0F3",
  },

  icon: {
    marginBottom: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 6,
    color: "#1A1A1A",
  },

  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 100,
    lineHeight: 20,
  },

  badge: {
    backgroundColor: primaryColor,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },

  grayBadge: {
    backgroundColor: "#E5E5E5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  
  grayBadgeText: {
    color: "#777",
    fontSize: 11,
    fontWeight: "600",
  },

  // Footer styling
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
  
  back: { 
    textDecorationLine: "underline", 
    fontSize: 16, 
    color: "#666" 
  },
  
  nextBtn: {
    backgroundColor: primaryColor,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  
  nextText: { 
    color: "#fff", 
    fontWeight: "600" 
  },
});