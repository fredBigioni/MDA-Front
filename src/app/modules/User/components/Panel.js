import React from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CloseIcon from '@material-ui/icons/Close';
import UserPermission from './UserPermissions'

const CustomMarketToolbar = (props) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} className="pt-1 pb-0">
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginBottom:5
            }}
          id="btn_close_permission"
          className={`btn btn-secondary font-weight-bold px-2 py-0 mb-2`}
          onClick={() => props.closePanel()}
        >
          <Tooltip title="Cerrar">
              <IconButton aria-label="Cerrar"  color="primary">
                  <CloseIcon/> 
              </IconButton>
          </Tooltip>                                
        </div>
        <span 
            className={`ml-10 text-uppercase`}
            style={{ fontSize: '16px', fontWeight: '500', borderBottom: '2px solid #17c191', color: '#636060' }}>
              <span style={{color: 'rgb(56 56 197 / 48%)'}} className="pl-4 pr-4">{props.userData.dominio} \ {props.userData.usuario}</span>
        </span>
        </Grid>
        <Grid item xs={12} className="pt-0 pb-0">
          <UserPermission user={props.userData.id} />
        </Grid>
    </Grid>
  );
};

export default CustomMarketToolbar;