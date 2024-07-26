import React from 'react';
import { FormattedMessage } from "react-intl";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CustomMarketGroupDialog from './CustomMarketGroupDialog'
import CustomMarketGroupAction from './CustomMarketGroupAction'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    paddingBottom: theme.spacing(2),
  },
}));

export default function CustomMarketGroupTab(props) {
  const { customMarketGroups, handleCustomMarketGroupChange } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(1);
  const [openDialog, setOpenDialog] = React.useState(false);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  const handleOpenCreateDialog = (event) => {
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};      

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"          
        >
          <Tooltip title="CREAR AGRUPACIÓN">
            <IconButton onClick={handleOpenCreateDialog} className="mr-8" color="primary">
              <AddCircleOutlineIcon  style={{fontSize: '1.5rem'}}/>
            </IconButton>
          </Tooltip>
         
          <Tab 
            onClick={() => handleCustomMarketGroupChange(-1)}
            style={{fontSize: '1rem', color: '#2d1f1fd6 !important'}} 
            key={-1}           
            label={
              <span
                style={{color: '#2d1f1fd6'}}
              >
                SIN AGRUPACIÓN
              </span>
            }
            className={'text-dark'}
          />
            {customMarketGroups && customMarketGroups.data && (customMarketGroups.data.map((cmg) => {
              return (
                <Tab 
                  onClick={() => handleCustomMarketGroupChange(cmg.code)}
                  style={{fontSize: '1rem'}} 
                  key={cmg.code}
                  className={(cmg.groupCondition == 'N') ? 'text-danger' : (cmg.groupCondition == 'A') ? 'text-primary' : 'text-dark'}
                  label={
                    <span
                      style={{color: (cmg.groupCondition == 'O') ? '#2d1f1fd6' : ''}}
                    >
                      {cmg.description.toUpperCase()}
                      <CustomMarketGroupAction customMarketGroup={cmg.code} customMarketGroups={customMarketGroups}/>
                    </span>
                  }
                />
              )
            }))}
        </Tabs>
      </AppBar>
      <CustomMarketGroupDialog open={openDialog} handleClose={handleCloseDialog} customMarketGroupSelected={null}/>    
    </div>
  );
}