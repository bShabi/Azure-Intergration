import { makeStyles } from '@material-ui/styles';
import {
  DialogContent,
  TextField,
  Box,
  Button,
  Divider,
  Paper,
  Grid,
  Checkbox,
  Avatar,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useDropzone } from 'react-dropzone';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import ReactQuill from "react-quill";
import { useState, useContext, useEffect } from 'react';
import { experimentalStyled } from '@material-ui/core/styles';
import CloudUploadTwoToneIcon from '@material-ui/icons/CloudUploadTwoTone';

import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import AuthContext from '../../../../context/AuthContext';
import RequestManagerApi from '../../../api/request-manager-api';
import { toast } from 'react-toastify';
import SelectFormik from './SelectFormik';
import GeneralConstants from '../../../constants/status-constants';
import BootstrapDialogTitle from '../../../shared-components/BootstrapDialogTitle';
const projectTags = [
  { title: 'Development' },
  { title: 'Design Project' },
  { title: 'Marketing Research' },
  { title: 'Software' },
];

const DENIED_CHECKBOX_COLOR = 'rgb(244, 67, 54)';
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
const FORM_VALUE_INIT = {
  //Values
  //Step One
  CurrentBudget: '',
  NewBudget: '',
  BudgetID: '',
  members_tbl: '',
  requests_status_tbl: '',

  SubscriptionName: '',
  SubscriptionId: '',
  budget: 0,
  budget_deniedNote: '',
  file_deniedNote: '',
  limitProject_deniedNote: '',
  commandOfBudget: '',
  commandOfBudget_deniedNote: '',
  CurrentBudget_deniedNote: '',
  NewBudget_deniedNote: '',
  SubscriptionName_deniedNote: '',
  NewBudgetNotes_deniedNote: '',
  status: 'Submited',
  submit: null,
  submit_deniedNote: '',

  general_deniedNote: '',
};

const FORM_VALUE_ERROR_INIT = {
  CurrentBudget_deniedNote: '',
  NewBudget_deniedNote: '',
  BudgetID_deniedNote: '',
  members_tbl_deniedNote: '',
  requests_status_tbl_deniedNote: '',
  ProjectNameinCloud_deniedNote: '',
  subscriptionToken: '',
  subscripitionID: '',
  currectBudget: '',
  newBudget: '',
  SubscriptionName_deniedNote: '',
  NewBudgetNotes_deniedNote: '',
  requestNote: '',
  general_deniedNote: '',
  submit: null,
};

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
export default function AcceptBudgetDialog({
  handleCloseDialog,
  open,
  setOpen,
  Data,
  DataRow,
  ManagerRequestPage_RefreshData,
  isUserMode,
  requestID,
}) {
  console.log('requestID2', requestID);
  const isDenied = Data?.requests_status_tbl?.RequestsStatusName === 'denied';
  const isBudgerDenied =
    Data?.requests_status_tbl?.RequestsStatusName === 'denied';
  console.log('isDenied', isBudgerDenied);
  console.log('isBudgerDenied', isBudgerDenied);
  const classes = useStyles();
  const { member } = useContext(AuthContext);
  const [requestTb_projectNameToBudget, setRequestTb_projectNameToBudget] =
    useState({});
  const [formsValue, setFormsValue] = useState({ ...FORM_VALUE_INIT });
  const [isClickErrors, setIsClickEror] = useState({
    ...FORM_VALUE_ERROR_INIT,
  });
  const [subscriptionName, setSubscriptionName] = useState(null);
  const [subscriptionNameToBudget, setSubscriptionNameToBudget] = useState({});
  const [onLoading, setOnLoading] = useState(false);
  const [requestTbl, setRequestTbl] = useState(null);
  const handleFormsValueChange = (name, value) => {
    setFormsValue({
      ...formsValue,
      [name]: value,
    });
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
      <b style={{ textAlign: 'right' }}>{file.size} bytes</b>
      <Divider />
    </ListItem>
  ));
  const setRequestTblOption = async () => {
    console.log('optionSubscriptionFRomBudt');
    let requestTb_projectNameToBudget_init = {};
    let requestTbl_init = [];
    let requestTblFromServer = await RequestManagerApi.getRequestTblByMemberId(
      member?.id
    );
    requestTblFromServer?.forEach((element) => {
      requestTbl_init.push({
        id: element.id,
        optionValue: element.ProjectNameinCloud,
      });

      requestTb_projectNameToBudget_init[element.ProjectNameinCloud] =
        element.BudgetOnDemand;
    });
    console.log(
      'requestTb_projectNameToBudget_init',
      requestTb_projectNameToBudget_init
    );
    setRequestTb_projectNameToBudget(requestTb_projectNameToBudget_init);
    setRequestTbl(requestTbl_init);
  };

  const initAllOptions = async () => {
    console.log(
      '🚀 ~ file: Request.js ~ line 112 ~ initAllOptions ~ budget',
      requestTbl
    );

    if (requestTbl == null && !!member) {
      await setRequestTblOption().then((res) => {
        setOnLoading(false);
      });
    }
  };

  const setSubscriptionOption = async () => {
    let tempSubscriptionNameToBudget = {};
    let requestTbl_init = [];
    let requestTblFromServer = [];
    if (member) {
      console.log('memberInitSubscription', member);
      requestTblFromServer = await RequestManagerApi.getRequestTblByMemberId(
        member?.members_tbl?.id
      ).then((res) => {
        console.log('resresres2', res);
      });
    }

    console.log('555 - requestTblFromServer' + requestTblFromServer);

    requestTblFromServer?.forEach((element) => {
      requestTbl_init.push({
        id: element.id,
        optionValue: element.ProjectNameinCloud,
      });

      tempSubscriptionNameToBudget[element.ProjectNameinCloud] = {
        value: element.BudgetOnDemand,
        id: element.id,
      };
    });

    setSubscriptionNameToBudget(tempSubscriptionNameToBudget);
    setSubscriptionName(requestTbl_init);
    console.log(
      '🚀 ~ file: Request.js ~ line 163 ~ setSubscriptionOption ~ tempSubscriptionNameToBudget',
      requestTbl_init
    );
  };

  const toggleCheckBoxComment = (paramter) => {
    for (const [key, value] of Object.entries(isClickErrors)) {
      if (`${key}` === paramter) {
        console.log(paramter);

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
    setOnLoading(false);
    handleCloseDialog();
    setIsClickEror({
      ...FORM_VALUE_ERROR_INIT,
    });
    resetFormValues();
  };

  const resetFormValues = () => {
    setFormsValue({ ...FORM_VALUE_INIT });
  };

  const handleInProccess = () => {
    console.log('before accept Budget to  move owner', formsValue);
    if (Data.id != null) {
      let preperedRequestOwnerDataObject = {
        ...formsValue,
        isRegularRequest: false,
        cloud_name: formsValue.providerCloud,
      };
      console.log(
        'after accept Budget to  move owner',
        preperedRequestOwnerDataObject
      );
      setOnLoading(true);

      RequestManagerApi.createOwnerRequestBudget(
        Data.id,
        preperedRequestOwnerDataObject
      )
        .then((data) => {
          console.log('🚀 ~ file: Request.js ~ line 308 ~ .then ~ data', data);
          ManagerRequestPage_RefreshData();
          toast.success('פרטי הבקשה עודכנו');
          handleClose();
        })
        .catch((e) => {
          console.log('createNewGate -> e', e);
          alert('הבקשה נדחתה');
        });
    } else {
      toast.error('הבקשה נדחתה');
    }
  };

  const handleDenied = () => {
    console.log('handleDenied values', formsValue);

    if (Data.id != null) {
      let preperedDeniedBudgetRequest =
        preperedDeniedBudgetRequestByValues(formsValue);
      setOnLoading(true);

      RequestManagerApi.deniedBudgetRequest(
        Data.id,
        preperedDeniedBudgetRequest
      )
        .then((data) => {
          console.log('🚀 ~ file: Request.js ~ line 308 ~ .then ~ data', data);
          ManagerRequestPage_RefreshData();
          toast.success('פרטי הבקשה עודכנו');
          handleClose();
        })
        .catch((e) => {
          console.log('createNewGate -> e', e);
          toast.error('הבקשה נכשלה');
        });
    } else {
      toast.error('הבקשה נכשלה');
    }
  };
  const handleCanceled = () => {
    console.log('handleDenied values', formsValue);

    if (Data.id != null) {
      let preperedDeniedBudgetRequest =
        preperedDeniedBudgetRequestByValues(formsValue);
      setOnLoading(true);

      RequestManagerApi.cancelBudgetRequest(
        Data.id,
        preperedDeniedBudgetRequest
      )
        .then((data) => {
          console.log('🚀 ~ file: Request.js ~ line 308 ~ .then ~ data', data);
          ManagerRequestPage_RefreshData();
          toast.success('פרטי הבקשה עודכנו');
          handleClose();
        })
        .catch((e) => {
          console.log('createNewGate -> e', e);
          toast.error('הבקשה נכשלה');
        });
    } else {
      toast.error('הבקשה נכשלה');
    }
  };

  const handleAccept = () => {
    if (Data.id != null) {
      setOnLoading(true);

      RequestManagerApi.aprrovedBudgetRequest(Data.id)
        .then((data) => {
          console.log('🚀 ~ file: Request.js ~ line 308 ~ .then ~ data', data);
          ManagerRequestPage_RefreshData();
          toast.success('בקשת עדכון תקציב הועברה לסטאטוס אישור');
          RequestManagerApi.updateRequestAfterAprrove(
            requestID,
            Data.NewBudget
          ).then((res) => {
            console.log('updateBudgetAffterAprrove');
          });
          handleClose();
        })
        .catch((e) => {
          console.log('handleAccept -> e', e);
          toast.error('הבקשה נדחתה');
        });
    } else {
      alert('הבקשה נדחתה');
    }
  };

  const handleUpdate = (values) => {
    let preperedDeniedBudgetRequest =
      preperedUpdateBudgetRequestByValues(values);
    console.log(
      '🚀 ~ file: Request.js ~ line 250 ~ handleUpdate ~ preperedDeniedBudgetRequest',
      preperedDeniedBudgetRequest
    );
    if (Data.id != null) {
      setOnLoading(true);

      RequestManagerApi.updateBudgetRequest(
        values.BudgetID,
        preperedDeniedBudgetRequest
      )
        .then((data) => {
          console.log('🚀 ~ file: Request.js ~ line 308 ~ .then ~ data', data);
          ManagerRequestPage_RefreshData();
          toast.success('בקשת עדכון תקציב עודכנה בהצלחה');
          handleClose();
        })
        .catch((e) => {
          console.log('handleAccept -> e', e);
          alert('הבקשה נכשלה');
        });
    } else {
      alert('הבקשה נכשלה');
    }
  };

  const preperedDeniedBudgetRequestByValues = (values) => {
    let preperedObject = {
      SubscriptionName_deniedNote: values.SubscriptionName_deniedNote,
      NewBudgetNotes: values.NewBudget_deniedNote,
      NewBudgetNotes_deniedNote: values.NewBudgetNotes_deniedNote,
      general_deniedNote: values.general_deniedNote,
    };

    return preperedObject;
  };

  const preperedUpdateBudgetRequestByValues = (values) => {
    let preperedObject = {
      SubscriptionName: values.SubscriptionName,
      NewBudget: values.NewBudget,
      NewBudgetNotes: values.NewBudgetNotes,
      requests_tbl: values.BudgetID,
      //      requests_tbl: subscriptionNameToBudget[values.SubscriptionName]?.id,
    };

    return preperedObject;
  };

  const mapDataObjectToFormValues = (data) => {
    console.log(
      '🚀 ~ file: Request.js ~ line 259 ~ mapDataObjectToFormValues ~ data',
      data
    );
    if (!data) {
      return { ...FORM_VALUE_INIT };
    }
    let preperedFormValuesObject = { ...FORM_VALUE_INIT };

    preperedFormValuesObject.CurrentBudget = data.CurrentBudget;
    preperedFormValuesObject.NewBudget = data.NewBudget;
    preperedFormValuesObject.BudgetID = data.id;
    preperedFormValuesObject.requests_status_tbl = data.requests_status_tbl;
    preperedFormValuesObject.members_tbl = data.members_tbl;
    preperedFormValuesObject.NewBudgetNotes = data.NewBudgetNotes;
    preperedFormValuesObject.SubscriptionName = data.SubscriptionName;

    preperedFormValuesObject.SubscriptionName_deniedNote =
      data.SubscriptionName_deniedNote;
    preperedFormValuesObject.NewBudget_deniedNote = data.NewBudgetNotes;
    preperedFormValuesObject.NewBudgetNotes_deniedNote =
      data.NewBudgetNotes_deniedNote;
    preperedFormValuesObject.general_deniedNote = data.general_deniedNote;

    console.log(
      '🚀 ~ file: Request.js ~ line 288 ~ mapDataObjectToFormValues ~ preperedFormValuesObject',
      preperedFormValuesObject
    );

    return preperedFormValuesObject;
  };
  /* 
    Display Read Only field always on Manager mode or on UserMode when status is not denied

    Display SelectFormik field on UserMode and status is denied
   */
  const isFieldEnableToEdit = () => {
    return !isUserMode || !isDenied;
  };

  /*
        Display checkbox only on UserMode and when status is not denied and also check is deniedNote is not null or empty  */
  const isNeedToDisplayCheckBox = (deniedNote) => {
    return !isDenied && isUserMode && !!deniedNote;
    //!isDenied && isUserMode && !!values.providerCloud_deniedNote;
  };
  /* 
        Display checkBox as checked when field has any error or on usermode and there is any text in denined note
      */
  const isCheckBoxChecked = (hasAnyError, deniedNote) => {
    return hasAnyError || (isUserMode && !!deniedNote);
  };

  /*
        Display comment field only when field have any error or denied node is not null or empty
      */
  const isCommentFieldDisplay = (hasAnyError, deniedNote) => {
    return !!deniedNote || hasAnyError;
  };

  useEffect(() => {
    console.log('memberBudger', member);
    const initOptions = () => {
      if (Data != null) {
        let tempFromsValue = mapDataObjectToFormValues(Data);
        setFormsValue({ ...tempFromsValue });

        setSubscriptionOption();
      }
    };
    initAllOptions();

    initOptions();
  }, [member]);

  return (
    <div dir='rtl' className={classes.root}>
      <Dialog
        maxWidth={'sm'}
        fullWidth={true}
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'>
        <div className={classes.header}>
          <div dir='ltr'>
            <Divider />
          </div>
        </div>

        <BootstrapDialogTitle
          id='customized-dialog-title'
          onClose={handleClose}
          onClick={() => console.log('Dta,', Data)}
          isBudgetRequests={true}>
          {new String('טופס אישור תקציב ').concat(Data?.DisplayNumber)}
        </BootstrapDialogTitle>
        <Divider />
        {!onLoading ? (
          <Formik
            enableReinitialize={true}
            initialValues={mapDataObjectToFormValues(Data)}
            validationSchema={Yup.object().shape({})}
            onSubmit={async (
              values,
              { resetForm, setErrors, setStatus, setSubmitting }
            ) => {
              try {
                console.log('In subbmit');
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
                            <strong style={{ fontSize: 16 }}>
                              בחר עבור איזה פרויקט:
                            </strong>
                          </Box>
                        </Grid>
                        {isFieldEnableToEdit() ? (
                          <TextField
                            className={classes.textFieldReadOnly}
                            error={Boolean(
                              touched.SubscriptionName &&
                                errors.SubscriptionName
                            )}
                            helperText={
                              touched.SubscriptionName &&
                              errors.SubscriptionName
                            }
                            name='SubscriptionName'
                            placeholder={''}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            variant='outlined'
                            onClick={() =>
                              console.log('po', DataRow.SubscriptionName)
                            }
                            value={DataRow.SubscriptionName}
                            disabled={isFieldEnableToEdit()}
                          />
                        ) : (
                          <SelectFormik
                            name='ProjectNameinCloud'
                            options={requestTbl}
                            value={values.SubscriptionName}
                          />
                        )}

                        <Checkbox
                          style={{
                            display: isNeedToDisplayCheckBox() ? 'none' : '',
                            color: DENIED_CHECKBOX_COLOR,
                          }}
                          disabled={isUserMode}
                          checked={isCheckBoxChecked(
                            isClickErrors.schedulingCloud,
                            values.scheduling_deniedNote
                          )}
                          onClick={() =>
                            toggleCheckBoxComment('SubscriptionName_deniedNote')
                          }
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      </Grid>

                      {isCommentFieldDisplay(
                        isClickErrors.schedulingCloud,
                        values.scheduling_deniedNote
                      ) && (
                        <>
                          <Grid
                            sx={{
                              mb: 3,
                            }}
                            item
                            xs={12}
                            sm={8}
                            md={9}>
                            <Grid>
                              <Box>
                                <strong style={{ fontSize: 16 }}>
                                  הערת המאשר:
                                </strong>
                              </Box>
                            </Grid>
                            <TextField
                              multiline
                              rows={3}
                              className={classes.textFieldReadOnly}
                              onChange={(e) =>
                                handleFormsValueChange(
                                  'SubscriptionName_deniedNote',
                                  e.target.value
                                )
                              }
                              disabled={isUserMode}
                              value={formsValue.SubscriptionName_deniedNote}
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
                        sm={8}
                        md={9}>
                        <Grid>
                          <Box>
                            <strong style={{ fontSize: 16 }}>
                              תקציב נוכחי:
                            </strong>
                          </Box>
                        </Grid>
                        <TextField
                          disabled
                          error={Boolean(
                            touched.currectBudget && errors.currectBudget
                          )}
                          fullWidth
                          className={classes.textFieldReadOnly}
                          helperText={
                            touched.currectBudget && errors.currectBudget
                          }
                          name='CurrentBudget'
                          variant='outlined'
                          value={
                            requestTb_projectNameToBudget[
                              values.ProjectNameinCloud
                            ]
                          }
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
                            <strong style={{ fontSize: 16 }}>
                              {' '}
                              תקציב מבוקש:
                            </strong>
                          </Box>
                        </Grid>
                        <TextField
                          error={Boolean(touched.newBudget && errors.newBudget)}
                          fullWidth
                          className={classes.textFieldReadOnly}
                          helperText={touched.newBudget && errors.newBudget}
                          name='NewBudget'
                          placeholder={'תקציב מבוקש'}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={
                            isUserMode ? values.NewBudget : DataRow.NewBudget
                          }
                          disabled={isFieldEnableToEdit()}
                          variant='outlined'
                          type='number'
                        />
                        <Checkbox
                          style={{ color: DENIED_CHECKBOX_COLOR }}
                          checked={
                            isClickErrors.NewBudget_deniedNote ||
                            (isUserMode && !!values.NewBudget_deniedNote)
                          }
                          disabled={isUserMode}
                          onClick={() =>
                            toggleCheckBoxComment('NewBudget_deniedNote')
                          }
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      </Grid>

                      {((isUserMode &&
                        isDenied &&
                        !!values.NewBudget_deniedNote) ||
                        isClickErrors.NewBudget_deniedNote) && (
                        <>
                          <Grid
                            sx={{
                              mb: 3,
                            }}
                            item
                            xs={12}
                            sm={8}
                            md={9}>
                            <Grid>
                              <Box>
                                <strong style={{ fontSize: 16 }}>
                                  הערת המאשר:
                                </strong>
                              </Box>
                            </Grid>
                            <TextField
                              multiline
                              rows={3}
                              className={classes.textFieldReadOnly}
                              style={{ width: '25rem' }}
                              disabled={isUserMode}
                              onChange={(e) =>
                                handleFormsValueChange(
                                  'NewBudget_deniedNote',
                                  e.target.value
                                )
                              }
                              value={formsValue.NewBudget_deniedNote}
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
                        sm={8}
                        md={9}>
                        <Grid>
                          <Box>
                            <strong style={{ fontSize: 16 }}>
                              פירוט הבקשה :
                            </strong>
                          </Box>
                        </Grid>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          className={classes.textFieldReadOnly}
                          name='NewBudgetNotes'
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={
                            isUserMode
                              ? values.NewBudgetNotes
                              : DataRow.NewBudgetNotes
                          }
                          disabled={!(isUserMode && isDenied)}
                          variant='outlined'
                        />
                        <Checkbox
                          style={{ color: DENIED_CHECKBOX_COLOR }}
                          disabled={isUserMode}
                          checked={
                            isClickErrors.NewBudgetNotes_deniedNote ||
                            (isUserMode && !!values.NewBudgetNotes_deniedNote)
                          }
                          onClick={() =>
                            toggleCheckBoxComment('NewBudgetNotes_deniedNote')
                          }
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      </Grid>
                      {((isUserMode &&
                        isDenied &&
                        !!values.NewBudgetNotes_deniedNote) ||
                        isClickErrors.NewBudgetNotes_deniedNote) && (
                        <>
                          <Grid
                            sx={{
                              mb: 3,
                            }}
                            item
                            xs={12}
                            sm={8}
                            md={9}>
                            <Grid>
                              <Box>
                                <strong style={{ fontSize: 16 }}>
                                  הערת המאשר:
                                </strong>
                              </Box>
                            </Grid>
                            <TextField
                              disabled={isUserMode}
                              rows={3}
                              className={classes.textFieldReadOnly}
                              style={{ width: '25rem' }}
                              multiline
                              onChange={(e) =>
                                handleFormsValueChange(
                                  'NewBudgetNotes_deniedNote',
                                  e.target.value
                                )
                              }
                              value={formsValue.NewBudgetNotes_deniedNote}
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
                                  {'You have uploaded'} <b>{files.length}</b>{' '}
                                  {'files'}!
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
                              isClickErrors.file ||
                              (isUserMode && !!values.file_deniedNote)
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
                                <strong style={{ fontSize: 16 }}>
                                  הערת המאשר:
                                </strong>
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
                        sm={8}
                        md={9}>
                        <Grid>
                          <Box>
                            <strong style={{ fontSize: 16 }}>
                              {'הערות כלליות:'}
                            </strong>
                          </Box>
                        </Grid>
                        <TextField
                          rows={4}
                          multiline
                          disabled={isUserMode}
                          className={classes.textFieldReadOnly}
                          style={{ width: '25rem' }}
                          onChange={(e) =>
                            handleFormsValueChange(
                              'general_deniedNote',
                              e.target.value
                            )
                          }
                          value={formsValue.general_deniedNote}
                          variant='outlined'
                        />
                      </Grid>
                    </Grid>
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
                    {!isUserMode ? (
                      <div>
                        <Button
                          sx={{ mr: 2 }}
                          color='secondary'
                          variant='contained'
                          // disabled={validateStep(formsValue)}
                          size='large'
                          onClick={handleInProccess}
                          style={{
                            margin: '0 .5rem',
                          }}>
                          {'לאישור סופי'}
                        </Button>
                        <Button
                          sx={{ mr: 2 }}
                          color='secondary'
                          variant='contained'
                          // disabled={validateStep(formsValue)}
                          size='large'
                          onClick={handleCanceled}
                          style={{
                            margin: '0 .5rem',
                          }}>
                          {'ביטול בקשה'}
                        </Button>
                        <Button
                          sx={{ mr: 2 }}
                          color='warning'
                          variant='contained'
                          // disabled={validateStep(formsValue)}
                          size='large'
                          onClick={handleDenied}
                          style={{
                            margin: '0 .5rem',
                            background: '#f44336',
                          }}>
                          {'לא מאשר'}
                        </Button>
                        <Button
                          sx={{ mr: 2 }}
                          variant='contained'
                          // disabled={validateStep(formsValue)}
                          size='large'
                          onClick={handleAccept}
                          style={{
                            margin: '0 .5rem',
                            backgroundColor: 'green',
                          }}>
                          {'מאשר בקשה'}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        sx={{ mr: 2 }}
                        sx={{ mr: 2 }}
                        color='primary'
                        variant='contained'
                        disabled={!isBudgerDenied}
                        // disabled={validateStep(formsValue)}
                        size='large'
                        onClick={() => handleUpdate(values)}
                        style={{ margin: '0 .5rem', background: 'orange' }}>
                        {' שלח לאישור מחדש'}
                      </Button>
                    )}
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
{
  /* <Button
                      sx={{ mr: 2 }}
                      color='primary'
                      variant='contained'
                      // disabled={validateStep(formsValue)}
                      size='large'
                      onClick={() => handleUpdate(values)}
                      style={{
                        margin: '0 .5rem',
                        width: 100,
                        alignSelf: 'center',
                        height: 45,
                      }}>
                      {'שלח לאישור מחדש '}
                    </Button> */
}
