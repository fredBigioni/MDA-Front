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

const TherapeuticalClassTabContainer = (props) => {
    const clases = useStyles()
    const { intl, customMarket, therapeuticalclasses, loadingTherapeuticalClasses } = props
    const [ loadingProducts, setLoadingProducts] = React.useState(false);
    const [ products, setProducts ] = React.useState([])
    const [ formLoading, setFormLoading ] = React.useState(false)
    const [ formHasBeenSubmited, setFormHasBeenSubmited ] = React.useState(false)
    const [ loadingPharmaceuticalForms, setLoadingPharmaceuticalForms] = React.useState(false);
    const [ pharmaceuticalForms, setPharmaceuticalForms ] = React.useState([])
    const [ pharmaceuticalFormSelected, setPharmaceuticalFormSelected ] = React.useState([])
    const [ loadingProductPresentation, setLoadingProductPresentation] = React.useState(false);
    const [ productPresentation, setProductPresentation ] = React.useState([])
    const [ productsSelected, setProductsSelected ] = React.useState([])
    const [ dialogVisibleForProducts, setDialogVisibleForProducts ] = React.useState(false);
    const [ presentationSelected, setProductPresentationSelected ] = React.useState([])
    const [ dialogVisibleForPresentation , setDialogVisibleForPresentation] = React.useState(false)
    const [ therapeuticalClassSelected, setTherapeuticalClassSelected ] = React.useState([])
    const [ marketAssignType, setMarketAssignType ] = React.useState('')
    const [ marketAssignItems, setMarketAssignItems ] = React.useState([])
    const [ dialogVisibleForMarketAssing, setDialogVisibleForMarketAssing ] = React.useState(false);

    const getAllTherapeuticalClasses = async() => {
        await props.getTherapeuticalClasses();
    }

    React.useEffect(() => {
        return () => {
            reloadTherapeuticalClassVirtualizedCheckbox()
          }
    },[customMarket.data?.code])

    React.useEffect(() => {
        if (!therapeuticalclasses) {
            getAllTherapeuticalClasses()
        }
    },[])

    React.useEffect(() => {
        getPharmaceuticalFormByProduct()
     }, [products]);     

    React.useEffect(() => {
        getProductPresentationsByPharmaceuticalForm()
    }, [pharmaceuticalForms]);          

    const reloadTherapeuticalClassVirtualizedCheckbox = () => {
        props.dispatchTherapeuticalClassesLoading(true)
        if (therapeuticalclasses) {
            let therapeuticalClassesAllUnchecked = therapeuticalclasses.map(tc => ({ ...tc, checked: false }));
            props.dispatchTherapeuticalClasses(therapeuticalClassesAllUnchecked)
            onSelectTherapeuticalClasses([])
            onSelectProducts([])
            onSelectPharmaceuticalForms([])
            onSelectProductPresentation([])
        }
        props.dispatchTherapeuticalClassesLoading(false)
    }

    const reloadProductVirtualizedCheckbox = async () => {

        setProductsSelected([])
        setPharmaceuticalFormSelected([])
        setProductPresentationSelected([])

        let therapeuticalClassCodes = []

        therapeuticalClassSelected.map(therapeuticalClassItem => {
            if(therapeuticalClassItem.checked) {                
                let therapeuticalClass = getItemObject(therapeuticalClassItem)
                therapeuticalClassCodes.push(therapeuticalClass.code)
            }
        })

        await getProductByTherapeuticalClass(therapeuticalClassCodes, true)
    }

    const reloadPharmaceuticalFormVirtualizedCheckbox = async () => {
        setPharmaceuticalFormSelected([])
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

    const getProductByTherapeuticalClass = async (therapeuticalClassCodes, resetChecked = false) => {
        setLoadingProducts(true)
        let productPreviousSelecteds = !resetChecked ? products.filter(x => x.checked ==true) : []
        await props.getProductByTherapeuticalClass(therapeuticalClassCodes.join(',')) 
            .then(async (productsResponse) => {
                let products = productsResponse.map(product => {
                    if (productPreviousSelecteds.some(x => x.value == product.value)) {
                        product.checked = true
                    }
                    return product
                })            
                setProducts(products)
                setProductsSelected(products.filter(x => x.checked === true))
                setLoadingProducts(false)
        })    
    }

    const getPharmaceuticalFormByProduct = async (productCodes, productGroupCodes, resetChecked = false) => {
        if (productCodes == null || productGroupCodes == null) {
            productCodes = []
            productGroupCodes = []
            let productsPreviousSelecteds = products.filter(pItem => pItem.checked == true)
            productsPreviousSelecteds.map(productItem => {            
                let product = getItemObject(productItem)
                if (product.productCode) {
                    productCodes.push(product.productCode)
                } else if (product.productGroupCode) {
                    productGroupCodes.push(product.productGroupCode)
                }
            })

            if (productCodes.length == 0 && productGroupCodes == 0) {
                setPharmaceuticalForms([])
                setPharmaceuticalFormSelected([])
                setProductPresentation([])
                setProductPresentationSelected([])
                return
            }
        }

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
                setPharmaceuticalFormSelected(pharmaceuticalforms.filter(x => x.checked === true))
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

        let productPresentationPreviousSelecteds =  !resetChecked ? productPresentation.filter(x => x.checked ==true) : []
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

    const onSelectTherapeuticalClasses = async(items) => {
        let therapeuticalClassCodes = []
        let itemsChecked = items.filter(x => x.checked === true);

        items.map(therapeuticalClassItem => {
            if(therapeuticalClassItem.checked) {                
                let therapeuticalClass = getItemObject(therapeuticalClassItem)
                therapeuticalClassCodes.push(therapeuticalClass.code)
            }
        })
        setTherapeuticalClassSelected(itemsChecked)
        if(therapeuticalClassCodes.length > 0) {
            await getProductByTherapeuticalClass(therapeuticalClassCodes)
        } else {
            setProducts([])
            setPharmaceuticalForms([])
            setProductPresentation([])
        }        
    }
    const onSelectProducts = async(items) => {
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

        items.map(pharmaceuticalFormItem => {
            if(pharmaceuticalFormItem.checked) {                
                let pharmaceuticalForm = getItemObject(pharmaceuticalFormItem)
                pharmaceuticalFormCodes.push(pharmaceuticalForm.code)
            }
        })
        setPharmaceuticalFormSelected(itemsChecked)
        if(pharmaceuticalFormCodes.length > 0) {
            await getProductPresentationsByPharmaceuticalForm(pharmaceuticalFormCodes)
        } else {
            setProductPresentation([])
        }        
    }
    const onSelectProductPresentation = async(items) => {
        let productPresentationCodes = []
        let itemsChecked = items.filter(x => x.checked === true);

        items.map(productPresentationItem => {
            if(productPresentationItem.checked) {
                let productPresentation = getItemObject(productPresentationItem)
                if (productPresentation.code) {
                    productPresentationCodes.push(productPresentation.code)
                } else if (productPresentation.productPresentationGroupCode) {
                    productPresentationCodes.push(productPresentation.productPresentationGroupCode)
                }
            }
        })
        setProductPresentationSelected(itemsChecked)
           
    }
    const closeDialog = async() => {
        setFormHasBeenSubmited(false)
        setMarketAssignType('')
        setMarketAssignItems([])
        setDialogVisibleForProducts(false)
        setDialogVisibleForPresentation(false)
        setDialogVisibleForMarketAssing(false)
    }

    const submitForm = React.useCallback(
        () => {
            setFormHasBeenSubmited(true)
        },
        []
    );
    const onSelectItemFromMenu = (action) => {
        if(action == 'createProductGroup') {
            if(productsSelected.length > 0) {
                setMarketAssignType(action)
                setDialogVisibleForProducts(true)
            }
        } else if(action == 'createProductPresentationGroup') {
            if(presentationSelected.length > 0) {
                setMarketAssignType(action)
                setDialogVisibleForPresentation(true)
            }
        } else if(action == 'marketAssignFromTherapeuticalClass') {
            if(therapeuticalClassSelected.length > 0) {
                setMarketAssignType(action)
                setMarketAssignItems(therapeuticalClassSelected)
                setDialogVisibleForMarketAssing(true)
            }
        } else if(action == 'marketAssignFromProduct') {
            if(productsSelected.length > 0) {
                setMarketAssignType(action)
                setMarketAssignItems(productsSelected)
                setDialogVisibleForMarketAssing(true)
            }
        } else if(action == 'marketAssignFromPharmaceuticalForm') {
            if(pharmaceuticalFormSelected.length > 0) {
                setMarketAssignType(action)
                setMarketAssignItems(pharmaceuticalFormSelected)
                setDialogVisibleForMarketAssing(true)
            }
        } else if(action == 'marketAssignFromProductPresentation') {
            if(presentationSelected.length > 0){
                setMarketAssignType(action)
                setMarketAssignItems(presentationSelected)
                setDialogVisibleForMarketAssing(true)
            }
        }
    }

    const refreshVirtualizedCheckbox = async () => {

        closeDialog()
        
        if (marketAssignType == 'marketAssignFromTherapeuticalClass') {
            reloadTherapeuticalClassVirtualizedCheckbox()
        } else if(marketAssignType == 'marketAssignFromProduct' || marketAssignType == 'createProductGroup') {
            await reloadProductVirtualizedCheckbox()
        } else if(marketAssignType == 'marketAssignFromPharmaceuticalForm') {
            await reloadPharmaceuticalFormVirtualizedCheckbox()
        } else if(marketAssignType == 'marketAssignFromProductPresentation'  || marketAssignType == 'createProductPresentationGroup') {
            await reloadProductPresentationVirtualizedCheckbox()
        }

    }    

    return (
        <div style={{height:'350px'}}>
                <div style={{height:'350px'}}>
                    <Grid container spacing={1}>
                        <Grid item xs={3} className="pr-0">
                            <div style={{width:'100%', height:305, marginRight:0, paddingRight: 0}}>
                                <VirtualizedCheckbox
                                    items={therapeuticalclasses}
                                    isLoading={loadingTherapeuticalClasses}
                                    title={intl.formatMessage({id: "CUSTOM_MARKET_TAB.SEARCH.THERAPEUTICAL_CLASS"})}
                                    onChange={onSelectTherapeuticalClasses}
                                    onSelectAllChange={onSelectTherapeuticalClasses}
                                    onSelectItemFromMenu={onSelectItemFromMenu}
                                    options={[
                                        {title: intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.ASSIGN_CUSTOM_MARKET"}), action:'marketAssignFromTherapeuticalClass'}
                                    ]}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={3} className="pr-0">
                            <div style={{width:'100%', height:305, marginRight:0, paddingRight: 0}}>
                                <VirtualizedCheckbox
                                    items={products}
                                    isLoading={loadingTherapeuticalClasses || loadingProducts}
                                    title={intl.formatMessage({id: "CUSTOM_MARKET_TAB.SEARCH.PRODUCT"})}
                                    onChange={onSelectProducts}
                                    onSelectAllChange={onSelectProducts}
                                    onSelectItemFromMenu={onSelectItemFromMenu}
                                    options={[
                                        {title: intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.CREATE_GROUP"}), action:'createProductGroup'},
                                        {title: intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.ASSIGN_CUSTOM_MARKET"}), action:'marketAssignFromProduct'}
                                    ]}
                                    />
                            </div>
                            
                        </Grid>
                        <Grid item xs={3} className="pr-0">
                            <div style={{width:'100%', height:305, marginRight:0, paddingRight: 0}}>
                                <VirtualizedCheckbox
                                    items={pharmaceuticalForms}
                                    isLoading={loadingTherapeuticalClasses || loadingProducts || loadingPharmaceuticalForms}
                                    title={intl.formatMessage({id: "CUSTOM_MARKET_TAB.SEARCH.PHARMACEUTICAL_FORM"})}
                                    onChange={onSelectPharmaceuticalForms}
                                    onSelectAllChange={onSelectPharmaceuticalForms}
                                    onSelectItemFromMenu={onSelectItemFromMenu}
                                    options={[
                                        {title: intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.ASSIGN_CUSTOM_MARKET"}), action:'marketAssignFromPharmaceuticalForm'}
                                    ]}
                                />
                            </div>
                            
                        </Grid>
                        <Grid item xs={3} className="pr-0">
                            <div style={{width:'100%', height:305, marginRight:0, paddingRight: 0}}>
                                <VirtualizedCheckbox
                                    items={productPresentation}
                                    isLoading={loadingTherapeuticalClasses || loadingProducts || loadingPharmaceuticalForms || loadingProductPresentation}
                                    title={intl.formatMessage({id: "CUSTOM_MARKET_TAB.SEARCH.PRODUCT_PRESENTATION"})}
                                    onSelectItemFromMenu={onSelectItemFromMenu}
                                    options={[
                                        {title: intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.CREATE_GROUP"}), action: 'createProductPresentationGroup'},
                                        {title: intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.ASSIGN_CUSTOM_MARKET"}), action:'marketAssignFromProductPresentation'}
                                    ]}
                                    onChange={onSelectProductPresentation}
                                />
                            </div>
                        </Grid>
                    </Grid>

                    <ActionTabDialog
                        title={intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.CREATE_GROUP.PRODUCT"})}
                        onAccept={submitForm}
                        onCancel={()=> setDialogVisibleForProducts(false)}
                        btnDisabled={() => console.log('')}
                        isLoading={formLoading}
                        visible={dialogVisibleForProducts}
                    >
                        <ProductForm  
                            formHasBeenSubmited={formHasBeenSubmited} 
                            onChangeStatusForm={() => setFormHasBeenSubmited(false)}  
                            productsSelected={productsSelected} 
                            onChangeLoadingForm={(loading) => setFormLoading(loading)}
                            onClose={() => refreshVirtualizedCheckbox()}
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
                            productPresentationSelected={presentationSelected} 
                            onChangeLoadingForm={(loading) => setFormLoading(loading)}
                            onClose={() => refreshVirtualizedCheckbox()}
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
                            onClose={() => refreshVirtualizedCheckbox()}
                        />
                    </ActionTabDialog>
                </div>
        </div>
    )
    
}

function mapStateToProps(state) {
    return { 
        customMarket: state.mercados.customMarket,
        therapeuticalclasses: state.mercados.therapeuticalclasses,
        loadingTherapeuticalClasses: state.mercados.loadingTherapeuticalClasses
      }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

function getItemObject(item) {
    return JSON.parse(atob(item.value))
}

export default injectIntl(connect(mapStateToProps,mapDispatchToProps)(TherapeuticalClassTabContainer));    