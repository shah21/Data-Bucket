import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Item extends Component {

    constructor(props){
        super(props);
        this.path = props.path;
        this.text = props.text;
    }

    render() {
        return (
            <Link to={this.path}>
                <li className="nav-item">
                  <span className="nav-link">
                    {this.text}
                  </span>
                </li>
            </Link>
        )
    }
}
