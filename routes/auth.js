const router = require('express').Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth');
const User = require('../models/user');


router.post('/login',authController.postLogin);
router.post('/signup',[
    body('email').isEmail().withMessage('Invalid Email').custom(async (value,{req})=>{
        const user = await User.findByEmail(value);
        if (user) {
            return Promise.reject("E-mail already exists!");
        }
    }).normalizeEmail(),
    body('password').isLength({min:6}).withMessage('Password must have atleast 6 character long'),
    body('confirm_password').isLength({min:6}).withMessage('Password must have atleast 6 character long').custom((value,{req})=>{
        
        if(value !== req.body.password){
            return Promise.reject('Passwords must be same');
        }
        return true;
    }),
],authController.postSignup);


module.exports = router;