import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from '../_redux/Actions';
import { FormattedMessage } from "react-intl";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import { useFormik } from 'formik';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

const ActionDialog = (props) => {
    const { action: { actionType, dialogVisible, item, therapeuticalClass, businessUnits } } = props;
    const [loading, setLoading] = React.useState(false);

    const enableLoading = () => {
        setLoading(true);
    };
    
    const disableLoading = () => {
        setLoading(false);
    };  

    const validate = values => {
        const errors = {};
        if (values.therapeuticalClassCode == '') {
          errors.therapeuticalClassCode = <FormattedMessage id="FORM.ERROR.REQUIRED_FIELD" />
        }
        
        if (values.businessUnitCode == '') {
            errors.businessUnitCode = <FormattedMessage id="FORM.ERROR.REQUIRED_FIELD" />
        }          
        
        if (values.classCode === '') {
            errors.classCode = <FormattedMessage id="FORM.ERROR.REQUIRED_FIELD" />
        }

        return errors;
    };
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
          therapeuticalClassCode: actionType == 'edit' ? item.therapeuticalClassCode : '',
          businessUnitCode: actionType == 'edit' ? item.businessUnitCode : null,
          classCode: actionType == 'edit' ? item.classCode : null
        },
        validate: validate,
        onSubmit: (values, { setSubmitting, setErrors }) => {
            enableLoading();
            setTimeout(async () => {
                try {
                    await props.updateProductPresentation(item.code, JSON.stringify({therapeuticalClassCode: values.therapeuticalClassCode, businessUnitCode: values.businessUnitCode == undefined ? null: values.businessUnitCode, classCode: values.classCode == undefined ? null : values.classCode}))
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


    return (
        <Dialog 
        maxWidth="sm"
        fullWidth={true}
        open={dialogVisible} 
        onClose={handleClose} 
        aria-labelledby="form-dialog-title"
    >
    <DialogContent>
      <DialogContentText> {actionType == 'edit' ? `Editar ${item.description}` : 'Nueva Unidad de Negocio' } </DialogContentText>
      <form onSubmit={formik.handleSubmit}>
        <FormControl className={`d-block mb-3 mt-2`}>
            <label 
                className={(formik.touched.therapeuticalClassCode && Boolean(formik.errors.therapeuticalClassCode)) ? 'pf-10 MuiFormLabel-root Mui-error' : 'pf-10' }
                style={{ color: (formik.touched.therapeuticalClassCode && Boolean(formik.errors.therapeuticalClassCode)) ? '#f018a6' : '' }}
            >
                Clase Terapéutica
            </label>
                <Select
                    className={`mt-0`}
                    fullWidth
                    id="therapeuticalClassCode"
                    name="therapeuticalClassCode"
                    value={formik.values.therapeuticalClassCode}
                    onChange={formik.handleChange}
                    error={formik.touched.therapeuticalClassCode && Boolean(formik.errors.therapeuticalClassCode)}
                    helperText={formik.touched.therapeuticalClassCode && formik.errors.therapeuticalClassCode}
                >
                    <MenuItem key="empty-line" value={''}>&nbsp;</MenuItem>
                    {therapeuticalClass.map((thep,key) => {
                        return (
                            <MenuItem value={thep.code} key={key}>{thep.description}</MenuItem>
                        )
                        })
                    }
                </Select>
                {formik.touched.therapeuticalClassCode && Boolean(formik.errors.therapeuticalClassCode) &&
                  <p className="MuiFormHelperText-root Mui-error"  style={{color: '#f018a6', fontSize: '0.75rem'}}>{formik.touched.therapeuticalClassCode && formik.errors.therapeuticalClassCode}</p>
                }                
        </FormControl>
        <FormControl className={`d-block mb-3 mt-2`}>
            <label 
                className={(formik.touched.businessUnitCode && Boolean(formik.errors.businessUnitCode)) ? 'pf-10 MuiFormLabel-root Mui-error' : 'pf-10' }
                style={{ color: (formik.touched.businessUnitCode && Boolean(formik.errors.businessUnitCode)) ? '#f018a6' : '' }}
            >
                Unidad de Negocio
            </label>
                <Select
                    className={`mt-0`}
                    fullWidth
                    id="businessUnitCode"
                    name="businessUnitCode"
                    value={formik.values.businessUnitCode}
                    onChange={formik.handleChange}
                    error={formik.touched.businessUnitCode && Boolean(formik.errors.businessUnitCode)}
                    helperText={formik.touched.businessUnitCode && formik.errors.businessUnitCode}
                >
                    <MenuItem key="empty-line" value={''}>&nbsp;</MenuItem>
                    {businessUnits.map((bu,key) => {
                        return (
                            <MenuItem value={bu.code} key={key}>{bu.description}</MenuItem>
                        )
                        })
                    }
                </Select>
                {formik.touched.businessUnitCode && Boolean(formik.errors.businessUnitCode) &&
                  <p className="MuiFormHelperText-root Mui-error"  style={{color: '#f018a6', fontSize: '0.75rem'}}>{formik.touched.businessUnitCode && formik.errors.businessUnitCode}</p>
                }                
        </FormControl>
        <FormControl className={`d-block mb-3 mt-2`}>
            <label 
                className={(formik.touched.classCode && Boolean(formik.errors.classCode)) ? 'pf-10 MuiFormLabel-root Mui-error' : 'pf-10' }
                style={{ color: (formik.touched.classCode && Boolean(formik.errors.classCode)) ? '#f018a6' : '' }}
            >
                Género
            </label>
                <Select
                    className={`mt-0`}
                    fullWidth
                    id="classCode"
                    name="classCode"
                    value={formik.values.classCode}
                    onChange={formik.handleChange}
                    error={formik.touched.classCode && Boolean(formik.errors.classCode)}
                    helperText={formik.touched.classCode && formik.errors.classCode}
                >
                    <MenuItem key="empty-line" value={''}>&nbsp;</MenuItem>
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
                {formik.touched.classCode && Boolean(formik.errors.classCode) &&
                  <p className="MuiFormHelperText-root Mui-error"  style={{color: '#f018a6', fontSize: '0.75rem'}}>{formik.touched.classCode && formik.errors.classCode}</p>
                }                
        </FormControl>
      </form>
      </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleClose} 
            color="primary" 
            disabled={formik.isSubmitting}>
            Cancelar
          </Button>
          <Button 
            onClick={formik.handleSubmit} 
            color="primary" 
            disabled={formik.isSubmitting}>
            {loading && <span className="ml-3 spinner spinner-green"></span>}
            <span style={{paddingLeft:'25px'}}>Guardar</span>
          </Button>
        </DialogActions>
      </Dialog>
    )
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}
export default connect(null,mapDispatchToProps)(ActionDialog);