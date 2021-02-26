import React from "react";
import {BrowserRouter as Router,Switch,Route,Redirect} from "react-router-dom";

import './App.css';
import Login from "./Pages/Auth/Login/Login"
import Signup from "./Pages/Auth/Signup/Signup"
import Home from "./Pages/Home/Home"
import useToken from "./Hooks/useToken";




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
    console.log(token)
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
