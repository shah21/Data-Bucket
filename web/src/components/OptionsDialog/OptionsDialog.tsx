import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import {
  makeStyles,
} from "@material-ui/core/styles";
import { List } from '@material-ui/core';

type Proptypes = {
  open:boolean,
  handleClose:()=>void,
  listElements:React.ReactNode,
}

const useStyle = makeStyles({
  listItem:{
    width:250,
  },
});

export default function OptionsDialog(props: Proptypes) {

  const classes = useStyle();
  const ListElements = props.listElements;

  return (
    <div className="optionsDialog">

      <Dialog onClose={props.handleClose} aria-labelledby="simple-dialog-title" open={props.open}>
        <List component="nav" aria-label="main mailbox folders">
          {ListElements}
        </List>
      </Dialog>
    </div>
  );
}