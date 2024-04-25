import React, { useState } from 'react';
import { View,Text, TextInput, Button, StyleSheet } from 'react-native';
import {firebase} from '../config';


const Registration = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      // Create user with email and password
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user; // Get the created user object

      // Update user profile with name and surname (if supported by your Firebase setup)
      if (user) {
        await user.updateProfile({
          displayName: `${name} ${surname}`,
        });
      } else {
        console.warn('User profile update failed (might not be supported)');
      }
      
      console.log('Kayıt başarılı!');
      // Handle successful registration (e.g., navigate to a confirmation screen)
    } catch (error) {
      console.error('Kayıt hatası:', error);
      // Handle registration errors (e.g., display error messages to the user)
    }
  };
 
  return (
    <View style={styles.container}>
    <Text style={{fontWeight:'bold',fontSize:16}}>İsim</Text>
      <TextInput
        style={styles.input}
        placeholder="İsim"
        onChangeText={text => setName(text)}
      />
      <Text style={{fontWeight:'bold',fontSize:16}}>Soyadı</Text>
      <TextInput
        style={styles.input}
        placeholder="Soyisim"
        onChangeText={text => setSurname(text)}
      />
      <Text style={{fontWeight:'bold',fontSize:16}}>Eposta</Text>
      <TextInput
        style={styles.input}
        placeholder="E-posta"
        onChangeText={text => setEmail(text)}
      />
      <Text style={{fontWeight:'bold',fontSize:16}}>Şifre</Text>
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        secureTextEntry={true}
        onChangeText={text => setPassword(text)}
      />
      <Button title="Kayıt Ol" onPress={handleSignUp} style={styles.button} />
    </View>
  );
};

export default Registration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'start',
    alignItems: 'center',
    margintop:100,
    paddingTop:100,
    gap:5,
  },
  input: {
    width: 400,
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    margin: 10,
  },
  button: {
    marginTop:50,
    height:70,
    width:250,
    backgroundColor:'#026efd',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:50,
  },
});
