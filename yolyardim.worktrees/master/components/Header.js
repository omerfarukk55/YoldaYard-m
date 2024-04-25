import {View,Text} from 'react-native'
import React from 'react'

const Header = (props) => {
    

  return (
    <View style={{width:250}} >
      <Text style={{margin:'auto',fontSize:14,fontWeight:'bold',textAlign:"center"}} >{props.name}</Text>
    </View>
  );
};
export default Header

