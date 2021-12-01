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
  DialogTitle,
} from '@material-ui/core';
import * as Yup from 'yup';
import Stepper from '../../Stepper';
import { Formik } from 'formik';
import DatePicker from '@material-ui/lab/DatePicker';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import CloseTwoToneIcon from '@material-ui/icons/CloseTwoTone';

import { useState, useContext } from 'react';
import StepOne from './Steps/StepOne';
import StepTwo from './Steps/StepTwo';
import StepThree from './Steps/StepThree';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import AuthContext from '../../../../context/AuthContext';
import { useEffect } from 'react';
import axios from 'axios';
import { element } from 'prop-types';
import SelectFormik from './SelectFormik';
import { toast } from 'react-toastify';
import { experimentalStyled } from '@material-ui/core/styles';
import CloudUploadTwoToneIcon from '@material-ui/icons/CloudUploadTwoTone';

import RequestManagerApi from '../../../api/request-manager-api';
import GeneralConstants from '../../../constants/status-constants';
import BootstrapDialogTitle from '../../../shared-components/BootstrapDialogTitle';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: '2px 0 5px 0',
    textAlign: 'center',
    color: '#5569ff',
    fontSize: 22,
    fontWeight: 'bold',
    width: 350,
  },
  header: {
    display: 'flex',
    // flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerCloseButton: {
    fontSize: 30,
    height: 0,
    margin: 0,
    cursor: 'pointer',
  },
}));

const FORM_VALUE_ERROR_INIT = {
  requestID: '',
  ProjectNameinCloud: '',
  subscriptionToken: '',
  subscripitionID: '',
  currectBudget: '',
  newBudget: '',
  requestNote: '',
  submit: null,
};
const RequestOptions = [];
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
export default function RequestBudgetDialog({
  handleCloseDialog,
  open,
  ManagerRequestPage_RefreshData,
}) {
  const classes = useStyles();
  const [requestTbl, setRequestTbl] = useState(null);
  const [requestTb_projectNameToBudget, setRequestTb_projectNameToBudget] =
    useState({});
  const [subScripitionCloud, setSubscripitionCloud] = useState([]);
  const [onLoading, setOnLoading] = useState(true);

  const [initValues, setInitValues] = useState({
    ...FORM_VALUE_ERROR_INIT,
  });
  const { member } = useContext(AuthContext);

  const handleAccept = (values) => {
    let requestIdForAccept = null;
    requestTbl.forEach((element) => {
      if (element.optionValue === values.ProjectNameinCloud) {
        requestIdForAccept = element.id;
      }
    });
    console.log(
      '🚀 ~ file: Request.js ~ line 124 ~ handleAccept ~ requestIdForAccept',
      requestIdForAccept
    );
    var randomNumberToDispaly = Math.floor(10000 + Math.random() * 90000);

    let preperedData = {
      DisplayNumber: 'B-' + randomNumberToDispaly,
      SubscriptionName: values.ProjectNameinCloud,
      CurrentBudget: requestTb_projectNameToBudget[values.ProjectNameinCloud],
      NewBudget: values.newBudget,
      NewBudgetNotes: values.requestNote,
      members_tbl: {
        _id: member.id,
      },
      requests_status_tbl: {
        _id: GeneralConstants.requestTblStatuses.submitted.id,
      },
      requests_tbl: {
        _id: requestIdForAccept,
      },
    };
    console.log(
      '🚀 ~ file: Request.js ~ line 110 ~ handleAccept ~ preperedData',
      preperedData
    );
    setOnLoading(true);

    RequestManagerApi.submittedBudgetDataRequest(preperedData)
      .then((data) => {
        console.log('🚀 ~ file: Request.js ~ line 308 ~ .then ~ data', data);
        ManagerRequestPage_RefreshData();
        toast.success('בקשת עדכון סטטוס נשלחה בהצלחה');
        handleClose();
      })
      .catch((e) => {
        console.log('handleAccept -> e', e);
        toast.error('הבקשה נדחתה');
      });
  };

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

  const validateStep = (values) => {
    if (
      !!values.ProjectNameinCloud &&
      !!values.newBudget &&
      !!values.requestNote
    ) {
      return false;
    }

    return true;
  };

  useEffect(() => {
    initAllOptions();
  }, [member]);

  const handleClose = () => {
    setOnLoading(false);
    handleCloseDialog();
    // setRequestTbl(null)
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
    <div dir='rtl' className={classes.root}>
      <Dialog
        maxWidth={'sm'}
        fullWidth={true}
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby='form-dialog-title'>
        <BootstrapDialogTitle
          id='customized-dialog-title'
          onClose={handleClose}>
          בקשה לשינוי תקציב{' '}
        </BootstrapDialogTitle>
        {!onLoading ? (
          <Formik
            initialValues={initValues}
            validationSchema={Yup.object().shape({
              //Invalid currect
              subscriptionName: Yup.string().max(255),
              newBudget: Yup.string()
                .max(255)
                .required('The fullname field is required'),
              requestNote: Yup.string()
                .max(255)
                .required('The fullname field is required'),
            })}
            onSubmit={async (
              values,
              { resetForm, setErrors, setStatus, setSubmitting }
            ) => {
              try {
                //After subbmit
                console.log(
                  '🚀 ~ file: Request.js ~ line 219 ~ RequestBudgetDialog ~ values',
                  values
                );
                handleAccept(values);

                // /update-budget-requests-tbls
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
                handleClose();
                // handleCreateProjectSuccess();
              } catch (err) {
                console.error(err);
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
                        <SelectFormik
                          name='ProjectNameinCloud'
                          options={requestTbl}
                          value={values.ProjectNameinCloud}
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
                              תקציב נוכחי:
                            </strong>
                          </Box>
                        </Grid>

                        <TextField
                          error={Boolean(
                            touched.currectBudget && errors.currectBudget
                          )}
                          fullWidth
                          helperText={
                            touched.currectBudget && errors.currectBudget
                          }
                          name='currectBudget'
                          placeholder={''}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          variant='outlined'
                          disabled
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
                              הזן תקציב מבוקש :
                            </strong>
                          </Box>
                        </Grid>
                        <TextField
                          error={Boolean(touched.newBudget && errors.newBudget)}
                          fullWidth
                          helperText={touched.newBudget && errors.newBudget}
                          name='newBudget'
                          placeholder={'תקציב מבוקש'}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.newBudget}
                          variant='outlined'
                          type='number'
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
                              פירוט הבקשה :
                            </strong>
                          </Box>
                        </Grid>
                        <TextField
                          error={Boolean(
                            touched.requestNote && errors.requestNote
                          )}
                          fullWidth
                          multiline
                          rows={2}
                          helperText={touched.requestNote && errors.requestNote}
                          name='requestNote'
                          placeholder={'פירוט הבקשה'}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.requestNote}
                          variant='outlined'
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
                              קובץ הערכת עלויות מתוך מחשבון ספקית הענן המבוקשת:
                            </strong>
                          </Box>
                        </Grid>
                        <BoxUploadWrapper {...getRootProps()}>
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
                            <Alert sx={{ py: 0, mt: 2 }} severity='success'>
                              {'You have uploaded'} <b>{files.length}</b>{' '}
                              {'files'}!
                            </Alert>
                            <Divider sx={{ mt: 2 }} />
                            <List disablePadding component='div'>
                              {files}
                            </List>
                          </>
                        )}
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
                    }}>
                    <div className={classes.header}>
                      <div className={classes.headerButtons}>
                        <Button
                          sx={{ mr: 2 }}
                          variant={
                            validateStep(values) ? 'outlined' : 'contained'
                          }
                          type='submit'
                          color={validateStep(values) ? 'secondary' : 'primary'}
                          disabled={validateStep(values)}
                          size='large'
                          // onClick={handleAccept}
                          style={{ margin: '0 .5rem' }}>
                          {'שלח לאישור'}
                        </Button>
                        {/* <Button
                          sx={{ mr: 2 }}
                          variant='contained'
                          size='large'
                          color='secondary'
                          style={{
                            margin: '0 .5rem',
                            background:
                              GeneralConstants.colorByStatusRequest('draft'),
                          }}>
                          {'שמור טיוטה'}
                        </Button> */}
                      </div>
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
      </Dialog>
    </div>
  );
}

export async function getStaticProps() {
  // Fetch events
  const dataRes = await fetch(`${API_URL}/requests-tbls`);
  const Data = await dataRes.json();
  console.log(Data);
  return {
    props: { Data },
  };
}
