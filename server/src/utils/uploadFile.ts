import aws from "./aws_config";
import { v4 as uuidv4 } from 'uuid';

export default (file:File)=>{
    const fileKeys = Object.values(file);
    const splitName = fileKeys[1].split('.');
    const fileType = splitName[splitName.length -1];
    const buffer = fileKeys[4];
    console.log(buffer);

    const fileName = `${uuidv4()}.${fileType}`;
    
    const s3 = new aws.S3({apiVersion: '2006-03-01'});


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