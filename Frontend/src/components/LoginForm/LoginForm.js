import React, { Component } from 'react';
import "./LoginForm.css"

export default class LoginForm extends Component {
    render() {
        return (
            <div className="container">
                <form className="form">
                    <div className="mb-3">
                        <label for="email" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="email" aria-describedby="emailHelp"></input>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        )
    }
}
