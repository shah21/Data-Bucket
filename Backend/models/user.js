const getDb = require('../utils/database').getDb;


class User{
    constructor(email,password,signedAt){
        this.email = email;
        this.password = password;
        this.signedAt = signedAt;
    } 

    save(){
        return getDb().collection('users').insertOne(this);
    }

    static findByEmail(email){
        return getDb().collection('users').findOne({email:email});
    }

    static findById(id){
        return getDb().collection('users').findOne({id:new ObjectId(id)});
    }
}

module.exports = User;