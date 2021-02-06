const router = require('express').Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth');


router.post('/login',authController.postLogin);
router.post('/signup',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:6}).withMessage('Password must have atleast 6 character long'),
    body('password').isLength({min:6}).withMessage('Password must have atleast 6 character long').custom((value,{req})=>{
        if(value !== req.password){
            return Promise.reject('Passwords must be same');
        }
        return true;
    }),
],authController.postLogin);

module.exports = router;