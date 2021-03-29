import React from 'react'
import notfound from "../../res/images/not_found.jpg";
import { makeStyles } from "@material-ui/core/styles";
import { withRouter } from 'react-router-dom';


const useStyle = makeStyles({
    img:{
        width:'50%',
        height:'50%',
        marginTop:'100px',
    },
    container:{
        display: 'flex',
        height:'100%',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

function NotFound(props:any) {

    const classes = useStyle();

    return (
        <div className={classes.container}>
            <img className={classes.img} src={notfound} alt=""/>
        </div>
    )
}

export default withRouter(NotFound);
