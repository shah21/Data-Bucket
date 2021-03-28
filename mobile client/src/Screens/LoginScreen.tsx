import React from 'react'
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, Platform, TextInput, StatusBar, Alert } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import * as Animatable from "react-native-animatable";
import { StackNavigationProp } from "@react-navigation/stack";
import * as Progress from 'react-native-progress';

import axios from "../axios/config";
import endpoints from '../axios/endpoints';

type SplashNavigationProps = StackNavigationProp<
    StackProps,
    "LoginScreen"
>;

type TypeProps = {
    navigation: SplashNavigationProps
}

const loginUser = async (credentails:object) =>{

    try {
      const response = await axios.post(endpoints.login, JSON.stringify(credentails), {
        headers: {
          "Content-Type": "application/json"
        },
      });
      return response.data;
    } catch (err) {
      throw err
    }
  }


export default function LoginScreen({navigation}:TypeProps) {
   
    const [data,setData] = React.useState({
        email:'',
        password:'',
        check_textChange:false,
        secureTextEntry:true,
    });

    const [errors, setErrors] = React.useState({
        email:'',
        password:''
      });

    const [loading,setLoading] = React.useState<boolean>(false);  


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
            secureTextEntry:!data.secureTextEntry,
        })
    }

    
    /* Handle validation of form */
    const handleValidation = () => {
        let formIsValid = true;
        const newErrors = {
            email: '',
            password: ''
        };

        //Email
        if (!data.email) {
            
            formIsValid = false;
            newErrors['email'] = "Cannot be empty";
        }

        if (typeof data.email !== "undefined") {
            let lastAtPos = data.email.lastIndexOf('@');
            let lastDotPos = data.email.lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && data.email.indexOf('@@') === -1 && lastDotPos > 2 && (data.email.length - lastDotPos) > 2)) {
                formIsValid = false;
                newErrors["email"] = "Email is not valid";
            }
        }


        //password
        if (!data.password) {
            formIsValid = false;
            newErrors["password"] = "Cannot be empty";
        }



        setErrors({
            ...errors,
            ...newErrors,
        });

        return formIsValid;
    }

    /* Handle login */
    const loginHandler = async () =>{
        if(handleValidation()){
          setErrors({  
            email:'',
            password:''
          });

          if(!loading){
            // setLoading(true);
          }

          try{
            const response:any = await loginUser({email:data.email,password:data.password});
            if(response){
            //   setToken(response.user);
            //   history.push('/');
            Alert.alert('login',response.user);
            }
            // setLoading(false);
          }catch(err){
            Alert.alert('login',err.message);
            // setLoading(false);
            if (err.response) {
              const errResponseData = err.response.data;
            //   setFlash({ message: errResponseData.message, type: 'error' })
              return;
            }else{
            //   setFlash({ message: err.message, type: 'error' })
            }
            return;
          }
          
        }
    }
    
    
    
   
   
    return (
        <View style={styles.container}>

            <StatusBar backgroundColor='#009387' barStyle="default"/>
            <View style={styles.header}>
                <Text style={styles.text_header}>Welcome !</Text>
            </View>

            <Animatable.View 
                animation="fadeInUpBig"
                style={styles.footer}
                >
                <View style={styles.field}>
                    <Text style={styles.text_footer}>Email</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="user-o"
                            color="#05375a"
                            size={20} />

                        <TextInput
                            onChangeText={(val) => textInputChange(val)}
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



                            ) : null}
                    </View>
                    
                
                    {errors.email.length > 0 ? (
                    <Text style={styles.textError}>{errors.email}</Text>
                    ):null}
                    
                </View>

                
                <View style={styles.field}>
                    <Text style={[styles.text_footer, { marginTop: 35 }]}>Password</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="lock"
                            color="#05375a"
                            size={20} />

                        <TextInput
                            onChangeText={(val) => handlePasswordChange(val)}
                            placeholder="Your Password"
                            secureTextEntry={data.secureTextEntry}
                            style={styles.textInput}
                            autoCapitalize="none"
                        />
                        {data.secureTextEntry ? (
                            <Feather
                                onPress={handlePasswordVisibility}
                                name="eye-off"
                                color="green"
                                size={20} />

                        ) :
                            (
                                <Feather
                                    onPress={handlePasswordVisibility}
                                    name="eye"
                                    color="green"
                                    size={20} />
                            )}
                    </View>
                    {errors.password.length > 0 ? (
                        <Text style={styles.textError}>{errors.password}</Text>
                    ) : null}
                </View>

                <View style={styles.button}>
                    <LinearGradient
                        colors={['#08d4c4', '#01ab9d']}
                        style={styles.signIn}>

                        <Text
                            onPress={loginHandler}
                            style={[styles.textSign, { color: '#fff' }]}>
                            Login
                        </Text>

                        <Progress.Circle size={30} indeterminate={true} />

                    </LinearGradient>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('SignUpScreen')}
                        style={[styles.signIn, {
                            borderColor: '#009387',
                            borderWidth: 1,
                            marginTop: 15,
                        }]}>
                        <Text style={[styles.textSign, {
                            color: '#009387',
                        }]}>Sign Up</Text>
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
    field:{
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textError:{
        fontSize:10,
        color:'red',
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
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
