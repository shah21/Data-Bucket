import  {getDb} from '../utils/database';
import {ObjectId, ObjectID} from'mongodb';

class User{
    email:string;
    password:string;
    signedAt:number;
    constructor(email:string,password:string,signedAt:number){
        this.email = email;
        this.password = password;
        this.signedAt = signedAt;
    } 

    save(){
        return getDb().collection('users').insertOne(this);
    }

    static findByEmail(email:string){
        return getDb().collection('users').findOne({email:email});
    }

    static findByQuery(query:object){
        return getDb().collection('users').findOne(query);
    }

    static findById(id:string){
        return getDb().collection('users').findOne({_id:new ObjectID(id)});
    }

    static updateById(id:string,values:object){
        return getDb().collection('users').updateOne({_id:new ObjectId(id)},{$set:values});
    }

    static updateByQuery(query:object,values:object){
        return getDb().collection('users').updateOne(query,{$set:values});
    }

    static addToken(data:object){
        return getDb().collection("tokenBlackList").insertOne(data);
    }
    
    static checkToken(accessToken:string){
        return getDb().collection("tokenBlackList").findOne({accessToken:accessToken});
    }
    
}

export default User;