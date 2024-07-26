import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from '../_redux/Actions';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import { useFormik } from 'formik';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const ActionDialog = (props) => {
    const { action: { actionType, dialogVisible, item } } = props;
    const [loading, setLoading] = React.useState(false);

    const enableLoading = () => {
        setLoading(true);
    };
    
    const disableLoading = () => {
        setLoading(false);
    };  

    const validate = values => {
        const errors = {};
        if (!values.description) {
          errors.description = 'campo obligatorio';
        }
      
        return errors;
    }; 
    const prepareToSave = ({description}) => {
        
        return JSON.stringify({description: description,})
        
    }
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
                    if (actionType == 'edit') {
                        await props.updateBusinessUnit(item.code, JSON.stringify({description: values.description}))
                    } else if (actionType == 'create') {
                        await props.createBusinessUnit(JSON.stringify({description: values.description}))
                    }
                    disableLoading();
                    props.closeDialogAndReload()
                } catch(err) {
                    setErrors( {api: "Error. No se ha podido completar la acción"} )
                    disableLoading();
                } finally {
                    setSubmitting(false);
                    formik.resetForm()
                }
            }, 500)
        }
    });

    const handleClose = () => {
        props.closeDialog();
        formik.resetForm()
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
      <DialogContentText> {actionType == 'edit' ? 'Editar Unidad de Negocio' : 'Nueva Unidad de Negocio' } </DialogContentText>
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