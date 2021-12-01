import React, { useEffect } from 'react';
import Layout from '../../../src/Layout/index';
import { Container, Grid } from '@material-ui/core';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import SearchIcon from '@material-ui/icons/Search';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import InputAdornment from '@material-ui/core/InputAdornment';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Label from '../../../src/utils/Label';
import TabManager from '../../../src/components/Tabs';
import AuthContext from '../../../context/AuthContext';
import AcceptRequestSubscriptionDialog from '../../../src/components/Dialogs/Accept/Request';
import BudgetInnerTable from '../../../src/shared-components/BudgetInnerTable';
import { API_URL } from '../../../config';
const BIG_WIDTH = '100%';
const SMALL_WIDTH = 835;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: 10,
    textAlign: 'center',
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
    fontSize: 14,
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
  showBudgetTBL: {
    backgroundColor: 'Red',
  },
}));

// const useEnhancedTableStyles = makeStyles((theme) => ({
//   root: {
//     padding: 20,
//     width: 600,
//     // direction: 'rtl',
//   },
//   tabs: {
//     padding: 20,
//   },
//   collapse_Wrapper: {
//     width: 600,
//   },
//   paper: {
//     width: '100%',
//     marginBottom: '2rem',
//   },
//   header: {
//     display: 'flex',
//     justifyContent: 'space-between',
//   },
//   headerTitle: {
//     alignSelf: 'center',
//     marginRight: 20,
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   table: {
//     // minWid   th: 1000,
//   },
//   visuallyHidden: {
//     border: 0,
//     clip: 'rect(0 0 0 0)',
//     height: 1,
//     margin: -1,
//     overflow: 'hidden',
//     padding: 0,
//     position: 'absolute',
//     top: 20,
//     width: 1,
//   },
//   tableCellHead: {
//     textAlign: 'center',
//     fontWeight: 'bold',
//     fontSize: 15,
//   },
//   tableCell: {
//     fontWeight: 'bold',
//   },
//   textField: {
//     textAlign: 'right',
//   },
// }));

const useMainStyles = makeStyles({
  root: {
    width: '100%',
  },
  header: {
    display: 'flex',
  },
  textField: {
    textAlign: 'right',
  },
});

// Components | functions
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
  console.log('firstTime', array);
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
  { id: 'portal', numeric: true, disablePadding: false, label: 'ספק ענן' },
  { id: 'bugget', numeric: true, disablePadding: false, label: 'שם משתמש' },
  { id: 'bugget', numeric: true, disablePadding: false, label: 'סביבת עבודה' },
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
  const {
    row,
    isInsideTable,
    index,
    classes,
    Data,
    DataSetting,
    ManagerRequestPage_RefreshData,
    status,
  } = props;

  console.log('DataSetting#11', DataSetting);
  const [open, setOpen] = React.useState(false);
  const labelId = `enhanced-table-checkbox-${index}`;
  const [isOpenAcceptRequest, setIsOpenAcceptRequest] = useState(false);
  const [isOpenAcceptBudgetRequest, setIsOpenAcceptBudgetRequest] =
    useState(false);

  const statusRequest = row.requests_status_tbl?.RequestsStatusName;

  const colorByStatusRequest = (statusRequest) => {
    let color = 'black';
    switch (statusRequest) {
      case 'approved':
        return (color = 'green');
        break;
      case 'denied':
        return (color = 'red');

        break;
      case 'submitted':
        return (color = 'gray');

        break;
      case 'Re-Submited':
        return (color = 'orange');

        break;

      default:
        break;
    }
  };
  const colorStatus = colorByStatusRequest(statusRequest);
  const handleCloseDialogAccept = () => {
    setIsOpenAcceptRequest(false);
  };
  const handleCloseDialogAcceptBudget = () => {
    setIsOpenAcceptBudgetRequest(false);
  };
  const getUserRoleLabel = (userRole) => {
    console.log('TST', userRole);
    console.log('TST2', row.requests_status_tbl?.RequestsStatusName);
    console.log('TST2', row);
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
    };

    const { text, color } = map[userRole];

    return (
      <Label color={color}>
        {' '}
        <strong>{text}</strong>
      </Label>
    );
  };

  return (
    <React.Fragment>
      <AcceptRequestSubscriptionDialog
        handleCloseDialog={handleCloseDialogAccept}
        open={isOpenAcceptRequest}
        Data={row}
        ManagerRequestPage_RefreshData={ManagerRequestPage_RefreshData}
        isUserMode={false}
        isOwnerMode={true}
        const_Budget={DataSetting[0].const_Budget}
      />

      <TableRow hover tabIndex={-1} key={row.name}>
        <TableCell padding='checkbox'>
          <IconButton
            onClick={() => setIsOpenAcceptRequest(true)}
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
          {isInsideTable ? '2' : row.BudgetOnDemand}
        </TableCell>
        <TableCell width={isInsideTable ? '10px' : ''} align='center'>
          {isInsideTable
            ? '3'
            : moment(row.LastDateUpdateRequest).format('DD/MM/YYYY')}
        </TableCell>
        <TableCell width={isInsideTable ? '10px' : ''} align='center'>
          {isInsideTable
            ? '4'
            : moment(row.DateCreateRequest).format('DD/MM/YYYY')}
        </TableCell>
        <TableCell
          width={isInsideTable ? '10px' : ''}
          align='center'
          style={{ color: colorStatus }}>
          {isInsideTable
            ? '5'
            : getUserRoleLabel(row.requests_status_tbl?.RequestsStatusName)}
        </TableCell>
        <TableCell
          width={isInsideTable ? '10px' : ''}
          align='center'
          style={{ fontWeight: 'bold' }}>
          {isInsideTable ? '6' : row.ProjectNameinCloud}
        </TableCell>
        <TableCell
          width={isInsideTable ? '10px' : ''}
          align='center'
          style={{ color: '#4040fd' }}>
          {isInsideTable ? row.DisplayNumber : row.DisplayNumber}
        </TableCell>
        {!isInsideTable && (
          <TableCell align='center'>
            {row.update_budget_requests_tbls.length > 0 && (
              <IconButton
                aria-label='expand row'
                size='small'
                style={{ backgroundColor: open && '#5569ff' }}
                // className={ classes.showBudgetTBL}
                onClick={() => setOpen(!open)}>
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            )}
          </TableCell>
        )}
      </TableRow>
      {!isInsideTable && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
            <Collapse
              in={open}
              timeout='auto'
              unmountOnExit
              classes={{ wrapper: classes.collapse_Wrapper }}
              style={{ display: 'flex', justifyContent: 'center' }}>
              <BudgetInnerTable
                row={row}
                Data={row?.update_budget_requests_tbls}
                providerName={row?.ProjectNameinCloud}
                cloudName={row?.cloud_name?.Cloud}
                ManagerRequestPage_RefreshData={ManagerRequestPage_RefreshData}
                isUserMode={false}
                isOwnerMode={true}
              />
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
}

// function EnhancedTableHead(props) {
//   const { classes, order, orderBy, onRequestSort, isInsideTable } = props;
//   const createSortHandler = (property) => (event) => {
//     onRequestSort(event, property);
//   };

//   return (
//     <TableHead>
//       <TableRow>
//         <TableCell
//           padding='normal'
//           align='right'
//           className={classes.tableCellHead}>
//           פעולה
//         </TableCell>
//         {headCells.map((headCell) => (
//           <TableCell
//             key={headCell.id}
//             align={headCell.numeric ? 'center' : 'left'}
//             padding={headCell.disablePadding ? 'none' : 'normal'}
//             sortDirection={orderBy === headCell.id ? order : false}
//             className={classes.tableCell}>
//             <TableSortLabel
//               active={orderBy === headCell.id}
//               direction={orderBy === headCell.id ? order : 'asc'}
//               onClick={createSortHandler(headCell.id)}>
//               {headCell.label}
//               {orderBy === headCell.id ? (
//                 <span className={classes.visuallyHidden}>
//                   {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
//                 </span>
//               ) : null}
//             </TableSortLabel>
//           </TableCell>
//         ))}
//         {!isInsideTable && <TableCell />}
//       </TableRow>
//     </TableHead>
//   );
// }
function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort, isInsideTable, status } =
    props;
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
        {headCells.map((headCell) => (
          <TableCell
            padding='normal'
            align='center'
            className={classes.tableCellHead}>
            {headCell.label}
          </TableCell>
        ))}
        {!isInsideTable && <TableCell />}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTable({
  isInsideTable,
  type,
  Data,
  ManagerRequestPage_RefreshData,
  DataSetting,
  status,
  setProjectLength,
  projectLength,
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
          (e) => e.requests_status_tbl?.RequestsStatusName === 'closed'
        );
        return result;

      case 5:
        //all
        return sortFilter;
    }
  };
  console.log('DataSetting-Tb', DataSetting);
  const resultDataAfterSortByTabID = sortDataByTabs(status, Data);
  setProjectLength(resultDataAfterSortByTabID?.length);

  const classes = useEnhancedTableStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  console.log('EnhancedTable', Data);

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
    setPage(1);
  };
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, Data.length - page * rowsPerPage);

  return (
    <>
      <Card sx={{ p: 1, mb: 3 }}>
        <div
          className={classes.root}
          style={{
            width: !isInsideTable ? BIG_WIDTH : SMALL_WIDTH,
          }}>
          <div className={classes.paper}>
            {!isInsideTable && (
              <div
                className={classes.header}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0 10px 0 10px',
                }}>
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
                  rowCount={Data.length}
                  isInsideTable={isInsideTable}
                  tabType={type}
                />
                <TableBody>
                  {stableSort(
                    resultDataAfterSortByTabID,
                    getComparator(order, orderBy)
                  )
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      console.log('stableSort4', row);
                      return (
                        <Row
                          key={row.ProjectNameinCloud}
                          row={row}
                          isInsideTable={isInsideTable}
                          index={index}
                          DataSetting={DataSetting}
                          classes={classes}
                          ManagerRequestPage_RefreshData={
                            ManagerRequestPage_RefreshData
                          }
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
      </Card>
    </>
  );
}

export default function ManagerRequestPage({ Data, DataSetting, budgetData }) {
  console.log(
    '🚀 ~ file: index.js ~ line 439 ~ DataSetting ~ Data',
    DataSetting
  );
  const router = useRouter();

  clearInterval;
  const classes = useStyles();
  const [valueTags, setTagsValue] = useState('1');
  const [projectLength, setProjectLength] = useState(Data?.length);
  const { member } = React.useContext(AuthContext);

  // useEffect(() => {
  //   if (!member?.isManager) {
  //     router.push('/Requests/Users');
  //   }
  //   console.log('mng', member?.isManager);
  // }, [member]);
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
    setTimeout(() => {
      router.replace(router.asPath);
    }, 200);
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

  console.log('projectLengthManager', projectLength);

  console.log('valueTags', valueTags);
  //   <BudgetInnerTable
  //   row={row}
  //   Data={row.update_budget_requests_tbls}
  //   providerName={row.ProjectNameinCloud}
  //   cloudName={row.cloud_name.Cloud}
  //   ManagerRequestPage_RefreshData={ManagerRequestPage_RefreshData}
  //   isUserMode={false}
  // />
  return (
    <>
      {member?.isManager && (
        <Layout>
          <div dir='rtl'>
            <TabManager
              dataLength={projectLength}
              valueTags={valueTags}
              setTagsValue={setTagsValue}
              DataSetting={DataSetting}
              ManagerRequestPage_RefreshData={ManagerRequestPage_RefreshData}
            />
          </div>
          <Container maxWidth={'large'}>
            {/* <Card sx={{ p: 1, mb: 3 }}> */}
            <Paper className={classes.root}>
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
                  style={{ width: '100%', dir: 'rtl' }}
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
                  style={{ width: '100%', dir: 'rtl' }}
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
              </div>
              {parseInt(valueTags) === 1 && (
                <>
                  <EnhancedTable
                    DataSetting={DataSetting}
                    Data={Data}
                    isInsideTable={false}
                    setProjectLength={setProjectLength}
                    projectLength={projectLength}
                    status={1}
                    ManagerRequestPage_RefreshData={
                      ManagerRequestPage_RefreshData
                    }
                  />
                </>
              )}
              {parseInt(valueTags) === 2 && (
                <>
                  <EnhancedTable
                    DataSetting={DataSetting}
                    Data={Data}
                    isInsideTable={false}
                    status={2}
                    setProjectLength={setProjectLength}
                    projectLength={projectLength}
                    ManagerRequestPage_RefreshData={
                      ManagerRequestPage_RefreshData
                    }
                    type={valueTags}
                  />
                </>
              )}
              {parseInt(valueTags) === 3 && (
                <>
                  <Container maxWidth={'large'}>
                    <BudgetInnerTable
                      Data={budgetData}
                      // providerName={row.ProjectNameinCloud}
                      // cloudName={row.cloud_name.Cloud}
                      ManagerRequestPage_RefreshData={
                        ManagerRequestPage_RefreshData
                      }
                      isUserMode={false}
                      isOwnerMode={true}
                    />
                  </Container>
                  {/* <EnhancedTable
                  DataSetting={DataSetting}
                  Data={Data}
                  isInsideTable={false}
                  status={3}
                  setProjectLength={setProjectLength}
                  projectLength={projectLength}
                  ManagerRequestPage_RefreshData={
                    ManagerRequestPage_RefreshData
                  }
                /> */}
                </>
              )}
              {parseInt(valueTags) === 4 && (
                <>
                  <EnhancedTable
                    DataSetting={DataSetting}
                    Data={Data}
                    isInsideTable={false}
                    status={4}
                    setProjectLength={setProjectLength}
                    projectLength={projectLength}
                    ManagerRequestPage_RefreshData={
                      ManagerRequestPage_RefreshData
                    }
                  />
                </>
              )}
              {parseInt(valueTags) === 5 && (
                <>
                  <EnhancedTable
                    DataSetting={DataSetting}
                    Data={Data}
                    isInsideTable={false}
                    status={5}
                    setProjectLength={setProjectLength}
                    projectLength={projectLength}
                    ManagerRequestPage_RefreshData={
                      ManagerRequestPage_RefreshData
                    }
                  />
                </>
              )}
              {/* <EnhancedTable isInsideTable={false} /> */}
            </Paper>
            {/* </Card> */}
          </Container>
        </Layout>
      )}
      {!member?.isManager && <Layout></Layout>}
    </>
  );
}
export async function getStaticProps() {
  // Fetch events
  const dataRes = await fetch(
    `${API_URL}/requests-tbls?isRegularRequest=false`
  );
  const Data = await dataRes.json();
  const dataSettingRes = await fetch(`${API_URL}/SETTINGS-TBLS`);
  const DataSetting = await dataSettingRes.json();
  const budgetRes = await fetch(
    `${API_URL}/update-budget-requests-tbls?isRegularRequest=false`
  );
  const budgetData = await budgetRes.json();
  return {
    props: {
      Data,
      DataSetting,
      budgetData,
    },
    revalidate: 1,
  };
}
