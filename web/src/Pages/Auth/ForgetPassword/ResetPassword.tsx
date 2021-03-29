import React, { useState,useReducer, useEffect, useContext } from 'react'
import {makeStyles, TextField,Button, Card} from "@material-ui/core";
import Input from '../../../components/Forms/Input'; 
import { useHistory, useLocation, useParams } from 'react-router';
import axiosInstance from '../../../axios/config';
import endpoints from '../../../axios/endpoints';
import { FlashContext } from '../../../Contexts/FlashContext';

const useStyle = makeStyles({
    resetPage:{
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
        marginBottom:'10px',
    },
    buttonSend:{
        width:'300px',
        marginTop:'20px',
        backgroundColor: "#32be8f",
        textTransform:'capitalize',
        "&:hover": {
            backgroundColor: "#32be8f"
          }
    },
});

const formReducer = (state:object, event: any) => {
    return {
      ...state,
      ...event
    }
}

const changePassword = async (formData:any,resetToken:string,email:string) => {
    try {
        const body = {email:email,password:formData.password,conf_password:formData.conf_password,token:resetToken}
        const response = await axiosInstance.post(endpoints.resetPassword,body);
        if(response){
            return response;
        }
    } catch (error) {
        throw error;
    }
}



function ResetPassword() {

    const classes = useStyle();
    const [formData, setFormData] = useReducer(formReducer, {});
    const [errors, setErrors] = useState({
        password: '',
        conf_password: ''
    });

    const location = useLocation();
    const history = useHistory();
    const {setFlash} = useContext(FlashContext);

    //get query params
    let search = location.search;
    let params = new URLSearchParams(search);
    let resetToken = params.get('token');
    let email = params.get('email');



    const handleChange = (e:any) =>{
        const value = e.target.value;
        const field = e.target.name;
        
        setFormData({
            [field]:value,
        });

    }

    /* Handle validation of form */
  const handleValidation = () => {
    let formIsValid = true;
    const newErrors = {
      password: '',
      conf_password: ''
    };

    //password
    if (!formData.password) {
      formIsValid = false;
      newErrors['password'] = "Cannot be empty";
    }

    if(formData.password && formData.password.length < 6){
        formIsValid = false;
        newErrors['password'] = "Password must have atleast 6 characters";
    }


    if (!formData.conf_password) {
        formIsValid = false;
        newErrors['conf_password'] = "Cannot be empty";
      }

    //password
    if (formData.password && formData.conf_password) {
        if(formData.password !== formData.conf_password){
            formIsValid = false;
            newErrors["conf_password"] = "Passwords must be same";
        }
    }    


   



    setErrors({
      ...errors,
      ...newErrors,
    });
    return formIsValid;
  }

    const handleSubmit = async () =>{
        if(!handleValidation()){
            return;
        }
        try{
            const response = await changePassword(formData,resetToken!,email!);
            if(response){
                setFlash({message:'Password changed successfully!',type:'success'});
                history.push('/login')
            }
        }catch(err){
            let errResponse = err.response ? err.response.data.message : err.message;
            setFlash({message:errResponse,type:'error'});
        }
    }

    return (
        <div className={classes.resetPage}>
          
            

            <Card raised={true} className={classes.container}>
                <h3 className={classes.forgetHeading}>Reset Password</h3>
                <Input name="password" handleChange={handleChange} errorText={errors.password} label="Password" type="password"/>
                <Input name="conf_password" handleChange={handleChange} errorText={errors.conf_password} label="Confirm Password" type="password"/>
                <Button onClick={handleSubmit}  className={classes.buttonSend} variant="contained"  color="primary" component="span">
                    Sent reset email
                </Button>
            </Card>
        </div>
    )
}

export default ResetPassword;
