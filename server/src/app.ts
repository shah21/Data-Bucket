import express,{Request,Response,NextFunction} from "express";
import cors from "cors";
import session from "express-session";
import sharedsession from "express-socket.io-session";

import {connectDb} from "./utils/database";
import HttpException, {  } from "./utils/HttpException";
import  authRouter from "./routes/auth";
import  bucketRouter from "./routes/bucket";
import socket from "./utils/socket";


const app = express();
const users:[string] = [null!];

const server = app.listen(8080);
const io = socket.init(server);


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

io.use(sharedsession(sessionMiddleware,{autoSave:true}));

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
 
    
    io.sockets.on('connection',sk=>{
        console.log('socket conected');
        sk.on('joins',(data:any)=>{
            sk.handshake.session.socketId = sk.id;
            sk.handshake.session.save();
        }); 
    });
})

