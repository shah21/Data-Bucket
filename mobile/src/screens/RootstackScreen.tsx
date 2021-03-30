import React from 'react';

import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';

import SplashScreen from './SplashScreen';
import SignUpScreen from './SignupScreen';
import LoginScreen from './LoginScreen';

type SplashNavigationProps = StackNavigationProp<
    StackProps,
    "RootStackScreen"
>;

type TypeProps = {
    navigation: SplashNavigationProps
}

const RootStack = createStackNavigator();

const RootStackScreen = () => (
    <RootStack.Navigator headerMode="none"
    screenOptions={{
      headerShown: false,
    }}>
    <RootStack.Screen name="SplashScreen"
      component={SplashScreen}
    />

    <RootStack.Screen name="SignUpScreen"
      component={SignUpScreen}
    />

    <RootStack.Screen name="LoginScreen"
      component={LoginScreen}
    />
    </RootStack.Navigator>
);

export default RootStackScreen;