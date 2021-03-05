import React,{useState,useEffect,useContext, useRef, useMemo, useLayoutEffect} from 'react'
import {useHistory} from "react-router-dom"
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/AddBox';
import SearchIcon from '@material-ui/icons/Search';
import { IconButton } from '@material-ui/core';
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
    Object.keys(Cookies.get()).forEach(function (cookie) {
        Cookies.remove(cookie);
    });
}

const addBucket = async (name:string,userToken:any) =>{
    try {
        const isAuthourized = await isAuth(userToken.accessToken,userToken.refreshToken);
        if (isAuthourized && isAuthourized.isVerified) {
            const response = await axios.post(endpoints.createBucket, { name: name }, {
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

const getBuckets = async (userToken:any) =>{
    try {
        const isAuthourized = await isAuth(userToken.accessToken,userToken.refreshToken);
        if (isAuthourized && isAuthourized.isVerified) {
            const response = await axios.get(endpoints.getBuckets, {
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${isAuthourized.accessToken}`,
                }
            });
            if(response){
                return response.data.buckets;
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


function Home(props:any) {

    //states
    const [userData,setUserData] = useState({email:'',userId:''});
    const [open,setOpen] = useState(false);
    const [bucketId,setBucketId] = useState<string>(null!);
    const [scroll,setScroll] = useState<boolean>(false);
    
    const buckets = useRef<[Bucket]>(null!);
    const contentRef = useRef<HTMLDivElement>(null!);
    const parentRef = useRef<HTMLDivElement>(null!);
    

    //context
    const {token} = useContext(TokenContext);
    const {setFlash} = useContext(FlashContext);
    

    const history = useHistory();

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
                buckets.current = await getBuckets(token);
            } catch (err) {
                console.log(err);
            }
        }
        promiseList();
    },[buckets,token]);


    useEffect(() => {
        async function promiseData() {
            try{
                const response = await getUser(token);
            if (response && response.user) {
                const user = response.user;
                setUserData({
                    email: user.email,
                    userId: user._id

                });
            }
            }catch(err){
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

    const handleSaveBucket = (name:string)=>{
        addBucket(name,token).then(data=>{
            setOpen(prev=>false);
            buckets.current.push(data.bucket as Bucket);
            setFlash({message:`${name} Bucket created`,type:'success'});
        }).catch(err=>{
            if(err.response && err.response.status !== 401){
                setFlash({message:err.message,type:'error'});
            }
            setOpen(prev=>false);
        })
        
    }

    const handleLogout = () =>{
        removeCookies();
        history.push('/login');
    } 

    const handleClickBucket = (id:string) =>{
        setBucketId(id);
    } 




    return (
        <div className="homePage">
            <nav className="header">
                <div className="title">
                    <h4>Data Bucket</h4>
                </div>
                <div className="linkSection">
                    <div className="user">
                        <PersonIcon fontSize="small" className="icon-person"/> 
                        <span>{userData.email}</span>
                    </div>
                    <ExitToAppIcon fontSize="small" className="btn-logout" onClick={handleLogout}/>
                </div>
            </nav>
            <div className="bucketBar">
                <div className="bucketTitle">
                    <h5>Buckets</h5>
                    <IconButton className="icon-btn-add" disableFocusRipple={true} onClick={handleAddButton} >
                        <AddIcon fontSize="small" className="icon-add" />
                    </IconButton>
                    <FormDialog open={open} handleClose={handleCloseDialog} getBucketName={handleSaveBucket} body={(<h1>hello</h1>)} />
                </div>
                <div className="sb-example-1">
                    <div className="search">
                        <input type="text" className="searchTerm" placeholder="Search bucket"/>
                        <button type="submit" className="searchButton">
                        <SearchIcon fontSize="small" className="icon-add"/>
                        </button>
                    </div>
                </div>
                <hr></hr>

                <div className="bucket-list" ref={el => {  parentRef.current = el!; setScroll(true) }}>
                    <div className="scrollBar" ref={el => { contentRef.current = el!; setScroll(true) }}  style={{ maxHeight:300,overflow:'auto' }}>
                    <BucketList clickHandler={handleClickBucket} bucketArray={buckets.current}/>
                    </div>
                </div>
                
            </div>
            <div className="bucketView">  
                {bucketId ? (<BucketRoom token={token} bucketId={bucketId}/>) :(
                    <div className="container">
                        <div className="placeHolder">
                            <img src={Folder} alt="" className="bucketImg" />
                        </div>
                        <div className="text">
                            <p>Put your things here</p>
                        </div>
                    </div>
                )}
            </div>   

            

        </div>
    )
}

export default Home;
