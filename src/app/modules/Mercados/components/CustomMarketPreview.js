import React from 'react';
import { connect, shallowEqual, useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from './../_redux/mercadosActions';
import Grid from '@material-ui/core/Grid';
import { FormattedMessage, injectIntl } from "react-intl";
import MaterialTable from 'material-table';
import { CustomMarketPreviewDialog } from './CustomMarketPreview/index' 
import IconButton from '@material-ui/core/IconButton';
import Can from './../../../config/Can';
import { customMarketDetailDefault } from '../customMarketDetailDefault'
import { useStyles } from '../../../Style/GeneralStyles';
import { actionTypes } from '../_redux/mercadosRedux';


const CustomMarketPreview = (props) => {
  const clases = useStyles()
  const dispatch = useDispatch();
  const {customMarket, customMarketPageView, intl, marketPreviewData  } = props;  
  const [ isLoading, setLoading ] = React.useState(true)
//   const [ marketPreviewData, setMarketPreviewData ] = React.useState([])
  const [ allowedPermission, setAllowedPermission ] = React.useState(false)
  const [ itemsToDelete, setItemsToDelete ] = React.useState([])
  const [ itemsToEdit, setItemsToEdit ] = React.useState([])
  const [ visibleButtonsToolbar,  setVisibleButtonsToolbar ] = React.useState(false)
 
  

  const onCancel = async() => {
    await getCustomMarketsPreview()
    // await getHistoricCustomMarketsPreview()
    setItemsToDelete([])
    setItemsToEdit([])
    setVisibleButtonsToolbar(false)
    props.actionCustomMarketPreviewReset()
  }
  const getCustomMarketsPreview = async() => {

      if(customMarketPageView.view == 'preview') {
          setLoading(true)
          let preview = await props.getCustomMarketsPreview(customMarket.data.code)
          preview = preview.map( item => {
            item.modifier = item.modifier.toString().replace('.', ',')
            item.intemodifier = item.intemodifier.toString().replace('.', ',')
            return item
          })
          dispatch({type: actionTypes.RECEIVE_PREVIEW_DATA, data: preview })
          setLoading(false)
      }
  }

  const deleteCustomMarket = async(customMarketPreviewItem) => {
    customMarketPreviewItem.customMarketGroupCode = null; 
    customMarketPreviewItem.itemCondition = 'N'; 
    let itemIndex = marketPreviewData.findIndex(x => x.id === customMarketPreviewItem.id)
    marketPreviewData.splice(itemIndex, 1);
    setItemsToDelete([...itemsToDelete, customMarketPreviewItem])
    dispatch({type: actionTypes.RECEIVE_PREVIEW_DATA, data: marketPreviewData })
    props.actionCustomMarketPreviewReset()
    setVisibleButtonsToolbar(true)
}
const updateCustomMarket = async(customMarketSelectedItem) => {
    setItemsToEdit([...itemsToEdit, customMarketSelectedItem])
    props.actionCustomMarketPreviewReset()
    let oldMarketPreviewData = marketPreviewData;
    marketPreviewData.map((customMarketItems,index) => {
        if(customMarketItems.id == customMarketSelectedItem.id) {
            marketPreviewData[index].resume = customMarketSelectedItem.resume;
            marketPreviewData[index].graph  = customMarketSelectedItem.graph;
            marketPreviewData[index].expand = customMarketSelectedItem.expand;
            marketPreviewData[index].ensureVisible  = customMarketSelectedItem.ensureVisible;
            marketPreviewData[index].intemodifier   = customMarketSelectedItem.intemodifier;
            marketPreviewData[index].modifier       = customMarketSelectedItem.modifier;
            marketPreviewData[index].pattern       = customMarketSelectedItem.pattern;
            marketPreviewData[index].productTypeCode    = customMarketSelectedItem.productTypeCode;
        }
    })
    dispatch({type: actionTypes.RECEIVE_PREVIEW_DATA, marketPreviewData: [...oldMarketPreviewData, marketPreviewData] })
    setVisibleButtonsToolbar(true)
  }

  React.useEffect(() => {
    getCustomMarketsPreview()
    // getHistoricCustomMarketsPreview()
  }, [customMarketPageView.view])

  const onSave = async() => {
    setLoading(true)
    let copyCustomMarket = JSON.parse(JSON.stringify(customMarket.data)) 

    if(itemsToDelete.length > 0) {
        itemsToDelete.map(marketToAdd => {
            const existProductPresentation = copyCustomMarket.customMarketDetail.filter(x => x.customMarketGroupCode == null && x.productPresentationCode == marketToAdd.productPresentationCode)
            if(existProductPresentation && existProductPresentation.length) {
                const findProductpresentation = copyCustomMarket.customMarketDetail.findIndex(x => x.productPresentationCode === existProductPresentation[0].productPresentationCode)
                copyCustomMarket.customMarketDetail[findProductpresentation].itemCondition = 'N';
            }else{
                let customMarketDetailValues  = customMarketDetailDefault()
                customMarketDetailValues.productPresentationCode = marketToAdd.productPresentationCode;
                customMarketDetailValues.customMarketGroupCode = null;
                customMarketDetailValues.itemCondition = 'N';
                copyCustomMarket.customMarketDetail.push(customMarketDetailValues)
            }
        })
    }
    if(itemsToEdit.length > 0) {
        itemsToEdit.map(prodPresentationItem => {
            const existProductPresentation = copyCustomMarket.customMarketDetail.filter(x => x.customMarketGroupCode == null && x.productPresentationCode == prodPresentationItem.productPresentationCode)
            if(existProductPresentation && existProductPresentation.length) {
                const findProductpresentation = copyCustomMarket.customMarketDetail.findIndex(x => x.productPresentationCode === existProductPresentation[0].productPresentationCode)
                if (prodPresentationItem.intemodifier !== "") {
                    copyCustomMarket.customMarketDetail[findProductpresentation].intemodifier = prodPresentationItem.intemodifier
                }
                if (prodPresentationItem.modifier !== "") {
                    copyCustomMarket.customMarketDetail[findProductpresentation].modifier = prodPresentationItem.modifier
                }
                if (prodPresentationItem.ensureVisible !== "") {
                    copyCustomMarket.customMarketDetail[findProductpresentation].ensureVisible = prodPresentationItem.ensureVisible
                }
                if (prodPresentationItem.expand !== "") {
                    copyCustomMarket.customMarketDetail[findProductpresentation].expand = prodPresentationItem.expand
                }
                if (prodPresentationItem.graph !== "") {
                    copyCustomMarket.customMarketDetail[findProductpresentation].graph = prodPresentationItem.graph
                } 
                if (prodPresentationItem.resume !== "") {
                    copyCustomMarket.customMarketDetail[findProductpresentation].resume = prodPresentationItem.resume
                }
                if (prodPresentationItem.pattern !== "") {
                    copyCustomMarket.customMarketDetail[findProductpresentation].pattern = prodPresentationItem.pattern
                }
                if (prodPresentationItem.productTypeCode !== "") {
                    copyCustomMarket.customMarketDetail[findProductpresentation].productTypeCode = prodPresentationItem.productTypeCode
                }
                copyCustomMarket.customMarketDetail[findProductpresentation].itemCondition = 'O'
            }else{
                let customMarketDetailValues  = customMarketDetailDefault()
                customMarketDetailValues.productPresentationCode = prodPresentationItem.productPresentationCode;
                customMarketDetailValues.customMarketGroupCode = null;
                customMarketDetailValues.intemodifier = prodPresentationItem.intemodifier;
                customMarketDetailValues.modifier = prodPresentationItem.modifier;
                customMarketDetailValues.ensureVisible = prodPresentationItem.ensureVisible;
                customMarketDetailValues.expand = prodPresentationItem.expand;
                customMarketDetailValues.graph = prodPresentationItem.graph;
                customMarketDetailValues.resume = prodPresentationItem.resume;
                customMarketDetailValues.pattern = prodPresentationItem.pattern;
                customMarketDetailValues.productTypeCode = prodPresentationItem.productTypeCode;
                customMarketDetailValues.itemCondition = 'O';
                copyCustomMarket.customMarketDetail.push(customMarketDetailValues)
            }
        })
    }

    await props.updateCustomMarket(copyCustomMarket)
    setVisibleButtonsToolbar(false)
    setItemsToEdit([])
    setItemsToDelete([])
    await getCustomMarketsPreview()
    // await getHistoricCustomMarketsPreview()
      
    }
    const renderClass = (classCode) => {
        if(classCode == 1) {
            return intl.formatMessage({id: "MASTER.CLASS.ETICO.SHORT"})
        }
        if(classCode == 2) {
            return intl.formatMessage({id: "MASTER.CLASS.POPULAR.SHORT"})
        }
        return null;
    }
    const ButtonSave = () => {
        if(visibleButtonsToolbar) {
            return (
            <div
                id="btn_save_preview"
                className={`btn btn-secondary font-weight-bold px-2 pl-4 pr-4 py-0 mt-0 mb-2`}
                style={{fontWeight: '600'}}
                onClick={onSave}
            >
                <IconButton 
                    aria-label=""  
                    color="primary" 
                    className="p-3">
                    <span style={{color:'#17c191', fontSize: '14px'}}>
                        <FormattedMessage id="FORM.ACTION.SAVE" />
                    </span>
                </IconButton>
            </div>               
            )
        }
        return null
    }
    const ButtonCancel = () => {
        if(visibleButtonsToolbar) {
            return (
            <div
                id="btn_cancel_preview"
                className={`btn btn-secondary font-weight-bold px-2 pl-4 pr-4 py-0 mt-0 mb-2`}
                style={{fontWeight: '600'}}
                onClick={onCancel}
            >
                <IconButton 
                    aria-label=""  
                    color="primary" 
                    className="p-3">
                    <span style={{color:'#17c191', fontSize: '14px'}}>
                        <FormattedMessage id="FORM.ACTION.CANCEL" />
                    </span>
                </IconButton>
            </div>
            )
        }
        return null
    }
  
  return ( 
    <>  
    {customMarketPageView.view == 'preview' &&
        <>
            <Can I="view" a="manage-custom-market" passThrough>
                {(allowed) => setAllowedPermission(allowed)}
            </Can>
            <Grid item xs={12} className="p-0">
                {
                (!customMarket.isLoading && Object.keys(customMarket.data).length > 0) &&
                    <>
                        <MaterialTable
                            title=''
                            isLoading={isLoading}
                            columns={[
                                {title: intl.formatMessage({id: "CUSTOM_MARKET_PREVIEW.CODE.SHORT"}), field: 'id'},
                                {title: intl.formatMessage({id: "CUSTOM_MARKET_PREVIEW.LABORATORY.SHORT"}), field: 'labDescription' },
                                {
                                    title: intl.formatMessage({id: "LABORATORY_GROUP.FORM_CLASS"}), 
                                    field: 'classCode',
                                    render: rowData => renderClass(rowData.classCode)
                                },
                                {title: intl.formatMessage({id: "CUSTOM_MARKET_PREVIEW.BUSINESS_UIT.SHORT"}), field: 'businessUnit' },
                                {title: intl.formatMessage({id: "CUSTOM_MARKET_PREVIEW.TERAPEUTICAL_CLASS"}), field: 'tcCode' },
                                {title: intl.formatMessage({id: "CUSTOM_MARKET_PREVIEW.DRUG"}), field: 'drug' },
                                {title: intl.formatMessage({id: "CUSTOM_MARKET_PREVIEW.PHARMACEUTICAL_FORM"}), field: 'pfCode' },
                                {
                                    title: intl.formatMessage({id: "CUSTOM_MARKET_PREVIEW.PRESENTATION"}), 
                                    field: 'productPresentationDescription', 
                                    cellStyle: {
                                        minWidth: '300px'
                                    }
                                },
                                {title: intl.formatMessage({id: "CUSTOM_MARKET_PREVIEW.ORDEN"}), field: 'orden' },
                                {title: intl.formatMessage({id: "CUSTOM_MARKET_GROUP_DIALOG.GROUP_CONDITION"}), field: 'itemCondition' },
                                {title: intl.formatMessage({id: "CUSTOM_MARKET_DETAIL.PATTERN"}), field: 'pattern' },
                                {
                                    title: intl.formatMessage({id: "CUSTOM_MARKET_DETAIL.ENSURE_VISIBLE"}), 
                                    field: 'ensureVisible',
                                    render: rowData => rowData.ensureVisible == true ? intl.formatMessage({id: "MASTER.YES"}) : intl.formatMessage({id: "MASTER.NO"})
                                },
                                {
                                    title: intl.formatMessage({id: "CUSTOM_MARKET_DETAIL.GRAPHS"}), 
                                    field: 'graph',
                                    render: rowData => rowData.graph == true ? intl.formatMessage({id: "MASTER.YES"}) : intl.formatMessage({id: "MASTER.NO"})
                                },
                                {
                                    title: intl.formatMessage({id: "CUSTOM_MARKET_DETAIL.RESUME"}), 
                                    field: 'resume',
                                    render: rowData => rowData.resume == true ? intl.formatMessage({id: "MASTER.YES"}) : intl.formatMessage({id: "MASTER.NO"})
                                },
                                {
                                    title: intl.formatMessage({id: "CUSTOM_MARKET_DETAIL.EXPAND"}), 
                                    field: 'expand',
                                    render: rowData => rowData.expand == true ? intl.formatMessage({id: "MASTER.YES"}) : intl.formatMessage({id: "MASTER.NO"})
                                },
                                {title: intl.formatMessage({id: "CUSTOM_MARKET_PREVIEW.MODIFIER"}), field: 'modifier'},
                                {title: intl.formatMessage({id: "CUSTOM_MARKET_PREVIEW.INTEMODIFIER"}), field: 'intemodifier',}
                            ]}
                            data={marketPreviewData ? marketPreviewData : []}
                            options={{
                                filtering: true,
                                pageSize: 10,
                                pageSizeOptions: [10,25,50, 100],
                                searchFieldAlignment: 'left',
                                actionsColumnIndex: -1,
                                headerStyle: { position: 'sticky', top: 0 },
                                maxBodyHeight: '500px'
                            }}
                            actions={
                                allowedPermission &&
                                [{
                                    icon: 'edit',
                                    tooltip: intl.formatMessage({id: "ACTION.EDIT"}),
                                    onClick: (event, rowData) => props.setActionCustomMarketPreview({type: 'edit', visible: true, item:rowData })
                                },
                                {
                                    icon: 'delete',
                                    tooltip: intl.formatMessage({id: "FORM.ACTION.DELETE"}),
                                    onClick: (event, rowData) => props.setActionCustomMarketPreview({type: 'delete', visible: true, item:rowData }) 
                                },
                                {
                                    icon: () => <ButtonCancel />,
                                    tooltip: intl.formatMessage({id: "FORM.ACTION.CANCEL"}),
                                    isFreeAction: true,
                                },
                                {
                                    icon: () => <ButtonSave />,
                                    tooltip: intl.formatMessage({id: "FORM.ACTION.SAVE"}),
                                    isFreeAction: true,
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
                        <CustomMarketPreviewDialog onDelete={deleteCustomMarket} onUpdate={updateCustomMarket} />
                    </>
                }               
            </Grid>         
        </>
    }
    </>
  );
};

const mapStateToProps = (state) => {
    return {
        customMarket: state.mercados.customMarket,
        customMarketPageView: state.mercados.customMarketPageView,
        marketPreviewData:state.mercados.marketPreviewData
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}
export default injectIntl(connect(mapStateToProps,mapDispatchToProps)(CustomMarketPreview));