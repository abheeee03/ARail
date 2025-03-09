import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const LiveTrain = ({ navigation }) => {
  const [trainNumber, setTrainNumber] = useState('');
  const [trainData, setTrainData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrainStatus = async () => {
    if (!trainNumber) return;
    setLoading(true);
    setError(null);

    try {
      const url = `https://irctc1.p.rapidapi.com/api/v1/liveTrainStatus?trainNo=${trainNumber}&startDay=1`;
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '6efad85598msh799ea2c48b34240p1f9269jsn1d8f72826bb1',
          'x-rapidapi-host': 'irctc1.p.rapidapi.com'
        }
      };

      const response = await fetch(url, options);
      const result = await response.json();
      
      if (result.status && result.data.success) {
        setTrainData(result.data);
      } else {
        setError('Unable to fetch train data');
      }
    } catch (err) {
      setError('Error fetching train data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/home')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#007bff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Train Status</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <MaterialIcons name="train" size={24} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter Train Number"
            value={trainNumber}
            onChangeText={setTrainNumber}
            keyboardType="numeric"
          />
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={fetchTrainStatus} disabled={loading}>
          <Text style={styles.searchButtonText}>Track Train</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.searchButton, {marginTop: 10}]} onPress={() => router.push('/TrainSearch')} disabled={loading}>
          <Text style={styles.searchButtonText}>Don't Remember? Get Train Number</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#007bff" style={styles.loader} />}

      {error && (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error" size={24} color="red" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {trainData && (
        <ScrollView style={styles.trainDetailsContainer}>
          <View style={styles.trainInfoCard}>
            <Text style={styles.trainName}>{trainData.train_name}</Text>
            <Text style={styles.trainNumber}>Train No: {trainData.train_number}</Text>
            <View style={styles.routeInfo}>
              <View style={styles.stationInfo}>
                <Text style={styles.stationName}>{trainData.source_stn_name}</Text>
                <Text style={styles.stationCode}>({trainData.source})</Text>
              </View>
              <MaterialIcons name="arrow-forward" size={24} color="#666" />
              <View style={styles.stationInfo}>
                <Text style={styles.stationName}>{trainData.dest_stn_name}</Text>
                <Text style={styles.stationCode}>({trainData.destination})</Text>
              </View>
            </View>
          </View>

          <View style={styles.currentStatusCard}>
            <Text style={styles.sectionTitle}>Current Status</Text>
            <View style={styles.statusDetails}>
              <Text style={styles.statusText}>Current Station: {trainData.current_station_name} ({trainData.current_station_code})</Text>
              <Text style={styles.statusText}>Platform: {trainData.platform_number}</Text>
              <Text style={styles.statusText}>Status: {trainData.status}</Text>
              <Text style={styles.delayText}>Delay: {Math.floor(trainData.delay / 60)}h {trainData.delay % 60}m</Text>
              <Text style={styles.statusText}>Last Updated: {trainData.status_as_of}</Text>
            </View>
          </View>

          <View style={styles.journeyCard}>
            <Text style={styles.sectionTitle}>Journey Details</Text>
            <View style={styles.journeyDetails}>
              <Text style={styles.journeyText}>Distance Covered: {trainData.distance_from_source} km</Text>
              <Text style={styles.journeyText}>Total Distance: {trainData.total_distance} km</Text>
              <Text style={styles.journeyText}>Journey Time: {Math.floor(trainData.journey_time / 60)}h {trainData.journey_time % 60}m</Text>
              <Text style={styles.journeyText}>Running Days: {trainData.run_days}</Text>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default LiveTrain;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginVertical: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffe6e6',
    borderRadius: 8,
    margin: 16,
  },
  errorText: {
    color: 'red',
    marginLeft: 8,
  },
  trainDetailsContainer: {
    padding: 16,
  },
  trainInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  trainName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  trainNumber: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  stationInfo: {
    flex: 1,
  },
  stationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  stationCode: {
    fontSize: 14,
    color: '#666',
  },
  currentStatusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  statusDetails: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  statusText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
  },
  delayText: {
    fontSize: 15,
    color: '#dc3545',
    fontWeight: '500',
    marginBottom: 8,
  },
  journeyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  journeyDetails: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  journeyText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
  },
});
