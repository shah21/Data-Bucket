import React from "react";
import {BrowserRouter as Router,Switch,Route,Redirect} from "react-router-dom";

import './App.css';
import Login from "./Pages/Auth/Login/Login.jsx"
import Signup from "./Pages/Auth/Signup/Signup.jsx"
import Home from "./Pages/Home/Home.jsx"
import useToken from "./Hooks/useToken.js";


function App() {

  const {token,setToken} = useToken();

  let routes = (
    <Router>
      <Switch>
        <Route exact path="/login" render={()=>(
          <Login setToken={setToken} />
        )}/>
        <Route exact path="/signup" render={()=>(
          <Signup/>
        )}/>
        <Redirect to="/login" />
      </Switch>
    </Router>
  );

  //if user logged in
  if(token){
    routes = (
      <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Redirect to="/" />
      </Switch>
    </Router>
    )
  }

  

  return (
    <div className="app">
      <Router>
        <Switch>
          {routes}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
