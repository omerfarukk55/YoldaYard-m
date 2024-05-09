import React from 'react';
import { Text, View } from 'react-native';

const Header = (props) => {
    

  return (
    <View style={{width:250}} >
      <Text style={{margin:'auto',fontSize:14,fontWeight:'bold',textAlign:"center"}} >{props.name}</Text>
    </View>
  );
};
export default Header

