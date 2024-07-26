import React, { forwardRef } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from './_redux/Actions';
import { Container, makeStyles } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import MaterialTable from 'material-table'
import ActionDialog from './components/ActionDialog'
import { useStyles } from '../../Style/GeneralStyles';

const BusinessUnits = (props) => {
    const classes = useStyles();
    const [ isLoading, setLoading ] = React.useState(true)
    const [ businessUnitsData, setBusinessUnits ] = React.useState([])
    const [ dialogAction, setDialogAction ] = React.useState({
        actionType: '',
        item: [],
        dialogVisible: false
    })

    const getBusinessUnit = async() => {
        let getBusinessUnits = await props.getAll();
        setBusinessUnits(getBusinessUnits.data)
        setLoading(false)
    }
    React.useEffect(() => {
        getBusinessUnit()
    },[])

    const editBusinessUnit = (item) => {
        setDialogAction({actionType: 'edit', dialogVisible: true, item: item})
    }
    const closeDialog = () => {
        setDialogAction({actionType: '', dialogVisible: false, item: []})
    }

    const reload = async() => {
        setLoading(true)
        closeDialog()
        await getBusinessUnit()
    }

    return (
        <>
            <Grid container spacing={4} style={{ position: 'relative'}}>
                <div style={{ maxWidth: '100%', width:'100%' }}>
                <MaterialTable
                    title="Unidades de Negocios"
                    columns={[
                        {title: 'Título', field: 'description'}
                    ]}
                    data={businessUnitsData}
                    isLoading={isLoading}
                    options={{
                        pageSize: 10,
                        pageSizeOptions: [10,25,50, 100],
                        searchFieldAlignment: 'left',
                        actionsColumnIndex: -1,
                    }}
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
                    actions={[
                        {
                            icon: 'add',
                            tooltip: 'Crear Unidad de Negocio',
                            isFreeAction: true,
                            onClick: () => setDialogAction({actionType: 'create', dialogVisible: true}),
                            position:'toolbar'
                        }, 
                        {
                            icon: 'edit',
                            tooltip: 'Editar',
                            onClick: (event, rowData) => editBusinessUnit(rowData)
                        }
                    ]}
                    />
                </div>            
                <ActionDialog action={dialogAction} closeDialog={() => closeDialog()} closeDialogAndReload={() => reload()} />
            </Grid>
        </>
    )
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}
export default connect(null,mapDispatchToProps)(BusinessUnits);