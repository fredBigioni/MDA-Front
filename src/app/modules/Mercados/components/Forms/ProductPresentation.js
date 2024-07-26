import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from '../../_redux/mercadosActions';
import { ListItem,ListItemText, TextField } from '@material-ui/core'
import { FixedSizeList } from 'react-window';

import { useFormik } from 'formik';
import { useStyles } from '../../../../Style/GeneralStyles';


const ProductPresentationForm = (props) => {

    const { productPresentationSelected, formHasBeenSubmited, onChangeStatusForm } = props;
    const classes = useStyles();

    const detectFormSubmited = () => {
        if(formHasBeenSubmited) {
            formikCreateProduct.handleSubmit();
            onChangeStatusForm();
        }
    }
    React.useEffect(() => {

        detectFormSubmited()

        return () => {}
        
    }, [formHasBeenSubmited])


    const prepareProductPresentationToSave = ({description}) => {
        
        let t = []
        productPresentationSelected.map(x => {
            let productPresentation = getItemObject(x)
            if (productPresentation.code) {
                t.push(productPresentation.code)
            }
        })
        return JSON.stringify({description: description, ProductPresentationCodes: t})
        
    }
    const validateProduct = values => {
        const errors = {};
        if (!values.description) {
          errors.description = 'campo obligatorio';
        }

        if (productPresentationSelected.some(x => x.isGroup == true)) {
            errors.api = 'No es posible crear un grupo de presentaciones con elementos de tipo grupo'
        }
      
        return errors;
    };
    const formikCreateProduct = useFormik({
        initialValues: {
          description: '',
        },
        validate: validateProduct,
        onSubmit: async(values) => {

            props.onChangeLoadingForm(true)
            setTimeout(() => {
                let productPresentationGroupToSave = prepareProductPresentationToSave(values)
                props.createProductPresentationGroup(productPresentationGroupToSave)
                    .then(() => {
                        props.onChangeLoadingForm(false)
                        props.onClose()
                    })
                    .catch((e) => {
                        console.error(e)
                        props.onChangeLoadingForm(false)
                        //setSubmitting(false);
                    });
            }, 1000);
        },
    });

    const renderProductsRow = (props) => {
        const { index, style } = props;
      
        return (
          <ListItem button style={style} key={index}>
            <span className={ (productPresentationSelected[index].isGroup == true) ? "text-danger" : ""}>
                {productPresentationSelected[index].label }
                { productPresentationSelected[index].isGroup == true &&
                    <span className="text-danger pl-4" key={productPresentationSelected[index].value}><strong>&#8859;</strong></span>
                }
            </span>            
          </ListItem>
        );
    }

    return (
        <form onSubmit={formikCreateProduct.handleSubmit}>
            <TextField
                className={`mb-4`}
                fullWidth
                autoComplete='off'
                name="description"
                label="Descripción"
                type='text'
                onChange={formikCreateProduct.handleChange}
                value={formikCreateProduct.values.description}
                error={formikCreateProduct.touched.description && Boolean(formikCreateProduct.errors.description)}
                helperText={formikCreateProduct.touched.description && formikCreateProduct.errors.description}                
            />
            <div>
                <span>Seleccionados</span>
                <div className={[classes.root, 'mb-10']}>
                    <FixedSizeList height={200} width={'100%'} itemSize={30} itemCount={productPresentationSelected.length}>
                        {renderProductsRow}
                    </FixedSizeList>
                </div>
            </div> 
            {formikCreateProduct.errors.api &&
                <div className="MuiFormLabel-root Mui-error text-left pl-0 pt-7" style={{width: '100%'}}>{formikCreateProduct.errors.api}</div>
            }            
        </form>
    )
}

function getItemObject(item) {
    return JSON.parse(atob(item.value))
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

export default connect(null,mapDispatchToProps)(ProductPresentationForm);