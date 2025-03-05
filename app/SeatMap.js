import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SeatMapScreen() {
  const { ticketNumber } = useLocalSearchParams();
  const [seats, setSeats] = useState([]);

  // Generate random seat data
  useEffect(() => {
    const generateSeats = () => {
      const totalSeats = 6; // Total number of seats
      const seatsArray = Array.from({ length: totalSeats }, (_, index) => ({
        id: index + 1,
        isBooked: Math.random() < 0.5, // Randomly assign booked status
      }));
      setSeats(seatsArray);
    };
    generateSeats();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seat Map for Ticket: {ticketNumber}</Text>
      </View>

      {/* Seat Map */}
      <View style={styles.seatGrid}>
        {/* Left Side - 2 Seats */}
        <View style={styles.sideContainer}>
          {seats.slice(0, 2).map((seat) => (
            <TouchableOpacity
              key={seat.id}
              style={[
                styles.seat,
                seat.isBooked ? styles.bookedSeat : styles.availableSeat,
                seat.id === 1 && styles.highlightedSeat, // Highlight seat 1 as blue
              ]}
              disabled={seat.isBooked}
            >
              <Text style={styles.seatText}>{seat.id}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Right Side - 4 Seats */}
        <View style={styles.sideContainer}>
          {seats.slice(2, 6).map((seat) => (
            <TouchableOpacity
              key={seat.id}
              style={[
                styles.seat,
                seat.isBooked ? styles.bookedSeat : styles.availableSeat,
              ]}
              disabled={seat.isBooked}
            >
              <Text style={styles.seatText}>{seat.id}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  seatGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  sideContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  seat: {
    width: 50,
    height: 50,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  availableSeat: {
    backgroundColor: '#4CAF50', // Green for available seats
  },
  bookedSeat: {
    backgroundColor: '#F44336', // Red for booked seats
  },
  highlightedSeat: {
    backgroundColor: '#2196F3', // Blue for highlighted seat
  },
  seatText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
