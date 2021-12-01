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
  DialogTitle,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import Stepper from '../../Stepper';
import { Formik } from 'formik';
import SubscriptionsManager from 'src/shared-components/SubscriptionsManager';
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
import RequestManagerApi from '../../../api/request-manager-api';
import { toast } from 'react-toastify';
import router, { useRouter } from 'next/router';
import Loader from '../../../utils/Loader';
import GeneralConstants from '../../../constants/status-constants';
import BootstrapDialogTitle from '../../../shared-components/BootstrapDialogTitle';
import { socket } from '../../../../components/util/web-socket';
import { API_URL } from '../../../../config/index';
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
  emailToSend: '',
  phone_deniedNote: '',
  title: '',
  summaryProject: '',
  title_deniedNote: '',
  ccfoFullName: '',
  ccfoFullName_deniedNote: '',
  ccfoEmail: '',
  ccfoEmail_deniedNote: '',
  ccfoPhone: '',
  ccfoPhone_deniedNote: '',

  //Step Two
  cloud_name: '',
  nameInCloud_deniedNote: '',
  permission: '',
  permission_deniedNote: '',
  providerCloud: '6116a1db8e3a766c4b744625',
  providerCloud_deniedNote: '',
  environmentCloud: '',
  environment_deniedNote: '',
  schedulingCloud: '',
  scheduling_deniedNote: '',
  reasonOfUnUseofScheduling: '',
  reasonOfUnUseofScheduling_deniedNote: '',

  //Step three
  budget: 0,
  budgetOption: '',
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

export default function AcceptRequestSubscriptionDialog({
  handleCloseDialog,
  open,
  Data,
  ManagerRequestPage_RefreshData,
  isUserMode,
  const_Budget,
  isOwnerMode,
}) {
  console.log('objectobject', Data);
  const limitBudget = Data?.BudgetOnDemand < const_Budget ? true : false;
  const classes = useStyles();
  const isDenied = Data?.requests_status_tbl?.RequestsStatusName === 'denied';
  const isApprove =
    GeneralConstants.requestTblIdToStatusName[
      Data?.requests_status_tbl?._id
    ] === 'approved';
  console.log('isApprove', isApprove);
  const [formsValue, setFormsValue] = useState({ ...FORM_VALUE_INIT });
  const [subscription, setSubscription] = useState();
  const [isReload, setIsRelaod] = useState(false);

  const [onProccess, setOnProccess] = useState(false);
  const [onLoading, setOnLoading] = useState(false);
  const [isClickErrors, setIsClickEror] = useState({
    ...FORM_VALUE_ERROR_INIT,
  });
  function pushUpdateNotification() {
    socket.emit('updateApiCall');
    setTimeout(() => {
      router.reload();
    }, 1200);
  }

  useEffect(() => {
    console.log('isReload', isReload);
    if (isReload) {
      socket.on('notification', (data) => {
        console.log('Start Soket');

        setTimeout(() => {
          console.log('inSocket');
          router.reload();
          toast.success(',נוצרה בקשה חדשה במערכת');
        }, 1800);
        console.log('finish Soket');
      });
    }
  }, [isReload]);

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

  // const handleSendEmail = (data) => {
  //   console.log('emailSend', data);
  //   RequestManagerApi.SendEmail(
  //     'בקשה אושרה',
  //     'BODY בקשה אושרה',
  //     'portal@gmail.com',
  //     'bshabi1994@gmail.com'
  //   )
  //     .then((data) => {
  //       console.log(
  //         '🚀 ~ file: Request.js ~ line 194 ~ handleSendEmail ~ data',
  //         data
  //       );
  //       toast.success('המייל נשלח בהצלחה!');
  //     })
  //     .catch((e) => {
  //       console.log(
  //         '🚀 ~ file: Request.js ~ line 197 ~ handleSendEmail ~ e',
  //         e
  //       );
  //       toast.error('שליחת המייל נכשלה');
  //     });
  // };

  const isSubscriptionAvaliabe = () => {};

  const handleClose = () => {
    setOnLoading(false);
    handleCloseDialog();
    setIsClickEror({
      ...FORM_VALUE_ERROR_INIT,
    });
    setFormsValue({ ...FORM_VALUE_INIT });
    resetFormValues();
  };

  const resetFormValues = () => {
    setFormsValue({ ...FORM_VALUE_INIT });
  };

  const handleDenied = (values) => {
    const msgInfo = {
      subject: `-התקבלה תשובה לבקשה לפתיחת פרויקט בענן בשם ${values?.cloud_name}`,
      body: `בקשתך נדחתך ממנהל-על הערות: 
      ${values?.general_deniedNote} 
      קישור לאתר https://portal-ictbitt-frontend.herokuapp.com/

      `,
      sender: 'aladdinnotreplay@gmail.com',
      receiver: values.emailToSend,
    };
    console.log('msgInfo', msgInfo);
    if (Data.id != null) {
      let preperedRequestDeniedDataObject = preperedDeniedDataByValues(values);

      setOnLoading(true);

      RequestManagerApi.deniedDataRequest(
        Data.id,
        preperedRequestDeniedDataObject
      )
        .then((data) => {
          console.log('🚀 ~ file: Request.js ~ line 308 ~ .then ~ data', data);
          // ManagerRequestPage_RefreshData();

          toast.success('פרטי הבקשה עודכנו');
          RequestManagerApi.SendEmail(msgInfo)
            .then((res) => toast.success('מייל נשלח עבור העדכון'))
            .catch((error) => console.log(error));
          handleClose();
        })
        .catch((e) => {
          console.log('createNewGate -> e', e);
          alert('הבקשה נדחתה');
        })
        .finally((e) => {
          // setIsRelaod(true);
          pushUpdateNotification();
          getStaticProps();
        });
    } else {
      toast.error('הבקשה נדחתה');
    }
  };

  const handleCanceled = (values) => {
    console.log('here');
    const msgInfo = {
      subject: 'עדכון בקשה מספר' + values?.DisplayNumber,
      body: ' בקשתך בוטלה עבור בקשת סביבת פרויקט חדש',
      sender: 'aladdinnotreplay@gmail.com',
      receiver: values.emailToSend,
    };
    if (Data.id != null) {
      let preperedRequestDeniedDataObject = preperedDeniedDataByValues(values);

      setOnLoading(true);

      RequestManagerApi.cancelDataRequest(
        Data.id,
        preperedRequestDeniedDataObject
      )
        .then((data) => {
          console.log('🚀 ~ file: Request.js ~ line 308 ~ .then ~ data', data);
          //ManagerRequestPage_RefreshData();
          //setIsRelaod(true);
          pushUpdateNotification();
          getStaticProps();
          toast.success('פרטי הבקשה עודכנו');
          RequestManagerApi.SendEmail(msgInfo)
            .then((res) => toast.success('מייל נשלח עבור העדכון'))
            .catch((error) => console.log(error));
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

  const handleInProccess = (value) => {
    console.log('before accept to  move owner', value);
    const msgInfo = {
      subject: `-התקבלה בקשה לפתיחת פרויקט בענן בשם  ${value?.cloud_name}`,
      body: `סטאטוס הבקשה = InProccess
      הערות כלליות  של מאשר נמוך: התקציב שמופיע בבקשה הוא תקציב חורג – נא לאשר / לא לאשר את הבקשה
      הערת מנהל: ${value?.general_deniedNote}
      קישור לאתר https://portal-ictbitt-frontend.herokuapp.com/

      `,
      sender: 'aladdinnotreplay@gmail.com',
      receiver: value.emailToSend,
    };
    console.log(
      '🚀 ~ file: Request.js ~ line 317 ~ handleInProccess ~ msgInfo',
      msgInfo
    );
    if (Data.id != null) {
      let preperedRequestOwnerDataObject = {
        ...value,
        isRegularRequest: false,
        cloud_name: value.providerCloud,
      };
      console.log(
        'after accept to  move owner',
        preperedRequestOwnerDataObject
      );
      setOnLoading(true);

      RequestManagerApi.createOwnerRequest(
        Data.id,
        preperedRequestOwnerDataObject
      )
        .then((data) => {
          console.log('🚀 ~ file: Request.js ~ line 308 ~ .then ~ data', data);
          // ManagerRequestPage_RefreshData();
          // setIsRelaod(true);
          pushUpdateNotification();
          getStaticProps();
          toast.success('פרטי הבקשה עודכנו');
          RequestManagerApi.SendEmail(msgInfo)
            .then((res) => toast.success('מייל נשלח עבור העדכון'))
            .catch((error) => console.log(error));
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

  const handleUpdate = (values) => {
    console.log('values', values);
    const msgInfo = {
      subject: `-התקבלה בקשה לפתיחת פרויקט בענן בשם  ${values?.cloud_name}`,
      body: `סטטוס הבקשה  = RESUBMITED
      הערות כלליות ${values?.general_deniedNote} 
      קישור לאתר https://portal-ictbitt-frontend.herokuapp.com/
      `,
      sender: 'aladdinnotreplay@gmail.com',
      receiver: values.emailToSend,
    };
    if (Data.id != null) {
      let preperedRequestUpdateDataObject = preperedUpdateDataByValues(values);
      // let updatedId = GeneralConstants.requestTblStatuses['Re-Submited'].id;

      // let preperedDataWithStatus = {
      //   ...preperedRequestUpdateDataObject,
      //   requests_status_tbl: {
      //     _id: updatedId,
      //     id: updatedId,
      //   },
      // };
      // console.log('BeforeApi', preperedDataWithStatus);

      setOnLoading(true);

      RequestManagerApi.updateDataRequest(
        Data.id,
        preperedRequestUpdateDataObject
      )
        .then((data) => {
          console.log('🚀 ~ file: Request.js ~ line 308 ~ .then ~ data', data);
          // ManagerRequestPage_RefreshData();
          toast.success('פרטי הבקשה עודכנו');
          // ManagerRequestPage_RefreshData();
          //setIsRelaod(true);
          pushUpdateNotification();
          getStaticProps();
          RequestManagerApi.SendEmail(msgInfo)
            .then((res) => toast.success('מייל נשלח עבור העדכון'))
            .catch((error) => console.log(error));
          handleClose();
        })
        .catch((e) => {
          console.log('Api Callback -> e', e);
          toast.error('הבקשה נכשלה');
        });
    } else {
      toast.error('הבקשה נכשלה');
    }
  };

  const handleAccept = async (values) => {
    var projectName = Data.ProjectNameinCloud;
    var projectBudget = values.budget;

    if (!Data.id) {
      toast.error('הבקשה נדחתה');
      return;
    }

    if (!projectName) {
      toast.error('חסר שם פרויקט בענן');
      return;
    }
    if (!projectBudget) {
      toast.error('חסר תקציב עבור הפרויקט');
    }

    const msgInfo = {
      subject: `-התקבלה תשובה לבקשה לפתיחת פרויקט בענן בשם ${values?.cloud_name}`,
      body: `
      סטטוס הבקשה  = APPROVED  
      הערות כלליות ${values?.general_deniedNote} 
      קישור לאתר https://portal-ictbitt-frontend.herokuapp.com/
      `,
      sender: 'aladdinnotreplay@gmail.com',
      receiver: values.emailToSend,
    };
    setOnLoading(true);
    /**
     * Step FirstOne - Aprrove request,change status to Aprrove in DB
     */
    RequestManagerApi.approvedDataRequest(Data.id)
      .then((data) => {
        // TODO:Set Rename after Approve
        toast.success('הבקשה הועברה לסטאטוס אישור');
        /**
         * FirstTwo - Send email to Soldier and Manager
         * TODO:
         * change sender in msg info
         */
        RequestManagerApi.SendEmail(msgInfo)
          .then((res) => toast.success('מייל נשלח עבור העדכון'))
          .catch((error) => console.log(error));
        // handleSendEmail(formsValue.emailToSend);
        handleClose();
      })
      .catch((e) => {
        console.log('handleAccept -> e', e);
        setOnProccess(false);
        toast.error('הבקשה נדחתה');
      });
    setOnProccess(true);

    // Get all subscriptions
    var allSubscriptions = await SubscriptionsManager.getAllSubscriptions();

    console.log('allSubscriptions', allSubscriptions);
    // Check not empty
    if (!allSubscriptions) {
      toast.error('זמן תוקף תם,יש להתחבר מחדש');
      return;
    }

    // Get first available subscription
    var avaliabeSubscription =
      SubscriptionsManager.getFirstAvaliabeSubscription(allSubscriptions);

    // Sanity chack
    if (!avaliabeSubscription) {
      toast.warning('אין סביבות עבודה פנויות ');
      setOnProccess(false);
      handleClose();
      return;
    }

    var isSucceded = await SubscriptionsManager.renameSubscription(
      avaliabeSubscription,
      projectName
    );

    if (!isSucceded) {
      toast.warning('החלפת שם נכשלה!');
    }
    toast.success('החלפת שם בוצעה בהצלחה!');

    var tagFromValue = {
      envierment: Data?.cloud_environment_area_name?.CloudEnvironmentAreaName,
      scheduling: Data?.scheduling?.SchedulingOption,
      period: Data?.budget_kind_tbl?.BudgetKindName,
      portalName: Data?.ProjectNameinCloud,
    };
    isSucceded = await SubscriptionsManager.setTag(
      avaliabeSubscription,
      tagFromValue
    );

    if (!isSucceded) {
      toast.warning('הוספת תגיות נכשלה!');
    }
    toast.success('הוספת תגיות בוצע בהצלחה!');

    isSucceded = await SubscriptionsManager.setBudget(
      avaliabeSubscription,
      projectBudget
    );
    console.log(
      '🚀 ~ file: Request.js ~ line 514 ~ handleAccept ~ isSucceded',
      isSucceded
    );
    if (!isSucceded) {
      toast.warning('הוספת תקציב נכשלה!');
    }
    if (isSucceded) {
      console.log('isReload1', isReload);
      // setIsRelaod(true);
      console.log('isReload3', isReload);
      pushUpdateNotification();
      getStaticProps();
    }
    toast.success('הוספת תקציב בוצע בהצלחה!');
    setOnProccess(false);

    // //Add Permssion

    // RequestManagerApi.addPremssionToSubscription()
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    // return;

    // //Delete Budget
    // RequestManagerApi.deleteBudgetFromSubscription()
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((error) => console.log(error));

    // return;
    // //Create Budget
    // RequestManagerApi.createBudgetInAzurePortal()
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  const preperedUpdateDataByValues = (values) => {
    var today = new Date();
    var currentJsonDate = today.toJSON();

    let preperedObject = {
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
      // cloud_permissiontbl: {
      //   _id: values.permissionOnCloud,
      // },
      LastDateUpdateRequest: currentJsonDate,

      BudgetReasonNotes: values.commandOfBudget,
    };

    return preperedObject;
  };

  const preperedDeniedDataByValues = (values) => {
    let preperedObject = {
      fullname_deniedNote: values.fullname_deniedNote,
      phone_deniedNote: values.phone_deniedNote,
      title_deniedNote: values.title_deniedNote,
      ccfoFullName_deniedNote: values.ccfoFullName_deniedNote,
      ccfoEmail_deniedNote: values.ccfoEmail_deniedNote,
      ccfoPhone_deniedNote: values.ccfoPhone_deniedNote,
      nameInCloud_deniedNote: values.nameInCloud_deniedNote,
      permission_deniedNote: values.permission_deniedNote,
      providerCloud_deniedNote: values.providerCloud_deniedNote,
      environment_deniedNote: values.environment_deniedNote,
      scheduling_deniedNote: values.scheduling_deniedNote,
      reasonOfUnUseofScheduling_deniedNote:
        values.reasonOfUnUseofScheduling_deniedNote,
      budget_deniedNote: values.budget_deniedNote,
      file_deniedNote: values.file_deniedNote,
      limitProject_deniedNote: values.limitProject_deniedNote,
      commandOfBudget_deniedNote: values.commandOfBudget_deniedNote,
      submit_deniedNote: values.submit_deniedNote,
      general_deniedNote: values.general_deniedNote,
    };

    return preperedObject;
  };
  const preperedInProcccessDataByValues = (values) => {
    let preperedObject = {
      fullname_deniedNote: values.fullname_deniedNote,
      phone_deniedNote: values.phone_deniedNote,
      title_deniedNote: values.title_deniedNote,
      ccfoFullName_deniedNote: values.ccfoFullName_deniedNote,
      ccfoEmail_deniedNote: values.ccfoEmail_deniedNote,
      ccfoPhone_deniedNote: values.ccfoPhone_deniedNote,
      nameInCloud_deniedNote: values.nameInCloud_deniedNote,
      permission_deniedNote: values.permission_deniedNote,
      providerCloud_deniedNote: values.providerCloud_deniedNote,
      environment_deniedNote: values.environment_deniedNote,
      scheduling_deniedNote: values.scheduling_deniedNote,
      reasonOfUnUseofScheduling_deniedNote:
        values.reasonOfUnUseofScheduling_deniedNote,
      budget_deniedNote: values.budget_deniedNote,
      file_deniedNote: values.file_deniedNote,
      limitProject_deniedNote: values.limitProject_deniedNote,
      commandOfBudget_deniedNote: values.commandOfBudget_deniedNote,
      submit_deniedNote: values.submit_deniedNote,
      general_deniedNote: values.general_deniedNote,
      isRegularRequest: false,
    };

    return preperedObject;
  };
  const mapDataObjectToErrorChackboxValues = (data) => {
    let tempCheckboxObj = { ...FORM_VALUE_ERROR_INIT };

    tempCheckboxObj.CloudName = !!data.providerCloud_deniedNote ? true : false;
    tempCheckboxObj.permissionOnCloud = !!data.permission_deniedNote
      ? true
      : false;
    tempCheckboxObj.nameInCloud = !!data.nameInCloud_deniedNote ? true : false;
    tempCheckboxObj.providerCloud = !!data.providerCloud_deniedNote
      ? true
      : false;
    tempCheckboxObj.environmentCloud = !!data.environment_deniedNote
      ? true
      : false;
    tempCheckboxObj.schedulingCloud = !!data.scheduling_deniedNote
      ? true
      : false;
    tempCheckboxObj.budget = !!data.budget_deniedNote ? true : false;
    tempCheckboxObj.file = !!data.file_deniedNote ? true : false;
    tempCheckboxObj.limiteProject = !!data.limitProject_deniedNote
      ? true
      : false;
    tempCheckboxObj.reasonOfUnUseofScheduling =
      !!data.reasonOfUnUseofScheduling_deniedNote ? true : false;

    return tempCheckboxObj;
  };

  const mapDataObjectToFormValues = (data) => {
    if (!data) {
      return { ...FORM_VALUE_INIT };
    }
    console.log(
      '🚀 ~ file: Request.js ~ line 299 ~ mapDataObjectToFormValues ~ data',
      data
    );
    let budgetOptinFromData = data?.budget_kind_tbl?.id;

    console.log('BudgetKindValue', budgetOptinFromData);

    let preperedFormValuesObject = { ...FORM_VALUE_INIT };

    preperedFormValuesObject.fullname = data.fullname;
    preperedFormValuesObject.DisplayNumber = data.DisplayNumber;
    preperedFormValuesObject.fullname = data.emailToSend;
    preperedFormValuesObject.statusRequest = data.requests_status_tbl._id;
    preperedFormValuesObject.phone = data.phone;
    preperedFormValuesObject.title = data.title;
    preperedFormValuesObject.cloud_name = data.title;
    preperedFormValuesObject.emailToSend = data.emailToSend;
    preperedFormValuesObject.summaryProject = data.summaryProject;
    preperedFormValuesObject.nameInCloud = data.ProjectNameinCloud;
    preperedFormValuesObject.budget = data.BudgetOnDemand;
    preperedFormValuesObject.budgetOption = budgetOptinFromData;

    preperedFormValuesObject.environmentCloud =
      data?.cloud_environment_area_name?._id;
    preperedFormValuesObject.cloud_environment_area_name =
      data?.cloud_environment_area_name?._id;
    preperedFormValuesObject.providerCloud = data.cloud_name?._id;
    preperedFormValuesObject.schedulingCloud = data.scheduling?._id;
    // preperedFormValuesObject.permissionOnCloud = data.cloud_permissiontbl._id;
    preperedFormValuesObject.commandOfBudget = data.BudgetReasonNotes;
    preperedFormValuesObject.reasonOfUnUseofScheduling =
      data.ReasonOfUnUseofScheduling;

    preperedFormValuesObject.budget_deniedNote = data.budget_deniedNote;
    preperedFormValuesObject.ccfoEmail_deniedNote = data.ccfoEmail_deniedNote;
    preperedFormValuesObject.ccfoFullName_deniedNote =
      data.ccfoFullName_deniedNote;
    preperedFormValuesObject.ccfoPhone_deniedNote = data.ccfoPhone_deniedNote;
    preperedFormValuesObject.commandOfBudget_deniedNote =
      data.commandOfBudget_deniedNote;
    preperedFormValuesObject.environment_deniedNote =
      data.environment_deniedNote;
    preperedFormValuesObject.file_deniedNote = data.file_deniedNote;
    preperedFormValuesObject.fullname_deniedNote = data.fullname_deniedNote;
    preperedFormValuesObject.general_deniedNote = data.general_deniedNote;
    preperedFormValuesObject.limitProject_deniedNote =
      data.limitProject_deniedNote;
    preperedFormValuesObject.nameInCloud_deniedNote =
      data.nameInCloud_deniedNote;
    preperedFormValuesObject.permission_deniedNote = data.permission_deniedNote;
    preperedFormValuesObject.phone_deniedNote = data.phone_deniedNote;
    preperedFormValuesObject.providerCloud_deniedNote =
      data.providerCloud_deniedNote;
    preperedFormValuesObject.reasonOfUnUseofScheduling_deniedNote =
      data.reasonOfUnUseofScheduling_deniedNote;
    preperedFormValuesObject.scheduling_deniedNote = data.scheduling_deniedNote;
    preperedFormValuesObject.title_deniedNote = data.title_deniedNote;

    console.log(
      '🚀 ~ file: Request.js ~ line 288 ~ preperedFormValuesObject ~ preperedFormValuesObject',
      preperedFormValuesObject.budgetOption
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

  useEffect(async () => {
    if (subscription) console.log('subscriptionUseEffect', subscription);
  }, [subscription]);

  useEffect(() => {
    if (Data != null) {
      let tempFromsValue = mapDataObjectToFormValues(Data);
      let tempErrorValue = mapDataObjectToErrorChackboxValues(Data);
      console.log(
        '🚀 ~ file: Request.js ~ line 407 ~ useEffect ~ tempErrorValue',
        tempErrorValue
      );

      setFormsValue({ ...tempFromsValue });
      setIsClickEror({ ...tempErrorValue });
    }
    console.log('in3');
  }, []);

  return (
    <div dir='rtl' className={classes.root}>
      <Dialog
        style={{ overflow: 'hidden' }}
        maxWidth={'sm'}
        fullWidth={true}
        open={open}
        onClose={handleClose}
        scroll={'paper'}
        aria-describedby='scroll-dialog-description'
        aria-labelledby='form-dialog-title'>
        {/* <div className={classes.header}>
          <Paper className={classes.paper}>
            {isUserMode ? (
              <element>טופס בקשה</element>
            ) : (
              <element>{Data?.id.substr(0, 5).concat('  טופס מאשר')}</element>
            )}
          </Paper>
        </div> */}
        {/* <BootstrapDialogTitle
          id='customized-dialog-title'
          onClose={handleClose}>
          {isUserMode ? (
            <element>טופס בקשה</element>
          ) : (
            <element>d
              {'טופס מאשר'.concat(` מספר ` + Data?.DisplayNumber)}
            </element>
          )}
        </BootstrapDialogTitle> */}
        <BootstrapDialogTitle
          id='customized-dialog-title'
          onClose={handleClose}
          isBudgetRequests={true}>
          {'טופס בקשה חדשה'.concat(`  ` + Data?.DisplayNumber)}
        </BootstrapDialogTitle>
        <Divider />
        {!onLoading ? (
          <Formik
            enableReinitialize={true}
            initialValues={mapDataObjectToFormValues(Data)}
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
                console.log('hiiii');

                //handleDenied(values);
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
                    {onProccess ? (
                      <Loader />
                    ) : (
                      <>
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
                          isUserMode={isUserMode}
                          isFieldEnableToEdit={isFieldEnableToEdit}
                          isNeedToDisplayCheckBox={isNeedToDisplayCheckBox}
                          isCheckBoxChecked={isCheckBoxChecked}
                          isCommentFieldDisplay={isCommentFieldDisplay}
                          isDenied={isDenied}
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
                          isUserMode={isUserMode}
                          isFieldEnableToEdit={isFieldEnableToEdit}
                          isNeedToDisplayCheckBox={isNeedToDisplayCheckBox}
                          isCheckBoxChecked={isCheckBoxChecked}
                          isCommentFieldDisplay={isCommentFieldDisplay}
                          isDenied={isDenied}
                        />
                      </>
                    )}
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
                      <div
                        dir='rtl'
                        style={{
                          display: 'flex',
                          paddingTop: '1rem',
                          padding: 10,
                          alignItems: 'center',
                        }}>
                        <Button
                          sx={{ mr: 2 }}
                          variant='contained'
                          type={'submit'}
                          size='large'
                          color='secondary'
                          style={{
                            margin: '0 .5rem',
                            display: isOwnerMode ? 'none' : 'flex',
                          }}
                          onClick={() => handleInProccess(values)}>
                          {'לאישור סופי'}
                        </Button>

                        <Button
                          sx={{ mr: 2 }}
                          color='secondary'
                          variant='contained'
                          size='large'
                          onClick={() => handleCanceled(values)}
                          style={{
                            margin: '0 .5rem',
                            display: isOwnerMode ? 'none' : 'flex',
                          }}>
                          {'ביטול בקשה'}
                        </Button>
                        <Button
                          sx={{ mr: 2 }}
                          color='warning'
                          variant='contained'
                          size='large'
                          onClick={() => handleDenied(values)}
                          style={{
                            margin: '0 .5rem',
                            background: '#f44336',
                            display: limitBudget ? 'flex' : 'none',
                          }}>
                          {'לא מאשר'}
                        </Button>
                        <Button
                          sx={{ mr: 2 }}
                          variant='contained'
                          size='large'
                          onClick={() => handleAccept(values)}
                          style={{
                            paddingRight: 5,
                            margin: '0 .5rem',
                            background: 'green',
                            display: limitBudget ? 'flex' : 'none',
                          }}>
                          {'מאשר בקשה'}
                        </Button>
                      </div>
                    ) : (
                      <div dir={'rtl'}>
                        <Button
                          sx={{ mr: 2 }}
                          variant='contained'
                          color='primary'
                          size='large'
                          disabled={!isDenied}
                          onClick={() => handleUpdate(values)}
                          style={{ margin: '0 .5rem', background: 'orange' }}>
                          {' שלח לאישור מחדש'}
                        </Button>
                      </div>
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
