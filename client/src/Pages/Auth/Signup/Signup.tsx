import React from "react";
import { withRouter,RouteComponentProps } from "react-router-dom";
import PersonIcon from "@material-ui/icons/Person";
import LockIcon from "@material-ui/icons/Lock";


import "../Login/Login.css";
import "./Signup.css";
import wave from "../../../res/images/wave.png" 
import bg from "../../../res/images/bg.svg";
import avatar from "../../../res/images/avatar.svg";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import axios from "../../../axios/config";
import endpoints from "../../../axios/endpoints";
import {FlashContext} from "../../../Contexts/FlashContext";

//register user
const registerUser = async (credentails:object)=>{

  try {
    const response = await axios.post(endpoints.signup, JSON.stringify(credentails), {
      headers: {
        "Content-Type": "application/json"
      },
    });

    const status: number = response.status;
    return { ...response.data, status: status };
  } catch (err) {
    if (err) {
      return { ...err.response.data, status: err.status };
    }
    return err;
  }

};


const addMessageToSession = (message:string,type:string) =>{
    const obj = {message:message,type:type};
    sessionStorage.setItem('message',JSON.stringify(obj))
}

interface PropsInterface extends RouteComponentProps<any> {}

interface State  {
  errors:{
    email:string,
    password:string,
    confirm_password:string,
  }
  formData:{email:string,password:string,confirm_password:string},
  fields:[string],
  responseError:string,
}


class Signup extends React.Component<PropsInterface,State> {

  static contextType = FlashContext;

  constructor(props:PropsInterface){
    super(props);
    this.state = {
      errors:{ email: '', password: '', confirm_password: '' },
      formData: { email: '', password: '', confirm_password: '' },
      fields:[''],
      responseError:undefined!,
    }
  }

  

  handleChange(event:any){

   

    const fields = this.state.fields;
    const contains = fields.includes(event.target.name);
    if(!contains){
      fields.push(event.target.name as string)
    }
    this.setState({
      fields:fields,
      formData:{
        ...this.state.formData,
        [event.target.name]:event.target.value,
    }});
  }

  async signupHandler(e:Event){

    const {setFlash} = this.context;

    e.preventDefault();
    if (this.handleValidation()) {
      try {
        const response = await registerUser(this.state.formData);
        if (response.status !== 201) {
          const errors = response.errors;
          setFlash({ message: errors.length > 0 ? errors[0].msg : response.message, type: 'error' });
          return;
        }
        addMessageToSession('Account created successfully', 'success');
        this.props.history.push('/login');
      } catch (err) {
        setFlash({ message:'Something went wrong!', type: 'error' });
      }
    }
  }



  handleValidation(){
    let formData = this.state.formData;
    let errors = { email: '', password: '', confirm_password: '' };
    let formIsValid = true;



    //Email
    if(!formData.email){
       formIsValid = false;
       errors['email'] = "Cannot be empty";
    }

    if(typeof formData.email !== "undefined"){
       let lastAtPos = formData.email.lastIndexOf('@');
       let lastDotPos = formData.email.lastIndexOf('.');

       if (!(lastAtPos < lastDotPos && lastAtPos > 0 && formData.email.indexOf('@@') === -1 && lastDotPos > 2 && (formData.email.length - lastDotPos) > 2)) {
          formIsValid = false;
          errors["email"] = "Email is not valid";
        }
    }  


   //password
   if (!formData.password) {
     formIsValid = false;
     errors["password"] = "Cannot be empty";
   }else if (formData.password.length < 6) {
     formIsValid = false;
     errors["password"] = "Password must have atleast 6 characters";
   }

   //confirm password
    if (!formData.confirm_password) {
      formIsValid = false;
      errors['confirm_password'] = "Cannot be empty";
    }else{
      if (formData.password !== formData.confirm_password) {
        formIsValid = false;
        errors["confirm_password"] = "Passwords must be same";
      }
    }


   this.setState({errors: errors});
    
   return formIsValid;
}


render(){

  const errors = this.state.errors;

return (
  <div className="login_page signup_page">
    <img src={wave} className="wave" alt="wave" />
    <div className="container">
      <div className="img">
        <img src={bg} alt="bg" />
      </div>
      <div className="login-container">
        <form>
          <img src={avatar} alt="" className="avatar" />
          <h2>Signup</h2>

          <Input
            error={errors['email'].length > 0 ? errors['email'] : null}
            label="Email"
            type="email"
            name="email"
            required={true}
            class="one"
            onChange={(e:Event)=>{this.handleChange(e)}}
            component={
              <PersonIcon fontSize="small" className="icon"></PersonIcon>
            }
          />

          <Input
            error={errors['password'].length > 0 ? errors['password'] : null}
            label="Password"
            type="password"
            name="password"
             required={true}
            onChange={(e:Event)=>{this.handleChange(e)}}
            class="two"
            component={
              <LockIcon fontSize="small" className="icon"></LockIcon>
            }
          />

        <Input
            error={errors['confirm_password'].length > 0 ? errors['confirm_password'] : null}
            label="Confirm Password"
            type="password"
            name="confirm_password"
             required={true}
            onChange={(e:Event)=>{this.handleChange(e)}}
            class="two"
            component={
              <LockIcon fontSize="small" className="icon"></LockIcon>
            }
          />

         
          <Button
            class="btn"
            link="/"
            type="submit"
            label="Signup"
            onClick={(e:Event) => {
              this.signupHandler(e);
            }}
          />
        </form>
      </div>
    </div>
    <Button class="btn-signup" link="/login" label="Login" />
    
  </div>
);
          
}
}

export default withRouter(Signup);


