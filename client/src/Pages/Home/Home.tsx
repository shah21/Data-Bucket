import React from 'react'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/AddBox';
import SearchIcon from '@material-ui/icons/Search';

import "./Home.css";


function Home() {
    return (
        <div className="homePage">
            <nav className="header">
                <div className="title">
                    <h4>Data Bucket</h4>
                </div>
                <div className="linkSection">
                    <div className="user">
                        <PersonIcon fontSize="small" className="icon-person"/> 
                        <span>User email</span>
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
