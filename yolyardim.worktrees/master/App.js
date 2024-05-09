import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from 'react';
import { firebase } from "./config";

import Header from "./components/Header";
import Dashboard from "./src/Dashboard";
import Login from "./src/Login";
import Registration from "./src/Registration";

const Stack = createStackNavigator();

function App(){
  const [initializing,setInitializing] = useState(true);
  const [user,setUser] = useState();

  //handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if(initializing) setInitializing(false);
  }
  useEffect(()=>{
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  },[]);
  if(initializing) return null;
  if(!user){
    return(
      <Stack.Navigator>
       <Stack.Screen 
       name='login'
       component={Login}
       options={{
         headerTitle:()=><Header name="Çekici Uygulamasina Hoşgeldiniz"/>,
         headerStyle:{
          height:150,
          borderBottomLeftRadius:50,
          borderBottomRightRadius:50,
          backgroundColor:'#00e4d0',
          shadowColor:'#000',
          elevation:25
         }
        }}
       />
       <Stack.Screen 
       name='Registration'
       component={Registration}
       options={{
         headerTitle:()=><Header name="Çekici Uygulamasina Hoşgeldiniz"/>,
         headerStyle:{
          height:150,
          borderBottomLeftRadius:50,
          borderBottomRightRadius:50,
          backgroundColor:'#00e4d0',
          shadowColor:'#000',
          elevation:25
         }
        }}
       />

      </Stack.Navigator>
    );
  }
  return(
    <Stack.Navigator>
    <Stack.Screen 
       name='Dashboard'
       component={Dashboard}
       options={{
         
         headerStyle:{
          height:100,
          borderBottomLeftRadius:50,
          borderBottomRightRadius:50,
          backgroundColor:'#00e4d0',
          shadowColor:'#000',
          elevation:20,
          
         }
        }}
       />
    </Stack.Navigator>
  );
}

export default ()=>{
  return (
    <NavigationContainer>
    <App/>
    </NavigationContainer>
  )
}
