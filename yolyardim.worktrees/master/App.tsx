// App.tsx
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from 'react';
import Header from "./components/Header";
import { firebase } from "./config";
import Dashboard from "./src/Dashboard";
import Favorites from "./src/Favorites";
import Login from "./src/Login";
import Registration from "./src/Registration";
import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<firebase.User | null>(null);

  const onAuthStateChanged = (user: firebase.User | null) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerTitle: () => <Header name="Çekici Uygulamasına Hoşgeldiniz" />,
            headerStyle: {
              height: 120,
              borderBottomLeftRadius: 50,
              borderBottomRightRadius: 50,
              backgroundColor: '#00e4d0',
              shadowColor: '#000',
            },
          }}
        />
        <Stack.Screen
          name="Registration"
          component={Registration}
          options={{
            headerTitle: () => <Header name="Çekici Uygulamasına Hoşgeldiniz" />,
            headerStyle: {
              height: 120,
              borderBottomLeftRadius: 50,
              borderBottomRightRadius: 50,
              backgroundColor: '#00e4d0',
              shadowColor: '#000',
            },
          }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          headerStyle: {
            height: 100,
            borderBottomLeftRadius: 50,
            borderBottomRightRadius: 50,
            backgroundColor: '#00e4d0',
            shadowColor: '#000',
          },
        }}
      />
      <Stack.Screen
        name="Favorites"
        component={Favorites}
        options={{
          headerStyle: {
            height: 120,
            borderBottomLeftRadius: 50,
            borderBottomRightRadius: 50,
            backgroundColor: '#00e4d0',
            shadowColor: '#000',
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default () => (
  <NavigationContainer>
    <App />
  </NavigationContainer>
);
