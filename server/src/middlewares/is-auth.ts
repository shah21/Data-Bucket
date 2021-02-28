import jwt from 'jsonwebtoken'
import { Request,Response,NextFunction } from "express";
import HttpException from '../utils/HttpException';


interface MyToken {
    userId: string;
    email: string;
    // whatever else is in the JWT.
  }


export default (req:Request,res:Response,next:NextFunction)=>{
    const headers = req.get('Authorization');
    if(!headers){
        console.log('No header');
        const error = new HttpException('Not authenticated')
        error.statusCode = 401;
        throw error;
    }
    const token = headers.split(' ')[1];
    let decodedToken:MyToken;
    try{
        const secret_key = process.env.JWT_SECRET_KEY;
        decodedToken = jwt.verify(token,secret_key as string) as MyToken;
    }catch(err){
        err.message = "Token not valid"
        err.statusCode = 401;
        throw err;
    }

    if(!decodedToken){
        const error = new HttpException('Not authorized')
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
}