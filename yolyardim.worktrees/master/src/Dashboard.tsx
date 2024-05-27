import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Rating } from 'react-native-ratings';

import { NavigationProp, useNavigation } from '@react-navigation/native';
import { firebase } from '../config';

import { RootStackParamList } from '../types';

type DashboardNavigationProp = NavigationProp<RootStackParamList, 'Dashboard'>;
const calculateDistance = async (origin, destination) => {
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.latitude},${origin.longitude}&destinations=${destination.latitude},${destination.longitude}&key=AIzaSyB3gmOSr3xGi3hAd-gfO5bTk5GXVwjk3TY`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      const distance = data.rows[0].elements[0].distance.value;
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
  const [results, setResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(3);
  const map = useRef(null);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.41191,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [distance, setDistance] = useState(null);
  const navigation = useNavigation<DashboardNavigationProp>();
  
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
    loadFavorites();
  }, []);

  const updateRegion = (lat, lng) => {
    setRegion(prevState => ({
      ...prevState,
      latitude: lat,
      longitude: lng,
    }));
  };

  const loadFavorites = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      if (favorites) {
        setResults(JSON.parse(favorites)); // Burada setResults kullanılmalı
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };
  const addToFavorites = async (item) => {
    const newItem = {
      ...item,
      distance: distance,
      comment: comment,
      rating: rating,
    };

    try {
      let favorites = await AsyncStorage.getItem('favorites');
      console.log('Retrieved favorites from AsyncStorage:', favorites);

      if (favorites) {
        favorites = JSON.parse(favorites); // Parse string to array
      } else {
        Favorites = []; // Initialize as empty array if no favorites found
      }
      console.log('Parsed favorites:', favorites);

      favorites.push(newItem); // Add new item to favorites array
      console.log('Updated favorites:', favorites);

      await AsyncStorage.setItem('favorites', JSON.stringify(favorites)); // Store updated favorites array
      alert('Favorilere eklendi!');
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const signOut = async () => {
    try {
      await firebase.auth().signOut();
      console.log('Signed out successfully!');
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
      <Button title="Favoriler" onPress={() => navigation.navigate('Favorites')} />
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
            onPress={() => handleMarkerPress(item)}
          />
        )) : null}
      </MapView>
      {selectedItem && (
        <View>
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
              <Text style={styles.text}>{selectedItem.name}</Text>
              <Text>Mesafe: {distance} km</Text>
              <Rating
                imageSize={20}
                startingValue={rating}
                onFinishRating={setRating}
                style={styles.rating}
              />
              <TextInput
                style={styles.commentInput}
                placeholder="Yorum ekleyin"
                onChangeText={setComment}
                value={comment}
              />
              <TouchableOpacity style={styles.buttonContent} onPress={() => addToFavorites(selectedItem)}>
                <Text style={styles.buttonLabel}>Favorilere Ekle</Text>
              </TouchableOpacity>
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
  container: {
    flex: 1,
    padding: 10,
  },
  text:{
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    margin:5,
  },
  rating:{
    padding: 3,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 5,
    width: '100%',
    marginBottom: 5,
    marginTop: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    display:'flex',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '80%',
    marginBottom: 10,
    marginTop: 10,
  },
  buttonContent:{
    backgroundColor: '#ea1111',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  commentInput:{
      width:'100%',
      borderColor: 'black',
      borderWidth: 1,
      marginBottom: 10,
      padding: 10,
      borderRadius: 5,
      borderBlockColor: 'black',
  }, 
  searchBox: {
    position: 'absolute',
    top: 100,
    left: '5%',
    width: '60%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  searchBoxField: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  buttonContainer: {
    backgroundColor: '#00e4d0',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonLabel: {
    color: 'white',
    fontSize: 16,
  },
  calloutContainer: {
    position: 'absolute',
    zIndex: 100,
    width:250,
    alignContent: 'center',
    marginTop:'auto',
    flex: 1,
    left: 50,
    padding: 10,
    borderRadius:10,
    justifyContent: 'center',
    backgroundColor: 'white',
    bottom: 40,
    alignItems: 'center',
  },
});

export default Dashboard;
