import express,{Request,Response,NextFunction} from "express";
import cors from "cors";

import {connectDb} from "./utils/database";
import HttpException, {  } from "./utils/HttpException";
import  authRouter from "./routes/auth";
import  bucketRouter from "./routes/bucket";


const app = express();


//middlewares
app.use(cors());
app.use(express.json());

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
    res.status(status).json({message:message,data:data});
}); 


connectDb(()=>{
    console.log('Databse connection successfull...');
    app.listen(8080);
})

