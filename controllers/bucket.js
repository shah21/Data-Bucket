const { validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectID;

const Bucket = require("../models/bucket");



exports.postCreateBucket = async (req,res,next)=>{
    const name = req.body.name;
    const errors = validationResult(req).array();

    try{

        if(errors.length > 0){
            const error = new Error('Invalid data');
            error.statusCode = 422;
            error.data = errors;
            throw error;    
        }

        const newBucket = new Bucket(name,new ObjectId(req.userId),Date.now());
        const result = await newBucket.save();
        res.status(201).json({messge:'user created successfully',bucket:result.ops[0]});
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }

}





