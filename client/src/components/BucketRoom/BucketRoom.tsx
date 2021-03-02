import React,{useMemo, useState} from 'react'
import { TextField } from "@material-ui/core";

import './BucketRoom.css'
import axios from "../../axios/config";
import endpoints from "../../axios/endpoints";
import isAuth from "../../utils/isAuth";
import Bucket from '../../Models/bucket';



interface propTypes{
    id:string,
    token:any,
}

const getBucket = async (id:string,userToken:any) =>{
    try {
        const isAuthourized = await isAuth(userToken.accessToken,userToken.refreshToken);
        if (isAuthourized && isAuthourized.isVerified) {
            const response = await axios.get(endpoints.getBucket + id, {
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${isAuthourized.accessToken}`,
                }
            });
            if(response){
                return response.data.bucket;
            }
        }
    } catch (err) {
        throw err;
    }

}

function BucketRoom(props:propTypes) {

    const [bucket,setBucket] = useState<Bucket>(null!);

    useMemo(()=>{
        async function promiseList(){
            try {
                setBucket(await getBucket(props.id,props.token));
            } catch (err) {
                console.log(err);
            }
        }
        promiseList();
    },[props.id,props.token]);


    return (
        <div className="bucket">
            {bucket &&(
                <div className="room">
                    <div className="headerSection">
                        <h4>{bucket.name}</h4>
                    </div>
                    <div className="contents"></div>
                    <div className="inputSection">
                        
                        <textarea/>

                    </div>
                </div>
            )}
            
        </div>
    )
}

export default BucketRoom;
