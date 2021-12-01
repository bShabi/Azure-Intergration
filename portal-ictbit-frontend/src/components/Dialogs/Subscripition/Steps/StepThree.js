import { makeStyles } from '@material-ui/styles';
import {
  DialogContent,
  Typography,
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
import { Formik } from 'formik';
import { useDropzone } from 'react-dropzone';
import { experimentalStyled } from '@material-ui/core/styles';
import CloudUploadTwoToneIcon from '@material-ui/icons/CloudUploadTwoTone';
import CloseTwoToneIcon from '@material-ui/icons/CloseTwoTone';
// import ReactQuill from "react-quill";
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import DatePicker from '@material-ui/lab/DatePicker';
import SelectFormik from '../SelectFormik';
import requestManagerApi from '../../../../api/request-manager-api';

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

export default function StepThree({
  errors,
  handleBlur,
  handleChange,
  isSubmitting,
  touched,
  values,
}) {
  const classes = useStyles();
  const [value, setValue] = useState('one');
  const [limitCloud, setLimitCloud] = useState();
  const [activeStep, setActiveStep] = useState(1);
  const [budgetOption, setBudgetOption] = useState();

  const setCloudBudgetOption = async () => {
    let budgetOptionCloud_init = [];
    let budgetOptionFromServer = await requestManagerApi.getLimitOfProject();

    budgetOptionFromServer.forEach((element) => {
      budgetOptionCloud_init.push({
        id: element._id,
        optionValue: element.BudgetKindName,
      });
    });
    console.log('budgetOptionCloud_init', budgetOptionCloud_init);

    setBudgetOption(budgetOptionCloud_init);
  };

  const initAllOptions = async () => {
    if (budgetOption == null) {
      await setCloudBudgetOption();
    }
  };
  useEffect(async () => {
    initAllOptions();
  }, []);

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
      <Divider />

      <div
        style={{
          textAlign: 'right',
          fontSize: 20,
          paddingBottom: 35,
          paddingTop: 10,
        }}>
        <b style={{ color: '#4457da' }}> תקציב</b>
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
            <Grid>
              <Box>
                <strong style={{ fontSize: 16 }}> סוג תקציב:</strong>
              </Box>
            </Grid>
            <SelectFormik
              name='budgetOption'
              options={budgetOption}
              value={values.budgetOption}
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
                <strong style={{ fontSize: 16 }}>תקציב</strong>
              </Box>
            </Grid>
            <TextField
              error={Boolean(touched.budget && errors.budget)}
              helperText={touched.budget && errors.budget}
              name='budget'
              type='number'
              className={classes.textField}
              placeholder={'תקציב'}
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.budget}
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
            <Grid>
              <Box>
                <strong style={{ fontSize: 16 }}>פירוט:</strong>
              </Box>
            </Grid>
            <TextField
              multiline
              rows={3}
              error={Boolean(touched.commandOfBudget && errors.commandOfBudget)}
              className={classes.textField}
              helperText={touched.commandOfBudget && errors.commandOfBudget}
              name='commandOfBudget'
              placeholder={'פירוט'}
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.commandOfBudget}
              variant='outlined'
            />
            {/* <EditorWrapper>
                                            <ReactQuill />
                                        </EditorWrapper> */}
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
                <strong style={{ fontSize: 16 }}>
                  קובץ הערכת עלויות מתוך מחשבון ספקית הענן המבוקשת:
                </strong>
              </Box>
            </Grid>
            <Grid
              style={{
                display: 'flex',
              }}>
              <BoxUploadWrapper
                style={{
                  display: 'flex',
                  width: 350,
                }}
                {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragAccept && (
                  <>
                    <AvatarSuccess variant='rounded'>
                      <CheckTwoToneIcon />
                    </AvatarSuccess>
                    <Typography sx={{ mt: 2 }}>
                      {'יש לעלות קובץ xlsx/csv'}
                    </Typography>
                  </>
                )}
                {isDragReject && (
                  <>
                    <AvatarDanger variant='rounded'>
                      <CloseTwoToneIcon />
                    </AvatarDanger>
                    <Typography sx={{ mt: 2 }}>
                      {'You cannot upload these file types'}
                    </Typography>
                  </>
                )}
                {!isDragActive && (
                  <>
                    <AvatarWrapper variant='rounded'>
                      <CloudUploadTwoToneIcon />
                    </AvatarWrapper>
                    <Typography sx={{ mt: 2 }}>
                      {'Drag & drop files here'}
                    </Typography>
                  </>
                )}
              </BoxUploadWrapper>
            </Grid>
            {files.length > 0 && (
              <>
                <Alert sx={{ py: 0, mt: 2 }} severity='success'>
                  {'You have uploaded'} <b>{files.length}</b> {'files'}!
                </Alert>
                <Divider sx={{ mt: 2 }} />
                <List disablePadding component='div'>
                  {files}
                </List>
              </>
            )}
          </Grid>
          {/* <Grid
          sx={{
            mb: `12px`,
          }}
          item
          xs={12}
          sm={6}
          md={6}>
          <Grid>
            <Box>
              <b>אורכו של הפרויקט:</b>
            </Box>
          </Grid> */}
          {/* <SelectFormik
            name='limitProject'
            options={limitCloud}
            value={values.limitProject}
          />
         
        </Grid> */}
        </Container>
      </Grid>
    </>
  );
}
