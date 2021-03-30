import {useState} from "react";
import Cookie from "js-cookie";


interface FuncType {
    token:UserToken;
    setToken:(userToken:UserToken)=>void;
}



export type UserToken = { accessToken: string,refreshToken:string, userId: string }

//custom hook 
export function useToken():FuncType{

    const getToken = ()=>{
        const accessToken = Cookie.get('accessToken');
        const refreshToken = Cookie.get('refreshToken');
        const userId = Cookie.get('userId');

        return {accessToken:accessToken,refreshToken:refreshToken,userId:userId} as UserToken;
    };

    const [token,setToken] = useState<UserToken>(getToken()!);


    const saveToken = (userToken:UserToken)=>{

        if(userToken.accessToken && userToken.refreshToken && userToken.userId){
            Cookie.set('accessToken',userToken.accessToken,{
                expires: new Date(new Date().getTime() + 1 * 60 * 1000)
            });
            Cookie.set('refreshToken',userToken.refreshToken,{
                expires: new Date().setDate(new Date().getDate() + 7)
            });
            Cookie.set('userId',userToken.userId,{
                expires: new Date().setDate(new Date().getDate() + 7)
            });    
        }
       
        setToken(userToken);
    };

    return{
        setToken:saveToken,
        token:token
    }

}