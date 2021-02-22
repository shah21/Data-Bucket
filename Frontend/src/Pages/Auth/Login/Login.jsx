import React,{useReducer} from 'react';
import PersonIcon from "@material-ui/icons/Person";
import LockIcon from "@material-ui/icons/Lock";
import PropTypes from 'prop-types';

import "./Login.css";
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

function Login({setToken}) {
    
    const [formData,setFormData] = useReducer(formReducer,{});
    
 

    const loginHandler = async (event) =>{
        event.preventDefault();
        const response = await loginUser(formData);
        setToken(response.token);
    }

    const handleChange = event =>{
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
                label="Email"
                type="email"
                name="email"
                required={true}
                class="one"
                onChange={e=>{handleChange(e)}}
                component={
                  <PersonIcon fontSize="small" className="icon"></PersonIcon>
                }
              />

              <Input
                label="Password"
                type="password"
                name="password"
                 required={true}
                onChange={e=>{handleChange(e)}}
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
                onClick={(e) => {
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
