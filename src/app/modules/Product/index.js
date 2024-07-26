import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from './_redux/Actions';
import Grid from '@material-ui/core/Grid';
import MaterialTable from 'material-table'
import ActionDialog from './components/ActionDialog'
import { useStyles } from '../../Style/GeneralStyles';

const Product = (props) => {
    const classes = useStyles();
    const [ isLoading, setLoading ] = React.useState(true)
    const [ productData, setProducts ] = React.useState([])
    const [ laboratories, setLaboratories ] = React.useState([])

    const [ dialogAction, setDialogAction ] = React.useState({
        actionType: '',
        item: [],
        dialogVisible: false,
        laboratories: []
    })

    const getProducts = async() => {
        let getProduct = await props.getAllProducts();
        let getLaboratory = await props.getAllLaboratories();
        setProducts(getProduct)
        setLaboratories(getLaboratory)
        setLoading(false)
    }
    React.useEffect(() => {
        getProducts()
    },[])

    const editProduct = (item) => {
        setDialogAction({actionType: 'edit', dialogVisible: true, item: item, laboratories})
    }
    const closeDialog = () => {
        setDialogAction({actionType: '', dialogVisible: false, item: []})
    }
    const reload = async() => {
        setLoading(true)
        closeDialog()
        await getProducts()
    }

    return (
        <>
            <Grid container spacing={4} style={{ position: 'relative'}}>
                <div style={{ maxWidth: '100%', width:'100%' }}>
                    <MaterialTable
                        title="Productos"
                        columns={[
                            {title: 'Título', field: 'description'},
                            {title: 'Laboratorio', field: 'laboratoryDescription'}
                        ]}
                        data={productData}
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
                                onClick: (event, rowData) => editProduct(rowData)
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
export default connect(null,mapDispatchToProps)(Product);