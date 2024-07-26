import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as ProductGroupActions from './_redux/Actions';
import * as MercadosActions from '../Mercados/_redux/mercadosActions'
import Grid from '@material-ui/core/Grid';
import MaterialTable from 'material-table'
import ActionDialog from './components/ActionDialog'
import { injectIntl } from "react-intl";
import Can from './../../config/Can';
import { useStyles } from '../../Style/GeneralStyles';

const actions = Object.assign({}, ProductGroupActions, MercadosActions);
const ProductGroup = (props) => {
    const classes = useStyles();
    const { intl } = props;
    const [ isLoading, setLoading ] = React.useState(true)
    const [ productGroupData, setProductGroups ] = React.useState([])
    const [ all_products, setAllProducts ] = React.useState([])

    const [ dialogAction, setDialogAction ] = React.useState({
        actionType: '',
        item: [],
        dialogVisible: false,
        all_products: []
    })

    const [ allowedPermission, setAllowedPermission ] = React.useState(false)

    const getProductGroups = async() => {
        let getProduct = await props.getAllProductGroup();
        setProductGroups(getProduct)
        const products = await props.getAllProducts();
        setAllProducts(products)
        setLoading(false)
    }
    React.useEffect(() => {
        getProductGroups()
    },[])

    const editProductGroup = async(item) => {
        setLoading(true)
        let getDetail = await props.getDetailProductGroup(item.code)
        setDialogAction({actionType: 'edit', dialogVisible: true, all_products: all_products, detail: getDetail, item: item  })
        setLoading(false)
    }
    const closeDialog = () => {
        setDialogAction({actionType: '', dialogVisible: false, item: []})
    }
    const reload = async() => {
        setLoading(true)
        closeDialog()
        await getProductGroups()
        await props.getProducts()
    }
    const deleteProductGroup = (item) => {
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
                        title={intl.formatMessage({id: "MENU.MASTERS.PRODUCT_GROUP"})}
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
                        actions={
                            [{
                                icon: 'edit',
                                tooltip: intl.formatMessage({id: "ACTION.EDIT"}),
                                onClick: (event, rowData) => editProductGroup(rowData)
                            },
                            {
                                icon: 'delete',
                                tooltip: intl.formatMessage({id: "FORM.ACTION.DELETE"}) ,
                                onClick: (event, rowData) => deleteProductGroup(rowData)
                            },
                            {
                                icon: 'add',
                                tooltip: intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.CREATE_GROUP.PRODUCT"}),    
                                isFreeAction: true,
                                onClick: () => setDialogAction({actionType: 'create', dialogVisible: true, all_products: all_products }),
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
                    <ActionDialog action={dialogAction} all_products={all_products} closeDialog={() => closeDialog()} closeDialogAndReload={() => reload()} />
                }
            </Grid>
        </>
    )
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

export default injectIntl(connect(null,mapDispatchToProps)(ProductGroup));