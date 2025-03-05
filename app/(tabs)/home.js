import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [loading, setLoading] = useState(false);
  const [nearestStation, setNearestStation] = useState(null);

  const findNearestStation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      const startLocation = await Location.geocodeAsync(startPoint);
      const endLocation = await Location.geocodeAsync(endPoint);

      if (startLocation.length > 0 && endLocation.length > 0) {
        setNearestStation({
          name: "Example Railway Station",
          distance: "2.5 km",
          coordinates: {
            latitude: startLocation[0].latitude,
            longitude: startLocation[0].longitude,
          }
        });
      } else {
        alert('Could not find location. Please check the addresses.');
      }
    } catch (error) {
      console.error(error);
      alert('Error finding nearest station');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Blue Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.profileSection}>
          <Text style={styles.greeting}>Welcome 👋</Text>
          <Text style={styles.userName}>User Name Here</Text>
        </View>
      </View>

      {/* White Content Section */}
      <View style={styles.contentSection}>
        {/* Elevated Input Card */}
        <View style={styles.inputCard}>
              <Text style={styles.tripTypeTextActive}>Search Stations</Text>
        

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Origin</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter starting point"
              value={startPoint}
              onChangeText={setStartPoint}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Destination</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter destination"
              value={endPoint}
              onChangeText={setEndPoint}
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={findNearestStation}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.searchButtonText}>Search Stations</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerSection: {
    height: '40%',
    backgroundColor: '#007AFF',
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  profileSection: {
    marginBottom: 20,
  },
  greeting: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginTop: 4,
  },
  contentSection: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  inputCard: {
    backgroundColor: '#fff',
    marginTop: -210,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tripTypeTextActive: {
    marginBottom: 10,
    color: '#007AFF',
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontFamily: 'Poppins-Medium',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
});
