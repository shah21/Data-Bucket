import React,{useMemo, useContext,useState,useRef, useEffect} from 'react'
import { Button,TextField,IconButton, CircularProgress } from "@material-ui/core";
import Send from "@material-ui/icons/Send";
import AttachFile from "@material-ui/icons/AttachFile";
import OptionsIcon from "@material-ui/icons/MoreVert";
import {makeStyles} from "@material-ui/core/styles"
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import SettingsIcon from '@material-ui/icons/Settings';
import download from 'js-file-download'


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
import UploadDialog from '../UploadDialog/UploadDialog';



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

const getUA = () => {
    let device = "Unknown";
    const ua:{[key:string]:RegExp} = {
        "Generic Linux": /Linux/i,
        "Android": /Android/i,
        "BlackBerry": /BlackBerry/i,
        "Bluebird": /EF500/i,
        "Chrome OS": /CrOS/i,
        "Datalogic": /DL-AXIS/i,
        "Honeywell": /CT50/i,
        "iPad": /iPad/i,
        "iPhone": /iPhone/i,
        "iPod": /iPod/i,
        "macOS": /Macintosh/i,
        "Windows": /IEMobile|Windows/i,
        "Zebra": /TC70|TC55/i,
    }
    Object.keys(ua).map(v => navigator.userAgent.match(ua[v]) && (device = v));
    return device;
  }
  



const addData = async (bucketId:string,userToken:any,text:string,file:File,progressListener:(progress:number)=>void) =>{
    try {
        const isAuthourized = await isAuth(userToken.accessToken,userToken.refreshToken);
        if (isAuthourized && isAuthourized.isVerified) {
           
            //setting form data for multipart/form 
            const formData = new FormData();
            formData.append('text',text);
            formData.append('deviceName',getUA());
            formData.append('bucketId',bucketId);
            formData.append('file',file);


            const response = await axios.post(endpoints.addData,formData, {
                headers: {
                    "Content-type": "multipart/form-data",
                    "Authorization": `Bearer ${isAuthourized.accessToken}`,
                },
                onUploadProgress:(progressEvent:ProgressEvent)=>{
                    const percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
                    progressListener(percentCompleted);
                }
            });
            if(response){
                console.log(response);
                return response;
            }
        }
    } catch (err) {
        throw err;
    }
}

const downloadFile = async (bucketId:string,userToken:any,dataId:string) =>{
    
    
    try {
        const isAuthourized = await isAuth(userToken.accessToken,userToken.refreshToken);
        if (isAuthourized && isAuthourized.isVerified) {
           const response = await axios.get(endpoints.getBucket + `${bucketId}/data/${dataId}`,{
            headers: {
                "Content-type": "multipart/form-data",
                "Authorization": `Bearer ${isAuthourized.accessToken}`,
            },
            responseType:'blob',
           });
           if(response){
               const type = response.data.type.split('/')[1];
            //    console.log(response.data);
               download(response.data,`${Date.now()}.${type}`);
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
    const [uploadProgress,setUploadProgress] = useState<number>(0);
    const [uploadState,setUploadState] = useState<boolean>(false);
    const [isLoading,setLoading] = useState<boolean>(false);

    
    const {setFlash} = useContext(FlashContext);

    const classes = useStyle();
    const contentRef = useRef<HTMLDivElement>(null!);
    const parentRef = useRef<HTMLDivElement>(null!);
    const totalCount = useRef<number>(0);
    const currentPage = useRef<number>(1);
    const fileChoose = useRef<HTMLInputElement>(null!);
    const currentFile = useRef<File>(null!);

    const LIMIT_PER_PAGE = 10;

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
                setFlash({message:err.message,type:'error'});
            }
        }
        promiseList();
    },[props.bucketId, props.token]);

    useMemo(()=>{
        
        async function promiseList(){
            try {
                //run only dataArray is empty or bucket id changed
                if(dataArray.length === 0 || props.bucketId){
                    setLoading(true);
                    const response = await getDataArray(props.bucketId, props.token,currentPage.current);
                    if (response) {
                        console.log(response);
                        totalCount.current = response.totalCount;
                        setDataArray(response.bucket.data ? response.bucket.data : []);
                        setScrolling(false);
                    }
                    setLoading(false);
                }else{
                    setDataArray(dataArray);   
                }
                   
            } catch (err) {
               console.log(err);
               setLoading(false); 
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
                const response = await addData(props.bucketId,props.token,textData,null!,(progress:number)=>{

                });
                if(response){
                    
                }
            } catch (err) {
                setFlash({message:err.message,type:'error'});
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
        if(totalCount.current > LIMIT_PER_PAGE * currentPage.current){
            setLoading(true);
            currentPage.current = ++currentPage.current; 
            const responseData = await getDataArray(props.bucketId,props.token,currentPage.current);
            const array = [...dataArray, ...responseData.bucket.data];
            totalCount.current = responseData.totalCount;
            setDataArray(array);
            // setCountState(responseData.totalCount);
        }
        setScrolling(false);
        setLoading(true);
    }


    const handleScroll = (e: any) => {
        const lastItem:HTMLDivElement = document.querySelector(".bucketView ul.MuiList-root > div:last-child") as HTMLDivElement;
        const scrollBarContainer = document.querySelector(".room div.scrollBar") as HTMLDivElement;
        if (lastItem) {
            const lastItemOffset = lastItem.offsetTop + lastItem.clientHeight;
            // const pageOffset = window.pageYOffset + window.innerHeight;

            if (!scrolling && scrollBarContainer.scrollHeight > lastItemOffset) {
                setScrolling(true);
                paginateData();
            }
        }
    }

    const handleFileChange = async (e:React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files[0]){
            const file = e.target.files[0];
            currentFile.current = file;
            try {
                setUploadState(true);
                setUploadProgress(0);
                const response = await addData(props.bucketId,props.token,'',file,(progress:number)=>{
                    setUploadProgress(progress);
                });

                if(response){
                    setUploadState(false);
                }
            } catch (err) {
                if(err.response){
                    let errMessage = err.response.data.message;
                    if(errMessage === 'File too large!'){
                        errMessage += '.Pick another one' 
                    }
                    setFlash({message:errMessage,type:'error'});
                }else{
                    setFlash({message:err.message,type:'error'});
                }
                setUploadState(false);
            }
        }
    }


    const handleDownloadFile = (e:any,id:string) => {
        e.preventDefault();
        downloadFile(props.bucketId,props.token,id);
    }

    
    const handleCloseUploadDialog = () =>{  
        setUploadState(false);
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
                            <IconButton onClick={(e)=>{fileChoose.current.click()}} className="attachIcon">
                                <AttachFile className={classes.attachIcon}/>
                            </IconButton>
                            <IconButton onClick={handleOpen} className="attachIcon">
                                <OptionsIcon className={classes.attachIcon}/>
                            </IconButton>
                            </div>
                        </div>
                        <div className="contents" ref={el => {  parentRef.current = el!; setScroll(true) }}>
                            <div className="scrollBar" onScroll={(e)=>handleScroll(e)} ref={el => { contentRef.current = el!; setScroll(true) }}  style={{ maxHeight:300,overflow:'auto' }}>
                            <DataList loadingContent={isLoading} handleDownloadFile={handleDownloadFile} totalCount={totalCount.current} reloadHandler={paginateData} setOpen={setOpenOptions} open={openOptions} handleOptions={handleOptions} dataArray={dataArray}/>
                            </div>
                            {/* <div className="progress-section">
                                {true && (<CircularProgress className="loading-circle" />)}
                            </div> */}
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
            
            
            {uploadState && (<UploadDialog fileName={currentFile.current && currentFile.current.name} progress={uploadProgress} open={uploadState} handleClose={handleCloseUploadDialog} />)}


             <input ref={fileChoose} name="file" onClick={(e)=>fileChoose.current.value = ""} onChange={handleFileChange} type="file" style={{visibility:'hidden'}}/>
        </div>
    )
}

export default BucketRoom;
