import React, { useState } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from '../_redux/mercadosActions';
import { FormattedMessage } from "react-intl";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import { useFormik } from 'formik';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const LineDialog = (props) => {
  const {open, handleClose, linegroups, lines, lineSelected, lineGroupSelected} = props;
  const [loading, setLoading] = useState(false);
  const emptyInitialValues = { description: '', lineGroupCode: '', laboratoryReportHeader: '', laboratoryReportFooter: '', drugReportHeader: '', drugReportFooter: '' }    
  const [initialValues, setInitialValues] = useState(emptyInitialValues); 

  const getInitialValues = (lineSelected, lineGroupSelected) => {
    if (lineSelected == null && lineGroupSelected == null) {
      setInitialValues(emptyInitialValues)
    } else if (lineSelected != null) {
       let lineObj = getLine(lineSelected)
      if (lineObj) {
        setInitialValues({ 
          description: lineObj.description,
          lineGroupCode: lineObj.lineGroup.code,
          laboratoryReportHeader: lineObj.laboratoryReportHeader,
          laboratoryReportFooter: lineObj.laboratoryReportFooter,
          drugReportHeader: lineObj.drugReportHeader,
          drugReportFooter: lineObj.drugReportFooter
        })
      } else {
        setInitialValues(emptyInitialValues)
      }
    } else if (lineGroupSelected != null) {
         setInitialValues({ 
           description: '',
           lineGroupCode: lineGroupSelected.key,
           laboratoryReportHeader: '',
           laboratoryReportFooter: '',
           drugReportHeader: '',
           drugReportFooter: ''
         })
    }
  }

 const getLine = (lineSelected) => {
   let linesFilter = lines.data.filter(x => x.code == lineSelected.key)
   if (linesFilter.length > 0) {
     return linesFilter[0]
   }
   return null
 }

 const getItemObject = (item) => {
    let itemObj = JSON.parse(atob(item.value))
    return itemObj
}

  React.useEffect(() => { 
    getInitialValues(lineSelected, lineGroupSelected)
  }, [lineSelected, lineGroupSelected])   

  const validate = values => {
    const errors = {};
    if (values.description == '') {
        errors.description = <FormattedMessage id="FORM.ERROR.REQUIRED_FIELD" />
    }    

    if (values.lineGroupCode == '' || values.lineGroupCode == undefined || values.lineGroupCode == null) {
      errors.lineGroupCode = <FormattedMessage id="FORM.ERROR.REQUIRED_FIELD" />
    }
        
    return errors;
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validate: validate,
    onSubmit: (values, { setSubmitting, setErrors }) => {
        enableLoading();
        setTimeout(async () => {
        try {  
          let line = {
            description: values.description, 
            lineGroupCode: values.lineGroupCode, 
            laboratoryReportHeader: values.laboratoryReportHeader, 
            laboratoryReportFooter: values.laboratoryReportFooter, 
            drugReportHeader: values.drugReportHeader, 
            drugReportFooter: values.drugReportFooter 
          }
          if (lineSelected == null) {
            await props.createLine(line)
          } else {
            await props.updateLine(lineSelected.key, line)
          }
          disableLoading();
          handleClose()
          await Promise.all([props.getCustomMarketTree(), props.getLines()])
        } catch(err) {
          setErrors( {api: <FormattedMessage id="FORM.ERROR.API_EXCEPTION" />} )
          disableLoading();
        } finally {
          setSubmitting(false);
        } 
      }, 500)
    }
  });

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };  

  return (
    <Dialog 
        maxWidth="sm"
        fullWidth={true}
        open={open} 
        onClose={handleClose} 
        aria-labelledby="form-dialog-title"
    >
    <DialogContent>
      <DialogContentText>
        <strong>
          {(lineSelected == null) ? <FormattedMessage id="LINE_DIALOG.TITLE.CREATE" /> : <FormattedMessage id="LINE_DIALOG.TITLE.EDIT" />}
        </strong>
      </DialogContentText>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          className={`mb-4`}
          fullWidth
          id="description"
          name="description"
          label={<FormattedMessage id="LINE_DIALOG.DESCRIPTION" />}
          value={formik.values.description}
          autoComplete="off"
          onChange={formik.handleChange}
          error={formik.touched.description && Boolean(formik.errors.description)}
          helperText={formik.touched.description && formik.errors.description}
        />
        <FormControl className={`d-block mb-4 mt-2`}>
          <label className={(formik.touched.lineGroupCode && Boolean(formik.errors.lineGroupCode)) ? 'pf-10 MuiFormLabel-root Mui-error' : 'pf-10' }>
            <FormattedMessage id="LINE_DIALOG.LINE_GROUP" />
          </label>
          <Select
              className={`mt-0`}
              fullWidth
              id="lineGroupCode"
              name="lineGroupCode"
              label="lineGroupCode"
              value={formik.values.lineGroupCode}
              onChange={formik.handleChange}
              error={formik.touched.lineGroupCode && Boolean(formik.errors.lineGroupCode)}
              helperText={formik.touched.lineGroupCode && formik.errors.lineGroupCode}
          >
            {linegroups && linegroups.map((lineGroup) => {
                let lineGroupObj = getItemObject(lineGroup)
                return (
                  <MenuItem key={lineGroupObj.code} value={lineGroupObj.code}>{lineGroupObj.description.toUpperCase()}</MenuItem>
                )
            })}
          </Select>
          {formik.touched.lineGroupCode && Boolean(formik.errors.lineGroupCode) &&
            <p className="MuiFormHelperText-root Mui-error">{formik.touched.lineGroupCode && formik.errors.lineGroupCode}</p>
          }              
        </FormControl>         
        <TextField
          className={`mb-4`}
          fullWidth
          id="laboratoryReportHeader"
          name="laboratoryReportHeader"
          label={<FormattedMessage id="LINE_DIALOG.LABORATORY_REPORT_HEADER" />}
          value={formik.values.laboratoryReportHeader}
          autoComplete="off"
          onChange={formik.handleChange}
          error={formik.touched.laboratoryReportHeader && Boolean(formik.errors.laboratoryReportHeader)}
          helperText={formik.touched.laboratoryReportHeader && formik.errors.laboratoryReportHeader}
        />
        <TextField
          className={`mb-4`}
          fullWidth
          id="laboratoryReportFooter"
          name="laboratoryReportFooter"
          label={<FormattedMessage id="LINE_DIALOG.LABORATORY_REPORT_FOOTER" />}
          value={formik.values.laboratoryReportFooter}
          autoComplete="off"
          onChange={formik.handleChange}
          error={formik.touched.laboratoryReportFooter && Boolean(formik.errors.laboratoryReportFooter)}
          helperText={formik.touched.laboratoryReportFooter && formik.errors.laboratoryReportFooter}
        />
        <TextField
          className={`mb-4`}
          fullWidth
          id="drugReportHeader"
          name="drugReportHeader"
          label={<FormattedMessage id="LINE_DIALOG.DRUG_REPORT_HEADER" />}
          value={formik.values.drugReportHeader}
          autoComplete="off"
          onChange={formik.handleChange}
          error={formik.touched.drugReportHeader && Boolean(formik.errors.drugReportHeader)}
          helperText={formik.touched.drugReportHeader && formik.errors.drugReportHeader}
        />
        <TextField
          className={`mb-4`}
          fullWidth
          id="drugReportFooter"
          name="drugReportFooter"
          label={<FormattedMessage id="LINE_DIALOG.DRUG_REPORT_FOOTER" />}
          value={formik.values.drugReportFooter}
          autoComplete="off"
          onChange={formik.handleChange}
          error={formik.touched.drugReportFooter && Boolean(formik.errors.drugReportFooter)}
          helperText={formik.touched.drugReportFooter && formik.errors.drugReportFooter}
        />                
      </form>
      </DialogContent>
        <DialogActions>
          {formik.errors.api &&
            <div className="MuiFormLabel-root Mui-error text-left pl-5" style={{width: '100%'}}>{formik.errors.api}</div>
          }          
          <Button 
            onClick={handleClose} 
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
        linegroups: state.mercados.linegroups,
        lines: state.mercados.lines
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(LineDialog);