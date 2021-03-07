import React from "react";
import { Route, Redirect} from "react-router-dom";

interface PropTypes{
    component:React.ComponentType,
    path:string,
    token:any,
}

function ProtectedRoute({component:Component,path,token}:PropTypes) {

  return (
    <Route
    exact
    path={path}
      render={(props) => {
        if (token.accessToken || token.refreshToken) {
          return <Component />
        } else {
            console.log('render');
          return (
              
            <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
          );
        }
      }}
    />
  );
}

export default ProtectedRoute;