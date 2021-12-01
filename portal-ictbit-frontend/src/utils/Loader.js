import React from 'react';
import { Spinner } from 'react-bootstrap';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: 20,
    },
  },
}));
export default function CircularIndeterminate() {
  const classes = useStyles();

  return (
    <CircularProgress />

    // <Spinner
    //   animation='border'
    //   role='status'
    //   style={{
    //     width: '100px',
    //     height: '100px',
    //     margin: 'auto',
    //     // display: 'block',
    //   }}>
    //   <span className='sr-only'>Loading...</span>
    // </Spinner>
  );
}
