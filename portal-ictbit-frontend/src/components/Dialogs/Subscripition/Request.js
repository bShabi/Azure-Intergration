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
  Typography,
} from '@material-ui/core';
import PropTypes from 'prop-types';

import * as Yup from 'yup';
import { Formik } from 'formik';
import { socket } from '../../../../components/util/web-socket';

// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import AddTwoToneIcon from '@material-ui/icons/AddTwoTone';
// import CloudUploadTwoToneIcon from '@material-ui/icons/CloudUploadTwoTone';
import CloseTwoToneIcon from '@material-ui/icons/CloseTwoTone';
// import CheckTwoToneIcon from '@material-ui/icons/CheckTwoTone';
// import ReactQuill from "react-quill";
import React, { useState, useContext, useEffect } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';

import StepOne from './Steps/StepOne';
import StepTwo from './Steps/StepTwo';
import StepThree from './Steps/StepThree';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import AuthContext from '../../../../context/AuthContext';
import RequestManagerApi from '../../../api/request-manager-api';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import GeneralConstants from '../../../constants/status-constants';
import BootstrapDialogTitle from '../../../shared-components/BootstrapDialogTitle';

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
}));

const FORM_VALUE_INIT = {
  //Values
  //Step One
  StepNm: 0,
  DisplayNumber: '',
  general_deniedNote: '',
  fullname: '',
  phone: '',
  title: '',
  emailToSend: '', //new
  summaryProject: '', //new
  ccfoFullName: '',
  ccfoEmail: '',
  ccfoPhone: '',
  //Step Two
  nameInCloud: '',
  permission: '',
  providerCloud: '6116a1db8e3a766c4b744625',
  budgetOption: '6116a1db8e3a766c4b744625',
  limitProject: '',
  environment: '',
  environmentCloud: '',
  // scheduling: '17:00',
  schedulingCloud: '6110d34759c5875bd29320fc',
  reasonOfUnUseofScheduling: '',
  //Step3
  budget: 0,
  commandOfBudget: '',
  status: 'Submited',
  submit: null,
};

export default function RequestSubscriptionDialog({
  handleCloseDialog,
  open,
  setOpen,
  data,
  budgetLimit,
}) {
  const router = useRouter();
  const classes = useStyles();
  console.log('budgetLimit', budgetLimit);
  const [formsValue, setFormsValue] = useState({ ...FORM_VALUE_INIT });
  const [requestTbl, setRequestTbl] = useState(null);
  const [onLoading, setOnLoading] = useState(false);
  const [isReload, setIsRelaod] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const { member } = useContext(AuthContext);
  console.log('member', member);
  const handleClose = () => {
    setOnLoading(false);
    handleCloseDialog();
    resetFormValues();
  };

  const create = () => {
    setOpen(false);
  };

  const resetFormValues = () => {
    setFormsValue({ ...FORM_VALUE_INIT });
  };

  const validateStep = (values) => {
    if (
      !!values.fullname &&
      !!values.phone &&
      !!values.title &&
      !!values.providerCloud &&
      !!values.nameInCloud &&
      !!values.environmentCloud &&
      !!values.schedulingCloud &&
      !!values.commandOfBudget &&
      !!values.budget
    ) {
      return false;
    }

    return true;
  };

  const preperedRequestDataByValues = (values) => {
    console.log(
      '🚀 ~ file: Request.js ~ line 178 ~ preperedRequestDataByValues ~ values',
      values
    );
    // const limitBudget = values?.budget > budgetLimit ? true : false;
    // console.log(limitBudget);
    // var statusRequest = limitBudget
    //   ? GeneralConstants.requestTblStatuses.InProgress.id
    //   : GeneralConstants.requestTblStatuses.submitted.id;
    // console.log('statusRequest', statusRequest);
    var today = new Date();
    var currentJsonDate = today.toJSON();
    var randomNumberToDispaly = Math.floor(10000 + Math.random() * 90000);
    var isRequlerRequestByBudget = values.budget;
    let preperedObject = {
      DisplayNumber: 'AE-' + randomNumberToDispaly,
      fullname: values.fullname,
      phone: values.phone,
      title: values.title,
      emailToSend: values.emailToSend,
      summaryProject: values.summaryProject,
      requests_status_tbl: {
        _id: GeneralConstants.requestTblStatuses.submitted.id,
      },
      ProjectNameinCloud: values.nameInCloud,
      BudgetOnDemand: values.budget,
      cloud_environment_area_name: {
        _id: values.environmentCloud,
      },
      cloud_name: {
        _id: values.providerCloud,
      },
      scheduling: {
        _id: values.schedulingCloud,
      },
      budget_kind_tbl: {
        _id: values.budgetOption,
      },
      // cloud_permissiontbl: {
      //   _id: values.permissionOnCloud,
      // },
      BudgetReasonNotes: values.commandOfBudget,
      general_deniedNote: values.general_deniedNote,

      DateCCFORequestNotes: currentJsonDate,
      DateCreateRequest: currentJsonDate,
      LastDateUpdateRequest: currentJsonDate,
      isRegularRequest: true,
      ReasonOfUnUseofScheduling: values.reasonOfUnUseofScheduling,
      memberID: {
        _id: member?.id,
      },
    };
    console.log('preperedObject 211', preperedObject);

    return preperedObject;
  };

  const handleSaveRequestToDraft = (values) => {
    console.log(
      '🚀 ~ file: Request.js ~ line 189 ~ handleSaveRequestToDraft ~ values',
      values
    );

    let preperedRequestDataObject = preperedRequestDataByValues(values);
    RequestManagerApi.createDraftRequest(preperedRequestDataObject)
      .then((data) => {
        console.log(data);
        toast.success('הבקשה נשלחה לטיוטה בהצלחה');
      })
      .catch((e) => {
        console.log('🚀 ~ file: Request.js ~ line 195 ~ .then ~ e', e);
      });

    handleClose();
  };

  const setRequestTblOption = async () => {
    let requestTbl_init = [];
    let requestTblFromServer = await RequestManagerApi.getRequestTblByMemberId(
      member.id
    );

    requestTblFromServer?.forEach((element) => {
      requestTbl_init.push({
        id: element._id,
        optionValue: element.SchedulingOption,
        budget: element.SchedulingOption,
      });
    });

    setRequestTbl(requestTbl_init);
  };

  const initAllOptions = async () => {
    if (requestTbl == null && !!member) {
      await setRequestTblOption();
    }
  };
  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);
  useEffect(() => {
    if (member)
      console.log('🚀 ~ file: Request.js ~ line 287 ~ useEffect ~ useEffect');
    initAllOptions();
  }, []);
  function pushUpdateNotification() {
    socket.emit('updateApiCall');
  }
  useEffect(() => {
    if (isReload) {
      socket.on('notification', (data) => {
        console.log('Start Soket');

        setTimeout(() => {
          console.log('inSocket');
          router.replace(router.asPath);
          toast.success('נוצרה בקשה חדשה במערכת');
        }, 1200);
        console.log('finish Soket');
      });
    }
  }, [isReload]);

  return (
    <div dir='rtl' className={classes.root}>
      <Dialog
        style={{ overflow: 'hidden' }}
        maxWidth={'sm'}
        fullWidth={true}
        open={open}
        onClose={handleClose}
        scroll={'paper'}
        aria-labelledby='scroll-dialog-title'
        aria-describedby='scroll-dialog-description'>
        <BootstrapDialogTitle
          id='customized-dialog-title'
          onClose={handleClose}
          isBudgetRequests={true}>
          טופס בקשה
        </BootstrapDialogTitle>
        {!onLoading ? (
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
            })}
            onSubmit={async (
              values,
              { resetForm, setErrors, setStatus, setSubmitting }
            ) => {
              try {
                console.log('In subbmit');
                /**
                 * after click 'צור בקשה'
                 */
                let preperedRequestDataObject =
                  preperedRequestDataByValues(values);
                console.log(
                  'preperedRequestDataObject',
                  preperedRequestDataObject
                );
                setOnLoading(true);
                const msgInfo = {
                  subject: `-התקבלה תשובה לבקשה לפתיחת פרויקט בענן בשם ${values.nameInCloud}`,
                  body: `
                  סטטוס הבקשה  = SUBMITED  
                  קישור לאתר https://portal-ictbitt-frontend.herokuapp.com/
                  `,
                  sender: 'PortalManager@Aladin.com',
                  receiver: values.emailToSend,
                };

                RequestManagerApi.createNewRequest(preperedRequestDataObject)
                  .then((data) => {
                    /** Update any body
                      
                     */
                    //setIsRelaod(true);
                    pushUpdateNotification();
                    console.log(data);
                    getStaticProps();
                    RequestManagerApi.SendEmail(msgInfo)
                      .then((res) => toast.success('מייל נשלח עבור העדכון'))
                      .catch((error) => console.log(error)); // let preperedBudgetDataObject =
                    //   preperedBudgetDataByValuesAndRequestId(values, data._id);
                    // RequestManagerApi
                    // .updateBudget(preperedBudgetDataObject)
                    // .then((data) => {
                    setTimeout(() => {
                      router.reload();
                      toast.success('נרשמה בקשה חדשה במערכת.');
                      handleClose();
                    }, 1500);
                  })
                  // .catch((e) => {
                  //   toast.error('בקשת תקציב עבור הסביבה נכשלה.');
                  //   console.log('updateBudget -> e', e);
                  // });
                  .catch((e) => {
                    toast.error('בקשת סביבה נכשלה.');

                    console.log('createNewGate -> e', e);
                    handleCloseDialog();
                  });
                handleClose();
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
                  <DialogContent
                    className='scrollbar-hidden'
                    style={{ height: '560px', overflow: 'scroll' }}
                    divider
                    sx={{ p: 3 }}
                    dir='rtl'>
                    {/* {formsValue.StepNm === 0 && ( */}
                    <StepOne
                      errors={errors}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      isSubmitting={isSubmitting}
                      touched={touched}
                      values={values}
                    />
                    {/* )} */}
                    {/* {formsValue.StepNm === 1 && ( */}
                    <Divider />
                    <StepTwo
                      errors={errors}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      isSubmitting={isSubmitting}
                      touched={touched}
                      values={values}
                    />
                    {/* )} */}
                    {/* {formsValue.StepNm === 2 && ( */}
                    <Divider />

                    <StepThree
                      errors={errors}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      isSubmitting={isSubmitting}
                      touched={touched}
                      values={values}
                    />

                    {/* )} */}
                    <div style={{ width: '100%', display: 'flex' }}>
                      {/* <Button
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
                    </Button> */}

                      <div
                        style={{
                          flexGrow: 1,
                          display: 'flex',
                          justifyContent: 'flex-end',
                        }}></div>
                    </div>
                  </DialogContent>
                  <DialogActions
                    style={{
                      position: 'sticky',
                      bottom: 0,
                      zIndex: 10,
                      background: 'white',
                      boxShadow: '0px 0px 1px 1px #aaaaaa',
                      display: 'flex',
                      // flexDirection: 'row-reverse',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}>
                    <div
                      style={{
                        display: 'flex',
                        paddingTop: '1rem',
                        padding: 10,
                        alignItems: 'center',
                      }}>
                      <Button
                        sx={{ mr: 2 }}
                        type={'submit'}
                        variant={
                          validateStep(values) ? 'outlined' : 'contained'
                        }
                        size='large'
                        disabled={validateStep(values)}
                        color={validateStep(values) ? 'secondary' : 'primary'}>
                        {'שלח לאישור'}
                      </Button>
                      {/* <Button
                        sx={{ mr: 2 }}
                        variant='contained'
                        size='large'
                        onClick={() => handleSaveRequestToDraft(values)}
                        style={{
                          margin: '0 .5rem',
                          background:
                            GeneralConstants.colorByStatusRequest('draft'),
                        }}>
                        {'שמור טיוטה'}
                      </Button> */}
                      {/* <Button
                      sx={{ mr: 2 }}
                      variant='contained'
                      size='large'
                      color='secondary'
                      onClick={handleCloseDialog}
                      style={{ margin: '0 .5rem' }}>
                      {'סגור טופס'}
                    </Button> */}
                    </div>
                  </DialogActions>
                </form>
              </div>
            )}
          </Formik>
        ) : (
          <>
            <span style={{ minHeight: 200 }}></span>
            <CircularProgress
              style={{
                height: 100,
                width: 100,
                alignSelf: 'center',
                margin: 'auto',
              }}
            />
            <span style={{ minHeight: 250 }}></span>
          </>
        )}
        {/* </DialogContentText> */}
      </Dialog>
    </div>
  );
}
export async function getStaticProps() {
  // Fetch events
  const dataRes = await fetch(`${API_URL}/requests-tbls`);
  const data = await dataRes.json();

  return {
    props: { data },
  };
}
