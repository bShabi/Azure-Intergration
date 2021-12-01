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
  textField: {
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
      <div style={{ textAlign: 'right', fontSize: 20, paddingBottom: 25 }}>
        <b style={{ color: '#4457da' }}>פרטים אישיים</b>
        <br></br>
      </div>
      <Grid container spacing={2}>
        <Container maxWidt={'small'}>
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
              error={Boolean(touched.fullname && errors.fullname)}
              helperText={touched.fullname && errors.fullname}
              className={classes.textField}
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
            sm={12}
            md={12}>
            <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
              <Box>
                <strong style={{ fontSize: 16 }}>מספר טלפון:</strong>
              </Box>
            </Grid>
            <TextField
              error={Boolean(touched.phone && errors.phone)}
              className={classes.textField}
              helperText={touched.phone && errors.phone}
              name='phone'
              placeholder={'05-'}
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.phone}
              variant='outlined'
            />
          </Grid>
          {/* testing  */}
          <Grid
            container
            spacing={2}
            sx={{
              mb: `12px`,
            }}
            item
            xs={12}
            sm={12}
            md={12}>
            {/* <Grid
            sx={{
              mb: `12px`,
            }}
            item
            xs={12}
            sm={12}
            md={12}
          ></Grid> */}
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
                  <strong style={{ fontSize: 16 }}>איימיל :</strong>
                </Box>
              </Grid>
              <TextField
                error={Boolean(touched.emailToSend && errors.emailToSend)}
                className={classes.textField}
                helperText={touched.emailToSend && errors.emailToSend}
                name='emailToSend'
                placeholder={'כתובת אימייל'}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.emailToSend}
                variant='outlined'
              />
            </Grid>
          </Grid>
          {/* testing close */}

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
                <strong style={{ fontSize: 16 }}>שם הפרויקט :</strong>
              </Box>
            </Grid>
            <TextField
              error={Boolean(touched.title && errors.title)}
              className={classes.textField}
              helperText={touched.title && errors.title}
              name='title'
              placeholder={'תיאור קצר על הפרויקט'}
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.title}
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
              multiline
              rows={2}
              error={Boolean(touched.summaryProject && errors.summaryProject)}
              className={classes.textField}
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
