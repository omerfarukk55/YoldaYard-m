import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { firebase } from '../config';

const calculateDistance = async (origin, destination) => {
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.latitude},${origin.longitude}&destinations=${destination.latitude},${destination.longitude}&key=AIzaSyB3gmOSr3xGi3hAd-gfO5bTk5GXVwjk3TY`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      const distance = data.rows[0].elements[0].distance.value; // Mesafe metre cinsinden
      return distance / 1000; // Mesafeyi kilometreye dönüştür
      
    } else {
      throw new Error('Mesafe hesaplanamadı');
    }
  } catch (error) {
    console.error('Hata:', error);
    throw error;
  }
};

const Dashboard = (props) => {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const map = useRef<MapView | null>(null);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.41191,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [distance, setDistance] = useState(null);

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
  }, []);

  const updateRegion = (lat, lng) => {
    setRegion(prevState => ({
      ...prevState,
      latitude: lat,
      longitude: lng,
    }));
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

   
  const searchPlaces = async () => {
    if (!searchText.trim().length) return;

    const googleApisUrl = "https://maps.googleapis.com/maps/api/place/textsearch/json";
    const input = searchText.trim();
    const location = `${region.latitude},${region.longitude}&radius=2000`;
    const url = `${googleApisUrl}?query=${input}&location=${location}&key=AIzaSyB3gmOSr3xGi3hAd-gfO5bTk5GXVwjk3TY`;

    try {
      const resp = await fetch(url);
      const json = await resp.json();
      if (json && json.results) {
        const coords = json.results.map(item => ({
          latitude: item.geometry.location.lat,
          longitude: item.geometry.location.lng
        }));
        setResults(json.results);
        if (coords.length) {
          map.current?.fitToCoordinates(coords, {
            edgePadding: {
              top: 50,
              right: 50,
              bottom: 50,
              left: 50
            },
            animated: true
          });
          Keyboard.dismiss();
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  const handleMarkerPress = async (marker) => {
    try {
      const { coords } = location;
      const origin = { latitude: coords.latitude, longitude: coords.longitude };
      const destination = { latitude: marker.geometry.location.lat, longitude: marker.geometry.location.lng };

      const distance = await calculateDistance(origin, destination);
      setSelectedItem(marker);
      setDistance(distance.toFixed(2));
    } catch (error) {
      console.error('Mesafe hesaplanamadı:', error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{props.name}</Text>

      <MapView
        ref={map} 
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={region} 
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {results.length ? results.map((item, i) => (
          <Marker
          key={`search-item-${i}`}
          coordinate={{
            latitude: item.geometry.location.lat,
            longitude: item.geometry.location.lng
          }}
          title={item.name}
          onPress={() => handleMarkerPress(item)}>
          </Marker>
      )) : null}
      </MapView>
      {selectedItem && (
        <View >
          <MapViewDirections
          origin={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          }}
          destination={{
            latitude: selectedItem.geometry.location.lat,
            longitude: selectedItem.geometry.location.lng
          }}
          apikey='AIzaSyB3gmOSr3xGi3hAd-gfO5bTk5GXVwjk3TY'
          strokeWidth={3}
          strokeColor="blue"
          />
          <Callout>
            <View style={styles.calloutContainer}>
              <Text>{selectedItem.name}</Text>
              <Text>Mesafe: {distance} km</Text>
            </View>
          </Callout>
        </View>
      )}
      <View style={styles.searchBox}>
        <Text>Arama Yap</Text>
        <TextInput
          style={styles.searchBoxField}
          onChangeText={setSearchText}
          autoCapitalize='sentences'
        />
        <TouchableOpacity style={styles.buttonContainer} onPress={searchPlaces}>
          <Text style={styles.buttonLabel}>Ara</Text>
        </TouchableOpacity>
      </View>

      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  calloutContainer:{
   position: 'absolute',
   bottom: 50,
   fontSize: 20,
   textAlign: 'center',
   left: 50,
   width: 150,
   height: 70,
   borderRadius: 10,
   padding: 10,
   shadowColor: '#000',
   backgroundColor: '#fff',
   zIndex:10,
  },
  searchBox: {
    position: 'absolute',
    width: '72%',
    borderRadius:8,
    borderWidth:1,
    borderColor:'#aaa',
    backgroundColor:'#ffffff',
    height:110,
    padding:8,
    alignSelf:"center",
    marginTop:40,
  },
  searchBoxField:{
borderColor:"#777",
borderWidth:1,
borderRadius:4,
paddingHorizontal:8,
paddingVertical:4,
fontSize:18,
marginTop:8,
  },
  buttonContainer:{
  alignItems:"center",
  justifyContent:'center',
  backgroundColor:'#26f',
  padding:8,
  borderRadius:8,
  },
  buttonLabel:{
    fontSize:18,
    color:'#fff',
  },
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
    alignSelf: 'center',
    height: '95%',
  },
});

export default Dashboard;
