import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from '../_redux/mercadosActions';
import { injectIntl } from "react-intl";
import { Grid } from '@material-ui/core'
import VirtualizedCheckbox from '../../../components/ListCheckbox'
import ActionTabDialog from './ActionTabDialog'
import { MarketAssignForm, ProductForm, ProductPresentationForm } from './Forms'
import { useStyles } from '../../../Style/GeneralStyles';

const ProductTabContainer = (props) => {
    const clases = useStyles()
    const { intl, customMarket, products, loadingProducts } = props

    const [ formLoading, setFormLoading ] = React.useState(false)
    const [ formBtnSubmitDisabled, setFormBtnSubmitDisabled ] = React.useState(false)
    const [ loadingPharmaceuticalForms, setLoadingPharmaceuticalForms] = React.useState(false);
    const [ pharmaceuticalForms, setPharmaceuticalForms ] = React.useState([])
    const [ loadingProductPresentation, setLoadingProductPresentation] = React.useState(false);
    const [ productsSelected, setProductsSelected ] = React.useState([])
    const [ dialogVisibleForProducts, setDialogVisibleForProducts ] = React.useState(false);
    const [ pharmaceuticalFormSelected, setPharmaceuticalFormSelecteds ] = React.useState([])
    const [ productPresentation, setProductPresentation ] = React.useState([])
    const [ productPresentationSelected, setProductPresentationSelected ] = React.useState([])
    const [ dialogVisibleForMarketAssing, setDialogVisibleForMarketAssing ] = React.useState(false);
    const [ marketAssignType, setMarketAssignType ] = React.useState('')
    const [ marketAssignItems, setMarketAssignItems ] = React.useState([])
    const [ dialogVisibleForPresentation , setDialogVisibleForPresentation] = React.useState(false)
    const [ formHasBeenSubmited, setFormHasBeenSubmited ] = React.useState(false)

    const getAllProducts = async(itemsChecked) => {
        await props.getProducts(itemsChecked);
    }

    React.useEffect(() => {
        if (!products) {
            getAllProducts(null)
        }
    },[])

    React.useEffect(() => {
        return () => {
            reloadProductVirtualizedCheckbox()
          }
    },[customMarket.data?.code])    

    React.useEffect(() => {
        getProductPresentationsByPharmaceuticalForm()
     }, [pharmaceuticalForms]);    

    const reloadProductVirtualizedCheckbox = () => {
        
        props.dispatchProductLoading(true)
        if (products) {
            let productsAllUnchecked = products.map(p => ({ ...p, checked: false }));
            props.dispatchProducts(productsAllUnchecked)
            onSelectProduct([])
            setPharmaceuticalFormSelecteds([])
            setProductPresentationSelected([])
        }
        props.dispatchProductLoading(false)        
    }

    const reloadPharmaceuticalFormVirtualizedCheckbox = async () => {

        setPharmaceuticalFormSelecteds([])
        setProductPresentationSelected([])
        let productsCodes = []
        let productGroupsCodes = []

        productsSelected.map(productItem => {               
            let product = getItemObject(productItem)
            if (product.productCode) {
                productsCodes.push(product.productCode)
            } else if (product.productGroupCode) {
                productGroupsCodes.push(product.productGroupCode)
            }
        })
        
        await getPharmaceuticalFormByProduct(productsCodes, productGroupsCodes, true)
    }    

    const reloadProductPresentationVirtualizedCheckbox = async () => {
        
        setProductPresentationSelected([])
        let pharmaceuticalFormCodes = []

        pharmaceuticalFormSelected.map(pharmaceuticalFormItem => {
            let pharmaceuticalForm = getItemObject(pharmaceuticalFormItem)
            pharmaceuticalFormCodes.push(pharmaceuticalForm.code)
        })
        
        await getProductPresentationsByPharmaceuticalForm(pharmaceuticalFormCodes, true)
    } 

    const getPharmaceuticalFormByProduct = async (productCodes, productGroupCodes, resetChecked = false) => {
        setLoadingPharmaceuticalForms(true)
        let pharmaceuticalFormPreviousSelecteds = !resetChecked ? pharmaceuticalForms.filter(x => x.checked ==true) : []
        await props.getPharmaceuticalFormsByProduct(productCodes.join(','), productGroupCodes.join(',')) 
            .then(async (pharmaceuticalformsResponse) => {
                let pharmaceuticalforms = pharmaceuticalformsResponse.map(pharmaceuticalform => {
                    if (pharmaceuticalFormPreviousSelecteds.some(x => x.value == pharmaceuticalform.value)) {
                        pharmaceuticalform.checked = true
                    }
                    return pharmaceuticalform
                })            

                setPharmaceuticalForms(pharmaceuticalforms)
                setPharmaceuticalFormSelecteds(pharmaceuticalforms.filter(x => x.checked === true))
                setLoadingPharmaceuticalForms(false)
        })    
    }

    const getProductPresentationsByPharmaceuticalForm = async (pharmaceuticalFormCodes, resetChecked = false) => {
        if (pharmaceuticalFormCodes == null || pharmaceuticalFormCodes == undefined) {
            pharmaceuticalFormCodes = []
            let pharmaceuticalFormsPreviousSelecteds = pharmaceuticalForms.filter(pfItem => pfItem.checked == true)
            pharmaceuticalFormsPreviousSelecteds.map(pharmaceuticalFormItem => {            
                let pharmaceuticalForm = getItemObject(pharmaceuticalFormItem)
                pharmaceuticalFormCodes.push(pharmaceuticalForm.code)
            })

            if (pharmaceuticalFormCodes.length == 0) {
                setProductPresentation([])
                setProductPresentationSelected([])
                return
            }
        }

        setLoadingProductPresentation(true)

        let productCodes = productsSelected.map(productItem => {               
            return getItemObject(productItem).productCode || null
        })
        productCodes = productCodes.filter(p => p !== null)

        let productGroupCodes = productsSelected.map(productItem => {               
            return getItemObject(productItem).productGroupCode || null
        })        
        productGroupCodes = productGroupCodes.filter(p => p !== null)

        let productPresentationPreviousSelecteds = !resetChecked ? productPresentation.filter(x => x.checked ==true) : []
        await props.getPresentationsbyPharmaceuticalForms(pharmaceuticalFormCodes.join(','), productCodes.join(','), productGroupCodes.join(',')) 
            .then((productPresentationsResponse) => {
                let productPresentations = productPresentationsResponse.map(productPresentation => {
                    if (productPresentationPreviousSelecteds.some(x => x.value == productPresentation.value)) {
                        productPresentation.checked = true
                    }
                    return productPresentation
                })            
                setProductPresentation(productPresentations)
                setProductPresentationSelected(productPresentations.filter(x => x.checked === true))
                setLoadingProductPresentation(false)
        })    
    }

    const onSelectProduct = async(items) => {
        let productsCodes = []
        let productGroupsCodes = []
        let itemsChecked = items.filter(x => x.checked === true);

        itemsChecked.map(productItem => {               
            let product = getItemObject(productItem)
            if (product.productCode) {
                productsCodes.push(product.productCode)
            } else if (product.productGroupCode) {
                productGroupsCodes.push(product.productGroupCode)
            }
        })

        setProductsSelected(itemsChecked)
        if(productsCodes.length > 0  || productGroupsCodes.length > 0) {
            await getPharmaceuticalFormByProduct(productsCodes, productGroupsCodes)
        } else {
            setPharmaceuticalForms([])
            setProductPresentation([])
        }
    }

    const onSelectPharmaceuticalForms = async(items) => {
        let pharmaceuticalFormCodes = []
        let itemsChecked = items.filter(x => x.checked === true);

        itemsChecked.map(pharmaceuticalFormItem => {
            let pharmaceuticalForm = getItemObject(pharmaceuticalFormItem)
            pharmaceuticalFormCodes.push(pharmaceuticalForm.code)
        })

        setPharmaceuticalFormSelecteds(itemsChecked)
        if(pharmaceuticalFormCodes.length > 0) {
            await getProductPresentationsByPharmaceuticalForm(pharmaceuticalFormCodes)
        } else {
            setProductPresentation([])
            setProductPresentationSelected([])
        }   
    }

    const onSelectProductPresentation = async(items) => {
        let itemsChecked = items.filter(x => x.checked === true);
        setProductPresentationSelected(itemsChecked)
    }

    const onSelectItemFromMenu = (action) => {
        if(action == 'marketAssignFromProduct') {
            if(productsSelected.length > 0) {
                setMarketAssignType(action)
                setMarketAssignItems(productsSelected)
                setDialogVisibleForMarketAssing(true)
            }
        } else if(action == 'createProductGroup') {
            if(productsSelected.length > 0) {
                setMarketAssignType(action)
                setDialogVisibleForProducts(true)
            }
        } else if(action == 'createPresentationGroup') {
            if(productPresentationSelected.length > 0) {
                setMarketAssignType(action)
                setDialogVisibleForPresentation(true)
            }
        } else if(action == 'marketAssignFromPharmaceuticalForm') {
            if(pharmaceuticalFormSelected.length > 0) {
                setMarketAssignType(action)
                setMarketAssignItems(pharmaceuticalFormSelected)
                setDialogVisibleForMarketAssing(true)
            }
        } else if(action == 'marketAssignFromProductPresentation') {
            if(productPresentationSelected.length > 0) {
                setMarketAssignType(action)
                setMarketAssignItems(productPresentationSelected)
                setDialogVisibleForMarketAssing(true)
            }
        }
    }

    const refreshVirtualizedCheckbox = async () => {

        closeDialog()
        
        if(marketAssignType == 'marketAssignFromProduct') {
            reloadProductVirtualizedCheckbox()
        } else if (marketAssignType == 'createProductGroup') {
            reloadProductVirtualizedCheckbox()
            await getAllProducts(null)                
        } else if(marketAssignType == 'marketAssignFromPharmaceuticalForm') {
            await reloadPharmaceuticalFormVirtualizedCheckbox()
        } else if(marketAssignType == 'marketAssignFromProductPresentation'  || marketAssignType == 'createPresentationGroup') {
            await reloadProductPresentationVirtualizedCheckbox()
        }

    }
    
    const closeDialog = () => {
        setMarketAssignItems([])
        setMarketAssignType('')
        setFormLoading(false)
        setFormHasBeenSubmited(false)
        setDialogVisibleForProducts(false)
        setDialogVisibleForPresentation(false)
        setDialogVisibleForMarketAssing(false)      
    }

    const submitForm = React.useCallback(
        () => {
            setFormHasBeenSubmited(true)
            setFormBtnSubmitDisabled(true)
        },
        []
    );
    
    return (
        <div style={{height:'350px'}}>
                <div style={{height:'350px'}}>
                    <Grid container spacing={1}>
                        <Grid item xs={3} className="pr-0">
                            <div style={{width:'100%', height:305, marginRight:0, paddingRight: 0}}>
                                <VirtualizedCheckbox
                                    items={products}
                                    isLoading={loadingProducts}
                                    title={intl.formatMessage({id: "CUSTOM_MARKET_TAB.SEARCH.PRODUCT"})}
                                    onChange={onSelectProduct}
                                    onSelectAllChange={onSelectProduct}
                                    onSelectItemFromMenu={onSelectItemFromMenu}
                                    options={[
                                        {title: intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.CREATE_GROUP"}), action:'createProductGroup'},
                                        {title: intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.ASSIGN_CUSTOM_MARKET"}), action: 'marketAssignFromProduct'},
                                    ]}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={3} className="pr-0">
                            <div style={{width:'100%', height:305, marginRight:0, paddingRight: 0}}>
                                <VirtualizedCheckbox
                                    items={pharmaceuticalForms}
                                    isLoading={loadingProducts || loadingPharmaceuticalForms}
                                    title={intl.formatMessage({id: "CUSTOM_MARKET_TAB.SEARCH.PHARMACEUTICAL_FORM"})}
                                    onChange={onSelectPharmaceuticalForms}
                                    onSelectAllChange={onSelectPharmaceuticalForms}
                                    onSelectItemFromMenu={onSelectItemFromMenu}
                                    options={[
                                        {title: intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.ASSIGN_CUSTOM_MARKET"}), action: 'marketAssignFromPharmaceuticalForm'}
                                    ]}
                                />
                            </div>
                            
                        </Grid>
                        <Grid item xs={6} className="pr-0">
                            <div style={{width:'100%', height:305, marginRight:0, paddingRight: 0}}>
                                <VirtualizedCheckbox
                                    items={productPresentation}
                                    isLoading={loadingProducts || loadingPharmaceuticalForms || loadingProductPresentation}
                                    title={intl.formatMessage({id: "CUSTOM_MARKET_TAB.SEARCH.PRODUCT_PRESENTATION"})}
                                    onChange={onSelectProductPresentation}
                                    onSelectItemFromMenu={onSelectItemFromMenu}
                                    options={[
                                        {title: intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.CREATE_GROUP"}), action: 'createPresentationGroup'},
                                        {title: intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.ASSIGN_CUSTOM_MARKET"}), action: 'marketAssignFromProductPresentation'}
                                    ]}
                                />
                            </div>
                        </Grid>
                    </Grid>
                    <ActionTabDialog
                        title={intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.CREATE_GROUP.PRODUCT"})}
                        onAccept={submitForm}
                        onCancel={() => closeDialog()}
                        btnDisabled={formBtnSubmitDisabled}
                        isLoading={formLoading}
                        visible={dialogVisibleForProducts}
                    >
                        <ProductForm  
                            formHasBeenSubmited={formHasBeenSubmited} 
                            onChangeStatusForm={() => setFormHasBeenSubmited(false)}  
                            productsSelected={productsSelected} 
                            onChangeLoadingForm={(loading) => setFormLoading(loading)}
                            onClose={()=> refreshVirtualizedCheckbox()}
                        />
                    </ActionTabDialog>
                    <ActionTabDialog
                        title={intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.ASSIGN_CUSTOM_MARKET"})}
                        onAccept={submitForm}
                        onCancel={() => setDialogVisibleForMarketAssing(false)}
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
                    <ActionTabDialog
                        title={intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.CREATE_GROUP.PRODUCT_PRESENTATION"})}
                        onAccept={submitForm}
                        onCancel={()=> setDialogVisibleForPresentation(false)}
                        btnDisabled={() => console.log('')}
                        isLoading={formLoading}
                        visible={dialogVisibleForPresentation}
                    >
                        <ProductPresentationForm  
                            formHasBeenSubmited={formHasBeenSubmited} 
                            onChangeStatusForm={() => setFormHasBeenSubmited(false)}  
                            productPresentationSelected={productPresentationSelected} 
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
      products: state.mercados.products,
      loadingProducts: state.mercados.loadingProducts
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

function getItemObject(item) {
    return JSON.parse(atob(item.value))
}

export default injectIntl(connect(mapStateToProps,mapDispatchToProps)(ProductTabContainer));