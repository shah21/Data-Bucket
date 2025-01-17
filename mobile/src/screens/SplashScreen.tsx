import React from 'react'
import { View, Text,Dimensions,StyleSheet,Image,TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import * as Animatable from "react-native-animatable";
import { StackNavigationProp } from "@react-navigation/stack";


type SplashNavigationProps = StackNavigationProp<
    StackProps,
    "SplashScreen"
>;

type TypeProps = {
    navigation: SplashNavigationProps
}


export default function SplashScreen({navigation}:TypeProps) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Animatable.Image
                animation="bounceIn" 
                source={require("../res/images/folder.jpg")}
                style={styles.logo}
                resizeMode="stretch"
                />
            </View>

            <Animatable.View
            animation="fadeInUpBig"
            style={styles.footer}>
                <Text style={styles.title}>Stay connected with Devices!</Text>
                <Text style={styles.text}>Sign in with account</Text>
                
                <View style={styles.button}>
                    <TouchableOpacity onPress={()=>navigation.navigate('LoginScreen')}>
                        <LinearGradient
                            colors={['#08d4c4', '#01ab9d']}
                            style={styles.signIn}>
                        
                            <Text style={styles.textSign}>Get Started</Text>
                            <MaterialIcons 
                                name="navigate-next"
                                color="#fff"
                                size={20}/>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    )
}

const { height } = Dimensions.get('screen');
const height_logo = height * 0.28;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#32be8f',
    },
    footer:{
        flex:1,
        backgroundColor:'#fff',
        borderTopLeftRadius:30,
        borderTopRightRadius:30,
        paddingVertical:50,
        paddingHorizontal:30,
    },
    header:{
        flex:2,
        justifyContent:'center',
        alignItems:'center',
    },
    logo:{
        width:height_logo,
        height:height_logo,
    },
    title:{
        color:'#05375a',
        fontSize:30,
        fontWeight:'bold',
    },
    text:{
        color:'grey',
        marginTop:5,
    },
    signIn:{
        width:150,
        height:40,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:50,
        flexDirection:'row',
    },
    textSign: {
        color: 'white',
        fontWeight: 'bold'
    },
    button:{
        alignItems:'flex-end',
        marginTop:30,
    }
});
