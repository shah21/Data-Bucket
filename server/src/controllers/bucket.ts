import { validationResult } from "express-validator";
import {Request,Response,NextFunction} from "express";
import { ObjectID } from "mongodb";
import HttpException from "../utils/HttpException";


const Bucket = require("../models/bucket");
const LIMIT_PER_PAGE = 1;

type UserId = {userId:string};

//buckets
export const getBuckets = async (req:Request,res:Response,next:NextFunction)=>{
    const page = req.query.page || 1; 
    
    try{
        const query = {ownedBy:new ObjectID(req.userId)};
        const buckets = await Bucket.getBucketsWithPagination(query,LIMIT_PER_PAGE,page);
        res.status(200).json({messge:'success',buckets:buckets});
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }

}

export const getBucket = async (req:Request,res:Response,next:NextFunction)=>{
    const bucketId = req.params.bucketId;
    
    try{
        const query = {ownedBy:new ObjectID(req.userId),_id:new ObjectID(bucketId)};
        const bucket = await Bucket.findByQuery(query);
        res.status(200).json({messge:'success',bucket:bucket});
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }

}


export const postCreateBucket = async (req:Request,res:Response,next:NextFunction)=>{
    const name = req.body.name;
    const errors = validationResult(req).array();

    try{

        if(errors.length > 0){
            const error = new HttpException('Invalid data');
            error.statusCode = 422;
            error.data = errors;
            throw error;    
        }

        const newBucket = new Bucket(name,new ObjectID(req.userId),Date.now(),[]);
        const result = await newBucket.save();
        res.status(201).json({messge:'bucket created',bucket:result.ops[0]});
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }

}

export const updateBucket = async (req:Request,res:Response,next:NextFunction)=>{
    const bucketId = req.params.bucketId;
    const name = req.body.name;
    const errors = validationResult(req).array();

    try{

        if(errors.length > 0){
            const error = new HttpException('Invalid data');
            error.statusCode = 422;
            error.data = errors;
            throw error;    
        }

        const updateValues = {name:name,updatedAt:Date.now()};
        const updateBucket = await Bucket.updateById(bucketId,updateValues);
        res.status(201).json({messge:'updated successfully',bucket:updateBucket.value});
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }

}

export const deleteBucket = async (req:Request,res:Response,next:NextFunction)=>{
    const bucketId = req.params.bucketId;
    
    try{
        
        const query = {ownedBy:new ObjectID(req.userId),_id:new ObjectID(bucketId)};
        const bucket = await Bucket.deleteByQuery(query);

        if(!bucket){
            const error = new HttpException('Invalid data');
            error.statusCode = 422;
            throw error;    
        }

        res.status(200).json({messge:'deleted successfully'});
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }

}





//bucket data
export const getData = async (req:Request,res:Response,next:NextFunction)=>{
    const bucketId = req.params.bucketId;
    const page = req.query.page || 1;
    
    try{
        const query = {ownedBy:new ObjectID(req.userId),_id:new ObjectID(bucketId)};
        const bucket = await Bucket.getDataPerPage(query,LIMIT_PER_PAGE,page);
        
        res.status(200).json({messge:'success',bucket:bucket[0]});
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }

}

export const postCreateData = async (req:Request,res:Response,next:NextFunction)=>{
    const bucketId = req.body.bucketId;
    const info = req.body.info;
    const file = req.file;
    const deviceName = req.body.deviceName;
    const errors = validationResult(req).array();


    try{

        if(errors.length > 0){
            const error = new HttpException('Invalid data');
            error.statusCode = 422;
            error.data = errors;
            throw error;    
        }

        const query = {ownedBy:new ObjectID(req.userId),_id:new ObjectID(bucketId)};
        const bucket = await Bucket.findByQuery(query);

        if(!bucket){
            const error = new HttpException('Bucket not found');
            error.statusCode = 402;
            error.data = errors;
            throw error;    
        }

        const dataArray = bucket.data;
        const newData = {_id:new ObjectID(Date.now()),data:info,file_path:null,deviceName,addedAt:Date.now()};
        const updateValues = {data:[...dataArray,newData]};
        const updateBucket = await Bucket.updateById(bucketId,updateValues);
        res.status(201).json({messge:'Successfully added',data:newData});
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }

}


export const deleteData = async (req:Request,res:Response,next:NextFunction)=>{
    const dataId = req.query.dataId as string;
    const bucketId = req.query.bucketId;
    
    try{
        
        const query = {ownedBy:new ObjectID(req.userId),_id:new ObjectID(bucketId as string)};
        const bucket = await Bucket.findByQuery(query);

        if(!bucket){
            const error = new HttpException('Bucket not found');
            error.statusCode = 402;
            throw error;    
        }

        const dataArray = bucket.data.filter((x: { _id: { toString: () => string; }; })=>x._id.toString()!==dataId.toString());
        const updateValues = {data:dataArray};
        const updateBucket = await Bucket.updateById(bucketId,updateValues);
        res.status(200).json({messge:'deleted successfully'});
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }

}




