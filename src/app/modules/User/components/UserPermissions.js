import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from '../_redux/Actions';
import { FormattedMessage } from "react-intl";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import IconButton from '@material-ui/core/IconButton';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { useStyles } from '../../../Style/GeneralStyles';

/* eslint-disable react/jsx-one-expression-per-line */
const UserPermission = (props) => {
    const { user } = props;
    const clases = useStyles()
    const [ stateClicked, setStateClicked ] = React.useState({})
    const [ stateChecked, setStateChecked ] = React.useState([])
    const [ stateExpanded, setStateExpanded ] = React.useState([])
    const [ fullTree, setFullTree ] = React.useState([])
    const [ userPermission, setUserPermission ] = React.useState([])
    const [isSaving, setIsSaving] = React.useState(false);
    const [switchFullAccess, setSwitchFullAccess] = React.useState(true);

    const handleChangeSwitchFullAccess = (event) => {
        setSwitchFullAccess(event.target.checked);
    }; 

    const getCustomMarketsFullTree = async() => {
        let customMarketsFullTree = await props.getCustomMarketsFullTree();
        let treeData = generateNodeTree(customMarketsFullTree)
        let userPermissions = await props.getUserPermissions(props.user);
        setUserPermission(userPermissions)
        setSwitchFullAccess(userPermissions.fullAccess)
        loadTreeChecked(userPermissions, treeData)
        //setLoading(false)
    }

    const generateNodeTree = (nodes) => {
        const treeData = []
         nodes.map(lineGroup => {
             if (lineGroup.lineGroupCode > -1) {
                let lines = []
                if (lineGroup.lines.length == 1 && JSON.stringify(lineGroup.lines[0].customMarkets) == "[{}]") {
                    lines = []
                } else {
                    lineGroup.lines.map(line => {
                        let customMarkets = []
                        line.customMarkets.map(customMarket => {
                            if (customMarket.customMarketCode) {
                                let customMarketKey = { value: customMarket.customMarketCode, type: 'custommarket' }
                                let customMarketKeyEncoded = btoa(JSON.stringify(customMarketKey));
                                customMarkets.push({value: customMarketKeyEncoded, label: customMarket.customMarketDescription.toUpperCase() })
                            }
                        })
                        let lineKey = { value: line.lineCode, type: 'line' }
                        let lineKeyEncoded = btoa(JSON.stringify(lineKey));
                        if (customMarkets.length > 0) {
                            lines.push({value: lineKeyEncoded, label: line.lineDescription, children: customMarkets })
                        } else {
                            lines.push({value: lineKeyEncoded, label: line.lineDescription.toUpperCase()})
                        }
                    })
                }
                let lineGroupKey = { value: lineGroup.lineGroupCode, type: 'linegroup'}
                let lineGroupKeyEncoded = btoa(JSON.stringify(lineGroupKey));
                if (lines.length > 0) {
                    treeData.push({value: lineGroupKeyEncoded, label: lineGroup.lineGroupDescription, children: lines })
                } else {
                    treeData.push({value: lineGroupKeyEncoded, label: lineGroup.lineGroupDescription.toUpperCase()})
                }
            }
         })
        
        setFullTree(treeData)
        return treeData
     }

    const loadTreeChecked = (userPermissions, treeData) => {
        let checked = []
        userPermissions.customMarketCodes.map(customMarketCode => {
            let customMarketKey = { value: customMarketCode, type: 'custommarket' }
            let customMarketKeyEncoded = btoa(JSON.stringify(customMarketKey));
            checked.push(customMarketKeyEncoded)
        })

        userPermissions.lineCodes.map(lineCode => {
            let lineKey = { value: lineCode, type: 'line' }
            let lineKeyEncoded = btoa(JSON.stringify(lineKey));
            checked.push(lineKeyEncoded)
            let lineFound = getLineInTree(lineKeyEncoded, treeData)
            if (lineFound.length > 0 && lineFound[0].children) {
                lineFound[0].children.map(customMarketCode => {
                    checked.push(customMarketCode.value)
                })
            }
        })
        
        userPermissions.lineGroupCodes.map(lineGroupCode => {
            let lineGroupKey = { value: lineGroupCode, type: 'linegroup' }
            let lineGroupKeyEncoded = btoa(JSON.stringify(lineGroupKey));
            checked.push(lineGroupKeyEncoded)
            let lineGroup = getLineGroupInTree(lineGroupKeyEncoded, treeData)
            if (lineGroup.children) {
                lineGroup.children.map(line => {
                    if (line.children) {
                        line.children.map(customMarketCode => {
                            checked.push(customMarketCode.value)
                        })
                    }
                })
            }
        })

        setStateChecked(checked)
    }

    const getLineInTree = (lineKeyEncoded, treeData) => {
        let lineFound = null
        treeData.forEach(lineGroup => {
            if (lineGroup.children) {
                let line = lineGroup.children.filter(l => l.value == lineKeyEncoded)
                if (line.length > 0) {
                    lineFound = line
                    return lineFound
                }
            }
        });

        return lineFound
    }

    const getLineGroupInTree = (lineGroupKeyEncoded, treeData) => {
        let lineGroupFound = null
        lineGroupFound = treeData.find(lg => lg.value == lineGroupKeyEncoded)
        return lineGroupFound
    }    

    const updateUserPermission = (checked,targetNode) => {
        let newUserPermission = userPermission
        let nodeKey = JSON.parse(atob(targetNode.value))
        
        if (nodeKey.type == 'linegroup') {
            const {customMarketCodes, lineCodes, lineGroupCodes} = getLineGroupChecked(targetNode, newUserPermission.lineGroupCodes, newUserPermission.lineCodes, newUserPermission.customMarketCodes) 
            newUserPermission.customMarketCodes = customMarketCodes
            newUserPermission.lineCodes = lineCodes
            newUserPermission.lineGroupCodes = lineGroupCodes

        } else if (nodeKey.type == 'line') {
            const {customMarketCodes, lineCodes, lineGroupCodes} = getLineChecked(checked, targetNode, newUserPermission.lineGroupCodes, newUserPermission.lineCodes, newUserPermission.customMarketCodes) 
            newUserPermission.customMarketCodes = customMarketCodes
            newUserPermission.lineCodes = lineCodes
            newUserPermission.lineGroupCodes = lineGroupCodes

        } else if (nodeKey.type == 'custommarket') {
            const {customMarketCodes, lineCodes, lineGroupCodes} = getCustomMarketChecked(fullTree, stateChecked, targetNode, newUserPermission.lineGroupCodes, newUserPermission.lineCodes, newUserPermission.customMarketCodes) 
            newUserPermission.customMarketCodes = customMarketCodes
            newUserPermission.lineCodes = lineCodes
            newUserPermission.lineGroupCodes = lineGroupCodes
        }

        setUserPermission(newUserPermission)
    }

    const getLineGroupChecked = (targetNode, lineGroupCodes, lineCodes, customMarketCodes) => {
        let nodeKey = JSON.parse(atob(targetNode.value))
        if (targetNode.checked) {
            lineGroupCodes.push(nodeKey.value)
        } else {
            lineGroupCodes = lineGroupCodes.filter(lg => lg !== nodeKey.value)
        }

        if (targetNode.children?.length > 0) {
            targetNode.children.map(line => {
                let nodeLineKey = JSON.parse(atob(line.value))
                lineCodes = lineCodes.filter(lg => lg !== nodeLineKey.value)
                if (line.children?.length > 0) {
                    line.children.map(customMarket => {
                        let nodeCustomMarketKey = JSON.parse(atob(customMarket.value))
                        customMarketCodes = customMarketCodes.filter(lg => lg !== nodeCustomMarketKey.value)
                    })
                }
            })
        }        

        return {lineGroupCodes, lineCodes, customMarketCodes}
    }

    const getLineChecked = (stateChecked, targetNode, lineGroupCodes, lineCodes, customMarketCodes) => {
        let nodeKey = JSON.parse(atob(targetNode.value))

        if (targetNode.checked) {

            let isFull = true
            let lineCodeChilden = []
            targetNode.parent.children.map(line => {
                if (!stateChecked.find(x => x == line.value)) {
                    isFull = false
                } else {
                    let nodeLineKey = JSON.parse(atob(line.value))
                    lineCodeChilden.push(nodeLineKey.value)
                }
            })
            if (isFull) {
                let nodeKeyParent = JSON.parse(atob(targetNode.parent.value))
                lineGroupCodes.push(nodeKeyParent.value)
                lineCodes = lineCodes.filter(l => lineCodeChilden.indexOf(l) < 0)   
            } else {
                lineCodes.push(nodeKey.value)
            }

        } else {

            let nodeKeyParent = JSON.parse(atob(targetNode.parent.value))
            
            if (lineGroupCodes.find(x => x == nodeKeyParent.value)) {
                lineGroupCodes = lineGroupCodes.filter(lg => lg !== nodeKeyParent.value)
                targetNode.parent.children.map(line => {
                    let nodeKeyLine = JSON.parse(atob(line.value))
                    if (nodeKey.value != nodeKeyLine.value) {
                        lineCodes.push(nodeKeyLine.value)
                    }
                })
            } else {
                lineCodes = lineCodes.filter(lg => lg !== nodeKey.value)
            }
        }        

        if (targetNode.children?.length > 0) {
            targetNode.children.map(customMarket => {
                let nodeCustomMarketKey = JSON.parse(atob(customMarket.value))
                customMarketCodes = customMarketCodes.filter(lg => lg !== nodeCustomMarketKey.value)
            })
        }         

        return {lineGroupCodes, lineCodes, customMarketCodes}
    }

    const getCustomMarketChecked = (fullTree, treeChecked, targetNode, lineGroupCodes, lineCodes, customMarketCodes) => {
        let nodeKey = JSON.parse(atob(targetNode.value))

        if (targetNode.checked) {

            let isLineFull = true
            let customMarketCodeChilden = []
            targetNode.parent.children.map(customMarket => {
                if (!treeChecked.find(x => x == customMarket.value) && customMarket.value != targetNode.value) {
                    isLineFull = false
                } else {
                    let nodeLineKey = JSON.parse(atob(customMarket.value))
                    customMarketCodeChilden.push(nodeLineKey.value)
                }
            })

            if (isLineFull) {

                let nodeKeyLine = JSON.parse(atob(targetNode.parent.value))
                lineCodes.push(nodeKeyLine.value)
                customMarketCodes = customMarketCodes.filter(cm => customMarketCodeChilden.indexOf(cm) < 0)   

                let lineGroup = null
                fullTree.forEach(lg => {
                    if (lg.children) {
                        if (lg.children.find(x => x.value == targetNode.parent.value)) {
                            lineGroup = lg
                        }
                    }
                });

                if (lineGroup) {
                    let isLineGroupFull = true
                    let lineChilden = []
                    lineGroup.children.map(line => {
                        let nodeLineKey = JSON.parse(atob(line.value))
                        if (!lineCodes.find(x => x == nodeLineKey.value)) {
                            isLineGroupFull = false
                        } else {
                            lineChilden.push(nodeLineKey.value)
                        }
                    })
                    
                    if (isLineGroupFull) {
                        let nodeLineGroupKey = JSON.parse(atob(lineGroup.value))
                        lineGroupCodes.push(nodeLineGroupKey.value)
                        lineCodes = lineCodes.filter(l => lineChilden.indexOf(l) < 0)   
                    }

                }

            } else {
                customMarketCodes.push(nodeKey.value)
            }

        } else {
            // UNCHECKED CUSTOM MARKET
            let nodeLineKey = JSON.parse(atob(targetNode.parent.value))
            if (lineCodes.find(x => x == nodeLineKey.value)) { //FULL LINE ?

                lineCodes = lineCodes.filter(l => l !== nodeLineKey.value)   

                targetNode.parent.children.map(c => {
                    let nodeCustomMarketKey = JSON.parse(atob(c.value))
                    customMarketCodes.push(nodeCustomMarketKey.value)
                })
            } else { // FULL LINE GROUP ?

                let lineGroupUnChecked = null
                fullTree.forEach(lg => {
                    if (lg.children) {
                        if (lg.children.find(x => x.value == targetNode.parent.value)) {
                            lineGroupUnChecked = lg
                        }
                    }
                })
                if (lineGroupUnChecked) {
                    let nodeLineGroupUncheckedKey = JSON.parse(atob(lineGroupUnChecked.value))
                    if (lineGroupCodes.find(x => x == nodeLineGroupUncheckedKey.value)) {
                        lineGroupCodes = lineGroupCodes.filter(lg => lg !== nodeLineGroupUncheckedKey.value)

                        lineGroupUnChecked.children.map(ln => {
                            let line = JSON.parse(atob(ln.value))
                            if (ln.value == targetNode.parent.value) {
                                ln.children.map(({ value }) => {
                                    let customMarketCode = JSON.parse(atob(value))
                                    customMarketCodes.push(customMarketCode.value)
                                })
                            } else {
                                lineCodes.push(line.value)
                            }
                        })
                    }
                }
            }
            customMarketCodes = customMarketCodes.filter(cm => cm !== nodeKey.value)
        }        

        return {lineGroupCodes, lineCodes, customMarketCodes}
    }


    const saveUserPermission = () => {
        setIsSaving(true)
        setTimeout(async () => {
            try {
                let userPermissionToSave = {}
                if (switchFullAccess) {
                    userPermissionToSave = {
                        lineGroupCodes: [],
                        lineCodes: [],
                        customMarketCodes: []
                    }
                } else {
                    userPermissionToSave = userPermission
                }
                userPermissionToSave.fullAccess = switchFullAccess
                await props.updateUserPermissions(user, userPermissionToSave);    
            } catch (e) {
                alert('no se pudo completar la accion')
            } finally {
                setIsSaving(false)
            }
        }, 500)
    }

    React.useEffect(() => {
        getCustomMarketsFullTree()
    },[])

    const onCheck = (checked, targetNode) => {
        setStateChecked(checked);
        updateUserPermission(checked,targetNode)
    }

    const onClick = (clicked) => {
        setStateClicked(clicked);
    }

    const onExpand = (expanded) => {
        setStateExpanded(expanded);
    }

    return (
    <>
        <FormControlLabel
/*             className="float-left m-2"
            style={{position: 'absolute', left: '0px', zIndex: '2'}} */
            control={
                <Switch
                    checked={switchFullAccess}
                    onChange={handleChangeSwitchFullAccess}
                    name="chkFullAccess"
                    color="primary"
                />
            }
            label="Full Access"
        />
        <div className="clickable-labels" style={{
            display: switchFullAccess ? 'none' : '',
            maxHeight: '64vh',
            overflowY: 'auto',
/*             overflowX: 'hidden',
            width: '100vw' */
            }}>
            <CheckboxTree
                checked={stateChecked}
                expanded={stateExpanded}
                iconsClass="fa5"
                nodes={fullTree}
                expandOnClick
                checkModel="all"
                onCheck={onCheck}
                onClick={onClick}
                onExpand={onExpand}
                icons={{
                    check: <CheckBoxIcon color="primary"/>,
                    uncheck: <CheckBoxOutlineBlankIcon />,
                    halfCheck: <IndeterminateCheckBoxIcon />,
                    expandClose: <span className="rct-icon rct-icon-expand-close" />,
                    expandOpen: <span className="rct-icon rct-icon-expand-open" />,
                    expandAll: <span className="rct-icon rct-icon-expand-all" />,
                    collapseAll: <span className="rct-icon rct-icon-collapse-all" />,
                    parentClose: <></>,
                    parentOpen: <></>,
                    leaf: <></>,
                }}               
            />
        </div>
        <div>          
            <div
                id="btn_save_permission"
                className={`btn btn-secondary font-weight-bold px-2 pl-4 pr-4 py-0 mt-10 mb-2`}
                style={{fontWeight: '600'}}
                onClick={() => { if (!isSaving) saveUserPermission()}}
                disabled={!isSaving}
            >
                {isSaving && <span className="mr-6 spinner spinner-green"></span>}            
                <IconButton 
                    aria-label=""  
                    color="primary" 
                    className="p-3"
                    >
                    <span style={{color: isSaving? 'silver': '#17c191', fontSize: '14px'}}>
                        <FormattedMessage id="FORM.ACTION.SAVE" />
                    </span>
                </IconButton>
            </div>
        </div>
    </>
    );
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

export default connect(null,mapDispatchToProps)(UserPermission);