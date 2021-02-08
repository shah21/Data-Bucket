const getDb = require('../utils/database').getDb;
const ObjectId = require('mongodb').ObjectID;

class Bucket{
    constructor(name,ownedBy,createdAt){
        this.name = name;
        this.ownedBy = ownedBy;
        this.createdAt = createdAt;
    } 

    save(){
        return getDb().collection('buckets').insertOne(this);
    }

    static findByName(name){
        return getDb().collection('buckets').findOne({name:name});
    }

    static findById(id){
        return getDb().collection('buckets').findOne({id:new ObjectId(id)});
    }

    static findByQuery(query){
        return getDb().collection('buckets').findOne(query);
    }
}

module.exports = Bucket;