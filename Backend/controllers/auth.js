const { validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require("../models/user");



exports.postLogin = async (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;

    try{
        const user = await User.findByEmail(email);
        if (!user) {
          const error = new Error("Incorrect Email");
          error.statusCode = 422;
          error.data = errors;
          throw error;
        }

        const isPasswordsEqual = await bcrypt.compare(password,user.password);
        if(!isPasswordsEqual){
            const error = new Error('Incorrect Password');
            error.statusCode = 422;
            error.data = errors;
            throw error;    
        }

        const token = jwt.sign({
            email:user.email,
            userId:user._id,
        },process.env.JWT_SECRET_KEY,{expiresIn:'1hr'});

        res.status(201).json({messge:'login successfull.',token:token,userId:user._id});
    }catch(err){
        console.log(err);
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.postSignup = async (req,res,next)=>{


    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req).array();

    try{

        if(errors.length > 0){
            const error = new Error('Invalid data');
            error.statusCode = 422;
            error.data = errors;
            throw error;    
        }

        const hashedPass = await bcrypt.hash(password,12);
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




