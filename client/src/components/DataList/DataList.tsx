import React,{useState} from 'react'
import {List} from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import OptionsIcon from "@material-ui/icons/MoreVert";
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import FavoriteIcon from '@material-ui/icons/FavoriteOutlined';
import Reload from "@material-ui/icons/ReplayOutlined";
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import GetAppIcon from '@material-ui/icons/GetApp';


import './DataList.css'
import Data from '../../Models/data';
import moment from 'moment';
import OptionsDialog from "../../components/OptionsDialog/OptionsDialog";
import { Link } from 'react-router-dom';








interface propTypes{
    dataArray:Data[],
    handleOptions:(type:string,id:string)=>void,
    open:boolean,
    setOpen:any,
    reloadHandler:()=>void,
    totalCount:number,
    handleDownloadFile:(e:any,uri:string)=>void,
}

const useStyles = makeStyles({
  root: {
    minWidth: '100%',
    marginBottom:'10px',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
    color:'#32be8f',
  },
  pos: {
    marginBottom: 12,
  },
  deleteIcon:{
      color:'#333',
      fontSize:'1.2rem',
  },
  listItem:{
    width:250,
  },
  reloadContainer:{
    width: '100%',
    padding:'10px',
    display: 'flex',
    justifyContent: 'center',
},
reloadIcon:{
    color:'#6C6C6C',
},
file:{
    fontSize:'50px',
    color:'#6C6C6C',
},
download_file:{
    position:'relative',
    width:'50px',
    height:'50px',
},

download:{
    fontSize:'20px',
    position:'absolute',
    bottom:'5px',
    right:'10px',
    color:'#E3E9E7',
},
download_link:{
    fontSize:'10px',
    position:'absolute',
    bottom:'0',
    textDecoration:'underline',
    color:'blue',
}

});



/* Custom list items for Options dialog */  
const DataOptions = (props:ListTypes) =>  (
    <div>
        <ListItem className={props.classes.listItem} onClick={(e)=>{props.handleOptions('favorite',props.dataId)}} button>
      <ListItemIcon>
        <FavoriteIcon style={{color:'#32be8f',}} />
      </ListItemIcon>
      <ListItemText primary="Favorite" />
    </ListItem>
    <ListItem className={props.classes.listItem} onClick={(e)=>{props.handleOptions('delete',props.dataId)}} button>
      <ListItemIcon>
        <DeleteIcon color="secondary"/>
      </ListItemIcon>
      <ListItemText primary="Delete" />
    </ListItem>
    </div>
);


function DataList(props:propTypes) {

    const classes = useStyles();
    const [selectedItemId,setItemId] = useState<string>(null!)


    const handleOpen = (id:string) =>{
        setItemId(id);
        props.setOpen(true);
    } 

    const handleClose = () =>{
        setItemId(null!);
        props.setOpen(false);
    }

    


    return (
        <div className="dataList">

            <List >
                {props.dataArray && props.dataArray.map(data => {
                    return (
                        <div key={data.addedAt}>
                            {props.open && (
                                <OptionsDialog listElements={<DataOptions classes={classes} dataId={selectedItemId} handleOptions={props.handleOptions} />} open={props.open} handleClose={handleClose} />
                            )}
                            <Card className={classes.root} variant="outlined">
                                <CardContent>
                                    <div className="head">
                                        <div>
                                            <Typography className={classes.title} gutterBottom>
                                                {data.deviceName}
                                            </Typography>
                                            <Typography variant="h5" className="timeText" color="textSecondary" gutterBottom>
                                                {moment(data.addedAt).fromNow()}
                                            </Typography>
                                        </div>
                                        <IconButton onClick={(e) => handleOpen(data._id)}>
                                            <OptionsIcon className={classes.deleteIcon} />
                                        </IconButton>
                                    </div>

                                    {data.file_path && (
                                        <div className={classes.download_file}>
                                            <InsertDriveFileIcon className={classes.file}/>
                                            <GetAppIcon className={classes.download}/>
                                            <Link to="/" onClick={(e)=>props.handleDownloadFile(e,data.file_path)}>
                                                <span className={classes.download_link}>Download</span>
                                            </Link>
                                        </div>
                                    )}

                                    {data.data.length > 0 && (<Typography variant="body2" className="" component="p">
                                        {data.data}
                                    </Typography> )}

                                  


                                </CardContent>

                            </Card>
                        </div>
                    )
                })}
                {props.dataArray && props.totalCount > props.dataArray.length && (
                <div className={classes.reloadContainer}>
                        <IconButton onClick={props.reloadHandler}>
                            <Reload  className={classes.reloadIcon} />
                        </IconButton>
                </div>
                )}
            </List>

        </div>
    )
}

export default DataList
