import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';

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

const BIG_WIDTH = '100%'
const SMALL_WIDTH = 835

// Style
const useEnhancedTableStyles = makeStyles((theme) => ({
    root: {
        width: 600,
        // direction: 'rtl',
    },
    collapse_Wrapper: {
        width: 600
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
        fontWeight: 'bold'
    },
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
        fontWeight: 'bold'
    },
    tableCell: {
        fontWeight: 'bold'
    }
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
const rows = [
    createData('Azure', 8000, '21/5/2021', '15/4/2021', 'Approve', 'sub_1234', 1000),
    createData('Azure', 8000, '21/5/2021', '1/4/2021', 'Approve', 'sub_9876', 1001),
    createData('Azure', 8000, '21/5/2021', '10/4/2021', 'Approve', 'sub_3456', 1002),
    createData('Azure', 8000, '21/5/2021', '11/4/2021', 'Approve', 'sub_1876', 1003),
    createData('Azure', 8000, '21/5/2021', '1/3/2021', 'Approve', 'sub_634', 1004),
    createData('Azure', 8000, '21/5/2021', '1/3/2021', 'Approve', 'sub_634', 1004),

];

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
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    { id: 'portal', numeric: true, disablePadding: false, label: 'ספק עון' },
    { id: 'bugget', numeric: true, disablePadding: false, label: 'תקציב' },
    { id: 'lastDate', numeric: true, disablePadding: false, label: 'ת.עדכון אחרון' },
    { id: 'createDate', numeric: true, disablePadding: false, label: 'ת.יצירת בקשה' },
    { id: 'status', numeric: true, disablePadding: false, label: 'סטטוס' },
    { id: 'name', numeric: true, disablePadding: false, label: 'שם SUB' },
    { id: 'id', numeric: true, disablePadding: false, label: 'מזהה בקשה' },
];

function Row(props) {
    const { row, isInsideTable, index, classes } = props;
    const [open, setOpen] = React.useState(false);
    const labelId = `enhanced-table-checkbox-${index}`;

    return (
        <React.Fragment>
            <TableRow
                hover
                tabIndex={-1}
                key={row.name}
            >
                <TableCell padding="checkbox">
                    <IconButton color="primary">
                        <OpenInNewIcon />
                    </IconButton>
                </TableCell>
                <TableCell width={isInsideTable ? "10px" : ""} align="center" component="th" id={labelId} scope="row" padding="none">
                    {row.portal}
                </TableCell>
                <TableCell width={isInsideTable ? "10px" : ""} align="center">{row.bugget}</TableCell>
                <TableCell width={isInsideTable ? "10px" : ""} align="center">{row.lastDate}</TableCell>
                <TableCell width={isInsideTable ? "10px" : ""} align="center">{row.createDate}</TableCell>
                <TableCell width={isInsideTable ? "10px" : ""} align="center" style={{ color: 'green' }}>{row.status}</TableCell>
                <TableCell width={isInsideTable ? "10px" : ""} align="center" style={{ fontWeight: 'bold' }}>{row.name}</TableCell>
                <TableCell width={isInsideTable ? "10px" : ""} align="center" style={{ color: '#4040fd' }}>{row.id}</TableCell>
                {
                    !isInsideTable &&
                    <TableCell align="center">
                        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                }
            </TableRow>
            {
                !isInsideTable &&
                <TableRow >
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
                        <Collapse in={open} timeout="auto" unmountOnExit style={{ display: 'flex', justifyContent: 'center' }}
                            classes={
                                { wrapper: classes.collapse_Wrapper }
                            }

                        >
                            <EnhancedTable isInsideTable={true} />
                        </Collapse>
                    </TableCell>
                </TableRow>
            }
        </React.Fragment >
    );
}

function EnhancedTableHead(props) {
    const { classes, order, orderBy, onRequestSort, isInsideTable } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow >
                <TableCell
                    padding='normal'
                    align='right'
                    className={classes.tableCellHead}>
                    פעולה
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'center' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        className={classes.tableCell}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
                {
                    !isInsideTable &&
                    <TableCell />
                }
            </TableRow>
        </TableHead>
    );
}

function EnhancedTable({ isInsideTable }) {
    const classes = useEnhancedTableStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

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

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <div className={classes.root}
            style={{
                width: !isInsideTable ? BIG_WIDTH : SMALL_WIDTH
            }}>
            <div className={classes.paper}>
                {
                    !isInsideTable &&
                    <div className={classes.header}>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                        <div id="empty-space" style={{ flex: 1 }}></div>
                        <Typography variant="h6" component="h6" className={classes.headerTitle}>
                            מציג {rows.length} בקשות
                        </Typography>
                    </div>
                }
                <Divider />
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={isInsideTable ? 'small' : 'medium'}
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead

                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                            isInsideTable={isInsideTable}
                        />
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    return (
                                        <Row key={row.name} row={row} isInsideTable={isInsideTable} index={index} classes={classes} />
                                    );
                                })}
                            {
                                emptyRows > 0 && (
                                    <TableRow>
                                        <TableCell colSpan={10} />
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
}
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
    }
];

const TagsStatus = [
    {
        value: 'Owner',
        label: 'Owner'
    },
    {
        value: 'Bugget',
        label: 'Bugget',
    },

];

export default function Main() {
    const classes = useMainStyles();
    const [status, setStatus] = React.useState('All');
    const [Tags, setTags] = React.useState('EUR');

    const handleTagsChange = (event) => {
        setTags(event.target.value);
    };
    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };

    return (
        <Paper className={classes.root}>
            <div style={{ display: 'flex', paddingTop: '4rem' }} className={classes.header}>
                <TextField
                    id="outlined-margin-none"
                    className={classes.textField}
                    placeholder="Search by project name"
                    variant="outlined"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    style={{
                        margin: 5,
                        flex: 2
                    }}
                />
                <TextField
                    id="outlined-select-tags"
                    placeholder={'Tags'}
                    select
                    label="Tags"
                    onChange={handleTagsChange}
                    variant="outlined"
                    style={{
                        margin: 5,
                        flex: 1
                    }}
                >
                    {TagsStatus.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    id="outlined-select-status"
                    select
                    label="Status"
                    placeholder={'All'}
                    onChange={handleStatusChange}
                    variant="outlined"
                    style={{
                        margin: 5,
                        flex: 1,
                    }}
                >
                    {StatusRequest.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </div>
            <Divider />
            <EnhancedTable isInsideTable={false} />
        </Paper>
    );
}
