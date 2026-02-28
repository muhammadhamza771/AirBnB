import React, { useState, useLayoutEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { PropertyContext } from '../../../context/PropertyContext';

const primaryColor = "#FF385C";

export default function BookingTypeScreen({ navigation }) {
  const [selectedType, setSelectedType] = useState("instant");
  const { propertyData, updatePropertyData } = useContext(PropertyContext);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: true, title: 'Booking Type' });
  }, [navigation]);

  const handleNext = () => {
    // Update context with booking type
    updatePropertyData('bookingType', selectedType);
    
    // Show alert with all property data
    const dataString = JSON.stringify({
      ...propertyData,
      bookingType: selectedType
    }, null, 2);
    
    Alert.alert(
      '✅ Property Data Summary',
      dataString,
      [
        { text: 'Edit', onPress: () => navigation.goBack() },
        { text: 'Submit', onPress: () => navigation.navigate('ServicesScreen', { bookingType: selectedType }) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>


        <View style={styles.cardContainer}>

          
          <TouchableOpacity
            style={[
              styles.card,
              selectedType === "instant" && styles.activeCard,
            ]}
            onPress={() => setSelectedType("instant")}
          >
            <Text style={styles.icon}>⚡</Text>
            <Text style={styles.title}>Instant Book</Text>
            <Text style={styles.description}>
              Guests can book automatically without waiting for your approval.
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                BEST FOR GETTING MORE BOOKINGS
              </Text>
            </View>
          </TouchableOpacity>
        
          <TouchableOpacity
            style={[
              styles.card,
              selectedType === "request" && styles.activeCard,
            ]}
            onPress={() => setSelectedType("request")}
          >
            <Text style={styles.icon}>📩</Text>
            <Text style={styles.title}>Booking Request</Text>
            <Text style={styles.description}>
              Guests must send a request and you have 24 hours to accept or decline.
            </Text>

            <View style={styles.grayBadge}>
              <Text style={styles.grayBadgeText}>
                BEST IF YOU WANT TO VET GUESTS FIRST
              </Text>
            </View>
          </TouchableOpacity>

        </View>

        <View style={styles.bottomNavigation}>
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

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  scroll: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 140,
  },
  step: {
    textAlign: "center",
    fontSize: 12,
    letterSpacing: 2,
    color: "#888",
    marginBottom: 30,
  },
  cardContainer: {
    gap: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    borderWidth: 2,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  activeCard: {
    borderColor: primaryColor,
    backgroundColor: "#FFF0F3",
  },
  icon: {
    fontSize: 28,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    color: "#666",
    marginTop: 8,
    marginBottom: 15,
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
  publishButton: {
    marginTop: 40,
    backgroundColor: primaryColor,
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  publishText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  backButton: {
    flex: 1,
    paddingVertical: 14,
  

    borderColor: primaryColor,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    marginRight: 100,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: primaryColor,
  },
  nextButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 30,
    backgroundColor: primaryColor,
    alignItems: 'center',
    marginLeft: 10,
    shadowColor: primaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
