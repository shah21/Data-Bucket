const express = require('express');

const db = require('./utils/database');
const authRouter = require('./routes/auth');


const app = new express();

app.use(express.urlencoded({extended:false}));

app.use('/auth',authRouter);


db.connectDb(()=>{
    console.log('Databse connection successfull...');
    app.listen(3000);
})

