import  axios from "../../../axios/config";
import React, { useContext, useReducer, useState } from 'react'
import { Redirect, useHistory } from 'react-router-dom';
import endpoints from '../../../axios/endpoints';
import { FlashContext } from '../../../Contexts/FlashContext';
import PersonIcon from "@material-ui/icons/Person";
import LockIcon from "@material-ui/icons/Lock";


import "../Login/Login.css";
import "./Signup.css";
import wave from "../../../res/images/wave.png" 
import bg from "../../../res/images/bg.svg";
import avatar from "../../../res/images/avatar.svg";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";

interface PropsInterface {
    isLoggedIn:boolean;
}

interface ErrorType {
    email:string;
    password:string;
    confirm_password:string;
}


//register user
const registerUser = async (credentails:object)=>{
    
    try {
      const response = await axios.post(endpoints.signup, JSON.stringify(credentails), {
        headers: {
          "Content-Type": "application/json"
        },
      });

      console.log(response);
  
      const status: number = response.status;
      return { ...response.data, status: status };
    } catch (err) {
      throw err;
    }
  
  };
  
  
  const addMessageToSession = (message:string,type:string) =>{
      const obj = {message:message,type:type};
      sessionStorage.setItem('message',JSON.stringify(obj))
  }
  
  const formReducer = (state:object, event: any) => {
    return {
      ...state,
      ...event
    }
}  

function Signup(props:PropsInterface) {

    const [errors,setErrors] = useState<ErrorType>({
        email:'',
        password:'',
        confirm_password:'',
      });
    const [formData, setFormData] = useReducer(formReducer, {});  
    
    const {setFlash} = useContext(FlashContext);
    const history = useHistory();

    /* Handle user inputs */
    const handleChange = (event:any) =>{
        setFormData({
            [event.target.name]:event.target.value,
        });
    }

    const signupHandler = async (e:Event) => {

    
        e.preventDefault();
        if (handleValidation()) {
          try {
            const response = await registerUser(formData);
            if (response.status !== 201) {
              const errors = response.errors;
              setFlash({ message: errors.length > 0 ? errors[0].msg : response.message, type: 'error' });
              return;
            }
            addMessageToSession('Account created successfully', 'success');
            history.push('/login');
          } catch (err) {
              if (err.response) {
                  const errResponseData = err.response.data;
                  setFlash({ message: errResponseData.message ? errResponseData.message : 'Something went wrong!', type: 'error' });
              }else{
                setFlash({ message : 'Something went wrong!', type: 'error' });
              }
            }
        }
      }
    
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


    if(props.isLoggedIn){
        console.log(props.isLoggedIn);
        return (<Redirect to="/"/>)
    }

    return (
        <div className="login_page signup_page">
          <img src={wave} className="wave" alt="wave" />
          <div className="container">
            <div className="img">
              <img src={bg} alt="bg" />
            </div>
            <div className="login-container">
              <form>
                <img src={avatar} alt="" className="avatar" />
                <h2>Signup</h2>
      
                <Input
                  error={errors['email'].length > 0 ? errors['email'] : null}
                  label="Email"
                  type="email"
                  name="email"
                  required={true}
                  class="one"
                  onChange={(e:Event)=>{handleChange(e)}}
                  component={
                    <PersonIcon fontSize="small" className="icon"></PersonIcon>
                  }
                />
      
                <Input
                  error={errors['password'].length > 0 ? errors['password'] : null}
                  label="Password"
                  type="password"
                  name="password"
                   required={true}
                  onChange={(e:Event)=>{handleChange(e)}}
                  class="two"
                  component={
                    <LockIcon fontSize="small" className="icon"></LockIcon>
                  }
                />
      
              <Input
                  error={errors['confirm_password'].length > 0 ? errors['confirm_password'] : null}
                  label="Confirm Password"
                  type="password"
                  name="confirm_password"
                   required={true}
                  onChange={(e:Event)=>{handleChange(e)}}
                  class="two"
                  component={
                    <LockIcon fontSize="small" className="icon"></LockIcon>
                  }
                />
      
               
                <Button
                  class="btn"
                  link="/"
                  type="submit"
                  label="Signup"
                  onClick={(e:Event) => {
                    signupHandler(e);
                  }}
                />
              </form>
            </div>
          </div>
          <Button class="btn-signup" link="/login" label="Login" />
          
        </div>
      );
}

export default Signup;
