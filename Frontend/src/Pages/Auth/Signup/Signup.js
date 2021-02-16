import React,{useReducer,useState} from 'react';
import PersonIcon from "@material-ui/icons/Person";
import LockIcon from "@material-ui/icons/Lock";
import PropTypes from 'prop-types';

import "../Login/Login.css";
import "./Signup.css";
import wave from "../../../res/images/wave.png" 
import bg from "../../../res/images/bg.svg";
import avatar from "../../../res/images/avatar.svg";
import Input from "../../../components/Input/Input.js";
import Button from "../../../components/Button/Button.js";


const formReducer = (state, event) => {
    return {
      ...state,
      ...event
    }
}

const loginUser = credentails =>{
    return fetch('http://localhost:8080/auth/login',{
        method:'POST',
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(credentails)
    }).then((data) => {
        return data.json()
    }).catch((err) => {
        console.log(err);
    });
}

function Signup({setToken}) {
    
    // const [formData,setFormData] = useReducer(formReducer,{});
    
    const [fieldArrays,setField] = useState({})
    const [errorArray,setError] = useState({})
 

    // const loginHandler = async (event) =>{
    //     event.preventDefault();
    //     const response = await loginUser(formData);
    //     setToken(response.token);
    // }

    // const handleChange = event =>{
    //     setFormData({
    //         [event.target.name]:event.target.value,
    //     });
    // }


    const handleValidation = () =>{
        let fields = fieldArrays;
        let errors = {};
        let formIsValid = true;

    
        //Email
        if(!fields["email"]){
           formIsValid = false;
           errors["email"] = "Cannot be empty";
        }
  
        if(typeof fields["email"] !== "undefined"){
           let lastAtPos = fields["email"].lastIndexOf('@');
           let lastDotPos = fields["email"].lastIndexOf('.');

           if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
              formIsValid = false;
              errors["email"] = "Email is not valid";
            }
       }  

       if (!fields["password"]) {
         formIsValid = false;
         errors["password"] = "Cannot be empty";
       }

       if (fields["password"].length >= 6) {
         formIsValid = false;
         errors["password"] = "Password must have atleast 6 characters";
       }

       if (fields["password"] !== fields["confirm_password"]) {
        formIsValid = false;
        errors["password"] = "Passwords must be same";
      }

       this.setState({errors: errors});
       return formIsValid;
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
                label="Email"
                type="email"
                name="email"
                required={true}
                class="one"
                // onChange={e=>{handleChange(e)}}
                component={
                  <PersonIcon fontSize="small" className="icon"></PersonIcon>
                }
              />

              <Input
                label="Password"
                type="password"
                name="password"
                 required={true}
                // onChange={e=>{handleChange(e)}}
                class="two"
                component={
                  <LockIcon fontSize="small" className="icon"></LockIcon>
                }
              />

            <Input
                label="Confirm Password"
                type="password"
                name="password"
                 required={true}
                // onChange={e=>{handleChange(e)}}
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
                // onClick={(e) => {
                //   loginHandler(e);
                // }}
              />
            </form>
          </div>
        </div>
        <Button class="btn-signup" link="/login" label="Login" />
      </div>
    );

    
}

Signup.propTypes = {
    setToken: PropTypes.func.isRequired
}


export default Signup;
