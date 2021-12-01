import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import SearchIcon from '@material-ui/icons/Search';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import InputAdornment from '@material-ui/core/InputAdornment';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Label from '../utils/Label';
import RequestAcceptBudgetDialog from '../../src/components/Dialogs/AcceptBudget/Request';
import GeneralConstants from '../constants/status-constants';

const BIG_WIDTH = '100%';
const SMALL_WIDTH = 1090;

// Style
const useEnhancedTableStyles = makeStyles((theme) => ({
  root: {
    // width: 600,
    // direction: 'rtl',
  },
  collapse_Wrapper: {
    // width: 600,
  },
  paper: {
    // width: SMALL_WIDTH,
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
  table: {
    width: SMALL_WIDTH,
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
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
    color: '#0c2d48',
  },
  tableCell: {
    fontWeight: 'bold',
  },
}));

// Components | functions
function createData(portal, bugget, lastDate, createDate, status, name, id) {
  return { portal, bugget, lastDate, createDate, status, name, id };
}

function Row(props) {
  const {
    row,
    providerName,
    cloudName,
    classes,
    ManagerRequestPage_RefreshData,
    isUserMode,
    requestID,
  } = props;
  console.log('requestID', requestID);
  const labelId = `budget-inner-table-${row.id}`;
  const [isOpenAcceptBudgetRequest, setIsOpenAcceptBudgetRequest] =
    useState(false);

  const colorStatus = GeneralConstants.colorByStatusRequest(
    GeneralConstants.requestTblIdToStatusName[row.requests_status_tbl]
  );

  const handleCloseDialogAcceptBudget = () => {
    setIsOpenAcceptBudgetRequest(false);
  };

  const getUserRoleLabel = (userRole) => {
    console.log('userRoleB', userRole);
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
      InProgress: {
        text: 'InProgress',
        color: '#6e759f',
      },
      Canceled: {
        text: 'Canceled',
        color: '#6e759f',
      },
    };

    const { text, color } = map[userRole];

    return (
      <Label color={color}>
        {' '}
        <strong>{userRole}</strong>
      </Label>
    );
  };

  console.log('rowBudget', row);
  return (
    <React.Fragment>
      <RequestAcceptBudgetDialog
        handleCloseDialog={handleCloseDialogAcceptBudget}
        open={isOpenAcceptBudgetRequest}
        Data={row}
        DataRow={row}
        ManagerRequestPage_RefreshData={ManagerRequestPage_RefreshData}
        isUserMode={isUserMode}
        requestID={row.requests_tbl}
      />
      <TableRow hover tabIndex={-1} key={row.name}>
        <TableCell padding='checkbox'>
          <IconButton
            onClick={() => setIsOpenAcceptBudgetRequest(true)}
            color='primary'>
            <OpenInNewIcon />
          </IconButton>
        </TableCell>
        <TableCell width='10px' align='center' style={{ fontSize: 15 }}>
          {moment(row.updatedAt).format('DD/MM/YYYY')}
        </TableCell>
        <TableCell width='10px' align='center' style={{ fontSize: 15 }}>
          {moment(row.createdAt).format('DD/MM/YYYY')}
        </TableCell>
        <TableCell
          width='10px'
          align='center'
          style={{ color: colorStatus, fontSize: 15 }}>
          {getUserRoleLabel(
            GeneralConstants.requestTblIdToStatusName[
              row.requests_status_tbl._id || row.requests_status_tbl
            ]
          )}
        </TableCell>
        <TableCell
          width='10px'
          align='center'
          component='th'
          id={labelId}
          scope='row'
          style={{ fontSize: 15 }}
          padding='none'>
          {row.NewBudget}
        </TableCell>

        <TableCell width='10px' align='center' style={{ fontSize: 15 }}>
          {row.CurrentBudget}
        </TableCell>

        {/* <TableCell width='10px' align='center' style={{ fontWeight: 'bold' }}>
          {providerName}
        </TableCell> */}
        <TableCell
          width='85px'
          align='center'
          style={{ color: '#4040fd', fontSize: 15 }}>
          {row.SubscriptionName}
        </TableCell>
        <TableCell
          width='85px'
          align='center'
          style={{ color: '#4040fd', fontSize: 15 }}>
          {row.DisplayNumber}
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function EnhancedTableHead(props) {
  const { classes } = props;
  console.log('budgetTable');
  return (
    <TableHead>
      <TableRow>
        <TableCell
          padding='normal'
          align='right'
          className={classes.tableCellHead}>
          פעולה
        </TableCell>
        {/* <TableCell
          padding='normal'
          align='right'
          className={classes.tableCellHead}>
          ספק ענן
        </TableCell> */}
        <TableCell
          padding='normal'
          align='right'
          className={classes.tableCellHead}>
          ת.עדכון האחרון
        </TableCell>
        <TableCell
          padding='normal'
          align='right'
          className={classes.tableCellHead}>
          ת.פתיחה
        </TableCell>
        <TableCell
          padding='normal'
          align='right'
          className={classes.tableCellHead}>
          סטטוס
        </TableCell>
        <TableCell
          padding='normal'
          align='right'
          className={classes.tableCellHead}>
          תקציב מבוקש
        </TableCell>
        <TableCell
          padding='normal'
          align='right'
          className={classes.tableCellHead}>
          תקציב נוכחי
        </TableCell>
        <TableCell
          padding='normal'
          align='right'
          className={classes.tableCellHead}>
         עבור פרויקט
        </TableCell>
        <TableCell
          padding='normal'
          align='right'
          className={classes.tableCellHead}>
          מזהה תקציב
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

function BudgetInnerTable(props) {
  const classes = useEnhancedTableStyles();
  const {
    Data,
    providerName,
    cloudName,
    ManagerRequestPage_RefreshData,
    isUserMode,
    isOwnerMode,
    row,
  } = props;
  console.log('budget from row', row);
  return (
    <div
      className={classes.root}
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}>
      <div className={classes.paper}>
        <Divider />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby='tableTitle'
            size={'small'}
            aria-label='enhanced table'>
            <EnhancedTableHead classes={classes} />
            <TableBody>
              {Data.map((row, index) => {
                return (
                  <Row
                    key={`row-key-${row.id}`}
                    requestID={row.id}
                    row={row}
                    providerName={providerName}
                    cloudName={cloudName ? cloudName : 'none'}
                    classes={classes}
                    ManagerRequestPage_RefreshData={
                      ManagerRequestPage_RefreshData
                    }
                    isUserMode={isUserMode}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default BudgetInnerTable;
