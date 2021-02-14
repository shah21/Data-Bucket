import React, { Component } from 'react'
import {Link} from "react-router-dom";

import "./Signup.css" 
import Input from "../../components/Input/Input.js"

export default class Login extends Component {
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <form className="box">
                            <h1>Login</h1>
                            <p className="text-muted">Please enter email and password</p>

                            <Input type="text" placeholder="Email" name="email" id="email" required={true}/>
                            <Input type="password" name="password" placeholder="Password" id="password" required={true}/> 

                            <a class="forgot text-muted" href="/forgot-password">Forget password?</a>
                            <input type="submit" name="" value="Login" href="#"></input>
                            <Link to="/signup">
                            <input type="submit" name="" className="create-btn" value="Create new account" href="#"></input>
                            </Link>
                            
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

