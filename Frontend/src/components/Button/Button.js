import React from 'react'
import {Link} from "react-router-dom";

function Button(props) {
    return (
      <Link to={props.link}>
        <button
          className={props.class}
          onClick={props.onClick}
          type={props.type} 
        >
          {props.label}
        </button>
      </Link>
    );
}   

export default Button
