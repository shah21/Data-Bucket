import React from 'react';
import {Route,BrowserRouter as Router,Switch,Redirect} from 'react-router-dom'

import Header from './components/Header/Header.js';
import Home from "./components/Home/Home.js";
import Signup from './Pages/Auth/Signup.js';
import Login from './Pages/Auth/Login.js';


class App extends React.Component {

    state = {
      isAuth : false,
      token:null,
    }

    componentDidMount(){
      const token = localStorage.getItem('token');
      const expiryDate = localStorage.getItem('expiryDate');
      if(!expiryDate || token){
        return;
      }
      if(new Date(expiryDate) <= new Date()){
        return;
      }
      const userId = localStorage.getItem('userId');
      this.setState({
        isAuth:true,
        token:token,
        userId:userId,
      });
      
    }

  
    render(){
      let routes = (
        <Switch>
          <Route path="/" exact render={props=>{
            <Login {...props} />
          }}/>
          <Route path="/signup" exact render={props=>{
            <Signup {...props} />
          }}/>
          <Redirect to="/" />
        </Switch>
      )
      
      if(this.state.isAuth){
        console.log(this.state.isAuth)
        routes = (
          <Switch>
            <Route path="/" exact component={Home}/>
            <Redirect to="/" />
          </Switch>
        )
      }

      return (
          <Router> 
            {routes}
          </Router>
        );
    }
}

export default App;