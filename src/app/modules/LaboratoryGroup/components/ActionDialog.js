import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from '../_redux/Actions';
import { injectIntl, FormattedMessage } from "react-intl";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import SelectItems, { createFilter } from 'react-select'
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { List } from 'react-virtualized';
import { useFormik } from 'formik';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useStyles } from '../../../Style/GeneralStyles';

const MenuList = props => {
    const rows = props.children;
    const rowRenderer = ({ key, index, isScrolling, isVisible, style }) => {
        return (
            <div key={key} style={style}>
                {rows[index]}
            </div>
        )
    }  
    return (
      <List
        style={{ width: '100%' }}
        width={800}
        height={350}
        rowHeight={30}
        rowCount={rows.length}
        rowRenderer={rowRenderer}
      />
    );
};

const ActionDialog = (props) => {
    const { action: { actionType, dialogVisible, item, detail }, all_laboratories, intl } = props;
    const classes = useStyles();
    const [loading, setLoading] = React.useState(false);
    const [ laboratoryGroupData, setLaboratoryGroupData ]  = React.useState([]);
    const [ laboratorySelecteds, setLaboratorySelecteds ]  = React.useState([]);
    const [ deleteErrors, setDeleteErrors] = React.useState({});

    const parseLaboratoriesGroup = () => {
        const  laboratoryData = []
        if(actionType == 'edit') {
            const laboratoryFromDetail = [];
            detail.map(laboratoryItem => {
                laboratoryFromDetail.push({label: laboratoryItem.description, value: laboratoryItem.laboratoryCode })
            })
            setLaboratorySelecteds(laboratoryFromDetail)

        }
        all_laboratories.map(laboratory => {
            
            let description = laboratory.description;
            laboratoryData.push({label: description.toUpperCase(), value: laboratory.code  })
        })
        setLaboratoryGroupData(laboratoryData);
    }
    React.useEffect(() => {
        parseLaboratoriesGroup()
    },[])

    const enableLoading = () => {
        setLoading(true);
    };
    
    const disableLoading = () => {
        setLoading(false);
    };  

    const validate = values => {
        const errors = {};
        if (!values.description) {
          errors.description = <FormattedMessage id="FORM.ERROR.REQUIRED_FIELD" />
        }
        if (!values.class) {
          errors.class = <FormattedMessage id="FORM.ERROR.REQUIRED_FIELD" />
        }
      
        if(laboratorySelecteds == null || laboratorySelecteds.length == 0) {
            errors.minItems = <FormattedMessage id="FORM.ERROR.REQUIRED_FIELD" />
        }

        return errors;
    };
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            description: actionType == 'edit' ? item.description : '',
            class: actionType == 'edit' ? item.class : ''
        },
        validate: validate,
        onSubmit: (values, { setSubmitting, setErrors }) => {
            enableLoading();
            setTimeout(async () => {
                try {
                    let laboratoryCodes = []
                    laboratorySelecteds.map(laboratoryItem => {
                        laboratoryCodes.push(laboratoryItem.value)
                    })
                    if(actionType == 'edit') {
                        await props.updateLaboratoryGroup(item.code, JSON.stringify({description: values.description, class: values.class,  laboratoryCodes}))
                    }
                    if(actionType == 'create') {
                        await props.createLaboratoryGroup(JSON.stringify({description: values.description, class: values.class,  laboratoryCodes}))
                    }
                    disableLoading();
                    props.closeDialogAndReload()
                } catch(err) {
                    setErrors( {api: <FormattedMessage id="FORM.ERROR.API_EXCEPTION" />} )
                    disableLoading();
                } finally {
                    setSubmitting(false);
                }
            }, 500)
        }
    });

    const handleClose = () => {
        props.closeDialog();
    }
    const onDeleteLaboratoryGroup = async() => {
        enableLoading();
        setTimeout(async () => {
            try {
                await props.deleteLaboratoryGroup(item.code)
                disableLoading();
                props.closeDialogAndReload()
            } catch(err) {
                setDeleteErrors( {api: <FormattedMessage id="FORM.ERROR.API_EXCEPTION" />} )
                disableLoading();
            }
        }, 500)   
    }
    
    const renderContent = () => {
        if(actionType == 'edit' || actionType == 'create') {
            return (
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        className={`mb-4`}
                        fullWidth
                        id="description"
                        name="description"
                        label="Título"
                        value={formik.values.description}
                        autoComplete="off"
                        onChange={formik.handleChange}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.touched.description && formik.errors.description}
                    />
                    <FormControl className={`d-block mb-4 mt-0`}>
                        <label className="pf-10">
                            <FormattedMessage id="LABORATORY_GROUP.FORM_CLASS" />
                        </label>
                        <Select
                            className={`mt-0`}
                            fullWidth
                            id="class"
                            name="class"
                            label={intl.formatMessage({id: 'LABORATORY_GROUP.FORM_CLASS'})}
                            value={formik.values.class}
                            onChange={formik.handleChange}
                            error={formik.touched.class && Boolean(formik.errors.class)}
                        >
                            <MenuItem key='TOTAL' value={'T'} selected={formik.values.class == 'T' ? true : false}>
                                <FormattedMessage id="MASTER.CLASS.TOTAL" />
                            </MenuItem>
                            <MenuItem key='ETICO' value={'E'} selected={formik.values.class == 'E' ? true : false}>
                                <FormattedMessage id="MASTER.CLASS.ETICO" />
                            </MenuItem>
                            <MenuItem key='POPULAR' value={'P'} selected={formik.values.class == 'P' ? true : false}>
                                <FormattedMessage id="MASTER.CLASS.POPULAR" />
                            </MenuItem>
                        </Select>
                    </FormControl>                        
                    <FormControl className={`d-block mb-4 mt-2`}>
                        <label className={Boolean(formik.errors.minItems) ? 'pf-10 MuiFormLabel-root Mui-error' : 'pf-10' }>
                            <FormattedMessage id="CUSTOM_MARKET_DEFINITION.TITLE.LABORATORY" />
                        </label>                        
                        <div style={{width:'100%', height:400, marginRight:0, paddingRight: 0}}>
                            <SelectItems
                                disabled={false}
                                isMulti={true}
                                isSearchable={true}
                                isOptionSelected={true}
                                components={{ MenuList }}
                                filterOption={createFilter({ignoreAccents: false})}
                                onChange={setLaboratorySelecteds}
                                options={laboratoryGroupData}
                                placeholder={intl.formatMessage({id: 'LABORATORY_GROUP.SELECT_TITLE'})}
                                value={laboratorySelecteds}
                                openMenuOnClick={true}
                                menuIsOpen={true}
                            />
                        </div>
                        {Boolean(formik.errors.minItems) &&
                            <span style={{color:'#f018a6', marginBottom: 20}}>{intl.formatMessage({id: 'FORM.ERROR.REQUIRED_FIELD'})}</span>
                        }                           
                    </FormControl>
                </form>
            )
        }
        if(actionType == 'delete') {
            return (
                <div className={[classes.root, 'mb-10']}>
                    <p><FormattedMessage id="LABORATORY_GROUP.DELETE_TITLE" values={{ laboratoryGroup: item.description }}/></p>
                </div>
            )
        }
    }
    const renderTitle = () => {
        let title = '';
        if(actionType == 'create') {
            title = intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.CREATE_GROUP.LABORATORY"})
        }
        if(actionType == 'edit') {
            title = item.description
        }
        if(actionType == 'delete') {
            title = intl.formatMessage({id: "FORM.ACTION.DELETE"})
        }
        return <span className="text-uppercase">{title}</span>
    }
    const renderButtons = () => {
        if(actionType == 'edit' || actionType == 'create') {
            return (
                <Button 
                    onClick={formik.handleSubmit} 
                    color="primary" 
                    disabled={loading ? true : false}
                >
                    {loading && <span className="ml-3 spinner spinner-green"></span>}
                    <span style={{paddingLeft:'25px'}}>Guardar</span>
                </Button>
            )
        }
        if(actionType == 'delete') {
            return (
                <Button 
                    onClick={onDeleteLaboratoryGroup} 
                    disabled={loading ? true : false}
                >
                    {loading && <span className="ml-3 spinner spinner-red"></span>}
                    <span style={{color: loading ? '#ccc' : 'red', paddingLeft:'25px'}}>Eliminar</span>
                </Button>
            )
        }
        return null
    }
    
    return (
        <Dialog 
            maxWidth="sm"
            fullWidth={true}
            open={dialogVisible} 
            onClose={handleClose} 
            aria-labelledby="form-dialog-title"
        >
            <DialogContent>
                <DialogContentText> 
                    <>{renderTitle()}</>
                </DialogContentText>
                {renderContent()}
            </DialogContent>
            <DialogActions>
                {formik.errors.api &&
                    <div className="MuiFormLabel-root Mui-error text-left pl-5" style={{width: '100%', color: '#f018a6'}}>{formik.errors.api}</div>
                }  
                {deleteErrors.api &&
                    <div className="MuiFormLabel-root Mui-error text-left pl-5" style={{width: '100%', color: '#f018a6'}}>{deleteErrors.api}</div>
                }                                   
                <Button 
                    onClick={handleClose} 
                    color="primary" 
                    disabled={loading ? true : false}>
                    {intl.formatMessage({ id: "FORM.ACTION.CANCEL" })}
                </Button>
                {renderButtons()}
            </DialogActions>
        </Dialog>
    )
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

export default injectIntl(connect(null,mapDispatchToProps)(ActionDialog));