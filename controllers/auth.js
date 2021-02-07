const { validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const User = require("../models/user");


exports.postLogin = (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
}

exports.postSignup = async (req,res,next)=>{


    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req).array();

    if(errors.length > 0){
        const error = new Error('Invalid data');
        error.statusCode = 422;
        throw error;    
    }

    try{
        const hashedPass = await bcrypt.hash(password,12);
        const newUser = new User(email,hashedPass,Date.now());
        const result = await newUser.save();
        res.staus(201).json({messge:'user created successfully',user:result.ops[0]});
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        throw err;
    }
    



    


}



