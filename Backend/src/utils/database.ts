import { MongoClient } from "mongodb";


const DB_URI:string = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.0fx5g.mongodb.net/${process.env.MONGO_DEFAULT_DB}?retryWrites=true&w=majority`;
let _db:any;

const connectDb = (callback: () => void) =>{
    MongoClient.connect(DB_URI, { useUnifiedTopology: true },(err,client)=>{
        if(err){
            throw new Error(err.message);
        }
        _db = client.db(); 
        callback();
    });
}

const getDb = ()=>{
    if(!_db){
        throw new Error('No database found.');
    }
    return _db;
}

export {connectDb,getDb}
