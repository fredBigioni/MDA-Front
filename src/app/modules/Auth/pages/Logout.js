import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { LayoutSplashScreen } from "../../../../_metronic/layout";
import * as auth from "../_redux/authRedux";
import * as mercadosActions from "../../Mercados/_redux/mercadosActions";
import { withMsal } from "@azure/msal-react"; // Importa withMsal para conectar el HOC

class Logout extends Component {
  componentDidMount() {
    const { instance } = this.props.msalContext; // Obtén la instancia de msal
    this.props.clearCustomMarkets();
    instance.logoutRedirect(); // Cierra sesión con msal usando un popup
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
  };
};

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(auth.actions.logout()),
  clearCustomMarkets: () => dispatch(mercadosActions.resetCustomMarket())
});

// Envuelve el componente con withMsal para obtener el contexto de msal
export default connect(mapStateToProps, mapDispatchToProps)(withMsal(Logout));
