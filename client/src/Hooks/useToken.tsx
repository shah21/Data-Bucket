import {useState} from "react";
import Cookie from "js-cookie";


interface FuncType {
    token:UserToken;
    setToken:(userToken:UserToken)=>void;
}

type UserToken = { token: string, userId: string }

//custom hook 
export default function useToken():FuncType{

    const getToken = ()=>{
        const userToken:UserToken = JSON.parse(sessionStorage.getItem('userToken')!);
        return userToken;
    };

    const [token,setToken] = useState<UserToken>(getToken());


    const saveToken = (userToken:UserToken)=>{
        Cookie.set('token',userToken.token);
        Cookie.set('userId',userToken.userId);
        sessionStorage.setItem('userToken',JSON.stringify(userToken));
        setToken(userToken);
    };

    return{
        setToken:saveToken,
        token:token
    }

}