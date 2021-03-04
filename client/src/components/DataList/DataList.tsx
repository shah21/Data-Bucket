import React,{useState} from 'react'
import {List} from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from "@material-ui/icons/MoreVert";

import './DataList.css'
import Data from '../../Models/data';
import moment from 'moment';
import OptionsDialog from "../../components/OptionsDialog/OptionsDialog";




interface propTypes{
    dataArray:Data[],
    handleOptions:(type:string,id:string)=>void,
    open:boolean,
    setOpen:any,
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
  }
});

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
                            <OptionsDialog id={selectedItemId} open={props.open} handleClose={handleClose} handleOptions={props.handleOptions} />
                            )}
                            <Card  className={classes.root} variant="outlined">
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
                                        <IconButton onClick={(e)=>handleOpen(data._id)}>
                                            <DeleteIcon className={classes.deleteIcon} />
                                        </IconButton>
                                    </div>

                                    <Typography variant="body1" className="" component="p">
                                        {data.data}
                                    </Typography>


                                </CardContent>

                            </Card>
                        </div>
                    )
                })}
            </List>
            
        </div>
    )
}

export default DataList
