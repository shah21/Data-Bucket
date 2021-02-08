const jwt = require('jsonwebtoken');


module.exports = (req,res,next)=>{
    const headers = req.get('Authorization');
    if(!headers){
        console.log('No header');
        const error = new Error('Not authenticated')
        error.statusCode = 401;
        throw error;
    }
    const token = headers.split(' ')[1];
    let decodedToken;
    try{
        console.log(token);
        decodedToken = jwt.verify(token,process.env.JWT_SECRET_KEY);
    }catch(err){
        console.log('failed to decode');
        err.statusCode = 500;
        throw err;
    }

    if(!decodedToken){
        console.log('no data');
        const error = new Error('Not authenticated')
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
}