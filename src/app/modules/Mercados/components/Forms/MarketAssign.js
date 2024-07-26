import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from '../../_redux/mercadosActions';
import { useFormik } from 'formik'
import { List,ListItem,ListItemText, TextField, Grid,  } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { FixedSizeList } from 'react-window';
import { customMarketDetailDefault } from '../../customMarketDetailDefault'
import { useStyles } from '../../../../Style/GeneralStyles';


const MarketAssignForm = (props) => {

    const { itemsSelecteds, customMarketGroups, formHasBeenSubmited, onChangeStatusForm, customMarketType } = props;
    const classes = useStyles();

    const detectFormSubmited = () => {
        if(formHasBeenSubmited) {
            formikAsignMarket.handleSubmit();
            onChangeStatusForm();
        }
    }

    React.useEffect(() => {

        detectFormSubmited()

        return () => {}
        
    }, [formHasBeenSubmited])

    const prepareToSaveCustomMarket = ({customMarketGroup}) => {        
        let copyCustomMarket = JSON.parse(JSON.stringify(props.customMarket.data))        

        itemsSelecteds.map(x => {
            if(customMarketType == 'marketAssignFromProduct') {
                let product = getItemObject(x)
                let customMarketDetailValues  = customMarketDetailDefault()
                if(product && product.productGroupCode) {
                    
                    customMarketDetailValues.productGroupCode = product.productGroupCode
                    customMarketDetailValues.customMarketGroupCode = customMarketGroup == -1 ? null : customMarketGroup
                    copyCustomMarket.customMarketDetail.push(customMarketDetailValues)
                }
                if(product && product.productCode) {
                    customMarketDetailValues.productCode = product.productCode
                    customMarketDetailValues.customMarketGroupCode = customMarketGroup == -1 ? null : customMarketGroup
                    copyCustomMarket.customMarketDetail.push(customMarketDetailValues)
                }
            }
            if(customMarketType == 'marketAssignFromPharmaceuticalForm') {
                let pharmaceuticalForm = getItemObject(x)
                let customMarketDetailValues  = customMarketDetailDefault()
                
                if(pharmaceuticalForm && pharmaceuticalForm.code) {
                    customMarketDetailValues.pharmaceuticalFormCode = pharmaceuticalForm.code
                    customMarketDetailValues.customMarketGroupCode = customMarketGroup == -1 ? null : customMarketGroup
                    copyCustomMarket.customMarketDetail.push(customMarketDetailValues)
                }

            }
            if(customMarketType == 'marketAssignFromProductPresentation') {
                let productPresentation = getItemObject(x)
                let customMarketDetailValues  = customMarketDetailDefault()

                if (productPresentation && productPresentation.code) {
                    customMarketDetailValues.productPresentationCode = productPresentation.code;
                    customMarketDetailValues.customMarketGroupCode = customMarketGroup == -1 ? null : customMarketGroup
                    copyCustomMarket.customMarketDetail.push(customMarketDetailValues)
                }
                
                if (productPresentation && productPresentation.productPresentationGroupCode) {
                    customMarketDetailValues.productPresentationGroupCode = productPresentation.productPresentationGroupCode;
                    customMarketDetailValues.customMarketGroupCode = customMarketGroup == -1 ? null : customMarketGroup
                    copyCustomMarket.customMarketDetail.push(customMarketDetailValues)
                }
                
            }
            if(customMarketType == 'marketAssignFromLaboratory') {
                let laboratory = getItemObject(x)
                let customMarketDetailValues  = customMarketDetailDefault()
                
                if(laboratory && laboratory.laboratoryGroupCode) {
                    customMarketDetailValues.laboratoryGroupCode = laboratory.laboratoryGroupCode
                    customMarketDetailValues.customMarketGroupCode = customMarketGroup == -1 ? null : customMarketGroup
                    copyCustomMarket.customMarketDetail.push(customMarketDetailValues)
                }
                if(laboratory && laboratory.laboratoryCode) {
                    customMarketDetailValues.laboratoryCode = laboratory.laboratoryCode
                    customMarketDetailValues.customMarketGroupCode = customMarketGroup == -1 ? null : customMarketGroup
                    copyCustomMarket.customMarketDetail.push(customMarketDetailValues)

                }
            }
            if(customMarketType == 'marketAssignFromDrug') {
                let drug = getItemObject(x)
                let customMarketDetailValues  = customMarketDetailDefault()

                if(drug && drug.drugCode) {
                    customMarketDetailValues.drugCode = drug.drugCode
                    customMarketDetailValues.customMarketGroupCode = customMarketGroup == -1 ? null : customMarketGroup
                    copyCustomMarket.customMarketDetail.push(customMarketDetailValues)
                }
                if(drug && drug.drugGroupCode) {
                    customMarketDetailValues.drugGroupCode = drug.drugGroupCode
                    customMarketDetailValues.customMarketGroupCode = customMarketGroup == -1 ? null : customMarketGroup
                    copyCustomMarket.customMarketDetail.push(customMarketDetailValues)
                }
                
            }
            if(customMarketType == 'marketAssignFromTherapeuticalClass') {
                let therapeuticalClass = getItemObject(x)
                let customMarketDetailValues  = customMarketDetailDefault()
                
                if(therapeuticalClass && therapeuticalClass.code) {
                    customMarketDetailValues.therapeuticalClassCode = therapeuticalClass.code
                    customMarketDetailValues.customMarketGroupCode = customMarketGroup == -1 ? null : customMarketGroup
                    copyCustomMarket.customMarketDetail.push(customMarketDetailValues)
                }
                
            }
            if(customMarketType == 'marketAssignFromMarkets') {
                let market = getItemObject(x)
                let customMarketDetailValues  = customMarketDetailDefault()
                if(market && market.code) {
                    customMarketDetailValues.detailCustomMarketCode = market.code
                    customMarketDetailValues.customMarketGroupCode = customMarketGroup == -1 ? null : customMarketGroup
                    copyCustomMarket.customMarketDetail.push(customMarketDetailValues)
                }
                
            }
        })

        return copyCustomMarket;
        
    }
    const validateAsignMarket = values => {
        const errors = {};
        if (!values.customMarketGroup) {
          errors.customMarketGroup = 'campo obligatorio';
        }
      
        return errors;
    };
    const formikAsignMarket = useFormik({
        initialValues: {
            customMarketGroup: -1,
        },
        validate: validateAsignMarket,
        onSubmit: (values, { setSubmitting, setErrors }) => {
            props.onChangeLoadingForm(true)
            setTimeout(async () => {
                try {
                    let customMarketToSave = prepareToSaveCustomMarket(values)
                    await props.updateCustomMarket(customMarketToSave)            
                    props.onChangeLoadingForm(false)
                    props.onClose()
                } catch (e) {
                    if (e.response && e.response.data && e.response.data.detailCustomMarketCode) {
                        let customMarketObjError = itemsSelecteds.filter(is =>  e.response.data.detailCustomMarketCode == getItemObject(is).code) 
                        if (customMarketObjError && customMarketObjError[0] && customMarketObjError[0].label) {
                            setErrors( {api: 'No se ha podido asignar el mercado: ' + customMarketObjError[0].label } )
                        } else {
                            setErrors( {api: "No se ha podido completar la acción"} )    
                        }
                    } else {
                        setErrors( {api: "No se ha podido completar la acción"} )
                    }
                    props.onChangeLoadingForm(false)
                } finally {
                    setSubmitting(false);
                }
            }, 1000);
        },
    });

    const renderProductsRow = (props) => {
        const { index, style } = props;
      
        return (
          <ListItem style={{...style, backgroundColor: 'rgb(160 158 158 / 4%)', borderBottom: '1px solid #423a3a'}} key={index}>
            <span>
                {itemsSelecteds[index].label }
                { itemsSelecteds[index].isGroup == true &&
                    <span className="text-primary pl-4" key={itemsSelecteds[index].value}><strong>&#8859;</strong></span>
                }
            </span>
          </ListItem>
        );
    }
    return (
        <form onSubmit={formikAsignMarket.handleSubmit}>
            <FormControl className={classes.formControl} style={{display: 'flow-root'}}>
                <label 
                    style={{fontSize: '14px'}}
                    className={(formikAsignMarket.touched.customMarketGroup && Boolean(formikAsignMarket.errors.customMarketGroup)) ? 'm-0 pf-10 pr-10 MuiFormLabel-root Mui-error' : 'm-0 pf-10 pr-10 pf-10' }>
                        Agrupación
                </label>
                <Select
                    id="customMarketGroup"
                    name='customMarketGroup'
                    value={formikAsignMarket.values.customMarketGroup}
                    onChange={formikAsignMarket.handleChange}
                    displayEmpty
                    style={{margin: '0px'}}
                    className={classes.selectEmpty}
                >
                <MenuItem key='default' value={-1}>SIN AGRUPACIÓN</MenuItem>
                {customMarketGroups && customMarketGroups.data && customMarketGroups.data.length > 0 && (customMarketGroups.data.map((cmg, index) => {
                    return (<MenuItem 
                                key={cmg.code} 
                                value={cmg.code}
                                className={(cmg.groupCondition == 'N') ? 'text-danger' : (cmg.groupCondition == 'A') ? 'text-primary' : ''}
                                >
                                <label className={(cmg.groupCondition == 'N') ? 'text-danger' : (cmg.groupCondition == 'A') ? 'text-primary' : ''}>
                                    {cmg.description.toUpperCase()}
                                </label>
                            </MenuItem>)
                    }))
                }
                </Select>
                {formikAsignMarket.touched.customMarketGroup && Boolean(formikAsignMarket.errors.customMarketGroup) &&
                    <p className="MuiFormHelperText-root Mui-error">{formikAsignMarket.touched.customMarketGroup && formikAsignMarket.errors.customMarketGroup}</p>
                }                    
            </FormControl>
            <div className="mt-10">
                <span style={{fontSize: '14px'}}>Seleccionados</span>
                <div className={[classes.root, 'mb-10']}>
                    <FixedSizeList height={200} width={'100%'} itemSize={30} itemCount={itemsSelecteds.length}>
                        {renderProductsRow}
                    </FixedSizeList>
                </div>
            </div> 
            {formikAsignMarket.errors.api &&
                <div className="MuiFormLabel-root Mui-error text-left pl-0 pt-7" style={{width: '100%'}}>{formikAsignMarket.errors.api}</div>
            }
        </form>   
    )
}

function getItemObject(item) {
    return JSON.parse(atob(item.value))
}

function mapStateToProps(state) {
    return { 
        mercados: state.mercados,
        customMarketGroups: state.mercados.customMarketGroups,
        customMarket: state.mercados.customMarket,
      }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(MarketAssignForm);