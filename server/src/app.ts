import express,{Request,Response,NextFunction} from "express";
import cors from "cors";
import session from "express-session";
import multer from "multer";
import 'dotenv/config'

import {connectDb} from "./utils/database";
import HttpException, {  } from "./utils/HttpException";
import  authRouter from "./routes/auth";
import  bucketRouter from "./routes/bucket";
import * as socketio from "socket.io";
import WebSockets from "./utils/WebSockets";
import aws from "./utils/aws_config";

declare global {
    namespace NodeJS {
      interface Global {
         document: Document;
         window: Window;
         navigator: Navigator;
         io:socketio.Server,
      } 
    }
  }

const app = express();
const storage = multer.memoryStorage();
const upload = multer({storage}).single('file');


//sessions
const sessionMiddleware = session({
    secret:process.env.SESSION_SECRET!,
    saveUninitialized:true,
    resave:true,
})


//middlewares
app.use(cors());
app.use(express.urlencoded({extended:false})); 
app.use(express.json());
app.use(sessionMiddleware);
app.use(upload);


//add a general middleware for set cors free requests
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','*');
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
    next();
});


app.use('/auth',authRouter);
app.use('/bucket',bucketRouter);

app.use((error:HttpException,req:Request,res:Response,next:NextFunction)=>{
  console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message:message,errors:data});
}); 


connectDb(()=>{
    console.log('Databse connection successfull...');
    const server = app.listen(8080);
    global.io = require('socket.io')(server,{
        cors: {
          origin: "http://localhost:3000",
          credentials: true
        }});
    global.io.on('connection',WebSockets.connection);
    global.io.on('disconnect',function(){
      global.io.removeListener('bucket',null!);
      global.io.removeListener('data',null!);
      global.io.removeListener('connection',null!);
      global.io.removeListener('disconnect',null!);
    });
    
})

