import React from 'react'
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, Platform, TextInput, StatusBar, Alert } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import * as Animatable from "react-native-animatable";
import { StackNavigationProp } from "@react-navigation/stack";
import * as Progress from 'react-native-progress';
import Snackbar from "react-native-snackbar";


import axios from "../axios/config";
import endpoints from '../axios/endpoints';
import InputField from "../components/Form/InputField";
import { FlashContext } from '../contexts/FlashContext';

type SplashNavigationProps = StackNavigationProp<
    StackProps,
    "LoginScreen"
>;

type TypeProps = {
    navigation: SplashNavigationProps
}



//register user
const registerUser = async (credentails:object)=>{
    
    try {
      const response = await axios.post(endpoints.signup, JSON.stringify(credentails), {
        headers: {
          "Content-Type": "application/json"
        },
      });
      const status: number = response.status;
      return { ...response.data, status: status };
    } catch (err) {
      throw err;
    }
  
  };


const formReducer = (state: object, event: any) => {
    return {
        ...state,
        ...event
    }
}

export default function SignupScreen({navigation}:TypeProps) {
   
    const [formData, setFormData] = React.useReducer(formReducer, {});
    const [errors, setErrors] = React.useState({
        email:'',
        password:'',
        confirm_password:'',
      });
    const [loading,setLoading] = React.useState<boolean>(false);  
    const {setFlash} = React.useContext(FlashContext);


    const handleTextChange = (val:string,fieldName:string) => {
        setErrors({
            email:fieldName === 'email' ? '' : errors.email,
            password:fieldName === 'password' ? '' : errors.password,
            confirm_password:fieldName === 'confirm_password' ? '' : errors.confirm_password,
        });
        setFormData({
            [fieldName]:val,
        });
    }


    
    /* Handle validation of form */
    const handleValidation = () =>{

        let formDataObject = formData;
        let errorsObject = { email: '', password: '', confirm_password: '' };
        let formIsValid = true;
    
    
    
        //Email
        if(!formDataObject.email){
           formIsValid = false;
           errorsObject['email'] = "Cannot be empty";
        }
    
        if(typeof formDataObject.email !== "undefined"){
           let lastAtPos = formDataObject.email.lastIndexOf('@');
           let lastDotPos = formDataObject.email.lastIndexOf('.');
    
           if (!(lastAtPos < lastDotPos && lastAtPos > 0 && formDataObject.email.indexOf('@@') === -1 && lastDotPos > 2 && (formDataObject.email.length - lastDotPos) > 2)) {
              formIsValid = false;
              errorsObject["email"] = "Email is not valid";
            }
        }  
    
    
       //password
       if (!formDataObject.password) {
         formIsValid = false;
         errorsObject["password"] = "Cannot be empty";
       }else if (formDataObject.password.length < 6) {
         formIsValid = false;
         errorsObject["password"] = "Password must have atleast 6 characters";
       }
    
       //confirm password
        if (!formDataObject.confirm_password) {
          formIsValid = false;
          errorsObject['confirm_password'] = "Cannot be empty";
        }else{
          if (formDataObject.password !== formDataObject.confirm_password) {
            formIsValid = false;
            errorsObject["confirm_password"] = "Passwords must be same";
          }
        }
    
    
       setErrors(errorsObject);
        
       return formIsValid;
    }  

    /* Handle Signup */
    const signupHandler = async () => {

        if (handleValidation()) {

          if(!loading){
            setLoading(true);
          }

          try {
            const response = await registerUser(formData);
            if (response.status !== 201) {
              const errors = response.errors;
              setFlash({ message: errors.length > 0 ? errors[0].msg : response.message, type: 'error' });
              return;
            }
            setLoading(false);
            // addMessageToSession('Account created successfully', 'success');
                setFlash({ message: 'Account created successfully', type: 'success' });
                navigation.navigate('LoginScreen');
          } catch (err) {
              setLoading(false);
              if (err.response) {
                  const errResponseData = err.response.data;
                  setFlash({ message: errResponseData.message ? errResponseData.message : 'Something went wrong!', type: 'error' });
              }else{
                setFlash({ message : 'Something went wrong!', type: 'error' });
              }
            }
        }
      }
    
    
    
   
   
    return (
        <View style={styles.container}>

            <StatusBar backgroundColor='#009387' barStyle="default"/>
            <View style={styles.header}>
                <Text style={styles.text_header}>Register Now !</Text>
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

                <InputField
                    iconComponent={
                        <FontAwesome
                            name="lock"
                            color="#05375a"
                            size={20} />}
                    placeholder="Password again"
                    handleChange={handleTextChange}
                    label="Confrim Password"
                    errorText={errors.confirm_password.length > 0 ? errors.confirm_password : null!}
                    name="confirm_password"
                />
                

                <View style={styles.button}>
                    <LinearGradient
                        onTouchStart={signupHandler}
                        colors={['#08d4c4', '#01ab9d']}
                        style={styles.signIn}>

                        <Text
                            style={[styles.textSign, { color: '#fff' }]}>
                            Sign Up
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
                        onPress={() => navigation.navigate('LoginScreen')}
                        style={[styles.signIn, {
                            borderColor: '#009387',
                            borderWidth: 1,
                            marginTop: 15,
                        }]}>
                        <Text style={[styles.textSign, {
                            color: '#009387',
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
