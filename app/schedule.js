import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';

export default function ScheduleScreen() {
  const [trainNumber, setTrainNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState(null);
  const [error, setError] = useState(null);

  const fetchSchedule = async () => {
    if (!trainNumber.trim()) {
      setError('Please enter a train number');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://indianrailapi.com/api/v2/TrainSchedule/apikey/3f82b58461ac24852bf6b16bd9ff52fd/TrainNumber/${trainNumber}`
      );
      const data = await response.json();

      if (data.ResponseCode === "200" && data.Status === "SUCCESS") {
        setSchedule(data.Route);
      } else {
        setError(data.Message || 'Failed to fetch schedule');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const StationItem = ({ item, isLast }) => (
    <View style={styles.stationContainer}>
      <View style={styles.timelineContainer}>
        <View style={[styles.timelineDot, { backgroundColor: item.SerialNo === "1" ? '#4CAF50' : item.SerialNo === schedule.length ? '#f44336' : '#007AFF' }]} />
        {!isLast && <View style={styles.timelineLine} />}
      </View>
      <View style={styles.stationContent}>
        <Text style={styles.stationName}>{item.StationName}</Text>
        <Text style={styles.stationCode}>({item.StationCode})</Text>
        <View style={styles.timeContainer}>
          <View style={styles.timeBox}>
            <MaterialCommunityIcons name="train-car" size={16} color="#007AFF" />
            <Text style={styles.timeText}>Arr: {item.ArrivalTime}</Text>
          </View>
          <View style={styles.timeBox}>
            <MaterialCommunityIcons name="train" size={16} color="#007AFF" />
            <Text style={styles.timeText}>Dep: {item.DepartureTime}</Text>
          </View>
        </View>
        <Text style={styles.distanceText}>{item.Distance} km</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Train Schedule</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Train Number"
          value={trainNumber}
          onChangeText={setTrainNumber}
          keyboardType="numeric"
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={fetchSchedule}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.searchButtonText}>Search</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: 'center', marginTop: 10 }}>
        <Link href="/TrainSearch">
          <Text style={{ color: '#007bff', fontWeight: 'bold', fontFamily: 'Poppins-Regular' }}>Don't Remember? Find Train Number</Text>
        </Link>
      </View>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {schedule && (
        <FlatList
          data={schedule}
          renderItem={({ item, index }) => (
            <StationItem item={item} isLast={index === schedule.length - 1} />
          )}
          keyExtractor={(item) => item.SerialNo}
          contentContainerStyle={styles.scheduleList}
        />
      )}
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
  searchContainer: {
    padding: 16,
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  errorText: {
    color: '#f44336',
    padding: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  scheduleList: {
    padding: 16,
  },
  stationContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineContainer: {
    alignItems: 'center',
    width: 24,
    marginRight: 12,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#007AFF',
    opacity: 0.3,
    marginVertical: 4,
  },
  stationContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  stationName: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  stationCode: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
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
  distanceText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
});
