const getDb = require('../utils/database').getDb;
const ObjectId = require('mongodb').ObjectID;

class Bucket{
    constructor(name,ownedBy,createdAt,data){
        this.name = name;
        this.ownedBy = ownedBy;
        this.createdAt = createdAt;
        this.data = data;
    } 

    save(){
        return getDb().collection('buckets').insertOne(this);
    }

    static getBuckets(query){
        return getDb().collection('buckets').find(query).toArray();
    }

    static findByName(name){
        return getDb().collection('buckets').findOne({name:name});
    }

    static findById(id){
        return getDb().collection('buckets').findOne({_id:new ObjectId(id)});
    }

    static findByQuery(query){
        return getDb().collection('buckets').findOne(query);
    }

    static updateById(id,values){
        return getDb().collection('buckets').findOneAndUpdate({_id:new ObjectId(id)},{$set:values},{returnOriginal:false});
    }

    static deleteByQuery(query){
        return getDb().collection('buckets').deleteOne(query);
    }
}

module.exports = Bucket;