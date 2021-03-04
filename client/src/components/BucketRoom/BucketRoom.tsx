import React,{useMemo, useState,useRef, useEffect} from 'react'
import { Button,TextField,IconButton } from "@material-ui/core";
import Send from "@material-ui/icons/Send";
import AttachFile from "@material-ui/icons/AttachFile";
import {makeStyles} from "@material-ui/core/styles"

import './BucketRoom.css'
import axios from "../../axios/config";
import endpoints from "../../axios/endpoints";
import isAuth from "../../utils/isAuth";
import Bucket from '../../Models/bucket';
import Data from '../../Models/data';
import DataList from '../DataList/DataList';
import { useLayoutEffect } from 'react';
import { socket } from '../../utils/socket';



interface propTypes{
    bucketId:string,
    token:any,
}

const getBucket = async (bucketId:string,userToken:any) =>{
    try {
        const isAuthourized = await isAuth(userToken.accessToken,userToken.refreshToken);
        if (isAuthourized && isAuthourized.isVerified) {
            const response = await axios.get(endpoints.getBucket + bucketId, {
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

const getDataArray = async (bucketId:string,userToken:any) =>{
    try {
        const isAuthourized = await isAuth(userToken.accessToken,userToken.refreshToken);
        if (isAuthourized && isAuthourized.isVerified) {
            const response = await axios.get(endpoints.getBucket + bucketId +'/data', {
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${isAuthourized.accessToken}`,
                }
            });
            if(response){
                return response.data;
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
    sendButton:{
        color:'#fff',
    },
    button:{
        width:'100px',
        height:'40px',
        backgroundColor: "#32be8f",

        "&:hover": {
            backgroundColor: "#32be8f"
          }
    },
    attachIcon:{
        color:'#333',
    }
});



const addData = async (bucketId:string,userToken:any,text:any,file:File) =>{
    try {
        const isAuthourized = await isAuth(userToken.accessToken,userToken.refreshToken);
        if (isAuthourized && isAuthourized.isVerified) {
            const body = {
                text:text,
                deviceName:navigator.appName,
                bucketId:bucketId,
            }
            const response = await axios.post(endpoints.addData,body, {
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${isAuthourized.accessToken}`,
                }
            });
            if(response){
                return response;
            }
        }
    } catch (err) {
        throw err;
    }
}

function changeStyle(el: HTMLDivElement,parent: HTMLDivElement) {
    if(el!=null){
        el.style.maxHeight = (parent.offsetHeight - 60).toString()+'px';
    }
}


function updateScroll(el:HTMLDivElement){
    el.scrollTop = el.scrollHeight;
}

function BucketRoom(props:propTypes) {

    const [bucket,setBucket] = useState<Bucket>(null!);
    const [textData,setTextData] = useState<string>('');
    const [dataArray,setDataArray] = useState<[Data]>(null!);
    const [scroll,setScroll] = useState<boolean>(false);
    const [openOptions,setOpenOptions] = useState<boolean>(false);

    const classes = useStyle();
    const contentRef = useRef<HTMLDivElement>(null!);
    const parentRef = useRef<HTMLDivElement>(null!);

    useLayoutEffect(() => {
        function updateSize() {
            if(scroll){
                changeStyle(contentRef.current,parentRef.current)
            }
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () =>{ 
            window.removeEventListener('resize', updateSize);
        }
    }, [contentRef,parentRef,scroll])


    useMemo(()=>{
        async function promiseList(){
            try {
                setBucket(await getBucket(props.bucketId,props.token));
                
            } catch (err) {
                console.log(err);
            }
        }
        promiseList();
    },[props.bucketId,props.token]);

    useMemo(()=>{
        async function promiseList(){
            try {
                const response = await getDataArray(props.bucketId,props.token);
                if(response.bucket.data){
                    setDataArray(response.bucket.data);
                }
                
            } catch (err) {
                console.log(err);
            }
        }
        promiseList();
    },[props.bucketId,props.token,setDataArray]);


    useEffect(()=>{
        socket.on('data',(data:{action:string,data:Data})=>{
            if(data.action === 'created'){

            }
        })
    },[])

    const deleteData = async (bucketId:string,token:any)=>{
        try {
            const response = await axios.delete(endpoints.deleteData + `dataId=${bucketId}&bucketId=${bucketId}`);
            if(response){
                
            }
        } catch (err) {
            console.log(err);
        }
    }
    
    const handleTextData = (e:React.ChangeEvent<HTMLInputElement>) =>{
        setTextData(e.target.value);
    }

    const handleOptions = (type:string,bucketId:string) =>{
        if(type==="delete"){
            deleteData(bucketId,props.token);
        }else if(type==="favorite"){
            //TODO
        }
        setOpenOptions(false);
    }

    const handleSend = async () =>{
        if(textData){
            try {
                const response = await addData(props.bucketId,props.token,textData,null!);
                if(response){
                    const data:Data = response.data.data;
                    const newArray = dataArray;
                    newArray.push(data); 
                    setDataArray(newArray);
                    setTextData('');
                    updateScroll(contentRef.current);
                }
            } catch (err) {
                console.log(err.response);
            }
        }
    }

    return (
        <div className="bucket">
            {bucket &&(
                <div>
                    <div className="room">
                        <div className="headerSection">
                            <h4>{bucket.name}</h4>
                            <IconButton className="attachIcon">
                                <AttachFile className={classes.attachIcon}/>
                            </IconButton>
                        </div>
                        <div className="contents" ref={el => {  parentRef.current = el!; setScroll(true) }}>
                            <div className="scrollBar" ref={el => { contentRef.current = el!; setScroll(true) }}  style={{ maxHeight:300,overflow:'auto' }}>
                            <DataList setOpen={setOpenOptions} open={openOptions} handleOptions={handleOptions} dataArray={dataArray}/>
                            </div>
                        </div>
                    </div>
                    <div className="inputSection">

                        <TextField margin="dense" label="Type here" 
                        value={textData}
                        onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
                            handleTextData(e)
                        }}
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
                        
                        <Button onClick={handleSend} className={classes.button}>
                            <Send className={classes.sendButton}/>
                        </Button>
                        
                    </div>
                </div>
            )}
            
        </div>
    )
}

export default BucketRoom;
