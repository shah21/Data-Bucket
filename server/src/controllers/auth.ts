import {Request,Response,NextFunction} from "express";
import { validationResult } from "express-validator";
import bcryptjs from "bcryptjs";
import HttpException from "../utils/HttpException";
const jwt = require('jsonwebtoken');

const User = require("../models/user");



const postLogin = async (req:Request,res:Response,next:NextFunction)=>{
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

        const token = jwt.sign({
            email:user.email,
            userId:user._id,
        },process.env.JWT_SECRET_KEY,{expiresIn:'1hr'});

        res.status(200).json({messge:'login successfull.',token:token,userId:user._id});
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }

}

const postSignup = async (req:Request,res:Response,next:NextFunction)=>{


    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req).array();

    try{

        if(errors.length > 0){
            const error = new HttpException("Invalid data");
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

export {postLogin,postSignup};




