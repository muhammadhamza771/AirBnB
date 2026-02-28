import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';


const BookingScreen = () => {
  const [bookingRequests, setBookingRequests] = useState([
    {
      id: 1,
      userName: 'Ahmed Khan',
      rating: 4.8,
      checkIn: '2026-02-20',
      checkOut: '2026-02-25',
      nights: 5,
      totalPrice: '$500',
      property: 'Luxury Apartment',
      userImage: '👤',
    },
    {
      id: 2,
      userName: 'Sarah Ali',
      rating: 4.6,
      checkIn: '2026-02-22',
      checkOut: '2026-02-28',
      nights: 6,
      totalPrice: '$600',
      property: 'Beach House',
      userImage: '👤',
    },
    {
      id: 3,
      userName: 'Hassan Raza',
      rating: 4.9,
      checkIn: '2026-03-01',
      checkOut: '2026-03-05',
      nights: 4,
      totalPrice: '$400',
      property: 'Mountain Villa',
      userImage: '👤',
    },
    {
      id: 4,
      userName: 'Fatima Zahid',
      rating: 4.5,
      checkIn: '2026-02-24',
      checkOut: '2026-03-02',
      nights: 6,
      totalPrice: '$650',
      property: 'City Penthouse',
      userImage: '👤',
    },
    {
      id: 5,
      userName: 'Muhammad Ali',
      rating: 4.7,
      checkIn: '2026-03-05',
      checkOut: '2026-03-10',
      nights: 5,
      totalPrice: '$550',
      property: 'Garden Cottage',
      userImage: '👤',
    },
  ]);

  const handleAccept = (id, userName) => {
    Alert.alert(
      'Request Accepted',
      `You accepted booking from ${userName}`,
      [{ text: 'OK' }]
    );
    setBookingRequests(bookingRequests.filter(req => req.id !== id));
  };

  const handleReject = (id, userName) => {
    Alert.alert(
      'Request Rejected',
      `You rejected booking from ${userName}`,
      [{ text: 'OK' }]
    );
    setBookingRequests(bookingRequests.filter(req => req.id !== id));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Booking Requests</Text>
       
      </View>

      {bookingRequests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No booking requests</Text>
        </View>
      ) : (
        bookingRequests.map(request => (
          <View key={request.id} style={styles.requestCard}>
            {/* User Info */}
            <View style={styles.userInfoContainer}>
              <View style={styles.userProfileSection}>
                <Text style={styles.userImageText}>{request.userImage}</Text>
                <View style={styles.userDetailsSection}>
                  <Text style={styles.userName}>{request.userName}</Text>
                  <Text style={styles.ratingText}>★ {request.rating}</Text>
                </View>
              </View>
            </View>

          
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Property:</Text>
                <Text style={styles.infoValue}>{request.property}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Check-in:</Text>
                <Text style={styles.infoValue}>{request.checkIn}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Check-out:</Text>
                <Text style={styles.infoValue}>{request.checkOut}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Nights:</Text>
                <Text style={styles.infoValue}>{request.nights}</Text>
              </View>
              <View style={[styles.infoRow, styles.priceRow]}>
                <Text style={styles.infoLabel}>Total Price:</Text>
                <Text style={styles.priceValue}>{request.totalPrice}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() => handleReject(request.id, request.userName)}
              >
                <Text style={styles.rejectButtonText}>Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => handleAccept(request.id, request.userName)}
              >
                <Text style={styles.acceptButtonText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  requestCount: {
    fontSize: 14,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  requestCard: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 6,
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  userInfoContainer: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  userProfileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImageText: {
    fontSize: 32,
    marginRight: 10,
  },
  userDetailsSection: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },

  infoSection: {
    marginBottom: 12,
    paddingVertical: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  priceRow: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
    marginTop: 6,
  },
  infoLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 11,
    color: '#333',
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 13,
    color: '#FF6B6B',
    fontWeight: '700',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  rejectButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#FF6B6B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  acceptButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#FF6B6B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  ratingText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
  },
});

export default BookingScreen;