import React, { useState } from 'react'
import {makeStyles, TextField,Button, Card} from "@material-ui/core";

const useStyle = makeStyles({
    container:{
        width:'400px',
        height:'400px',
        marginTop:'100px',
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
    },
    input:{
        width:'300px',
    },
    inputArea:{
        margin:'50px 0 30px',
    },
    cssLabel: {
        color: 'rgb(61, 158, 116) !important'
    },
    notchedOutline: {
        borderWidth: '1px',
        borderColor: 'rgb(61, 158, 116) !important',
        color: 'rgb(61, 158, 116)',
    },
    forgetHeading:{
        fontSize:'1.5rem',
    },
    buttonSend:{
        width:'300px',
        backgroundColor: "#32be8f",
        textTransform:'capitalize',
        "&:hover": {
            backgroundColor: "#32be8f"
          }
    },
});

type PropTypes = {
    setUserEmail:any,
}

function SendMailCard({setUserEmail}:PropTypes) {

    const classes = useStyle();
    const [email, setEmail] = useState<string>('');
    const [errorText,setErrorText] = useState<string>(undefined!);

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const value = e.target.value;
        if(value.length < 1){
            setErrorText('Please enter email address');
        }else{
            setErrorText(null!);
        }
        setEmail(value);
    }

    const handleSubmit = () =>{
        if(!email){
            return;
        }
        setUserEmail(email);
    }

    return (
        <div >
          
            

           
        </div>
    )
}

export default SendMailCard;
