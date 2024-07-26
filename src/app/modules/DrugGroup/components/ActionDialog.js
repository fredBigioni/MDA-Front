import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from '../_redux/Actions';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import { List } from 'react-virtualized';
import { useFormik } from 'formik';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select, { createFilter } from 'react-select'
import { useStyles } from '../../../Style/GeneralStyles';
import { injectIntl, FormattedMessage } from "react-intl";

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
    const { action: { actionType, dialogVisible, item, detail }, all_drugs, intl } = props;
    const classes = useStyles();
    const [loading, setLoading] = React.useState(false);
    const [ drugGroupData, setDrugGroupData ]  = React.useState([]);
    const [ drugSelecteds, setDrugSelecteds ]  = React.useState([]);
    const [ deleteErrors, setDeleteErrors] = React.useState({});

    const parseDrugsGroup = () => {
        const  drugData = []
        if(actionType == 'edit') {
            const drugsFromDetail = [];
            detail.map(drugItem => {
                drugsFromDetail.push({label: drugItem.description, value: drugItem.drugCode })
            })
            setDrugSelecteds(drugsFromDetail)
        }
        all_drugs.map(drug => {
            
            let description = drug.description;
            drugData.push({label: description.toUpperCase(), value: drug.code  })
        })
        setDrugGroupData(drugData);
    }
    React.useEffect(() => {
        parseDrugsGroup()
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
      
        if(drugSelecteds == null || drugSelecteds.length == 0) {
            errors.minItems = <FormattedMessage id="FORM.ERROR.REQUIRED_FIELD" />
        }

        return errors;
    };
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            description: actionType == 'edit' ? item.description : ''
        },
        validate: validate,
        onSubmit: (values, { setSubmitting, setErrors }) => {
            enableLoading();
            setTimeout(async () => {
                try {
                    let drugCodes = []
                    drugSelecteds.map(drugItem => {
                        drugCodes.push(drugItem.value)
                    })
                    if(actionType == 'edit') {
                        await props.updateDrugGroup(item.code, JSON.stringify({description: values.description, drugCodes}))
                    }
                    if(actionType == 'create') {
                        await props.createDrugGroup(JSON.stringify({description: values.description, drugCodes}))
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
    const onDeleteDrugGroup = async() => {
        enableLoading();
        setTimeout(async () => {
                try {
                    await props.deleteDrugGroup(item.code)
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
                    <FormControl className={`d-block mb-4 mt-2`}>
                        <label className={Boolean(formik.errors.minItems) ? 'pf-10 MuiFormLabel-root Mui-error' : 'pf-10' }>
                            <FormattedMessage id="CUSTOM_MARKET_DEFINITION.TITLE.DRUG" />
                        </label>                        
                        <div style={{width:'100%', height:400, marginRight:0, paddingRight: 0}}>
                            <Select
                                disabled={false}
                                isMulti={true}
                                isSearchable={true}
                                isOptionSelected={true}
                                components={{ MenuList }}
                                filterOption={createFilter({ignoreAccents: false})}
                                onChange={setDrugSelecteds}
                                options={drugGroupData}
                                placeholder={intl.formatMessage({id: 'DRUG_GROUP.SELECT_TITLE'})}
                                value={drugSelecteds}
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
                    <p><FormattedMessage id="DRUG_GROUP.DELETE_TITLE" values={{ drugGroup: item.description }}/></p>
                </div>
            )
        }
    }
    const renderTitle = () => {
        let title = '';
        if(actionType == 'create') {
            title = intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.CREATE_GROUP.DRUG"})
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
                    onClick={onDeleteDrugGroup} 
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
function getItemObject(item) {
    return JSON.parse(atob(item.value))
}
export default injectIntl(connect(null,mapDispatchToProps)(ActionDialog));