const express = require('express');

const db = require('./utils/database');
const authRouter = require('./routes/auth');


const app = new express();

//middlewares
app.use(express.json());

//add a general middleware for set cors free requests
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','*');
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
    next();
});


app.use('/auth',authRouter);

app.use((error,req,res,next)=>{
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message:message,data:data});
}); 

db.connectDb(()=>{
    console.log('Databse connection successfull...');
    app.listen(8080);
})

