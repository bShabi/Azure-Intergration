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
} from '@material-ui/core';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useDropzone } from 'react-dropzone';
import { experimentalStyled } from '@material-ui/core/styles';

// import ReactQuill from "react-quill";
import dynamic from 'next/dynamic';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: 20,
    textAlign: 'center',
    color: 'red',
  },
}));

export default function StepOne({
  errors,
  handleBlur,
  handleChange,
  isSubmitting,
  touched,
  values,
}) {
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const {
    acceptedFiles,
    isDragActive,
    isDragAccept,
    isDragReject,
    getRootProps,
    getInputProps,
  } = useDropzone({
    accept: 'image/jpeg, image/png',
  });
  const files = acceptedFiles.map((file, index) => (
    <ListItem disableGutters component='div' key={index}>
      <ListItemText primary={file.name} />
      <b>{file.size} bytes</b>
      <Divider />
    </ListItem>
  ));
  return (
    <>
      {/* <StepOne /> */}

      <Grid container spacing={0}>
        <Grid
          sx={{
            mb: `12px`,
          }}
          item
          xs={12}
          sm={8}
          md={9}>
          <Grid>
            <Box>
              <b>שם מלא:</b>
            </Box>
          </Grid>
          <TextField
            error={Boolean(touched.fullname && errors.fullname)}
            fullWidth
            helperText={touched.fullname && errors.fullname}
            name='fullname'
            placeholder={'שם מלא'}
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.fullname}
            variant='outlined'
          />
        </Grid>

        <Grid
          sx={{
            mb: `12px`,
          }}
          item
          xs={12}
          sm={8}
          md={9}>
          <Grid>
            <Box>
              <b>מספר טלפון:</b>
            </Box>
          </Grid>
          <TextField
            error={Boolean(touched.phone && errors.phone)}
            fullWidth
            helperText={touched.phone && errors.phone}
            name='phone'
            placeholder={'05-'}
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.phone}
            variant='outlined'
          />
          {/* <EditorWrapper>
                                            <ReactQuill />
                                        </EditorWrapper> */}

          <Grid
            sx={{
              mb: `12px`,
            }}
            item
            xs={12}
            sm={8}
            md={9}></Grid>
          <Grid>
            <Box>
              <b>שם ותיאור קצר על הפרויקט :</b>
            </Box>
          </Grid>
          <TextField
            error={Boolean(touched.title && errors.title)}
            fullWidth
            helperText={touched.title && errors.title}
            name='title'
            placeholder={'Project title here...'}
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.title}
            variant='outlined'
          />
        </Grid>
      </Grid>
      <Divider />

      <div style={{ textAlign: 'center' }}>
        <p>מוביל כללי</p>
      </div>

      <Grid container spacing={0}>
        <Grid
          item
          xs={12}
          sm={4}
          md={3}
          justifyContent='flex-end'
          textAlign={{ sm: 'right' }}>
          <Box
            pr={3}
            sx={{ pt: `12px`, pb: { xs: 1, md: 0 } }}
            alignSelf='center'>
            <b>שם מלא:</b>
          </Box>
        </Grid>
        <Grid
          sx={{
            mb: `12px`,
          }}
          item
          xs={12}
          sm={8}
          md={9}>
          <TextField
            error={Boolean(touched.ccfoFullName && errors.ccfoFullName)}
            fullWidth
            helperText={touched.ccfoFullName && errors.ccfoFullName}
            name='ccfoFullName'
            placeholder={'Project title here...'}
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.ccfoFullName}
            variant='outlined'
          />
        </Grid>

        <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
          <Box pr={3} sx={{ pb: { xs: 1, md: 0 } }}>
            <b>מספר טלפון:</b>
          </Box>
        </Grid>

        <Grid
          sx={{
            mb: `12px`,
          }}
          item
          xs={12}
          sm={8}
          md={9}>
          <TextField
            error={Boolean(touched.ccfoPhone && errors.ccfoPhone)}
            fullWidth
            helperText={touched.ccfoPhone && errors.ccfoPhone}
            name='phone'
            placeholder={'05-'}
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.ccfoPhone}
            variant='outlined'
          />
          {/* <EditorWrapper>
                                            <ReactQuill />
                                        </EditorWrapper> */}
        </Grid>
        <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
          <Box pr={3} sx={{ pb: { xs: 1, md: 0 } }}>
            <b>איימיל :</b>
          </Box>
        </Grid>

        <Grid
          sx={{
            mb: `12px`,
          }}
          item
          xs={12}
          sm={8}
          md={9}>
          <TextField
            error={Boolean(touched.ccfoEmail && errors.ccfoEmail)}
            fullWidth
            helperText={touched.ccfoEmail && errors.ccfoEmail}
            name='ccfoEmail'
            placeholder={'Project title here...'}
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.ccfoEmail}
            variant='outlined'
          />
          {/* <EditorWrapper>
                                            <ReactQuill />
                                        </EditorWrapper> */}
        </Grid>
      </Grid>
    </>
  );
}
