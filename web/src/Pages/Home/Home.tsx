import React,{useState,useEffect,useContext, useRef, useLayoutEffect} from 'react'
import {useHistory} from "react-router-dom"
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/AddBox';
import SearchIcon from '@material-ui/icons/Search';
import {  CircularProgress, IconButton } from '@material-ui/core';
import Cookies from "js-cookie";




import "./Home.css";
import axios from "../../axios/config";
import FormDialog from '../../components/FormDialog/FormDialog';
import endpoints from '../../axios/endpoints';
import { TokenContext } from "../../Contexts/TokenContext";
import { FlashContext } from '../../Contexts/FlashContext';
import isAuth from '../../utils/isAuth';
import Bucket from '../../Models/bucket';
import BucketList from "../../components/BucketList/BucketList";
import BucketRoom from "../../components/BucketRoom/BucketRoom";
import Folder from "../../res/images/folder.jpg";
import { socket } from '../../utils/socket';

const getUser = async (userToken:any) =>{
    if (userToken) {
        try {
            
            const isAuthourized = await isAuth(userToken.accessToken,userToken.refreshToken);
            if(isAuthourized && isAuthourized.isVerified){
                const response = await axios.get(endpoints.getUser + userToken.userId, {
                    headers: {
                        "Content-Type": 'application/json',
                        "Authorization": "Bearer " + isAuthourized.accessToken,
                    }
                });
                return response.data;
            }
            
        } catch (err) {
            console.log(err);
            return err;
        }
    } 
}

const removeCookies = () =>{
    return new Promise((resolve,reject)=>{
        Object.keys(Cookies.get()).forEach(function (cookie) {
            Cookies.remove(cookie);
            if(Object.keys(Cookies.get()).length === 0){
                resolve(true);
            }
        });
    })
    
}

const addBucket = async (name:string,userToken:any) =>{
    try {
        const isAuthourized = await isAuth(userToken.accessToken,userToken.refreshToken);
        if (isAuthourized && isAuthourized.isVerified) {
            console.log(socket.id);
            const response = await axios.post(endpoints.createBucket, { name: name,socket_id:socket.id }, {
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${isAuthourized.accessToken}`,
                }
            });
            return response.data;
        }
    } catch (err) {
        throw err;
    }

}

const getBuckets = async (userToken:any,page:number) =>{
    try {
        const isAuthourized = await isAuth(userToken.accessToken,userToken.refreshToken);
        if (isAuthourized && isAuthourized.isVerified) {
            const response = await axios.get(endpoints.getBuckets + `/?page=${page}`, {
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

function changeStyle(el: HTMLDivElement,parent: HTMLDivElement) {
    if(el!=null){
        el.style.maxHeight = (parent.offsetHeight).toString()+'px';
    }
}




const logout = async (userToken:any) => {
    try {
        const isAuthourized = await isAuth(userToken.accessToken, userToken.refreshToken);
        if (isAuthourized && isAuthourized.isVerified) {
            const response = await axios.post(endpoints.logout, {
                accessToken: isAuthourized.accessToken,
                refreshToken: userToken.refreshToken,
            });
            if (response) {
                console.log(response);
                return response;
            }
        }
    } catch (err) {
        throw err;
    }
}


function Home(props:any) {

    //states
    const [userData,setUserData] = useState({email:'',userId:''});
    const [open,setOpen] = useState(false);
    const [bucketId,setBucketId] = useState<string>(null!);
    const [scroll,setScroll] = useState<boolean>(false);
    const [buckets,setBuckets] = useState<Bucket[]>([]);
    const [scrolling,setScrolling] = useState<boolean>(false);
    const [isLoading,setLoading] = useState<boolean>(false);
    const [totalCount,setTotalCount] = useState<number>(0);

    const contentRef = useRef<HTMLDivElement>(null!);
    const parentRef = useRef<HTMLDivElement>(null!);
    const bucketsBackup = useRef<Bucket[]>([]);
    const currentPage = useRef<number>(1);

    //context
    const {token,setToken} = useContext(TokenContext);
    const {setFlash} = useContext(FlashContext);
    

    const history = useHistory();
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


    useEffect(()=>{
        async function promiseList(){
            try {
                if(buckets.length === 0){
                    handleReloadBuckets();
                }else{
                    setBuckets(buckets);
                } 
            } catch (err) {
                console.log(err);
            }
        }
        promiseList();

    },[token]);

    useEffect(()=>{
        
        socket.emit('subscribe',token.userId);
        socket.on('bucket', (data: { action: string, bId: string,bucket:Bucket,socket_id:string }) => {
           
            switch (data.action) {
                case 'bucket-created': {
                    
                    if(data.socket_id !== socket.id){
                        handleReloadBuckets();
                    }
                    // console.log(socket.id);
                    // setOpen(prev=>false);
                    // setBuckets(prev=>[...prev,data.bucket as Bucket])
                    // bucketsBackup.current = [...bucketsBackup.current,data.bucket as Bucket];
                    // setFlash({message:`${data.bucket.name} Bucket created`,type:'success'});
                    // setTotalCount(prev=>prev+1);
                    break;
                }
                case 'bucket-deleted': {
                    socket.emit('unsubscribe',data.bId);
                    setBucketId(null!);
                    setBuckets(prev=>prev.filter(bucket=>bucket._id !== data.bId));
                    bucketsBackup.current = bucketsBackup.current.filter(bucket=>bucket._id !== data.bId);
                    setFlash({message:`Bucket deleted successfully`,type:'success'});
                    setTotalCount(prev=>prev-1);
                    break;
                }
            }
        
        return ()=>{
            socket.off('subscribe');
            socket.off('unsubscribe');
            socket.off('bucket');
        }

        });
    },[token]);



    useEffect(() => {
        async function promiseData() {
            try {
                const response = await getUser(token);
                if (response && response.user) {
                    const user = response.user;
                
                    setUserData({
                        email: user.email,
                        userId: user._id

                    });
                }
            } catch (err) {
                console.log(err)
            }
        }
        promiseData();
    }, [token]);


    const handleAddButton = () =>{
        setOpen(prev=>true);
    } 

    const handleCloseDialog = () =>{
        setOpen(prev=>false);
    }

    const handleSaveBucket = async (name:string)=>{
        try {
            const response = await addBucket(name, token);
            if(response){
                console.log('created');
                const data = response;
                setOpen(prev=>false);
                setBuckets(prev=>[...prev,data.bucket as Bucket])
                bucketsBackup.current = [...bucketsBackup.current,data.bucket as Bucket];
                setFlash({message:`${data.bucket.name} Bucket created`,type:'success'});
                setTotalCount(prev=>prev+1);
            }
        } catch (err) {
            if (err.response && err.response.status !== 401) {
                const error = err.response.data.errors[0];
                if (error) {
                    setFlash({ message: error.msg, type: 'error' });
                } else {
                    setFlash({ message: err.message, type: 'error' });
                }
            }
            setOpen(prev => false);
        }
    }

    const handleLogout = async () =>{

        try {

            const response = await logout(token);

            if(response){
                removeCookies().then((result) => {
                    if(result){
                        setToken({accessToken:undefined!,refreshToken:undefined!,userId:undefined!});
                        history.push('/login');
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }


       
    } 

    const handleClickBucket = (id:string) =>{
        setBucketId(id);
    } 

    const handleDeleteBucket = (id:string) =>{
        setBucketId(null!);
        setBuckets(prev=>prev.filter(bucket=>bucket._id !== id))
    }

    const handleSearch = async (e:React.ChangeEvent<HTMLInputElement>)=>{
        const text = e.target.value;
        setBuckets(bucketsBackup.current);
        if(text){
            // console.log(buckets.filter(x=>x.name.toLowerCase().includes(text)))
            setBuckets(prev=>prev.filter(x=>x.name.toLowerCase().includes(text.toLowerCase())));
            if(buckets.length === 0){
                console.log('No buckets found');
            }
        }
    } 


    const paginateData = async () =>{
        if(totalCount > LIMIT_PER_PAGE * currentPage.current){
            currentPage.current = ++currentPage.current; 
            const responseData = await getBuckets(token,currentPage.current);
            setTotalCount(responseData.totalCount);
            setScrolling(false);
            const array = [...buckets, ...responseData.buckets];
            setBuckets(array);
            bucketsBackup.current = array;       
        }
    }


    const handleScroll = (e: any) => {
        const lastItem:HTMLDivElement = document.querySelector(".bucket-list ul.MuiList-root > div:last-child") as HTMLDivElement;
        const lastItemOffset = lastItem.offsetTop + lastItem.clientHeight;
        const scrollBarContainer = document.querySelector(".bucket-list div.scrollBar") as HTMLDivElement;
        // const pageOffset = window.pageYOffset + window.innerHeight;

    
        if (!scrolling && scrollBarContainer.scrollHeight > lastItemOffset) {
            setScrolling(true);
            paginateData();
        }
    }

    const handleReloadBuckets = async () => {
        setLoading(true);
        const responseData = await getBuckets(token, currentPage.current);
        if(responseData){
            setTotalCount(responseData.totalCount);
            const array = [...responseData.buckets];
            setBuckets(array);
            bucketsBackup.current = array;
            setLoading(false);
        }
        // setUpdateStatus(false);
    }


    return (
        <div className="homePage">
            <nav className="header">
                <div className="title">
                    <h4 style={{ fontFamily: 'Poppins,sans-serif'}} >Data Bucket</h4>
                </div>
                <div className="linkSection">
                    <div className="user">
                        <PersonIcon fontSize="small" className="icon-person"/> 
                        <span style={{ fontFamily: 'Poppins,sans-serif'}} >{userData.email}</span>
                    </div>
                    <ExitToAppIcon fontSize="small" className="btn-logout" onClick={handleLogout}/>
                </div>
            </nav>
            <div className="bucketBar">

                <div className="bucketTitle">
                    <h5 style={{ fontFamily: 'Poppins,sans-serif'}} >Buckets</h5>
                    <IconButton className="icon-btn-add" disableFocusRipple={true} onClick={handleAddButton} >
                        <AddIcon fontSize="small" className="icon-add" />
                    </IconButton>
                    <FormDialog open={open} handleClose={handleCloseDialog} getBucketName={handleSaveBucket}/>
                </div>
                <div className="sb-example-1">
                    <div className="search">
                        <input type="text" style={{ fontFamily: 'Poppins,sans-serif'}} onChange={handleSearch} className="searchTerm" placeholder="Search bucket"/>
                        <button type="submit" className="searchButton">
                        <SearchIcon fontSize="small" className="icon-add"/>
                        </button>
                    </div>
                    <hr></hr>
                </div>

                <div className="bucket-list" ref={el => {  parentRef.current = el!; setScroll(true) }}>
                    {buckets.length === 0 && ( <h5 className="no_result_text">No buckets found</h5> )}
                    <div className="scrollBar" onScroll={(e)=>handleScroll(e)} ref={el => { contentRef.current = el!; setScroll(true) }}  style={{ maxHeight:300,overflow:'auto' }}>
                    <BucketList totalCount={totalCount} reloadHandler={paginateData} clickHandler={handleClickBucket} bucketArray={buckets}/>
                    </div>
                    <div className="progress-section">
                        {isLoading && (<CircularProgress className="loading-circle" />)}
                    </div>
                </div>
                
            </div>
            <div className="bucketView">  
                {bucketId ? (<BucketRoom deleteBucketHandler={handleDeleteBucket}  token={token} bucketId={bucketId}/>) :(
                    <div className="container">
                        <div className="placeHolder">
                            <img src={Folder} alt="" className="bucketImg" />
                        </div>
                        <div className="text">
                            <p style={{ fontFamily: 'Poppins,sans-serif'}}>Put your things here</p>
                        </div>
                    </div>
                )}
            </div>   

            

        </div>
    )
}

export default Home;
