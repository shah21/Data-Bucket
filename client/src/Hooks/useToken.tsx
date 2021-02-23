import {useState} from "react";



export interface FuncType {
    token:string;
    setToken:(userToken:string)=>void;
}




//custom hook 
export default function useToken():FuncType{

    const getToken = ()=>{
        const tokenString = sessionStorage.getItem('token');
        const userToken:string = JSON.parse(tokenString!);
        return userToken;
    };

    const [token,setToken] = useState(getToken());


    const saveToken = (userToken:string)=>{
        sessionStorage.setItem('token',JSON.stringify(userToken));
        setToken(userToken);
    };

    return{
        setToken:saveToken,
        token:token,
    }

}