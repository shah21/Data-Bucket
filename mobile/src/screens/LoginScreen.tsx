import React from 'react'
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, Platform, TextInput, StatusBar, Alert } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import * as Animatable from "react-native-animatable";
import { StackNavigationProp } from "@react-navigation/stack";
import * as Progress from 'react-native-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from "../axios/config";
import endpoints from '../axios/endpoints';
import InputField from "../components/Form/InputField";
import { FlashContext } from '../contexts/FlashContext';
import {AuthContext} from "../contexts/context"

type SplashNavigationProps = StackNavigationProp<
    StackProps,
    "LoginScreen"
>;

type TypeProps = {
    navigation: SplashNavigationProps
}

const loginUser = async (credentails: object) => {

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

const formReducer = (state: object, event: any) => {
    return {
        ...state,
        ...event
    }
}

export default function LoginScreen({navigation}:TypeProps) {
   
    const [formData, setFormData] = React.useReducer(formReducer, {});
    const [errors, setErrors] = React.useState({
        email:'',
        password:''
      });
    const [loading,setLoading] = React.useState<boolean>(false);  
    const {setFlash} = React.useContext(FlashContext);

    const handleTextChange = (val:string,fieldName:string) => {
        setErrors({
            email:fieldName === 'email' ? '' : errors.email,
            password:fieldName === 'password' ? '' : errors.password
        });
        setFormData({
            [fieldName]:val,
        });
    }

    const {signIn} = React.useContext(AuthContext);

    
    /* Handle validation of form */
    const handleValidation = () => {
        let formIsValid = true;
        const newErrors = {
            email: '',
            password: ''
        };

        //Email
        if (!formData.email) {
            
            formIsValid = false;
            newErrors['email'] = "Cannot be empty";
        }

        if (typeof formData.email !== "undefined") {
            let lastAtPos = formData.email.lastIndexOf('@');
            let lastDotPos = formData.email.lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && formData.email.indexOf('@@') === -1 && lastDotPos > 2 && (formData.email.length - lastDotPos) > 2)) {
                formIsValid = false;
                newErrors["email"] = "Email is not valid";
            }
        }


        //password
        if (!formData.password) {
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
            setLoading(true);
          }

          try{
            const response:any = await loginUser({email:formData.email,password:formData.password});
            if(response){
                setFlash({ message : response.message, type: 'success' });
                signIn(response.user);
            }
            setLoading(false);
          }catch(err){
            console.log(err);
            setLoading(false);
            if (err.response) {
              const errResponseData = err.response.data;

              setFlash({ message: errResponseData.message, type: 'error' })
              return;
            }else{
              setFlash({ message: err.message, type: 'error' })
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
                style={styles.footer}>
                
                <InputField 
                    iconComponent={
                        <FontAwesome
                        name="user-o"
                        color="#05375a"
                        size={20} />
                    }
                    placeholder="Your email"
                    handleChange={handleTextChange} 
                    label="Email" 
                    errorText={errors.email.length > 0 ? errors.email : null!} 
                    name="email"
                    />

                <InputField
                    iconComponent={
                        <FontAwesome
                            name="lock"
                            color="#05375a"
                            size={20} />}
                    placeholder="Your password"
                    handleChange={handleTextChange}
                    label="Password"
                    errorText={errors.password.length > 0 ? errors.password : null!}
                    name="password"
                />
                

                <View style={styles.button}>
                    <LinearGradient
                        onTouchStart={loginHandler}
                        colors={['#08d4c4', '#01ab9d']}
                        style={styles.signIn}>

                        <Text
                            style={[styles.textSign, { color: '#fff' }]}>
                            Login
                        </Text>


                        {loading && (
                        <Progress.Circle
                            size={25} 
                            borderWidth={5}
                            borderColor="#fff"
                            indeterminate={true} />

                        )}    
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
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        paddingHorizontal:5,
        fontWeight: 'bold',
    }
});
