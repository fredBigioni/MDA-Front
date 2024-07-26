import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from '../_redux/Actions';
import { injectIntl, FormattedMessage } from "react-intl";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import Select, { createFilter } from 'react-select'
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
    const { action: { actionType, dialogVisible, item, detail }, intl, all_productsPresentations } = props;
    const classes = useStyles();
    const [loading, setLoading] = React.useState(false);
    const [ productPresentationGroupData, setProductPresentationGroupData ]  = React.useState([]);
    const [ productPresentationSelecteds, setProductPresentationSelecteds ]  = React.useState([]);
    const [ deleteErrors, setDeleteErrors] = React.useState({});

    const parseProductPresentationGroup = () => {
        const  productData = []
        if(actionType == 'edit') {
            const productPresentationFromDetail = [];
            detail.map(productPresentationItem => {
                productPresentationFromDetail.push({label: productPresentationItem.description, value: productPresentationItem.code })
            })
            setProductPresentationSelecteds(productPresentationFromDetail)
        }
        all_productsPresentations.map(productPresentation => {
            
            let description = productPresentation.description;
            productData.push({label: description.toUpperCase(), value: productPresentation.code  })
        })
        setProductPresentationGroupData(productData);
        
    }
    React.useEffect(() => {
        parseProductPresentationGroup()
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
      
        if(productPresentationSelecteds == null || productPresentationSelecteds.length == 0) {
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
                    let productPresentationCodes = []
                    productPresentationSelecteds.map(productItem => {
                        productPresentationCodes.push(productItem.value)
                    })
                    if(actionType == 'edit') {
                        await props.updateProductPresentationGroup(item.code, JSON.stringify({description: values.description, productPresentationCodes}))
                    }
                    if(actionType == 'create') {
                        await props.createProductPresentationGroup(JSON.stringify({description: values.description, productPresentationCodes}))
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
    const onDeleteProductPresentationGroup = async() => {
        enableLoading();
        setTimeout(async () => {
                try {
                    await props.deleteProductPresentationGroup(item.code)
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
                            <FormattedMessage id="CUSTOM_MARKET_DEFINITION.TITLE.PRODUCT_PRESENTATION" />
                        </label>                           
                        <div style={{width:'100%', height:400, marginRight:0, paddingRight: 0}}>
                            <Select
                                disabled={false}
                                isMulti={true}
                                isSearchable={true}
                                isOptionSelected={true}
                                filterOption={createFilter({ignoreAccents: false})}
                                components={{ MenuList }}
                                onChange={setProductPresentationSelecteds}
                                options={productPresentationGroupData}
                                placeholder={intl.formatMessage({id: 'PRODUCT_PRESENTATION_GROUP.SELECT_TITLE'})}
                                value={productPresentationSelecteds}
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
                    <p><FormattedMessage id="PRODUCT_PRESENTATION_GROUP.DELETE_TITLE" values={{ productPresentationGroup: item.description }}/></p>
                </div>
            )
        }
    }
    const renderTitle = () => {
        let title = '';
        if(actionType == 'create') {
            title = intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.CREATE_GROUP.PRODUCT_PRESENTATION"})
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
                    onClick={onDeleteProductPresentationGroup} 
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