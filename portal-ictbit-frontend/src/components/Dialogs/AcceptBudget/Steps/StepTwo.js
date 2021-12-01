import { makeStyles } from '@material-ui/styles';
import {
  DialogContent,
  DialogContentText,
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
import AddTwoToneIcon from '@material-ui/icons/AddTwoTone';
import CloudUploadTwoToneIcon from '@material-ui/icons/CloudUploadTwoTone';
import CloseTwoToneIcon from '@material-ui/icons/CloseTwoTone';
import CheckTwoToneIcon from '@material-ui/icons/CheckTwoTone';
// import ReactQuill from "react-quill";
import dynamic from 'next/dynamic';
import { useContext, useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import DatePicker from '@material-ui/lab/DatePicker';
import SelectFormik from '../SelectFormik';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import AuthContext from '../../../../../context/AuthContext';
import requestManagerApi from '../../../../api/request-manager-api';
import Checkbox from '@material-ui/core/Checkbox';

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
  rootSelect: {
    width: '100%',
    position: 'relative',
    overflow: 'auto',
    maxHeight: 200,
  },
  textFieldReadOnly: {
    width: 350,
  },
}));

export default function StepTwo({
  errors,
  handleBlur,
  handleChange,
  isSubmitting,
  touched,
  values,
  formValues,
  setValues,
  isClickErrors,
  toggleCheckBoxComment,
  Data,
  handleFormsValueChange,
}) {
  const classes = useStyles();
  const [value, setValue] = useState('one');
  const [activeStep, setActiveStep] = useState(1);
  const [providerCloud, setProviderCloud] = useState();
  const [cloudPremission, setCloudPremission] = useState();
  const [providerEnvirment, setProviderEnvirment] = useState();
  const [schedulingCloud, setSchedulingCloud] = useState();

  const {
    permissionOnCloud_init,
    environmentCloud_init,
    schedulingCloud_init,
    providerCloud_init,
  } = useContext(AuthContext);

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

  //#region init option
  const setCloudPremissionOption = async () => {
    let cloudPremission_init = [];
    let cloudPremissionFromServer =
      await requestManagerApi.getCloudPremission();

    cloudPremissionFromServer.forEach((element) => {
      cloudPremission_init.push({
        id: element._id,
        optionValue: element.CloudPermissionName,
      });
    });

    setCloudPremission(cloudPremission_init);
  };

  const setCloudProivderOption = async () => {
    let cloudProivder_init = [];
    let cloudProivderFromServer = await requestManagerApi.getCloudProivder();

    cloudProivderFromServer.forEach((element) => {
      cloudProivder_init.push({
        id: element._id,
        optionValue: element.Cloud,
      });
    });
    setProviderCloud(cloudProivder_init);
  };

  const setCloudEnvirmentOption = async () => {
    let cloudEnvirment_init = [];
    let environmentCloudFromServer =
      await requestManagerApi.getCloudEnvirment();

    environmentCloudFromServer.forEach((element) => {
      cloudEnvirment_init.push({
        id: element._id,
        optionValue: element.CloudEnvironmentAreaName,
      });
      setProviderEnvirment(cloudEnvirment_init);
    });
  };

  const setCloudSchedulingOption = async () => {
    let schedulingCloud_init = [];
    let cloudSchedulingFromServer =
      await requestManagerApi.getCloudScheduling();

    cloudSchedulingFromServer.forEach((element) => {
      schedulingCloud_init.push({
        id: element._id,
        optionValue: element.SchedulingOption,
      });
    });
    console.log(
      '🚀 ~ file: StepTwo.js ~ line 180 ~ setCloudSchedulingOption ~ schedulingCloud_init',
      schedulingCloud_init
    );
    console.log(
      '🚀 ~ file: StepTwo.js ~ line 180 ~ setCloudSchedulingOption ~ schedulingCloud_init',
      Data
    );

    setSchedulingCloud(schedulingCloud_init);
  };
  //#endregion

  const initAllOptions = async () => {
    if (
      providerCloud == null &&
      cloudPremission == null &&
      providerEnvirment == null &&
      schedulingCloud == null
    ) {
      console.log(
        '🚀 ~ file: StepTwo.js ~ line 236 ~ initAllOptions ~ ---------------------------------'
      );

      await setCloudPremissionOption();
      await setCloudProivderOption();
      await setCloudSchedulingOption();
      await setCloudEnvirmentOption();
    }
  };

  useEffect(() => {
    console.log('🚀 ~ file: StepTwo.js ~ line 236 ~ useEffect ~ useEffect');
    console.log(Data.ProjectNameinCloud, 'STWP');
    initAllOptions();
  }, []);

  return (
    <>
      <Grid container spacing={0}>
        <Grid
          item
          xs={12}
          sm={4}
          md={3}
          justifyContent='flex-end'
          textAlign={{ sm: 'right' }}>
          <Box pr={3} sx={{ pt: 3, pb: { xs: 1, md: 0 } }} alignSelf='center'>
            <b>שם ספק:</b>
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
            disabled
            name='providerCloud'
            options={providerCloud}
            value={Data.cloud_name.Cloud}
          />
          <Checkbox
            style={{ color: DENIED_CHECKBOX_COLOR }}
            checked={isClickErrors.CloudName}
            onClick={() => toggleCheckBoxComment('CloudName')}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </Grid>
        {/* Number 1 */}
        {isClickErrors.CloudName && (
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
                <b>הערה:</b>
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
                onChange={(e) =>
                  handleFormsValueChange(
                    'providerCloud_deniedNote',
                    e.target.value
                  )
                }
                value={formValues.providerCloud_deniedNote}
                variant='outlined'
              />
            </Grid>
          </>
        )}

        <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
          <Box pr={3} sx={{ pb: { xs: 1, md: 0 } }}>
            <b>שם הפרויקט בענן:</b>
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
            error={Boolean(touched.nameInCloud && errors.nameInCloud)}
            disabled
            helperText={touched.nameInCloud && errors.nameInCloud}
            name='nameInCloud'
            placeholder={`B-“star_name”-“number”-”01…02…”`}
            onBlur={handleBlur}
            onChange={handleChange}
            value={Data.ProjectNameinCloud}
            variant='outlined'
          />
          <Checkbox
            style={{ color: DENIED_CHECKBOX_COLOR }}
            checked={isClickErrors.nameInCloud}
            onClick={() => {
              console.log(isClickErrors);
              toggleCheckBoxComment('nameInCloud');
            }}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </Grid>
        {/* Number 2 */}

        {isClickErrors.nameInCloud && (
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
                <b>הערה:</b>
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
                    'nameInCloud_deniedNote',
                    e.target.value
                  )
                }
                value={formValues.nameInCloud_deniedNote}
                variant='outlined'
              />
            </Grid>
          </>
        )}

        <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
          <Box pr={3} sx={{ pb: { xs: 1, md: 0 } }}>
            <b>הרשאות נדרשות:</b>
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
            name='permissionOnCloud'
            options={cloudPremission}
            value={Data.cloud_permissiontbl.CloudPermissionName}
          />
          <Checkbox
            style={{ color: DENIED_CHECKBOX_COLOR }}
            checked={isClickErrors.permissionOnCloud}
            onClick={() => {
              console.log(isClickErrors);
              toggleCheckBoxComment('permissionOnCloud');
            }}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </Grid>
        {/* Number 3 */}

        {isClickErrors.permissionOnCloud && (
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
                <b>הערה:</b>
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
                    'permission_deniedNote',
                    e.target.value
                  )
                }
                value={formValues.permission_deniedNote}
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
            <b> Environment:</b>
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
            name='environmentCloud'
            options={providerEnvirment}
            value={Data.cloud_environment_area_name.CloudEnvironmentAreaName}
          />
          <Checkbox
            style={{ color: DENIED_CHECKBOX_COLOR }}
            checked={isClickErrors.environmentCloud}
            onClick={() => toggleCheckBoxComment('environmentCloud')}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </Grid>
        {/* Number 4 */}

        {isClickErrors.environmentCloud && (
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
                <b>הערה:</b>
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
                    'environment_deniedNote',
                    e.target.value
                  )
                }
                value={formValues.environment_deniedNote}
                variant='outlined'
              />
            </Grid>
          </>
        )}
        <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
          <Box pr={3} sx={{ pb: { xs: 1, md: 0 } }}>
            <b>ביצוע Scheduling:</b>
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
            name='schedulingCloud'
            options={schedulingCloud}
            value={Data.scheduling.SchedulingOption}
          />
          <Checkbox
            style={{ color: DENIED_CHECKBOX_COLOR }}
            checked={isClickErrors.schedulingCloud}
            onClick={() => toggleCheckBoxComment('schedulingCloud')}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </Grid>
        {/* Number 5 */}

        {isClickErrors.schedulingCloud && (
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
                <b>הערה:</b>
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
                    'scheduling_deniedNote',
                    e.target.value
                  )
                }
                value={formValues.scheduling_deniedNote}
                variant='outlined'
              />
            </Grid>
          </>
        )}

        {Data.scheduling.SchedulingOption === 'none' && (
          <>
            <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
              <Box pr={3} sx={{ pb: { xs: 1, md: 0 } }}>
                <b>פירוט סיבת Scheduling:</b>
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
                error={Boolean(
                  touched.reasonOfUnUseofScheduling &&
                    errors.reasonOfUnUseofScheduling
                )}
                fullWidth
                name='reasonOfUnUseofScheduling'
                onBlur={handleBlur}
                onChange={handleChange}
                value={Data.ReasonOfUnUseofScheduling}
                variant='outlined'
              />
              <Checkbox
                style={{ color: DENIED_CHECKBOX_COLOR }}
                checked={isClickErrors.reasonOfUnUseofScheduling}
                onClick={() =>
                  toggleCheckBoxComment('reasonOfUnUseofScheduling')
                }
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </Grid>
            {/* Number 7 */}

            {isClickErrors.reasonOfUnUseofScheduling && (
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
                    <b>הערה:</b>
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
                        'reasonOfUnUseofScheduling_deniedNote',
                        e.target.value
                      )
                    }
                    value={formValues.reasonOfUnUseofScheduling_deniedNote}
                    variant='outlined'
                  />
                </Grid>
              </>
            )}
          </>
        )}
      </Grid>
    </>
  );
}
