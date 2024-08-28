import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../_redux/mercadosActions';
import { FormattedMessage, injectIntl } from "react-intl";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PreviewIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import HistoryIcon from '@material-ui/icons/History';
import CustomMarketDialog from './CustomMarketDialog';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import CustomMarketDeleteDialog from './CustomMarketDeleteDialog';
import Can from '../../../config/Can';
import Modal from '@material-ui/core/Modal';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { actionTypes } from '../_redux/mercadosRedux';
import MaterialTable, { MTableToolbar } from 'material-table';
import { Grid } from 'react-virtualized';
import { CircularProgress, Dialog, Drawer, Popover } from '@material-ui/core';

function CustomMarketAction(props) {
  const { customMarketPageView, customMarket, lineSelected, marketHistoryArray, marketHistoryArrayToScreen, intl } = props;
  const [isActionClone, setIsActionClone] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openCustomMarketDialog, setOpenCustomMarketDialog] = React.useState(false);
  const [dataForTable, setDataForTable] = useState([])
  const [tableTitle, setTableTitle] = useState('')
  const [versionDateTitle, setVersionDateTitle] = useState('')
  const [versionCodeTitle, setVersionCodeTitle] = useState('')
  const [openCustomMarketDeleteDialog, setOpenCustomMarketDeleteDialog] = React.useState(false);
  const [openMaterialModal, setOpenMaterialModal] = React.useState(false);
  const [anchorElDropdown, setAnchorElDropdown] = React.useState(null);
  const dispatch = useDispatch();


  const openMenu = Boolean(anchorEl);
  const openDropdown = Boolean(anchorElDropdown);
  const ITEM_HEIGHT = 48;

  useEffect(() => {
    getHistoricCustomMarketsPreview()
    getHistoricCustomMarketsPreviewToScreen(customMarket?.data)
  }, [customMarket, lineSelected, customMarketPageView, openCustomMarketDialog, anchorElDropdown])


  const getHistoricCustomMarketsPreview = async () => {
    if (customMarketPageView.view == 'preview') {
      let preview = await props.getHistoricCustomMarketsPreview(customMarket.data.code)
      dispatch({ type: actionTypes.RECEIVE_PREVIEW_HISTORYDATA, historyData: preview?.result?.length > 0 ? preview?.result : [] })
    }
  }

  const getHistoricCustomMarketsPreviewToScreen = async (item) => {
    if (customMarketPageView.view == 'preview') {
      let preview = await props.getHistoricCustomMarketsPreviewToScreen(item.code)
      debugger;
      dispatch({ type: actionTypes.RECEIVE_PREVIEW_HISTORYDATATOSCREEN, historyDataToScreen: preview?.data })
    }
  }

  const getLastSignCustomMarketsPreviewToScreen = async (item) => {
    if (customMarketPageView.view == 'preview') {
      let preview = await props.getLastSignCustomMarketsPreviewToScreen(item.code)
      debugger;
      dispatch({ type: actionTypes.RECEIVE_PREVIEW_HISTORYDATATOSCREEN, historyDataToScreen: preview?.data })
    }
  }

  const handleOpenMenu = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = (event) => {
    setAnchorEl(null);
  };

  const handleOpenDropdown = (event, screen) => {
    setTableTitle(screen)
    setAnchorElDropdown(event.currentTarget);
  };

  const handleCloseDropdown = () => {
    setAnchorElDropdown(null);

  };

  const handleOpenMaterialModal = async (item, screen) => {
    await getHistoricCustomMarketsPreviewToScreen(item);
    setTableTitle(screen)
    const formattedDate = new Date(item?.versionDate).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    setVersionDateTitle(formattedDate);
    setVersionCodeTitle(item?.code)
    setDataForTable(marketHistoryArrayToScreen ? marketHistoryArrayToScreen : []);
    handleCloseDropdown();
    setOpenMaterialModal(true);
  };

  const handleOpenMaterialModalLast = async (screen) => {
    setTableTitle(screen)
    const lastItem = customMarket?.data
    await getLastSignCustomMarketsPreviewToScreen(lastItem)
    setDataForTable(marketHistoryArrayToScreen ? marketHistoryArrayToScreen : [])
    handleCloseDropdown();
    setOpenMaterialModal(true);
  };

  const handleCloseMaterialModal = () => {
    setOpenMaterialModal(false);
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

  const renderClass = (classCode) => {
    if (classCode == 1) {
      return intl.formatMessage({ id: "MASTER.CLASS.ETICO.SHORT" })
    }
    if (classCode == 2) {
      return intl.formatMessage({ id: "MASTER.CLASS.POPULAR.SHORT" })
    }
    return null;
  };

  return (
    <>
      <Can I="view" a="manage-custom-market">
        <>
          <IconButton aria-label="" onClick={handleOpenMenu} color="primary">
            <MoreVertIcon style={{ fontSize: '1.8rem' }} />
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
            <MenuItem key='menuItemClone' onClick={handleOpenCloneDialog}>
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
                style={{ fontWeight: '600' }}
                onClick={() => props.setCustomMarketPageView('preview')}
              >
                <IconButton aria-label="" color="primary">
                  <PreviewIcon color="primary" />
                </IconButton>
                <span style={{ color: '#17c191' }}>
                  <FormattedMessage id="CUSTOM_MARKET_ACTION.PREVIEW" />
                </span>
              </div>
            )}
            {customMarketPageView.view == 'preview' && (
              <div
                id="btn_manage"
                className={`btn btn-secondary font-weight-bold px-2 pr-6 py-0 mb-2`}
                style={{ fontWeight: '600' }}
                onClick={() => props.setCustomMarketPageView('manage')}
              >
                <IconButton aria-label="" color="primary">
                  <EditIcon color="primary" />
                </IconButton>
                <span style={{ color: '#17c191' }}>
                  <FormattedMessage id="CUSTOM_MARKET_ACTION.MANAGE" />
                </span>
              </div>
            )}
            {customMarketPageView.view == 'preview' && ( marketHistoryArrayToScreen && marketHistoryArrayToScreen?.length > 0) && (
              <div
                id="btn_manage"
                className={`btn btn-secondary font-weight-bold px-2 pr-6 py-0 mb-2 ml-2`}
                style={{ fontWeight: '600' }}
                onClick={(e) => { handleOpenMaterialModalLast(e, 'lastSign') }}

              >
                <IconButton aria-label="" color="primary">
                  <AssignmentTurnedInIcon color="primary" />
                </IconButton>
                <span style={{ color: '#17c191' }}>
                  <FormattedMessage id="CUSTOM_MARKET_ACTION.LASTSIGNATURE" />
                </span>
              </div>
            )}
            {customMarketPageView.view == 'preview' && (marketHistoryArray && marketHistoryArray?.length > 0) && (
              <>
                <div
                  id="PREVIEWHISTORY"
                  className="btn btn-secondary font-weight-bold px-2 pr-6 py-0 mb-2 ml-2"
                  style={{ fontWeight: '600' }}
                  onClick={(e) => { handleOpenDropdown(e, 'historicSign') }}
                >
                  <IconButton aria-label="" color="primary">
                    <HistoryIcon color="primary" />
                  </IconButton>
                  <span style={{ color: '#17c191' }}>
                    <FormattedMessage id="CUSTOM_MARKET_ACTION.PREVIEWHISTORY" />
                  </span>
                </div>
                <Menu
                  id="previewHistoryDropdown"
                  anchorEl={anchorElDropdown}
                  open={openDropdown}
                  onClose={handleCloseDropdown}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  PaperProps={{
                    style: {
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginLeft: "22px",
                      marginTop: '43px', // Espacio entre el botón y el dropdown
                    },
                  }}
                >
                  <div style={{
                    maxHeight: '300px',
                    overflow: marketHistoryArray && marketHistoryArray?.length > 0 ? 'auto' : 'hidden',
                  }}>
                    {marketHistoryArray && marketHistoryArray?.length > 0 ? (
                      marketHistoryArray?.map((item, index) => {
                        const formattedDateTime = new Date(item?.versionDate).toLocaleString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                          timeZone: 'America/Argentina/Buenos_Aires'
                        });

                        return (
                          <MenuItem style={{ marginTop: "1px" }} key={index} onClick={() => handleOpenMaterialModal(item, 'historicSign')}>
                            {item?.code ? item.code : ""} - {item?.name ? item.name : ""} - {item?.versionDate ? formattedDateTime : ""}
                          </MenuItem>
                        );
                      })
                    ) : (
                      <div style={{ padding: "2px" }}>Sin versiones historicas</div> // <CircularProgress style={{ marginTop: "6px" }} />
                    )}
                  </div>
                </Menu>
              </>
            )}
          </div>
        </>
      </Can>

      <CustomMarketDialog open={openCustomMarketDialog} handleClose={handleCloseDialog} customMarket={customMarket} lineSelected={lineSelected} isActionClone={isActionClone} />
      <CustomMarketDeleteDialog open={openCustomMarketDeleteDialog} handleClose={handleCloseDeleteDialog} customMarket={customMarket} />

      {/* Modal para mostrar la tabla de materiales */}
      <Popover
        BackdropProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo oscuro con opacidad
          },
        }}
        style={{ width: "80%", margin: "0 auto" }}
        open={openMaterialModal}
        onClose={handleCloseMaterialModal}>
        <MaterialTable
          title={tableTitle === 'historicSign' ? `Tabla historica: Version ${versionCodeTitle} - Fecha: ${versionDateTitle}` : 'Ultima Firmada'}
          columns={[
            { title: intl.formatMessage({ id: "CUSTOM_MARKET_PREVIEW.CODE.SHORT" }), field: 'id' },
            { title: intl.formatMessage({ id: "CUSTOM_MARKET_PREVIEW.LABORATORY.SHORT" }), field: 'labDescription' },
            {
              title: intl.formatMessage({ id: "LABORATORY_GROUP.FORM_CLASS" }),
              field: 'classCode',
              render: rowData => renderClass(rowData.classCode)
            },
            { title: intl.formatMessage({ id: "CUSTOM_MARKET_PREVIEW.BUSINESS_UIT.SHORT" }), field: 'businessUnit' },
            { title: intl.formatMessage({ id: "CUSTOM_MARKET_PREVIEW.TERAPEUTICAL_CLASS" }), field: 'tcCode' },
            { title: intl.formatMessage({ id: "CUSTOM_MARKET_PREVIEW.DRUG" }), field: 'drug' },
            { title: intl.formatMessage({ id: "CUSTOM_MARKET_PREVIEW.PHARMACEUTICAL_FORM" }), field: 'pfCode' },
            {
              title: intl.formatMessage({ id: "CUSTOM_MARKET_PREVIEW.PRESENTATION" }),
              field: 'productPresentationDescription',
              cellStyle: {
                minWidth: '300px'
              }
            },
            { title: intl.formatMessage({ id: "CUSTOM_MARKET_PREVIEW.ORDEN" }), field: 'orden' },
            { title: intl.formatMessage({ id: "CUSTOM_MARKET_GROUP_DIALOG.GROUP_CONDITION" }), field: 'itemCondition' },
            { title: intl.formatMessage({ id: "CUSTOM_MARKET_DETAIL.PATTERN" }), field: 'pattern' },
            {
              title: intl.formatMessage({ id: "CUSTOM_MARKET_DETAIL.ENSURE_VISIBLE" }),
              field: 'ensureVisible',
              render: rowData => rowData.ensureVisible == true ? intl.formatMessage({ id: "MASTER.YES" }) : intl.formatMessage({ id: "MASTER.NO" })
            },
            {
              title: intl.formatMessage({ id: "CUSTOM_MARKET_DETAIL.GRAPHS" }),
              field: 'graph',
              render: rowData => rowData.graph == true ? intl.formatMessage({ id: "MASTER.YES" }) : intl.formatMessage({ id: "MASTER.NO" })
            },
            {
              title: intl.formatMessage({ id: "CUSTOM_MARKET_DETAIL.RESUME" }),
              field: 'resume',
              render: rowData => rowData.resume == true ? intl.formatMessage({ id: "MASTER.YES" }) : intl.formatMessage({ id: "MASTER.NO" })
            },
            {
              title: intl.formatMessage({ id: "CUSTOM_MARKET_DETAIL.EXPAND" }),
              field: 'expand',
              render: rowData => rowData.expand == true ? intl.formatMessage({ id: "MASTER.YES" }) : intl.formatMessage({ id: "MASTER.NO" })
            },
            { title: intl.formatMessage({ id: "CUSTOM_MARKET_PREVIEW.MODIFIER" }), field: 'modifier' },
            { title: intl.formatMessage({ id: "CUSTOM_MARKET_PREVIEW.INTEMODIFIER" }), field: 'intemodifier' }
          ]}
          data={marketHistoryArrayToScreen ? marketHistoryArrayToScreen : []}
          options={{
            filtering: true,
            pageSize: 10,
            pageSizeOptions: [10, 25, 50, 100],
            searchFieldAlignment: 'right',
            actionsColumnIndex: -1,
            headerStyle: { position: 'sticky', top: 0 },
            maxBodyHeight: '600px',
            padding: 2
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
              emptyDataSourceMessage: 'No hay datos disponibles',
            },


          }}
          components={{
            Toolbar: props => (
              <div style={{ padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flexGrow: 1 }}>
                  <MTableToolbar {...props} />
                </div>
              </div>
            )
          }}
        />
      </Popover>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    customMarketPageView: state.mercados.customMarketPageView,
    marketHistoryArray: state.mercados.marketHistoryArray,
    marketHistoryArrayToScreen: state.mercados.marketHistoryArrayToScreen


  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(CustomMarketAction));