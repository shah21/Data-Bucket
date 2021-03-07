import React, { useEffect,useMemo,useState } from "react";
import {BrowserRouter as Router,Switch,Route, Redirect} from "react-router-dom";


import './App.css';
import Login from "./Pages/Auth/Login/Login"
import Signup from "./Pages/Auth/Signup/Signup"
import Home from "./Pages/Home/Home"
import {useToken} from "./Hooks/useToken";
import { TokenContext } from "./Contexts/TokenContext";
import { FlashContext } from "./Contexts/FlashContext";
import CustomizedSnackbar from './components/CustomizedSnackbar/CustomizedSnackbar';
import isAuth from "./utils/isAuth";
import { socket } from "./utils/socket";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import NotFound from "./Pages/Error/NotFound";



type FlashType  = {message:string,type:string};




function App() {
  
  /* states */
  const {token,setToken} = useToken();
  const [open,setOpen] = useState(false);
  const [flash, setFlash] = useState<FlashType>(null!); 

  
  /* check if user authorized or not and 
  establish socket connection */
  useEffect(() => {
    async function promiseFunction() {
      try {
        if (!token.accessToken && token.refreshToken) {
          const isAuthorized = await isAuth(token.accessToken, token.refreshToken);
          isAuthorized && setToken({
            ...token,
            accessToken: isAuthorized.accessToken,
          });
        }
        socket.on('connect', () => {
          socket.emit('identity', { userId: token.userId });
        });
      } catch (err) {
        console.log(err);
      }
    }

    promiseFunction();

    return () => {
      socket.off('connect');
      socket.off('identity');
    }

  }, [token, setToken]);


  /* open and close flash messages */
  useMemo(() => {
    if (flash) {
      setOpen(true);
    }
  }, [flash])

  const handleClose = () => {
    setOpen(false);
  }

  /* app routes */
  let routes = (
    <Router>
      <Switch>
        <Route exact path="/login" render={()=>(<Login setToken={setToken} />)}/>
        <Route exact path="/signup" render={()=>(<Signup/>)}/>
        <ProtectedRoute exact path="/" token={token} component={Home} authenticationPath="/login"/>
        <Route path='*' component={NotFound} />
      </Switch>
    </Router>
  );



  return (
    <div className="app">
      <FlashContext.Provider value={{ flash, setFlash }}>
        <TokenContext.Provider value={{ token, setToken }}>
            {routes}
        </TokenContext.Provider>
        <CustomizedSnackbar key="snackbar" openState={open} handleClose={handleClose} message={flash && flash.message} mode={flash && flash.type} />
      </FlashContext.Provider>
    </div>
  );
}

export default App;
