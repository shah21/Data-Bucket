import  {getDb} from '../utils/database';
import {ObjectID} from'mongodb';

class Bucket{


    constructor(
        private name:string,
        private ownedBy:ObjectID,
        private createdAt:number,
        private access:[string]
        ){} 

    save(){
        return getDb().collection('buckets').insertOne(this);
    }

    static getBuckets(query:object){
        return getDb().collection('buckets').find(query).toArray();
    }

    static getBucketsWithPagination(query:object,limit:number,page:number){
        return getDb().collection('buckets').find(query).skip((page-1)*limit).limit(limit).toArray();
    }

    static getDataPerPage(query:object,limit:number,page:number){
        const skipDocs = (page-1)*limit;
        return getDb().collection('buckets').aggregate([
            {$match: query},
            {$unwind:"$data"},
            {$skip:skipDocs},
            {$limit:limit},
            {$group:{_id:"$_id",data: {"$push": "$data" }}}
        ]).toArray();
    }

    static findByName(name:string){
        return getDb().collection('buckets').findOne({name:name});
    }

    static findById(id:string){
        return getDb().collection('buckets').findOne({_id:new ObjectID(id)});
    }

    static findByQuery(query:object){
        return getDb().collection('buckets').findOne(query);
    }

    static updateById(id:string,values:object){
        return getDb().collection('buckets').findOneAndUpdate({_id:new ObjectID(id)},{$set:values},{returnOriginal:false});
    }

    static deleteByQuery(query:object){
        return getDb().collection('buckets').deleteOne(query);
    }
}

export default Bucket;