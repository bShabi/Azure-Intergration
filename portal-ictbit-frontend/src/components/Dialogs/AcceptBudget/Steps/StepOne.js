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

const EditorWrapper = experimentalStyled(Box)(
  ({ theme }) => `

    .ql-editor {
      min-height: 100px;
    }

    .ql-toolbar.ql-snow {
      border-top-left-radius: ${theme.general.borderRadius};
      border-top-right-radius: ${theme.general.borderRadius};
    }

    .ql-toolbar.ql-snow,
    .ql-container.ql-snow {
      border-color: ${theme.colors.alpha.black[30]};
    }

    .ql-container.ql-snow {
      border-bottom-left-radius: ${theme.general.borderRadius};
      border-bottom-right-radius: ${theme.general.borderRadius};
    }

    &:hover {
      .ql-toolbar.ql-snow,
      .ql-container.ql-snow {
        border-color: ${theme.colors.alpha.black[50]};
      }
    }
`
);

const AvatarWrapper = experimentalStyled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.primary.lighter};
    color: ${theme.colors.primary.main};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const AvatarSuccess = experimentalStyled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.success.light};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const AvatarDanger = experimentalStyled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.error.light};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const projectTags = [
  { title: 'Development' },
  { title: 'Design Project' },
  { title: 'Marketing Research' },
  { title: 'Software' },
];
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
  Data,
}) {
  const classes = useStyles();
  const [value, setValue] = useState('one');
  const [activeStep, setActiveStep] = useState(1);

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
            disabled
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
            disabled
            style={{ width: '25rem' }}
            error={Boolean(touched.phone && errors.phone)}
            helperText={touched.phone && errors.phone}
            name='phone'
            placeholder={'05-'}
            onBlur={handleBlur}
            onChange={handleChange}
            value={Data.phone}
            variant='outlined'
          />
          {/* <EditorWrapper>
                                            <ReactQuill />
                                        </EditorWrapper> */}
        </Grid>
        <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
          <Box pr={3} sx={{ pb: { xs: 1, md: 0 } }}>
            <b>שם ותיאור קצר על הפרויקט :</b>
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
            disabled
            style={{ width: '25rem' }}
            error={Boolean(touched.title && errors.title)}
            helperText={touched.title && errors.title}
            name='title'
            placeholder={'תיאור קצר על הפרויקט'}
            onBlur={handleBlur}
            onChange={handleChange}
            value={Data.title}
            variant='outlined'
          />
          {/* <EditorWrapper>
                                            <ReactQuill />
                                        </EditorWrapper> */}
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
            disabled
            style={{ width: '25rem' }}
            error={Boolean(touched.ccfoFullName && errors.ccfoFullName)}
            fullWidth
            helperText={touched.ccfoFullName && errors.ccfoFullName}
            name='ccfoFullName'
            placeholder={'שם מלא'}
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
            disabled
            style={{ width: '25rem' }}
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
            disabled
            style={{ width: '25rem' }}
            error={Boolean(touched.ccfoEmail && errors.ccfoEmail)}
            fullWidth
            helperText={touched.ccfoEmail && errors.ccfoEmail}
            name='ccfoEmail'
            placeholder={'כתובת אימייל'}
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
