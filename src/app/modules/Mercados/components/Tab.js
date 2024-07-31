import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { FormattedMessage } from "react-intl";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import ProductTabContainer from './ProductTabContainer'
import DrugTabContainer from './DrugTabContainer'
import PharmaceuticalFormTabContainer from './PharmaceuticalFormTabContainer'
import TherapeuticalClassTabContainer from './TherapeuticalClassTabContainer'
import LaboratoryTabContainer from './LaboratoryTabContainer'
import ProductPresentationTabContainer from './ProductPresentationTabContainer'
import CustomMarketTabContainer from './CustomMarketTabContainer'
import ErrorAlert from '../../ErrorsExamples/ErrorAlert'
import SuccessAlert from '../../Success/SuccessAlert';
import zIndex from '@material-ui/core/styles/zIndex';

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} className="pt-5 pl-0 pr-0 pb-0 overflow-hidden">
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '100%'
  },
}));

export default function FullWidthTabs() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  function handleChangeIndex(index) {
    setValue(index);
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label={<FormattedMessage id="CUSTOM_MARKET_TAB.TITLE.PRODUCT" />} style={{fontSize: '1rem'}}/>
          <Tab label={<FormattedMessage id="CUSTOM_MARKET_TAB.TITLE.PRODUCT_PRESENTATION" />} style={{fontSize: '1rem'}}/>
          <Tab label={<FormattedMessage id="CUSTOM_MARKET_TAB.TITLE.THERAPEUTICAL_CLASS" />} style={{fontSize: '1rem'}}/>
          <Tab label={<FormattedMessage id="CUSTOM_MARKET_TAB.TITLE.LABORATORY" />} style={{fontSize: '1rem'}}/>
          <Tab label={<FormattedMessage id="CUSTOM_MARKET_TAB.TITLE.DRUG" />} style={{fontSize: '1rem'}}/>
          <Tab label={<FormattedMessage id="CUSTOM_MARKET_TAB.TITLE.PHARMACEUTICAL_FORM" />} style={{fontSize: '1rem'}}/>
          <Tab label={<FormattedMessage id="CUSTOM_MARKET_TAB.TITLE.CUSTOM_MARKET" />} style={{fontSize: '1rem'}}/>
        </Tabs>
      </AppBar>
      <SwipeableViews
        style={{ height: '365px'}}
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabContainer dir={theme.direction}><ProductTabContainer /></TabContainer>
        <TabContainer dir={theme.direction}><ProductPresentationTabContainer/> </TabContainer>
        <TabContainer dir={theme.direction}><TherapeuticalClassTabContainer /></TabContainer>
        <TabContainer dir={theme.direction}><LaboratoryTabContainer /></TabContainer>
        <TabContainer dir={theme.direction}><DrugTabContainer /></TabContainer>
        <TabContainer dir={theme.direction}><PharmaceuticalFormTabContainer /></TabContainer>
        <TabContainer dir={theme.direction}><CustomMarketTabContainer /></TabContainer>
      </SwipeableViews>
      <ErrorAlert />
      <SuccessAlert />
    </div>
  );
}