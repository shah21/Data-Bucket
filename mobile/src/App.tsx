import React from 'react';
import {View, Text} from 'react-native';
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"

import SplashScreen from "./screens/SplashScreen";
import SignUpScreen from "./screens/SignupScreen";
import LoginScreen from "./screens/LoginScreen";
import { FlashContext } from './Contexts/FlashContext';
import Snackbar from 'react-native-snackbar';


const Stack = createStackNavigator<StackProps>();

export default function App() {


  const [flash, setFlash] = React.useState<FlashType>(null!); 
  const [flashBackup, setFlashBackup] = React.useState<FlashType>(null!); 
  const [open,setOpen] = React.useState(false);


   /* open and close flash messages */
   React.useMemo(() => {
    if (flash) {
      setFlashBackup(flash);
      setFlash(null!);
      setOpen(true);
      {Snackbar.show({
        text: flashBackup && flashBackup.message,
        duration: Snackbar.LENGTH_SHORT,
    })}
    }
  }, [flash])

  return (
    <FlashContext.Provider value={{ flash, setFlash }}>
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
    </FlashContext.Provider>
  );
}
