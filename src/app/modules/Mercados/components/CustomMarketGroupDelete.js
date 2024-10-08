import React, { useState } from "react";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from './../_redux/mercadosActions';
import { FormattedMessage } from "react-intl";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const CustomMarketGroupDeleteDialog = (props) => {
  const {customMarketGroupSelected, open, handleClose} = props
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
      setLoading(false);
  };    

  const handleDelete = () => {
    setErrors({})
    enableLoading();
    setTimeout(async () => {
         try { 
            await props.deleteCustomMarketGroup(customMarketGroupSelected.code)
            disableLoading();
            handleClose(true)
            await Promise.all([props.getCustomMarkets(), props.getCustomMarketGroupByCustomMarketCode(customMarketGroupSelected.customMarketCode)])
          } catch(err) {
            if (err.response && err.response.data == 'has_custom_market_detail') {
                setErrors( {api: <FormattedMessage id="CUSTOM_MARKET_GROUP_DELETE_DIALOG.EXCEPTION" />} )
            } else {
                setErrors( {api: <FormattedMessage id="FORM.ERROR.API_EXCEPTION" />} )
            }            
            disableLoading();
          }
    }, 1000);
  }

  React.useEffect(() => { 
    setErrors({})
  }, [open])

  return (
    <>
    {customMarketGroupSelected && customMarketGroupSelected.code && (
    <div>
        <Dialog
            maxWidth="sm"
            fullWidth={true}
            open={open}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">
            <FormattedMessage id="CUSTOM_MARKET_GROUP_DELETE_DIALOG.TITLE" />
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
                <FormattedMessage id="CUSTOM_MARKET_GROUP_DELETE_DIALOG.MESSAGE" values={{ name: customMarketGroupSelected.description }}/>
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            {errors.api &&
                <div className="MuiFormLabel-root Mui-error text-left pl-5" style={{width: '100%'}}>{errors.api}</div>
            }                    
            <Button onClick={handleClose} color="primary" disabled={loading}>
                <FormattedMessage id="FORM.ACTION.CANCEL" />
            </Button>
            <Button onClick={handleDelete} className="text-danger" disabled={loading}>
            {loading && <span className="ml-3 spinner spinner-green"></span>}
                <span style={{paddingLeft:'25px'}}>
                <FormattedMessage id="FORM.ACTION.DELETE" />
                </span>
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    )}
    </>
  );
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

export default connect(null,mapDispatchToProps)(CustomMarketGroupDeleteDialog);