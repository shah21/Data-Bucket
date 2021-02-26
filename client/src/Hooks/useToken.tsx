import {useState} from "react";
import Cookie from "js-cookie";
import axios from "../utils/api";


interface FuncType {
    token:UserToken;
    setToken:(userToken:UserToken)=>void;
}

const refreshAccessToken = async (refreshToken:string) => {
    const response = await axios.post('/auth/refresh-token',{refreshToken:refreshToken},{
        headers:{
            "Content-Type":'application/json',
        }
    });
    return response.data;
}

type UserToken = { accessToken: string,refreshToken:string, userId: string }

//custom hook 
export default function useToken():FuncType{

    const getToken = ()=>{
        const accessToken = Cookie.get('accessToken');
        
        const refreshToken = Cookie.get('refreshToken');
        const userId = Cookie.get('userId');

        if(!accessToken || !refreshToken || !userId){
            if(refreshToken){
                refreshAccessToken(refreshToken!).then(data=>{
                    console.log(data)
                    return {accessToken:data.accessToken,refreshToken:data.refreshToken,userId:userId} as UserToken;
                }).catch(err=>{
                    console.log(err.message);
                });
            }
            return null;
        }
        return {accessToken:accessToken,refreshToken:refreshToken,userId:userId} as UserToken;

    };

    const [token,setToken] = useState<UserToken>(getToken()!);


    const saveToken = (userToken:UserToken)=>{
       
        Cookie.set('accessToken',userToken.accessToken,{
            expires: new Date(new Date().getTime() + 1 * 60 * 1000)
        });
        Cookie.set('refreshToken',userToken.refreshToken,{
            expires: new Date().setDate(new Date().getDate() + 7)
        });
        Cookie.set('userId',userToken.userId,{
            expires: new Date().setDate(new Date().getDate() + 7)
        });

        setToken(userToken);
    };

    return{
        setToken:saveToken,
        token:token
    }

}