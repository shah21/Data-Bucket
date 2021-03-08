import { validationResult } from "express-validator";
import {Request,Response,NextFunction} from "express";
import { ObjectID } from "mongodb";
import HttpException from "../utils/HttpException";


import Bucket from "../models/bucket";
import socket from "../utils/socket";
const LIMIT_PER_PAGE = 5;

type UserId = {userId:string};

//buckets
export const getBuckets = async (req:Request,res:Response,next:NextFunction)=>{
    const page = req.query.page || 1; 
    let buckets:any;


    try{
        const query = {ownedBy:new ObjectID(req.userId)};
        const count:number = await Bucket.getDocumentCount(query);
        
        

        if(count > 0){
            buckets = await Bucket.getBucketsWithPagination(query,LIMIT_PER_PAGE,+page);
        }else{
            buckets = [];
        }

        
        res.status(200).json({messge:'success',buckets:buckets,totalCount:count});
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

        const newBucket = new Bucket(name,new ObjectID(req.userId),Date.now(),undefined!,[]);
        const result = await newBucket.save();
        global.io.to(req.userId!).emit('bucket',{action:'bucket-created',bucket:newBucket});
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

        global.io.to(req.userId!).emit('bucket',{action:'bucket-deleted',bId:bucketId});
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
    let bucket;

    try{
        const query = {ownedBy:new ObjectID(req.userId),_id:new ObjectID(bucketId)};
        const count = await Bucket.getDataCount(query);
        if(count[0].size > 0){
            bucket = await Bucket.getDataPerPage(query,LIMIT_PER_PAGE,+page);
        }else{
            bucket = [[]]
        }
        
        res.status(200).json({messge:'success',bucket:bucket[0],totalCount:count[0].size});
    }catch(err){
        console.log(err);
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }

}

export const postCreateData = async (req:Request,res:Response,next:NextFunction)=>{
    const bucketId = req.body.bucketId;
    const text = req.body.text;
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
        const newData = {_id:new ObjectID(Date.now()),data:text,file_path:null,deviceName,addedAt:Date.now()};
        const updateValues = {data:[...dataArray,newData]};
        await Bucket.updateById(bucketId,updateValues);

        global.io.to(bucketId).emit('data',{action:'created',data:newData,bId:bucketId});
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
    const bucketId = req.query.bucketId as string;
    

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
        global.io.to(bucketId).emit('data',{action:'deleted',id:dataId,bId:bucketId});
        res.status(200).json({messge:'deleted successfully'});
    }catch(err){
        console.log(err);
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }

}




