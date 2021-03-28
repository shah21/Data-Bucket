import React from 'react';
import {View, Text} from 'react-native';
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"

import SplashScreen from "./Screens/SplashScreen";
import SignUpScreen from "./Screens/SignupScreen";
import LoginScreen from "./Screens/LoginScreen";


const Stack = createStackNavigator<StackProps>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="SplashScreen"
          component={SplashScreen}
        />

        <Stack.Screen name="SignUpScreen"
          component={SignUpScreen}
        />

        <Stack.Screen name="LoginScreen"
          component={LoginScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
