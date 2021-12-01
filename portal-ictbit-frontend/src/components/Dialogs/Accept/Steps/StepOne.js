import { makeStyles } from '@material-ui/styles';
import {
  DialogContent,
  CircularProgress,
  TextField,
  Box,
  Button,
  Divider,
  Paper,
  Grid,
  Avatar,
  Autocomplete,
  Container,
} from '@material-ui/core';
import * as Yup from 'yup';
import { Formik, Field } from 'formik';
import { useDropzone } from 'react-dropzone';
import { experimentalStyled } from '@material-ui/core/styles';

// import ReactQuill from "react-quill";
import dynamic from 'next/dynamic';
import { useState } from 'react';

const BoxUploadWrapper = experimentalStyled(Box)(
  ({ theme }) => `
    border-radius: ${theme.general.borderRadius};
    padding: ${theme.spacing(3)};
    background: ${theme.colors.alpha.black[5]};
    border: 1px dashed ${theme.colors.alpha.black[30]};
    outline: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: ${theme.transitions.create(['border', 'background'])};

    &:hover {
      background: ${theme.colors.alpha.white[100]};
      border-color: ${theme.colors.primary.main};
    }
`
);
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: 20,
    textAlign: 'center',
    color: 'red',
  },
  textFieldReadOnly: {
    width: 350,
  },
}));

export default function StepOne({
  errors,
  handleBlur,
  handleChange,
  isSubmitting,
  touched,
  values,
  Data,
}) {
  const classes = useStyles();

  return (
    <>
      {/* <StepOne /> */}
      <div style={{ textAlign: 'right', fontSize: 20, paddingBottom: 25 }}>
        <b style={{ color: '#4457da' }}>פרטים אישיים</b>
        <br></br>
      </div>

      <Grid container spacing={2}>
        <Container>
          <Grid
            sx={{
              mb: `12px`,
            }}
            item
            xs={12}
            sm={12}
            md={12}>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              justifyContent='flex-end'
              textAlign={{ sm: 'right' }}>
              <Box>
                <strong style={{ fontSize: 16 }}>שם מלא:</strong>
              </Box>
            </Grid>

            <TextField
              disabled
              className={classes.textFieldReadOnly}
              error={Boolean(touched.fullname && errors.fullname)}
              helperText={touched.fullname && errors.fullname}
              name='fullname'
              placeholder={'שם מלא'}
              onBlur={handleBlur}
              onChange={handleChange}
              value={Data.fullname}
              variant='outlined'
              onClick={(e) => {
                console.log(
                  '🚀 ~ file: Request.js ~ line 346 ~ e',
                  e.target.value
                );
                console.log(
                  '🚀 ~ file: Request.js ~ line 346 ~ values.fullname',
                  values.fullname
                );
                console.log(
                  '🚀 ~ file: Request.js ~ line 346 ~ values.fullname',
                  values
                );
              }}
            />
          </Grid>

          <Grid
            sx={{
              mb: `12px`,
            }}
            item
            xs={12}
            sm={12}
            md={12}>
            <Grid item xs={12} sm={12} md={12} textAlign={{ sm: 'right' }}>
              <Box>
                <b>מספר טלפון:</b>
              </Box>
            </Grid>
            <TextField
              disabled
              className={classes.textFieldReadOnly}
              error={Boolean(touched.phone && errors.phone)}
              helperText={touched.phone && errors.phone}
              name='phone'
              placeholder={'05-'}
              onBlur={handleBlur}
              onChange={handleChange}
              value={Data.phone}
              variant='outlined'
            />
          </Grid>

          <Grid
            sx={{
              mb: `12px`,
            }}
            item
            xs={12}
            sm={12}
            md={12}>
            <Grid item xs={12} sm={1} md={12} textAlign={{ sm: 'right' }}>
              <Box>
                <strong style={{ fontSize: 16 }}>איימיל :</strong>
              </Box>
            </Grid>
            <TextField
              disabled
              error={Boolean(touched.emailToSend && errors.emailToSend)}
              className={classes.textFieldReadOnly}
              helperText={touched.emailToSend && errors.emailToSend}
              name='emailToSend'
              placeholder={'כתובת אימייל'}
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.emailToSend}
              variant='outlined'
            />
          </Grid>
          <Grid
            sx={{
              mb: `12px`,
            }}
            item
            xs={12}
            sm={12}
            md={12}>
            <Grid>
              <Box>
                <strong style={{ fontSize: 16 }}>שם הפרויקט:</strong>
              </Box>
            </Grid>
            <TextField
              disabled
              className={classes.textFieldReadOnly}
              error={Boolean(touched.cloud_name && errors.cloud_name)}
              helperText={touched.cloud_name && errors.cloud_name}
              name='cloud_name'
              placeholder={'שם הפרוייקט'}
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.cloud_name}
              variant='outlined'
            />
          </Grid>

          <Grid
            sx={{
              mb: `12px`,
            }}
            item
            xs={12}
            sm={12}
            md={12}>
            <Grid>
              <Box>
                <strong style={{ fontSize: 16 }}>תיאור קצר על הפרויקט:</strong>
              </Box>
            </Grid>
            <TextField
              disabled
              multiline
              rows={2}
              error={Boolean(touched.summaryProject && errors.summaryProject)}
              className={classes.textFieldReadOnly}
              helperText={touched.summaryProject && errors.summaryProject}
              name='summaryProject'
              placeholder={'תיאור הפרויקט'}
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.summaryProject}
              variant='outlined'
            />
          </Grid>
        </Container>
      </Grid>
      <Divider />
    </>
  );
}
