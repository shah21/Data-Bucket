import {  CircularProgress, createStyles, Fab, makeStyles, Theme } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import React, { useState,MouseEvent, useEffect } from 'react'
import Button from "../Button/Button";
import CheckIcon from '@material-ui/icons/Check';


interface Propstypes{
    clickHandler:()=>void,
    loading:boolean;
    setLoading:any;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    section:{
       
    },
    root: {
     
    },
    wrapper: {
      margin: theme.spacing(1),
      position: 'relative',
    },
    buttonSuccess: {
      backgroundColor: green[500],
      '&:hover': {
        backgroundColor: green[700],
      },
    },
    fabProgress: {
      color: green[500],
      position: 'absolute',
      top: -6,
      left: -6,
      zIndex: 1,
    },
    buttonProgress: {
      color: '#FFF',
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  }),
);


function ProgressButton({clickHandler,loading,setLoading}:Propstypes) {

    const classes = useStyles();

    const handleButtonClick = (e:MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        clickHandler()
    };

    return (
        <div className={classes.section}>
            <div className={classes.root}>
                <div className={classes.wrapper}>

                    <Button
                        class="btn"
                        link="/"
                        disabled={loading}
                        type="submit"
                        label="Login"
                        onClick={(e: any) => {
                            handleButtonClick(e);
                        }}
                    />

                   

                    {loading && (
                        <CircularProgress size={24} thickness={8} className={classes.buttonProgress} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProgressButton
