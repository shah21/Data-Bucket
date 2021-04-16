import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import {
  createMuiTheme,
  MuiThemeProvider
} from "@material-ui/core/styles";


import "./FormDialog.css"



export default function FormDialog(props:any) {
  
  const [bucketName,setBucketName] = React.useState<string>();
  const [error,setError] = React.useState<string>();

  const handleSave = () =>{
    if(!bucketName){
      setError('Field cannot be empty');
      return;
    }
    props.getBucketName(bucketName);

  }

  const handleChange = (e:any) =>{
    const name = e.target.value;
    setBucketName(name)
  }

const defaultTheme = createMuiTheme();
const theme = createMuiTheme({
  overrides:{
    MuiButton:{
      label:{
        color:'#32be8f',
        fontWeight:600,
        fontFamily:'Poppins,sans-serif'
      }
    }
  }
});

const themeTextField = createMuiTheme({
  overrides: {
    MuiInput: {
      formControl:{
        fontFamily:'Poppins,sans-serif',
      },  
      underline: {
        '&:before': { //underline color when textfield is inactive
          borderBottom: `1px solid #32be8f`,
        },
        '&:hover:not($disabled):before': { //underline color when hovered 
          borderBottom: `2px solid #32be8f`,
        },
        '&:after': { //underline color when textfield is inactive
          borderBottom: `1px solid #32be8f`,
        },
      },
    },
    MuiFormLabel: {
      root: {
        fontFamily:'Poppins,sans-serif',
        "&$focused": {
          color: "#333",
          fontWeight:500,
        }
      }, 
      
      focused: {}
    }
  }
});

  return (
    <div className="formDialog">
      <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title" style={{fontFamily:'Poppins,sans-serif'}} >New Bucket</DialogTitle>
        <DialogContent dividers={true}>
          <MuiThemeProvider theme={themeTextField}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              onChange={handleChange}
              label="Bucket name"
              type="email"
              fullWidth
            />
          </MuiThemeProvider>
          <span className="error-text">{error}</span>
        </DialogContent>
        <DialogActions>
        <MuiThemeProvider theme={defaultTheme}>
          
            <Button onClick={props.handleClose} className="btn-cancel" color="inherit">
              Cancel
            </Button>

          
          <MuiThemeProvider theme={theme}>
            <Button onClick={handleSave} className="btn-add" >
              Save
            </Button>
          </MuiThemeProvider>  
        </MuiThemeProvider>
          
        </DialogActions>
      </Dialog>
    </div>
  );
}