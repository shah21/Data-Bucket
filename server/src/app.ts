import express,{Request,Response,NextFunction} from "express";
import cors from "cors";
import session from "express-session";
import sharedsession from "express-socket.io-session";

import {connectDb} from "./utils/database";
import HttpException, {  } from "./utils/HttpException";
import  authRouter from "./routes/auth";
import  bucketRouter from "./routes/bucket";
import socket from "./utils/socket";
import * as socketio from "socket.io";
import WebSockets from "./utils/WebSockets";

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
const users:[string] = [null!];



//sessions
const sessionMiddleware = session({
    secret:process.env.SESSION_SECRET!,
    saveUninitialized:true,
    resave:true,
})


//middlewares
app.use(cors());
app.use(express.json());
app.use(sessionMiddleware);


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
    
})

