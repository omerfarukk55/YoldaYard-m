import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { firebase } from '../config';

const Dashboard = (props) => {
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.41191,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      
      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        updateRegion(location.coords.latitude, location.coords.longitude);
      } catch (error) {
        console.error('Error fetching location:', error);
        setErrorMsg('Error fetching location');
      }
    };

    requestLocationPermission();
  }, [location]);

  const updateRegion = (latitude, longitude) => {
    setRegion({
      latitude:latitude,
      longitude:longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  const signOut = async () => {
    try {
      await firebase.auth().signOut();
      console.log('Signed out successfully!');
      // Additional actions after sign out (e.g., redirecting)
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  let displayText = 'Waiting for location...';
  if (errorMsg) {
    displayText = errorMsg;
  } else if (location) {
    displayText = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{props.name}</Text>
      
      <MapView 
        style={styles.map} 
        initialRegion={region}
        showsUserLocation ={true}
        showsMyLocationButton ={true}
       
      />
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 15,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 28,
    textAlign: 'center',
  },
 
  map: {
    flex: 1,
    width: '95%',
    height: '90%',
  },
});

export default Dashboard;
/* 
        <MapView
    style={styles.map}
    initialRegion={region}
  >
    {userLocation && (
      <Marker
        coordinate={userLocation}
        title="Konumum"
      />
    )}
  </MapView>
  */ 