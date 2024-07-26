import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from '../../_redux/mercadosActions';
import { useFormik } from 'formik'
import { ListItem,ListItemText, TextField  } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { FixedSizeList } from 'react-window';
import { useStyles } from '../../../../Style/GeneralStyles';


const LaboratoryForm = (props) => {

    const { laboratoriesSelecteds,  formHasBeenSubmited, onChangeStatusForm } = props;
    const classes = useStyles();
                                                
    const detectFormSubmited = () => {
        if(formHasBeenSubmited) {
            formikCreateLaboratory.handleSubmit();
            onChangeStatusForm();
        }
    }

    React.useEffect(() => {

        detectFormSubmited()

        return () => {}
        
    }, [formHasBeenSubmited])

    const prepareSaveLaboratory = ({description, clase}) => {
        
        let t = []
        laboratoriesSelecteds.map(lab => {
            let laboratory = getItemObject(lab)
            if(laboratory && laboratory.laboratoryCode) {
                t.push(laboratory.laboratoryCode)
            }
        })
        return JSON.stringify({description, class: clase,  laboratoryCodes: t})
        
    }
    const validateLaboratory = values => {
        const errors = {};
        if (!values.description) {
          errors.description = 'campo obligatorio';
        }
      
        if (!values.clase) {
          errors.clase = 'campo obligatorio';
        }

        if (laboratoriesSelecteds.some(x => x.isGroup == true)) {
            errors.api = 'No es posible crear un grupo de laboratorios con elementos de tipo grupo'
        }        
      
        return errors;
    };
    const formikCreateLaboratory = useFormik({
        initialValues: {
          description: '',
          clase: ''
        },
        validate: validateLaboratory,
        onSubmit: async(values) => {
            props.onChangeLoadingForm(true)
            setTimeout(() => {
                let prepareLaboratory = prepareSaveLaboratory(values)
                props.createLaboratoryGroup(prepareLaboratory)
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

    const renderLaboratoriesRow = (props) => {
        const { index, style } = props;
      
        return (
          <ListItem button style={style} key={index}>
            <span className={ (laboratoriesSelecteds[index].isGroup == true) ? "text-danger" : ""}>
                {laboratoriesSelecteds[index].label }
                { laboratoriesSelecteds[index].isGroup == true &&
                    <span className="text-danger pl-4" key={laboratoriesSelecteds[index].value}><strong>&#8859;</strong></span>
                }
            </span>                       
          </ListItem>
        );
    }
    return (
        <form onSubmit={formikCreateLaboratory.handleSubmit}>
            <TextField
                className={`mb-4`}
                fullWidth
                autoComplete='off'
                name="description"
                label="Descripción"
                type='text'
                onChange={formikCreateLaboratory.handleChange}
                value={formikCreateLaboratory.values.description}
                error={formikCreateLaboratory.touched.description && Boolean(formikCreateLaboratory.errors.description)}
                helperText={formikCreateLaboratory.touched.description && formikCreateLaboratory.errors.description}
            />
            <FormControl className={`d-block mb-3 mt-2`}>
            <label className={(formikCreateLaboratory.touched.clase && Boolean(formikCreateLaboratory.errors.clase)) ? 'pf-10 MuiFormLabel-root Mui-error' : 'pf-10' }>Clase</label>
                <Select
                    className={`mt-0`}
                    fullWidth
                    id="clase"
                    name="clase"
                    value={formikCreateLaboratory.values.clase}
                    onChange={formikCreateLaboratory.handleChange}
                    error={formikCreateLaboratory.touched.clase && Boolean(formikCreateLaboratory.errors.clase)}
                    helperText={formikCreateLaboratory.touched.clase && formikCreateLaboratory.errors.clase}
                >
                    <MenuItem value={'T'} key={1}>Total</MenuItem>
                    <MenuItem value={'E'} key={2}>Etico</MenuItem>
                    <MenuItem value={'P'} key={3}>Popular</MenuItem>
                </Select>
                {formikCreateLaboratory.touched.clase && Boolean(formikCreateLaboratory.errors.clase) &&
                  <p className="MuiFormHelperText-root Mui-error">{formikCreateLaboratory.touched.clase && formikCreateLaboratory.errors.clase}</p>
                }                
            </FormControl>
            <div>
                <span>Seleccionados</span>
                <div className={[classes.root, 'mb-10']}>
                    <FixedSizeList height={200} width={'100%'} itemSize={30} itemCount={laboratoriesSelecteds.length}>
                        {renderLaboratoriesRow}
                    </FixedSizeList>
                </div>
            </div> 
            {formikCreateLaboratory.errors.api &&
                <div className="MuiFormLabel-root Mui-error text-left pl-0 pt-7" style={{width: '100%'}}>{formikCreateLaboratory.errors.api}</div>
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

export default connect(null,mapDispatchToProps)(LaboratoryForm);