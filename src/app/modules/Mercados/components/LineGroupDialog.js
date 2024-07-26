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

const LineGroupDialog = (props) => {
  const {open, handleClose, lineGroupSelected} = props;
  const [loading, setLoading] = useState(false);    
  const [initialValues, setInitialValues] = useState({ description: '' }); 

  const getInitialValues = (lineGroupSelected) => {
    if (lineGroupSelected == null) {
      setInitialValues({ description: '' })
    } else {
      setInitialValues({ description: lineGroupSelected.name })
    }
  }

  React.useEffect(() => { 
    getInitialValues(lineGroupSelected)
  }, [lineGroupSelected])   

  const validate = values => {
    const errors = {};
    if (values.description == '') {
        errors.description = <FormattedMessage id="FORM.ERROR.REQUIRED_FIELD" />
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
          let lineGroup = {
            description: values.description
          }
          if (lineGroupSelected == null) {
            await props.createLineGroup(lineGroup)
          } else {
            await props.updateLineGroup(lineGroupSelected.key, lineGroup)
          }
          disableLoading();
          handleClose()
          await Promise.all([props.getCustomMarketTree(), props.getLineGroups()])
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
          {(lineGroupSelected == null) ? <FormattedMessage id="LINE_GROUP_DIALOG.TITLE.CREATE" /> : <FormattedMessage id="LINE_GROUP_DIALOG.TITLE.EDIT" />}
        </strong>
      </DialogContentText>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          className={`mb-4`}
          fullWidth
          id="description"
          name="description"
          label={<FormattedMessage id="LINE_GROUP_DIALOG.DESCRIPTION" />}
          value={formik.values.description}
          autoComplete="off"
          onChange={formik.handleChange}
          error={formik.touched.description && Boolean(formik.errors.description)}
          helperText={formik.touched.description && formik.errors.description}
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
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(LineGroupDialog);