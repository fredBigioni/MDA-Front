import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from '../../_redux/mercadosActions';
import { useFormik } from 'formik'
import { List,ListItem,ListItemText, TextField, Grid,  } from '@material-ui/core'
import { FixedSizeList } from 'react-window';
import { useStyles } from '../../../../Style/GeneralStyles';


const DrugForm = (props) => {

    const { drugSelecteds, formHasBeenSubmited, onChangeStatusForm } = props;
    const classes = useStyles();

    const detectFormSubmited = () => {
        if(formHasBeenSubmited) {
            formikCreateDrug.handleSubmit();
            onChangeStatusForm();
        }
    }

    React.useEffect(() => {

        detectFormSubmited()

        return () => {}
        
    }, [formHasBeenSubmited])

    const prepareDrugToSave = ({description}) => {
        
        let t = []
        drugSelecteds.map(x => {
            let drug = getItemObject(x)
            t.push(drug.drugCode)
        })
        return JSON.stringify({description: description, drugCodes: t})
        
    }
    const validateDrug = values => {
        const errors = {};
        if (!values.description) {
          errors.description = 'campo obligatorio';
        }

        if (drugSelecteds.some(x => x.isGroup == true)) {
            errors.api = 'No es posible crear un grupo de drogas con elementos de tipo grupo'
        }                
      
        return errors;
    };
    const formikCreateDrug = useFormik({
        initialValues: {
          description: '',
        },
        validate: validateDrug,
        onSubmit: async(values) => {
            props.onChangeLoadingForm(true)
            setTimeout(() => {
                let drugsGroupToSave = prepareDrugToSave(values)
                props.createDrugGroup(drugsGroupToSave)
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
    

    const renderDrugsRow = (props) => {
        const { index, style } = props;
      
        return (
          <ListItem button style={style} key={index}>
            <span className={ (drugSelecteds[index].isGroup == true) ? "text-danger" : ""}>
                {drugSelecteds[index].label }
                { drugSelecteds[index].isGroup == true &&
                    <span className="text-danger pl-4" key={drugSelecteds[index].value}><strong>&#8859;</strong></span>
                }
            </span>                                  
          </ListItem>
        );
    }
    return (
        <form onSubmit={formikCreateDrug.handleSubmit}>
            <TextField
                className={`mb-4`}
                fullWidth
                autoComplete='off'
                name="description"
                label="Descripción"
                type='text'
                onChange={formikCreateDrug.handleChange}
                value={formikCreateDrug.values.description}
                error={formikCreateDrug.touched.description && Boolean(formikCreateDrug.errors.description)}
                helperText={formikCreateDrug.touched.description && formikCreateDrug.errors.description}
            />
            <div>
                <span>Seleccionados</span>
                <div className={[classes.root, 'mb-10']}>
                    <FixedSizeList height={200} width={'100%'} itemSize={30} itemCount={drugSelecteds.length}>
                        {renderDrugsRow}
                    </FixedSizeList>
                </div>
            </div> 
            {formikCreateDrug.errors.api &&
                <div className="MuiFormLabel-root Mui-error text-left pl-0 pt-7" style={{width: '100%'}}>{formikCreateDrug.errors.api}</div>
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
      }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(DrugForm);