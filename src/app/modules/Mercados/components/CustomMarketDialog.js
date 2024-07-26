import React, { useState } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from './../_redux/mercadosActions';
import { FormattedMessage } from "react-intl";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import { useFormik } from 'formik';
import * as Yup from "yup";
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import SelectVirtualize from '../../../components/SelectVirtualize'
import Tooltip from '@material-ui/core/Tooltip';


const CustomMarketDialog = (props) => {
  const {customMarket, lineSelected, isActionClone, allCustomMarket, lines, open, handleClose} = props;
  const [loading, setLoading] = useState(false);    
  const emptyInitialValues = {
    description: '',
    footer: '',
    header: '',
    lineCode: '',
    order: '',
    marketFilter: 0,        
    drugReport: false,
    labReport: false,
    controlPanel: false,
    productReport: true,
    tcReport: false,
    testMarket: false,
    travelCrm: false,
    marketClass: 0,  
    marketReference: 0    
  }
  const [initialValues, setInitialValues] = useState(emptyInitialValues); 

  const getInitialValues = () => {
    if (props.customMarket != null) {
      setInitialValues({
        description: (isActionClone == true) ? '' : props.customMarket.data.description,
        footer: props.customMarket.data.footer,
        header: props.customMarket.data.header,
        lineCode: props.customMarket.data.lineCode,
        order: props.customMarket.data.order,
        marketFilter: props.customMarket.data.marketFilter,        
        drugReport: props.customMarket.data.drugReport,
        labReport: props.customMarket.data.labReport,
        controlPanel: props.customMarket.data.controlPanel,
        productReport: props.customMarket.data.productReport,
        tcReport: props.customMarket.data.tcReport,
        testMarket: props.customMarket.data.testMarket ,
        travelCrm: props.customMarket.data.travelCrm,
        marketClass: props.customMarket.data.marketClass,  
        marketReference: props.customMarket.data.marketReference       
      })
    } else if (props.lineSelected != null) {
        let lineObj = getLine(props.lineSelected)
        setInitialValues({
            description: '',
            footer: '',
            header: '',
            lineCode: lineObj.code,
            order: '',
            marketFilter: 0,        
            drugReport: false,
            labReport: false,
            controlPanel: false,
            productReport: true,
            tcReport: false,
            testMarket: lineObj.code == null,
            travelCrm: false,
            marketClass: 0,  
            marketReference: 0
        })        
    } else {
        setInitialValues(emptyInitialValues)
    }
  }

  const getLine = (lineSelected) => {
    let lineArr = lines.data.filter(x => x.code == lineSelected.key)
    if (lineArr.length > 0) {
        return lineArr[0]
    } else {
        return { code: null }
    }
  }

  const handleCancel = () => {
      handleClose()
      formik.resetForm()
  }

  React.useEffect(() => { 
    getInitialValues()
  }, [customMarket, lineSelected, isActionClone])

    const validate = values => {
        const errors = {};
        if (values.description == '') {
            errors.description = <FormattedMessage id="FORM.ERROR.REQUIRED_FIELD" />
        }    
        if (values.order == '') {
            errors.order = <FormattedMessage id="FORM.ERROR.REQUIRED_FIELD" />
        }

        if ((values.testMarket == '' || values.testMarket == false) && (values.lineCode == '' || values.lineCode == null)) {
            errors.lineCode = <FormattedMessage id="FORM.ERROR.REQUIRED_FIELD" />
        }

        return errors;
    };

    const Schema = Yup.object().shape({
        order: Yup.number()     
        .test(
            'is-decimal',   
            'Formato invalido',
            value => value == undefined || (value + "").match(/^[0-9]+$/) ,
        )
      });  

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: initialValues,
        validationSchema: Schema,
        validate: validate,
        onSubmit: (values, { setSubmitting, setErrors }) => {
            enableLoading();
            setTimeout(async () => {
                try {
                    let customMarketModified = prepareSave(values)
                    if (props.customMarket != null) {
                        if (isActionClone == true){
                            await props.cloneCustomMarket(customMarketModified)
                        }  else {
                            await props.updateCustomMarket(customMarketModified)
                        }
                    } else if (props.lineSelected != null) {
                        let customMarketCreated = await props.createCustomMarket(customMarketModified)
                        props.setCustomMarketPageView('manage')
                        props.setMarketTreeVisible(false);
                        await Promise.all([props.getCustomMarketByCode(customMarketCreated.data.code), props.getCustomMarketGroupByCustomMarketCode(customMarketCreated.data.code)])
                    }
                    disableLoading();
                    handleClose()
                    await Promise.all([props.getCustomMarketTree(), props.getCustomMarkets()])
                } catch(err) {
                    setErrors( {api: <FormattedMessage id="FORM.ERROR.API_EXCEPTION" />} )
                    disableLoading();
                } finally {
                    setSubmitting(false);
                    formik.resetForm()
                }
            }, 500)
        }
    }
  );


  const prepareSave = ({description, footer, header, lineCode, order, marketFilter, drugReport, labReport, controlPanel, productReport, tcReport, testMarket, travelCrm, marketClass, marketReference}) => {
    let copyCustomMarket = {}                    
    if (customMarket && customMarket.data) {
        copyCustomMarket = JSON.parse(JSON.stringify(customMarket.data))
    }

    if (description !== null) {
        copyCustomMarket.description = description
    }
    if (footer !== null) {
        copyCustomMarket.footer = footer
    }
    if (header !== null) {
        copyCustomMarket.header = header
    }
    if (lineCode !== null) {
        copyCustomMarket.lineCode = parseInt(lineCode)
    }
    if (order !== null) {
        copyCustomMarket.order = parseInt(order)
    } 
    if (marketFilter !== null) {
        copyCustomMarket.marketFilter = parseInt(marketFilter)
    }
    if (drugReport !== null) {
        copyCustomMarket.drugReport = drugReport
    }
    if (labReport !== null) {
        copyCustomMarket.labReport = labReport
    }
    if (controlPanel !== null) {
        copyCustomMarket.controlPanel = controlPanel
    }
    if (productReport !== null) {
        copyCustomMarket.productReport = productReport
    }
    if (tcReport !== null) {
        copyCustomMarket.tcReport = tcReport
    }
    if (testMarket !== null) {
        copyCustomMarket.testMarket = testMarket
        if (testMarket == true) {  
            copyCustomMarket.lineCode = null
        }
    } 

    if(travelCrm !== null){
        copyCustomMarket.travelCrm = travelCrm;
    }

    if (marketClass !== null) {
        copyCustomMarket.marketClass = parseInt(marketClass)
        copyCustomMarket.marketReference = parseInt(marketClass) == 3 ? parseInt(marketReference) : null
    }    

    return copyCustomMarket
  }

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };  

  const handleChangeLine = (value) => {
    handleChange('lineCode', value)
  }

  const handleChangeMarketClass = (value) => {
    handleChange('marketClass', value.target.value)
    if(value.target.value != 3) {
        handleChangeMarketReference(null)
    }
  }

  const handleChangeMarketReference = (value) => {
    handleChange('marketReference', value)
  }

  const handleChange = (field, value) => {
    formik.setFieldValue(field, value);
  }

  return (
    <Dialog 
        maxWidth="sm"
        fullWidth={true}
        open={open} 
        onClose={handleCancel} 
        aria-labelledby="form-dialog-title"
    >
    <DialogContent>
      <DialogContentText> 
          {(customMarket && customMarket.data) ? ((isActionClone == true) ? <FormattedMessage id="CUSTOM_MARKET_DIALOG.TITLE.CLONE_CUSTOM_MARKET" /> : customMarket.data.fullDescription) : <FormattedMessage id="CUSTOM_MARKET_DIALOG.TITLE.CREATE_CUSTOM_MARKET" />}
        </DialogContentText>
        <form onSubmit={formik.handleSubmit}>
            <Tooltip 
                title={<FormattedMessage id="CUSTOM_MARKET_DIALOG.TOOLTIP.DESCRIPTION" />}
                placement="left" 
                arrow
                enterDelay={700}
                enterNextDelay={700}
                > 
                <TextField
                    className={`mb-4`}
                    fullWidth
                    id="description"
                    name="description"
                    label={<FormattedMessage id="CUSTOM_MARKET_DIALOG.DESCRIPTION" />}
                    helperText={"errorMessage"}
                    value={formik.values.description}
                    autoComplete="off"
                    onChange={formik.handleChange}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                />
            </Tooltip>
            <Tooltip 
                title={<FormattedMessage id="CUSTOM_MARKET_DIALOG.TOOLTIP.HEADER" />}
                placement="left" 
                arrow
                enterDelay={700}
                enterNextDelay={700}
                >
                <TextField
                    className={`mb-4`}
                    fullWidth
                    id="header"
                    name="header"
                    label={<FormattedMessage id="CUSTOM_MARKET_DIALOG.HEADER" />}
                    value={formik.values.header}
                    autoComplete="off"
                    onChange={formik.handleChange}
                    error={formik.touched.header && Boolean(formik.errors.header)}
                    helperText={formik.touched.header && formik.errors.header}
                />
            </Tooltip>
            <Tooltip 
                title={<FormattedMessage id="CUSTOM_MARKET_DIALOG.TOOLTIP.FOOTER" />}
                placement="left" 
                arrow
                enterDelay={700}
                enterNextDelay={700}
                >
                <TextField
                    className={`mb-4`}
                    fullWidth
                    id="footer"
                    name="footer"
                    label={<FormattedMessage id="CUSTOM_MARKET_DIALOG.FOOTER" />}
                    value={formik.values.footer}
                    autoComplete="off"
                    onChange={formik.handleChange}
                    error={formik.touched.footer && Boolean(formik.errors.footer)}
                    helperText={formik.touched.footer && formik.errors.footer}
                />
            </Tooltip>                
            <Tooltip 
                title={<FormattedMessage id="CUSTOM_MARKET_DIALOG.TOOLTIP.LINE" />}
                placement="left" 
                arrow
                enterDelay={700}
                enterNextDelay={700}
                >            
                <FormControl className={`d-block mb-4 mt-2`}>
                        <label className={(formik.touched.lineCode && Boolean(formik.errors.lineCode)) ? 'pf-10 MuiFormLabel-root Mui-error' : 'pf-10' }>
                            <FormattedMessage id="CUSTOM_MARKET_DIALOG.LINE" />
                        </label>
                    <SelectVirtualize id="lineCode" options={!lines.isLoading && lines.data} optionLabel="fullDescription" value={formik.values.lineCode} onChange={handleChangeLine}/>                        
                    {formik.touched.lineCode && Boolean(formik.errors.lineCode) &&
                        <p className="MuiFormHelperText-root Mui-error" style={{color: '#f018a6', fontSize: '0.75rem'}}>{formik.touched.lineCode && formik.errors.lineCode}</p>
                    }
                </FormControl>
            </Tooltip>
            <Tooltip 
                title={<FormattedMessage id="CUSTOM_MARKET_DIALOG.TOOLTIP.ORDER" />}
                placement="left" 
                arrow
                enterDelay={700}
                enterNextDelay={700}
                >                   
                <TextField
                    className={`mb-4`}
                    fullWidth
                    id="order"
                    name="order"
                    label={<FormattedMessage id="CUSTOM_MARKET_DIALOG.ORDER" />}
                    type="number"
                    value={formik.values.order}
                    autoComplete="off"
                    onChange={formik.handleChange}
                    error={formik.touched.order && Boolean(formik.errors.order)}
                    helperText={formik.touched.order && formik.errors.order}
                />
            </Tooltip>
            <Tooltip 
                title={<FormattedMessage id="CUSTOM_MARKET_DIALOG.TOOLTIP.MARKET_FILTER" />}
                placement="left" 
                arrow
                enterDelay={700}
                enterNextDelay={700}
                >               
                <FormControl className={`d-block mb-4 mt-2`}>
                    <label className={`pf-10`}>
                        <FormattedMessage id="CUSTOM_MARKET_DIALOG.MARKET_FILTER" />
                    </label>
                    <Select
                        className={`mt-0`}
                        fullWidth
                        id="marketFilter"
                        name="marketFilter"
                        label="marketFilter"
                        value={formik.values.marketFilter}
                        onChange={formik.handleChange}
                        error={formik.touched.marketFilter && Boolean(formik.errors.marketFilter)}
                    >
                        <MenuItem key='TOTAL' value={0}>
                            <FormattedMessage id="MASTER.CLASS.TOTAL" />
                        </MenuItem>
                        <MenuItem key='ETICO' value={1}>
                            <FormattedMessage id="MASTER.CLASS.ETICO" />
                        </MenuItem>
                        <MenuItem key='POPULAR' value={2}>
                            <FormattedMessage id="MASTER.CLASS.POPULAR" />
                        </MenuItem>
                    </Select>
                </FormControl> 
            </Tooltip>
            <Tooltip 
                title={<FormattedMessage id="CUSTOM_MARKET_DIALOG.TOOLTIP.MARKET_CLASS" />}
                placement="left" 
                arrow
                enterDelay={700}
                enterNextDelay={700}
                >               
                <FormControl className={`d-block mb-4 mt-2`}>
                    <label className={`pf-10`}>
                        <FormattedMessage id="CUSTOM_MARKET_DIALOG.MARKET_CLASS" />
                    </label>
                    <Select
                        className={`mt-0`}
                        fullWidth
                        id="marketClass"
                        name="marketClass"
                        label="marketClass"
                        value={formik.values.marketClass}
                        onChange={handleChangeMarketClass}
                        error={formik.touched.marketClass && Boolean(formik.errors.marketClass)}
                    >
                        <MenuItem key='TOTAL' value={0}>
                            <FormattedMessage id="MASTER.CLASS.TOTAL" />
                        </MenuItem>
                        <MenuItem key='ETICO' value={1}>
                            <FormattedMessage id="MASTER.CLASS.ETICO" />
                        </MenuItem>
                        <MenuItem key='POPULAR' value={2}>
                            <FormattedMessage id="MASTER.CLASS.POPULAR" />
                        </MenuItem>
                        <MenuItem key='OTHER' value={3}>
                            <FormattedMessage id="MASTER.CLASS.OTHER" />
                        </MenuItem>                    
                    </Select>
                </FormControl>
            </Tooltip>
            <Tooltip 
                title={<FormattedMessage id="CUSTOM_MARKET_DIALOG.TOOLTIP.MARKET_REFERENCE" />}
                placement="left" 
                arrow
                enterDelay={700}
                enterNextDelay={700}
                >                      
                <FormControl className={`d-block mb-4 mt-2`}>
                    <label className="pf-10" style={{color: formik.values.marketClass != 3 ? 'silver': ''}}>
                        <FormattedMessage id="CUSTOM_MARKET_DIALOG.MARKET_REFERENCE" />
                    </label>
                    <SelectVirtualize 
                        id="marketReference" 
                        options={!allCustomMarket.isLoading && allCustomMarket.data} 
                        optionLabel="description" value={formik.values.marketReference} 
                        onChange={handleChangeMarketReference} 
                        disabled={formik.values.marketClass != 3}
                    />                        
                </FormControl>                             
            </Tooltip>
            <Tooltip 
                title={<FormattedMessage id="CUSTOM_MARKET_DIALOG.TOOLTIP.DRUG_REPORT" />}
                placement="left" 
                arrow
                enterDelay={700}
                enterNextDelay={700}
                >                      
                <FormControl className={`d-block mb-4`}>
                    <Checkbox
                        className={`pl-0`}            
                        id="drugReport"
                        name="drugReport"
                        label="drugReport"
                        checked={formik.values.drugReport}
                        onChange={formik.handleChange}
                    />
                    <label className={`pf-10`}>
                        <FormattedMessage id="CUSTOM_MARKET_DIALOG.DRUG_REPORT" />
                    </label>
                </FormControl>
            </Tooltip>
            <Tooltip 
                title={<FormattedMessage id="CUSTOM_MARKET_DIALOG.TOOLTIP.LAB_REPORT" />}
                placement="left" 
                arrow
                enterDelay={700}
                enterNextDelay={700}
                >          
                <FormControl className={`d-block mb-4`}>
                    <Checkbox
                        className={`pl-0`}            
                        id="labReport"
                        name="labReport"
                        label="labReport"
                        checked={formik.values.labReport}
                        onChange={formik.handleChange}
                    />
                    <label className={`pf-10`}>
                        <FormattedMessage id="CUSTOM_MARKET_DIALOG.LAB_REPORT" />
                    </label>
                </FormControl>
            </Tooltip>
            <Tooltip 
                title={<FormattedMessage id="CUSTOM_MARKET_DIALOG.TOOLTIP.CONTROL_PANEL" />}
                placement="left" 
                arrow
                enterDelay={700}
                enterNextDelay={700}
                >                       
                <FormControl className={`d-block mb-4`}>
                    <Checkbox
                        className={`pl-0`}            
                        id="controlPanel"
                        name="controlPanel"
                        label="controlPanel"
                        checked={formik.values.controlPanel}
                        onChange={formik.handleChange}
                    />
                    <label className={`pf-10`}>
                        <FormattedMessage id="CUSTOM_MARKET_DIALOG.CONTROL_PANEL" />
                    </label>
                </FormControl>
            </Tooltip>
            <Tooltip 
                title={<FormattedMessage id="CUSTOM_MARKET_DIALOG.TOOLTIP.PRODUCT_REPORT" />}
                placement="left" 
                arrow
                enterDelay={700}
                enterNextDelay={700}
                >                      
                <FormControl className={`d-block mb-4`}>
                    <Checkbox
                        className={`pl-0`}            
                        id="productReport"
                        name="productReport"
                        label="productReport"
                        checked={formik.values.productReport}
                        onChange={formik.handleChange}
                    />
                    <label className={`pf-10`}>
                        <FormattedMessage id="CUSTOM_MARKET_DIALOG.PRODUCT_REPORT" />
                    </label>
                </FormControl> 
            </Tooltip>
            <Tooltip 
                title={<FormattedMessage id="CUSTOM_MARKET_DIALOG.TOOLTIP.TC_REPORT" />}
                placement="left" 
                arrow
                enterDelay={700}
                enterNextDelay={700}
                >          
                <FormControl className={`d-block mb-4`}>
                    <Checkbox
                        className={`pl-0`}
                        id="tcReport"
                        name="tcReport"
                        label="tcReport"
                        checked={formik.values.tcReport}
                        onChange={formik.handleChange}
                    />
                    <label className={`pf-10`}>
                        <FormattedMessage id="CUSTOM_MARKET_DIALOG.TC_REPORT" />
                    </label>
                </FormControl>   
            </Tooltip>
            <Tooltip 
                title={<FormattedMessage id="CUSTOM_MARKET_DIALOG.TOOLTIP.TEST_MARKET" />}
                placement="left" 
                arrow
                enterDelay={700}
                enterNextDelay={700}
                >                                                                                  
                <FormControl className={`d-block mb-4`}>
                    <Checkbox
                        className={`pl-0`}
                        id="testMarket"
                        name="testMarket"
                        label="testMarket"
                        checked={formik.values.testMarket}
                        onChange={(e) => { 
                            formik.handleChange(e)
                            if (!formik.values.testMarket) {
                                handleChangeLine(null)
                            }
                        }}
                    />
                    <label className={`pf-10`}>
                        <FormattedMessage id="CUSTOM_MARKET_DIALOG.TEST_MARKET" />
                    </label>
                </FormControl> 
            </Tooltip> 
            <Tooltip 
                title={<FormattedMessage id="CUSTOM_MARKET_DIALOG.TOOLTIP.TRAVEL_CRM" />}
                placement="left" 
                arrow
                enterDelay={700}
                enterNextDelay={700}
                >                                                                                  
                <FormControl className={`d-block mb-4`}>
                    <Checkbox
                        className={`pl-0`}
                        id="travelCrm"
                        name="travelCrm"
                        label="travelCrm"
                        checked={formik.values.travelCrm}
                        onChange={(e) => { 
                            formik.handleChange(e)
                            // if (!formik.values.travelCrm) {
                            //     handleChangeLine(null)
                            // }
                        }}
                    />
                    <label className={`pf-10`}>
                        <FormattedMessage id="CUSTOM_MARKET_DIALOG.TRAVEL_CRM" />
                    </label>
                </FormControl> 
            </Tooltip> 
        </form>
      </DialogContent>
        <DialogActions>
            {formik.errors.api &&
                <div className="MuiFormLabel-root Mui-error text-left pl-5" style={{width: '100%'}}>{formik.errors.api}</div>
            }
            <Button 
            onClick={handleCancel} 
            color="primary" 
            disabled={formik.isSubmitting}>
                <FormattedMessage id="FORM.ACTION.CANCEL" />
            </Button>
            <Button 
            onClick={formik.handleSubmit} 
            color="primary" 
            disabled={formik.isSubmitting}>
            {loading && <span className="ml-3 spinner spinner-green"></span>}
            <span style={{paddingLeft:'25px'}}>
                <FormattedMessage id="FORM.ACTION.SAVE" />
            </span>
            </Button>
        </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = (state) => {
    return {
        allCustomMarket: state.mercados.allCustomMarket,
        lines: state.mercados.lines
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(CustomMarketDialog);