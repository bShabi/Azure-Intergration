import { makeStyles } from '@material-ui/styles';
import {
  DialogContent,
  CircularProgress,
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
import Stepper from '../../Stepper';
import { Formik } from 'formik';
import DatePicker from '@material-ui/lab/DatePicker';
import { useDropzone } from 'react-dropzone';
import Typography from '@material-ui/core/Typography';
import { experimentalStyled } from '@material-ui/core/styles';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
import AddTwoToneIcon from '@material-ui/icons/AddTwoTone';
import CloudUploadTwoToneIcon from '@material-ui/icons/CloudUploadTwoTone';
import CloseTwoToneIcon from '@material-ui/icons/CloseTwoTone';
import CheckTwoToneIcon from '@material-ui/icons/CheckTwoTone';
// import ReactQuill from "react-quill";
import dynamic from 'next/dynamic';
import { useState, useContext, useEffect } from 'react';
import StepOne from './Steps/StepOne';
import StepTwo from './Steps/StepTwo';
import StepThree from './Steps/StepThree';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import AuthContext from '../../../../context/AuthContext';
import { Preview } from '@material-ui/icons';
import requestManagerApi from '../../../api/request-manager-api';

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
    padding: '15px 0 15px 0',
    textAlign: 'center',
    color: '#5569ff',
    fontSize: 22,
    fontWeight: 'bold',
    width: 255,
  },
  header: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  headerButtons: {
    alignSelf: 'center',
    width: 250,
    display: 'flex',
    justifyContent: 'space-around',
  },
}));

const FORM_VALUE_INIT = {
  //Values
  //Step One

  StepNm: 0,

  fullname: '',
  fullname_deniedNote: '',
  phone: '',
  phone_deniedNote: '',
  title: '',
  title_deniedNote: '',
  ccfoFullName: '',
  ccfoFullName_deniedNote: '',
  ccfoEmail: '',
  ccfoEmail_deniedNote: '',
  ccfoPhone: '',
  ccfoPhone_deniedNote: '',

  //Step Two
  nameInCloud: '',
  nameInCloud_deniedNote: '',
  permission: '',
  permission_deniedNote: '',
  providerCloud: '',
  providerCloud_deniedNote: '',
  environment: '',
  environment_deniedNote: '',
  scheduling: '',
  scheduling_deniedNote: '',
  reasonOfUnUseofScheduling: '',
  reasonOfUnUseofScheduling_deniedNote: '',

  //Step three
  budget: 0,
  budget_deniedNote: '',
  file_deniedNote: '',
  limitProject_deniedNote: '',
  commandOfBudget: '',
  commandOfBudget_deniedNote: '',
  status: 'Submited',
  submit: null,
  submit_deniedNote: '',

  general_deniedNote: '',
};

const FORM_VALUE_ERROR_INIT = {
  CloudName: false,
  permissionOnCloud: false,
  nameInCloud: false,
  permission: false,
  providerCloud: false,
  environmentCloud: false,
  commandOfBudget: false,
  providerEnvirment: false,
  schedulingCloud: false,
  budget: false,
  file: false,
  limiteProject: false,
  reasonOfUnUseofScheduling: false,
};

export default function RequestSubscriptionDialog({
  handleCloseDialog,
  open,
  setOpen,
  Data,
}) {
  const classes = useStyles();

  const [formsValue, setFormsValue] = useState({ ...FORM_VALUE_INIT });
  const [isClickErrors, setIsClickEror] = useState({
    ...FORM_VALUE_ERROR_INIT,
  });

  const handleFormsValueChange = (name, value) => {
    setFormsValue({
      ...formsValue,
      [name]: value,
    });
  };

  const toggleCheckBoxComment = (paramter) => {
    for (const [key, value] of Object.entries(isClickErrors)) {
      if (`${key}` === paramter) {
        var keys = `${key}`;
        setIsClickEror((prevState) => ({
          ...prevState,
          [keys]: !value,
        }));

        console.log(`${key}: ${value}`);
      }
    }
  };

  const handleClose = () => {
    handleCloseDialog();
    setIsClickEror({
      ...FORM_VALUE_ERROR_INIT,
    });
    resetFormValues();
  };

  const resetFormValues = () => {
    setFormsValue({ ...FORM_VALUE_INIT });
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

  const handleNextStep = () => {
    let tempFromsValue = { ...formsValue };
    tempFromsValue.StepNm = tempFromsValue.StepNm + 1;
    setFormsValue(tempFromsValue);
  };

  const handleBackStep = () => {
    let tempFromsValue = { ...formsValue };
    tempFromsValue.StepNm = tempFromsValue.StepNm - 1;
    setFormsValue(tempFromsValue);
  };

  const handleDenied = () => {
    // TO DO: move status to denied
    console.log(
      '🚀 ~ file: Request.js ~ line 206 ~ handleDenied ~ values',
      Data
    );
    console.log(
      '🚀 ~ file: Request.js ~ line 206 ~ handleDenied ~ values',
      formsValue
    );

    let preperedRequestDeniedDataObject =
      preperedRequestDeniedDataByValues(formsValue);
    requestManagerApi
      .acceptManagerRequest(preperedRequestDeniedDataObject)
      .then((data) => {
        console.log('🚀 ~ file: Request.js ~ line 308 ~ .then ~ data', data);
      })
      .catch((e) => {
        console.log('createNewGate -> e', e);
      });
  };

  const handleAccept = () => {
    // TO DO: move status to denied
    console.log(
      '🚀 ~ file: Request.js ~ line 206 ~ handleAccept ~ values',
      formsValue
    );

    let preperedRequestAcceptDataObject =
      preperedRequestAcceptDataByValues(formsValue);
    requestManagerApi
      .acceptManagerRequest(preperedRequestAcceptDataObject)
      .then((data) => {
        console.log('🚀 ~ file: Request.js ~ line 308 ~ .then ~ data', data);
      })
      .catch((e) => {
        console.log('createNewGate -> e', e);
      });
  };

  const preperedRequestDataByValues = (values) => {
    let preperedObject = {};
    console.log('preperedObject 211', preperedObject);

    return preperedObject;
  };

  const preperedBudgetDataByValuesAndRequestId = (values, requestId) => {
    var today = new Date();
    var currentJsonDate = today.toJSON();
    console.log('preperedBudgetDataByValuesAndRequestId', values, requestId);
    let preperedObject = {
      SubscriptionName: values.nameInCloud,
      CurrentBudget: values.budget,
      NewBudget: null,
      NewBudgetNotes: values.commandOfBudget,
      lastUpdated: currentJsonDate,
      members_tbl: {
        _id: '6110f964b7f28f831eebb253',
      },
      requests_tbl: {
        _id: requestId,
      },
    };
    console.log('preperedObject', preperedObject);
    return preperedObject;
  };

  const mapDataObjectToFormValues = (data) => {
    let preperedFormValuesObject = { ...FORM_VALUE_INIT };

    preperedFormValuesObject.fullname = data.fullname;
    preperedFormValuesObject.phone = data.phone;
    preperedFormValuesObject.title = data.title;
    preperedFormValuesObject.nameInCloud = data.ProjectNameinCloud;
    preperedFormValuesObject.budget = data.BudgetOnDemand;
    preperedFormValuesObject.environmentCloud =
      data.cloud_environment_area_name._id;
    preperedFormValuesObject.providerCloud = data.cloud_name._id;
    preperedFormValuesObject.schedulingCloud = data.scheduling._id;
    preperedFormValuesObject.permissionOnCloud = data.cloud_permissiontbl._id;
    preperedFormValuesObject.commandOfBudget = data.BudgetReasonNotes;
    preperedFormValuesObject.reasonOfUnUseofScheduling =
      data.ReasonOfUnUseofScheduling;

    console.log(
      '🚀 ~ file: Request.js ~ line 288 ~ mapDataObjectToFormValues ~ preperedFormValuesObject',
      preperedFormValuesObject
    );

    return preperedFormValuesObject;
  };

  useEffect(() => {
    if (formsValue.fullname === '' && Data != null) {
      let tempFromsValue = mapDataObjectToFormValues(Data);
      setFormsValue({ ...tempFromsValue });
    }
  }, []);

  return (
    <div dir='rtl' className={classes.root}>
      <Dialog
        maxWidth={'sm'}
        fullWidth={true}
        scroll={scroll}
        open={open}
        onClose={handleClose}
        aria-describedby='scroll-dialog-description'
        aria-labelledby='form-dialog-title'>
        <DialogTitle>
          <div className={classes.header}>
            <Paper className={classes.paper}>
              <element>{Data?.id.substr(0, 5).concat('  טופס בקשה')}</element>
            </Paper>
            <div className={classes.headerButtons}></div>
          </div>
        </DialogTitle>

        <div dir='ltr'>
          {/* <Stepper activeStep={formsValue.StepNm} /> */}
          <Divider />
        </div>

        <Formik
          initialValues={formsValue}
          validationSchema={Yup.object().shape({
            //StepOne
            title: Yup.string()
              .max(255)
              .required('The title field is required'),
            phone: Yup.number().required('The phone field is required'),
            fullname: Yup.string()
              .max(255)
              .required('The fullname field is required'),
            ccfoFullName: Yup.string().max(255),
            ccfoEmail: Yup.string().email().max(255),

            // //Step Two
            // nameInCloud: Yup.string()
            //     .max(40)
            //     .min(6)
            //     .required('אנא הכנס את שם הפרויקט'),

            // //Step Three

            // budget: Yup.number()
            //     .min(1),
            // commandOfBudget: Yup.string()
            //     .min(20)
          })}
          onSubmit={async (
            values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            try {
              console.log('In subbmit');

              let preperedRequestDataObject =
                preperedRequestDataByValues(values);
              requestManagerApi
                .createNewRequest(preperedRequestDataObject)
                .then((data) => {
                  console.log(
                    '🚀 ~ file: Request.js ~ line 308 ~ .then ~ data',
                    data
                  );
                  let preperedBudgetDataObject =
                    preperedBudgetDataByValuesAndRequestId(values, data._id);
                  requestManagerApi
                    .updateBudget(preperedBudgetDataObject)
                    .then((data) => {
                      console.log(
                        '🚀 ~ file: Request.js ~ line 276 ~ requestManagerApi.updateBudget ~ data',
                        data
                      );
                    })
                    .catch((e) => {
                      console.log('updateBudget -> e', e);
                    });
                })
                .catch((e) => {
                  console.log('createNewGate -> e', e);
                });
            } catch (err) {
              console.error(err.message);
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }}>
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values,
          }) => (
            <div dir={'rtl'}>
              <form onSubmit={handleSubmit}>
                <DialogContent divider sx={{ p: 3 }}>
                  <StepOne
                    errors={errors}
                    Data={Data}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    isSubmitting={isSubmitting}
                    touched={touched}
                    values={values}
                  />
                  <StepTwo
                    errors={errors}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    isSubmitting={isSubmitting}
                    touched={touched}
                    values={values}
                    Data={Data}
                    formValues={formsValue}
                    isClickErrors={isClickErrors}
                    toggleCheckBoxComment={toggleCheckBoxComment}
                    setValues={setFormsValue}
                    handleFormsValueChange={handleFormsValueChange}
                  />
                  <StepThree
                    errors={errors}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    isSubmitting={isSubmitting}
                    isClickErrors={isClickErrors}
                    toggleCheckBoxComment={toggleCheckBoxComment}
                    Data={Data}
                    formValues={formsValue}
                    touched={touched}
                    values={values}
                    handleFormsValueChange={handleFormsValueChange}
                  />
                  <div style={{ width: '100%', display: 'flex' }}>
                    <Button
                      sx={{ mr: 2 }}
                      name='StepNm'
                      startIcon={
                        isSubmitting ? <CircularProgress size='1rem' /> : null
                      }
                      disabled={Boolean(errors.submit) || isSubmitting}
                      variant='contained'
                      disabled={formsValue.StepNm === 2}
                      size='large'
                      onClick={handleNextStep}
                      style={{ margin: '0 .5rem' }}>
                      {'שלב הבא'}
                    </Button>
                    <Button
                      sx={{ mr: 2 }}
                      name='StepNm'
                      startIcon={
                        isSubmitting ? <CircularProgress size='1rem' /> : null
                      }
                      disabled={Boolean(errors.submit) || isSubmitting}
                      variant='contained'
                      disabled={formsValue.StepNm === 0}
                      size='large'
                      onClick={handleBackStep}
                      style={{ margin: '0 .5rem' }}>
                      {'שלב קודם'}
                    </Button>
                  </div>
                </DialogContent>
              </form>
            </div>
          )}
        </Formik>
      </Dialog>
    </div>
  );
}
export async function getStaticProps() {
  // Fetch events
  const dataRes = await fetch(`${API_URL}/requests-tbls`);
  const data = await dataRes.json();
  console.log('\n\n--------------------------');
  console.log(data);
  return {
    props: { data },
  };
}
