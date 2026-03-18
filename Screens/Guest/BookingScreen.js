import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");
const primaryColor = "#FF385C";

export default function TravelDetailsScreen({ navigation, route }) {
  const { services = [], propertyId, propertyPrice = 0, propertyName = "", propertyType = "" } =
    route.params || {};

  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date());
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCheckOut, setShowCheckOut] = useState(false);

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  const [selectedServices, setSelectedServices] = useState([]);

  const onChangeCheckIn = (e, d) => {
    const date = d || checkIn;
    setShowCheckIn(false);
    setCheckIn(date);
  };

  const onChangeCheckOut = (e, d) => {
    const date = d || checkOut;
    setShowCheckOut(false);
    setCheckOut(date);
  };

  const increase = (v, setV) => setV(v + 1);
  const decrease = (v, setV) => v > 0 && setV(v - 1);

  const toggleService = (service) => {
    setSelectedServices(prev =>
      prev.some(s => s.id === service.id)
        ? prev.filter(s => s.id !== service.id)
        : [...prev, service]
    );
  };

  const isServiceSelected = (service) => selectedServices.some(s => s.id === service.id);

  const getNightsCount = () => {
    const diff = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return diff || 1;
  };

  const handleNext = () => {
    const bookingData = {
      propertyId,
      propertyPrice,
      propertyName,
      propertyType,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      nights: getNightsCount(),
      adults,
      children,
      infants,
      totalGuests: adults + children,
      selectedServices,
    };
    navigation.navigate("BookingConfig", { bookingData });
  };

  // Split services into pairs of 2 for row display
  const getServiceRows = () => {
    let rows = [];
    for (let i = 0; i < services.length; i += 2) {
      rows.push(services.slice(i, i + 2));
    }
    return rows;
  };

  const serviceRows = getServiceRows();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plan Your Trip</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Dates Section */}
        <View style={styles.section}>
          <Text style={styles.cardTitle}>Select Dates</Text>
          <View style={styles.row}>
            <TouchableOpacity style={styles.dateBox} onPress={() => setShowCheckIn(true)}>
              <Text style={styles.label}>Check-In</Text>
              <Text style={styles.value}>{checkIn.toDateString()}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dateBox} onPress={() => setShowCheckOut(true)}>
              <Text style={styles.label}>Check-Out</Text>
              <Text style={styles.value}>{checkOut.toDateString()}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Guests Section */}
        <View style={styles.section}>
          <Text style={styles.cardTitle}>Guests</Text>
          {[["Adults", adults, setAdults], ["Children", children, setChildren], ["Infants", infants, setInfants]].map(
            ([label, value, setter], i) => (
              <View key={i} style={styles.guestRow}>
                <Text style={styles.guestLabel}>{label}</Text>
                <View style={styles.counter}>
                  <TouchableOpacity style={styles.circleBtn} onPress={() => decrease(value, setter)}>
                    <Icon name="remove" color="#fff" size={16} />
                  </TouchableOpacity>
                  <Text style={styles.count}>{value}</Text>
                  <TouchableOpacity style={styles.circleBtn} onPress={() => increase(value, setter)}>
                    <Icon name="add" color="#fff" size={16} />
                  </TouchableOpacity>
                </View>
              </View>
            )
          )}
        </View>

        {/* Add-ons Services Section */}
        {services.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.cardTitle}>Add-on Services</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {serviceRows.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.serviceRow}>
                  {row.map((service) => (
                    <TouchableOpacity
                      key={service.id}
                      style={[styles.serviceCard, isServiceSelected(service) && styles.selectedCard]}
                      onPress={() => toggleService(service)}
                    >
                      <Text style={styles.serviceName}>{service.name}</Text>
                      <Text style={styles.servicePrice}>Rs {service.price}</Text>
                      {isServiceSelected(service) && (
                        <Icon
                          name="checkmark-circle"
                          size={22}
                          color={primaryColor}
                          style={{ position: "absolute", top: 8, right: 8 }}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottom}>
        <TouchableOpacity style={styles.btn} onPress={handleNext}>
          <Text style={styles.btnText}>Continue</Text>
          <Icon name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* DatePickers */}
      {showCheckIn && (
        <DateTimePicker value={checkIn} mode="date" display="default" onChange={onChangeCheckIn} minimumDate={new Date()} />
      )}
      {showCheckOut && (
        <DateTimePicker value={checkOut} mode="date" display="default" onChange={onChangeCheckOut} minimumDate={checkIn} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F6FA" },
  header: {
    backgroundColor: primaryColor,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "700" },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    padding: 16,
    marginVertical: 8,
  },
  cardTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  row: { flexDirection: "row", gap: 12 },
  dateBox: { flex: 1, backgroundColor: "#FFF0F5", padding: 14 },
  label: { fontSize: 12, color: "#666" },
  value: { fontSize: 14, fontWeight: "600" },
  guestRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 10 },
  guestLabel: { fontSize: 16 },
  counter: { flexDirection: "row", alignItems: "center" },
  circleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: primaryColor,
    justifyContent: "center",
    alignItems: "center",
  },
  count: { marginHorizontal: 12, fontSize: 16, fontWeight: "600" },
  serviceRow: { flexDirection: "row", gap: 12, marginRight: 8 },
  serviceCard: {
    backgroundColor: "#FFF8FA",
    width: 150,
    padding: 16,
    marginVertical: 6,
  },
  selectedCard: { borderWidth: 2, borderColor: primaryColor },
  serviceName: { fontWeight: "600", fontSize: 16 },
  servicePrice: { color: primaryColor, marginTop: 4, fontWeight: "600" },
  bottom: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 16,
    backgroundColor: "#fff",
  },
  btn: {
    backgroundColor: primaryColor,
    padding: 16,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});