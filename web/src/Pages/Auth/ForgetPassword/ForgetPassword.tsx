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
        fontFamily:'Poppins,sans-serif',
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
        fontFamily:'Poppins,sans-serif',
    },
    buttonSend:{
        fontFamily:'Poppins,sans-serif',
        width:'300px',
        backgroundColor: "#32be8f",
        textTransform:'capitalize',
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

    const [errorText,setErrorText] = useState<string>(undefined!);

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const value = e.target.value;
        if(value.length < 1){
            setErrorText('Field must not be empty!');
        }else{
            setErrorText(null!);
        }
        setEmail(value);
    }

    const handleSubmit = () =>{
        if (!email) {
            return;
        }
        if (typeof email !== "undefined") {
            let lastAtPos = email.lastIndexOf('@');
            let lastDotPos = email.lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && email.indexOf('@@') === -1 && lastDotPos > 2 && (email.length - lastDotPos) > 2)) {
                setErrorText('Please enter valid email address!');
                return;
            }
        }
        sentMail(email).then(result=>{
            if(result){
                setFlash({message:'Email sent successfully.Check your mail box',type:'success'});   
            }
        }).catch(err=>{
            setFlash({message:err.message,type:'error'});
        });
    }

    return (
        <div className={classes.forgetPage}>
             <Card raised={true} className={classes.container}>
                <h3 className={classes.forgetHeading}>Forget Password</h3>
                <div className={classes.inputArea}>
                <TextField
                    type="email"
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

                    label='Email Address'
                    variant="outlined"
                    onChange={handleChange}
                />
                <p className="error-text">{errorText}</p>
                </div>
                <Button onClick={handleSubmit}  className={classes.buttonSend} variant="contained"  color="primary" component="span">
                    Sent reset email
                </Button>
            </Card>
        </div>
    )
}

export default ForgetPassword;
