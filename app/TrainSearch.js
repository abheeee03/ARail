import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';

const TrainSearch = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [trainResults, setTrainResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrainNumbers = async () => {
    if (!searchQuery) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://indianrailapi.com/api/v2/AutoCompleteTrainInformation/apikey/3f82b58461ac24852bf6b16bd9ff52fd/TrainNumberOrName/${searchQuery}/`
      );
      const data = await response.json();
      if (data.ResponseCode === '200') {
        setTrainResults(data.Trains);
      } else {
        setError(data.Message || 'No trains found');
      }
    } catch (err) {
      setError('Error fetching train data');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied!', 'Train number copied to clipboard');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/home')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#007bff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find Train Number</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <MaterialIcons name="search" size={24} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter Train Name or Number"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={fetchTrainNumbers} disabled={loading}>
          <Text style={styles.searchButtonText}>Search Trains</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#007bff" style={styles.loader} />}

      {error && (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error" size={24} color="red" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <ScrollView style={styles.resultsContainer}>
        {trainResults.map((train, index) => (
          <View key={index} style={styles.trainCard}>
            <View style={styles.trainInfo}>
              <Text style={styles.trainNumber}>{train.TrainNo}</Text>
              <Text style={styles.trainName}>{train.TrainName}</Text>
              <View style={styles.routeContainer}>
                <Text style={styles.routeText}>{train.Source.Code} → {train.Destination.Code}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => copyToClipboard(train.TrainNo)} style={styles.copyButton}>
              <MaterialIcons name="content-copy" size={24} color="#007bff" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
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
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  trainCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  trainInfo: {
    flex: 1,
  },
  trainNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  trainName: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  routeContainer: {
    marginTop: 8,
  },
  routeText: {
    fontSize: 14,
    color: '#333',
  },
  copyButton: {
    marginLeft: 16,
  },
});

export default TrainSearch;
