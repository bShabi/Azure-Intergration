import { Box, Button, Tab, Tabs, useTheme } from '@material-ui/core';
import { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import { experimentalStyled } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import MonetizationOnTwoToneIcon from '@material-ui/icons/MonetizationOnTwoTone';
import DnsTwoToneIcon from '@material-ui/icons/DnsTwoTone';
import AccountTreeTwoToneIcon from '@material-ui/icons/AccountTreeTwoTone';
import TaskAltTwoToneIcon from '@material-ui/icons/TaskAltTwoTone';
import GridViewTwoToneIcon from '@material-ui/icons/GridViewTwoTone';
import RequestSubscripitionDialog from '../../components/Dialogs/Subscripition/Request';
import RequestBudgetDialog from '../../components/Dialogs/Budget/Request';
import RequestAcceptDialog from '../../components/Dialogs/Accept/Request';
import { useContext } from 'react';
import AuthContext from '../../../context/AuthContext';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import MenuItem from '@material-ui/core/MenuItem';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import { useRouter } from 'next/router';
import AddCircleTwoToneIcon from '@material-ui/icons/AddTwoTone';
const HeaderWrapper = experimentalStyled(Box)(
  ({ theme }) => `
        height: ${theme.header.height};
        color: ${theme.header.textColor};
        right: 0;
        z-index: 5;
        justify-content: space-between;
        width: 100%;
        @media (min-width: ${theme.breakpoints.values.lg}px) {
            // right: ${theme.sidebar.width};
            width: 100%;
        }
`
);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: 10,
    textAlign: 'center',
    color: 'red',
  },
}));
const TagsStatus = [
  {
    value: 'Owner',
    label: 'Owner',
  },
  {
    value: 'Bugget',
    label: 'Bugget',
  },
];
const StatusRequest = [
  {
    value: 'Submit',
    label: 'Submit',
  },
  {
    value: 'Updated',
    label: 'Updated',
  },
  {
    value: 'InProccess',
    label: 'InProccess',
  },
  {
    value: 'Aprrove',
    label: 'Aprrove',
  },
  {
    value: 'Denny',
    label: 'Denny',
  },
];
export default function index({
  valueTags,
  setTagsValue,
  ManagerRequestPage_RefreshData,
  dataLength,
  DataSetting,
}) {
  const classes = useStyles();

  const theme = useTheme();
  const router = useRouter();
  const budgetLimit = DataSetting[0]?.const_Budget;

  const [isHaveRequests, setIsHaveRequests] = useState(false);
  const [isOpenRequestSubscripition, setRequestSubscripition] = useState(false);
  const [isOpenRequestBudget, setRequestBudget] = useState(false);
  const [isOpenAcceptRequest, setIsOpenAcceptRequest] = useState(false);
  const [adminPage, setAdminPage] = useState(false);
  const { getAllRequestByMemberId, member, requestsByMemberID } =
    useContext(AuthContext);

  console.log('dataLengthOnTabs', dataLength);
  const handleChange = (event, newValue) => {
    setTagsValue(newValue);
    console.log('event', event);
    console.log('event', newValue);
  };

  const handleCloseDialogSubscripition = () => {
    setRequestSubscripition(false);
  };
  const handleCloseDialogBudget = () => {
    setRequestBudget(false);
  };
  const handleCloseDialogAccept = () => {
    setIsOpenAcceptRequest(false);
  };
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };
  const isRoutherPathManager = (path) => {
    console.log('path', path);
    return path === '/Requests/Manager' ? false : true;
  };

  const handleTagsChange = (event) => {
    setTags(event.target.value);
  };
  const displayScreenByTagValue = () => {
    console.log('valueTagsvalueTags', typeof valueTags);
    var screenByTag = 'כלל הפרויקטים';
    switch (parseInt(valueTags)) {
      case 1:
        console.log('innnnnn', valueTags);
        return (screenByTag = 'כל הפרויקטים');
      case 2:
        console.log('innnnnn', valueTags);

        return (screenByTag = 'בקשות פתוחות');
      case 3:
        console.log('innnnnn', valueTags);

        return (screenByTag = 'עדכון תקציב');

      case 4:
        console.log('innnnnn', valueTags);

        return (screenByTag = 'בקשות סגורות');

      case 5:
        console.log('innnnnn', valueTags);

        return (screenByTag = 'בקשות סגורות');
    }
  };
  const displayDescriptionScreenByTagValue = () => {
    console.log('valueTagsvalueTags', typeof valueTags);
    var description = 'כלל הפרויקטים';
    switch (parseInt(valueTags)) {
      case 1:
        console.log('innnnnn', valueTags);
        return (description = 'במסך זה יוצגו כל הפרויקטים');
      case 2:
        console.log('innnnnn', valueTags);

        return (description = 'במסך זה יוצגו כל הבקשות פתוחות');
      case 3:
        console.log('innnnnn', valueTags);

        return (description = 'במסך זה יוצגו כל עדכון תקציב');

      case 4:
        console.log('innnnnn', valueTags);

        return (description = 'במסך זה יוצגו כל הבקשות המבוטלות');

      case 5:
        console.log('innnnnn', valueTags);

        return (description = 'במסך זה יוצגו  כל בקשות סגורות');
    }
  };
  useEffect(async () => {
    if (member) {
      console.log('requestsByMemberID', member);
      let memberID = member?.members_tbl?.id;
      await getAllRequestByMemberId(memberID);
    }
    if (member?.isAdmin) setAdminPage(true);
  }, []);

  const isUserPathUrl = (path) => {
    return path === '/Requests/Users' ? true : false;
  };

  return (
    <>
      <div dir='rtl'>
        <Container maxWidth={'large'}>
          <Box
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '6rem',
              paddingTop: 25,
              width: '100%',
            }}>
            <Grid item>
              <Typography variant='h3' component='h3' gutterBottom>
                <Box style={{ fontSize: 26 }}>
                  <strong>{'מסך ' + displayScreenByTagValue(valueTags)}</strong>
                </Box>
              </Typography>
              <Typography variant='subtitle2' gutterBottom>
                <Box
                  style={{ fontSize: 16, paddingBottom: 20, paddingRight: 2 }}>
                  {displayDescriptionScreenByTagValue(valueTags)}
                </Box>
                {/* <Box
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Box style={{ fontSize: '1.5rem', padding: 20 }}>
                  {'מסך ' + displayScreenByTagValue(valueTags)}
                </Box>
                <Box
                  style={{
                    background: theme.palette.primary.main,
                    borderRadius: '2rem',
                    width: '5rem',
                    height: '4px',
                  }}
                />
              </Box> s*/}
              </Typography>
            </Grid>
            <div>
              {/* {!member?.isAdmin ? ( */}
              {isUserPathUrl(router.asPath) ? (
                <Box>
                  <Button
                    onClick={() => setRequestSubscripition(true)}
                    style={{ margin: 20 }}
                    size='large'
                    sx={{ ml: 1 }}
                    variant='contained'
                    color={'primary'}>
                    <AddCircleTwoToneIcon />

                    <span style={{ fontSize: 14 }}>בקשה לפתיחת פרויקט</span>
                  </Button>

                  <Button
                    onClick={() => setRequestBudget(true)}
                    style={{ margin: 20 }}
                    variant={'contained'}
                    color={'primary'}
                    size='large'>
                    <AddCircleTwoToneIcon />

                    <span style={{ fontSize: 14 }}>בקשה לשינוי תקציב</span>
                  </Button>
                </Box>
              ) : (
                <Box>
                  {/* <Button
                    onClick={() => setRequestSubscripition(true)}
                    size='large'
                    variant={'contained'}
                    color={'primary'}>
                    <PictureAsPdfIcon />
                    PDF {''}
                  </Button> */}
                  <Button
                    onClick={() => setRequestBudget(true)}
                    style={{ margin: 20 }}
                    variant={'contained'}
                    color={'primary'}>
                    <AddCircleTwoToneIcon />

                    <span style={{ fontSize: 14 }}>{''} יצוא לקובץ Excel</span>
                  </Button>
                </Box>
              )}
            </div>
          </Box>
        </Container>

        {/* <Divider style={{ padding: 10, backgroundColor: '#f6f8fb' }} /> */}
        <Container maxWidth={'large'}>
          <HeaderWrapper display='flex'>
            <div dir='rtl'>
              <Box>
                <Box
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    textAlign: 'center',
                    width: '100%',
                  }}>
                  {/*    Right button */}
                  <Box
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '100%',
                      flexDirection: 'row-reverse',
                    }}>
                    <Tabs
                      style={{ direction: 'rtl' }}
                      onChange={handleChange}
                      value={valueTags}
                      textColor='primary'
                      indicatorColor='primary'
                      aria-label='secondary tabs example'>
                      <Tab
                        value='1'
                        label={
                          <Box
                            style={{
                              display: 'flex',
                              alignItems: 'right',
                              fontSize: 16,
                            }}>
                            <Box display='flex' alignItems='center' pl={0.3}>
                              {/* <AccountTreeTwoToneIcon
                                color='white'
                                fontSize='small'
                              /> */}
                            </Box>
                            כל הפרויקטים
                          </Box>
                        }
                      />
                      <Tab
                        value='2'
                        label={
                          <Box
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              fontSize: 16,
                            }}>
                            <Box display='flex' alignItems='center' pl={0.3}>
                              {/* <DnsTwoToneIcon color='white' fontSize='small' /> */}
                            </Box>
                            בקשות פתוחות
                          </Box>
                        }
                      />
                      <Tab
                        value='3'
                        label={
                          <Box
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              fontSize: 16,
                            }}>
                            <Box display='flex' alignItems='center' pl={0.3}>
                              {/* <MonetizationOnTwoToneIcon
                                color='white'
                                fontSize='small'
                              /> */}
                            </Box>
                            עדכוני תקציב
                          </Box>
                        }
                      />
                      <Tab
                        value='4'
                        label={
                          <Box
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              fontSize: 16,
                            }}>
                            <Box display='flex' alignItems='center' pl={0.3}>
                              {/* <TaskAltTwoToneIcon
                                color='white'
                                fontSize='small'
                              /> */}
                            </Box>
                            בקשות מבוטלות
                          </Box>
                        }
                      />
                      <Tab
                        value='5'
                        label={
                          <Box
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              fontSize: 16,
                            }}>
                            <Box display='flex' alignItems='center' pl={0.3}>
                              {/* <GridViewTwoToneIcon
                                color='white'
                                fontSize='small'
                              /> */}
                            </Box>
                            כלל הבקשות
                          </Box>
                        }
                      />
                    </Tabs>
                  </Box>
                </Box>

                {/* <Divider /> */}
              </Box>
            </div>
          </HeaderWrapper>
        </Container>
      </div>
      {/* <Divider style={{ padding: 10, backgroundColor: '#f6f8fb' }} /> */}
      {false && (
        <Container maxWidth={false}>
          <Paper py={0}>
            <Box style={{ paddingRight: 45 }}>
              <strong style={{ fontSize: 24 }}>
                {' '}
                {'מsסך ' + displayScreenByTagValue(valueTags)}
                <span
                  style={{
                    display: dataLength ? 'inline' : 'none',
                    paddingLeft: 2,
                  }}>
                  {' '}
                  ({dataLength})
                </span>
              </strong>
              {/* <Divider py={2} /> */}
            </Box>

            {/* Dialog Request */}
            <div
              style={{
                display: 'flex',
                paddingTop: '1rem',
                padding: 10,
                alignItems: 'center',
              }}
              className={classes.header}>
              <TextField
                id='outlined-select-status'
                select
                label='סטטוס'
                inputProps={{ MenuProps: { disableScrollLock: true } }}
                onChange={handleStatusChange}
                variant='outlined'
                style={{
                  margin: 5,
                  flex: 1,
                  // width: 20,
                }}>
                {StatusRequest.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                id='outlined-select-tags'
                placeholder={'Tags'}
                select
                label='סביבת עבודה'
                inputProps={{ MenuProps: { disableScrollLock: true } }}
                onChange={handleTagsChange}
                variant='outlined'
                style={{
                  margin: 5,
                  flex: 0.5,
                }}>
                {TagsStatus.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                id='outlined-margin-none'
                className={classes.textField}
                placeholder='חיפוש לפי שם פרויקט'
                variant='outlined'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                style={{
                  margin: 5,
                  flex: 1,
                  width: 1,
                }}
              />
              {/* {!member?.isAdmin ? (
              <Box>
                <Button
                  onClick={() => setRequestSubscripition(true)}
                  size='large'
                  variant={'contained'}
                  color={'primary'}>
                  <DashboardCustomizeTwoToneIcon /> בקשה לפתיחת פרויקט חדש
                </Button>
                <Button
                  onClick={() => setRequestBudget(true)}
                  style={{ margin: 20 }}
                  variant={'contained'}
                  color={'primary'}
                  size='large'>
                  <DashboardCustomizeTwoToneIcon /> בקשה לשינוי תקציב
                </Button>
              </Box>
            ) : (
              <Box>
                <Button
                  onClick={() => setRequestSubscripition(true)}
                  size='large'
                  variant={'contained'}
                  color={'primary'}>
                  <PictureAsPdfIcon />
                  PDF {''}
                </Button>
                <Button
                  onClick={() => setRequestBudget(true)}
                  style={{ margin: 20 }}
                  variant={'contained'}
                  color={'primary'}
                  size='large'>
                  {/* <i class='far fa-file-excel' /> */}
              {/* <i class='fas fa-file-excel' />
                  {''} Excel
                </Button>
              </Box>
            )} 
            */}{' '}
            </div>
          </Paper>
        </Container>
      )}
      <Paper>
        <div>
          <RequestSubscripitionDialog
            budgetLimit={budgetLimit}
            handleCloseDialog={handleCloseDialogSubscripition}
            open={isOpenRequestSubscripition}
            setOpen={setRequestSubscripition}
          />
          <RequestBudgetDialog
            handleCloseDialog={handleCloseDialogBudget}
            open={isOpenRequestBudget}
            ManagerRequestPage_RefreshData={ManagerRequestPage_RefreshData}
          />

          <RequestAcceptDialog
            handleCloseDialog={handleCloseDialogAccept}
            open={isOpenAcceptRequest}
            ManagerRequestPage_RefreshData={ManagerRequestPage_RefreshData}
          />
        </div>
      </Paper>
    </>
  );
}
