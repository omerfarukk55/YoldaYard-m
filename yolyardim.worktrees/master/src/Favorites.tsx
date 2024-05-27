import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    loadFavorites();
  }, []);

  const removeFromFavorites = async (index) => {
    try {
      let updatedFavorites = [...favorites];
      updatedFavorites.splice(index, 1); // Remove the item at the specified index
      setFavorites(updatedFavorites); // Update the state
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // Update AsyncStorage
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Favoriler</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.itemText}>Mesafe: {item.distance} km</Text>
            <Text style={styles.itemText}>Yorum: {item.comment}</Text>
            <Text style={styles.itemText}>Puan: {item.rating}</Text>
            <TouchableOpacity style={styles.buttonContent}>
            <Text
              style={styles.removeButton}
              onPress={() => removeFromFavorites(index)}
              >
              Favorilerden Kaldır
            </Text>
              </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    padding: 20,
    
  },
  buttonContent:{
    backgroundColor: '#ea1111',
    left: 150,
    borderRadius: 5,
    position:'absolute',
    width: 200,
    height: 35,
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  item: {
    padding: 10,
    height:150,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
  removeButton: {
    color: 'white',
    textAlign: 'right',
    marginTop: 5,
    fontSize: 20,
  },
});

export default Favorites;
