import React,{useState,useEffect,useContext} from 'react'
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

const getUser = async (userToken:any) =>{
    if (userToken) {
        try {
            const response = await axios.get(endpoints.getUser + userToken.userId, {
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": "Bearer " + userToken.accessToken,
                }
            });
            return response.data;
        } catch (err) {
            return err;
        }
    } 
}

const removeCookies = () =>{
    Object.keys(Cookies.get()).forEach(function (cookie) {
        Cookies.remove(cookie);
    });
}

const addBucket = async (name:string,accessToken:string) =>{
    try {
        const response = await axios.post(endpoints.createBucket, { name: name }, {
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            }
        });
        return response.data;
    } catch (err) {
        console.log(err);
        throw err;
    }

}




function Home(props:any) {

    //states
    const [userData,setUserData] = useState({email:'',userId:''});
    const [open,setOpen] = useState(false);
    

    //context
    const {token} = useContext(TokenContext);
    const {setFlash} = useContext(FlashContext);

    const history = useHistory();

    useEffect(() => {
        async function propmiseData(){
            const response = await getUser(token);
            if(response.user){
                const user = response.user;
                setUserData({
                    email:user.email,
                    userId:user._id
                });
            }
        }
        propmiseData();
    }, [token]);

    const handleAddButton = () =>{
        setOpen(prev=>true);
    } 

    const handleCloseDialog = () =>{
        setOpen(prev=>false);
    }

    const handleSaveBucket = (name:string)=>{
        addBucket(name,token.accessToken).then(data=>{
            setOpen(prev=>false);
            setFlash({message:`${name} Bucket created`,type:'success'})
        }).catch(err=>{
            setFlash({message:err.message,type:'error'});
            setOpen(prev=>false);
        })
        
    }

    const handleLogout = () =>{
        removeCookies();
        history.push('/login');
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
                
            </div>
            <div className="bucketView">  
            </div>   

            

        </div>
    )
}

export default Home;
