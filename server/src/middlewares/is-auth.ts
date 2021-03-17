import jwt from 'jsonwebtoken'
import { Request,Response,NextFunction } from "express";
import HttpException from '../utils/HttpException';
import User from '../models/user';


interface MyToken {
    userId: string;
    email: string;
    // whatever else is in the JWT.
  }

export const extractToken = async (headers:string) => {
    if(!headers){
        console.log('No header');
        const error = new HttpException('Not authenticated')
        error.statusCode = 401;
        throw error;
    }
    const token = headers.split(' ')[1];
    let decodedToken:MyToken;
    try{
        const isAvailable = await User.checkToken(token);
        if(isAvailable){
            const error = new HttpException('Not authenticated');
            error.statusCode = 401;
            throw error;
        }
        const secret_key = process.env.JWT_SECRET_KEY;
        decodedToken = jwt.verify(token,secret_key as string) as MyToken;
    }catch(err){
        console.log(err);
        // err.message = "Token is not valid"
        // err.statusCode = 401;
        // throw err;
    }

    if(!decodedToken){
        const error = new HttpException('Not authorized')
        error.statusCode = 401;
        throw error;
    }

    return decodedToken;
}
   


export const validateToken = async (req:Request,res:Response,next:NextFunction)=>{
    const headers = req.get('Authorization');
    const decodedToken = await extractToken(headers!);
    req.userId = decodedToken.userId;
    next();
}
