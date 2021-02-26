import React,{useReducer,useState,useEffect} from 'react';
import PersonIcon from "@material-ui/icons/Person";
import LockIcon from "@material-ui/icons/Lock";
import PropTypes from 'prop-types';

import "./Login.css";
import wave from "../../../res/images/wave.png" 
import bg from "../../../res/images/bg.svg";
import avatar from "../../../res/images/avatar.svg";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import CustomizedSnackbar from '../../../components/CustomizedSnackbar/CustomizedSnackbar';
import Api from "../../../utils/api";


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
    const response = await Api.post('/auth/login', JSON.stringify(credentails), {
      headers: {
        "Content-Type": "application/json"
      },
    });

    const status: number = response.status;
    return { ...response.data, status: status };

  } catch (err) {
    return { ...err.response.data, status: err.status };
  }
}

function Login({setToken}:any) {
    
  const [formData, setFormData] = useReducer(formReducer, {});
  const [errors, setErrors] = useState({
    email:'',
    password:''
  });
  const [responseError, setResponseError] = useState<string>(undefined!);
  const [sessionMessage, setSessionMessage] = useState<{message:string,type:string}>(null!);
  
  useEffect(() => {
    setSessionMessage(getMessageFromSession());
    sessionStorage.removeItem('message');
  },[]);

  const handleValidation = () => {
    let formIsValid = true;
    const newErrors = {
      email:'',
      password:''
    };

    //Email
    if (!formData.email) {
      formIsValid = false;
      newErrors['email'] = "Cannot be empty";
    }

    if (typeof formData.email !== "undefined") {
      let lastAtPos = formData.email.lastIndexOf('@');
      let lastDotPos = formData.email.lastIndexOf('.');

      if (!(lastAtPos < lastDotPos && lastAtPos > 0 && formData.email.indexOf('@@') == -1 && lastDotPos > 2 && (formData.email.length - lastDotPos) > 2)) {
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
 

    const loginHandler = async (event: { preventDefault: () => void; }) =>{
        event.preventDefault();
        if(handleValidation()){
          setErrors({  
            email:'',
            password:''
          });
          const response:any = await loginUser(formData);
          if(response.status !== 200){
            setResponseError(prevError=>response.message)
            return;
          }
          setToken(response.user);
        }
    }

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

        {(responseError || sessionMessage) && (<CustomizedSnackbar openState={true} message={responseError ? responseError : sessionMessage.message} mode={responseError ? "error" : sessionMessage.type} />)}

      </div>
    );

    
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}


export default Login;
