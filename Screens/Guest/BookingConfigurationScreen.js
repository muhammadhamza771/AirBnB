import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const primaryColor = "#FF385C";

export default function BookingConfigScreen({ route, navigation }) {
  const { bookingData } = route.params;

  const {
    checkIn,
    checkOut,
    nights,
    adults,
    children,
    infants,
    propertyPrice,
    selectedServices
  } = bookingData;

  const totalGuests = adults + children;
  const propertyTotal = propertyPrice * nights;
  const servicesTotal = selectedServices.reduce((sum, service) => {
    let price = service.price;
    if (service.perDay) price *= nights;
    if (service.perPerson) price *= totalGuests;
    return sum + price;
  }, 0);

  const totalBill = propertyTotal + servicesTotal;

  return (
    <SafeAreaView style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Receipt</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* TRIP DETAILS */}
        <View style={styles.section}>
          <Text style={styles.title}>Trip Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Check-in</Text>
            <Text>{new Date(checkIn).toDateString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Check-out</Text>
            <Text>{new Date(checkOut).toDateString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Guests</Text>
            <Text>{adults} Adults • {children} Children • {infants} Infants</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Nights</Text>
            <Text>{nights}</Text>
          </View>
        </View>

        {/* PRICE DETAILS */}
        <View style={styles.section}>
          <Text style={styles.title}>Price Details</Text>

          <View style={styles.row}>
            <Text>Rs {propertyPrice} × {nights} nights</Text>
            <Text>Rs {propertyTotal}</Text>
          </View>

          {selectedServices.map(service => {
            let price = service.price;
            if (service.perDay) price *= nights;
            if (service.perPerson) price *= totalGuests;

            return (
              <View key={service.id} style={styles.row}>
                <Text>{service.name}</Text>
                <Text>Rs {price}</Text>
              </View>
            );
          })}

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.total}>Total</Text>
            <Text style={styles.total}>Rs {totalBill}</Text>
          </View>
        </View>

      </ScrollView>

      {/* BOTTOM BUTTON */}
      <View style={styles.bottom}>
        <View>
          <Text style={styles.bottomPrice}>Rs {totalBill}</Text>
          <Text style={styles.bottomSub}>Total amount</Text>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Request to Book</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff"
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  section: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },
  label: {
    color: "#555"
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12
  },
  total: {
    fontWeight: "700",
    fontSize: 16,
    color: "#222"
  },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    width: "100%"
  },
  bottomPrice: {
    fontSize: 18,
    fontWeight: "700"
  },
  bottomSub: {
    color: "#777",
    fontSize: 12
  },
  button: {
    backgroundColor: primaryColor,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16
  }
});