import  {getDb} from '../utils/database';
import {ObjectID} from'mongodb';

class User{
    email:string;
    password:string;
    signedAt:Date;
    constructor(email:string,password:string,signedAt:Date){
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

    static findById(id:string){
        return getDb().collection('users').findOne({id:new ObjectID(id)});
    }
}

module.exports = User;