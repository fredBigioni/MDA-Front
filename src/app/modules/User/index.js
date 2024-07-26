import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from './_redux/Actions';
import Grid from '@material-ui/core/Grid';
import PanelUserPermissions from './components/Panel'
import ActionDialog from './components/ActionDialog'
import MaterialTable from 'material-table'
import Checkbox from '@material-ui/core/Checkbox';
import { FormattedMessage, injectIntl } from "react-intl";
import { useStyles } from '../../Style/GeneralStyles';

const User = (props) => {
    const classes = useStyles();
    const { intl } = props;
    const [ isLoading, setLoading ] = React.useState(true)
    const [ usersData, setUsers ] = React.useState([])
    const [ enableEditPermissions, setEnableEditPermission ] = React.useState({
        visible: false,
        user: []
    }) 
    
    const [ dialogAction, setDialogAction ] = React.useState({
        actionType: '',
        user: [],
        dialogVisible: false,
    })

    const getUsers = async() => {
        let getAllUsers = await props.getUsers();
        setUsers(getAllUsers)
        setLoading(false)
    }
    React.useEffect(() => {
        getUsers()
    },[])

    const closeDialog = () => {
        setDialogAction({actionType: '', dialogVisible: false, user: []})
    }
    const reload = async() => {
        setLoading(true)
        closeDialog()
        await getUsers()
    }
    const openPanel = (item) => {
        setEnableEditPermission({
            visible: true,
            user: item
        })
    }

    return (
        <>
            {enableEditPermissions.visible ? (
                <PanelUserPermissions userData={enableEditPermissions.user} closePanel={() => setEnableEditPermission({visible: false, user: []})} />
            ):(
                <Grid container spacing={4} style={{ position: 'relative'}}>
                    <div style={{ maxWidth: '100%', width:'100%' }}>
                        <MaterialTable
                            title={intl.formatMessage({id: "USERS.TITLE"})}
                            columns={[
                                {title: intl.formatMessage({id: "USERS.USER"}), field: 'usuario'},
                                {title: intl.formatMessage({id: "USERS.DOMAIN"}), field: 'dominio'},
                                {title: intl.formatMessage({id: "USERS.PROFILE_ADMINISTRATOR"}), field: 'isAdmin', render: rowData => <Checkbox checked={rowData.isAdmin ? true : false } readOnly={true} />}
                            ]}
                            data={usersData}
                            isLoading={isLoading}
                            options={{
                                pageSize: 10,
                                pageSizeOptions: [10,25,50, 100],
                                searchFieldAlignment: 'left',
                                actionsColumnIndex: -1,
                            }}
                            actions={[
                                {
                                    icon: 'add',
                                    tooltip: intl.formatMessage({id: "USERS.ACTION.CREATE"}),
                                    isFreeAction: true,
                                    onClick: () => setDialogAction({actionType: 'create', dialogVisible: true, user: []}),
                                    position:'toolbar',
                                },
                                {
                                    icon: 'edit',
                                    tooltip: intl.formatMessage({id: "ACTION.EDIT"}),
                                    onClick: (event, rowData) =>setDialogAction({actionType: 'edit', dialogVisible: true, user: rowData})
                                },
                                {
                                    icon: 'visibility',
                                    tooltip: intl.formatMessage({id: "USERS.ACTION.PERMISSION"}) ,
                                    onClick: (event, rowData) => openPanel(rowData)
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

            )}
        </>
    )
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}
export default injectIntl(connect(null,mapDispatchToProps)(User));