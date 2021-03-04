import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import {
  makeStyles,
  createMuiTheme,
  MuiThemeProvider
} from "@material-ui/core/styles";
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import FavoriteIcon from '@material-ui/icons/FavoriteOutlined';

type Proptypes = {
  handleOptions:(type:string,id:string)=>void,
  open:boolean,
  handleClose:()=>void,
  id:string,
}

const useStyle = makeStyles({
  listItem:{
    width:250,
  },
});

export default function OptionsDialog(props:Proptypes) {
  
  const classes = useStyle();



  return (
    <div className="optionsDialog">
      
      <Dialog  onClose={props.handleClose} aria-labelledby="simple-dialog-title" open={props.open}>
      <List component="nav" aria-label="main mailbox folders">
        <ListItem className={classes.listItem} onClick={(e)=>{props.handleOptions('favorite',props.id)}} button>
          <ListItemIcon>
            <FavoriteIcon style={{color:'#32be8f',}} />
          </ListItemIcon>
          <ListItemText primary="Favorite" />
        </ListItem>
        <ListItem className={classes.listItem} onClick={(e)=>{props.handleOptions('delete',props.id)}} button>
          <ListItemIcon>
            <DeleteIcon color="secondary"/>
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </ListItem>
      </List>
      </Dialog>
    </div>
  );
}