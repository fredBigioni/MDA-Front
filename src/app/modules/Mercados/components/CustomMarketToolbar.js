import React from 'react';
import { connect, useDispatch } from 'react-redux'
import { injectIntl } from "react-intl";
import { bindActionCreators } from 'redux';
import * as actions from './../_redux/mercadosActions';
import CustomMarketAction from './CustomMarketAction'
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import { CustomMarketActionFirma } from './CustomMarketActionFirma';
import CustomMarketLastAuditory from './CustomMarketLastAuditory';
import { actionTypes } from '../_redux/mercadosRedux';

const CustomMarketToolbar = (props) => {
  const { intl, customMarket } = props;
  const dispatch = useDispatch();

  if (customMarket.isLoading || Object.keys(customMarket.data).length == 0) {
    return null
  }

  const handleClearData = () => {

    dispatch({ type: actionTypes.RECEIVE_PREVIEW_HISTORYDATA, historyData: [] })
    
  }

  return (
    <Grid item xs={12} className="pt-1 pl-0 pr-0 pb-0">
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: 8,
        justifyContent: 'space-between'  // Esta línea asegura que los elementos se distribuyan con espacio entre ellos
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: 8
        }}>
          <div
            id="btn_tree"
            className={`btn btn-secondary font-weight-bold px-2 py-0 mb-2`}
            onClick={() => props.setMarketTreeVisible(true)}
          >
            <Tooltip title={intl.formatMessage({ id: "CUSTOM_MARKET_TREE.TITLE" })}>
              <IconButton onClick={handleClearData} aria-label="" color="primary">
                <AccountTreeIcon />
              </IconButton>
            </Tooltip>
          </div>
          <span
            className={`ml-10`}
            style={{ fontSize: '16px', fontWeight: '500', borderBottom: '2px solid #17c191', color: '#636060' }}>
            {customMarket.data.lineGroupDescription && (
              <>
                {customMarket.data.lineGroupDescription.toUpperCase()}
                <span style={{ color: 'rgb(56 56 197 / 48%)' }} className="pl-4 pr-4">|</span>
              </>
            )}
            {customMarket.data.lineDescription && (
              <>
                {customMarket.data.lineDescription.toUpperCase()}
                <span style={{ color: 'rgb(56 56 197 / 48%)' }} className="pl-4 pr-4">|</span>
              </>
            )}
            {customMarket.data.description.toUpperCase()}
          </span>
          <CustomMarketAction customMarket={customMarket} lineSelected={null} />
          <CustomMarketActionFirma />
        </ div>
        <CustomMarketLastAuditory />
      </div>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    customMarket: state.mercados.customMarket
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}
export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(CustomMarketToolbar));