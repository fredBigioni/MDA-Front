import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from '../../_redux/mercadosActions';
import { useFormik } from 'formik'
import * as Yup from "yup";
import { TextField } from '@material-ui/core'
import { injectIntl, FormattedMessage } from "react-intl";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { useStyles } from '../../../../Style/GeneralStyles';
import Tooltip from '@material-ui/core/Tooltip';


const CustomMarketPreviewForm = (props) => {

    const { action, formHasBeenSubmited, onChangeStatusForm, intl, productTypes } = props;
    const [loading, setLoading] = React.useState(false);
    const classes = useStyles();

    const detectFormSubmited = () => {
        if(formHasBeenSubmited) {
            onChangeStatusForm();
            if(action.type == 'delete') {
                props.onDelete(action.item)
            }else{
                formik.handleSubmit();
            }
        }
    }
    const enableLoading = () => {
        setLoading(true);
    };

    const disableLoading = () => {
        setLoading(false);
    };

    const initialValues = {
        intemodifier: action.type == 'edit' ? action.item.intemodifier :  '',
        modifier: action.type == 'edit' ? action.item.modifier : '',
        ensureVisible: action.type == 'edit' ? Boolean(action.item.ensureVisible) : '',
        expand: action.type == 'edit' ? Boolean(action.item.expand) : '',
        graph: action.type == 'edit' ? Boolean(action.item.graph) : '',
        resume: action.type == 'edit' ? Boolean(action.item.resume) : '',
        id: action.type == 'edit' ? action.item.id : '',
        productPresentationCode: action.type == 'edit' ? action.item.productPresentationCode : '',
        pattern: action.type == 'edit' ? action.item.pattern : '',
        productTypeCode: action.type == 'edit' ? action.item.productTypeCode : ''

    };
    
    React.useEffect(() => {

        detectFormSubmited()

        return () => {}
        
    }, [formHasBeenSubmited])


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
            //props.onChangeLoadingForm(true)
            //setTimeout(async () => {
                //try {
                    props.onUpdate(values)
                    //props.onChangeLoadingForm(false)
                    handleClose()
                /*} catch(err) {
                    setErrors( {api: <FormattedMessage id="FORM.ERROR.API_EXCEPTION" />} )
                    props.onChangeLoadingForm(false)
                } finally {
                    setSubmitting(false);
                }*/
            //}, 1000);
        },
    });

    const handleClose = () => {
        props.onClose();
    }

    
    if(action.type == 'edit') {
        return (
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
                    label={intl.formatMessage({id: "CUSTOM_MARKET_DETAIL.INTEMODIFIER"})}
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
                    label={intl.formatMessage({id: "CUSTOM_MARKET_DETAIL.MODIFIER"})}
                    type="text"
                    value={formik.values.modifier}
                    autoComplete="off"
                    onChange={formik.handleChange}
                    error={formik.touched.modifier && Boolean(formik.errors.modifier)}
                    helperText={formik.touched.modifier && formik.errors.modifier}
                />
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
                        {intl.formatMessage({id:"CUSTOM_MARKET_DETAIL.ENSURE_VISIBLE"})}
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
                        <MenuItem key='yes' value={true} selected={formik.values.ensureVisible === true ? true : false}>
                        <FormattedMessage id="MASTER.YES" />
                        </MenuItem>
                        <MenuItem key='no' value={false} selected={formik.values.ensureVisible === false ? true : false}>
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
                        <MenuItem key='yes' value={true} selected={action.item.expand == true ? true : false}>
                            <FormattedMessage id="MASTER.YES" />
                        </MenuItem>
                        <MenuItem key='no' value={false} selected={action.item.expand == false ? true : false}>
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
                        name="graph"
                        label="graph"
                        value={formik.values.graph}
                        onChange={formik.handleChange}
                        error={formik.touched.graph && Boolean(formik.errors.graph)}
                        helperText={formik.touched.graph && formik.errors.graph}
                    >
                        <MenuItem key='yes' value={true} selected={formik.values.graph == true ? true : false}>
                            <FormattedMessage id="MASTER.YES" />
                        </MenuItem>
                        <MenuItem key='no' value={false} selected={formik.values.graph == false ? true : false}>
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
                        <MenuItem key='yes' value={true} selected={formik.values.resume == true ? true : false}>
                            <FormattedMessage id="MASTER.YES" />
                        </MenuItem>
                        <MenuItem key='no' value={false} selected={formik.values.resume == false ? true : false}>
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
                    label={intl.formatMessage({id: "CUSTOM_MARKET_DETAIL.PATTERN"})}
                    type="text"
                    value={formik.values.pattern}
                    autoComplete="off"
                    onChange={formik.handleChange}
                    error={formik.touched.pattern && Boolean(formik.errors.pattern)}
                    helperText={formik.touched.pattern && formik.errors.pattern}
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
        </form>
        )

    }
    return null

}

function getItemObject(item) {
    return JSON.parse(atob(item.value))
}

function mapStateToProps(state) {
    return { 
        mercados: state.mercados,
        productTypes: state.mercados.producttypes,
        productPresentation: state.mercados.productpresentations,
        
      }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

export default injectIntl(connect(mapStateToProps,mapDispatchToProps)(CustomMarketPreviewForm));