import {View,Text} from 'react-native'
import React from 'react'

const Header = (props) => {
    

  return (
    <View style={{width:100}} >
      <Text style={{margin:'auto',fontSize:15,fontWeight:'bold',textAlign: 'center',}} >{props.name}</Text>
    </View>
  );
};
export default Header

