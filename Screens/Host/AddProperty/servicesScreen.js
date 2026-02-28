import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { PropertyContext } from '../../../context/PropertyContext';

const primaryColor = "#FF385C";

export default function ServicesScreen({ navigation }) {

  const [services, setServices] = useState([
    { id: 1, name: "BREAKFAST", selected: false, icon: "🍳" },
    { id: 2, name: "LAUNDRY", selected: false, icon: "🧺" },
    { id: 3, name: "DAILY CLEANING", selected: false, icon: "🧹" },
    { id: 4, name: "AIRPORT PICKUP", selected: false, icon: "✈️" },
    { id: 5, name: "CAR RENTAL", selected: false, icon: "🚗" },
    { id: 6, name: "LOCAL GUIDE", selected: false, icon: "🗺️" },
  ]);

  const context = useContext(PropertyContext);
  const propertyData = context ? context.propertyData : {};
  const updatePropertyData = context ? context.updatePropertyData : () => {};

  const toggleService = (id) => {
    const updatedServices = services.map(service =>
      service.id === id ? { ...service, selected: !service.selected } : service
    );
    setServices(updatedServices);
  };

  const handleNext = () => {
    const selectedServices = services.filter(s => s.selected).map(s => s.name);
    updatePropertyData('services', selectedServices);
    navigation.navigate("SafetyDetailsScreen", { 
      services: selectedServices
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header with Close and Menu */}
      <View style={styles.header}>
       
     
      </View>

   

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title Section */}
        <Text style={styles.mainTitle}>What services do you provide?</Text>
        <Text style={styles.subtitle}>
          Let guests know if you offer any extra services during their stay.
        </Text>

        {/* Services Cards Grid */}
        <View style={styles.cardsGrid}>
          {services.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={[
                styles.serviceCard,
                service.selected && styles.serviceCardSelected
              ]}
              onPress={() => toggleService(service.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.serviceIcon}>{service.icon}</Text>
              <Text style={[
                styles.serviceName,
                service.selected && styles.serviceNameSelected
              ]}>
                {service.name}
              </Text>
              {service.selected && (
                <View style={styles.selectedBadge}>
                  <Text style={styles.selectedBadgeText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Selected Count */}
        <View style={styles.selectedCountContainer}>
          <Text style={styles.selectedCountText}>
            {services.filter(s => s.selected).length} services selected
          </Text>
        </View>

        {/* Property Data Summary */}
        <View style={styles.dataSummaryCard}>
          <Text style={styles.dataSummaryTitle}>📋 Property Data Summary</Text>
          <View style={styles.dataSummaryContent}>
            <Text style={styles.dataRow}>
              <Text style={styles.dataLabel}>Name:</Text> {propertyData.propertyName || 'Not set'}
            </Text>
            <Text style={styles.dataRow}>
              <Text style={styles.dataLabel}>Type:</Text> {propertyData.propertyType || 'Not set'}
            </Text>
            <Text style={styles.dataRow}>
              <Text style={styles.dataLabel}>Guests:</Text> {propertyData.guestCapacity || 0}
            </Text>
            <Text style={styles.dataRow}>
              <Text style={styles.dataLabel}>Rooms:</Text> {Object.keys(propertyData.rooms || {}).length || 0}
            </Text>
            <Text style={styles.dataRow}>
              <Text style={styles.dataLabel}>Images:</Text> {(propertyData.images || []).length}
            </Text>
            <Text style={styles.dataRow}>
              <Text style={styles.dataLabel}>Price:</Text> ${propertyData.price || 0}
            </Text>
            <Text style={styles.dataRow}>
              <Text style={styles.dataLabel}>Discounts:</Text> {(propertyData.discounts || []).length}
            </Text>
            <Text style={styles.dataRow}>
              <Text style={styles.dataLabel}>Booking:</Text> {propertyData.bookingType || 'instant'}
            </Text>
            <Text style={styles.dataRow}>
              <Text style={styles.dataLabel}>Services:</Text> {services.filter(s => s.selected).length}
            </Text>
            <Text style={styles.dataRow}>
              <Text style={styles.dataLabel}>Amenities:</Text> {(propertyData.amenities || []).length}
            </Text>
            <Text style={styles.dataRow}>
              <Text style={styles.dataLabel}>Cancellation:</Text> {propertyData.cancellationPolicy || 'Not set'}
            </Text>
            <Text style={styles.dataRow}>
              <Text style={styles.dataLabel}>Safety:</Text> {Object.keys(propertyData.safetyDetails || {}).length > 0 ? '✓ Set' : 'Not set'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleNext}
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
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 24,
    color: "#1A1A1A",
  },
  stepContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  stepText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666666",
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 10,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 30,
    lineHeight: 22,
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  serviceCard: {
    width: "48%",
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    position: "relative",
  },
  serviceCardSelected: {
    borderColor: primaryColor,
    backgroundColor: "#FFFFFF",
    shadowColor: primaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  serviceIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    textAlign: "center",
  },
  serviceNameSelected: {
    color: primaryColor,
  },
  selectedBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: primaryColor,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedBadgeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  selectedCountContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  selectedCountText: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  bottomButtons: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  backButton: {
    flex: 1,
    paddingVertical: 14,
   
    borderColor: primaryColor,
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
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  dataSummaryCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 16,
    marginTop: 30,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: primaryColor,
  },
  dataSummaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  dataSummaryContent: {
    gap: 8,
  },
  dataRow: {
    fontSize: 14,
    color: "#4A4A4A",
    lineHeight: 20,
  },
  dataLabel: {
    fontWeight: "600",
    color: "#1A1A1A",
  },
});