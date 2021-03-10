import React, { useContext, useMemo, useState } from 'react'
import {makeStyles, TextField,Button, Card} from "@material-ui/core";
import SendMailCard from './SendMailCard';
import axios from '../../../axios/config';
import endpoints from '../../../axios/endpoints';
import { FlashContext } from '../../../Contexts/FlashContext';

const useStyle = makeStyles({
    forgetPage:{
        width:'100%',
        height:'100vh',
        display:'flex',
        alignItems:'center',
        flexDirection:'column',
        justifyContent:'center',
        columnCount:2,
        backgroundColor:'#32be8f',
        fontFamily: 'Poppins,sans-serif',
    },
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

        "&:hover": {
            backgroundColor: "#32be8f"
          }
    },
});


const sentMail = (email:string) => {
    return new Promise((resolve,reject)=>{
        async function getResponse(){
            try {
                const response = await axios.post(endpoints.sendResetMail,{
                    email:email
                });
                if(response){
                    resolve(true);
                }
            } catch (error) {
                reject(error);
            }
        }
        getResponse();
    });
}

function ForgetPassword() {

    const classes = useStyle();
    const [email, setEmail] = useState<string>(undefined!);

    const {setFlash} = useContext(FlashContext);

    useMemo(() =>{
        if(email){
            console.log(email);
            sentMail(email).then(result=>{
                if(result){
                    //change form
                    
                }
            }).catch(err=>{
                setFlash({message:err.message,type:'error'});
            });
            
        }
    } , [email])

    return (
        <div className={classes.forgetPage}>
            {!email && (<SendMailCard setUserEmail={setEmail}/>)}
            
        </div>
    )
}

export default ForgetPassword;
