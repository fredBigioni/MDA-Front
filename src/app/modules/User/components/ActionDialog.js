import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from '../_redux/Actions';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import { injectIntl } from "react-intl";
import { useFormik } from 'formik';
import { TextField } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

const ActionDialog = (props) => {
    const { action: { actionType, dialogVisible, user }, intl } = props;
    const [loading, setLoading] = React.useState(false);

    const enableLoading = () => {
        setLoading(true);
    };
    
    const disableLoading = () => {
        setLoading(false);
    };  

    const validateUser = values => {
      const errors = {};
      if(actionType == 'create') {
        if (!values.usuario) {
          errors.usuario = intl.formatMessage({id: 'FORM.ERROR.REQUIRED_FIELD'});
        }
        if (!values.dominio) {
          errors.dominio = intl.formatMessage({id: 'FORM.ERROR.REQUIRED_FIELD'});
        }
      }
    
      return errors;
  };
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
          isAdmin: actionType == 'edit' ? user.isAdmin : false,
          usuario: actionType == 'edit' ? user.usuario : '',
          dominio: actionType == 'edit' ? user.dominio : ''
        },
        validate: validateUser,
        onSubmit: (values, { setSubmitting, setErrors }) => {
            enableLoading();
            setTimeout(async () => {
                try {
                  if(actionType == 'edit') {
                    await props.updateUserAdministrator(user.id, JSON.stringify({isAdmin: values.isAdmin, usuario: values.usuario, dominio: values.dominio}))
                  }else{
                    await props.createUser(JSON.stringify({isAdmin: values.isAdmin, usuario: values.usuario, dominio: values.dominio}))
                  }
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

    const userForm = () => {
      if(actionType == 'edit') {
        return (
          <FormControl className={`d-block mb-3 mt-2`}>
            <label className={(formik.touched.isAdmin && Boolean(formik.errors.isAdmin)) ? 'pf-10 MuiFormLabel-root Mui-error' : 'pf-10' }>Perfil Administrador</label>
                <Checkbox
                    name='isAdmin'
                    id='isAdmin'
                    checked={formik.values.isAdmin}
                    onChange={formik.handleChange}
                />                
          </FormControl>
        )
      }else{
        return (
          <>
            <TextField
                className={`mb-4`}
                fullWidth
                autoComplete='off'
                name="usuario"
                label={intl.formatMessage({id: "AUTH.LOGIN.USER_NAME"})}
                type='text'
                onChange={formik.handleChange}
                value={formik.values.usuario}
                error={formik.touched.usuario && Boolean(formik.errors.usuario)}
                helperText={formik.touched.usuario && formik.errors.usuario}                
            />
            <TextField
                className={`mb-4`}
                fullWidth
                autoComplete='off'
                name="dominio"
                label={intl.formatMessage({id: "USERS.FORM.DOMAIN"})}
                type='text'
                onChange={formik.handleChange}
                value={formik.values.dominio}
                error={formik.touched.dominio && Boolean(formik.errors.dominio)}
                helperText={formik.touched.dominio && formik.errors.dominio}                
            />
            <FormControl className={`d-block mb-3 mt-2`}>
            <label className={(formik.touched.isAdmin && Boolean(formik.errors.isAdmin)) ? 'pf-10 MuiFormLabel-root Mui-error' : 'pf-10' }>Perfil Administrador</label>
                <Checkbox
                    name='isAdmin'
                    id='isAdmin'
                    checked={formik.values.isAdmin}
                    onChange={formik.handleChange}
                />                
            </FormControl>
          </>
        )
      }
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
      <DialogContentText className="text-uppercase">{actionType == 'edit' ? `${intl.formatMessage({id: "ACTION.EDIT"})}: ${user.dominio} / ${user.usuario}`: `${intl.formatMessage({id: "USERS.CREATE.TITLE"})}` } </DialogContentText>
      <form onSubmit={formik.handleSubmit}>
        {userForm()}
      </form>
      </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleClose} 
            color="primary" 
            disabled={loading ? true : false}>
            {intl.formatMessage({id: 'FORM.ACTION.CANCEL'})}
          </Button>
          <Button 
            onClick={formik.handleSubmit} 
            color="primary" 
            disabled={loading ? true : false}>
            {loading && <span className="ml-3 spinner spinner-green"></span>}
            <span style={{paddingLeft:'25px'}}>{intl.formatMessage({id: 'FORM.ACTION.SAVE'})}</span>
          </Button>
        </DialogActions>
      </Dialog>
    )
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}
export default injectIntl(connect(null,mapDispatchToProps)(ActionDialog));