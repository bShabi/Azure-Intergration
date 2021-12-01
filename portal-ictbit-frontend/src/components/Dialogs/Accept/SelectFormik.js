import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { TextField, Autocomplete } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 350,
  },
}));

function SelectFormik(props) {
  const { name, options, value } = props;

  const classes = useStyles();

  return (
    <Field
      as={Select}
      id={name}
      name={name}
      className={classes.root}
      value={value ? value : ''}>
      {Array.isArray(options) &&
        options.length > 0 &&
        options.map((option) => {
          return (
            <MenuItem
              key={
                option.optionValue
                  ? option.optionValue
                  : Math.floor(Math.random() * 10000).toString()
              }
              value={option.id ? option.id : ''}>
              {option.optionValue}
            </MenuItem>
          );
        })}
    </Field>
  );
}

export default SelectFormik;
