import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from '../_redux/mercadosActions';
import { injectIntl } from "react-intl";
import { Grid } from '@material-ui/core'
import VirtualizedCheckbox from '../../../components/ListCheckbox'
import ActionTabDialog from './ActionTabDialog'
import { MarketAssignForm } from './Forms'
import { useStyles } from '../../../Style/GeneralStyles';

const PharmaceuticalFormTabContainer = (props) => {
    const clases = useStyles()
    const { intl, customMarket, pharmaceuticalforms, pharmaceuticalformsLoading } = props
    const [ formLoading, setFormLoading ] = React.useState(false)
    const [ pharmarceuticalFormSelecteds, setPharmaceuticalFormSelected ] = React.useState([])
    const [ dialogVisibleForMarketAssing, setDialogVisibleForMarketAssing ] = React.useState(false);
    const [ formHasBeenSubmited, setFormHasBeenSubmited ] = React.useState(false)
    const [ marketAssignType, setMarketAssignType ] = React.useState('')
    const [ marketAssignItems, setMarketAssignItems ] = React.useState([])

    const getAll = async() => {
        await props.getPharmaceuticalForms();
    }

    React.useEffect(() => {
        return () => {
            reloadPharmaceuticalFormsVirtualizedCheckbox()
          }
    },[customMarket.data?.code])

    React.useEffect(() => {
        if (!pharmaceuticalforms) {
            getAll()
        }
    },[])

    const reloadPharmaceuticalFormsVirtualizedCheckbox = () => {
        props.dispatchPharmaceuticalFormsLoading(true)
        if (pharmaceuticalforms) {
            let pharmaceuticalformsAllUnchecked = pharmaceuticalforms.map(pf => ({ ...pf, checked: false }));
            props.dispatchPharmaceuticalForms(pharmaceuticalformsAllUnchecked)
            onSelectPharmaceuticalForms([])
        }
        props.dispatchPharmaceuticalFormsLoading(false)
    }

    const closeDialog = () => {
        setFormHasBeenSubmited(false)
        setDialogVisibleForMarketAssing(false)
        setMarketAssignType('')
        setMarketAssignItems([])
    }

    const submitForm = React.useCallback(
        () => {
            setFormHasBeenSubmited(true)
        },
        []
    );

    const onSelectItemFromMenu = (action) => {
        if(action == 'marketAssignFromPharmaceuticalForm') {
            if(pharmarceuticalFormSelecteds.length > 0) {
                setMarketAssignType(action)
                setMarketAssignItems(pharmarceuticalFormSelecteds)
                setDialogVisibleForMarketAssing(true)
            }
        }
    }

    const onSelectPharmaceuticalForms = async(items) => {
        let pharmaceuticalFormCodes = []
        let itemsChecked = items.filter(x => x.checked === true);

        itemsChecked.map(pharmaceuticalFormItem => {
            let pharmaceuticalForm = getItemObject(pharmaceuticalFormItem)
            pharmaceuticalFormCodes.push(pharmaceuticalForm.code)
        })
        setPharmaceuticalFormSelected(itemsChecked)
    }

    return (
        <div style={{height:'350px'}}>
                <div style={{height:'350px'}}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <div style={{width:'100%', height:305, marginRight:0, paddingRight: 0}}>
                                <VirtualizedCheckbox
                                    items={pharmaceuticalforms}
                                    isLoading={pharmaceuticalformsLoading}
                                    title={intl.formatMessage({id: "CUSTOM_MARKET_TAB.SEARCH.PHARMACEUTICAL_FORM"})}
                                    onSelectItemFromMenu={onSelectItemFromMenu}
                                    options={[
                                        {title: intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.ASSIGN_CUSTOM_MARKET"}), action:'marketAssignFromPharmaceuticalForm'}
                                    ]}
                                    onChange={onSelectPharmaceuticalForms}
                                    onSelectAllChange={onSelectPharmaceuticalForms}
                                />
                            </div>
                        </Grid>
                    </Grid>
                    <ActionTabDialog
                        title={intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.ASSIGN_CUSTOM_MARKET"})}
                        onAccept={submitForm}
                        onCancel={closeDialog}
                        btnDisabled={() => console.log('')}
                        isLoading={formLoading}
                        visible={dialogVisibleForMarketAssing}
                    >
                        <MarketAssignForm 
                            formHasBeenSubmited={formHasBeenSubmited} 
                            onChangeStatusForm={() => setFormHasBeenSubmited(false)}
                            customMarketType={marketAssignType}
                            itemsSelecteds={marketAssignItems} 
                            onChangeLoadingForm={(loading) => setFormLoading(loading)}
                            onClose={()=> {
                                    closeDialog()
                                    reloadPharmaceuticalFormsVirtualizedCheckbox()
                                }
                            }
                        />
                    </ActionTabDialog>
                </div>
        </div>
    )
    
}

function mapStateToProps(state) {
  return { 
      customMarket: state.mercados.customMarket,
      pharmaceuticalforms: state.mercados.pharmaceuticalforms,
      pharmaceuticalformsLoading: state.mercados.pharmaceuticalformsLoading
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

function getItemObject(item) {
    return JSON.parse(atob(item.value))
}

export default injectIntl(connect(mapStateToProps,mapDispatchToProps)(PharmaceuticalFormTabContainer));