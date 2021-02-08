const getDb = require('../utils/database').getDb;
const ObjectId = require('mongodb').ObjectID;

class Data{
    constructor(data,file,addedAt,addedTo,addedBy,accessGroup){
        this.data = data;
        this.file = file;
        this.addedAt = addedAt;
        this.addedBy = addedBy;
        this.addedTo = addedTo;
        this.accessGroup = accessGroup;
    }

    save(){
        return getDb().collection('data').insertOne(this);
    }

    static getAllData(query){
        return getDb().collection('data').find(query).toArray();
    }


    static findByQuery(query){
        return getDb().collection('data').findOne(query);
    }

    static findById(id){
        return getDb().collection('data').findOne({id:new ObjectId(id)});
    }
}

module.exports = Data;