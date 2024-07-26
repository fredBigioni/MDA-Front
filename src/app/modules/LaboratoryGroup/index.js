import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as LaboratoryGroupActions from './_redux/Actions';
import * as MercadosActions from '../Mercados/_redux/mercadosActions'
import Grid from '@material-ui/core/Grid';
import MaterialTable from 'material-table'
import ActionDialog from './components/ActionDialog'
import { injectIntl } from "react-intl";
import Can from './../../config/Can';
import { useStyles } from '../../Style/GeneralStyles';


const actions = Object.assign({}, LaboratoryGroupActions, MercadosActions);

const LaboratoryGroup = (props) => {
    const clases = useStyles()
    const { intl } = props;
    const [ isLoading, setLoading ] = React.useState(true)
    const [ laboratoryGroupData, setLaboratoryGroups ] = React.useState([])
    const [ all_laboratories, setAllLaboratories ] = React.useState([])

    const [ dialogAction, setDialogAction ] = React.useState({
        actionType: '',
        item: [],
        dialogVisible: false,
        all_laboratories: []
    })
    const [ allowedPermission, setAllowedPermission ] = React.useState(false)

    const getLaboratoriesGroups = async() => {
        let laboratoriesGroups = await props.getAllLaboratoriesGroup();
        setLaboratoryGroups(laboratoriesGroups)
        let getLaboratories = await props.getAllLaboratories();
        setAllLaboratories(getLaboratories)
        setLoading(false)
    }
    React.useEffect(() => {
        getLaboratoriesGroups()
    },[])

    const editLaboratoryGroup = async(item) => {
        setLoading(true)
        let getDetail = await props.getDetailLaboratoryGroup(item.code)
        setDialogAction({actionType: 'edit', dialogVisible: true, all_laboratories: all_laboratories, detail: getDetail, item: item  })
        setLoading(false)
    }
    const closeDialog = () => {
        setDialogAction({actionType: '', dialogVisible: false, item: []})
    }
    const reload = async() => {
        setLoading(true)
        closeDialog()
        await getLaboratoriesGroups()
        await props.getLaboratories()
    }
    const deleteLaboratoryGroup = (item) => {
        setDialogAction({actionType: 'delete', dialogVisible: true, item: item })
    }
    
    return (
        <>
            <Can I="view" a="manage-custom-market" passThrough>
                {(allowed) => setAllowedPermission(allowed)}
            </Can>
            <Grid container spacing={4} style={{ position: 'relative'}}>
                <div style={{ maxWidth: '100%', width:'100%' }}>
                    <MaterialTable
                        title={intl.formatMessage({id: "MENU.MASTERS.LABORATORY_GROUP"})}
                        columns={[
                            {title: 'Título', field: 'description'},
                            {title: intl.formatMessage({id: 'CUSTOM_MARKET_PREVIEW.CLASS'}), field: 'class'},
                        ]}
                        data={laboratoryGroupData}
                        isLoading={isLoading}
                        options={{
                            pageSize: 10,
                            pageSizeOptions: [10,25,50, 100],
                            searchFieldAlignment: 'left',
                            actionsColumnIndex: -1,
                        }}
                        actions={allowedPermission &&
                            [{
                                icon: 'edit',
                                tooltip: 'Editar',
                                onClick: (event, rowData) => editLaboratoryGroup(rowData),
                            },
                            {
                                icon: 'delete',
                                tooltip: intl.formatMessage({id: "FORM.ACTION.DELETE"}) ,
                                onClick: (event, rowData) => deleteLaboratoryGroup(rowData)
                            },
                            {
                                icon: 'add',
                                tooltip: intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.CREATE_GROUP.LABORATORY"}),    
                                isFreeAction: true,
                                onClick: () => setDialogAction({actionType: 'create', dialogVisible: true, all_laboratories: all_laboratories })
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
                    <ActionDialog action={dialogAction} all_laboratories={all_laboratories} closeDialog={() => closeDialog()} closeDialogAndReload={() => reload()} />
                }
            </Grid>
        </>
    )
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

export default injectIntl(connect(null, mapDispatchToProps)(LaboratoryGroup));