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
} from '@material-ui/core';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useDropzone } from 'react-dropzone';
import { experimentalStyled } from '@material-ui/core/styles';
import CloudUploadTwoToneIcon from '@material-ui/icons/CloudUploadTwoTone';
import CloseTwoToneIcon from '@material-ui/icons/CloseTwoTone';
// import ReactQuill from "react-quill";
import dynamic from 'next/dynamic';
import { useState } from 'react';
import DatePicker from '@material-ui/lab/DatePicker';
import Checkbox from '@material-ui/core/Checkbox';

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

const DENIED_CHECKBOX_COLOR = 'rgb(244, 67, 54)';

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

export default function StepThree({
  errors,
  handleBlur,
  handleChange,
  isSubmitting,
  touched,
  values,
  isClickErrors,
  toggleCheckBoxComment,
  Data,
  formValues,
  handleFormsValueChange,
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
            <b>??????????:</b>
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
            className={classes.textFieldReadOnly}
            disabled
            error={Boolean(touched.budget && errors.budget)}
            helperText={touched.budget && errors.budget}
            name='budget'
            type='number'
            placeholder={'??????????'}
            onBlur={handleBlur}
            onChange={handleChange}
            value={Data.BudgetOnDemand}
            variant='outlined'
          />
          <Checkbox
            style={{ color: DENIED_CHECKBOX_COLOR }}
            checked={isClickErrors.budget}
            onClick={() => toggleCheckBoxComment('budget')}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </Grid>

        {isClickErrors.budget && (
          <>
            <Grid
              item
              xs={12}
              sm={4}
              md={3}
              justifyContent='flex-end'
              textAlign={{ sm: 'right' }}>
              <Box
                pr={3}
                sx={{ pt: 3, pb: { xs: 1, md: 0 } }}
                alignSelf='center'>
                <b>????????:</b>
              </Box>
            </Grid>
            <Grid
              sx={{
                mb: 3,
              }}
              item
              xs={12}
              sm={8}
              md={9}>
              <TextField
                className={classes.textFieldReadOnly}
                style={{ width: '25rem' }}
                onChange={(e) =>
                  handleFormsValueChange('budget_deniedNote', e.target.value)
                }
                value={formValues.budget_deniedNote}
                variant='outlined'
              />
            </Grid>
          </>
        )}

        <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
          <Box pr={3} sx={{ pb: { xs: 1, md: 0 } }}>
            <b>??????????:</b>
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
            className={classes.textFieldReadOnly}
            disabled
            error={Boolean(touched.commandOfBudget && errors.commandOfBudget)}
            helperText={touched.commandOfBudget && errors.commandOfBudget}
            name='commandOfBudget'
            placeholder={'??????????'}
            onBlur={handleBlur}
            onChange={handleChange}
            value={Data.BudgetReasonNotes}
            variant='outlined'
          />
          <Checkbox
            style={{ color: DENIED_CHECKBOX_COLOR }}
            checked={isClickErrors.commandOfBudget}
            onClick={() => toggleCheckBoxComment('commandOfBudget')}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </Grid>

        {isClickErrors.commandOfBudget && (
          <>
            <Grid
              item
              xs={12}
              sm={4}
              md={3}
              justifyContent='flex-end'
              textAlign={{ sm: 'right' }}>
              <Box
                pr={3}
                sx={{ pt: 3, pb: { xs: 1, md: 0 } }}
                alignSelf='center'>
                <b>????????:</b>
              </Box>
            </Grid>
            <Grid
              sx={{
                mb: 3,
              }}
              item
              xs={12}
              sm={8}
              md={9}>
              <TextField
                className={classes.textFieldReadOnly}
                style={{ width: '25rem' }}
                onChange={(e) =>
                  handleFormsValueChange(
                    'commandOfBudget_deniedNote',
                    e.target.value
                  )
                }
                value={formValues.commandOfBudget_deniedNote}
                variant='outlined'
              />
            </Grid>
          </>
        )}

        <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
          <Box pr={3} sx={{ pb: { xs: 1, md: 0 } }}>
            <b>???????? ?????????? ???????????? ???????? ???????????? ?????????? ???????? ??????????????:</b>
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
          <BoxUploadWrapper {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragAccept && (
              <>
                <AvatarSuccess variant='rounded'>
                  <CheckTwoToneIcon />
                </AvatarSuccess>
                <Typography sx={{ mt: 2 }}>
                  {'???? ?????????? ???????? xlsx/csv'}
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

          <Checkbox
            style={{ color: DENIED_CHECKBOX_COLOR }}
            checked={isClickErrors.file}
            onClick={() => toggleCheckBoxComment('file')}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </Grid>
        {isClickErrors.file && (
          <>
            <Grid
              item
              xs={12}
              sm={4}
              md={3}
              justifyContent='flex-end'
              textAlign={{ sm: 'right' }}>
              <Box
                pr={3}
                sx={{ pt: 3, pb: { xs: 1, md: 0 } }}
                alignSelf='center'>
                <b>????????:</b>
              </Box>
            </Grid>
            <Grid
              sx={{
                mb: 3,
              }}
              item
              xs={12}
              sm={8}
              md={9}>
              <TextField
                className={classes.textFieldReadOnly}
                style={{ width: '25rem' }}
                onChange={(e) =>
                  handleFormsValueChange('file_deniedNote', e.target.value)
                }
                value={formValues.file_deniedNote}
                variant='outlined'
              />
            </Grid>
          </>
        )}

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
            <b>?????????? ???? ??????????????:</b>
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
          {/* <DatePicker
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
            renderInput={(params) => (
              <TextField
                className={classes.textFieldReadOnly}
                fullWidth
                placeholder={'?????????? ???? ??????????????'}
                {...params}
              />
            )}
          /> */}
          <Checkbox
            style={{ color: DENIED_CHECKBOX_COLOR }}
            checked={isClickErrors.limiteProject}
            onClick={() => toggleCheckBoxComment('limiteProject')}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </Grid>
        {isClickErrors.limiteProject && (
          <>
            <Grid
              item
              xs={12}
              sm={4}
              md={3}
              justifyContent='flex-end'
              textAlign={{ sm: 'right' }}>
              <Box
                pr={3}
                sx={{ pt: 3, pb: { xs: 1, md: 0 } }}
                alignSelf='center'>
                <b>????????:</b>
              </Box>
            </Grid>
            <Grid
              sx={{
                mb: 3,
              }}
              item
              xs={12}
              sm={8}
              md={9}>
              <TextField
                className={classes.textFieldReadOnly}
                style={{ width: '25rem' }}
                onChange={(e) =>
                  handleFormsValueChange(
                    'limitProject_deniedNote',
                    e.target.value
                  )
                }
                value={formValues.limitProject_deniedNote}
                variant='outlined'
              />
            </Grid>
          </>
        )}

        <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
          <Box pr={3} sx={{ pb: { xs: 1, md: 0 } }}>
            <b>{'?????????? ????????????:'}</b>
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
            rows={4}
            multiline
            className={classes.textFieldReadOnly}
            style={{ width: '25rem' }}
            onChange={(e) =>
              handleFormsValueChange('general_deniedNote', e.target.value)
            }
            value={formValues.general_deniedNote}
            variant='outlined'
          />
        </Grid>
      </Grid>
      <br />
    </>
  );
}
