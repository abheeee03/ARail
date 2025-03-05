import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const StationTrainsScreen = () => {
  const [stationCode, setStationCode] = useState('');
  const [hours, setHours] = useState('4');
  const [loading, setLoading] = useState(false);
  const [trains, setTrains] = useState([]);

  const fetchStationTrains = async () => {
    if (!stationCode) {
      Alert.alert('Error', 'Please enter a station code');
      return;
    }

    setLoading(true);
    try {
      const apiKey = '3f82b58461ac24852bf6b16bd9ff52fd';
      const response = await fetch(
        `http://indianrailapi.com/api/v2/LiveStation/apikey/${apiKey}/StationCode/${stationCode}/hours/${hours}`
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data.ResponseCode === '200' && data.Status === 'SUCCESS') {
        setTrains(data.Trains);
      } else {
        console.log(data);
        Alert.alert(data.Message);
      }
    } catch (err) {
      console.error('Error fetching station trains:', err);
      Alert.alert('Error', 'Failed to fetch station information');
    } finally {
      setLoading(false);
    }
  };
  const renderTrainItem = ({ item }) => (
    <View style={styles.trainCard}>
      <View style={styles.trainInfo}>
        <Text style={styles.trainName}>{item.Name}</Text>
        <Text style={styles.trainNumber}>Train #{item.Number}</Text>
      </View>
      <View style={styles.trainDetails}>
        <Text style={styles.detailText}>From: {item.Source}</Text>
        <Text style={styles.detailText}>To: {item.Destination}</Text>
        <Text style={styles.detailText}>Arrival: {item.ScheduleArrival}</Text>
        <Text style={styles.detailText}>Departure: {item.ScheduleDeparture}</Text>
        <Text style={styles.detailText}>Status: {item.ExpectedArrival}</Text>
        <Text style={styles.detailText}>Delay: {item.DelayInArrival}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Station Trains</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Station Code"
          value={stationCode}
          onChangeText={setStationCode}
          maxLength={5}
          autoCapitalize="characters"
        />
        <TextInput
          style={styles.input}
          placeholder="Hours (1-4)"
          value={hours}
          onChangeText={setHours}
          keyboardType="numeric"
          maxLength={1}
        />
        <TouchableOpacity style={styles.searchButton} onPress={fetchStationTrains}>
          <Text style={styles.searchButtonText}>Search Trains</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <FlatList
          data={trains}
          renderItem={renderTrainItem}
          keyExtractor={item => item.Number}
          contentContainerStyle={styles.trainList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginLeft: 16,
  },
  inputContainer: {
    padding: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontFamily: 'Poppins-Regular',
  },
  searchButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
  loader: {
    marginTop: 32,
  },
  trainList: {
    padding: 16,
  },
  trainCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  trainInfo: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
    marginBottom: 8,
  },
  trainName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#333',
  },
  trainNumber: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
  },
  trainDetails: {
    gap: 4,
  },
  detailText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#444',
  },
});

export default StationTrainsScreen;
