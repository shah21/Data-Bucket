import React from 'react'
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, Platform, TextInput, StatusBar } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import * as Animatable from "react-native-animatable";
import { StackNavigationProp } from "@react-navigation/stack";
import { color } from 'react-native-reanimated';

type SplashNavigationProps = StackNavigationProp<
    StackProps,
    "LoginScreen"
>;

type TypeProps = {
    navigation: SplashNavigationProps
}


export default function SignUpScreen({navigation}:TypeProps) {
   
    const [data,setData] = React.useState({
        email:'',
        password:'',
        conf_password:'',
        check_textChange:false,
        securePasswordEntry:true,
        secureConfPassEntry:true,
    })


    const textInputChange = (val:string) => {
        if (val.length !== 0) {
            setData({
                ...data,
                email: val,
                check_textChange: true,
            });
            return;
        }
        setData({
            ...data,
            email: val,
            check_textChange: false,
        });
        
    }

    const handlePasswordChange = (val:string) => {
        setData({
            ...data,
            password:val,
        })
    }

    const handlePasswordVisibility = () => {
        setData({
            ...data,
            securePasswordEntry:!data.securePasswordEntry,
        })
    }


    const handleConfPasswordChange = (val:string) => {
        setData({
            ...data,
            conf_password:val,
        })
    }

    const handleConfPasswordVisibility = () => {
        setData({
            ...data,
            secureConfPassEntry:!data.secureConfPassEntry,
        })
    }
    
    
    
    
   
   
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#009387' barStyle="default"/>
            <View style={styles.header}>
                <Text style={styles.text_header}>Register Now</Text>
            </View>

            <Animatable.View 
                animation="fadeInUpBig"
                style={styles.footer}
                >
                <Text style={styles.text_footer}>Email</Text>
                <View style={styles.action}>
                    <FontAwesome 
                        name="user-o"
                        color="#05375a"
                        size={20}/>

                    <TextInput 
                        onChangeText={(val)=>textInputChange(val)}
                        placeholder="Your Email"
                        style={styles.textInput}
                        autoCapitalize="none"
                        />    

                    {data.check_textChange ?
                    (
                    
                            <Animatable.View
                                animation="bounceIn">
                                <Feather
                                    name="check-circle"
                                    color="green"
                                    size={20} />
                            </Animatable.View>

                    
                    
                    ):null }
                </View>

                <Text style={[styles.text_footer,{marginTop:35}]}>Password</Text>
                <View style={styles.action}>
                    <FontAwesome 
                        name="lock"
                        color="#05375a"
                        size={20}/>

                    <TextInput 
                        onChangeText={(val)=>handlePasswordChange(val)}
                        placeholder="Your Password"
                        secureTextEntry={data.securePasswordEntry}
                        style={styles.textInput}
                        autoCapitalize="none"
                        />    
                    {data.securePasswordEntry ? (
                    <Feather
                        onPress={handlePasswordVisibility}
                        name="eye-off"
                        color="green"
                        size={20}/>   

                    ): 
                    (
                        <Feather
                        onPress={handlePasswordVisibility}
                        name="eye"
                        color="green"
                        size={20}/>  
                    )}    
                </View>


                <Text style={[styles.text_footer,{marginTop:35}]}>Confirm Password</Text>
                <View style={styles.action}>
                    <FontAwesome 
                        name="lock"
                        color="#05375a"
                        size={20}/>

                    <TextInput 
                        onChangeText={(val)=>handleConfPasswordChange(val)}
                        placeholder="Confirm Password"
                        secureTextEntry={data.secureConfPassEntry}
                        style={styles.textInput}
                        autoCapitalize="none"
                        />    
                    {data.secureConfPassEntry ? (
                    <Feather
                        onPress={handleConfPasswordVisibility}
                        name="eye-off"
                        color="green"
                        size={20}/>   

                    ): 
                    (
                        <Feather
                        onPress={handleConfPasswordVisibility}
                        name="eye"
                        color="green"
                        size={20}/>  
                    )}    
                </View>

                <View style={styles.button}>
                    <LinearGradient
                        colors={['#08d4c4', '#01ab9d']}
                        style={styles.signIn}>

                        <Text style={[styles.textSign, { color: '#fff' }]}>
                            Register
                        </Text>

                    </LinearGradient>

                    <TouchableOpacity
                        onPress={()=>navigation.navigate('SignUpScreen')}
                        style={[styles.signIn,{
                            borderColor:'#009387',
                            borderWidth:1,
                            marginTop:15,
                        }]}>
                            <Text style={[styles.textSign,{
                                color:'#009387',
                            }]}>Login</Text>
                        </TouchableOpacity>
                </View>

            </Animatable.View >
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#32be8f',
    },
    footer:{
        flex:3,
        backgroundColor:'#fff',
        borderTopLeftRadius:30,
        borderTopRightRadius:30,
        paddingVertical:30,
        paddingHorizontal:20,
    },
    header:{
        flex:1,
        justifyContent:'flex-end',
        paddingHorizontal:20,
        paddingBottom:30,
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});
