const MongoDbClient = require('mongodb').MongoClient;


const DB_URI = 'mongodb://localhost:27017/data_bucket';
let _db;

exports.connectDb = callback =>{
    MongoDbClient.connect(DB_URI,(err,db)=>{
        if(err){
            throw new Error('No connection found.');
        }
        _db = db; 
        callback();
    });
}

exports.getDb = ()=>{
    if(!_db){
        throw new Error('No database found.');
    }
    return _db;
}
