import React from 'react'
import { View, Text,Dimensions,StyleSheet,Image,TouchableOpacity, Pressable } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Theme from "../res/styles/theme.style";

import * as Animatable from "react-native-animatable";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthContext } from '../contexts/context';
import SearchField from '../components/SearchField/SearchField';


type SplashNavigationProps = StackNavigationProp<
    StackProps,
    "SplashScreen"
>;

type TypeProps = {
    navigation: SplashNavigationProps
}


export default function HomeScreen({navigation}:TypeProps) {

    const {signOut} = React.useContext(AuthContext);
    

    navigation.setOptions({
        headerRight:()=>(
            <TouchableOpacity>
            <MaterialIcons
                onPress={signOut}
                style={{padding:10}} 
                name="logout"
                color={Theme.WHITE}
                size={25}/>
            </TouchableOpacity>    
        )
    })
    
    React.useEffect(() => {
        

    }, [])


    return (
        <View style={styles.container}>
            <SearchField placeHolder="Search bucket"/>
        </View>
    )
}

const { height } = Dimensions.get('screen');
const height_logo = height * 0.28;

const styles = StyleSheet.create({
    container:{
        flex:1,
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
