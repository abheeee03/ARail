import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const alerts = () => {
  return (
    <View style={{padding: 20}}>
      <Link href="/home"><Text style={{fontSize: 20, color: '#007AFF', fontWeight: 'bold'}}>Back</Text></Link>
      <View style={{marginTop: 20, marginTop: 20}}>
        <View><Text style={{padding: 10, fontSize: 19, borderBottomWidth: 1, borderBottomColor: 'grey'}}>Emergency Alert Enitiated At Your Station Recently !</Text></View>
      </View>
      <View style={{marginTop: 20, marginTop: 20}}>
        <View><Text style={{padding: 10, fontSize: 19, borderBottomWidth: 1, borderBottomColor: 'grey'}}>Platform Number : 5 will be Off due to some reasons, Instead of Arriving on Platform no 5 trains will Arrive at Platform number 6</Text></View>
      </View>
    </View>
  )
}

export default alerts