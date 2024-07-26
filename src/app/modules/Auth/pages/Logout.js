import React, {Component} from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {LayoutSplashScreen} from "../../../../_metronic/layout";
import * as auth from "../_redux/authRedux";
import * as mercadosActions from "../../Mercados/_redux/mercadosActions";

class Logout extends Component {
  componentDidMount() {
    this.props.clearCustomMarkets();
    this.props.logout();
  }

  render() {
    const { hasAuthToken } = this.props;
    return hasAuthToken ? <LayoutSplashScreen /> : <Redirect to="/auth/login" />;
  }
}

const mapStateToProps = (state) => {
  return {
    hasAuthToken: Boolean(state.auth.authToken)
  }
}
const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(auth.actions.logout()),
  clearCustomMarkets: () => dispatch(mercadosActions.resetCustomMarket())
});

export default connect(mapStateToProps, mapDispatchToProps)(Logout)
