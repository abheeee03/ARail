import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Linking,
  Alert,
  FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

export default function SearchResultsScreen() {
  const { origin, destination } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [originStation, setOriginStation] = useState(null);
  const [destinationStation, setDestinationStation] = useState(null);
  const [error, setError] = useState(null);
  const [trains, setTrains] = useState([]);

  const fetchStationLocation = async (stationCode) => {
    try {
      const apiKey = '3f82b58461ac24852bf6b16bd9ff52fd';
      const response = await fetch(
        `http://indianrailapi.com/api/v2/StationLocationOnMap/apikey/${apiKey}/StationCode/${stationCode}`
      );
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data.ResponseCode === "200" && data.Status === "SUCCESS") {
        return data.URL;
      }
      return null;
    } catch (err) {
      console.error('Error fetching station location:', err);
      return null;
    }
  };

  const fetchStationInfo = async (stationName, setStation) => {
    if (!stationName) {
      setError('Station name is required');
      return;
    }

    try {
      const apiKey = '3f82b58461ac24852bf6b16bd9ff52fd';
      const response = await fetch(
        `http://indianrailapi.com/api/v2/AutoCompleteStation/apikey/${apiKey}/StationCodeOrName/${encodeURIComponent(stationName)}`
      );
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data.ResponseCode === "200" && data.Status === "SUCCESS" && data.Station && data.Station.length > 0) {
        const stationData = data.Station[0];
        const locationUrl = await fetchStationLocation(stationData.StationCode);
        setStation({
          Name: stationData.NameEn,
          NameHn: stationData.NameHn,
          Code: stationData.StationCode,
          Latitude: stationData.Latitude,
          Longitude: stationData.Longitude,
          LocationUrl: locationUrl
        });
      } else {
        setError(`No station found for ${stationName}`);
      }
    } catch (err) {
      console.error('Error fetching station:', err);
      setError('Failed to fetch station information');
    }
  };

  const openInMaps = (station) => {
    if (station.LocationUrl) {
      Linking.canOpenURL(station.LocationUrl).then(supported => {
        if (supported) {
          Linking.openURL(station.LocationUrl);
        } else {
          Alert.alert('Error', 'Unable to open Google Maps');
        }
      }).catch(err => {
        console.error('Error opening Google Maps:', err);
        Alert.alert('Error', 'Failed to open Google Maps');
      });
    } else if (station.Latitude && station.Longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${station.Latitude},${station.Longitude}`;
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Unable to open Google Maps');
        }
      }).catch(err => {
        console.error('Error opening Google Maps:', err);
        Alert.alert('Error', 'Failed to open Google Maps');
      });
    } else {
      Alert.alert('Error', 'Station location data is missing');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      if (!origin || !destination) {
        setError('Both origin and destination stations are required');
        setLoading(false);
        return;
      }

      try {
        await Promise.all([
          fetchStationInfo(origin, setOriginStation),
          fetchStationInfo(destination, setDestinationStation)
        ]);

        // Fetch trains between stations (dummy data for now)
        setTrains([
          { 
            number: '12345', 
            name: 'Rajdhani Express', 
            departure: '06:00', 
            arrival: '14:00',
            type: 'SUF'
          },
          { 
            number: '67890', 
            name: 'Shatabdi Express', 
            departure: '08:00', 
            arrival: '16:00',
            type: 'SUF'
          },
        ]);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [origin, destination]);

  const StationCard = ({ station, title }) => {
    if (!station) {
      return (
        <View style={styles.stationCard}>
          <View style={styles.stationInfo}>
            <Text style={styles.stationTitle}>{title}</Text>
            <Text style={styles.errorText}>Station information not available</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.stationCard}>
        <View style={styles.stationInfo}>
          <Text style={styles.stationTitle}>{title}</Text>
          <Text style={styles.stationName}>{station.Name || <Text>N/A</Text>}</Text>
          {station.NameHn && (
            <Text style={styles.stationNameHn}>{station.NameHn}</Text>
          )}
          <Text style={styles.stationCode}>{station.Code || <Text>N/A</Text>}</Text>
        </View>
        {(station.LocationUrl || (station.Latitude && station.Longitude)) && (
          <TouchableOpacity 
            style={styles.mapButton}
            onPress={() => openInMaps(station)}
          >
            <MaterialCommunityIcons name="map-marker" size={24} color="#007AFF" />
            <Text style={styles.mapButtonText}>View on Map</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const TrainItem = ({ train }) => (
    <View style={styles.trainCard}>
      <View>
        <Text style={styles.trainName}>{train.name}</Text>
        <Text style={styles.trainNumber}>Train #{train.number}</Text>
      </View>
      <View style={styles.trainTiming}>
        <View style={styles.timeBox}>
          <MaterialCommunityIcons name="train-car" size={16} color="#007AFF" />
          <Text style={styles.timeText}>{train.departure}</Text>
        </View>
        <MaterialCommunityIcons name="arrow-right" size={16} color="#666" />
        <View style={styles.timeBox}>
          <MaterialCommunityIcons name="train" size={16} color="#007AFF" />
          <Text style={styles.timeText}>{train.arrival}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Results</Text>
      </View>

      <ScrollView style={styles.content}>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            <View style={styles.stationsContainer}>
              <StationCard station={originStation} title="Origin Station" />
              <StationCard station={destinationStation} title="Destination Station" />
            </View>

            <View style={styles.trainsSection}>
              <Text style={styles.sectionTitle}>Available Trains</Text>
              <FlatList
                data={trains}
                renderItem={({ item }) => <TrainItem train={item} />}
                keyExtractor={item => item.number}
                scrollEnabled={false}
              />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  errorText: {
    color: '#f44336',
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    marginTop: 20,
  },
  stationsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  stationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  stationInfo: {
    flex: 1,
  },
  stationTitle: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins-Medium',
    marginBottom: 4,
  },
  stationName: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  stationNameHn: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
  stationCode: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f6ff',
    padding: 8,
    borderRadius: 8,
    gap: 4,
  },
  mapButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  trainsSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'Poppins-Bold',
    marginBottom: 12,
  },
  trainCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  trainName: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  trainNumber: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins-Regular',
    marginBottom: 12,
  },
  trainTiming: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#333',
  },
});
