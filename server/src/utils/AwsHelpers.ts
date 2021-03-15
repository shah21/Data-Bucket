import aws from "./aws_config";
import { v4 as uuidv4 } from 'uuid';
import { GetObjectRequest } from "aws-sdk/clients/s3";
import { createReadStream, createWriteStream } from "fs";
import { Stream } from "stream";


const s3 = new aws.S3({apiVersion: '2006-03-01'});

const getKey = (uri:string) => {
    const urlparts = uri.split('/');
    return urlparts[urlparts.length -1];
}


export const uploadFile =  (file:File)=>{
    const fileKeys = Object.values(file);
    const splitName = fileKeys[1].split('.');
    const fileType = splitName[splitName.length -1];
    const buffer = fileKeys[4];
    console.log(buffer);

    const fileName = `${uuidv4()}.${fileType}`;

    return new Promise((resolve,reject)=>{
        s3.upload({
            Bucket:process.env.AWS_BUCKET_NAME!,
            Key:fileName,
            Body:buffer,
        },(err:any,data:any)=>{
            if(err){
                reject(err);
            }if(data){
                resolve(data.Location);
            }
        });
    });
   
}

export const downloadFile = async (uri:string) => {
    const key = getKey(uri);
   
    const params = {
        Bucket:process.env.AWS_BUCKET_NAME!,
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
        Bucket:process.env.AWS_BUCKET_NAME!,
        Key: key,
      };
    
      return s3.deleteObject(params).promise().then((result) => {
        return result;
      }).catch((err) => {
          throw err;
      });
}

