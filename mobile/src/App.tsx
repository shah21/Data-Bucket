import React, { Reducer } from 'react';
import {View, Text, ActivityIndicator, StyleSheet, StatusBar} from 'react-native';
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import Snackbar from 'react-native-snackbar';

import HomeScreen from "./screens/HomeScreen";
import RoomScreen from "./screens/RoomScreen";
import { FlashContext } from './contexts/FlashContext';
import AuthContext from "./contexts/AuthContext";
import RootStackScreen from './screens/RootstackScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider as PaperProvider  } from 'react-native-paper';
import { socket } from './utils/socket';



const Stack = createStackNavigator<StackProps>();

type State = {
  isLoading:boolean,
  userId:string,
  accessToken:string,
  refreshToken:string,
}

type Action =
 | { type: 'RETRIEVE_TOKEN',authObject:AuthObjectType }
 | { type: 'LOGIN',authObject:AuthObjectType }
 | { type: 'LOGOUT' }

 const loginReducer = (prevState:State, action:Action):State => {
  switch( action.type ) {
    case 'RETRIEVE_TOKEN': 
      return {
        ...prevState,
        accessToken: action.authObject.accessToken,
        refreshToken:action.authObject.refreshToken,
        isLoading: false,
      };
    case 'LOGIN': 
      return {
        ...prevState,
        userId:action.authObject.userId,
        accessToken: action.authObject.accessToken,
        refreshToken:action.authObject.refreshToken,
        isLoading: false,
      };
    case 'LOGOUT': 
      return {
        ...prevState,
        userId: null!,
        accessToken: null!,
        isLoading: false,
        refreshToken:null!,
      };
  }
}; 

const initialLoginState = {
  isLoading:true,
  userId:null!,
  accessToken:null!,
  refreshToken:null!,
} as State;

export default function App() {


  const [flash, setFlash] = React.useState<FlashType>(null!);  
  const [open,setOpen] = React.useState(false);
  const [token,setToken] = React.useState<UserToken>(null!);

 

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);
  

  const authContext = React.useMemo(()=>({
    signIn: async (authObject:AuthObjectType)=>{
      try {
        await AsyncStorage.setItem('accessToken',authObject.accessToken);
        await AsyncStorage.setItem('refreshToken',authObject.refreshToken);
        await AsyncStorage.setItem('userId',authObject.userId);
      } catch (error) {
        console.log(error);
      }
      dispatch({type:'LOGIN',authObject:authObject});
    },
    signOut:async()=>{
      try {
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        await AsyncStorage.removeItem('userId');
      } catch (error) {
        console.log(error);
      }
      dispatch({type:'LOGOUT'});
    },
    signUp:()=>{}
  }),[])

  /* open and close flash messages */
  React.useMemo(() => {
    if (flash) {
      // setFlashBackup(flash);
      {
        Snackbar.show({
          text: flash.message,
          duration: Snackbar.LENGTH_SHORT,
        })
      }
      setFlash(null!);
      setOpen(true);
    }
  }, [flash]);


  React.useEffect(()=>{
    socket.on('connect', () => {
      socket.emit('identity', { userId: loginState.userId });
    });

    return () => {
      socket.off('connect');
      socket.off('identity');
    }
  },[]);

  React.useEffect(() => {
    async function getFromStorage(){
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const refreshToken  = await AsyncStorage.getItem('refreshToken');
        const userId = await AsyncStorage.getItem('userId');
        const tokenObj =  { accessToken: accessToken!, refreshToken: refreshToken!, userId: userId! };
        setToken(tokenObj);
        dispatch({ type: 'RETRIEVE_TOKEN', authObject:tokenObj });
      } catch (error) {
        console.log(error);
      }
    }

    getFromStorage();
  }, [])

  if(loginState.isLoading){
    return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size="large"  color="#333"/>
      </View>
    )
  }

  const screenOptions = {
    headerTintColor:'#fff',
    headerStyle:{
      backgroundColor:'#32be8f',
    }
  }

  return (
    <PaperProvider>
    <AuthContext.Provider value={{...authContext,token}}>
    <FlashContext.Provider value={{ flash, setFlash }}>
    <NavigationContainer>
      <StatusBar backgroundColor="#128976" barStyle="light-content"/>
      {loginState.accessToken !== null ? (
        <Stack.Navigator screenOptions={screenOptions}>
          <Stack.Screen 
          name="HomeScreen"
          options={{title:'Buckets'}}
          component={HomeScreen}
        />
         <Stack.Screen 
          name="RoomScreen"
          options={{
            title:null!,
          }}
          component={RoomScreen}
        />
        </Stack.Navigator>
      ):(
        <RootStackScreen/>
      )}
    </NavigationContainer>
    </FlashContext.Provider>
    </AuthContext.Provider>
    </PaperProvider>
  );
}

