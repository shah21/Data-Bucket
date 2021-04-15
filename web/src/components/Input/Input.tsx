import React from 'react'



function Input(props:any) {

    const textInput = React.createRef<HTMLInputElement>();

    const focusFunc = (e:any)=>{
        let parent = e.target.parentNode.parentNode;
        parent.classList.add('focus');
    }

    const focusBlur = (e:any)=>{
        let parent = e.target.parentNode.parentNode;
        if(e.target.value === ""){
            parent.classList.remove('focus');
        }
    }

    

    return (
      <div className="inputContainer">
      <div className={`input-div ${props.class}`}>
        <div className="i">{props.component}</div>
        <div>
          <h5 style={{fontFamily: 'Poppins,sans-serif'}} >{props.label}</h5>

          <input
            style={{fontFamily: 'Poppins,sans-serif'}}
            className="input"
            ref={textInput}
            type={props.type}
            required={props.required}
            name={props.name}
            onChange={props.onChange}
            onFocus={(e) => {
              focusFunc(e);
            }}
            onBlur={(e) => {
              focusBlur(e);
            }}
          />

         
        </div>
      </div>
      <p className="error-text">{props.error}</p>
      </div>
    );
}

export default Input
