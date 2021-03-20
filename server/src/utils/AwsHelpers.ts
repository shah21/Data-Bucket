import aws from "./aws_config";
import { v4 as uuidv4 } from 'uuid';
import { GetObjectRequest } from "aws-sdk/clients/s3";
import { createReadStream, createWriteStream } from "fs";
import { Stream } from "stream";
import zlib from "zlib";
import fs from "fs";


import { bufferToStream } from "./fileUtils";


const s3 = new aws.S3({apiVersion: '2006-03-01'});
const BUCKET_NAME = process.env.AWS_BUCKET_NAME!;



export const getKey = (uri:string) => {
    const urlparts = uri.split('/');
    const length = urlparts.length;
    const startingPoint = length - 3;
    let key:string = '';
    for(let i=startingPoint;i<=length-1;i++){
        key +=urlparts[i];
        if(i !== length-1){
            key +='/';
        }
    }
    return key;
}


export const uploadFile =  (file:File,userId:string,bucketId:string)=>{
    const fileKeys = Object.values(file);
    const splitName = fileKeys[1].split('.');
    const fileType = splitName[splitName.length -1];
    const buffer = fileKeys[4];
    const fileName = `${uuidv4()}.${fileType}.gz`;

    const stream = bufferToStream(buffer);
    const compress = zlib.createGzip({
      flush:zlib.constants.Z_SYNC_FLUSH,
    });

    return new Promise((resolve,reject)=>{
      stream
      .pipe(compress)
      .pipe(uploadFromStream(userId,bucketId,fileName,(err:any,data:any)=>{
        if(err){
          reject(err);
        }
        resolve({uri:data.Location,fileType:fileType});
      }));
    });
   
}

function uploadFromStream(userId:string,bucketId:string,fileName:string,callback:(err:any,data:any)=>void) {
  const pass = new Stream.PassThrough();
  s3.upload(
    {
      Bucket: BUCKET_NAME,
      Key: `${userId}/${bucketId}/${fileName}`,
      Body: pass,
    },
    (err: any, data: any) => {
      if (err) {
        callback(err,null);
      }
      if (data) {
        callback(null,data);
      }
    }
  );

  return pass;
}

export const downloadFile = async (uri:string) => {
    const key = getKey(uri);
   
    const params = {
        Bucket:BUCKET_NAME,
        Key:key,
    }

    // const fs = createWriteStream('./files/'+key);
    // const s3Object = await s3.getObject(params).promise();
    // const stream = new Stream.Readable();
    // stream._read = () =>{};
    // stream.push(s3Object.Body);

    // return stream;

    try {
        const file = createWriteStream("./files/" + key);
        return new Promise((resolve, reject) => {
            resolve(s3.getObject(params).createReadStream().pipe(file));
        });
    } catch (err) {
        console.log(err);
    }
}

export const deleteFile = (uri:string) => {
    const key = getKey(uri);
      const params = {
        Bucket:BUCKET_NAME,
        Key: key,
      };
    
      return s3.deleteObject(params).promise().then((result) => {
        return result;
      }).catch((err) => {
          throw err;
      });
}

export const deleteFolder = (userId: string, bucketId: string) => {
  const params = {
    Bucket: BUCKET_NAME,
    Prefix: `${userId}/${bucketId}/`,
  };

  s3.listObjectsV2(params)
    .promise()
    .then((data) => {
      if (data.Contents && data.Contents?.length == 0) {
        return null;
      }
      interface Type {
        Key: string;
      }
      const newParams = {
        Bucket: BUCKET_NAME,
        Delete: { Objects: [] as Type[] },
      };
      data.Contents?.forEach((content) => {
        newParams.Delete.Objects.push({ Key: content.Key! });
      });

      return newParams;
    })
    .then((newParam) => {
      if (!newParam) {
        return null;
      }
      return s3
        .deleteObjects(newParam!)
        .promise()
        .then((result) => {
          return result;
        });
    })
    .catch((err) => {
      throw err;
    });
};



