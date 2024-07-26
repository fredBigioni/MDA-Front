import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from '../_redux/mercadosActions';
import { injectIntl } from "react-intl";
import { Grid } from '@material-ui/core'
import VirtualizedCheckbox from '../../../components/ListCheckbox'
import ActionTabDialog from './ActionTabDialog'
import { MarketAssignForm, ProductForm, ProductPresentationForm, LaboratoryForm } from './Forms'
import { useStyles } from '../../../Style/GeneralStyles';
import _ from 'lodash'

const LaboratoryTabContainer = (props) => {
    const clases = useStyles()
    const { intl, customMarket, laboratories, loadingLaboratories } = props

    const [ loadingProducts, setLoadingProducts] = React.useState(false);
    const [ formLoading, setFormLoading ] = React.useState(false)
    const [ products, setProducts ] = React.useState([])
    const [ formHasBeenSubmited, setFormHasBeenSubmited ] = React.useState(false)
    const [ loadingPharmaceuticalForms, setLoadingPharmaceuticalForms] = React.useState(false);
    const [ pharmaceuticalForms, setPharmaceuticalForms ] = React.useState([])
    const [ loadingProductPresentation, setLoadingProductPresentation] = React.useState(false);
    const [ productPresentation, setProductPresentation ] = React.useState([])
    const [ dialogVisibleForLaboratory, setDialogVisibleForLaboratory ] = React.useState(false);
    const [ laboratoriesSelecteds, setLaboratoriesSelecteds] = React.useState([])
    const [ dialogVisibleForProducts, setDialogVisibleForProducts ] = React.useState(false);
    const [ dialogVisibleForMarketAssing, setDialogVisibleForMarketAssing ] = React.useState(false);
    const [ productSelecteds, setProductSelecteds] = React.useState([])
    const [ dialogVisibleForPresentation , setDialogVisibleForPresentation] = React.useState(false)
    const [ pharmaceuticalFormsSelecteds, setPharmaceuticalFormsSelecteds ] = React.useState([])
    const [ productPresentationSelecteds, setProductPresentationSelecteds ] = React.useState([])
    const [ marketAssignType, setMarketAssignType ] = React.useState('')
    const [ marketAssignItems, setMarketAssignItems ] = React.useState([])

    const getAllLaboratories = async(itemsChecked) => {
        await props.getLaboratories(itemsChecked);
    }

    React.useEffect(() => {
        return () => {
            reloadLaboratoryVirtualizedCheckbox()
          }
    },[customMarket.data?.code])

    React.useEffect(() => {
        if (!laboratories) {
            getAllLaboratories(null)
        }
    },[])

    React.useEffect(() => {
        getPharmaceuticalFormByProduct()
     }, [products]);         

    React.useEffect(() => {
        getProductPresentationsByPharmaceuticalForm()
    }, [pharmaceuticalForms]);       

    const reloadLaboratoryVirtualizedCheckbox = () => {
        props.dispatchLaboratoriesLoading(true)
            if (laboratories) {
                let laboratoriesAllUnchecked = laboratories.map(l => ({ ...l, checked: false }));
                props.dispatchLaboratories(laboratoriesAllUnchecked)
                onSelectLaboratories([])
                onSelectProducts([])
                onSelectPharmaceuticalForms([])
                onSelectProductPresentation([])
            }
            props.dispatchLaboratoriesLoading(false)
    }

    const reloadProductVirtualizedCheckbox = async () => {

        setProductSelecteds([])
        setPharmaceuticalFormsSelecteds([])
        setProductPresentationSelecteds([])

        let laboratoryCodes = []
        let laboratoryGroupCodes = []
        

        laboratoriesSelecteds.map(laboratoryItem => {
            if(laboratoryItem.checked) {                
                let laboratory = getItemObject(laboratoryItem)
                if (laboratory.laboratoryCode) {
                    laboratoryCodes.push(laboratory.laboratoryCode)
                } else if (laboratory.laboratoryGroupCode) {
                    laboratoryGroupCodes.push(laboratory.laboratoryGroupCode)
                }
            }
        })
        
        await getProductByLaboratory(laboratoryCodes, laboratoryGroupCodes, true)
    }

    const reloadPharmaceuticalFormVirtualizedCheckbox = async () => {
        setPharmaceuticalFormsSelecteds([])
        setProductPresentationSelecteds([])
        let productsCodes = []
        let productGroupsCodes = []

        productSelecteds.map(productItem => {               
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
        
        setProductPresentationSelecteds([])
        let pharmaceuticalFormCodes = []

        pharmaceuticalFormsSelecteds.map(pharmaceuticalFormItem => {
            let pharmaceuticalForm = getItemObject(pharmaceuticalFormItem)
            pharmaceuticalFormCodes.push(pharmaceuticalForm.code)
        })
        
        await getProductPresentationsByPharmaceuticalForm(pharmaceuticalFormCodes, true)
    } 

    const getProductByLaboratory = async (laboratoryCodes, laboratoryGroupCodes, resetChecked = false) => {
        setLoadingProducts(true)
        let productPreviousSelecteds = !resetChecked ? products.filter(x => x.checked ==true) : []
        await props.getProductByLaboratory(laboratoryCodes.join(','), laboratoryGroupCodes.join(',')) 
            .then(async (productsResponse) => {
                let products = productsResponse.map(product => {
                    if (productPreviousSelecteds.some(x => x.value == product.value)) {
                        product.checked = true
                    }
                    return product
                })            
                setProducts(products)
                setProductSelecteds(products.filter(x => x.checked === true))
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
                setPharmaceuticalFormsSelecteds([])
                setProductPresentation([])
                setProductPresentationSelecteds([])
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
                setPharmaceuticalFormsSelecteds(pharmaceuticalforms.filter(x => x.checked === true))
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
                setProductPresentationSelecteds([])
                return
            }
        }

        setLoadingProductPresentation(true)

        let productCodes = productSelecteds.map(productItem => {               
            return getItemObject(productItem).productCode || null
        })
        productCodes = productCodes.filter(p => p !== null)

        let productGroupCodes = productSelecteds.map(productItem => {               
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
                setProductPresentationSelecteds(productPresentations.filter(x => x.checked === true))
                setLoadingProductPresentation(false)
        })    
    }

    const onSelectLaboratories = async(items) => {
        let laboratoryCodes = []
        let laboratoryGroupCodes = []
        
        let itemsChecked = items.filter(x => x.checked === true);

        itemsChecked.map(laboratoryItem => {
            if(laboratoryItem.checked) {                
                let laboratory = getItemObject(laboratoryItem)
                if (laboratory.laboratoryCode) {
                    laboratoryCodes.push(laboratory.laboratoryCode)
                } else if (laboratory.laboratoryGroupCode) {
                    laboratoryGroupCodes.push(laboratory.laboratoryGroupCode)
                }
            }
        })
        setLaboratoriesSelecteds(itemsChecked)
        if(laboratoryCodes.length > 0  || laboratoryGroupCodes.length > 0) {
            await getProductByLaboratory(laboratoryCodes, laboratoryGroupCodes)
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
        setProductSelecteds(itemsChecked)
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
        setPharmaceuticalFormsSelecteds(itemsChecked)
        if(pharmaceuticalFormCodes.length > 0) {
            await getProductPresentationsByPharmaceuticalForm(pharmaceuticalFormCodes)
        } else {
            setProductPresentation([])
        }        
    }

    const onSelectProductPresentation = async(items) => {
        let itemsChecked = items.filter(x => x.checked === true);

        setProductPresentationSelecteds(itemsChecked)
    }

    const onSelectItemFromMenu = (action) => {
        if(action == 'marketAssignFromProduct') {
            if(productSelecteds.length > 0) {
                setMarketAssignType(action)
                setMarketAssignItems(productSelecteds)
                setDialogVisibleForMarketAssing(true)
            }
        } else if(action == 'createLaboratoryGroup') {
            if(laboratoriesSelecteds.length > 0) {
                setMarketAssignType(action)
                setDialogVisibleForLaboratory(true)
            }
        } else if(action == 'marketAssignFromLaboratory') {
            if(laboratoriesSelecteds.length > 0) {
                setMarketAssignType(action)
                setMarketAssignItems(laboratoriesSelecteds)
                setDialogVisibleForMarketAssing(true)
            }
        } else if(action == 'createProductGroup') {
            if(productSelecteds.length > 0) {
                setMarketAssignType(action)
                setDialogVisibleForProducts(true)
            }
        } else if(action == 'marketAssignFromPharmaceuticalForm') {
            if(pharmaceuticalFormsSelecteds.length > 0) {
                setMarketAssignType(action)
                setMarketAssignItems(pharmaceuticalFormsSelecteds)
                setDialogVisibleForMarketAssing(true)
            }
        } else if(action == 'createProductPresentationGroup') {
            if(productPresentationSelecteds.length > 0) {
                setDialogVisibleForPresentation(true)
            }
        } else if(action == 'marketAssignFromProductPresentation') {
            if(productPresentationSelecteds.length > 0) {
                setMarketAssignType(action)
                setMarketAssignItems(productPresentationSelecteds)
                setDialogVisibleForMarketAssing(true)
            }
        }
    }
    
    const refreshVirtualizedCheckbox = async () => {

        closeDialog()
        
        if (marketAssignType == 'marketAssignFromLaboratory') {
            reloadLaboratoryVirtualizedCheckbox()
        } else if (marketAssignType == 'createLaboratoryGroup') {
            reloadLaboratoryVirtualizedCheckbox()
            await getAllLaboratories(null)
        } else if(marketAssignType == 'marketAssignFromProduct' || marketAssignType == 'createProductGroup') {
            await reloadProductVirtualizedCheckbox()
        } else if(marketAssignType == 'marketAssignFromPharmaceuticalForm') {
            await reloadPharmaceuticalFormVirtualizedCheckbox()
        } else if(marketAssignType == 'marketAssignFromProductPresentation'  || marketAssignType == 'createProductPresentationGroup') {
            await reloadProductPresentationVirtualizedCheckbox()
        }

    }  
       
    const closeDialog = () => {
        setMarketAssignItems([])
        setMarketAssignType('')
        setFormHasBeenSubmited(false)
        setDialogVisibleForLaboratory(false)
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

    
    return (
        <div style={{height:'350px'}}>
                <div style={{height:'350px'}}>
                    <Grid container spacing={1}>
                        <Grid item xs={2} className="pr-0">
                            <div style={{width:'100%', height:305, marginRight:0, paddingRight: 0}}>
                                <VirtualizedCheckbox
                                    items={laboratories}
                                    isLoading={loadingLaboratories}
                                    title={intl.formatMessage({id: "CUSTOM_MARKET_TAB.SEARCH.LABORATORY"})}
                                    onChange={onSelectLaboratories}
                                    onSelectItemFromMenu={onSelectItemFromMenu}
                                    options={[
                                        {title: intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.CREATE_GROUP"}), action:'createLaboratoryGroup'},
                                        {title: intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.ASSIGN_CUSTOM_MARKET"}), action: 'marketAssignFromLaboratory'}
                                    ]}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={3} className="pr-0">
                            <div style={{width:'100%', height:305, marginRight:0, paddingRight: 0}}>
                                <VirtualizedCheckbox
                                    items={products}
                                    isLoading={loadingLaboratories || loadingProducts}
                                    title={intl.formatMessage({id: "CUSTOM_MARKET_TAB.SEARCH.PRODUCT"})}
                                    onChange={onSelectProducts}
                                    onSelectItemFromMenu={onSelectItemFromMenu}
                                    options={[
                                        {title: intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.CREATE_GROUP"}), action:'createProductGroup'},
                                        {title: intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.ASSIGN_CUSTOM_MARKET"}), action: 'marketAssignFromProduct'}
                                    ]}
                                    onSelectAllChange={onSelectProducts}
                                />
                            </div>
                            
                        </Grid>
                        <Grid item xs={3} className="pr-0">
                            <div style={{width:'100%', height:305, marginRight:0, paddingRight: 0}}>
                                <VirtualizedCheckbox
                                    items={pharmaceuticalForms}
                                    isLoading={loadingLaboratories || loadingProducts || loadingPharmaceuticalForms}
                                    title={intl.formatMessage({id: "CUSTOM_MARKET_TAB.SEARCH.PHARMACEUTICAL_FORM"})}
                                    options={[
                                        {title: intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.ASSIGN_CUSTOM_MARKET"}), action: 'marketAssignFromPharmaceuticalForm',}
                                    ]}
                                    onSelectItemFromMenu={onSelectItemFromMenu}
                                    onChange={onSelectPharmaceuticalForms}
                                    onSelectAllChange={onSelectPharmaceuticalForms}
                                />
                            </div>
                            
                        </Grid>
                        <Grid item xs={4}>
                            <div style={{width:'100%', height:305, marginRight:0, paddingRight: 0}}>
                                <VirtualizedCheckbox
                                    items={productPresentation}
                                    isLoading={loadingLaboratories || loadingProducts || loadingPharmaceuticalForms || loadingProductPresentation}
                                    title={intl.formatMessage({id: "CUSTOM_MARKET_TAB.SEARCH.PRODUCT_PRESENTATION"})}
                                    options={[
                                        {title: intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.CREATE_GROUP"}), action:'createProductPresentationGroup'},
                                        {title: intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.ASSIGN_CUSTOM_MARKET"}), action: 'marketAssignFromProductPresentation'}
                                    ]}
                                    onSelectItemFromMenu={onSelectItemFromMenu}
                                    onChange={onSelectProductPresentation}
                                />
                            </div>
                        </Grid>
                    </Grid>

                    <ActionTabDialog
                        title={intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.CREATE_GROUP.LABORATORY"})}
                        onAccept={submitForm}
                        onCancel={()=> setDialogVisibleForLaboratory(false)}
                        btnDisabled={() => console.log('')}
                        isLoading={formLoading}
                        visible={dialogVisibleForLaboratory}
                    >
                        <LaboratoryForm
                            formHasBeenSubmited={formHasBeenSubmited} 
                            onChangeStatusForm={() => setFormHasBeenSubmited(false)}  
                            laboratoriesSelecteds={laboratoriesSelecteds} 
                            onChangeLoadingForm={(loading) => setFormLoading(loading)}
                            onClose={() => refreshVirtualizedCheckbox()}
                        />
                    </ActionTabDialog>
                    <ActionTabDialog
                        title={intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.ASSIGN_CUSTOM_MARKET"})}
                        onAccept={submitForm}
                        onCancel={()=> setDialogVisibleForMarketAssing(false)}
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
                            productsSelected={productSelecteds} 
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
                            productPresentationSelected={productPresentationSelecteds} 
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
      laboratories: state.mercados.laboratories,
      loadingLaboratories: state.mercados.loadingLaboratories
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

function getItemObject(item) {
    return JSON.parse(atob(item.value))
}

export default injectIntl(connect(mapStateToProps,mapDispatchToProps)(LaboratoryTabContainer));