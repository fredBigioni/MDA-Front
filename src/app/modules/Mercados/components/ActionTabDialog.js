import React from 'react'
import { DialogContent } from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { injectIntl } from "react-intl";


const ActionTabDialog = (props) => {
    const { children, onAccept, onCancel, title, description, visible, isLoading, type, intl } = props;
    
    const handleClose = () => {
        if(!isLoading) {
            props.onCancel();
        }
    }
    return (
        <Dialog 
            onClose={handleClose} 
            open={visible}
            maxWidth='sm'
            fullWidth={true}
            keepMounted
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
        <DialogContent>
          <DialogContentText className="mb-8">
            <strong>
                {title}
            </strong>
            <p></p>
            {description}
          </DialogContentText>                       
                {children}
                <DialogActions>
                    <Button onClick={onCancel} color="primary" disabled={isLoading ? true : false}>
                        Cancelar
                    </Button>
                    <Button onClick={onAccept} color="primary" disabled={isLoading ? true : false} className={(type && type == 'delete')? "text-danger": ""}>
                        {isLoading && <span className="ml-3 spinner spinner-green"></span>}
                        <span style={{paddingLeft:'25px'}}>{type && type == 'delete' ? intl.formatMessage({id: "FORM.ACTION.DELETE"}) : intl.formatMessage({id: "FORM.ACTION.SAVE"})}</span>
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    )
}

export default injectIntl(ActionTabDialog);