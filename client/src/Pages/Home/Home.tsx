import React,{useState,useEffect} from 'react'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/AddBox';
import SearchIcon from '@material-ui/icons/Search';

import "./Home.css";
import Api from "../../utils/api";

const getUser = async () =>{
    const userId = sessionStorage.getItem('userId');
    const token = sessionStorage.getItem('token');
    if (userId && token) {
        const response = await Api.get('/auth/user/'+userId,{
            headers:{
                "Content-Type":'application/json',
                "Authorization":token,
            }
        });
        return response.data;
    } 
}

function Home() {

    const [userData,setUserData] = useState({email:'',userId:''});

    useEffect(() => {
        async function propmiseData(){
            const user = await getUser();
            if(user){
                setUserData({
                    email:user.email,
                    userId:user._id
                })
            }
        }
        propmiseData();
    }, [])

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
                    <ExitToAppIcon fontSize="small" className="btn-logout"/>
                </div>
            </nav>
            <div className="bucketBar">
                <div className="bucketTitle">
                    <h5>Buckets</h5>
                    <AddIcon fontSize="small" className="icon-add"/>
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
                Bucket view    
            </div>           
        </div>
    )
}

export default Home;
