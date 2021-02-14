import React from "react";
import Item from "./Item.js"



class Header extends React.Component {
    render(){
        return (
          <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <a className="navbar-brand" href="/">
              Data Bucket
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav mr-auto"></ul>
              <ul className="navbar-nav ml-auto">
                <Item path="/signup" text="Signup"/>
                <li class="nav-item">
                <a class="nav-link" href="/login">
                  Login
                </a>
                </li>
              </ul>
            </div>
          </nav>
        );
    }
}



export default Header;