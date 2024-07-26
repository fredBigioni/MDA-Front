import React from 'react';
import { FormattedMessage, injectIntl } from "react-intl";
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CustomMarketDetailEdit from './CustomMarketDetailEdit'
import CustomMarketDetailDelete from './CustomMarketDetailDelete'

function EnhancedTableHead(props) {
    const { classes, onSelectAllClick, numSelected, rowCount, intl, isOwnProduct } = props;

    const headCells = [
        { id: 'description', numeric: false, disablePadding: true, label: '' },
        { id: 'intemodifier', numeric: true, disablePadding: false, label: intl.formatMessage({id: "CUSTOM_MARKET_DETAIL.INTEMODIFIER.SHORT"}) },
        { id: 'modifier', numeric: false, disablePadding: false, label: intl.formatMessage({id: "CUSTOM_MARKET_DETAIL.MODIFIER.SHORT"}) },
        { id: 'ensureVisible', numeric: false, disablePadding: false, label: intl.formatMessage({id: "CUSTOM_MARKET_DETAIL.ENSURE_VISIBLE"}) },
        { id: 'expand', numeric: false, disablePadding: false, label: intl.formatMessage({id: "CUSTOM_MARKET_DETAIL.EXPAND"}) },
        { id: 'graphs', numeric: false, disablePadding: false, label: intl.formatMessage({id: "CUSTOM_MARKET_DETAIL.GRAPHS"}) },
        { id: 'resume', numeric: false, disablePadding: false, label: intl.formatMessage({id: "CUSTOM_MARKET_DETAIL.RESUME"}) },
        { id: 'pattern', numeric: false, disablePadding: false, label: intl.formatMessage({id: "CUSTOM_MARKET_DETAIL.PATTERN"}) },
        { id: 'productType', numeric: false, disablePadding: false, label: intl.formatMessage({id: "CUSTOM_MARKET_DETAIL.PRODUCT_TYPE"}) },
    ];

    if (isOwnProduct == true) {
        headCells.push({ id: 'ownProduct', numeric: false, disablePadding: false, label: intl.formatMessage({id: "CUSTOM_MARKET_DETAIL.OWN_PRODUCT"}) })
    }

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                <Checkbox
                    indeterminate={numSelected > 0 && numSelected < rowCount}
                    checked={rowCount > 0 && numSelected === rowCount}
                    onChange={onSelectAllClick}
                    inputProps={{ 'aria-label': 'select all desserts' }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell key={headCell.label}>{headCell.label}</TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    rowCount: PropTypes.number.isRequired,
    intl: PropTypes.object.isRequired,
    isOwnProduct: PropTypes.object.isRequired,
};

const useToolbarStyles = makeStyles((theme) => (
    {
        root: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(1),
        },
        highlight:
            theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
                }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
                },
        title: {
            flex: '1 1 100%',
        },
    }
));

const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const { intl, numSelected, selected, isOwnProduct, clearSelected } = props;
    const [openEditModal, setOpenEditModal] = React.useState(false);
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
    

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
    };    

    const handleOpenEditModal = (event) => {
        setOpenEditModal(true);
    };

    const handleCloseDeleteModal = (clear = false) => {
        setOpenDeleteModal(false);
        
        if (clear == true) {
            clearSelected()
        }
    };    

    const handleOpenDeleteModal = (event) => {
        setOpenDeleteModal(true);
    };    

    return (
        <Toolbar
            className={clsx(classes.root, { [classes.highlight]: numSelected > 0, })}>
            {numSelected > 0 && (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                {numSelected} {numSelected == 1 ? <FormattedMessage id="MASTER.SELECTED" />: <FormattedMessage id="MASTER.SELECTEDS" /> }
                </Typography>
            )}
            {numSelected > 0 && (
                <>
                    <Tooltip title={intl.formatMessage({id: "CUSTOM_MARKET_DETAIL.ACTION.EDIT"})}>
                        <IconButton aria-label="" onClick={handleOpenEditModal} color="primary">
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={intl.formatMessage({id: "CUSTOM_MARKET_DETAIL.ACTION.DELETE"})}>
                        <IconButton aria-label="" onClick={handleOpenDeleteModal} color="primary">
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </>           
            )}
            <CustomMarketDetailEdit open={openEditModal} handleClose={handleCloseEditModal} itemSelectedIndex={selected} ownProduct={isOwnProduct}/>
            <CustomMarketDetailDelete open={openDeleteModal} handleClose={handleCloseDeleteModal} itemSelectedIndex={selected}/>
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
    intl: PropTypes.object.isRequired,
    isOwnProduct: PropTypes.object.isRequired,
    clearSelected: PropTypes.object.isRequired,
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(1),
    },
    table: {
        minWidth: 750,
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
}));

const CustomMarketDetail = (props) => {
    const { intl, rows, filterOwnProduct } = props;
    const classes = useStyles();
    const [selected, setSelected] = React.useState([]);
    const [dense, setDense] = React.useState(true);
    const [rowsPerPage, setRowsPerPage] = React.useState(999);
    const [switchOwnProduct, setSwitchOwnProduct] = React.useState(false);
    const [customMarketDetail, setCustomMarketDetail] = React.useState(rows)    

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = customMarketDetail.map((n) => n.index);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, index) => {
        const selectedIndex = selected.indexOf(index);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, index);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const isSelected = (index) => selected.indexOf(index) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, customMarketDetail.length - rowsPerPage);
    
    const handleChangeSwitchOwnProduct = (event) => {
        setSwitchOwnProduct(event.target.checked);
        if (event.target.checked) {
            setSelected([])
            setCustomMarketDetail(rows.filter( x => x.ownProductsReport === true))
        } else {
            setCustomMarketDetail(rows)
        }
    };   
    
    const clearSelected = () => {
        setSelected([])
    }

    React.useEffect(() => { 
        setSwitchOwnProduct(false)
        setCustomMarketDetail(rows)
    }, [rows]) 

    return (
        <div className={classes.root}>
            <Paper className={classes.paper} style={{position: 'relative'}}>
                {filterOwnProduct === true  && (
                    <FormControlLabel
                        className="float-left m-2"
                        style={{position: 'absolute', left: '0px', zIndex: '2'}}
                        control={
                            <Switch
                                checked={switchOwnProduct}
                                onChange={handleChangeSwitchOwnProduct}
                                name="chkOwnProduct"
                                color="primary"
                            />
                        }
                        label={<FormattedMessage id="CUSTOM_MARKET_DETAIL.OWN_PRODUCTS" />}
                    />
                )}
                {(selected.length > 0 || filterOwnProduct === true) && 
                    <EnhancedTableToolbar numSelected={selected.length} clearSelected={clearSelected} selected={selected} intl={intl} isOwnProduct={switchOwnProduct} />
                }
                <TableContainer  style={{maxHeight: '300px', overflowY: 'auto' }} > 
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                        aria-label="enhanced table"
                        stickyHeader
                    >
                    <EnhancedTableHead
                        classes={classes}
                        numSelected={selected.length}
                        onSelectAllClick={handleSelectAllClick}
                        rowCount={customMarketDetail.length}
                        intl={intl}
                        isOwnProduct={filterOwnProduct}
                    />
                    <TableBody>
                        {customMarketDetail.map((cmd, index) => {
                            const isItemSelected = isSelected(cmd.index);
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <TableRow
                                    style={{cursor: 'pointer'}}
                                    hover
                                    onClick={(event) => handleClick(event, cmd.index)}
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={cmd.index}
                                    selected={isItemSelected}
                                >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={isItemSelected}
                                        inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </TableCell>
                                <TableCell 
                                    className={(cmd.itemCondition == 'N') ? 'text-danger' : (cmd.itemCondition == 'A') ? 'text-primary' : ''}
                                    component="th" 
                                    id={labelId} 
                                    scope="cmd" 
                                    padding="none">
                                    {cmd.name}
                                    {cmd.isGroup == true &&
                                        <span className="text-primary pl-4" key={labelId}><strong>&#8859;</strong></span>
                                    }
                                </TableCell>
                                <TableCell align="center"> {cmd.intemodifier} </TableCell>
                                <TableCell align="center"> {cmd.modifier} </TableCell>
                                <TableCell align="center">
                                <Checkbox checked={cmd.ensureVisible} />
                                </TableCell>
                                <TableCell align="center">
                                    <Checkbox checked={cmd.expand}/>
                                </TableCell>
                                <TableCell align="center">
                                        <Checkbox checked={cmd.graphs}/>
                                </TableCell>
                                <TableCell align="center">
                                    <Checkbox checked={cmd.resume}/>
                                </TableCell>
                                <TableCell align="center">{cmd.pattern}</TableCell>
                                <TableCell align="center">{cmd.productTypeDescription}</TableCell>
                                {filterOwnProduct == true && 
                                    <TableCell align="center">
                                        <Checkbox checked={cmd.ownProduct}/>
                                    </TableCell>
                                }
                                </TableRow>
                            );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    );
}

export default injectIntl(CustomMarketDetail);