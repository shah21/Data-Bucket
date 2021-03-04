import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import {
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

export default function OptionsDialog(props:Proptypes) {
  

// const defaultTheme = createMuiTheme();
// const theme = createMuiTheme({
//   overrides:{
//     MuiButton:{
//       label:{
//         color:'#32be8f',
//         fontWeight:600,
//       }
//     }
//   }
// });

// const themeTextField = createMuiTheme({
//   overrides: {
//     MuiInput: {
//       underline: {
//         '&:before': { //underline color when textfield is inactive
//           borderBottom: `1px solid #32be8f`,
//         },
//         '&:hover:not($disabled):before': { //underline color when hovered 
//           borderBottom: `2px solid #32be8f`,
//         },
//         '&:after': { //underline color when textfield is inactive
//           borderBottom: `1px solid #32be8f`,
//         },
//       },
//     },
//     MuiFormLabel: {
//       root: {
//         "&$focused": {
//           color: "#333",
//           fontWeight:500,
//         }
//       }, 
      
//       focused: {}
//     }
//   }
// });

  return (
    <div className="optionsDialog">
      
      <Dialog onClose={props.handleClose} aria-labelledby="simple-dialog-title" open={props.open}>
      <List component="nav" aria-label="main mailbox folders">
        <ListItem onClick={(e)=>{props.handleOptions('favorite',props.id)}} button>
          <ListItemIcon>
            <FavoriteIcon />
          </ListItemIcon>
          <ListItemText primary="Favorite" />
        </ListItem>
        <ListItem onClick={(e)=>{props.handleOptions('delete',props.id)}} button>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </ListItem>
      </List>
      </Dialog>
    </div>
  );
}