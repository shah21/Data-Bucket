import React from 'react'
import {makeStyles, TextField} from "@material-ui/core";



const useStyle = makeStyles({   
    container:{
        width:'400px',
        height:'400px',
        marginTop:'100px',
        display:'flex',
        flexDirection:'column',
        fontFamily: 'Poppins,sans-serif',
        alignItems:'center',
        justifyContent:'center',
    },
    input:{
        width:'300px',
    },
    inputArea:{
        margin:'10px 0',
    },
    cssLabel: {
        color: 'rgb(61, 158, 116) !important'
    },
    notchedOutline: {
        borderWidth: '1px',
        borderColor: 'rgb(61, 158, 116) !important',
        color: 'rgb(61, 158, 116)',
    },
});

interface PropsType{
    handleChange:(e:any)=>void;
    errorText:string,
    type:string,
    label:string,
    name:string,
}

function Input({handleChange,errorText,label,type,name}:PropsType) {

    const classes = useStyle();

    return (
        <div className={classes.inputArea}>
            <TextField
                name={name}
                type={type}
                className={classes.input}
                InputLabelProps={{
                    shrink: true,
                    classes: {
                        root: classes.cssLabel,
                        focused: classes.cssLabel,
                    },
                }}

                InputProps={{
                    classes: {
                        root: classes.notchedOutline,
                        focused: classes.notchedOutline,
                        notchedOutline: classes.notchedOutline,
                    },

                }}

                label={label}
                variant="outlined"
                onChange={(e)=>handleChange(e)}
            />
            <p className="error-text">{errorText}</p>
        </div>
    )
}

export default Input
