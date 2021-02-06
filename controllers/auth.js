


exports.postLogin = (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
}

exports.postSignup = (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    const conf_password = req.body.confirmPassword;
}