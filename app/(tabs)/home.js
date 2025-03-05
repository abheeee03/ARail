import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Linking, Alert } from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

export default function HomeScreen() {
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [loading, setLoading] = useState(false);
  const [nearestStation, setNearestStation] = useState(null);
  const [tripType, setTripType] = useState('one-way');
  const [date, setDate] = useState('');
  const [trainClass, setTrainClass] = useState('');
  const [passengers, setPassengers] = useState('0 Adult');
  const [showValidation, setShowValidation] = useState(false);

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

  const handleHelplineCall = async () => {
    try {
      await Linking.openURL('tel:139');
    } catch (error) {
      Alert.alert(
        "Error",
        "Could not open phone dialer. Please dial 139 manually.",
        [{ text: "OK" }]
      );
    }
  };

  const handleSearch = () => {
    const trimmedStart = startPoint.trim();
    const trimmedEnd = endPoint.trim();

    if (!trimmedStart || !trimmedEnd) {
      setShowValidation(true);
      Alert.alert('Error', 'Please enter both origin and destination stations');
      return;
    }

    router.push({
      pathname: '/search-results',
      params: {
        origin: trimmedStart,
        destination: trimmedEnd
      }
    });
  };

  const handleARButtonClick = () => {
    const arAppUrl = 'RailRoverAR://start-ar';
    Linking.canOpenURL(arAppUrl).then(supported => {
      if (supported) {
        Linking.openURL(arAppUrl);
      } else {
        Alert.alert('AR App not installed');
      }
    });
  };

  const QuickActionButton = ({ icon, title, subtitle, onPress }) => (
    <TouchableOpacity style={styles.quickActionButton} onPress={onPress}>
      {icon}
      <Text style={styles.quickActionTitle}>{title}</Text>
      {subtitle && <Text style={styles.quickActionSubtitle}>{subtitle}</Text>}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Blue Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.profileSection}>
          <Text style={styles.greeting}>Welcome to 👋</Text>
          <Text style={[styles.userName, {fontSize: 27}]}>Rail Rover</Text>
        </View>
      </View>

      {/* White Content Section */}
      <View style={styles.contentSection}>
        {/* Elevated Input Card */}
        <View style={styles.inputCard}>
          {/* Trip Type Selector */}
          <View style={styles.tripTypeSelector}>
              <Text style={[styles.tripTypeText, tripType === 'one-way' && styles.tripTypeTextActive]}>Search Stations</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Origin</Text>
            <TextInput
              style={[styles.input, showValidation && !startPoint.trim() && styles.inputError]}
              placeholder="Enter starting point"
              value={startPoint}
              onChangeText={(text) => setStartPoint(text.trim())}
              placeholderTextColor="#999"
            />
            {showValidation && !startPoint.trim() && <Text style={styles.errorText}>Origin station is required</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Destination</Text>
            <TextInput
              style={[styles.input, showValidation && !endPoint.trim() && styles.inputError]}
              placeholder="Enter destination"
              value={endPoint}
              onChangeText={(text) => setEndPoint(text.trim())}
              placeholderTextColor="#999"
            />
            {showValidation && !endPoint.trim() && <Text style={styles.errorText}>Destination station is required</Text>}
          </View>

          <TouchableOpacity
            style={[styles.searchButton, (loading || !startPoint.trim() || !endPoint.trim()) && styles.searchButtonDisabled]}
            onPress={handleSearch}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.searchButtonText}>Search Train & Station</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.quickActionsGrid}>
          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => router.push('/TicketInput')}>
              <MaterialCommunityIcons name="ticket-confirmation" size={24} color="#007AFF" />
              <Text style={styles.quickActionTitle}>View Ticket</Text>
            </TouchableOpacity>
            <QuickActionButton 
              icon={<MaterialCommunityIcons name="phone" size={24} color="#007AFF" />}
              title="Railway Helpline"
              onPress={handleHelplineCall}
            />
            <QuickActionButton 
              icon={<MaterialCommunityIcons name="train-car" size={24} color="#007AFF" />}
              title="View All Trains On Station"
              onPress={() => router.push('/station-trains')}
            />
            
          </View>
          <View style={styles.quickActionsRow}>
          <QuickActionButton 
          onPress={() => router.push('/food')}
              icon={<MaterialCommunityIcons name="food" size={24} color="#007AFF" />}
              title="Order Food"
            />
          <QuickActionButton 
              icon={<MaterialCommunityIcons name="calendar" size={24} color="#007AFF" />}
              title="Train Schedule"
              onPress={() => router.push('/schedule')}
            />
            <QuickActionButton 
            onPress={() => router.push('/LiveTrain')}
              icon={<MaterialCommunityIcons name="train" size={24} color="#007AFF" />}
              title="Track Train Live"
            />
          </View>
            <TouchableOpacity
            style={styles.searchButton}
            onPress={handleARButtonClick}
            >
              <Text style={styles.searchButtonText}>View Current Station In AR</Text>
            
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerSection: {
    height: '50%',
    backgroundColor: '#007AFF',
    paddingTop: 18,
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
    paddingBottom: 20,
  },
  inputCard: {
    backgroundColor: '#fff',
    marginTop: -200,
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
  tripTypeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tripTypeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tripTypeButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tripTypeText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Poppins-Medium',
  },
  tripTypeTextActive: {
    color: '#007AFF',
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
  inputText: {
    color: '#666',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  searchButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  quickActionsGrid: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickActionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f6ff',
    borderRadius: 12,
    padding: 8,
    width: '25%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionTitle: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'Poppins-Medium',
    marginTop: 8,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 10,
    color: '#666',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },
});
