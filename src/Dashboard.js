import { View, Text } from 'react-native'
import React from 'react'

const Dashboard = (props) => {
  return (
    <View style={{marginLeft:15}}>
      <Text style={{fontWeight:'bold',fontSize:28}}>
      {props.name}
      KONUMUNUZA EN YAKIN ÇEKİCİYİ BULUNUZ 
      </Text>
    </View>
  )
}

export default Dashboard