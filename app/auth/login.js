import React from 'react';
import { StyleSheet, View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import { auth } from '../../config/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const images = [
  require('../../assets/images/train1.jpg'),
  require('../../assets/images/train2.jpg'),
  require('../../assets/images/train3.jpg'),
];

export default function LoginScreen() {
  // const signInWithGoogle = async () => {
  //   try {
  //     const provider = new GoogleAuthProvider();
  //     await signInWithPopup(auth, provider);
  //     router.replace('/(tabs)/home');
  //   } catch (error) {
  //     console.error('Error signing in with Google:', error);
  //     alert('Failed to sign in with Google');
  //   }
 

  return (
    <ImageBackground
      source={images[0]}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>ARail</Text>
        <Text style={styles.subtitle}>Find Your Perfect Railway Route</Text>
        
        <Link
        href="/(tabs)/home"
          style={styles.googleButton}
          >
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </Link>
      </View>
    </ImageBackground>
  );


}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 40,
    textAlign: 'center',
  },
  googleButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});
