import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as ProductPresentationGroupActions from './_redux/Actions';
import * as MercadosActions from '../Mercados/_redux/mercadosActions'
import Grid from '@material-ui/core/Grid';
import MaterialTable from 'material-table'
import ActionDialog from './components/ActionDialog'
import { injectIntl } from "react-intl";
import Can from './../../config/Can';
import { useStyles } from '../../Style/GeneralStyles';

const actions = Object.assign({}, ProductPresentationGroupActions, MercadosActions);
const ProductPresentationGroup = (props) => {
    const classes = useStyles();
    const { intl } = props;
    const [ isLoading, setLoading ] = React.useState(true)
    const [ productGroupData, setProductPresentationGroups ] = React.useState([])
    const [ all_productsPresentations, setAllProductsPresentations ] = React.useState([])

    const [ dialogAction, setDialogAction ] = React.useState({
        actionType: '',
        item: [],
        dialogVisible: false,
        laboratories: []
    })
    const [ allowedPermission, setAllowedPermission ] = React.useState(false)

    const getProductPresentationGroups = async() => {
        let getProduct = await props.getAllProductPresentationGroup();
        setProductPresentationGroups(getProduct)
        const productPresentation = await props.getAllProductPresentation();
        setAllProductsPresentations(productPresentation)
        setLoading(false)
    }
    React.useEffect(() => {
        getProductPresentationGroups()
    },[])

    const editProductPresentationGroup = async(item) => {
        setLoading(true)
        let getDetail = await props.getDetailProductPresentationGroup(item.code)
        setDialogAction({actionType: 'edit', dialogVisible: true, all_productsPresentations: all_productsPresentations, detail: getDetail, item: item  })
        setLoading(false)
        //setDialogAction({actionType: 'edit', dialogVisible: true, item: item })
    }
    const closeDialog = () => {
        setDialogAction({actionType: '', dialogVisible: false, item: []})
    }
    const reload = async() => {
        setLoading(true)
        closeDialog()
        await getProductPresentationGroups()
        await props.getProductPresentations()
    }
    const deleteProductPresentationGroup = (item) => {
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
                        title={intl.formatMessage({id: "MENU.MASTERS.PRODUCT_PRESENTATION_GROUP"})}
                        columns={[
                            {title: 'Título', field: 'description'},
                        ]}
                        data={productGroupData}
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
                                tooltip: intl.formatMessage({id: "ACTION.EDIT"}),
                                onClick: (event, rowData) => editProductPresentationGroup(rowData),
                                hidden: allowedPermission == true ? false: true
                            },
                            {
                                icon: 'delete',
                                tooltip: intl.formatMessage({id: "FORM.ACTION.DELETE"}),
                                onClick: (event, rowData) => deleteProductPresentationGroup(rowData),
                                hidden: allowedPermission == true ? false: true
                            },
                            {
                                icon: 'add',
                                tooltip: intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.CREATE_GROUP.PRODUCT_PRESENTATION"}),    
                                isFreeAction: true,
                                onClick: () => setDialogAction({actionType: 'create', dialogVisible: true, all_productsPresentations: all_productsPresentations }),
                                hidden: allowedPermission == true ? false: true
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
                    <ActionDialog action={dialogAction} all_productsPresentations={all_productsPresentations} closeDialog={() => closeDialog()} closeDialogAndReload={() => reload()} />
                }
            </Grid>
        </>
    )
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

export default injectIntl(connect(null,mapDispatchToProps)(ProductPresentationGroup));