import  {getDb} from '../utils/database';
import {ObjectID} from'mongodb';

class Data{
    data:string;
    file:string;
    addedAt:Date;
    addedBy:ObjectID;
    addedTo:ObjectID;
    accessGroup:Array<ObjectID>
    constructor(data:string,file:string,addedAt:Date,addedTo:ObjectID,addedBy:ObjectID,accessGroup:[ObjectID]){
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

    static getAllData(query:object){
        return getDb().collection('data').find(query).toArray();
    }


    static findByQuery(query:object){
        return getDb().collection('data').findOne(query);
    }

    static findById(id:string){
        return getDb().collection('data').findOne({id:new ObjectID(id)});
    }
}

module.exports = Data;