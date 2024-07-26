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
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

const CustomMarketGroupDialog = (props) => {
  const {customMarket, customMarketGroupSelected, open, handleClose} = props;
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({ description: '',groupCondition: '' });  

  const getInitialValues = (customMarketGroupSelected) => {
      if (customMarketGroupSelected == null) {
        setInitialValues( {
              description: '',
              groupCondition: ''
          })
      } else {
          setInitialValues( {
            description: customMarketGroupSelected.description,
            groupCondition: customMarketGroupSelected.groupCondition        
          })
      }
  }

  const handleCancel = () => {
    handleClose()
    formik.resetForm()
  }  

  React.useEffect(() => { 
    getInitialValues(customMarketGroupSelected)
  }, [customMarket, customMarketGroupSelected])   

  const validate = values => {
    const errors = {};
    if (values.description == '') {
        errors.description = <FormattedMessage id="FORM.ERROR.REQUIRED_FIELD" />
    }    

    if (values.groupCondition == '' || values.groupCondition == null) {
      errors.groupCondition = <FormattedMessage id="FORM.ERROR.REQUIRED_FIELD" />
    }
        
    return errors;
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues:  initialValues,
    validate: validate,
    onSubmit: (values, { setSubmitting, setErrors }) => {
        enableLoading();
        setTimeout(async () => {
            try {
                let customMarketGroup = {
                    customMarketCode: customMarket.data.code, 
                    description: values.description, 
                    groupCondition: values.groupCondition
                }                    
                if (customMarketGroupSelected == null) {
                    await props.createCustomMarketGroup(customMarketGroup)
                } else {
                    await props.updateCustomMarketGroup(customMarketGroupSelected.code, customMarketGroup)
                }
                await props.getCustomMarketGroupByCustomMarketCode(customMarket.data.code)
                disableLoading();
                handleClose()
              } catch(err) {
                setErrors( {api: <FormattedMessage id="FORM.ERROR.API_EXCEPTION" />} )
                disableLoading();
            } finally {
                setSubmitting(false);
                formik.resetForm()
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
        onClose={handleCancel} 
        aria-labelledby="form-dialog-title"
    >
    <DialogContent>
      <DialogContentText className="text-uppercase">
        { !customMarketGroupSelected ? 
          <FormattedMessage id="CUSTOM_MARKET_GROUP_DIALOG.TITLE.CREATE" />
         : 
         <FormattedMessage id="CUSTOM_MARKET_GROUP_DIALOG.TITLE.EDIT" />
        }
      </DialogContentText>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          className={`mb-4`}
          fullWidth
          id="description"
          name="description"
          label={<FormattedMessage id="CUSTOM_MARKET_GROUP_DIALOG.DESCRIPTION" />}
          value={formik.values.description}
          autoComplete="off"
          onChange={formik.handleChange}
          error={formik.touched.description && Boolean(formik.errors.description)}
          helperText={formik.touched.description && formik.errors.description}
        />
        <FormControl className={`d-block mb-4 mt-2`}>
            <label className={(formik.touched.groupCondition && Boolean(formik.errors.groupCondition)) ? 'pf-10 MuiFormLabel-root Mui-error' : 'pf-10' }>
              <FormattedMessage id="CUSTOM_MARKET_GROUP_DIALOG.GROUP_CONDITION" />
            </label>
            <Select
                className={`mt-0`}
                fullWidth
                id="groupCondition"
                name="groupCondition"
                label="groupCondition"
                value={formik.values.groupCondition}
                onChange={formik.handleChange}
                error={formik.touched.groupCondition && Boolean(formik.errors.groupCondition)}
                helperText={formik.touched.groupCondition && formik.errors.groupCondition}
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
            {formik.touched.groupCondition && Boolean(formik.errors.groupCondition) &&
              <p className="MuiFormHelperText-root Mui-error">{formik.touched.groupCondition && formik.errors.groupCondition}</p>
            }                    
        </FormControl> 
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
        customMarket: state.mercados.customMarket
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(CustomMarketGroupDialog);