import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from './_redux/mercadosActions';
import Grid from '@material-ui/core/Grid';
import CustomMarketTree from './components/CustomMarketTree'
import CustomMarketToolbar from './components/CustomMarketToolbar'
import CustomMarketManage from './components/CustomMarketManage'
import CustomMarketPreview from './components/CustomMarketPreview'

const Mercados = (props) => {
    const { customMarket, customMarketPreview } = props;  

    const getTree = async() => {
        await props.getCustomMarketTree();
    }

    const getAllGroupLines = async() => {
        await props.getLineGroups();
    }

    const getAllLines = async() => {
        await props.getLines();
    }

    const getAllProductTypes = async() => {
        await props.getProductTypes();
    }
    
    const getAllCustomMarkets = async() => {
        await props.getCustomMarkets();
    }

    React.useEffect(() => { 
        getTree()
        getAllProductTypes() 
        getAllGroupLines()
        getAllLines()
        getAllCustomMarkets()
    }, [])    

    return (
        <>
            {customMarket.treeVisible &&
                <Grid container spacing={4} style={{ position: 'fixed', zIndex: 20, height: '100%'}}>    
                    <Grid item className="pr-0" style={{ backgroundColor: '#FFF',zIndex: 20, height: '100%', width: '480px', overflow: 'auto'}}>
                        <CustomMarketTree />
                    </Grid>
                    <Grid item xs={8} style={{ backgroundColor: '#c0c0c080',zIndex: 20, height: '100%'}}></Grid>
                </Grid>
            }

            {customMarket.isLoading &&
                <Grid container spacing={4} style={{ position: 'fixed', zIndex: 20, height: '100%'}}>    
                    <Grid item xs={12} style={{ backgroundColor: '#c0c0c080',zIndex: 20, height: '100%'}}></Grid>
                </Grid>
            }

            <Grid container spacing={4} style={{ position: (customMarket.treeVisible) ? 'relative': 'relative'}}>
                <CustomMarketToolbar />                    
                <CustomMarketManage/>
                {customMarket.data && customMarket.data.code &&
                    <CustomMarketPreview />
                }
            </Grid>
        </>
    )
    
}

const mapStateToProps = (state) => {
    return {
        customMarket: state.mercados.customMarket
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(Mercados);