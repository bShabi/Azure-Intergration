import React, { useEffect } from 'react';
import { Field, ErrorMessage } from 'formik';
import { TextField, Autocomplete } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));

function SelectFormik(props) {
  const { name, options, value } = props;
  console.log(
    '🚀 ~ file: SelectFormik.js ~  ~ SelectFormikBudget ~ props',
    props
  );

  const classes = useStyles();

  // useEffect(() => {
  //   console.log('after changed ', value);
  // }, [value]);

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
              // onChange={() => (value.ProjectNameinCloud = option.optionValue)}
              key={
                option.optionValue
                  ? option.optionValue
                  : Math.floor(Math.random() * 10000).toString()
              }
              value={option.optionValue ? option.optionValue : 'err'}>
              {option.optionValue}
            </MenuItem>
          );
        })}
    </Field>
  );
}

export default SelectFormik;
