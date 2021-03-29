import React, { useMemo } from 'react';
import Dialog from '@material-ui/core/Dialog';
import {
  makeStyles,
} from "@material-ui/core/styles";
import { CircularProgress, createStyles, DialogContent, DialogTitle, LinearProgress, Theme, Typography, withStyles } from '@material-ui/core';

import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';

type Proptypes = {
  open:boolean,
  handleClose:()=>void,
  progress:number,
  fileName:string,
}

const useStyle = makeStyles({
    dialogTitle:{
        padding:'15px 25px 10px',
        fontFamily:'Poppins,sans-serif',
        fontWeight:'bold',
    },
    root: {
        width: '300px',
        paddingBottom:'15px',
      },
      imageSection:{
        position:'relative',
        height:'40px',
    },
    file:{
        fontSize:'40px',
        color:'#6C6C6C',
    },
    download_file:{
        background:'#f2f2f2',
        alignItems:'center',
        borderRadius:'5px',
        position:'relative',
        padding:'5px 0',
        display:'flex',
        marginBottom:'10px',
    },

    sideText:{
        display:'flex',
        flexDirection:'column',
    },
    typeText:{
        fontFamily:'sans-serif',
        fontSize:'14px',
    } ,
    progressValue:{
        textAlign:'right',
        padding:'10px 0 0',
        fontWeight:'bold',
    },
    savingProgress:{
        width:'200px',
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
    }
});

const BorderLinearProgress = withStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 10,
      borderRadius: 5,
    },
    colorPrimary: {
      backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
      borderRadius: 5,
      backgroundColor: '#32be8f',
    },
  }),
)(LinearProgress);

export default function UploadDialog(props: Proptypes) {

  const classes = useStyle();

  return (
    <div className="optionsDialog">
      <Dialog aria-labelledby="simple-dialog-title" open={props.open}>
        {/* <DialogTitle> */}
            <Typography className={classes.dialogTitle}>
                Uploading File
            </Typography>
            
        {/* </DialogTitle> */}

        <DialogContent>
    
            <div className={classes.root}>
                      <div className={classes.download_file}>
                          <div className={classes.imageSection}>
                              <InsertDriveFileIcon className={classes.file} />
                          </div>
                          <div className={classes.sideText}>
                              <Typography variant="body2" className={classes.typeText} component="p">
                                  {/* {` ${getType(data.file_path)} file`} */}
                                  {props.fileName} 
                              </Typography>
                          </div>
                      </div>
                <BorderLinearProgress variant="determinate" value={props.progress} />
                <div className={classes.progressValue}>
                    {props.progress} %
                </div>
            </div>

        </DialogContent>
      </Dialog>
    </div>
  );
}