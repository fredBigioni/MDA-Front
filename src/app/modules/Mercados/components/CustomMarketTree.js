import React from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from '../_redux/mercadosActions';
import { FormattedMessage } from "react-intl";
import { Treebeard } from '../../../components/Tree';
import Loader from '../../../components/Tree/components/Decorators/Loader';
import * as filters from '../../../components/Tree/util/filter';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import { Menu, Item, contextMenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import LineGroupDialog from './LineGroupDialog'
import LineDialog from './LineDialog'
import CustomMarketDialog from './CustomMarketDialog'
import Can from './../../../config/Can';
import { useStyles } from '../../../Style/GeneralStyles';
import TrafficLightIcon from '../../../components/Tree/components/Semaforo/TrafficLightIcon';
import { CustomLoader } from './CustomLoader';


const CustomMarketTree = (props) => {

    const clases = useStyles()
    const { customMarket, customMarketTree } = props;
    const [loading, setLoading] = React.useState(true)
    const [allCustomMarkets, setAllCustomMarkets] = React.useState([])
    const [customMarketsData, setCustomMarkets] = React.useState([])
    const [data, setData] = React.useState([])
    const [cursor, setCursor] = React.useState(false);
    const [openCreateLineGroupModal, setOpenCreateLineGroupModal] = React.useState(false);
    const [lineGroupSelected, setLineGroupSelected] = React.useState(null);
    const [openLineDialog, setOpenLineDialog] = React.useState(false);
    const [lineSelected, setLineSelected] = React.useState(null);
    const [openCustomMarketDialog, setOpenCustomMarketDialog] = React.useState(false);

    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { isLoading } = useSelector(state => state.mercados);

    const getItemObject = (item) => {
        let copyItem = JSON.parse(JSON.stringify(item))
        let keyObj = JSON.parse(atob(copyItem.key))
        copyItem.key = keyObj.key
        return copyItem
    }

    const handleCloseCreateLineGroupModal = () => {
        setOpenCreateLineGroupModal(false);
    };

    const handleOpenCreateLineGroupModal = (event, selectedItem) => {
        let item = null
        if (selectedItem != undefined && selectedItem != null) {
            item = getItemObject(selectedItem)
        }
        setLineGroupSelected(item);
        setOpenCreateLineGroupModal(true);
    };

    const handleCloseLineDialog = () => {
        setOpenLineDialog(false);
    };

    const handleOpenLineDialog = (event, selectedItem) => {
        let item = null
        if (selectedItem != undefined && selectedItem != null) {
            item = getItemObject(selectedItem)
        }

        setLineSelected(item);
        setLineGroupSelected(null);
        setOpenLineDialog(true);
    };

    const handleSignAllMarkets = async (event, selectedItem) => {
        const lineCode = selectedItem.code;
        const userId = user.id;

        await Promise.all([props.signAll(lineCode, userId, selectedItem.children.length)]);
    }

    const handleOpenEditLineDialog = (event, selectedItem) => {
        let item = null
        if (selectedItem != undefined && selectedItem != null) {
            item = getItemObject(selectedItem)
        }

        setLineSelected(null);
        setLineGroupSelected(item);
        setOpenLineDialog(true);
    };

    const handleCloseCustomMarketDialog = () => {
        setOpenCustomMarketDialog(false);
    };

    const handleOpenCustomMarketDialog = (event, selectedItem) => {

        let item = null
        if (selectedItem != undefined && selectedItem != null) {
            item = getItemObject(selectedItem)
        }
        setLineSelected(item);
        setOpenCustomMarketDialog(true);
    };

    const getCustomerMarkets = async () => {
        if (props.customMarketTree.isLoading === false) {
            setAllCustomMarkets(props.customMarketTree.data)
            setCustomMarkets(props.customMarketTree.data)
            setData(generateNodeTree(props.customMarketTree.data))
            setLoading(false)


        }
    }

    React.useEffect(() => {
        getCustomerMarkets()
    }, [customMarketTree])

    const onSelectCustomMarketManage = async (market) => {
        props.setCustomMarketPageView('manage')
        props.setMarketTreeVisible(false);
        await Promise.all([props.getCustomMarketByCode(market.customerMarket.customMarketCode), props.getCustomMarketGroupByCustomMarketCode(market.customerMarket.customMarketCode)])
    }

    const onSelectCustomMarketPreview = async (market) => {
        props.setCustomMarketPageView('preview')
        props.setMarketTreeVisible(false);
        await Promise.all([props.getCustomMarketByCode(market.customerMarket.customMarketCode), props.getCustomMarketGroupByCustomMarketCode(market.customerMarket.customMarketCode)])
    }

    const generateNodeTree = (nodes) => {
        const treeData = { id: 1, name: ' ', isroot: true, toggled: true };
        let lineGroupsTree = []
        let testMarketNode = null
        nodes.map(parent => {
            let childNodes = []
            let lineGroupKey = { key: parent.lineGroupCode, type: 'linegroup', name: parent.lineGroupDescription.toUpperCase() }
            let lineGroupKeyEncoded = btoa(JSON.stringify(lineGroupKey));
            if (parent.lines.length == 1 && parent.lines[0].lineDescription == undefined) {
                lineGroupsTree.push({ key: lineGroupKeyEncoded, type: 'linegroup', name: parent.lineGroupDescription.toUpperCase(), children: [], active: true, isTest: parent.lineGroupCode == undefined })
            } else {
                parent.lines.map(child => {
                    let marketNodes = []
                    child.customMarkets.map(childMarket => {
                        if (childMarket.customMarketCode) {
                            marketNodes.push({
                                key: childMarket.customMarketCode,
                                value: {
                                    customerMarket: childMarket,
                                    lineDescription: child.lineDescription,
                                    lineGroupCode: parent.lineGroupDescription
                                },
                                name: (<>
                                    {childMarket.customMarketDescription.toUpperCase()}
                                    <TrafficLightIcon signed={childMarket.signed} signedUser={childMarket.signedUser} /></>),
                                signed: childMarket.signed,
                            })
                        }
                    })
                    let lineKey = { key: child.lineCode, type: 'line', name: child.lineDescription.toUpperCase() }
                    let lineKeyEncoded = btoa(JSON.stringify(lineKey));
                    childNodes.push({ key: lineKeyEncoded, type: 'line', code: child.lineCode, name: child.lineDescription.toUpperCase(), children: marketNodes, active: true, isTest: child.lineCode == undefined })
                })

                if (parent.lineGroupCode == undefined) {
                    testMarketNode = { key: lineGroupKeyEncoded, type: 'linegroup', name: parent.lineGroupDescription.toUpperCase(), children: childNodes, active: true, isTest: parent.lineGroupCode == undefined }
                } else {
                    lineGroupsTree.push({ key: lineGroupKeyEncoded, type: 'linegroup', name: parent.lineGroupDescription.toUpperCase(), children: childNodes, active: true, isTest: parent.lineGroupCode == undefined })
                }
            }
        })

        if (testMarketNode) {
            lineGroupsTree.push(testMarketNode)
        }

        treeData.children = lineGroupsTree;
        return treeData;
    }

    const onToggle = (node, toggled) => {
        if (cursor) {
            cursor.active = false;
        }
        node.active = true;
        if (node.children) {
            node.toggled = toggled;
        }
        setCursor(node);
        setData(Object.assign({}, data))
    }

    const onFilterKeyUp = (e) => {
        let treeData = generateNodeTree(customMarketsData);
        const filter = e.target.value.toLowerCase().trim();
    
        if (!filter) {
            return setData(treeData);
        } else {
            let filtered = filters.filterTree(treeData, filter);
            setData(filtered);
        }
    };

    const show = (id, e) => {
        contextMenu.show({
            id,
            event: e
        })
    }


    const showIconTree = (active, type, onClick) => {
        if (type == 'linegroup') {
            if (active) {
                return <KeyboardArrowDownIcon onClick={onClick} style={{ cursor: 'pointer' }} />
            } else {
                return <KeyboardArrowRightIcon onClick={onClick} style={{ cursor: 'pointer' }} />
            }
        }
        if (type == 'line') {
            if (active) {
                return <KeyboardArrowDownIcon onClick={onClick} style={{ cursor: 'pointer' }} />
            } else {
                return <KeyboardArrowRightIcon onClick={onClick} style={{ cursor: 'pointer' }} />
            }
        }

    }
    const decorators = {

        Container: (subprops) => {
            if (subprops && subprops.node.children) {
                let { type, key } = subprops.node;
                return (
                    <>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            height: 30,
                            marginBottom: (subprops.node && subprops.node.isroot) ? '10px' : '4px',
                        }}
                        >
                            {subprops.node && subprops.node.isroot &&
                                <>
                                    <Can I="view" a="custom-market-tree-action">
                                        <div
                                            className="position-absolute pt-1 pl-1 pr-10 ml-6 mb-2 justify-content-start text-dark"
                                            style={{ backgroundColor: 'rgb(58 61 64 / 68%)', minWidth: '380px', height: '31px', borderRadius: '4px', cursor: 'pointer' }}
                                            onClick={handleOpenCreateLineGroupModal}
                                        >
                                            <span className="pl-0 ml-0 font-italic">
                                                <IconButton size='small' aria-label="" style={{ color: 'rgb(197 218 239)' }}>
                                                    <AddIcon />
                                                    <span style={{ fontSize: '0.875rem' }} className="pl-3">
                                                        <FormattedMessage id="CUSTOM_MARKET_TREE.ACTION.LINE_GROUP.CREATE" />
                                                    </span>
                                                </IconButton>
                                            </span>
                                        </div>
                                    </Can>
                                    <LineGroupDialog open={openCreateLineGroupModal} handleClose={handleCloseCreateLineGroupModal} lineGroupSelected={lineGroupSelected} />
                                    <LineDialog open={openLineDialog} handleClose={handleCloseLineDialog} lineSelected={lineSelected} lineGroupSelected={lineGroupSelected} />
                                    <CustomMarketDialog open={openCustomMarketDialog} handleClose={handleCloseCustomMarketDialog} customMarket={null} lineSelected={lineSelected} isActionClone={false} />
                                </>
                            }
                            {subprops.node && !subprops.node.isroot &&
                                <>
                                    <Button
                                        className="justify-content-start text-dark pr-5"
                                        style={type == 'linegroup' ?
                                            ({ backgroundColor: 'rgb(23 107 193 / 40%)', minWidth: '380px' }) :
                                            ({ backgroundColor: 'rgb(23 107 193 / 15%)', minWidth: '345px' })
                                        }
                                        onClick={() => subprops.onClick}
                                        onContextMenu={(e) => show(subprops.node.key, e)}
                                    >
                                        {showIconTree(subprops.node.toggled, subprops.node.type, subprops.onClick)}
                                        <span style={{ marginLeft: 10, cursor: 'pointer', width: '100%', textAlign: 'left' }} onClick={subprops.onClick} onContextMenu={(e) => show(subprops.node.key, e)}>{subprops.node.name}</span>
                                    </Button>
                                    <Can I="view" a="custom-market-tree-action">
                                        <Menu id={subprops.node.key}>
                                            <>
                                                {subprops.node.type == 'line' &&
                                                    <>
                                                        <Item
                                                            onClick={(event) => handleOpenLineDialog(event, subprops.node)}
                                                            disabled={subprops.node.isTest ? 'disabled' : ''}
                                                        >
                                                            <FormattedMessage id="CUSTOM_MARKET_TREE.ACTION.LINE.EDIT" />
                                                        </Item>
                                                        <Item
                                                            onClick={(event) => handleOpenCustomMarketDialog(event, subprops.node)}
                                                        >
                                                            <FormattedMessage id="CUSTOM_MARKET_TREE.ACTION.CUSTOM_MARKET.CREATE" />
                                                        </Item>
                                                        <Item
                                                            onClick={(event) => handleSignAllMarkets(event, subprops.node)}
                                                        >
                                                            <FormattedMessage id="CUSTOM_MARKET_TREE.ACTION.CUSTOM_MARKET.SIGN_ALL" />
                                                        </Item>
                                                    </>
                                                }
                                                {subprops.node.type == 'linegroup' &&
                                                    <>
                                                        <Item
                                                            onClick={(event) => handleOpenCreateLineGroupModal(event, subprops.node)}
                                                            disabled={subprops.node.isTest ? 'disabled' : ''}
                                                        >
                                                            <FormattedMessage id="CUSTOM_MARKET_TREE.ACTION.LINE_GROUP.EDIT" />
                                                        </Item>
                                                        <Item onClick={(event) => handleOpenEditLineDialog(event, subprops.node)}>
                                                            <FormattedMessage id="CUSTOM_MARKET_TREE.ACTION.LINE.CREATE" />
                                                        </Item>
                                                    </>
                                                }
                                            </>
                                        </Menu>
                                    </Can>
                                </>
                            }
                        </div>
                    </>
                );

            } else {
                return (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        height: 30
                    }}
                    >
                        <Can not I="view" a="manage-custom-market">
                            <span style={{ marginLeft: 10, cursor: 'pointer', width: '100%', textAlign: 'left', fontSize: '12px' }} onClick={() => onSelectCustomMarketPreview(subprops.node.value)}>{subprops.node.name}</span>
                        </Can>
                        <Can I="view" a="manage-custom-market">
                            <span style={{ marginLeft: 10, cursor: 'pointer', width: '100%', textAlign: 'left', fontSize: '12px' }} onClick={() => onSelectCustomMarketManage(subprops.node.value)}>{subprops.node.name}</span>
                        </Can>
                    </div>
                );

            }
        }
    };

    return (
        <div>
            {isLoading && <CustomLoader />}

            {loading &&
                <Loader />
            }
            {!loading && Object.keys(customMarket.data).length > 0 &&
                <IconButton aria-label="" onClick={() => props.setMarketTreeVisible(false)} className="float-right">
                    <CloseIcon />
                </IconButton>
            }
            {!loading && customMarketsData.length > 0 &&
                <>
                    <div style={{ width: '380px' }} className="mb-5 ml-6">
                        <TextField
                            style={{ width: '100%' }}
                            id="filterTree"
                            label='Buscar'
                            variant="outlined"
                            onKeyUp={onFilterKeyUp}
                            autoComplete="off"
                        />
                    </div>
                    <Treebeard
                        data={data}
                        onToggle={onToggle}
                        style={styles}
                        decorators={decorators}
                    />
                </>
            }
        </div>
    )

}

const styles = {
    tree: {
        base: {
            listStyle: 'none',
            backgroundColor: '#fff',
            margin: 0,
            padding: 0,
            color: '#000',
            fontFamily: 'lucida grande ,tahoma,verdana,arial,sans-serif',
            fontSize: '14px'
        },
        node: {
            base: {
                position: 'relative'
            },
            link: {
                cursor: 'pointer',
                position: 'relative',
                padding: '0px 5px',
                display: 'block'
            },
            activeLink: {
                background: '#fff'
            },
            toggle: {
                base: {
                    position: 'relative',
                    display: 'inline-block',
                    verticalAlign: 'top',
                    marginLeft: '-5px',
                    height: '24px',
                    width: '24px'
                },
                wrapper: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    margin: '-7px 0 0 -7px',
                    height: '14px'
                },
                height: 14,
                width: 14,
                arrow: {
                    fill: '#9DA5AB',
                    strokeWidth: 0
                }
            },
            header: {
                base: {
                    display: 'inline-block',
                    verticalAlign: 'top',
                    color: '#000'
                },
                connector: {
                    width: '2px',
                    height: '12px',
                    borderLeft: 'solid 2px black',
                    borderBottom: 'solid 2px black',
                    position: 'absolute',
                    top: '0px',
                    left: '-21px'
                },
                title: {
                    lineHeight: '24px',
                    verticalAlign: 'middle'
                }
            },
            subtree: {
                listStyle: 'none',
                paddingLeft: '19px'
            },
            loading: {
                color: '#E2C089'
            }
        }
    }
}

const mapStateToProps = (state) => {
    return {
        customMarket: state.mercados.customMarket,
        customMarketTree: state.mercados.customMarketTree,
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(CustomMarketTree));