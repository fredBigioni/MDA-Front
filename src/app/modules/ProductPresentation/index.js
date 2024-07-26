import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from './_redux/Actions';
import Grid from '@material-ui/core/Grid';
import MaterialTable from 'material-table'
import ActionDialog from './components/ActionDialog'
import { useStyles } from '../../Style/GeneralStyles';

const ProductPresentation = (props) => {
    const classes = useStyles();
    const [ isLoading, setLoading ] = React.useState(true)
    const [ productPresentationData, setProductPresentations ] = React.useState([])
    const [ therapeuticalClassData, setTherapeuticalClass ] = React.useState([])
    const [ businessUnitsData, setBusinessUnits ] = React.useState([])
    const [ dialogAction, setDialogAction ] = React.useState({
        actionType: '',
        item: [],
        dialogVisible: false,
        therapeuticalClass: [],
        businessUnits: []
    })

    const getProductsPresentations = async() => {
        let getProductPresentations = await props.getAllProductPresentations();
        let getTherapeuticlass = await props.getAllTherapeuticlass();
        let getBusinessUnit = await props.getAllBusinessUnits()
        setProductPresentations(getProductPresentations)
        setTherapeuticalClass(getTherapeuticlass)
        setBusinessUnits(getBusinessUnit)
        setLoading(false)
    }
    React.useEffect(() => {
        getProductsPresentations()
    },[])

    const editProductPresentation = (item) => {
        setDialogAction({actionType: 'edit', dialogVisible: true, item: item, therapeuticalClass: therapeuticalClassData, businessUnits: businessUnitsData})
    }
    const closeDialog = () => {
        setDialogAction({actionType: '', dialogVisible: false, item: []})
    }
    const reload = async() => {
        setLoading(true)
        closeDialog()
        await getProductsPresentations()
    }

    return (
        <>
           <Grid container spacing={4} style={{ position: 'relative'}}>
                    <div style={{ maxWidth: '100%', width:'100%' }}>
                        <MaterialTable
                            title="Presentaciones"
                            columns={[
                                {title: 'Título', field: 'description'},
                                {title: 'Género', field: 'classDescription'},
                                {title: 'Unidad de Negocio', field: 'businessUnitDescription'},
                                {title: 'Clase Terapéutica', field: 'therapeuticalClassDescription'},
                            ]}
                            data={productPresentationData}
                            isLoading={isLoading}
                            options={{
                                pageSize: 10,
                                pageSizeOptions: [10,25,50, 100],
                                searchFieldAlignment: 'left',
                                actionsColumnIndex: -1,
                            }}
                            actions={[
                                {
                                    icon: 'edit',
                                    tooltip: 'Editar',
                                    onClick: (event, rowData) => editProductPresentation(rowData)
                                }
                            ]}
                            localization={{
                                toolbar: {
                                    searchTooltip: 'Buscar',
                                    searchPlaceholder: 'Buscar'
                                },
                                header: {
                                    actions: ''
                                },
                                pagination: {
                                    labelRowsSelect: 'resultados',
                                    labelRowsPerPage: 'resultados',
                                    labelDisplayedRows: '{from}-{to} de {count}'
                                },
                                body: {
                                    emptyDataSourceMessage: '',
                                }
                            }}
                        />
                    </div>
                    {dialogAction.dialogVisible &&
                        <ActionDialog action={dialogAction} closeDialog={() => closeDialog()} closeDialogAndReload={() => reload()} />
                    }
                </Grid>
        </>
    )
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}
export default connect(null,mapDispatchToProps)(ProductPresentation);