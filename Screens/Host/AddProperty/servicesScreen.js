import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TextInput,
} from "react-native";
import { PropertyContext } from "../../../context/PropertyContext";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const primaryColor = "#FF385C";

const SERVICES = [
  { id: "breakfast", name: "Breakfast", icon: "🍳", defaultAmount: 500 },
  { id: "laundry", name: "Laundry", icon: "🧺", defaultAmount: 200 },
  { id: "cleaning", name: "Daily Cleaning", icon: "🧹", defaultAmount: 1000 },
  { id: "pickup", name: "Airport Pickup", icon: "🚗", defaultAmount: 3000 },
  { id: "car_rental", name: "Car Rental", icon: "🔑", defaultAmount: 5000 },
  { id: "guide", name: "Local Guide", icon: "🗺️", defaultAmount: 2000 },
];

export default function ServicesScreen({ navigation }) {
  const { propertyData, updatePropertyData } = useContext(PropertyContext);

  const [services, setServices] = useState(
    SERVICES.map((item) => {
      const existing = propertyData.services.find(s => s.id === item.id);
      return {
        ...item,
        selected: existing ? true : false,
        amount: existing ? existing.price.toString() : item.defaultAmount.toString(),
      };
    })
  );

  const toggleService = (id) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id
          ? { ...service, selected: !service.selected }
          : service
      )
    );
  };

  const updateAmount = (id, value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, amount: numericValue } : service
      )
    );
  };

  const handleNext = () => {
    const selectedServices = services
      .filter(s => s.selected)
      .map(s => ({ id: s.id, name: s.name, price: Number(s.amount) || s.defaultAmount }));

    updatePropertyData("services", selectedServices);
    navigation.navigate("LocationScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ===== HEADER ===== */}
      <View style={styles.header}>
       
        <Text style={styles.headerTitle}>Services</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.mainTitle}>What services do you offer?</Text>
        <Text style={styles.subtitle}>Select all that apply and set your prices</Text>

        <View style={styles.cardsGrid}>
          {services.map((service) => (
            <View key={service.id} style={styles.serviceItem}>
              <TouchableOpacity
                style={[styles.serviceCard, service.selected && styles.serviceCardSelected]}
                onPress={() => toggleService(service.id)}
              >
                <Text style={styles.serviceIcon}>{service.icon}</Text>
                <Text style={[styles.serviceName, service.selected && styles.serviceNameSelected]}>
                  {service.name}
                </Text>
              </TouchableOpacity>

              {service.selected && (
                <View style={styles.priceContainer}>
                  <View style={styles.priceInputWrapper}>
                    <Text style={styles.currencySymbol}>Rs</Text>
                    <TextInput
                      style={styles.priceInput}
                      keyboardType="numeric"
                      value={service.amount}
                      onChangeText={(value) => updateAmount(service.id, value)}
                      placeholder="0"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={{ height: isTablet ? 160 : 120 }} />
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FFFFFF" 
  },

  // ===== HEADER STYLES =====
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FF385C",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },

  scrollContent: { 
    paddingHorizontal: 20, 
    paddingBottom: isTablet ? 160 : 120 
  },
  
  mainTitle: { 
    fontSize: isTablet ? 32 : 28, 
    fontWeight: "700", 
    color: "#1A1A1A", 
    marginTop: 10, 
    marginBottom: 10 
  },
  
  subtitle: { 
    fontSize: isTablet ? 18 : 16, 
    color: "#666", 
    marginBottom: 30 
  },
  
  cardsGrid: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "space-between" 
  },
  
  serviceItem: { 
    width: "48%",
    marginBottom: 15
  },
  
  serviceCard: { 
    backgroundColor: "#F8F9FA", 
    borderRadius: 16, 
    padding: 20, 
    alignItems: "center", 
    borderWidth: 2, 
    borderColor: "transparent" 
  },
  
  serviceCardSelected: { 
    borderColor: primaryColor, 
    backgroundColor: "#FFFFFF" 
  },
  
  serviceIcon: { 
    fontSize: isTablet ? 36 : 32, 
    marginBottom: 10 
  },
  
  serviceName: { 
    fontSize: isTablet ? 16 : 14, 
    fontWeight: "600", 
    color: "#1A1A1A", 
    textAlign: "center" 
  },
  
  serviceNameSelected: { 
    color: primaryColor 
  },
  
  priceContainer: { 
    marginTop: 8 
  },
  
  priceInputWrapper: { 
    flexDirection: "row", 
    alignItems: "center", 
    borderWidth: 1, 
    borderColor: "#DDD", 
    borderRadius: 8, 
    backgroundColor: "#FFF", 
    overflow: "hidden" 
  },
  
  currencySymbol: { 
    paddingHorizontal: 10, 
    fontSize: 14, 
    fontWeight: "600", 
    color: "#666", 
    backgroundColor: "#F5F5F5", 
    paddingVertical: 8, 
    borderRightWidth: 1, 
    borderRightColor: "#DDD" 
  },
  
  priceInput: { 
    flex: 1, 
    paddingVertical: 8, 
    paddingHorizontal: 10, 
    fontSize: 14, 
    color: "#333" 
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
    backgroundColor: "#fff", 
    borderTopWidth: 1, 
    borderTopColor: "#F0F0F0" 
  },
  
  backButton: { 
    flex: 1, 
    paddingVertical: 14, 
    marginRight: 10 
  },
  
  backButtonText: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: 'black'
  },
  
  nextButton: { 
    backgroundColor: '#FF385C', 
    paddingHorizontal: 35, 
    paddingVertical: 14, 
    borderRadius: 10 
  },
  
  nextButtonText: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: "#fff" 
  },
});