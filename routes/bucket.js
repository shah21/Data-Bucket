const router = require('express').Router();
const { body } = require('express-validator');
const ObjectId = require('mongodb').ObjectID;

const bucketController = require('../controllers/bucket');
const Bucket = require('../models/bucket');
const isAuth = require('../middlewares/is-auth');


router.get('/',isAuth,bucketController.getBuckets);
router.get('/:bucketId',isAuth,bucketController.getBucket);

router.post('/create',isAuth,[
    body('name').trim().not().isEmpty().custom(async (value,{req})=>{
        const query = {name:value,ownedBy:new ObjectId(req.userId)}
        const bucket = await Bucket.findByQuery(query);
        if (bucket) {
            return Promise.reject("Bucket name not available");
        }
    })
],bucketController.postCreateBucket);


module.exports = router;