import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from '../_redux/mercadosActions';
import { injectIntl } from "react-intl";
import { Grid } from '@material-ui/core'
import VirtualizedCheckbox from '../../../components/ListCheckbox'
import { MarketAssignForm, DrugForm, ProductForm, ProductPresentationForm, LaboratoryForm } from './Forms'
import ActionTabDialog from './ActionTabDialog'
import { useStyles } from '../../../Style/GeneralStyles';

const DrugabContainer = (props) => {
    const clases = useStyles()
    const { intl, customMarket, drugs, loadingDrugs } = props
    const [ formLoading, setFormLoading ] = React.useState(false)
    const [ formHasBeenSubmited, setFormHasBeenSubmited ] = React.useState(false)
    const [ loadingProducts, setLoadingProducts] = React.useState(false);
    const [ products, setProducts ] = React.useState([])
    const [ loadingPharmaceuticalForms, setLoadingPharmaceuticalForms] = React.useState(false);
    const [ pharmaceuticalForms, setPharmaceuticalForms ] = React.useState([])
    const [ loadingProductPresentation, setLoadingProductPresentation] = React.useState(false);
    const [ productPresentation, setProductPresentation ] = React.useState([])
    const [ drugSelecteds, setDrugSelecteds] = React.useState([])
    const [ dialogVisibleForDrugs, setDialogVisibleForDrugs ] = React.useState(false);
    const [ productSelecteds, setProductSelecteds] = React.useState([])
    const [ dialogVisibleForProducts, setDialogVisibleForProducts ] = React.useState(false);
    const [ dialogVisibleForPresentation , setDialogVisibleForPresentation] = React.useState(false)
    const [ productPresentationSelecteds, setProductPresentationSelecteds ] = React.useState([])
    const [ pharmaceuticalFormSelecteds, setPharmaceuticalFormsSelecteds ] = React.useState([])
    const [ marketAssignType, setMarketAssignType ] = React.useState('')
    const [ marketAssignItems, setMarketAssignItems ] = React.useState([])
    const [ dialogVisibleForMarketAssing, setDialogVisibleForMarketAssing ] = React.useState(false);

    const getAllDrugs = async(itemsChecked) => {
        await props.getDrugs(itemsChecked);
    }

    React.useEffect(() => {
        return () => {
            reloadDrugVirtualizedCheckbox()
          }
    },[customMarket.data?.code])

    React.useEffect(() => {
        if (!drugs) {
            getAllDrugs(null)
        }

    },[])

    React.useEffect(() => {
        getPharmaceuticalFormByProduct()
     }, [products]);      
     
    React.useEffect(() => {
        getProductPresentationsByPharmaceuticalForm()
    }, [pharmaceuticalForms]);           

    const reloadDrugVirtualizedCheckbox = () => {
        props.dispatchDrugsLoading(true)
        if (drugs) {
            let drugsAllUnchecked = drugs.map(d => ({ ...d, checked: false }));
            props.dispatchDrugs(drugsAllUnchecked)
            onSelectDrugs([])
            onSelectProducts([])
            onSelectPharmaceuticalForms([])
            onSelectProductPresentation([])
        }
        props.dispatchDrugsLoading(false)        
    }

    const reloadProductVirtualizedCheckbox = async () => {

        setProductSelecteds([])
        setPharmaceuticalFormsSelecteds([])
        setProductPresentationSelecteds([])


        let drugCodes = []
        let drugGroupCodes = []

        drugSelecteds.map(drugItem => {
            if(drugItem.checked) {                
                let drug = getItemObject(drugItem)
                if (drug.drugCode) {
                    drugCodes.push(drug.drugCode)
                } else if (drug.drugGroupCode) {
                    drugGroupCodes.push(drug.drugGroupCode)
                }
    
            }
        })

        await getProductByDrug(drugCodes, drugGroupCodes, true)
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

        pharmaceuticalFormSelecteds.map(pharmaceuticalFormItem => {
            let pharmaceuticalForm = getItemObject(pharmaceuticalFormItem)
            pharmaceuticalFormCodes.push(pharmaceuticalForm.code)
        })
        
        await getProductPresentationsByPharmaceuticalForm(pharmaceuticalFormCodes, true)
    } 


    const closeDialog = () => {
        setMarketAssignItems([])
        setMarketAssignType('')
        setFormHasBeenSubmited(false)
        setDialogVisibleForDrugs(false)
        setDialogVisibleForProducts(false)
        setDialogVisibleForPresentation(false)
        setDialogVisibleForMarketAssing(false)
    }

    const getProductByDrug = async (drugCodes, drugGroupCodes, resetChecked = false) => {
        setLoadingProducts(true)
        let productPreviousSelecteds = !resetChecked ? products.filter(x => x.checked ==true) : []
        await props.getProductByDrug(drugCodes.join(','), drugGroupCodes.join(',')) 
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

    const onSelectDrugs = async(items) => {
        let drugCodes = []
        let drugGroupCodes = []
        let itemsChecked = items.filter(x => x.checked === true); 

        items.map(drugItem => {
            if(drugItem.checked) {                
                let drug = getItemObject(drugItem)
                if (drug.drugCode) {
                    drugCodes.push(drug.drugCode)
                } else if (drug.drugGroupCode) {
                    drugGroupCodes.push(drug.drugGroupCode)
                }
    
            }
        })
        setDrugSelecteds(itemsChecked)
        if(drugCodes.length > 0  || drugGroupCodes.length > 0) {
            await getProductByDrug(drugCodes, drugGroupCodes)
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

    const submitForm = React.useCallback(
        () => {
            setFormHasBeenSubmited(true)
        },
        []
    )

    const onSelectItemFromMenu = (action) => {
        if(action == 'createDrugGroup') {
            if(drugSelecteds.length > 0) {
                setMarketAssignType(action)
                setDialogVisibleForDrugs(true)
            }
        } else if(action == 'marketAssignFromDrug') {
            if(drugSelecteds.length > 0) {
                setMarketAssignItems(drugSelecteds)
                setMarketAssignType(action)
                setDialogVisibleForMarketAssing(true)
            }
        } else if(action == 'marketAssignFromProduct') {
            if(productSelecteds.length > 0) {
                setMarketAssignItems(productSelecteds)
                setMarketAssignType(action)
                setDialogVisibleForMarketAssing(true)
            }
        } else  if(action == 'createProductGroup') {
            if(productSelecteds.length > 0) {
                setMarketAssignType(action)
                setDialogVisibleForProducts(true)
            }
        } else if(action == 'marketAssignFromPharmaceuticalForm') {
            if(pharmaceuticalFormSelecteds.length > 0) {
                setMarketAssignType(action)
                setMarketAssignItems(pharmaceuticalFormSelecteds)
                setDialogVisibleForMarketAssing(true)
            }
        } else if(action == 'createPresentationGroup') {
            if(productPresentationSelecteds.length > 0) {
                setMarketAssignType(action)
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
        
        if (marketAssignType == 'marketAssignFromDrug') {
            reloadDrugVirtualizedCheckbox()
        } else if (marketAssignType == 'createDrugGroup') {
            reloadDrugVirtualizedCheckbox()
            await getAllDrugs(null)
        } else if(marketAssignType == 'marketAssignFromProduct' || marketAssignType == 'createProductGroup') {
            await reloadProductVirtualizedCheckbox()
        } else if(marketAssignType == 'marketAssignFromPharmaceuticalForm') {
            await reloadPharmaceuticalFormVirtualizedCheckbox()
        } else if(marketAssignType == 'marketAssignFromProductPresentation'  || marketAssignType == 'createPresentationGroup') {
            await reloadProductPresentationVirtualizedCheckbox()
        }

    }      
    
    return (
        <div style={{height:'350px'}}>
                <div style={{height:'350px'}}>
                    <Grid container spacing={1}>
                        <Grid item xs={9} className="pr-0">
                            <div style={{width:'100%', height:305, marginRight:0, paddingRight: 0}}>
                                <VirtualizedCheckbox
                                    items={drugs}
                                    isLoading={loadingDrugs}
                                    title={intl.formatMessage({id: "CUSTOM_MARKET_TAB.SEARCH.DRUG"})}
                                    onChange={onSelectDrugs}
                                    onSelectAllChange={onSelectDrugs}
                                    onSelectItemFromMenu={onSelectItemFromMenu}
                                    options={[
                                        {title: intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.CREATE_GROUP"}), action:'createDrugGroup'},
                                        {title: intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.ASSIGN_CUSTOM_MARKET"}), action:'marketAssignFromDrug'}
                                    ]}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={3} className="pr-0">
                            <div style={{width:'100%', height:305, marginRight:0, paddingRight: 0}}>
                                <VirtualizedCheckbox
                                    items={products}
                                    isLoading={loadingDrugs || loadingProducts}
                                    title={intl.formatMessage({id: "CUSTOM_MARKET_TAB.SEARCH.PRODUCT"})}
                                    onSelectItemFromMenu={onSelectItemFromMenu}
                                    options={[
                                        {title: intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.CREATE_GROUP"}), action:'createProductGroup'},
                                        {title: intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.ASSIGN_CUSTOM_MARKET"}), action: 'marketAssignFromProduct'}
                                    ]}
                                    onChange={onSelectProducts}
                                    onSelectAllChange={onSelectProducts}
                                />
                            </div>
                            
                        </Grid>
                        <Grid item xs={0} className="pr-0">
                            <div style={{width:'100%', height:305, marginRight:0, paddingRight: 0, display:'none'}}>}}>
                                <VirtualizedCheckbox
                                    items={pharmaceuticalForms}
                                    isLoading={loadingDrugs || loadingProducts || loadingPharmaceuticalForms}
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
                        <Grid item xs={0} className="pr-0">
                            <div style={{width:'100%', height:305, marginRight:0, paddingRight: 0, display:'none'}}>
                                <VirtualizedCheckbox
                                    items={productPresentation}
                                    isLoading={loadingDrugs || loadingProducts || loadingPharmaceuticalForms || loadingProductPresentation}
                                    title={intl.formatMessage({id: "CUSTOM_MARKET_TAB.SEARCH.PRODUCT_PRESENTATION"})}
                                    onSelectItemFromMenu={onSelectItemFromMenu}
                                    options={[
                                        {title: intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.CREATE_GROUP"}), action: 'createPresentationGroup'},
                                        {title: intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.ASSIGN_CUSTOM_MARKET"}), action: 'marketAssignFromProductPresentation',}
                                    ]}
                                    onChange={onSelectProductPresentation}
                                />
                            </div>
                        </Grid>
                    </Grid>

                    <ActionTabDialog
                        title={intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.CREATE_GROUP.DRUG"})}
                        onAccept={submitForm}
                        onCancel={()=> setDialogVisibleForDrugs(false)}
                        btnDisabled={() => console.log('')}
                        isLoading={formLoading}
                        visible={dialogVisibleForDrugs}
                    >
                        <DrugForm 
                            formHasBeenSubmited={formHasBeenSubmited} 
                            onChangeStatusForm={() => setFormHasBeenSubmited(false)}
                            drugSelecteds={drugSelecteds} 
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
      drugs: state.mercados.drugs,
      loadingDrugs: state.mercados.loadingDrugs
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

function getItemObject(item) {
    return JSON.parse(atob(item.value))
}

export default injectIntl(connect(mapStateToProps,mapDispatchToProps)(DrugabContainer));