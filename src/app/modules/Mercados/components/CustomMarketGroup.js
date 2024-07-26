import React from 'react';
import { FormattedMessage } from "react-intl";
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Toolbar from '@material-ui/core/Toolbar';
import CustomMarketGroupAction from './CustomMarketGroupAction'

const useStyles = makeStyles((theme) => ({
  formControl: {
    //margin: theme.spacing(1),
    minWidth: 180,
  },
  selectEmpty: {
    //marginTop: theme.spacing(2),
  },
}));

export default function SimpleSelect(props) {
  const classes = useStyles();
  let { handleCustomMarketGroupChange, customMarketGroup, customMarketGroups } = props;

  return (
    <>
     <Toolbar>
        <InputLabel className="mr-5 pr-3 font-weight-bold text-uppercase" style={{fontSize: '14px'}}>
          <FormattedMessage id="CUSTOM_MARKET_GROUP.TITLE" />
        </InputLabel>
        <FormControl className={classes.formControl}>
          <Select
            id="custom-market-group-simple-select-placeholder"
            value={customMarketGroup}
            onChange={handleCustomMarketGroupChange}
            displayEmpty
            className={classes.selectEmpty}
          >
            <MenuItem key='default' value={-1}>SIN AGRUPACIÓN</MenuItem>
            {customMarketGroups && customMarketGroups.data && (customMarketGroups.data.map((cmg) => {
              return (
                <MenuItem 
                  key={cmg.code} 
                  value={cmg.code}
                  name={cmg.description}
                  className={(cmg.groupCondition == 'N') ? 'text-danger' : (cmg.groupCondition == 'A') ? 'text-primary' : ''}
                  >
                    <label className={(cmg.groupCondition == 'N') ? 'text-danger' : (cmg.groupCondition == 'A') ? 'text-primary' : ''}>
                      {cmg.description.toUpperCase()}
                    </label>
                </MenuItem>
              )
            }))}
          </Select>
        </FormControl>
        <CustomMarketGroupAction customMarketGroup={customMarketGroup} customMarketGroups={customMarketGroups}/>
      </Toolbar>
    </>
  );
}