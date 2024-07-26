import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from '../_redux/Actions';
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
    const { action: { actionType, dialogVisible, item, laboratories } } = props;
    const [loading, setLoading] = React.useState(false);
    
    const enableLoading = () => {
        setLoading(true);
    };
    
    const disableLoading = () => {
        setLoading(false);
    };  

    const validate = values => {
        const errors = {};
        if (!values.laboratoryCode) {
          errors.laboratoryCode = 'campo obligatorio';
        }
      
        return errors;
    }; 
    const formikProduct = useFormik({
        enableReinitialize: true,
        initialValues: {
            laboratoryCode: actionType == 'edit' ? item.laboratoryCode : '' 
        },
        validate: validate,
        onSubmit: (values, { setSubmitting, setErrors }) => {
            enableLoading();
            setTimeout(async () => {
                try {
                    await props.updateProduct(item.code, JSON.stringify({laboratoryCode: values.laboratoryCode}))
                    disableLoading();
                    props.closeDialogAndReload()
                } catch(err) {
                    setErrors( {api: "Error. No se ha podido completar la acción"} )
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
      <DialogContentText> {actionType == 'edit' ? `Editar ${item.description}` : 'Nuevo producto' } </DialogContentText>
      <form onSubmit={formikProduct.handleSubmit}>
        <FormControl className={`d-block mb-3 mt-2`}>
            <label className={(formikProduct.touched.laboratoryCode && Boolean(formikProduct.errors.laboratoryCode)) ? 'pf-10 MuiFormLabel-root Mui-error' : 'pf-10' }>Laboratorio</label>
                <Select
                    className={`mt-0`}
                    fullWidth
                    id="laboratoryCode"
                    name="laboratoryCode"
                    value={formikProduct.values.laboratoryCode}
                    onChange={formikProduct.handleChange}
                    error={formikProduct.touched.clase && Boolean(formikProduct.errors.laboratoryCode)}
                    helperText={formikProduct.touched.laboratoryCode && formikProduct.errors.laboratoryCode}
                >
                    <MenuItem key="empty-line" value={''}>&nbsp;</MenuItem>
                    {laboratories.map((lab,key) => {
                        return (
                            <MenuItem value={lab.code} key={key}>{lab.description}</MenuItem>
                        )
                        })
                    }
                </Select>
                {formikProduct.touched.clase && Boolean(formikProduct.errors.laboratoryCode) &&
                  <p className="MuiFormHelperText-root Mui-error">{formikProduct.touched.clase && formikProduct.errors.clase}</p>
                }                
        </FormControl>
      </form>
      </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleClose} 
            color="primary" 
            disabled={formikProduct.isSubmitting}>
            Cancelar
          </Button>
          <Button 
            onClick={formikProduct.handleSubmit} 
            color="primary" 
            disabled={formikProduct.isSubmitting}>
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