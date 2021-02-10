const { validationResult } = require("express-validator");
const ObjectId = require('mongodb').ObjectID;

const Bucket = require("../models/bucket");
const LIMIT_PER_PAGE = 1;

//buckets
exports.getBuckets = async (req,res,next)=>{
    const page = req.query.page || 1;
    
    try{
        const query = {ownedBy:new ObjectId(req.userId)};
        const buckets = await Bucket.getBucketsWithPagination(query,LIMIT_PER_PAGE,page);
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

        const newBucket = new Bucket(name,new ObjectId(req.userId),Date.now(),[]);
        const result = await newBucket.save();
        res.status(201).json({messge:'bucket created',bucket:result.ops[0]});
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.updateBucket = async (req,res,next)=>{
    const bucketId = req.body.bucketId;
    const name = req.body.name;
    const errors = validationResult(req).array();

    try{

        if(errors.length > 0){
            const error = new Error('Invalid data');
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

exports.deleteBucket = async (req,res,next)=>{
    const bucketId = req.params.bucketId;
    
    try{
        
        const query = {ownedBy:new ObjectId(req.userId),_id:new ObjectId(bucketId)};
        const bucket = await Bucket.deleteByQuery(query);

        if(!bucket){
            const error = new Error('Invalid data');
            error.statusCode = 422;
            error.data = errors;
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
exports.getData = async (req,res,next)=>{
    const bucketId = req.params.bucketId;
    const page = req.query.page || 1;
    
    try{
        const query = {ownedBy:new ObjectId(req.userId),_id:new ObjectId(bucketId)};
        const bucket = await Bucket.getDataPerPage(query,LIMIT_PER_PAGE,page);
        
        res.status(200).json({messge:'success',bucket:bucket[0]});
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.postCreateData = async (req,res,next)=>{
    const bucketId = req.body.bucketId;
    const info = req.body.info;
    const file = req.file;
    const errors = validationResult(req).array();


    try{

        if(errors.length > 0){
            const error = new Error('Invalid data');
            error.statusCode = 422;
            error.data = errors;
            throw error;    
        }

        const query = {ownedBy:new ObjectId(req.userId),_id:new ObjectId(bucketId)};
        const bucket = await Bucket.findByQuery(query);

        if(!bucket){
            const error = new Error('Bucket not found');
            error.statusCode = 402;
            error.data = errors;
            throw error;    
        }

        const dataArray = bucket.data;
        const newData = {_id:new ObjectId(Date.now()),data:info,file_path:null,addedAt:Date.now()};
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


exports.deleteData = async (req,res,next)=>{
    const dataId = req.query.dataId;
    const bucketId = req.query.bucketId;
    
    try{
        
        const query = {ownedBy:new ObjectId(req.userId),_id:new ObjectId(bucketId)};
        const bucket = await Bucket.findByQuery(query);

        if(!bucket){
            const error = new Error('Bucket not found');
            error.statusCode = 402;
            error.data = errors;
            throw error;    
        }

        const dataArray = bucket.data.filter(x=>x._id.toString()!==dataId.toString());
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




