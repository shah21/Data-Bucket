import React, { Component } from 'react'

import "./Signup.css" 
import Input from "../../components/Input/Input.js"

export default class Signup extends Component {
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <form className="box">
                            <h1>Signup</h1>
                            <p className="text-muted">Please enter email and password</p>

                            <Input type="text" placeholder="Email" name="email" id="email" required={true}/>
                            <Input type="password" name="password" placeholder="Password" id="password" required={true}/> 
                            <Input type="password" name="conf_password" placeholder="Confirm Password" id="conf_password" required={true}/> 

                            <a class="forgot text-muted" href="/forgot-password">Already have an account?</a>
                            <input type="submit" name="" value="Login" href="#"></input>
                            
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
