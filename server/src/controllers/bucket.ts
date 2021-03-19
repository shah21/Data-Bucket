import { validationResult } from "express-validator";
import {Request,Response,NextFunction} from "express";
import { ObjectID } from "mongodb";
import zlib from "zlib";
import fs from "fs";

import HttpException from "../utils/HttpException";
import Bucket from "../models/bucket";
import socket from "../utils/socket";
import { uploadFile,getKey, deleteFile, deleteFolder} from "../utils/AwsHelpers";
import aws from "../utils/aws_config";



const LIMIT_PER_PAGE = 10;
type UserId = {userId:string};
const compress = zlib.createGzip(),
      decompress = zlib.createGunzip();


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
    const socket_id = req.body.socket_id;
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
        global.io.to(req.userId!).emit('bucket',{action:'bucket-created',bucket:newBucket,socket_id:socket_id});
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

        deleteFolder(req.userId!,bucketId);

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
        if(count[0] && count[0].size > 0){
            bucket = await Bucket.getDataPerPage(query,LIMIT_PER_PAGE,+page);
        }else{
            bucket = [{}]
        }
        
        res.status(200).json({messge:'success',bucket:bucket[0],totalCount:count[0] ? count[0].size:0});
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
    const deviceName = req.body.deviceName;
    const errors = validationResult(req).array();
    const file = req.file;


    try{

        let imgUri:string = null!;

        if(!file && errors.length > 0){
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

        if(req.file){
            const readStream = fs.createReadStream(req.file.name);
            const fileName = 'dfdfdf.gz',   
                writeStream = fs.createWriteStream(fileName);
            readStream.pipe()
            /* Upload file to s3 bucket */
            const uri = await uploadFile(req.file,req.userId!,bucketId);
            if(uri){
                imgUri = uri as string;
            }
        }

        const dataArray = bucket.data;
        const newData = {_id:new ObjectID(Date.now()),data:text,file_path:imgUri,deviceName,addedAt:Date.now(),addedBy:new ObjectID(req.userId)};
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


        let file_path;

        const dataArray = bucket.data.filter((item:any)=>{
            if(item._id.toString() === dataId.toString()){
                file_path = item.file_path;
                return false;
            }
            return true;
            
        });
        if(file_path){
            deleteFile(file_path);
        }
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

export const getDownloadFile = async (req:Request,res:Response,next:NextFunction)=>{
    const bucketId = req.params.bucketId;
    const dataId = req.params.dataId;


    try {
        const data = await Bucket.findDataByQuery({
            "_id":new ObjectID(bucketId),
            "data._id":new ObjectID(dataId),
            "data.addedBy":new ObjectID(req.userId)
        },dataId);

        if(!data[0]){
            const error = new HttpException('Unauthorized access');
            error.statusCode = 402;
            throw error;    
        }


        // //download file
        const downloadUri = data[0].file_path;
        // const urlparts = downloadUri.split('/');
        const key = getKey(downloadUri);
        res.attachment(downloadUri);

        const params = {
            Bucket:process.env.AWS_BUCKET_NAME!,
            Key:key,
        }
        
        const s3 = new aws.S3({apiVersion: '2006-03-01'});
        const stream = s3.getObject(params).createReadStream().on('error',(err)=>{
            throw err;    
        });
        stream.pipe(res);
    } catch (err) {
        console.log(err);
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}





