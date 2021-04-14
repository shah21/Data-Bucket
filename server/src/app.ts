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
         baseDir:string,
      } 
    }
  }


  global.baseDir = __dirname;

const app = express();
const storage = multer.memoryStorage();
const fileFilter = (req:Request,file:any,cb:any) =>{
  if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "application/pdf" || file.mimetype == "video/mp4" || file.mimetype == "text/plain") {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error('Only .png, .jpg and .jpeg .pdf .mp4 .txt formats are allowed!'));
  }
}
const upload = multer({storage,limits:{fileSize:10000000},fileFilter:fileFilter}).single('file');


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
    res.setHeader('Access-Control-Allow-Origin','https://main.d6fe105zm3v3.amplifyapp.com');
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
    const port = process.env.PORT || 8080;
    const server = app.listen(port);
    global.io = require('socket.io')(server,
      {
        cors: {
          origin: 'https://main.d6fe105zm3v3.amplifyapp.com',
          credentials: true
        }
      }
      );

    global.io.on('connection',WebSockets.connection);
    global.io.on('disconnect',function(){
      global.io.removeListener('bucket',null!);
      global.io.removeListener('data',null!);
      global.io.removeListener('connection',null!);
      global.io.removeListener('disconnect',null!);
    });
    
})

