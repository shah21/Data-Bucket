import {Request,Response,NextFunction} from "express";
import { validationResult } from "express-validator";
import bcryptjs from "bcryptjs";
import crypto from 'crypto';
import HttpException from "../utils/HttpException";
import { generateAccessToken,generateRefreshToken, verifyRefreshToken,verifyAccessToken } from "../utils/jwt_helper";
import { extractToken } from "../middlewares/is-auth";

import User from "../models/user";
import { sendMail } from "../utils/sendMail";


export const getUser = async (req:Request,res:Response,next:NextFunction)=>{
    const userId:string = req.userId!;
    try{
        const user = await User.findById(userId);
        if (!user) {
          const error = new HttpException("User not found");
          error.statusCode = 422;
          throw error;
        }

        const userObj = {
            _id:user._id,
            email:user.email,
            signedAt:user.signedAt,
        }

        res.status(200).json({messge:'success',user:userObj});
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
};


export const postLogin = async (req:Request,res:Response,next:NextFunction)=>{
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req).array();

    try{
        const user = await User.findByEmail(email);
        if (!user) {
          const error = new HttpException("User not found");
          error.statusCode = 422;
          error.data =  errors;
          throw error;
        }

        const isPasswordsEqual = await bcryptjs.compare(password,user.password);
        if(!isPasswordsEqual){
            const error = new HttpException('Incorrect Password');
            error.statusCode = 422;
            error.data = errors;
            throw error;    
        }
        
        const payload = {userId:user._id};
        const accessToken = await generateAccessToken(payload);
        const refreshToken = await generateRefreshToken(payload);

        res.status(200).json({messge:'login successfull.',user:{accessToken:accessToken,refreshToken:refreshToken, userId:user._id}});
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }

}

export const postSignup = async (req:Request,res:Response,next:NextFunction)=>{

    
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req).array();

    try{

        if(errors.length > 0){
            const error = new HttpException("Invalid data");
            error.message = errors[0].msg;
            error.statusCode = 422;
            error.data = errors;
            throw error;    
        }

        
        const hashedPass = await bcryptjs.hash(password,12);
        const newUser = new User(email,hashedPass,Date.now());
        const result = await newUser.save();
        res.status(201).json({messge:'user created successfully'});
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }

}

export const postRefreshToken = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const { refreshToken } = req.body;

        !refreshToken && new HttpException('Bad request');
        const result:any = await verifyRefreshToken(refreshToken);
        
        const payload = {userId:result.userId};
        const accessToken = await generateAccessToken(payload);

        res.status(200).json({accessToken:accessToken});
    }catch(err){
        console.log(err);
        if(err.message === "Not authorized"){
            err.statusCode = 401;
        }else if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
};


export const postVerifyToken = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const { accessToken } = req.body;

        !accessToken && new HttpException('Bad request');

        const payload:any = await verifyAccessToken(accessToken);
        
        if(payload){
            res.status(200).json({isVerified:true});
        }
    }catch(err){
        if(err.message === "Not authorized"){
            err.statusCode = 401;
        }
        else if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
};


export const postSentResetMail = (req:Request,res:Response,next:NextFunction) =>{
    const email = req.body.email;

    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            return res.redirect('/forgot-password');
        }
        const token = buffer.toString('hex');
        User.findByEmail(email).then(user=>{
            if(!user){
                const error = new HttpException("Email has not an account in Databucket!");
                error.statusCode = 404;
                throw error;    
            }
            const updateValues = {
                resetToken:token,
                tokenExpiring:Date.now() + 3600000,
            }
            return User.updateById(user._id,updateValues);
        }).then(result=>{
           const body = `
           <p>You are requested for a password reset</p>
           <p>click this <a href="http://localhost:3000/reset-password/?token=${token}&email=${email}">Link</a> to
            set a new password</p>
            `;
            
           sendMail(email,'Reset your password',body).then(sendResult=>{
                if(sendResult){
                    res.json({message:'Reset mail sended !',mailId:sendResult.MessageId});
                }
           });
        }).catch(err=>{
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        });
    });
}

export const postResetPassword =(req:Request,res:Response,next:NextFunction)=>{
    const email = req.body.email;
    const password = req.body.password;
    const confirm_password = req.body.conf_password;
    const token = req.body.token;
    const errors = validationResult(req).array();

    if(errors.length > 0){
        const error = new HttpException("Unauthorized request");
        error.message = errors[0].msg;
        error.statusCode = 422;
        error.data = errors;
        throw error;    
    }


    User.findByQuery({email:email,resetToken:token}).then((user) => {
        if(!user|| (user && user.tokenExpiring < Date.now())){
            const error = new HttpException("Token expired");
            error.statusCode = 401;
            throw error;    
        }
        
        bcryptjs.hash(password,12).then(hash=>{
            const updateValues = {password:hash,resetToken:undefined,tokenExpiring:undefined};
            User.updateByQuery({email:email},updateValues).then((result) => {
                res.json({message:'succesffully updated'});
            });
        })
    }).catch((err) => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);   
    });
    
    
};

interface MyToken {
    userId: string;
    email: string;
    // whatever else is in the JWT.
  }

export const postLogout = async (req:Request,res:Response,next:NextFunction) => {
    const {refreshToken,accessToken} = req.body;
    
    try{
        const tokenPayload:any = await verifyAccessToken(accessToken);
        if(tokenPayload){
            const refreshPayload = await verifyRefreshToken(refreshToken);
            if(refreshPayload){
                //upload to black list token
                const data = {accessToken:accessToken,refreshToken:refreshToken,expiresIn:new Date(tokenPayload.exp *1000)};
                await User.addToken(data);
                res.json({message:'logout successfull'});
            }
        }
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);   
    }
}