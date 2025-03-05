import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const food = () => {
  return (
    <View style={{padding: 20, height: '100%'}}>
        <Link href={'/home'}>
        <Text style={{fontSize: 20, color: '#007AFF', fontFamily: 'Poppins-Bold'}}>Back</Text>
        </Link>
      <Text style={{marginTop: '50%', fontSize: 20, color: '#007AFF', textAlign: 'center', fontFamily: 'Poppins-Bold'}}>Redirecting you {'\n'} to Partner Website....</Text>
    </View>
  )
}

export default food