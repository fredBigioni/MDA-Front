import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as actions from '../Mercados/_redux/mercadosActions';
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const SuccessAlert = (props) => {
  const { success } = props;
  const classes = useStyles();

  const handleClose = () => {
    props.setGetSuccess(false)
  };

  React.useEffect(() => {}, [success])  

  return (
    <>
    {success.visible &&
        <div className={classes.root}>
            <Alert severity="success" onClose={handleClose}>
                <AlertTitle>{success.description}</AlertTitle>
            </Alert>
        </div>
    }
    </>
  );
}

const mapStateToProps = (state) => {
    return {
        success: state.mercados.getSuccess
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(SuccessAlert);
