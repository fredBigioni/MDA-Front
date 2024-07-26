import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from '../_redux/mercadosActions';
import { injectIntl } from "react-intl";
import { Grid } from '@material-ui/core'
import VirtualizedCheckbox from '../../../components/ListCheckbox'
import ActionTabDialog from './ActionTabDialog'
import { MarketAssignForm } from './Forms'
import { useStyles } from '../../../Style/GeneralStyles';

const CustomMarketTabContainer = (props) => {
    const clases = useStyles()
    const { intl, customMarket, linegroups, loadingLinegroups } = props
    const [ formLoading, setFormLoading ] = React.useState(false)
    const [ formHasBeenSubmited, setFormHasBeenSubmited ] = React.useState(false)
    const [ loadingLines, setLoadingLines] = React.useState(false);
    const [ lines, setLines ] = React.useState([])
    const [ linesSelected, setLinesSelected] = React.useState([])
    const [ loadingCustomMarkets, setLoadingCustomMarkets] = React.useState(false);
    const [ customMarkets, setCustomMarkets ] = React.useState([])
    const [ marketSelecteds, setMarketSelecteds ] = React.useState([])
    const [ dialogVisibleForMarketAssing, setDialogVisibleForMarketAssing ] = React.useState(false);
    const [ marketAssignType, setMarketAssignType ] = React.useState('')
    const [ marketAssignItems, setMarketAssignItems ] = React.useState([])

    const getAll = async() => {
        await props.getLineGroups();
    }

    React.useEffect(() => {
        return () => {
            reloadLineGroupVirtualizedCheckbox()
          }
    },[customMarket.data?.code])

    React.useEffect(() => {
        if (!linegroups) {
            getAll()
        }
    },[])


    React.useEffect(() => {
        getCustomMarketsByLine()
     }, [lines]);      

     const reloadLineGroupVirtualizedCheckbox = () => {
        props.dispatchLineGroupsLoading(true)
        if (linegroups) {
            let lineGroupsAllUnchecked = linegroups.map(l => ({ ...l, checked: false }));
            props.dispatchLineGroups(lineGroupsAllUnchecked)
            onSelectLineGroup([])
            onSelectLine([])
            onSelectMarkets([])
        }
        props.dispatchLineGroupsLoading(false)
    }

    const reloadCustomMarketVirtualizedCheckbox = async () => {

        setLinesSelected([])
        let linesCodes = []

        linesSelected.map(lineItem => {
            let line = getItemObject(lineItem)
            linesCodes.push(line.code)
        })
        
        await getCustomMarketsByLine(linesCodes, true)
    }    

    const closeDialog = () => {

        setFormHasBeenSubmited(false)
        setDialogVisibleForMarketAssing(false)
        setMarketAssignType('')
        setMarketAssignItems([])
    }

    const submitForm = React.useCallback(
        () => {
            setFormHasBeenSubmited(true)
        },
        []
    );

    const getLinesByLineGroup = async (lineGroupCodes) => {
        setLoadingLines(true)
        let linePreviousSelecteds = lines.filter(x => x.checked ==true)
        await props.getLinesByLineGroup(lineGroupCodes.join(',')) 
            .then(async (linesResponse) => {
                let lines = linesResponse.map(line => {
                    if (linePreviousSelecteds.some(x => x.value == line.value)) {
                        line.checked = true
                    }
                    return line
                })            
                setLines(lines)
                setLoadingLines(false)
        })    
    }

    const getCustomMarketsByLine = async (lineCodes, resetChecked = false) => {
        if (lineCodes == null || lineCodes == undefined) {
            lineCodes = []
            let linesPreviousSelecteds = lines.filter(pfItem => pfItem.checked == true)
            linesPreviousSelecteds.map(lineItem => {            
                let line = getItemObject(lineItem)
                lineCodes.push(line.code)
            })

            if (lineCodes.length == 0) {
                setCustomMarkets([])
                setMarketSelecteds([]);
                return
            }
        }

        setLoadingCustomMarkets(true)

        let customMarketPreviousSelecteds = !resetChecked ? customMarkets.filter(x => x.checked ==true) : []
        await props.getCustomMarketsByLine(lineCodes.join(',')) 
            .then((customMarketsResponse) => {
                let customMarkets = customMarketsResponse.map(customMarket => {
                    if (customMarketPreviousSelecteds.some(x => x.value == customMarket.value)) {
                        customMarket.checked = true
                    }
                    return customMarket
                })            
                setCustomMarkets(customMarkets)
                setMarketSelecteds(customMarkets.filter(x => x.checked === true));
                setLoadingCustomMarkets(false)
        })    
    }    

    const onSelectLineGroup = async(items) => {
        let lineGroupCodes = []
        let itemsChecked = items.filter(x => x.checked === true);

        itemsChecked.map(lineGroupItem => {
            let lineGroup = getItemObject(lineGroupItem)
            lineGroupCodes.push(lineGroup.code)    
        })
        
        if(lineGroupCodes.length > 0) {
            await getLinesByLineGroup(lineGroupCodes)
        } else {
            setLines([])
            setCustomMarkets([])
        }
    }


    const onSelectLine = async(items) => {
        let linesCodes = []
        let itemsChecked = items.filter(x => x.checked === true);

        itemsChecked.map(lineItem => {
            let line = getItemObject(lineItem)
            linesCodes.push(line.code)
        })

        setLinesSelected(itemsChecked)

        if(linesCodes.length > 0) {
            await getCustomMarketsByLine(linesCodes)
        } else {
            setCustomMarkets([])
        }
        
    }
    const onSelectItemFromMenu = (action) => {
        if(action == 'marketAssignFromMarkets') {
            if(marketSelecteds.length > 0) {
                setMarketAssignItems(marketSelecteds)
                setMarketAssignType(action)
                setDialogVisibleForMarketAssing(true)
            }
        }
    }

    const onSelectMarkets =async(items) => {
        let marketCodes = [];
        let itemsChecked = items.filter(x => x.checked === true);
        
        itemsChecked.map(marketItem => {          
            let market = getItemObject(marketItem)
            if (market.code) {
                marketCodes.push(market.code)
            }
        })
        setMarketSelecteds(itemsChecked);
    }

    return (
        <div style={{height:'350px'}}>
                <div style={{height:'350px'}}>
                    <Grid container spacing={1}>
                        <Grid item xs={3} className="pr-0">
                            <div style={{width:'100%', height:305, marginRight:0, paddingRight: 0}}>
                                <VirtualizedCheckbox
                                    items={linegroups}
                                    isLoading={loadingLinegroups}
                                    title={intl.formatMessage({id: "CUSTOM_MARKET_TAB.SEARCH.LINE_GROUP"})}
                                    onChange={onSelectLineGroup}
                                    onSelectAllChange={ () => console.log('')}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={3} className="pr-0">
                            <div style={{width:'100%', height:305, marginRight:0, paddingRight: 0}}>
                                <VirtualizedCheckbox
                                    items={lines}
                                    isLoading={loadingLinegroups || loadingLines}
                                    title={intl.formatMessage({id: "CUSTOM_MARKET_TAB.SEARCH.LINE"})}
                                    onChange={onSelectLine}
                                />
                            </div>
                            
                        </Grid>
                        <Grid item xs={6} className="pr-0">
                            <div style={{width:'100%', height:305, marginRight:0, paddingRight: 0}}>
                                <VirtualizedCheckbox
                                    items={customMarkets}
                                    isLoading={loadingLinegroups || loadingLines || loadingCustomMarkets}
                                    title={intl.formatMessage({id: "CUSTOM_MARKET_TAB.SEARCH.CUSTOM_MARKET"})}
                                    onChange={onSelectMarkets}
                                    onSelectItemFromMenu={onSelectItemFromMenu}
                                    options={[
                                        {title: intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.ASSIGN_CUSTOM_MARKET"}), action:'marketAssignFromMarkets'}
                                    ]}
                                />
                            </div>
                        </Grid>
                    </Grid>
                    <ActionTabDialog
                        title={intl.formatMessage({id: "CUSTOM_MARKET_TAB.ACTION.ASSIGN_CUSTOM_MARKET"})}
                        onAccept={submitForm}
                        onCancel={closeDialog}
                        btnDisabled={() => console.log('')}
                        isLoading={formLoading}
                        visible={dialogVisibleForMarketAssing}
                    >
                        <MarketAssignForm 
                            formHasBeenSubmited={formHasBeenSubmited} 
                            onChangeStatusForm={() => setFormHasBeenSubmited(false)}
                            customMarketType={marketAssignType}
                            itemsSelecteds={marketAssignItems} 
                            onChangeLoadingForm={(loading) => setFormLoading(loading)}
                            onClose={ async ()=> {
                                    closeDialog()
                                    await reloadCustomMarketVirtualizedCheckbox()
                                }
                            }
                        />
                    </ActionTabDialog>
                </div>
        </div>
    )
    
}

function mapStateToProps(state) {
  
  return { 
        customMarket: state.mercados.customMarket,
        linegroups: state.mercados.linegroups,
        loadingLinegroups: state.mercados.loadingLinegroups
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

function getItemObject(item) {
    return JSON.parse(atob(item.value))
}

export default injectIntl(connect(mapStateToProps,mapDispatchToProps)(CustomMarketTabContainer));