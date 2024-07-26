import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from '../_redux/mercadosActions';
import { FormattedMessage } from "react-intl";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PreviewIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import CustomMarketDialog from './CustomMarketDialog'
import CustomMarketDeleteDialog from './CustomMarketDeleteDialog'
import Can from '../../../config/Can';

function CustomMarketAction(props) {
	const { customMarketPageView, customMarket, lineSelected } = props;
  const [isActionClone, setIsActionClone] = React.useState(false);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [openCustomMarketDialog, setOpenCustomMarketDialog] = React.useState(false);
  const [openCustomMarketDeleteDialog, setOpenCustomMarketDeleteDialog] = React.useState(false);
	const openMenu = Boolean(anchorEl);  
	const ITEM_HEIGHT = 48;

  const handleOpenMenu = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = (event) => {
    setAnchorEl(null);
  };  

  const handleCloseDialog = () => {
    setOpenCustomMarketDialog(false);
  };

  const handleOpenEditDialog = (event) => {
    handleCloseMenu()
    setIsActionClone(false)
    setOpenCustomMarketDialog(true);
  };

  const handleOpenCloneDialog = (event) => {
    handleCloseMenu()
    setIsActionClone(true)
    setOpenCustomMarketDialog(true);
  };

  const handleOpenDeleteDialog = (event) => {
    handleCloseMenu()
    setOpenCustomMarketDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenCustomMarketDeleteDialog(false);
  };

    return ( 
      <>        
        <Can I="view" a="manage-custom-market">
          <>
            <IconButton aria-label="" onClick={handleOpenMenu} color="primary">
              <MoreVertIcon style={{fontSize: '1.8rem'}}/>
            </IconButton>
            <Menu
              id="customMarketMenu"
              anchorEl={anchorEl}
              keepMounted
              open={openMenu}
              onClose={handleCloseMenu}
              PaperProps={{
                style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: '24ch',
                },
              }}
            >
              <MenuItem key='menuItemEdit' onClick={handleOpenEditDialog}>
                <FormattedMessage id="CUSTOM_MARKET_ACTION.EDIT" />
              </MenuItem>
              <MenuItem key='menuItemClone'  onClick={handleOpenCloneDialog}>
                <FormattedMessage id="CUSTOM_MARKET_ACTION.CLONE" />
              </MenuItem>                       
              <MenuItem key='menuItemDelete' onClick={handleOpenDeleteDialog}>
                <FormattedMessage id="CUSTOM_MARKET_ACTION.DELETE" />
              </MenuItem>                                           
            </Menu>
            <div className="float-right ml-15">
              {customMarketPageView.view == 'manage' && (
                <div
                  id="btn_preview"
                  className={`btn btn-secondary font-weight-bold px-2 pr-6 py-0 mb-2`}
                  style={{fontWeight: '600'}}
                  onClick={() => props.setCustomMarketPageView('preview')}
                  >
                  <IconButton aria-label=""  color="primary">
                    <PreviewIcon color="primary"/>
                  </IconButton>
                  <span style={{color:'#17c191'}}>
                    <FormattedMessage id="CUSTOM_MARKET_ACTION.PREVIEW" />
                  </span>
                </div>
              )}
              {customMarketPageView.view == 'preview' && (
                <div
                  id="btn_manage"
                  className={`btn btn-secondary font-weight-bold px-2 pr-6 py-0 mb-2`}
                  style={{fontWeight: '600'}}
                  onClick={() => props.setCustomMarketPageView('manage')}
                >
                  <IconButton aria-label=""  color="primary">
                    <EditIcon color="primary"/>
                  </IconButton>
                  <span style={{color:'#17c191'}}>
                    <FormattedMessage id="CUSTOM_MARKET_ACTION.MANAGE" />
                  </span>
                </div>
              )}              
            </div>
          </>
        </Can>
        <CustomMarketDialog open={openCustomMarketDialog} handleClose={handleCloseDialog} customMarket={customMarket} lineSelected={lineSelected} isActionClone={isActionClone}/>
        <CustomMarketDeleteDialog open={openCustomMarketDeleteDialog} handleClose={handleCloseDeleteDialog} customMarket={customMarket}/>
      </>
    )
}

const mapStateToProps = (state) => {
  return {
      customMarketPageView: state.mercados.customMarketPageView
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(CustomMarketAction)