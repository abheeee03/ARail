import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [nearestStation, setNearestStation] = useState(null);
  const [loading, setLoading] = useState(false);

  const findNearestStation = async () => {
    setLoading(true);
    try {
      // Get location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      // Get coordinates for start and end points using Geocoding
      const startLocation = await Location.geocodeAsync(startPoint);
      const endLocation = await Location.geocodeAsync(endPoint);

      if (startLocation.length > 0 && endLocation.length > 0) {
        // Here you would typically make an API call to your backend
        // to find the nearest railway stations based on the coordinates
        // For now, we'll show a mock response
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
      <Text style={styles.title}>Find Nearest Railway Station</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter starting point"
          value={startPoint}
          onChangeText={setStartPoint}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Enter destination"
          value={endPoint}
          onChangeText={setEndPoint}
        />
        
        <TouchableOpacity
          style={styles.button}
          onPress={findNearestStation}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Find Station</Text>
          )}
        </TouchableOpacity>
      </View>

      {nearestStation && (
        <View style={styles.resultContainer}>
          <Text style={styles.stationTitle}>Nearest Station:</Text>
          <Text style={styles.stationName}>{nearestStation.name}</Text>
          <Text style={styles.stationDistance}>
            Distance: {nearestStation.distance}
          </Text>
          
          <TouchableOpacity
            style={styles.arButton}
            onPress={() => router.push('/camera')}
          >
            <Text style={styles.arButtonText}>Navigate with AR</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stationTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  stationName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  stationDistance: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  arButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  arButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
