import { Router } from "express";
import { body } from "express-validator";
import { ObjectId } from "mongodb";

import {
  getBucket,
  getBuckets,
  getData,
  postCreateBucket,
  postCreateData,
  updateBucket,
  deleteBucket,
  deleteData,
} from "../controllers/bucket";
import Bucket from '../models/bucket';
import isAuth from '../middlewares/is-auth';

const router = Router();

//get
router.get('/',isAuth,getBuckets);
router.get('/:bucketId',isAuth,getBucket);
router.get('/:bucketId/data',isAuth,getData);

//create
router.post('/create',isAuth,[
    body('name').trim().not().isEmpty().custom(async (value,{req})=>{
        const query = {name:value,ownedBy:new ObjectId(req.userId)}
        const bucket = await Bucket.findByQuery(query);
        if (bucket) {
            return Promise.reject("Bucket name is not available");
        }
    })
],postCreateBucket);

router.post('/add-data',isAuth,[
    body('text').trim().not().isEmpty(),
    body('deviceName').trim().not().isEmpty(),
],postCreateData);

//update
router.put('/update-bucket/:bucketId',isAuth,updateBucket);

//delete
router.delete('/delete-data',isAuth,deleteData);
router.delete('/delete-bucket/:bucketId',isAuth,deleteBucket);


export default router;