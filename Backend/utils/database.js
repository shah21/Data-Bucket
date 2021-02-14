const MongoDbClient = require('mongodb').MongoClient;


const DB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.0fx5g.mongodb.net/${process.env.MONGO_DEFAULT_DB}?retryWrites=true&w=majority`;
let _db;

exports.connectDb = callback =>{
    MongoDbClient.connect(DB_URI, { useUnifiedTopology: true },(err,client)=>{
        if(err){
            throw new Error(err);
        }
        _db = client.db(); 
        callback();
    });
}

exports.getDb = ()=>{
    if(!_db){
        throw new Error('No database found.');
    }
    return _db;
}
