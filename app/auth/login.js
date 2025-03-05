import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text, ImageBackground, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { Link, router } from 'expo-router';

const images = [
  require('../../assets/images/train1.jpg'),
  require('../../assets/images/train2.jpg'),
  require('../../assets/images/train3.jpg'),
];

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const autoScroll = setInterval(() => {
      if (currentIndex < images.length - 1) {
        flatListRef.current?.scrollToIndex({
          index: currentIndex + 1,
          animated: true,
        });
        setCurrentIndex(currentIndex + 1);
      } else {
        flatListRef.current?.scrollToIndex({
          index: 0,
          animated: true,
        });
        setCurrentIndex(0);
      }
    }, 3000);

    return () => clearInterval(autoScroll);
  }, [currentIndex]);

  const renderItem = ({ item }) => (
    <View style={styles.slideContainer}>
      <ImageBackground
        source={item}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top Division - Image Carousel */}
      <View style={styles.carouselContainer}>
        <FlatList
          ref={flatListRef}
          data={images}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentIndex(newIndex);
          }}
        />
        <View style={styles.pagination}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Bottom Division - Content */}
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: 'black' }]}>RailRover</Text>
        <Text style={[styles.description, { color: 'black' }]}>Transform Your Travel Experience with Accurate Train Schedules, Real-Time Alerts, and Effortless Navigation!
        </Text>
        
        <Link
          href="/(tabs)/home"
          style={styles.googleButton}
          onPress={() => {/* Handle Google Sign In */}}
        >
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  carouselContainer: {
    height: '50%',
    backgroundColor: '#000',
  },
  slideContainer: {
    width: width,
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: 10,
    height: '50%',
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  pagination: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: 'white',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    fontFamily: 'Poppins-Bold',
  },
  subtitle: {
    fontSize: 24,
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  description: {
    fontSize: 16,
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
    fontFamily: 'Poppins-Regular',
  },
  googleButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  googleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-Bold',
  },
});
