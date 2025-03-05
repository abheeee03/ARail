import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const LiveTrain = ({ navigation }) => {
  const [trainNumber, setTrainNumber] = useState('');
  const [date, setDate] = useState('');
  const [trainData, setTrainData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrainStatus = async () => {
    if (!trainNumber || !date) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://indianrailapi.com/api/v2/livetrainstatus/apikey/3f82b58461ac24852bf6b16bd9ff52fd/trainnumber/${trainNumber}/date/${date.replace(/-/g, '')}/`
      );
      const data = await response.json();
      if (data.ResponseCode === '200') {
        setTrainData(data);
      } else {
        console.log(data);
        setError(data.Message);
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
        <View style={styles.inputContainer}>
          <MaterialIcons name="calendar-today" size={24} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter Date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
          />
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={fetchTrainStatus} disabled={loading}>
          <Text style={styles.searchButtonText}>Track Train</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.searchButton, {marginTop: 10}]} onPress={() => router.push('/TrainSearch')} disabled={loading}>
          <Text style={styles.searchButtonText}>Dont Remember? Get Train Number</Text>
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
          <View style={styles.trainHeader}>
            <Text style={styles.trainNumber}>Train {trainData.TrainNumber}</Text>
            <Text style={styles.trainDate}>{trainData.StartDate}</Text>
          </View>

          {trainData.CurrentPosition && (
            <View style={styles.currentStatusContainer}>
              <Text style={styles.sectionTitle}>Current Status</Text>
              <View style={styles.stationCard}>
                <Text style={styles.stationName}>{trainData.CurrentStation.StationName}</Text>
                <Text style={styles.stationCode}>({trainData.CurrentStation.StationCode})</Text>
                <View style={styles.timingsContainer}>
                  <Text style={styles.timingText}>Arrival: {trainData.CurrentStation.ActualArrival}</Text>
                  <Text style={styles.timingText}>Departure: {trainData.CurrentStation.ActualDeparture}</Text>
                </View>
                <View style={styles.delayContainer}>
                  <Text style={styles.delayText}>Arrival Delay: {trainData.CurrentStation.DelayInArrival}</Text>
                  <Text style={styles.delayText}>Departure Delay: {trainData.CurrentStation.DelayInDeparture}</Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.routeContainer}>
            <Text style={styles.sectionTitle}>Train Route</Text>
            {trainData.TrainRoute.map((station, index) => (
              <View key={index} style={styles.stationCard}>
                <Text style={styles.stationName}>{station.StationName}</Text>
                <Text style={styles.stationCode}>({station.StationCode})</Text>
                <View style={styles.timingsContainer}>
                  <Text style={styles.timingText}>Arrival: {station.ScheduleArrival}</Text>
                  {station.ScheduleDeparture !== 'Destination' && (
                    <Text style={styles.timingText}>Departure: {station.ScheduleDeparture}</Text>
                  )}
                </View>
                {station.ActualArrival && (
                  <View style={styles.delayContainer}>
                    <Text style={styles.delayText}>Arrival Delay: {station.DelayInArrival}</Text>
                    {station.DelayInDeparture && (
                      <Text style={styles.delayText}>Departure Delay: {station.DelayInDeparture}</Text>
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

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
    flex: 1,
    padding: 16,
  },
  trainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  trainNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  trainDate: {
    fontSize: 16,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  stationCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stationName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stationCode: {
    fontSize: 14,
    color: '#666',
  },
  timingsContainer: {
    marginTop: 8,
  },
  timingText: {
    fontSize: 14,
    color: '#333',
  },
  delayContainer: {
    marginTop: 8,
  },
  delayText: {
    fontSize: 14,
    color: '#e74c3c',
  },
});

export default LiveTrain;
