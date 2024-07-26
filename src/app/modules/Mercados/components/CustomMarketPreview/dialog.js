import React, { useState, useCallback } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from '../../_redux/mercadosActions';
import ActionDialog from '../ActionTabDialog'
import { CustomMarketPreviewForm } from '../Forms'
import { FormattedMessage, injectIntl } from "react-intl";

const CustomMarketPreviewDialog = (props) => {
    const { customMarketPreviewAction, intl } = props;
    const [ formLoading, setFormLoading ] = useState(false);
    const [ formHasBeenSubmited, setFormHasBeenSubmited ] = React.useState(false)
    
    const onCancel = () => {
        props.actionCustomMarketPreviewReset()
    }
    const submitForm = useCallback(
        () => {
            setFormHasBeenSubmited(true)
        },[]
    );
    if(customMarketPreviewAction.visible == true) {
        return (
            <ActionDialog
                title={customMarketPreviewAction.type !== '' ? intl.formatMessage({id: customMarketPreviewAction.type == 'edit' ? "ACTION.EDIT" : "CUSTOM_MARKET_PREVIEW_DELETE_DIALOG.MESSAGE"}) : ''}
                description={intl.formatMessage({id:"CUSTOM_MARKET_PREVIEW.PRESENTATION"}) + ': ' + customMarketPreviewAction.item.productPresentationDescription}
                onAccept={submitForm}
                onCancel={onCancel}
                isLoading={formLoading}
                visible={customMarketPreviewAction.visible}
                type={customMarketPreviewAction.type}
            >
                <CustomMarketPreviewForm 
                    formHasBeenSubmited={formHasBeenSubmited}
                    onChangeStatusForm={() => setFormHasBeenSubmited(false)}
                    onClose={onCancel}
                    action={customMarketPreviewAction}
                    onDelete={() => props.onDelete(customMarketPreviewAction.item)}
                    onUpdate={(itemUpdate) => props.onUpdate(itemUpdate)}
                    onChangeLoadingForm={(loading) => setFormLoading(loading)}
                />
            </ActionDialog>
        )
    }
    return null
}

const mapStateToProps = (state) => {
    return {
        customMarketPreviewAction: state.mercados.customMarketPreviewAction
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}
export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(CustomMarketPreviewDialog));