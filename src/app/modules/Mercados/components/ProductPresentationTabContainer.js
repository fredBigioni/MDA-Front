import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from '../_redux/mercadosActions';
import { injectIntl } from "react-intl";
import { MarketAssignForm, ProductPresentationForm } from './Forms'
import { Grid } from '@material-ui/core'
import VirtualizedCheckbox from '../../../components/ListCheckbox'
import ActionTabDialog from './ActionTabDialog'
import { useStyles } from '../../../Style/GeneralStyles';

const ProductPresentationTabContainer = (props) => {
    const clases = useStyles()
    const { intl, customMarket, productpresentations, loadingProductPresentations } = props
    
    const [ formLoading, setFormLoading ] = React.useState(false)
    const [ formHasBeenSubmited, setFormHasBeenSubmited ] = React.useState(false)
    const [ productPresentationSelected, setProductPresentationSelected ] = React.useState([])
    const [ dialogVisibleForProductPresentation, setDialogVisibleForProductPresentation ] = React.useState(false);
    const [ loadingPharmaceuticalForms, setLoadingPharmaceuticalForms] = React.useState(false);
    const [ pharmaceuticalForms, setPharmaceuticalForms ] = React.useState([])    
    const [ pharmaceuticalFormSelected, setPharmaceuticalFormSelected ] = React.useState([])
    const [ marketAssignType, setMarketAssignType ] = React.useState('')
    const [ marketAssignItems, setMarketAssignItems ] = React.useState([])
    const [ dialogVisibleForMarketAssing, setDialogVisibleForMarketAssing ] = React.useState(false);

    const getAllProductPresentations = async (itemsChecked) => {
        await props.getProductPresentations(itemsChecked);
    }

    React.useEffect(() => {
        return () => {
            reloadProductPresentationVirtualizedCheckbox()
          }
    },[customMarket.data?.code])    

    React.useEffect(() => {
        if (!productpresentations) {
            getAllProductPresentations(null)
        }
    },[])

    const reloadProductPresentationVirtualizedCheckbox = () => {
        props.dispatchProductPresentationLoading(true)
        if (productpresentations) {
            let productPresentationsAllUnchecked = productpresentations.map(p => ({ ...p, checked: false }));
            props.dispatchProductPresentations(productPresentationsAllUnchecked)
            onProductPresentation([])
            setPharmaceuticalFormSelected([])
        }
        props.dispatchProductPresentationLoading(false)
    }

    const reloadPharmaceuticalFormVirtualizedCheckbox = async () => {
        setPharmaceuticalFormSelected([])
        let productPresentationCodes = []
        let productPresentationGroupCodes = []

        productPresentationSelected.map(productPresentationItem => {               
            let productPresentation = getItemObject(productPresentationItem)
            if (productPresentation.code) {
                productPresentationCodes.push(productPresentation.code)   
            } else if (productPresentation.productPresentationGroupCode) {
                productPresentationGroupCodes.push(productPresentation.productPresentationGroupCode)
            }
        })
        
        await getPharmaceuticalFormsByProductPresentation(productPresentationCodes, productPresentationGroupCodes, true)
    }

    const closeDialog = async(refresh = false) => {
        setMarketAssignItems([])
        setMarketAssignType('')
        setFormHasBeenSubmited(false)
        setDialogVisibleForProductPresentation(false)
        setDialogVisibleForMarketAssing(false)
    }

    const submitForm = React.useCallback(
        () => {
            setFormHasBeenSubmited(true)
        },
        []
    );

    const getPharmaceuticalFormsByProductPresentation = async (productPresentationCodes, productPresentationGroupCodes, resetChecked = false) => {
        setLoadingPharmaceuticalForms(true)
        let pharmaceuticalFormPreviousSelecteds = !resetChecked ? pharmaceuticalForms.filter(x => x.checked ==true) : []
        await props.getPharmaceuticalFormsByProductPresentation(productPresentationCodes.join(','), productPresentationGroupCodes.join(',')) 
            .then(async (pharmaceuticalFormsResponse) => {
                let pharmaceuticalForms = pharmaceuticalFormsResponse.map(pharmaceuticalForm => {
                    if (pharmaceuticalFormPreviousSelecteds.some(x => x.value == pharmaceuticalForm.value)) {
                        
                        pharmaceuticalForm.checked = true
                    }
                    return pharmaceuticalForm
                })            
                setPharmaceuticalForms(pharmaceuticalForms)
                setPharmaceuticalFormSelected(pharmaceuticalForms.filter(x => x.checked === true))
                setLoadingPharmaceuticalForms(false)
        })    
    }    
 
    const onProductPresentation = async(items) => {
        let productPresentationCodes = []
        let productPresentationGroupCodes = []
        let itemsChecked = items.filter(x => x.checked === true);

        itemsChecked.map(productPresentationItem => {
            let productPresentation = getItemObject(productPresentationItem)
            if (productPresentation.code) {
                productPresentationCodes.push(productPresentation.code)   
            } else if (productPresentation.productPresentationGroupCode) {
                productPresentationGroupCodes.push(productPresentation.productPresentationGroupCode)
            } 
        })

        setProductPresentationSelected(itemsChecked)
        if(productPresentationCodes.length > 0 || productPresentationGroupCodes.length > 0) {
            await getPharmaceuticalFormsByProductPresentation(productPresentationCodes, productPresentationGroupCodes)
        } else {
            setPharmaceuticalForms([])
        }
    }
    
    const onPharmaceuticalForm = async(items) => {
        let pharmaceuticalFormCodes = [];
        let itemsChecked = items.filter(x => x.checked === true);

        itemsChecked.map(pharmaceuticalFormItem => {
            let pharmaceuticalForm = getItemObject(pharmaceuticalFormItem)
            pharmaceuticalFormCodes.push(pharmaceuticalForm.code)
        })

        setPharmaceuticalFormSelected(itemsChecked)
    }

    const onSelectItemFromMenu = (action) => {
        if(action == 'createProductPresentationGroup') {
            if(productPresentationSelected.length > 0) {
               setMarketAssignType(action)
               setDialogVisibleForProductPresentation (true)
            }
        } else if(action == 'marketAssignFromProductPresentation') {
            if(productPresentationSelected.length > 0) {
                setMarketAssignType(action)
                setMarketAssignItems(productPresentationSelected)
                setDialogVisibleForMarketAssing(true)
            }
        } else if(action == 'marketAssignFromPharmaceuticalForm') {
            if(pharmaceuticalFormSelected.length > 0) {
                setMarketAssignType(action)
                setMarketAssignItems(pharmaceuticalFormSelected)
                setDialogVisibleForMarketAssing(true)
            }
        }
    }

    const refreshVirtualizedCheckbox = async () => {

        closeDialog()

        if(marketAssignType == 'marketAssignFromProductPresentation')  {
            reloadProductPresentationVirtualizedCheckbox()
        } else if (marketAssignType == 'createProductPresentationGroup') {
            reloadProductPresentationVirtualizedCheckbox()
            await getAllProductPresentations(null)
        } else if(marketAssignType == 'marketAssignFromPharmaceuticalForm') {
            await reloadPharmaceuticalFormVirtualizedCheckbox()
        }

    }    

    return (
        <div style={{height:'350px'}}>
                <div style={{height:'350px'}}>
                    <Grid container spacing={1}>
                        <Grid item xs={8} className="pr-0">
                            <div style={{width:'100%', height:305, marginRight:0, paddingRight: 0}}>
                                <VirtualizedCheckbox
                                    items={productpresentations}
                                    isLoading={loadingProductPresentations}
                                    title={intl.formatMessage({id: "CUSTOM_MARKET_TAB.SEARCH.PRODUCT_PRESENTATION"})}
                                    onChange={onProductPresentation}
                                    onSelectAllChange={ () => console.log('')}
                                    onSelectItemFromMenu={onSelectItemFromMenu}
                                    options={[
                                        {title: intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.CREATE_GROUP"}), action:'createProductPresentationGroup'},
                                        {title: intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.ASSIGN_CUSTOM_MARKET"}), action:'marketAssignFromProductPresentation'}
                                    ]}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={4} className="pr-0">
                            <div style={{width:'100%', height:305, marginRight:0, paddingRight: 0}}>
                                <VirtualizedCheckbox
                                    items={pharmaceuticalForms}
                                    isLoading={loadingProductPresentations || loadingPharmaceuticalForms}
                                    title={intl.formatMessage({id: "CUSTOM_MARKET_TAB.SEARCH.PHARMACEUTICAL_FORM"})}
                                    onChange={onPharmaceuticalForm}
                                    onSelectItemFromMenu={onSelectItemFromMenu}
                                    options={[
                                        {title: intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.ASSIGN_CUSTOM_MARKET"}), action:'marketAssignFromPharmaceuticalForm'}
                                    ]}
                                />
                            </div>
                        </Grid>
                    </Grid>
                    <ActionTabDialog
                        title={intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.CREATE_GROUP.PRODUCT_PRESENTATION"})}
                        onAccept={submitForm}
                        onCancel={() => closeDialog(false)}
                        btnDisabled={() => console.log('')}
                        isLoading={formLoading}
                        visible={dialogVisibleForProductPresentation}
                    >
                       <ProductPresentationForm  
                            formHasBeenSubmited={formHasBeenSubmited} 
                            onChangeStatusForm={() => setFormHasBeenSubmited(false)}  
                            productPresentationSelected={productPresentationSelected} 
                            onChangeLoadingForm={(loading) => setFormLoading(loading)}
                            onClose={()=> refreshVirtualizedCheckbox()}
                        />
                    </ActionTabDialog>
                    <ActionTabDialog
                        title={intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.ASSIGN_CUSTOM_MARKET"})}
                        onAccept={submitForm}
                        onCancel={() => closeDialog(false)}
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
                            onClose={()=> refreshVirtualizedCheckbox()}
                        />
                    </ActionTabDialog>
                </div>
        </div>
    )
    
}

function mapStateToProps(state) {
  
  return {
        customMarket: state.mercados.customMarket,
        productpresentations: state.mercados.productpresentations,
        loadingProductPresentations: state.mercados.loadingProductPresentations
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

function getItemObject(item) {
    return JSON.parse(atob(item.value))
}

export default injectIntl(connect(mapStateToProps,mapDispatchToProps)(ProductPresentationTabContainer));