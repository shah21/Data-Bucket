const { validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectID;

const Bucket = require("../models/bucket");


//buckets
exports.getBuckets = async (req,res,next)=>{
    
    try{
        const query = {ownedBy:new ObjectId(req.userId)};
        const buckets = await Bucket.getBuckets(query);
        res.status(200).json({messge:'success',buckets:buckets});
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.getBucket = async (req,res,next)=>{
    const bucketId = req.params.bucketId;
    
    try{
        const query = {ownedBy:new ObjectId(req.userId),_id:new ObjectId(bucketId)};
        const bucket = await Bucket.findByQuery(query);
        res.status(200).json({messge:'success',bucket:bucket});
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }

}


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




//bucket data
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





