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

    
}