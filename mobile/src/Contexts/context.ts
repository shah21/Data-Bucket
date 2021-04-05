import { createContext } from "react";


export const AuthContext = createContext({
    signIn:(authObject:AuthObjectType)=>{},
    signOut:()=>{},
    signUp:()=>{},
    getToken:():Promise<UserToken> =>{
      return null!;
    }
  });