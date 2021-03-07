import React,{useReducer,useState,useEffect,useContext} from 'react';
import PersonIcon from "@material-ui/icons/Person";
import LockIcon from "@material-ui/icons/Lock";
import PropTypes from 'prop-types';

import "./Login.css";
import wave from "../../../res/images/wave.png" 
import bg from "../../../res/images/bg.svg";
import avatar from "../../../res/images/avatar.svg";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import axios from "../../../axios/config";
import endpoints from "../../../axios/endpoints";
import { FlashContext } from '../../../Contexts/FlashContext';
import { useHistory } from 'react-router-dom';


const formReducer = (state:object, event: any) => {
    return {
      ...state,
      ...event
    }
}


const getMessageFromSession = () =>{
  const message = JSON.parse(sessionStorage.getItem('message')!);
  return message;
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

function Login({setToken}:any) {
    
  const [formData, setFormData] = useReducer(formReducer, {});
  const [errors, setErrors] = useState({
    email:'',
    password:''
  });
  const {setFlash} = useContext(FlashContext);

  const history = useHistory();
  
  useEffect(() => {
    getMessageFromSession() && setFlash(getMessageFromSession());
    sessionStorage.removeItem('message');
  },[setFlash]);


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
    const loginHandler = async (event: { preventDefault: () => void; }) =>{
        event.preventDefault();
        if(handleValidation()){
          setErrors({  
            email:'',
            password:''
          });

          try{
            const response:any = await loginUser(formData);
            if(response){
              setToken(response.user);
              history.push('/');
            }
          }catch(err){
            if (err.response) {
              const errResponseData = err.response.data;
              setFlash({ message: errResponseData.message, type: 'error' })
              return;
            }
            alert(err);
            return;
          }
          
        }
    }

    /* Handle user inputs */
    const handleChange = (event: { target: { name: any; value: any; }; }) =>{
        setFormData({
            [event.target.name]:event.target.value,
        });
    }

    

    return (
      <div className="login_page">
        <img src={wave} className="wave" alt="wave" />
        <div className="container">
          <div className="img">
            <img src={bg} alt="bg" />
          </div>
          <div className="login-container">
            <form>
              <img src={avatar} alt="" className="avatar" />
              <h2>Welcome</h2>

              <Input
                error={errors['email'].length > 0 ? errors['email'] : null}
                label="Email"
                type="email"
                name="email"
                required={true}
                class="one"
                onChange={(e: any)=>{handleChange(e)}}
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
                onChange={(e: any)=>{handleChange(e)}}
                class="two"
                component={
                  <LockIcon fontSize="small" className="icon"></LockIcon>
                }
              />

              <a href="/">Forgot Password</a>
              <Button
                class="btn"
                link="/"
                type="submit"
                label="Login"
                onClick={(e: any) => {
                  loginHandler(e);
                }}
              />
            </form>
          </div>
        </div>

        <Button class="btn-signup" link="/signup" label="Signup" />

      </div>
    );

    
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}


export default Login;
