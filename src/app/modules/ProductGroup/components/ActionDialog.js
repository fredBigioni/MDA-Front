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
import SelectItems, { createFilter } from 'react-select'
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
    const { action: { actionType, dialogVisible, item, detail }, all_products, intl } = props;
    const classes = useStyles();
    const [loading, setLoading] = React.useState(false);
    const [ productGroupData, setProductGroupData ]  = React.useState([]);
    const [ productSelecteds, setProductSelecteds ]  = React.useState([]);
    const [ deleteErrors, setDeleteErrors] = React.useState({});

    const parseProductGroup = () => {
        const  productData = []
        if(actionType == 'edit') {
            const productFromDetail = [];
            detail.map(productItem => {
                productFromDetail.push({label: productItem.description, value: productItem.productCode })
            })
            setProductSelecteds(productFromDetail)
        }
        all_products.map(product => {
            
            let description = product.description;
            productData.push({label: description.toUpperCase(), value: product.code  })
        })
        setProductGroupData(productData);
    }
    React.useEffect(() => {
        parseProductGroup()
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

        if(productSelecteds == null || productSelecteds.length == 0) {
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
                    let productCodes = []
                    productSelecteds.map(productItem => {
                        productCodes.push(productItem.value)
                    })
                    if(actionType == 'edit') {
                        await props.updateProductGroup(item.code, JSON.stringify({description: values.description, productCodes}))
                    }
                    if(actionType == 'create') {
                        await props.createProductGroup(JSON.stringify({description: values.description, productCodes}))
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
    const onDeleteProductGroup = async() => {
        enableLoading();
        setTimeout(async () => {
                try {
                    await props.deleteProductGroup(item.code)
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
                            <FormattedMessage id="CUSTOM_MARKET_DEFINITION.TITLE.PRODUCT" />
                        </label>                        
                        <div style={{width:'100%', height:400, marginRight:0, paddingRight: 0}}>
                            <SelectItems
                                disabled={false}
                                isMulti={true}
                                isSearchable={true}
                                isOptionSelected={true}
                                components={{ MenuList }}
                                filterOption={createFilter({ignoreAccents: false})}
                                onChange={setProductSelecteds}
                                options={productGroupData}
                                placeholder={intl.formatMessage({id: 'PRODUCT_GROUP.SELECT_TITLE'})}
                                value={productSelecteds}
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
                    <p><FormattedMessage id="PRODUCT_GROUP.DELETE_TITLE" values={{ productGroup: item.description }}/></p>
                </div>
            )
        }
    }

    const renderTitle = () => {
        let title = '';
        if(actionType == 'create') {
            title = intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.CREATE_GROUP.PRODUCT"})
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
                    onClick={onDeleteProductGroup} 
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
            {intl.formatMessage({id: actionType == 'edit' ? "FORM.ACTION.CANCEL" : "FORM.ACTION.CLOSE" })}
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