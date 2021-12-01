import React, { useEffect } from 'react';
import Layout from '../../../src/Layout/index';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Container from '@material-ui/core/Container';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { useRouter } from 'next/router';
import { useState } from 'react';

// locals
import TabManager from '../../../src/components/Tabs';
import AuthContext from '../../../context/AuthContext';
import Label from '../../../src/utils/Label';
import BudgetInnerTable from '../../../src/shared-components/BudgetInnerTable';
import GeneralConstants from '../../../src/constants/status-constants';
import AcceptRequestSubscriptionDialog from '../../../src/components/Dialogs/Accept/Request';
import { socket } from '../../../components/util/web-socket';

import { API_URL } from '../../../config';
import requestManagerApi from '../../../src/api/request-manager-api';

const BIG_WIDTH = '100%';
const SMALL_WIDTH = 1070;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: 10,
    textAlign: 'center',
  },
  header: {
    whiteSpace: 'nowrap',
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
// Style
const useEnhancedTableStyles = makeStyles((theme) => ({
  root: {
    padding: 20,
    width: 600,
    // direction: 'rtl',
  },
  tabs: {
    padding: 20,
  },
  collapse_Wrapper: {
    width: 600,
  },
  paper: {
    width: '100%',
    marginBottom: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  headerTitle: {
    alignSelf: 'center',
    marginRight: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  menu: {},
  table: {
    // minWid   th: 1000,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  tableCellHead: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tableCell: {
    fontWeight: 'bold',
  },
}));

const useMainStyles = makeStyles({
  root: {
    width: '100%',
  },
  header: {
    display: 'flex',
  },
});
// Data

// Components | functions
function createData(portal, bugget, lastDate, createDate, status, name, id) {
  return { portal, bugget, lastDate, createDate, status, name, id };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  if (!array) {
    console.log('error');
    return;
  }
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'cloud-provider',
    numeric: true,
    disablePadding: false,
    label: 'ספק ענן',
  },
  { id: 'user-name', numeric: true, disablePadding: false, label: 'שם משתמש' },
  { id: 'env', numeric: true, disablePadding: false, label: 'סביבת עבודה' },
  { id: 'bugget', numeric: true, disablePadding: false, label: 'תקציב' },
  {
    id: 'lastDate',
    numeric: true,
    disablePadding: false,
    label: 'ת.עדכון אחרון',
  },
  {
    id: 'createDate',
    numeric: true,
    disablePadding: false,
    label: 'ת.יצירת בקשה',
  },
  { id: 'status', numeric: true, disablePadding: false, label: 'סטטוס' },
  { id: 'name', numeric: true, disablePadding: false, label: 'שם פרויקט בענן' },
  { id: 'id', numeric: true, disablePadding: false, label: 'מזהה בקשה' },
];

function Row(props) {
  const router = useRouter();

  const { row, isInsideTable, index, classes, Data, status, DataSetting } =
    props;
  const [open, setOpen] = React.useState(false);
  const labelId = `enhanced-table-checkbox-${index}`;
  const [isOpenAcceptRequest, setIsOpenAcceptRequest] = useState(false);
  const [isOpenViewRequest, setIsOpenViewRequest] = useState(false);
  const formatDollerSign = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  const statusRequest = row.requests_status_tbl?.RequestsStatusName;

  const colorStatus = GeneralConstants.colorByStatusRequest(statusRequest);
  const handleCloseDialogAccept = () => {
    setIsOpenViewRequest(false);
  };

  const handleCloseDialogAcceptBudget = () => {
    setIsOpenAcceptBudgetRequest(false);
  };

  const ManagerRequestPage_RefreshData = () => {
    router.replace(router.asPath);
  };
  console.log(
    '🚀 ~ file: index.js ~ line 359 ~ Row ~ GeneralConstants',
    GeneralConstants
  );

  const getUserRoleLabel = (userRole) => {
    console.log('beforeMap', userRole);
    const map = {
      denied: {
        text: 'Denied',
        color: 'error',
      },
      approved: {
        text: 'Approved',
        color: 'success',
      },
      'Re-Submited': {
        text: 'Re-Submited',
        color: 'warning',
      },
      submitted: {
        text: 'Submitted',
        color: 'secondary',
      },
      Draft: {
        text: 'Draft',
        color: 'info',
      },
      InProgress: {
        text: 'InProgress',
        color: '#6e759f',
      },
      canceled: {
        text: 'Canceled',
        color: '#6e759f',
      },
    };

    const { text, color } = map[userRole];

    return (
      <Label color={color}>
        {' '}
        <strong>{text}</strong>
      </Label>
    );
  }; // useEffect(() => {
  // }, [ListRequests, row]);

  return (
    <React.Fragment>
      <AcceptRequestSubscriptionDialog
        handleCloseDialog={handleCloseDialogAccept}
        open={isOpenViewRequest}
        Data={row}
        ManagerRequestPage_RefreshData={ManagerRequestPage_RefreshData}
        isUserMode={true}
        const_Budget={DataSetting[0].const_Budget}
      />
      <TableRow hover tabIndex={-1} key={row.name}>
        <TableCell padding='checkbox'>
          <IconButton
            onClick={() => setIsOpenViewRequest(true)}
            color='primary'>
            <OpenInNewIcon />
          </IconButton>
        </TableCell>
        <TableCell
          width={isInsideTable ? '10px' : ''}
          align='center'
          component='th'
          id={labelId}
          scope='row'
          padding='none'>
          {isInsideTable ? '1' : row.cloud_name ? row.cloud_name.Cloud : ''}
        </TableCell>
        <TableCell
          width={isInsideTable ? '10px' : ''}
          align='center'
          component='th'
          id={labelId}
          scope='row'
          padding='none'>
          {isInsideTable ? '1' : row.memberID ? row.memberID.azureUsername : ''}
        </TableCell>

        <TableCell
          width={isInsideTable ? '10px' : ''}
          align='center'
          component='th'
          id={labelId}
          scope='row'
          padding='none'>
          {isInsideTable
            ? '1'
            : row.cloud_environment_area_name
            ? row.cloud_environment_area_name.CloudEnvironmentAreaName
            : ''}
        </TableCell>
        <TableCell width={isInsideTable ? '10px' : ''} align='center'>
          {formatDollerSign.format(new Number(row.BudgetOnDemand))}
        </TableCell>
        <TableCell width={isInsideTable ? '10px' : ''} align='center'>
          {moment(row.LastDateUpdateRequest).format('DD/MM/YYYY')}
        </TableCell>
        <TableCell width={isInsideTable ? '10px' : ''} align='center'>
          {moment(row.DateCreateRequest).format('DD/MM/YYYY')}
        </TableCell>
        <TableCell
          width={isInsideTable ? '10px' : ''}
          align='center'
          style={{ color: colorStatus }}>
          {getUserRoleLabel(row.requests_status_tbl?.RequestsStatusName)}
        </TableCell>
        <TableCell
          width={isInsideTable ? '10px' : ''}
          align='center'
          style={{ fontWeight: 'bold' }}>
          {row.ProjectNameinCloud}
        </TableCell>
        <TableCell
          width={isInsideTable ? '10px' : ''}
          align='center'
          style={{ color: '#4040fd' }}>
          {row.DisplayNumber}
        </TableCell>
        {!isInsideTable && status != 1 && (
          <TableCell align='center'>
            {row.update_budget_requests_tbls.length > 0 && (
              <IconButton
                aria-label='expand row'
                size='small'
                onClick={() => setOpen(!open)}>
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            )}
          </TableCell>
        )}
      </TableRow>
      {!isInsideTable && status != 1 && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
            <Collapse
              in={open}
              timeout='auto'
              unmountOnExit
              style={{ display: 'flex', justifyContent: 'center' }}
              classes={{ wrapper: classes.collapse_Wrapper }}>
              <BudgetInnerTable
                row={row}
                Data={row.update_budget_requests_tbls}
                providerName={row.ProjectNameinCloud}
                cloudName={row?.cloud_name?.Cloud}
                ManagerRequestPage_RefreshData={ManagerRequestPage_RefreshData}
                isUserMode={true}
              />
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
}

function EnhancedTableHead(props) {
  const {
    classes,
    order,
    orderBy,
    onRequestSort,
    isInsideTable,
    status,
    sortDataDatesByFieldId,
  } = props;

  let [orderAscDirection_LastDate, setOrderAscDirection_LastDate] =
    useState(true);
  let [orderAscDirection_CreateDate, setOrderAscDirection_CreateDate] =
    useState(true);

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell
          padding='normal'
          align='center'
          className={classes.tableCellHead}>
          פעולה
        </TableCell>
        {headCells.map((headCell) =>
          headCell.id === 'lastDate' || headCell.id === 'createDate' ? (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'center' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
              className={classes.tableCell}>
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={
                  headCell.id === 'lastDate'
                    ? orderAscDirection_LastDate
                      ? 'asc'
                      : 'desc'
                    : orderAscDirection_CreateDate
                    ? 'asc'
                    : 'desc'
                }
                onClick={() => {
                  headCell.id === 'lastDate'
                    ? setOrderAscDirection_LastDate(!orderAscDirection_LastDate)
                    : setOrderAscDirection_CreateDate(
                        !orderAscDirection_CreateDate
                      );

                  let orderAscDirection =
                    headCell.id === 'lastDate'
                      ? orderAscDirection_LastDate
                      : orderAscDirection_CreateDate;

                  sortDataDatesByFieldId(headCell.id, orderAscDirection);
                }}>
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {/* {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'} */}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ) : (
            <TableCell
              padding='normal'
              align='center'
              className={classes.tableCellHead}>
              {headCell.label}
            </TableCell>
          )
        )}
        {!isInsideTable && <TableCell />}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTable({
  isInsideTable,
  type,
  Data,
  status,
  setProjectLength,
  DataSetting,
}) {
  const sortDataByTabs = (status, data) => {
    var sortFilter = Data;
    switch (status) {
      case 1:
        //with out budgert just request
        return sortFilter;
      case 2:
        //all without 'approve'
        var result = sortFilter.filter(
          (e) => e.requests_status_tbl?.RequestsStatusName != 'approved'
        );
        console.log('eee2', result);

        return result;

      case 3:
        //just budget without subscription
        var result = sortFilter.filter(
          (e) => e.requests_status_tbl?.RequestsStatusName === 'approved'
        );
        return result;

      case 4:
        //just closed
        var result = sortFilter.filter(
          (e) => e.requests_status_tbl?.RequestsStatusName === 'canceled'
        );
        return result;

      case 5:
        //all
        return sortFilter;
    }
  };

  const resultDataAfterSortByTabID = sortDataByTabs(status, Data);
  setProjectLength(resultDataAfterSortByTabID?.length);

  const classes = useEnhancedTableStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('lastDate');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortedData, setSortedData] = React.useState(Data);
  const [isFirstInit, setIsFirstInit] = React.useState(true);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortDataDatesByFieldId = (idName, orderByAscDirection) => {
    const tempData = [...Data];

    let tempSortedData = tempData.sort(function (a, b) {
      return a[idName] < b[idName] ? -1 : a[idName] > b[idName] ? 1 : 0;
    });

    if (!orderByAscDirection) {
      tempSortedData = tempSortedData.reverse();
    }

    setSortedData([...tempSortedData]);
  };

  useEffect(() => {
    console.log('🚀 ~ file: index.js ~ line 553 ~ useEffect ~ sortedData');
  }, [sortedData]);

  useEffect(() => {
    console.log('🚀 ~ file: index.js ~ line 553 ~ useEffect ~ []');

    if (!isFirstInit) {
      sortDataDatesByFieldId('lastDate', true);
      setIsFirstInit(false);
    }
  }, []);

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, sortedData?.length - page * rowsPerPage);
  console.log('🚀 ~ file: index.js ~ line 440 ~ rowsPerPage', rowsPerPage);

  return (
    <div
      className={classes.root}
      style={{
        width: !isInsideTable ? BIG_WIDTH : SMALL_WIDTH,
      }}>
      <div className={classes.paper}>
        {!isInsideTable && (
          <div className={classes.header}>
            <Grid item>
              <span>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component='div'
                  count={resultDataAfterSortByTabID?.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </span>
            </Grid>
            <Grid item>
              <Typography
                variant='span'
                component='div'
                style={{ alignSelf: 'center' }}
                className={classes.headerTitle}>
                <p>{`יש ${resultDataAfterSortByTabID?.length} בקשות`}</p>
              </Typography>
            </Grid>
          </div>
        )}

        <Divider />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby='tableTitle'
            size={isInsideTable ? 'small' : 'medium'}
            aria-label='enhanced table'>
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={Data?.length}
              isInsideTable={isInsideTable}
              tabType={type}
              sortDataDatesByFieldId={sortDataDatesByFieldId}
            />
            <TableBody>
              {/* {stableSort(
                Data ? resultDataAfterSortByTabID : null,
                getComparator(order, orderBy)
              ) */}
              {sortedData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <Row
                      key={row.ProjectNameinCloud}
                      row={row}
                      isInsideTable={isInsideTable}
                      status={status}
                      index={index}
                      DataSetting={DataSetting}
                      classes={classes}
                    />
                  );
                })}
              {/* {emptyRows > 0 && (
                <TableRow>
                  <TableCell colSpan={10} />
                </TableRow>
              )} */}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default function UserRequestPage({ Data, budgetData, DataSetting }) {
  const classes = useMainStyles();
  const [projectLength, setProjectLength] = useState(Data?.length);
  // const [isReload, setIsRelaod] = useState(false);

  const [valueTags, setTagsValue] = useState('1');
  const router = useRouter();

  const { auth, member, setRequestsByMember, requestsByMember } =
    React.useContext(AuthContext);

  const [memberID, setMemberID] = useState();
  const [sortData, setSortData] = useState();

  useEffect(() => {
    console.log('DataSet', Data);
  }, [Data]);
  // useEffect(() => {
  //   if (isReload) {
  //     socket.on('notification', (data) => {
  //       console.log('Start Soket');
  //       setTimeout(() => {
  //         console.log('inSocket');
  //         router.reload();
  //         toast.success('בוצע עדכון');
  //         console.log('finish Soket');
  //         setIsRelaod(false);
  //       }, 1200);
  //     });
  //   }
  // }, [isReload]);

  React.useEffect(() => {
    let memberID = null;
    let sortDataTemp = [];
    try {
      if (member?.isManager) {
        router.push('/Requests/Manager');
      }
      /**
       * Sort by member id
       */
      if (member) {
        memberID = member.GUID;

        console.log(
          '🚀 ~ file: index.js ~ line 596 ~ React.useEffect ~ memberID',
          memberID
        );
        // requestManagerApi.requestByMemberId(member?.GUID).then((res) => {
        //   setRequestsByMember(res);
        //   // setSortData(res);
        //   console.log('sortDataByMember', res);
        // });
      }

      if (memberID) {
        console.log('inmemberID', memberID);
        Data?.forEach((elm) => {
          console.log('elmelmelm', elm.memberID.GUID);
          if (elm?.memberID.GUID === memberID) {
            sortDataTemp.push(elm);
          }
        });
        // let sort = Data.filter((elm) => elm.memberID.id === memberID);
        setRequestsByMember(sortDataTemp);
        setSortData(sortDataTemp);
      }
    } catch (error) {}
  }, [member, Data]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleTagsChange = (event) => {
    setTags(event.target.value);
  };
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const ManagerRequestPage_RefreshData = () => {
    router.reload();
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
  return (
    <>
      <Layout>
        {/* <Container maxWidth={false}> */}

        {/* </Container> */}
        {!member?.isManager && (
          <div style={{ paddingRight: 5 }}>
            <div className={classes.menu} dir='rtl'>
              <TabManager
                valueTags={valueTags}
                dataLength={projectLength}
                setTagsValue={setTagsValue}
                DataSetting={DataSetting}
                ManagerRequestPage_RefreshData={ManagerRequestPage_RefreshData}
              />
            </div>
            <Container maxWidth={'large'}>
              {/* <Card sx={{ p: 1, mb: 3 }}> */}

              {/* <Paper className={classes.root}> */}
              {/* <div className={classes.menu}>
              <TabManager
                valueTags={valueTags}
                setTagsValue={setTagsValue}
                ManagerRequestPage_RefreshData={ManagerRequestPage_RefreshData}
              />
            </div> */}
              <Card sx={{ p: 1, mb: 3 }}>
                <div dir={'rtl'}>
                  <Box style={{ fontSize: 16, paddingTop: 5, paddingRight: 5 }}>
                    <strong>
                      {' '}
                      {displayScreenByTagValue(valueTags)}
                      <span
                        style={{
                          display: projectLength ? 'inline' : 'none',
                          paddingLeft: 2,
                        }}>
                        {' '}
                        ({projectLength})
                      </span>
                    </strong>
                    {/* <Divider py={2} /> */}
                  </Box>
                </div>
                {/* Dialog Request */}
                {/* <div
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
                </div> */}

                {parseInt(valueTags) === 1 && (
                  <>
                    <EnhancedTable
                      Data={sortData ? sortData : Data}
                      setProjectLength={setProjectLength}
                      projectLength={projectLength}
                      isInsideTable={false}
                      DataSetting={DataSetting}
                      status={1}
                    />
                  </>
                )}
                {parseInt(valueTags) === 2 && (
                  <>
                    <EnhancedTable
                      Data={sortData ? sortData : Data}
                      status={2}
                      setProjectLength={setProjectLength}
                      projectLength={projectLength}
                      isInsideTable={false}
                      DataSetting={DataSetting}
                      type={valueTags}
                    />
                  </>
                )}
                {parseInt(valueTags) === 3 && (
                  <>
                    <Container maxWidth={false}>
                      <BudgetInnerTable
                        Data={budgetData}
                        // providerName={row.ProjectNameinCloud}
                        // cloudName={row.cloud_name.Cloud}
                        ManagerRequestPage_RefreshData={
                          ManagerRequestPage_RefreshData
                        }
                        isUserMode={true}
                      />
                    </Container>
                    {/* <EnhancedTable
                      Data={sortData ? sortData : Data}
                      isInsideTable={false}
                      status={3}
                    /> */}
                  </>
                )}
                {parseInt(valueTags) === 4 && (
                  <>
                    <EnhancedTable
                      Data={sortData ? sortData : Data}
                      setProjectLength={setProjectLength}
                      projectLength={projectLength}
                      DataSetting={DataSetting}
                      isInsideTable={false}
                      status={4}
                    />
                  </>
                )}
                {parseInt(valueTags) === 5 && (
                  <>
                    <EnhancedTable
                      Data={sortData ? sortData : Data}
                      setProjectLength={setProjectLength}
                      projectLength={projectLength}
                      DataSetting={DataSetting}
                      isInsideTable={false}
                      status={5}
                    />
                  </>
                )}
                {/* <EnhancedTable isInsideTable={false} /> */}
                {/* </Paper> */}
              </Card>
            </Container>
            <Divider />
          </div>
        )}
        {member?.isManager && <Layout></Layout>}
      </Layout>
    </>
  );
}
export async function getStaticProps(context) {
  // Fetch events

  const dataRes = await fetch(`${API_URL}/requests-tbls`);
  const Data = await dataRes.json();
  const dataSettingRes = await fetch(`${API_URL}/SETTINGS-TBLS`);
  const DataSetting = await dataSettingRes.json();
  const budgetRes = await fetch(`${API_URL}/update-budget-requests-tbls`);
  const budgetData = await budgetRes.json();

  return {
    props: { Data: Data, budgetData: budgetData, DataSetting: DataSetting },

    revalidate: 1,
  };
}
