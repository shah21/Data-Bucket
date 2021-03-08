import React,{useMemo, useContext,useState,useRef, useEffect} from 'react'
import { Button,TextField,IconButton } from "@material-ui/core";
import Send from "@material-ui/icons/Send";
import AttachFile from "@material-ui/icons/AttachFile";
import OptionsIcon from "@material-ui/icons/MoreVert";
import {makeStyles} from "@material-ui/core/styles"
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import SettingsIcon from '@material-ui/icons/Settings';

import './BucketRoom.css'
import axios from "../../axios/config";
import endpoints from "../../axios/endpoints";
import isAuth from "../../utils/isAuth";
import Bucket from '../../Models/bucket';
import Data from '../../Models/data';
import DataList from '../DataList/DataList';
import { useLayoutEffect } from 'react';
import { socket } from '../../utils/socket';
import { FlashContext } from '../../Contexts/FlashContext';
import OptionsDialog from '../OptionsDialog/OptionsDialog';



interface propTypes{
    bucketId:string,
    token:any,
    deleteBucketHandler:(id:string)=>void,
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

const getDataArray = async (bucketId:string,userToken:any,page:number) =>{
    try {
        const isAuthourized = await isAuth(userToken.accessToken,userToken.refreshToken);
        if (isAuthourized && isAuthourized.isVerified) {
            const response = await axios.get(endpoints.getBucket + bucketId +`/data?page=${page}`, {
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
    },
    listItem:{
        width:250,
      },
});


/* Custom list items for Options dialog */  
const DataOptions = (props:ListTypes) =>  (
    <div>
        <ListItem className={props.classes.listItem} onClick={(e)=>{props.handleOptions('manage',props.dataId)}} button>
      <ListItemIcon>
        <SettingsIcon style={{color:'#32be8f',}} />
      </ListItemIcon>
      <ListItemText primary="Manage Bucket" />
    </ListItem>
    <ListItem className={props.classes.listItem} onClick={(e)=>{props.handleOptions('delete',props.dataId)}} button>
      <ListItemIcon>
        <DeleteIcon color="secondary"/>
      </ListItemIcon>
      <ListItemText primary="Delete" />
    </ListItem>
    </div>
);




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
    const [dataArray,setDataArray] = useState<Data[]>([]);
    const [scroll,setScroll] = useState<boolean>(false);
    const [openOptions,setOpenOptions] = useState<boolean>(false);
    const [openBucketOptions,setOpenBucketOptions] = useState<boolean>(false);
    const [scrolling,setScrolling] = useState<boolean>(false);

    
    const {setFlash} = useContext(FlashContext);

    const classes = useStyle();
    const contentRef = useRef<HTMLDivElement>(null!);
    const parentRef = useRef<HTMLDivElement>(null!);
    const totalCount = useRef<number>(0);
    const currentPage = useRef<number>(1);

    const LIMIT_PER_PAGE = 5;

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
    },[props.bucketId, props.token]);

    useMemo(()=>{
        setDataArray([]);
        async function promiseList(){
            try {
                // if (currentPage.current === 1) {
                    currentPage.current = 1;
                    const response = await getDataArray(props.bucketId, props.token, currentPage.current);
                    if (response && response.bucket) {
                        console.log(response);
                        totalCount.current = response.totalCount;
                        setDataArray(response.bucket.data);
                        setScrolling(false);
                        // totalCount.current = response.totalCount;
                        // setCountState(totalCount.current);
                    }
                // }
            } catch (err) {
                console.log(err);
            }
        }
        promiseList();
    },[props.bucketId, props.token]);
    


    useEffect(()=>{
        socket.emit('subscribe',props.bucketId);
        socket.on('data',(data:{action:string,data:Data,bId:string,id:string})=>{
            //check if it is correct bucket/room
            if (data.bId === props.bucketId) {
                switch (data.action) {
                    case 'created': {
                        setDataArray(prev => [...prev, data.data]);
                        setTextData('');
                        contentRef && updateScroll(contentRef.current);
                        break;
                    }
                    case 'deleted': {
                        setDataArray(prev => {
                            return prev.filter(item => {
                                return item._id !== data.id;
                            });
                        });
                        setFlash({ message: `Data deleted successfully !`, type: 'success' });
                        break;
                    }
                }
            }

        });
        return ()=>{
            socket.off('subscribe');
            socket.off('data');
        }
    },[props.bucketId]);

    const deleteData = async (dataId:string,bucketId:string,token:any)=>{
        try {
            const isAuthourized = await isAuth(token.accessToken, token.refreshToken);
            if (isAuthourized && isAuthourized.isVerified) {
                const response = await axios.delete(endpoints.deleteData + `dataId=${dataId}&bucketId=${bucketId}`,{
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${isAuthourized.accessToken}`,
                    }
                });
                if (response) {
                }
            }
        } catch (err) {
            setFlash({message:`Something error occured!`,type:'error'});
        }
    }
    
    const handleTextData = (e:React.ChangeEvent<HTMLInputElement>) =>{
        setTextData(e.target.value);
    }

    const handleOptions = (type:string,dataId:string) =>{
        if(type==="delete"){
            deleteData(dataId,props.bucketId,props.token);
        }else if(type==="favorite"){
            //TOD
           
        }
        setOpenOptions(false);
    }

    const handleSend = async () =>{
        if(textData){
            try {
                const response = await addData(props.bucketId,props.token,textData,null!);
                if(response){
                    
                }
            } catch (err) {
                console.log(err);
            }
        }
    } 
    
    
    const handleOpen = () =>{
        setOpenBucketOptions(true);
    }

    const handleClose = () =>{  
        setOpenBucketOptions(false);
    }

    const deleteBucket = async (bucketId:string,token:any)=>{
        try {
            const isAuthourized = await isAuth(token.accessToken, token.refreshToken);
            if (isAuthourized && isAuthourized.isVerified) {
                const response = await axios.delete(endpoints.deleteBucket + bucketId,{
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${isAuthourized.accessToken}`,
                    }
                });
                if (response) {
                    return response;
                }
            }
        } catch (err) {
            setFlash({message:`Something error occured!`,type:'error'});
        }
    }

    const handleBucketOptions = (type:string,id:string) =>{
        if(type==="delete"){
            deleteBucket(id,props.token);
            setOpenBucketOptions(false);
        }else if(type==="manage"){
            //TODO
        }
    }


    const paginateData = async () =>{
        console.log(totalCount.current);
        if(totalCount.current > LIMIT_PER_PAGE * currentPage.current){
            currentPage.current = ++currentPage.current; 
            const responseData = await getDataArray(props.bucketId,props.token,currentPage.current);
            const array = [...dataArray, ...responseData.bucket.data];
            totalCount.current = responseData.totalCount;
            setDataArray(array);
            // setCountState(responseData.totalCount);
        }
        setScrolling(false);
    }


    const handleScroll = (e: any) => {
        const lastItem:HTMLDivElement = document.querySelector(".bucketView ul.MuiList-root > div:last-child") as HTMLDivElement;
        const scrollBarContainer = document.querySelector(".room div.scrollBar") as HTMLDivElement;
        if(lastItem){
        const lastItemOffset = lastItem.offsetTop + lastItem.clientHeight;
        // const pageOffset = window.pageYOffset + window.innerHeight;

        if (!scrolling && scrollBarContainer.scrollHeight > lastItemOffset) {       
            setScrolling(true);
            paginateData();
        }
        }
    }


    


    return (
        <div className="bucket">
            {openBucketOptions && (<OptionsDialog listElements={<DataOptions classes={classes} dataId={props.bucketId}
             handleOptions={handleBucketOptions} />} open={openBucketOptions}
              handleClose={handleClose} /> )}
            {bucket &&(
                <div>
                    <div className="room">
                        <div className="headerSection">
                            <h4>{bucket.name}</h4>
                            <div>
                            <IconButton  className="attachIcon">
                                <AttachFile className={classes.attachIcon}/>
                            </IconButton>
                            <IconButton onClick={handleOpen} className="attachIcon">
                                <OptionsIcon className={classes.attachIcon}/>
                            </IconButton>
                            </div>
                        </div>
                        <div className="contents" ref={el => {  parentRef.current = el!; setScroll(true) }}>
                            <div className="scrollBar" onScroll={(e)=>handleScroll(e)} ref={el => { contentRef.current = el!; setScroll(true) }}  style={{ maxHeight:300,overflow:'auto' }}>
                            <DataList totalCount={totalCount.current} reloadHandler={paginateData} setOpen={setOpenOptions} open={openOptions} handleOptions={handleOptions} dataArray={dataArray}/>
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
