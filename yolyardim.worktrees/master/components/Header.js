import React from 'react';
import { Text, View } from 'react-native';

const Header = (props) => {
    

  return (
    <View style={{width:'100%',textAlign:"center",display:'flex',justifyContent:'center', alignItems:'center',padding:20}} >
      <Text style={{width:'100%',fontSize:20,fontWeight:'bold',textAlign:"center",display:'flex',justifyContent:'center', alignItems:'center'}} >{props.name}</Text>
    </View>
  );
};
export default Header

