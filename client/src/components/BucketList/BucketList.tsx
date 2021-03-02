import React from "react";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FolderIcon from '@material-ui/icons/Folder';
import Divider from '@material-ui/core/Divider';
import ButtonBase from '@material-ui/core/ButtonBase'

import Bucket from "../../Models/bucket";
import { Typography,makeStyles } from "@material-ui/core";

interface PropTypes{
    bucketArray:[Bucket],
    clickHandler:(id:string)=>void
}

const useStyle = makeStyles({
    folderIcon:{ color: '#128976',fontSize:'30px', },
    primaryText:{fontSize:'1rem',fontFamily: 'Poppins,sans-serif',},
    secondaryText:{fontSize:'12px'},
    buttonBase:{
        width:'100%',
    }
});




function BucketList(props:PropTypes){
    const {bucketArray} = props;
    const classes = useStyle();
    return(
        <List>
            {bucketArray && bucketArray.map(bucket => (
                <div key={bucket._id} onClick={(e)=>{props.clickHandler(bucket._id)}}>
                    <ButtonBase className={classes.buttonBase}>
                        <ListItem key={bucket._id}>
                            <ListItemIcon>
                                <FolderIcon className={classes.folderIcon} />
                            </ListItemIcon>
                            <ListItemText

                                primary={<Typography className={classes.primaryText}>{bucket.name}</Typography>}
                                secondary={<Typography className={classes.secondaryText}>{new Date(bucket.createdAt).toISOString().split('T')[0]}</Typography>}
                            />
                        </ListItem>
                    </ButtonBase>
                 <Divider variant="inset" component="li" />
                 </div> 
            ))} 

        </List>
    );
}

export default BucketList;