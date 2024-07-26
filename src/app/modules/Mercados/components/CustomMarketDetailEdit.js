import React, { useState } from "react";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from './../_redux/mercadosActions';
import { FormattedMessage } from "react-intl";
import Dialog from '@material-ui/core/Dialog';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { useFormik } from "formik";
import * as Yup from "yup";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

const CustomMarketDetailEditDialog = (props) => {
    const {customMarket, productTypes, itemSelectedIndex, ownProduct, open, handleClose} = props;
    const [loading, setLoading] = useState(false);

    const initialValues = {
        intemodifier: '',
        modifier: '',
        ensureVisible: '',
        expand: '',
        graphs: '',
        resume: '',        
        itemCondition: '',
        pattern: '',
        productTypeCode: '', 
        ownProduct: ''
    };

    const enableLoading = () => {
        setLoading(true);
    };

    const disableLoading = () => {
        setLoading(false);
    };    

    const handleCancel = () => {
        handleClose()
        formik.resetForm()
    }  


    const Schema = Yup.object().shape({
        intemodifier: Yup.string()     
        .test(
            'is-decimal',   
            'Formato invalido',
            value => value == undefined || (value + "").match(/^[0-9]+([,][0-9]{1,2})?$/) ,
        ),
        modifier:  Yup.string()
        .test(
            'is-decimal',   
            'Formato invalido',
            value => value == undefined || (value + "").match(/^[0-9]+([,][0-9]{1,2})?$/) ,
        ),
      });    

    const formik = useFormik({
        initialValues,
        validationSchema: Schema,
        onSubmit: (values, { setSubmitting, setErrors }) => {
        enableLoading();
        setTimeout(async () => {
            try {
                let customMarketModified = prepareSave(values)
                await props.updateCustomMarket(customMarketModified)
                disableLoading();
                handleClose()
            } catch(err) {
                setErrors( {api: <FormattedMessage id="FORM.ERROR.API_EXCEPTION" />} )
                disableLoading();
            } finally {
                setSubmitting(false);
                formik.resetForm()
            }
        }, 1000);
        },
    });

  const prepareSave = ({intemodifier, modifier, ensureVisible, expand, graphs, resume, pattern, itemCondition, productTypeCode, ownProduct}) => {
      let copyCustomMarket = JSON.parse(JSON.stringify(customMarket.data))                    
      itemSelectedIndex.map(itemIndex => {
        if (intemodifier !== "") {
            copyCustomMarket.customMarketDetail[itemIndex].intemodifier = intemodifier
        }
        if (modifier !== "") {
            copyCustomMarket.customMarketDetail[itemIndex].modifier = modifier
        }
        if (ensureVisible !== "") {
            copyCustomMarket.customMarketDetail[itemIndex].ensureVisible = ensureVisible
        }
        if (expand !== "") {
            copyCustomMarket.customMarketDetail[itemIndex].expand = expand
        }
        if (graphs !== "") {
            copyCustomMarket.customMarketDetail[itemIndex].graphs = graphs
        } 
        if (resume !== "") {
            copyCustomMarket.customMarketDetail[itemIndex].resume = resume
        }
        if (pattern !== "") {
            copyCustomMarket.customMarketDetail[itemIndex].pattern = pattern
        }           
        if (itemCondition !== "") {
            copyCustomMarket.customMarketDetail[itemIndex].itemCondition = itemCondition
        }   
        if (productTypeCode !== "") {
            copyCustomMarket.customMarketDetail[itemIndex].productTypeCode = parseInt(productTypeCode)
        }   
        if (ownProduct !== "") {
            copyCustomMarket.customMarketDetail[itemIndex].ownProduct = ownProduct
        }                                                              
      })

      return copyCustomMarket
  }

  return (
    <div>
      <Dialog 
        maxWidth="sm"
        fullWidth={true}
        open={open} 
        onClose={handleCancel} 
        aria-labelledby="form-dialog-title"
        >
        <DialogContent>
          <DialogContentText>
            <strong>
                <FormattedMessage id="CUSTOM_MARKET_DETAIL_DIALOG.TITLE" />
            </strong>
            <p></p>
            {customMarket.data.fullDescription}
          </DialogContentText>
            {/*begin::Form*/}
            <form
                onSubmit={formik.handleSubmit}
                className="form fv-plugins-bootstrap fv-plugins-framework"
            >
            {formik.status ? (
            <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
                <div className="alert-text font-weight-bold">{formik.status}</div>
            </div>
            ): null }
            <Tooltip 
                title={<FormattedMessage id="CUSTOM_MARKET_DETAIL.TOOLTIP.INTEMODIFIER" />}
                placement="left" 
                arrow
                enterDelay={700}
                enterNextDelay={700}
                >
                <TextField
                    className={`mb-4`}
                    fullWidth
                    id="intemodifier"
                    name="intemodifier"
                    label={<FormattedMessage id="CUSTOM_MARKET_DETAIL.INTEMODIFIER" />}
                    type="text"
                    value={formik.values.intemodifier}
                    autoComplete="off"
                    onChange={formik.handleChange}
                    error={formik.touched.intemodifier && Boolean(formik.errors.intemodifier)}
                    helperText={formik.touched.intemodifier && formik.errors.intemodifier}
                />
            </Tooltip>                
            <Tooltip 
                title={<FormattedMessage id="CUSTOM_MARKET_DETAIL.TOOLTIP.MODIFIER" />}
                placement="left" 
                arrow
                enterDelay={700}
                enterNextDelay={700}
                >
                <TextField
                    className={`mb-4`}
                    fullWidth
                    id="modifier"
                    name="modifier"
                    label={<FormattedMessage id="CUSTOM_MARKET_DETAIL.MODIFIER" />}
                    type="text"
                    value={formik.values.modifier}
                    autoComplete="off"
                    onChange={formik.handleChange}
                    error={formik.touched.modifier && Boolean(formik.errors.modifier)}
                    helperText={formik.touched.modifier && formik.errors.modifier}
                />
            </Tooltip>
            <Tooltip 
                title={<FormattedMessage id="CUSTOM_MARKET_DETAIL.TOOLTIP.ITEM_CONDITION" />}
                placement="left" 
                arrow
                enterDelay={700}
                enterNextDelay={700}
                >
                <FormControl className={`d-block mb-8 mt-4`}>
                    <label className={`pf-10 mb-0`}>
                        <FormattedMessage id="CUSTOM_MARKET_DETAIL.ITEM_CONDITION" />
                    </label>
                    <Select
                        style={{marginTop: '0px'}}
                        className={`mt-0`}
                        fullWidth
                        id="itemCondition"
                        name="itemCondition"
                        label="itemCondition"
                        value={formik.values.itemCondition}
                        onChange={formik.handleChange}
                        error={formik.touched.itemCondition && Boolean(formik.errors.itemCondition)}
                        helperText={formik.touched.itemCondition && formik.errors.itemCondition}
                        className={
                            (formik.values.itemCondition == 'N') ? 'text-danger' : 
                            (formik.values.itemCondition == 'A') ? 'text-primary' : ''
                        }
                    >
                        <MenuItem key='A' value="A">
                            <label className="text-primary">
                                <FormattedMessage id="MASTER.CONDITION.AND" />
                            </label>
                        </MenuItem>
                        <MenuItem key='O' value="O">
                            <label className="">
                                <FormattedMessage id="MASTER.CONDITION.OR" />
                            </label>
                        </MenuItem>
                        <MenuItem key='N' value="N">
                            <label className="text-danger">
                                <FormattedMessage id="MASTER.CONDITION.NOT" />
                            </label>
                        </MenuItem>
                    </Select>
                </FormControl> 
            </Tooltip> 
            <Tooltip 
                title={<FormattedMessage id="CUSTOM_MARKET_DETAIL.TOOLTIP.ENSURE_VISIBLE" />}
                placement="left" 
                arrow
                enterDelay={700}
                enterNextDelay={700}
                >
                <FormControl className={`d-block mb-8 mt-4`}>
                    <label className={`pf-10 mb-0`}>
                        <FormattedMessage id="CUSTOM_MARKET_DETAIL.ENSURE_VISIBLE" />
                    </label>
                    <Select
                        className={`mt-0`}
                        fullWidth
                        id="ensureVisible"
                        name="ensureVisible"
                        label="ensureVisible"
                        value={formik.values.ensureVisible}
                        onChange={formik.handleChange}
                        error={formik.touched.ensureVisible && Boolean(formik.errors.ensureVisible)}
                        helperText={formik.touched.ensureVisible && formik.errors.ensureVisible}
                    >
                        <MenuItem key='empty' value="">&nbsp;</MenuItem>
                        <MenuItem key='yes' value={true}>
                            <FormattedMessage id="MASTER.YES" />
                        </MenuItem>
                        <MenuItem key='no' value={false}>
                            <FormattedMessage id="MASTER.NO" />
                        </MenuItem>
                    </Select>
                </FormControl>
            </Tooltip> 
            <Tooltip 
                title={<FormattedMessage id="CUSTOM_MARKET_DETAIL.TOOLTIP.EXPAND" />}
                placement="left" 
                arrow
                enterDelay={700}
                enterNextDelay={700}
                >
                <FormControl className={`d-block mb-8 mt-4`}>
                    <label className={`pf-10 mb-0`}>
                        <FormattedMessage id="CUSTOM_MARKET_DETAIL.EXPAND" />
                    </label>
                    <Select
                        className={`mt-0`}
                        fullWidth
                        id="expand"
                        name="expand"
                        label="expand"
                        value={formik.values.expand}
                        onChange={formik.handleChange}
                        error={formik.touched.expand && Boolean(formik.errors.expand)}
                        helperText={formik.touched.expand && formik.errors.expand}
                    >
                        <MenuItem key='empty' value="">&nbsp;</MenuItem>
                        <MenuItem key='yes' value={true}>
                            <FormattedMessage id="MASTER.YES" />
                        </MenuItem>
                        <MenuItem key='no' value={false}>
                            <FormattedMessage id="MASTER.NO" />
                        </MenuItem>
                    </Select>
                </FormControl>
            </Tooltip> 
            <Tooltip 
                title={<FormattedMessage id="CUSTOM_MARKET_DETAIL.TOOLTIP.GRAPHS" />}
                placement="left" 
                arrow
                enterDelay={700}
                enterNextDelay={700}
                >
                <FormControl className={`d-block mb-8 mt-4`}>
                    <label className={`pf-10 mb-0`}>
                        <FormattedMessage id="CUSTOM_MARKET_DETAIL.GRAPHS" />
                    </label>
                    <Select
                        className={`mt-0`}
                        fullWidth
                        id="graphs"
                        name="graphs"
                        label="graphs"
                        value={formik.values.graphs}
                        onChange={formik.handleChange}
                        error={formik.touched.graphs && Boolean(formik.errors.graphs)}
                        helperText={formik.touched.graphs && formik.errors.graphs}
                    >
                        <MenuItem key='empty' value="">&nbsp;</MenuItem>
                        <MenuItem key='yes' value={true}>
                            <FormattedMessage id="MASTER.YES" />
                        </MenuItem>
                        <MenuItem key='no' value={false}>
                            <FormattedMessage id="MASTER.NO" />
                        </MenuItem>
                    </Select>
                </FormControl>
            </Tooltip>
            <Tooltip 
                title={<FormattedMessage id="CUSTOM_MARKET_DETAIL.TOOLTIP.RESUME" />}
                placement="left" 
                arrow
                enterDelay={700}
                enterNextDelay={700}
                >
                <FormControl className={`d-block mb-8 mt-4`}>
                    <label className={`pf-10 mb-0`}>
                        <FormattedMessage id="CUSTOM_MARKET_DETAIL.RESUME" />
                    </label>
                    <Select
                        className={`mt-0`}
                        fullWidth
                        id="resume"
                        name="resume"
                        label="resume"
                        value={formik.values.resume}
                        onChange={formik.handleChange}
                        error={formik.touched.resume && Boolean(formik.errors.resume)}
                        helperText={formik.touched.resume && formik.errors.resume}
                    >
                        <MenuItem key='empty' value="">&nbsp;</MenuItem>
                        <MenuItem key='yes' value={true}>
                            <FormattedMessage id="MASTER.YES" />
                        </MenuItem>
                        <MenuItem key='no' value={false}>
                            <FormattedMessage id="MASTER.NO" />
                        </MenuItem>
                    </Select>
                </FormControl>
            </Tooltip>
            <Tooltip 
                title={<FormattedMessage id="CUSTOM_MARKET_DETAIL.TOOLTIP.PATTERN" />}
                placement="left" 
                arrow
                enterDelay={700}
                enterNextDelay={700}
                >
                <TextField
                    className={`mb-4`}
                    fullWidth
                    id="pattern"
                    name="pattern"
                    label={<FormattedMessage id="CUSTOM_MARKET_DETAIL.PATTERN" />}
                    value={formik.values.pattern}
                    autoComplete="off"
                    onChange={formik.handleChange}
                    error={formik.touched.pattern && Boolean(formik.errors.pattern)}
                    helperText={formik.touched.modifier && formik.errors.pattern}
                />
            </Tooltip>
            <Tooltip 
                title={<FormattedMessage id="CUSTOM_MARKET_DETAIL.TOOLTIP.PRODUCT_TYPE" />}
                placement="left" 
                arrow
                enterDelay={700}
                enterNextDelay={700}
                >
                <FormControl className={`d-block mb-8 mt-4`}>
                    <label className={`pf-10 mb-0`}>
                        <FormattedMessage id="CUSTOM_MARKET_DETAIL.PRODUCT_TYPE" />
                    </label>
                    <Select
                        className={`mt-0`}
                        fullWidth
                        id="productTypeCode"
                        name="productTypeCode"
                        label="productTypeCode"
                        value={formik.values.productTypeCode}
                        onChange={formik.handleChange}
                        error={formik.touched.productTypeCode && Boolean(formik.errors.productTypeCode)}
                        helperText={formik.touched.productTypeCode && formik.errors.productTypeCode}
                    >
                        <MenuItem key='-1' value={""}>&nbsp;</MenuItem>
                        {productTypes && (productTypes.map((pt, index) => {
                                return <MenuItem key={pt.code} value={pt.code}>{pt.description.toUpperCase()}</MenuItem>
                            }))
                        }
                    </Select>
                </FormControl>
            </Tooltip>
            {ownProduct == true  &&
            <Tooltip 
            title={<FormattedMessage id="CUSTOM_MARKET_DETAIL.TOOLTIP.OWN_PRODUCT" />}
            placement="left" 
            arrow
            enterDelay={700}
            enterNextDelay={700}
            >            
                <FormControl className={`d-block mb-8 mt-4`}>
                    <label className={`pf-10 mb-0`}>
                        <FormattedMessage id="CUSTOM_MARKET_DETAIL.OWN_PRODUCT" />
                    </label>
                    <Select
                        className={`mt-0`}
                        fullWidth
                        id="ownProduct"
                        name="ownProduct"
                        label="ownProduct"
                        value={formik.values.ownProduct}
                        onChange={formik.handleChange}
                        error={formik.touched.ownProduct && Boolean(formik.errors.ownProduct)}
                        helperText={formik.touched.ownProduct && formik.errors.ownProduct}
                    >
                        <MenuItem key='empty' value="">&nbsp;</MenuItem>
                        <MenuItem key='yes' value={true}>
                            <FormattedMessage id="MASTER.YES" />
                        </MenuItem>
                        <MenuItem key='no' value={false}>
                            <FormattedMessage id="MASTER.NO" />
                        </MenuItem>
                    </Select>
                </FormControl>
            </Tooltip>
            }                                                      
            </form>
            {/*end::Form*/}                                                                    
        </DialogContent>
        <DialogActions>
            {formik.errors.api &&
                <div className="MuiFormLabel-root Mui-error text-left pl-5" style={{width: '100%'}}>{formik.errors.api}</div>
            }            
            <Button onClick={handleCancel} color="primary" disabled={formik.isSubmitting}>
                <FormattedMessage id="FORM.ACTION.CANCEL" />
            </Button>
            <Button onClick={formik.handleSubmit} color="primary" disabled={formik.isSubmitting}>
            {loading && <span className="ml-3 spinner spinner-green"></span>}
            <span style={{paddingLeft:'25px'}}>
                <FormattedMessage id="FORM.ACTION.SAVE" />
            </span>
            </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const mapStateToProps = (state) => {
    return {
        customMarket: state.mercados.customMarket,
        productTypes: state.mercados.producttypes
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(CustomMarketDetailEditDialog);
