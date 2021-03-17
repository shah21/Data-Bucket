import { Router } from "express";
import { body } from "express-validator";
import { ObjectId } from "mongodb";

import {
  getBucket,
  getBuckets,
  getData,
  getDownloadFile,
  postCreateBucket,
  postCreateData,
  updateBucket,
  deleteBucket,
  deleteData,
} from "../controllers/bucket";
import Bucket from '../models/bucket';
import {validateToken} from '../middlewares/is-auth';

const router = Router();

//get
router.get('/',validateToken,getBuckets);
router.get('/:bucketId',validateToken,getBucket);
router.get('/:bucketId/data',validateToken,getData);
router.get('/:bucketId/data/:dataId',validateToken,getDownloadFile);

//create
router.post('/create',validateToken,[
    body('name').trim().not().isEmpty().custom(async (value,{req})=>{
        const query = {name:value,ownedBy:new ObjectId(req.userId)}
        const bucket = await Bucket.findByQuery(query);
        if (bucket) {
            return Promise.reject("Bucket name is not available");
        }
    })
],postCreateBucket);

router.post('/add-data',validateToken,[
    body('text').trim().not().isEmpty(),
    body('deviceName').trim().not().isEmpty(),
],postCreateData);

//update
router.put('/update-bucket/:bucketId',validateToken,updateBucket);

//delete
router.delete('/delete-data',validateToken,deleteData);
router.delete('/delete-bucket/:bucketId',validateToken,deleteBucket);


export default router;