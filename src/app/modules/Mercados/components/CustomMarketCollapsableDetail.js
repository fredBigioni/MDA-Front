import React from 'react';
import { injectIntl } from "react-intl";
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';
import CustomMarketGroup from './CustomMarketGroup'
import CustomMarketGroupTab from './CustomMarketGroupTab'
import CustomMarketDetail from './CustomMarketDetail'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    flexGrow: 1,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightMedium,
  },
  paper: {
    padding:theme.spacing(0),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    backgroundColor: '#f5f5f5'
  },  
}));

const useExpansionPanelStyles = makeStyles((theme) => (
    {
        root: {
            padding: theme.spacing(1),
            marginBottom: theme.spacing(0),
        },
        expanded: {
            minHeight: '10px !important'
        },
    }
))

const CustomMarketDefinition = (props) => {
  const { intl, customMarket, customMarketGroups } = props;
  const classes = useStyles();
  const expansionPanelClasses = useExpansionPanelStyles()
  const [ rows, setRows ] = React.useState(null)        
  const [customMarketGroup, setCustomMarketGroup] = React.useState(-1);


  const getCustomMarketDetailCustoMarkets = (customMarket) => {
    let detailCustomMartkets = []
    if(customMarket && customMarket.customMarketDetail) {
        customMarket.customMarketDetail.forEach(cmd => {
            if (cmd.detailCustomMarketCode) {
                cmd.name = cmd.detailCustomMarketDescription.toUpperCase();
                detailCustomMartkets.push(cmd)
            }
        });
    }
    return detailCustomMartkets;
  }

  const getCustomMarketDetailDrugs = (customMarket) => {
      let drugs = []
      if(customMarket && customMarket.customMarketDetail) {
          customMarket.customMarketDetail.forEach(cmd => {
              if (cmd.drugCode) {
                  cmd.name = cmd.drugDescription.toUpperCase();
                  drugs.push(cmd);
              } else if (cmd.drugGroupCode) {
                  cmd.name = cmd.drugGroupDescription.toUpperCase()
                  cmd.isGroup = true
                  drugs.push(cmd);
              }
          });
      }
      return drugs;
  }

  const getCustomMarketDetailLaboratories = (customMarket) => {
      let laboratories = []
      if(customMarket && customMarket.customMarketDetail) {
          customMarket.customMarketDetail.forEach(cmd => {
              if (cmd.laboratoryCode) {
                  cmd.name = cmd.laboratoryDescription.toUpperCase();
                  laboratories.push(cmd);
              } else if (cmd.laboratoryGroupCode) {
                  cmd.name = cmd.laboratoryGroupDescription.toUpperCase()
                  cmd.isGroup = true
                  laboratories.push(cmd);
              }
          });
      }
      return laboratories;
  }   

  const getCustomMarketDetailPharmaceuticaForms = (customMarket) => {
      let pharmaceuticalForms = []
      if(customMarket && customMarket.customMarketDetail) {
          customMarket.customMarketDetail.forEach(cmd => {
              if (cmd.pharmaceuticalFormCode) {
                  cmd.name = cmd.pharmaceuticalFormDescription.toUpperCase();
                  pharmaceuticalForms.push(cmd);
              }
          });
      } 
      return pharmaceuticalForms;
  }

  const getCustomMarketDetailProducts = (customMarket) => {
      let products = []
      if(customMarket && customMarket.customMarketDetail) {
          customMarket.customMarketDetail.forEach(cmd => {
              if (cmd.productCode) {
                  cmd.name = cmd.productDescription.toUpperCase();
                  products.push(cmd);
              } else if (cmd.productGroupCode) {
                  cmd.name = cmd.productGroupDescription.toUpperCase() 
                  cmd.isGroup = true
                  products.push(cmd);
              }
          });
      } 
      return products;
  }

  const getCustomMarketDetailProductPresentations = (customMarket) => {
      let productPresentations = []
      if(customMarket && customMarket.customMarketDetail) {
          customMarket.customMarketDetail.forEach(cmd => {
              if (cmd.productPresentationCode) {
                  cmd.name = cmd.productPresentationDescription.toUpperCase();
                  productPresentations.push(cmd);
              } else if (cmd.productPresentationGroupCode) {
                  cmd.name = cmd.productPresentationGroupDescription.toUpperCase()
                  cmd.isGroup = true
                  productPresentations.push(cmd);
              }
          });
      }
      return productPresentations;
  }

  const getCustomMarketDetailTherapeuticalClasses = (customMarket) => {
      let therapeuticalClasses = []
      if(customMarket && customMarket.customMarketDetail) {
          customMarket.customMarketDetail.forEach(cmd => {
              if (cmd.therapeuticalClassCode) {
                  cmd.name = cmd.therapeuticalClassDescription.toUpperCase();
                  therapeuticalClasses.push(cmd);
              }
          });
      }
      return therapeuticalClasses;
  }

  const handleCustomMarketGroupChange = (event) => {
    setCustomMarketGroup(event.target.value);
  };

  const handleCustomMarketGroupTabChange = (code) => {
    setCustomMarketGroup(code);
  };  

  const detectCustomMarket = () => {
    if(customMarket.data) {
      setRows([
          {title: intl.formatMessage({id: "CUSTOM_MARKET_DEFINITION.TITLE.PRODUCT"}), detail: getCustomMarketDetailProducts(customMarket.data), filterOwnProduct: true },
          {title: intl.formatMessage({id: "CUSTOM_MARKET_DEFINITION.TITLE.PRODUCT_PRESENTATION"}), detail: getCustomMarketDetailProductPresentations(customMarket.data), filterOwnProduct: false },
          {title: intl.formatMessage({id: "CUSTOM_MARKET_DEFINITION.TITLE.THERAPEUTICAL_CLASS"}), detail: getCustomMarketDetailTherapeuticalClasses(customMarket.data), filterOwnProduct: false },
          {title: intl.formatMessage({id: "CUSTOM_MARKET_DEFINITION.TITLE.LABORATORY"}), detail: getCustomMarketDetailLaboratories(customMarket.data), filterOwnProduct: false },
          {title: intl.formatMessage({id: "CUSTOM_MARKET_DEFINITION.TITLE.DRUG"}), detail: getCustomMarketDetailDrugs(customMarket.data), filterOwnProduct: false },
          {title: intl.formatMessage({id: "CUSTOM_MARKET_DEFINITION.TITLE.PHARMACEUTICAL_FORM"}), detail: getCustomMarketDetailPharmaceuticaForms(customMarket.data), filterOwnProduct: false },
          {title: intl.formatMessage({id: "CUSTOM_MARKET_DEFINITION.TITLE.CUSTOM_MARKET"}), detail: getCustomMarketDetailCustoMarkets(customMarket.data), filterOwnProduct: false }
      ])
    }
  }

  React.useEffect(() => {
      detectCustomMarket()
  },[customMarket])

  return (
    <Paper className={classes.paper}>
      <CustomMarketGroupTab customMarketGroups={customMarketGroups} customMarketDetail={rows} handleCustomMarketGroupChange={handleCustomMarketGroupTabChange}/>
      {/* <CustomMarketGroup customMarketGroups={customMarketGroups} customMarketGroup={customMarketGroup} handleCustomMarketGroupChange={handleCustomMarketGroupChange}/> */}
      {rows && rows.map((row, index) => {
        let cmgSelected = (customMarketGroup == -1) ? null : customMarketGroup
        let rowDetailFilteredByCustomMarketGroup = row.detail.filter(x => x.customMarketGroupCode == cmgSelected)
        if (rowDetailFilteredByCustomMarketGroup.length > 0) {
          return (
            <ExpansionPanel key={index} style={{marginBottom: '10px'}}> 
                <ExpansionPanelSummary
                    className={expansionPanelClasses.expanded}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls=""
                    id={"ExpansionPanelSummary"+{index}}
                >
                <Typography className={classes.heading} color="primary">{row.title.toUpperCase()}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={expansionPanelClasses.root}>
                    <CustomMarketDetail rows={rowDetailFilteredByCustomMarketGroup} filterOwnProduct={row.filterOwnProduct}/>
                </ExpansionPanelDetails>
            </ExpansionPanel>
          )
        }
        return null
      })
    }
    </Paper>
  );
}

export default injectIntl(CustomMarketDefinition);