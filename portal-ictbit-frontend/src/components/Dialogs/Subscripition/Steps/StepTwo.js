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
import Container from '@material-ui/core/Container';
import DatePicker from '@material-ui/lab/DatePicker';
import SelectFormik from '../SelectFormik';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import AuthContext from '../../../../../context/AuthContext';
import requestManagerApi from '../../../../api/request-manager-api';

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
  textField: {
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
}) {
  const classes = useStyles();
  const [providerCloud, setProviderCloud] = useState();
  const [cloudPremission, setCloudPremission] = useState();
  const [providerEnvirment, setProviderEnvirment] = useState();
  const [schedulingCloud, setSchedulingCloud] = useState();
  const [schedulingCloudNoneId, setSchedulingCloudNoneId] = useState(null);

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

    cloudPremissionFromServer?.forEach((element) => {
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

      if (element.SchedulingOption === 'none') {
        setSchedulingCloudNoneId(element._id);
      }
    });
    values.environmentCloud = schedulingCloud_init[0].optionValue;
    console.log('testing', values.environmentCloud);
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
        '🚀 ~ file: StepTwo.js ~ line 236 ~ initAllOptions ~ initAllOptions'
      );

      await setCloudPremissionOption();
      await setCloudProivderOption();
      await setCloudSchedulingOption();
      await setCloudEnvirmentOption();
    }
  };

  useEffect(() => {
    console.log('🚀 ~ file: StepTwo.js ~ line 236 ~ useEffect ~ useEffect');

    initAllOptions();
  }, []);

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
        <b style={{ color: '#4457da' }}>פרטיים טכניים</b>
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
                <strong style={{ fontSize: 16 }}>שם ספקית הענן:</strong>
              </Box>
            </Grid>
            <SelectFormik
              name='providerCloud'
              className={classes.textField}
              options={providerCloud}
              value={values.providerCloud}
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
                <strong style={{ fontSize: 16 }}>שם הפרויקט בענן:</strong>
              </Box>
            </Grid>
            <TextField
              error={Boolean(touched.nameInCloud && errors.nameInCloud)}
              className={classes.textField}
              helperText={touched.nameInCloud && errors.nameInCloud}
              name='nameInCloud'
              placeholder={`B-“star_name”-“number”-”01…02…”`}
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.ProjectNameinCloud}
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
                <strong style={{ fontSize: 16 }}> Environment:</strong>
              </Box>
            </Grid>
            <SelectFormik
              name='environmentCloud'
              options={providerEnvirment}
              value={values.environmentCloud}
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
                <strong style={{ fontSize: 16 }}>
                  הורדה אוטומטית של הסביבה בשעות חוסר פעילות:
                </strong>
              </Box>
            </Grid>
            <SelectFormik
              className={classes.textField}
              name='schedulingCloud'
              options={schedulingCloud}
              value={values.schedulingCloud}
            />
          </Grid>
          {values.schedulingCloud === schedulingCloudNoneId && (
            <>
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
                    <strong style={{ fontSize: 16 }}>
                      פירוט סיבת Scheduling:
                    </strong>
                  </Box>
                </Grid>
                <TextField
                  error={Boolean(
                    touched.reasonOfUnUseofScheduling &&
                      errors.reasonOfUnUseofScheduling
                  )}
                  className={classes.textField}
                  name='reasonOfUnUseofScheduling'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.reasonOfUnUseofScheduling}
                  variant='outlined'
                />
              </Grid>
            </>
          )}
        </Container>
      </Grid>
    </>
  );
}
