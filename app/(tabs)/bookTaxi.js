import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions, Animated } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

// Initial demo taxi data
const INITIAL_TAXIS = [
  { id: 1, coordinate: { latitude: 28.6139, longitude: 77.2090 }, type: 'Standard', price: '₹150' },
  { id: 2, coordinate: { latitude: 28.6150, longitude: 77.2100 }, type: 'Premium', price: '₹200' },
  { id: 3, coordinate: { latitude: 28.6130, longitude: 77.2080 }, type: 'Economy', price: '₹100' },
];

// Movement patterns for each taxi (in latitude/longitude deltas)
const MOVEMENT_PATTERNS = [
  [
    { latDelta: 0.002, lngDelta: 0.002 },
    { latDelta: -0.002, lngDelta: -0.002 },
  ],
  [
    { latDelta: -0.001, lngDelta: 0.003 },
    { latDelta: 0.001, lngDelta: -0.003 },
  ],
  [
    { latDelta: 0.002, lngDelta: -0.001 },
    { latDelta: -0.002, lngDelta: 0.001 },
  ],
];

const CustomMarker = ({ type }) => (
  <View style={styles.markerContainer}>
    <View style={styles.markerBubble}>
      <FontAwesome name="taxi" size={20} color="#FFD700" />
    </View>
    <View style={styles.markerArrow} />
  </View>
);

export default function BookTaxi() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedTaxi, setSelectedTaxi] = useState(null);
  const [taxis, setTaxis] = useState(INITIAL_TAXIS);
  const animatedTaxis = useRef(INITIAL_TAXIS.map(() => ({
    latitude: new Animated.Value(0),
    longitude: new Animated.Value(0),
  }))).current;
  const movementIndexRef = useRef(INITIAL_TAXIS.map(() => 0));
  const router = useRouter();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Initialize animated values
      INITIAL_TAXIS.forEach((taxi, index) => {
        animatedTaxis[index].latitude.setValue(taxi.coordinate.latitude);
        animatedTaxis[index].longitude.setValue(taxi.coordinate.longitude);
      });

      // Start taxi animations
      startTaxiAnimations();
    })();
  }, []);

  const startTaxiAnimations = () => {
    const createTaxiAnimation = (taxiIndex) => {
      const currentPattern = MOVEMENT_PATTERNS[taxiIndex];
      const currentIndex = movementIndexRef.current[taxiIndex];
      const movement = currentPattern[currentIndex];
      const currentTaxi = taxis[taxiIndex];

      const nextLatitude = currentTaxi.coordinate.latitude + movement.latDelta;
      const nextLongitude = currentTaxi.coordinate.longitude + movement.lngDelta;

      const animation = Animated.parallel([
        Animated.timing(animatedTaxis[taxiIndex].latitude, {
          toValue: nextLatitude,
          duration: 3000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedTaxis[taxiIndex].longitude, {
          toValue: nextLongitude,
          duration: 3000,
          useNativeDriver: false,
        }),
      ]);

      animation.start(() => {
        // Update taxi position
        setTaxis(prevTaxis => {
          const newTaxis = [...prevTaxis];
          newTaxis[taxiIndex] = {
            ...newTaxis[taxiIndex],
            coordinate: {
              latitude: nextLatitude,
              longitude: nextLongitude,
            },
          };
          return newTaxis;
        });

        // Update movement index
        movementIndexRef.current[taxiIndex] = 
          (movementIndexRef.current[taxiIndex] + 1) % currentPattern.length;

        // Continue animation
        createTaxiAnimation(taxiIndex);
      });
    };

    // Start animation for each taxi
    INITIAL_TAXIS.forEach((_, index) => {
      createTaxiAnimation(index);
    });
  };

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {taxis.map((taxi, index) => (
            <Marker.Animated
              key={taxi.id}
              coordinate={{
                latitude: animatedTaxis[index].latitude,
                longitude: animatedTaxis[index].longitude,
              }}
              onPress={() => setSelectedTaxi(taxi)}
            >
              <CustomMarker type={taxi.type} />
            </Marker.Animated>
          ))}
        </MapView>
      )}

      <View style={styles.bottomSheet}>
        <View style={styles.bottomSheetHeader}>
          <Text style={styles.title}>Available Taxis Nearby</Text>
          <View style={styles.line} />
        </View>
        {taxis.map(taxi => (
          <TouchableOpacity 
            key={taxi.id} 
            style={[
              styles.taxiItem,
              selectedTaxi?.id === taxi.id && styles.selectedTaxi
            ]}
            onPress={() => setSelectedTaxi(taxi)}
          >
            <View style={styles.taxiInfo}>
              <FontAwesome name="taxi" size={24} color="#FFD700" style={styles.taxiIcon} />
              <View>
                <Text style={styles.taxiType}>{taxi.type}</Text>
                <Text style={styles.taxiPrice}>{taxi.price}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.bookButton}
              onPress={() => {/* Handle booking */}}
            >
              <Text style={styles.bookButtonText}>Book</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerBubble: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerArrow: {
    backgroundColor: 'white',
    width: 10,
    height: 10,
    transform: [{ rotate: '45deg' }],
    marginTop: -5,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bottomSheetHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  line: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D1D6',
    borderRadius: 2,
    marginTop: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  taxiItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedTaxi: {
    backgroundColor: '#F8F8F8',
  },
  taxiInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taxiIcon: {
    marginRight: 12,
  },
  taxiType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  taxiPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  bookButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bookButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});