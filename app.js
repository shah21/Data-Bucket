const express = require('express');

const db = require('./utils/database');

const app = new express();

db.connectDb(()=>{
    console.log('Databse connection successfull...');
    app.listen(3000);
})

