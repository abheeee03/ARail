import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';

export default function TicketInputScreen() {
  const [ticketNumber, setTicketNumber] = useState('');

  const handleSubmit = () => {
    if (!ticketNumber.trim()) {
      Alert.alert('Error', 'Please enter a ticket number');
      return;
    }
    router.push({
      pathname: '/SeatMap',
      params: { ticketNumber },
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={{position: 'absolute',top: 50,left: 20}}>
      <Text style={{fontSize: 20, color: '#007AFF', fontWeight: 'bold',fontFamily: 'Poppins-Regular'}}>BACK</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Enter Ticket Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Ticket Number"
        value={ticketNumber}
        onChangeText={setTicketNumber}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    
    flex: 1,
    justifyContent: 'center',
    padding: 40,
  },
  title: {
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins-Regular',
    color: '#fff',
    fontSize: 16,
  },
});
