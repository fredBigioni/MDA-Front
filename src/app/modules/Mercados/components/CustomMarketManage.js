import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from './../_redux/mercadosActions';
import Grid from '@material-ui/core/Grid';
import CustomMarketTab from './Tab';
import CustomMarketCollapsableDetail from './CustomMarketCollapsableDetail';
import Can from './../../../config/Can';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';

const useExpansionPanelStyles = makeStyles((theme) => (
    {
        root: {
            padding: theme.spacing(1),
        },
        expanded: {
            minHeight: '10px !important'
        },
    }
))

const CustomMarketManage = (props) => {
  const {customMarket, customMarketGroups,customMarketPageView} = props;
  const classes = useExpansionPanelStyles()

  return (
    <>
        {customMarketPageView.view == 'manage' &&
            <Can I="view" a="manage-custom-market">
                <>
                    <Grid item xs={12} className="p-0">   
                        <ExpansionPanel defaultExpanded={true} key="expansion-panel-custom-market-manage" style={{marginBottom: '10px', backgroundColor: '#f5f5f5'}}> 
                            <ExpansionPanelSummary
                                className={classes.expanded}
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="expansion-panel-custom-market-manage"
                            >
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails className={classes.root}>                                                                    
                                <CustomMarketTab style={{height: '420px', width: '100%' }} />
                            </ExpansionPanelDetails>
                        </ExpansionPanel>             
                    </Grid>   
                    <Grid item xs={12} className="p-0">
                        {!customMarketGroups.isLoading && !customMarket.isLoading && Object.keys(customMarket.data).length > 0 &&
                            <CustomMarketCollapsableDetail customMarket={customMarket} customMarketGroups={customMarketGroups}/>
                        }
                    </Grid>
                </>
            </Can>
        }
    </>
  );
};

const mapStateToProps = (state) => {
    return {
        customMarket: state.mercados.customMarket,
        customMarketGroups: state.mercados.customMarketGroups,
        customMarketPageView: state.mercados.customMarketPageView
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(CustomMarketManage);