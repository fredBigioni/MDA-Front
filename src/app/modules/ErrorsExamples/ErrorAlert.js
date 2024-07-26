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

const ErrorAlert = (props) => {
  const { error } = props;
  const classes = useStyles();

  const handleClose = () => {
    props.setGetError(false)
  };

  React.useEffect(() => {}, [error])  

  return (
    <>
    {error.visible &&
        <div className={classes.root}>
            <Alert severity="error" onClose={handleClose}>
                <AlertTitle>{error.description}</AlertTitle>
            </Alert>
        </div>
    }
    </>
  );
}

const mapStateToProps = (state) => {
    return {
        error: state.mercados.getError
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(ErrorAlert);
