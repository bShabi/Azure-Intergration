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
  ListItem,
  ListItemText,
  Alert,
  List,
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
import GeneralConstants from '../../../../constants/budget-constatns';

import Checkbox from '@material-ui/core/Checkbox';

const BoxUploadWrapper = experimentalStyled(Box)(
  ({ theme }) => `
    border-radius: ${theme.general.borderRadius};
    padding: ${theme.spacing(3)};
    background: ${theme.colors.alpha.black[5]};
    border: 1px dashed ${theme.colors.alpha.black[30]};
    outline: none;
    display: flex;
    width: 350;
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
  isUserMode,
  isFieldEnableToEdit,
  isNeedToDisplayCheckBox,
  isCheckBoxChecked,
  isCommentFieldDisplay,
  isDenied,
}) {
  const classes = useStyles();
  const [budgetOption, setBudgetOption] = useState();

  const setCloudBudgetOption = async () => {
    let budgetOptionCloud_init = [];
    let budgetOptionFromServer = await requestManagerApi.getLimitOfProject();

    console.log(
      '🚀 ~ file: StepThree.js ~ line 121 ~ setCloudBudgetOption ~ budgetOptionFromServer',
      budgetOptionFromServer
    );

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
  // const isDenied = Data.requests_status_tbl.RequestsStatusName === 'denied';

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
      <b style={{ textAlign: 'right' }}>{file.size} bytes</b>
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
          paddingTop: 15,
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
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              justifyContent='flex-end'
              textAlign={{ sm: 'right' }}>
              <Box>
                <strong style={{ fontSize: 16 }}>סוג התקציב:</strong>
              </Box>
            </Grid>
            {isFieldEnableToEdit() ? (
              <TextField
                className={classes.textFieldReadOnly}
                disabled={isFieldEnableToEdit()}
                name='providerCloud'
                options={budgetOption}
                // value={Data?.providerCloud?.BudgetOption}
                value={
                  GeneralConstants.requestTblIdToBudgetLindValue[
                    values.budgetOption
                  ]
                }
              />
            ) : (
              <SelectFormik
                // name='providerCloud'
                className={classes.textField}
                name='budgetOption'
                options={budgetOption}
                value={values.budgetOption}
              />
            )}
            <Checkbox
              style={{
                display: isNeedToDisplayCheckBox() ? 'none' : '',
                color: DENIED_CHECKBOX_COLOR,
              }}
              disabled={isUserMode}
              checked={isCheckBoxChecked(
                isClickErrors.limiteProject,
                values.limitProject_deniedNote
              )}
              onClick={() => toggleCheckBoxComment('limiteProject')}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Grid>
          {isCommentFieldDisplay(
            isClickErrors.limiteProject,
            values.limitProject_deniedNote
          ) && (
            <>
              <Grid
                sx={{
                  mb: 3,
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
                  <Grid>
                    <Box>
                      <strong style={{ fontSize: 16 }}>הערת המאשר:</strong>
                    </Box>
                  </Grid>
                </Grid>
                <TextField
                  rows={3}
                  multiline
                  className={classes.textFieldReadOnly}
                  disabled={isUserMode}
                  onChange={handleChange}
                  name='limitProject_deniedNote'
                  value={values.limitProject_deniedNote}
                  variant='outlined'
                />
              </Grid>
            </>
          )}
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
                <strong>תקציב:</strong>
              </Box>
            </Grid>
            <TextField
              className={classes.textFieldReadOnly}
              disabled={!isUserMode || !isDenied}
              error={Boolean(touched.budget && errors.budget)}
              helperText={touched.budget && errors.budget}
              name='budget'
              type='number'
              disabled={isFieldEnableToEdit()}
              placeholder={'תקציב'}
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.budget}
              variant='outlined'
            />
            <Checkbox
              style={{
                display: !isDenied && isUserMode ? 'none' : '',
                color: DENIED_CHECKBOX_COLOR,
              }}
              disabled={isUserMode}
              checked={
                isClickErrors.budget ||
                (isUserMode && !!values.budget_deniedNote)
              }
              onClick={() => toggleCheckBoxComment('budget')}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Grid>
          {isCommentFieldDisplay(
            isClickErrors.budget,
            values.budget_deniedNote
          ) && (
            <>
              <Grid>
                <Grid
                  sx={{
                    mb: 3,
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
                      <strong>הערת המאשר:</strong>
                    </Box>
                  </Grid>
                </Grid>
                <TextField
                  rows={3}
                  multiline
                  className={classes.textFieldReadOnly}
                  disabled={isUserMode}
                  onChange={handleChange}
                  name='budget_deniedNote'
                  value={values.budget_deniedNote}
                  variant='outlined'
                />
              </Grid>
            </>
          )}
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
                <strong style={{ fontSize: 16 }}>פירוט:</strong>
              </Box>
            </Grid>
            <TextField
              multiline
              rows={2}
              className={classes.textFieldReadOnly}
              disabled={!isUserMode || !isDenied}
              error={Boolean(touched.commandOfBudget && errors.commandOfBudget)}
              helperText={touched.commandOfBudget && errors.commandOfBudget}
              name='commandOfBudget'
              placeholder={'פירוט'}
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.commandOfBudget}
              variant='outlined'
            />
            <Checkbox
              style={{
                display: isNeedToDisplayCheckBox() ? 'none' : '',
                color: DENIED_CHECKBOX_COLOR,
              }}
              disabled={isUserMode}
              checked={isCheckBoxChecked(
                isClickErrors.commandOfBudget,
                values.commandOfBudget_deniedNote
              )}
              onClick={() => toggleCheckBoxComment('commandOfBudget')}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Grid>
          {isCommentFieldDisplay(
            isClickErrors.commandOfBudget,
            values.commandOfBudget_deniedNote
          ) && (
            <>
              <Grid>
                <Grid
                  sx={{
                    mb: 3,
                  }}
                  item
                  xs={12}
                  sm={12}
                  md={12}>
                  <Box>
                    <strong style={{ fontSize: 16 }}>הערת המאשר:</strong>
                  </Box>
                </Grid>
                <TextField
                  rows={3}
                  multiline
                  className={classes.textFieldReadOnly}
                  disabled={isUserMode}
                  onChange={handleChange}
                  name='commandOfBudget_deniedNote'
                  value={values.commandOfBudget_deniedNote}
                  variant='outlined'
                />
              </Grid>
            </>
          )}
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

              {files.length > 0 && (
                <>
                  <div dir={'rtl'}>
                    <Alert sx={{ py: 0, mt: 2 }} severity='success'>
                      {'You have uploaded'} <b>{files.length}</b> {'files'}!
                    </Alert>
                    <Divider sx={{ mt: 2 }} />
                    <List disablePadding component='div'>
                      <div dir={'rtl'}> ss {files}</div>
                    </List>
                  </div>
                </>
              )}
              <Checkbox
                style={{
                  display: !isDenied && isUserMode ? 'none' : '',
                  color: DENIED_CHECKBOX_COLOR,
                }}
                disabled={isUserMode}
                checked={
                  isClickErrors.file || (isUserMode && !!values.file_deniedNote)
                }
                onClick={() => toggleCheckBoxComment('file')}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </Grid>
          </Grid>
          {isCommentFieldDisplay(
            isClickErrors.file,
            values.file_deniedNote
          ) && (
            <>
              <Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  justifyContent='flex-end'
                  textAlign={{ sm: 'right' }}>
                  <Box>
                    <strong style={{ fontSize: 16 }}>הערת המאשר:</strong>
                  </Box>
                </Grid>
              </Grid>
              <Grid
                sx={{
                  mb: 3,
                }}
                item
                xs={12}
                sm={12}
                md={12}>
                <TextField
                  rows={3}
                  multiline
                  className={classes.textFieldReadOnly}
                  disabled={isUserMode}
                  onChange={handleChange}
                  name='file_deniedNote'
                  value={values.file_deniedNote}
                  variant='outlined'
                />
              </Grid>
            </>
          )}
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
                <strong style={{ fontSize: 16 }}>{'הערות כלליות:'}</strong>
              </Box>
            </Grid>
            <TextField
              rows={4}
              multiline
              className={classes.textFieldReadOnly}
              disabled={isUserMode}
              onChange={handleChange}
              name='general_deniedNote'
              value={values.general_deniedNote}
              variant='outlined'
            />
          </Grid>
        </Container>
      </Grid>
    </>
  );
}
