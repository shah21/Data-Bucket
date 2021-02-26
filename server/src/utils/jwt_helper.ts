import jwt from "jsonwebtoken";


export const generateAccessToken = (payload:object) =>{
    return new Promise((resolve,reject)=>{
        jwt.sign(payload,process.env.JWT_SECRET_KEY!,{expiresIn:'15s'},(err,token)=>{
            if(err){
                reject(err.message);
            }
            resolve(token);
        });
    })
}


export const generateRefreshToken = (payload:object) =>{
    return new Promise((resolve,reject)=>{
        jwt.sign(payload,process.env.JWT_REFRESH_KEY!,{expiresIn:'7d'},(err,token)=>{
            if(err){
                reject(err.message);
            }
            resolve(token);
        });
    })
}


export const verifyRefreshToken = (token:string) =>{
    return new Promise((resolve,reject)=>{
        jwt.verify(token,process.env.JWT_REFRESH_KEY!,(err,payload)=>{
            if(err){
                console.log('error');
                reject(err.message);
            }
            resolve(payload);
        });
    })
}