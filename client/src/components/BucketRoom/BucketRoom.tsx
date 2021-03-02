import React,{useMemo, useState} from 'react'
import { Button,TextField } from "@material-ui/core";
import Send from "@material-ui/icons/Send";
import {makeStyles,createMuiTheme,MuiThemeProvider } from "@material-ui/core/styles"

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


const useStyle = makeStyles({   
    cssLabel: {
        color: 'rgb(61, 158, 116) !important'
    },
    notchedOutline: {
        borderWidth: '1px',
        borderColor: 'rgb(61, 158, 116) !important',
        color: 'rgb(61, 158, 116)',
    },
    // sendButton:{
    //     color:'#fff',
    // },
    button:{
        width:'100px',
        height:'40px',
        background:'#32be8f',
    }
});

function BucketRoom(props:propTypes) {

    const [bucket,setBucket] = useState<Bucket>(null!);

   

    const classes = useStyle();

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
                <div>
                    <div className="room">
                        <div className="headerSection">
                            <h4>{bucket.name}</h4>
                        </div>
                        <div className="contents"></div>
                    </div>
                    <div className="inputSection">

                        <TextField margin="dense" label="Type here" 
                        InputLabelProps={{
                            classes: {
                              root: classes.cssLabel,
                              focused: classes.cssLabel,
                            },
                        }}
                        
                        InputProps={{
                            classes: {
                              root: classes.notchedOutline,
                              focused: classes.notchedOutline,
                              notchedOutline: classes.notchedOutline,
                            },
                            
                         }}

                        variant="outlined" className="input" />
                        
                        <Button className={classes.button}>
                            <Send/>
                        </Button>
                        
                    </div>
                </div>
            )}
            
        </div>
    )
}

export default BucketRoom;
