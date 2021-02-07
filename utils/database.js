const MongoDbClient = require('mongodb').MongoClient;


const DB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.0fx5g.mongodb.net/${process.env.MONGO_DEFAULT_DB}?retryWrites=true&w=majority`;
let _db;

console.log(process.env.MONGO_DEFAULT_DB,process.env.MONGO_USER,process.env.MONGO_PASSWORD);

exports.connectDb = callback =>{
    MongoDbClient.connect(DB_URI, { useUnifiedTopology: true },(err,db)=>{
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
