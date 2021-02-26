import React,{useState,useEffect} from 'react'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/AddBox';
import SearchIcon from '@material-ui/icons/Search';
import { IconButton } from '@material-ui/core';


import "./Home.css";
import Api from "../../utils/api";
import useToken from '../../Hooks/useToken';
import FormDialog from '../../components/FormDialog/FormDialog';


const getUser = async (userToken:any) =>{
    if (userToken) {
        const response = await Api.get('/auth/user/'+userToken.userId,{
            headers:{
                "Content-Type":'application/json',
                "Authorization":"Bearer "+userToken.accessToken,
            }
        });
        return response.data;
    } 
}


const addBucket = (name:string,userId:string) =>{
    console.log(name,userId);
}


function Home() {

    const [userData,setUserData] = useState({email:'',userId:''});
    const [open,setOpen] = useState(false);
    const {token} = useToken();

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
        console.log(open);
    }

    const handleSaveBucket =(name:string)=>{
        addBucket(name,token.userId);
        setOpen(prev=>false);
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
                    <ExitToAppIcon fontSize="small" className="btn-logout" />
                </div>
            </nav>
            <div className="bucketBar">
                <div className="bucketTitle">
                    <h5>Buckets</h5>
                    <IconButton className="icon-btn-add" >
                    <FormDialog open={open} handleClose={handleCloseDialog} getBucketName={handleSaveBucket}  body={(<h1>hello</h1>)}/>  
                    <AddIcon fontSize="small" className="icon-add" onClick={handleAddButton}/>
                    </IconButton>
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
