import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as DrugGroupActions from './_redux/Actions';
import * as MercadosActions from '../Mercados/_redux/mercadosActions'
import Grid from '@material-ui/core/Grid';
import MaterialTable from 'material-table'
import ActionDialog from './components/ActionDialog'
import IconButton from '@material-ui/core/IconButton';
import { injectIntl, FormattedMessage } from "react-intl";
import Can from './../../config/Can';
import { useStyles } from '../../Style/GeneralStyles';

const actions = Object.assign({}, DrugGroupActions, MercadosActions);
const DrugGroup = (props) => {
    const clases = useStyles()
    const { intl } = props;
    const [ isLoading, setLoading ] = React.useState(true)
    const [ drugGroupData, setDrugGroupData ] = React.useState([])
    const [ all_drugs, setAllDrugs ] = React.useState([])

    const [ dialogAction, setDialogAction ] = React.useState({
        actionType: '',
        item: [],
        dialogVisible: false,
        detail: [],
        all_drugs: []
    })
    const [ allowedPermission, setAllowedPermission ] = React.useState(false)

    const getDrugGroups = async() => {
        let getDrug = await props.getAllDrugGroup();
        let allDrugs = await props.getAllDrugs()
        setAllDrugs(allDrugs)
        setDrugGroupData(getDrug)
        setLoading(false)
    }
    React.useEffect(() => {
        getDrugGroups()
    },[])

    const editDrugGroup = async(item) => {
        setLoading(true)
        let getDetail = await props.getDetailDrugGroup(item.code)
        setDialogAction({actionType: 'edit', dialogVisible: true, all_drugs: all_drugs, detail: getDetail, item: item  })
        setLoading(false)
    }
    const closeDialog = () => {
        setDialogAction({actionType: '', dialogVisible: false, item: []})
    }
    const reload = async() => {
        setLoading(true)
        closeDialog()
        await getDrugGroups()
        await props.getDrugs()
    }
    const deleteDrugGroup = (item) => {
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
                        title={intl.formatMessage({id: "MENU.MASTERS.DRUG_GROUP"})}
                        columns={[
                            {title: 'Título', field: 'description'},
                        ]}
                        data={drugGroupData}
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
                                onClick: (event, rowData) => editDrugGroup(rowData),
                            },
                            {
                                icon: 'delete',
                                tooltip: intl.formatMessage({id: "FORM.ACTION.DELETE"}) ,
                                onClick: (event, rowData) => deleteDrugGroup(rowData)
                            },
                            {
                                icon: 'add',
                                tooltip: intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.CREATE_GROUP.DRUG"}),    
                                isFreeAction: true,
                                onClick: () => setDialogAction({actionType: 'create', dialogVisible: true,all_drugs: all_drugs })
                            },
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
                    <ActionDialog action={dialogAction} all_drugs={all_drugs} closeDialog={() => closeDialog()} closeDialogAndReload={() => reload()} />
                }
            </Grid>
        </>
    )
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

export default injectIntl(connect(null,mapDispatchToProps)(DrugGroup));