import React, { useEffect,useMemo,useState } from "react";
import {BrowserRouter as Router,Switch,Route,Redirect} from "react-router-dom";


import './App.css';
import Login from "./Pages/Auth/Login/Login"
import Signup from "./Pages/Auth/Signup/Signup"
import Home from "./Pages/Home/Home"
import {useToken} from "./Hooks/useToken";
import axios from "./axios/config";
import endpoints from "./axios/endpoints";
import { TokenContext } from "./Contexts/TokenContext";
import { FlashContext } from "./Contexts/FlashContext";
import CustomizedSnackbar from './components/CustomizedSnackbar/CustomizedSnackbar';
import isAuth from "./utils/isAuth";
import { socket } from "./utils/socket";


 
const refreshAccessToken = async (refreshToken:string) => {
  const response = await axios.post(endpoints.refreshToken,{refreshToken:refreshToken},{
      headers:{
          "Content-Type":'application/json',
      }
  });
  return response.data;
}

function PrivateRoute ({Component, authed, path}:{Component:any,authed:boolean,path:string}) {
  return (
    <Route
      path={path}
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to='/login' />}
    />
  )
}

type FlashType  = {message:string,type:string};


function App() {
  
  //states
  const {token,setToken} = useToken();
  const [open,setOpen] = useState(false);
  const [flash, setFlash] = useState<FlashType>(null!); 

  useEffect(() => {
    // if(!token.accessToken && token.refreshToken){
    //   refreshAccessToken(token.refreshToken).then(data=>{
    //     setToken({
    //       ...token,
    //       accessToken:data.accessToken,
    //     });
    //   }).catch(err=>{

    //   })
    // }

    async function promiseFunction() {
      try {
        if(!token.accessToken && token.refreshToken){
        const isAuthorized =  await isAuth(token.accessToken,token.refreshToken);
        isAuthorized && setToken({
                ...token,
                accessToken:isAuthorized.accessToken,
              });
        }
        socket.on('connect',()=>{
          socket.emit('identity',{userId:token.userId});
        });
      } catch(err){
        console.log(err);
      }
    }

    promiseFunction();

  }, [token,setToken]);




  useMemo(()=>{
    if(flash){
      setOpen(true);
    }
  },[flash])

  const handleClose =()=>{
    setOpen(false);
  }

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
  if(token.accessToken){
    routes = (
      <Router>
      <Switch>
        <Route exact path="/" component={Home} />
      
        <Redirect exact to="/" />
      </Switch>
    </Router>
    )

  }


  return (
    <div className="app">
      <FlashContext.Provider value={{flash,setFlash}}>
      <TokenContext.Provider value={{token,setToken}}>
      <Router>
        <Switch>
          {routes}
        </Switch>
      </Router>
      </TokenContext.Provider>
      <CustomizedSnackbar key="snackbar" openState={open} handleClose={handleClose} message={flash && flash.message} mode={flash && flash.type} />
      </FlashContext.Provider>
    </div>
  );
}

export default App;
