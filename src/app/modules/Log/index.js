import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from './_redux/Actions';
import Grid from '@material-ui/core/Grid';
import MaterialTable from 'material-table'
import Checkbox from '@material-ui/core/Checkbox';
import { FormattedMessage, injectIntl } from "react-intl";
import { useStyles } from '../../Style/GeneralStyles';

const Log = (props) => {
    const classes = useStyles();
    const { intl } = props;
    const [ isLoading, setLoading ] = React.useState(true)
    const [ logsData, setLogsData ] = React.useState([])

    const formatDate = (dateString) => {
        const options = { 
            day: '2-digit',
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'America/Argentina/Buenos_Aires' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    }

    const getLogs = async () => {
        let getAllLogs = await props.getLogs();
        const formattedLogs = getAllLogs.map(log => ({
            ...log,
            date: formatDate(log.date)
        }));
        setLogsData(formattedLogs);
        setLoading(false);
    }
    React.useEffect(() => {
        getLogs()
    },[])

  

    return (
        <>
                <Grid container spacing={4} style={{ position: 'relative'}}>
                    <div style={{ maxWidth: '100%', width:'100%' }}>
                        <MaterialTable
                            title={intl.formatMessage({id: "LOG.TITLE"})}
                            columns={[
                                {title: intl.formatMessage({id: "LOG.ID"}), field: 'code'},
                                {title: intl.formatMessage({id: "LOG.DESCRIPTION"}), field: 'description'},
                                {title: intl.formatMessage({id: "LOG.USER"}), field: 'userLog'},
                                {title: intl.formatMessage({id: "LOG.DATE"}), field: 'date'},
                                {title: intl.formatMessage({id: "LOG.MCODE"}), field: 'customMarketCode'},

                                
                            ]}
                            data={logsData}
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
                        />
                    </div>
                </Grid>
        </>
    )
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}
export default injectIntl(connect(null,mapDispatchToProps)(Log));