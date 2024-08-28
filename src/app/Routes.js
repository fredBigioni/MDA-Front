import React, { useEffect } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { Layout } from "../_metronic/layout";
import BasePage from "./BasePage";
import { Logout, AuthPage, actionTypes } from "./modules/Auth";
import ErrorsPage from "./modules/ErrorsExamples/ErrorsPage";
import { login, adLogin, adLoginToken } from "./modules/Auth/_redux/authCrud";
import { InteractionType, PublicClientApplication } from "@azure/msal-browser";
import { loginRequest, msalConfig } from "./authConfig";
import { useAccount, useIsAuthenticated, useMsal, useMsalAuthentication } from "@azure/msal-react";

export function Routes() {
  const dispatch = useDispatch();
  const { isAuthorized } = useSelector(
    ({ auth }) => ({
      isAuthorized: auth.user != null,
    }),
    shallowEqual
  );

  const { instance, accounts, inProgress } = useMsal();
  const account = useAccount(accounts[0] || {});
  const isAuthenticated = useIsAuthenticated();

  console.log(account);

  const { login, result, error } = useMsalAuthentication(InteractionType.Redirect, loginRequest);
  console.log(result);

  useEffect(() => {
    async function getTokenSilently() {
      const tokenRequest = {
        scopes: ['User.Read'],
        // loginHint: accounts[0].username,
        account,
      };
      const res = await instance.acquireTokenSilent(tokenRequest);
      handleAzureADLogin(res.uniqueId, res.accessToken);
    }
  
    if (isAuthenticated && inProgress === 'none') {
      getTokenSilently();
    } else if (result) {
      handleAzureADLogin(result.uniqueId, result.accessToken);
    }



    // if (!isAuthorized && !error) {
    //   login(); // Trigger Azure AD login if not authorized
    // }
    // if (result || account) {
    //   handleAzureADLogin(result? (result.uniqueId, result.accessToken) : (account. , account.));
    // }
  }, [isAuthenticated]);
  
  const handleAzureADLogin = async (userId,accessToken) => {
      try {
        // const userGraphData = await adLoginToken(result);
        
        const response = await adLogin(userId, accessToken);
        dispatch({type: actionTypes.Login, payload: { authToken: response.data.jwtToken, user: response.data } })


      } catch (error) {
        console.error("Azure AD login process failed", error);
        // Handle the error accordingly
      }
  };
  return (
    <Switch>
      {!isAuthorized ? (
        /* Render auth page when user at `/auth` and not authorized. */
        <Route>
          <AuthPage isAuthorized={isAuthorized} />
        </Route>
      ) : (
        /* Otherwise redirect to root page (`/`) */
        <Redirect from="/auth" to="/" />
      )}

      <Route path="/error" component={ErrorsPage} />
      <Route path="/logout" component={Logout} />

      {!isAuthorized ? (
        /* Redirect to `/auth` when user is not authorized */
        <Redirect to="/auth/login" />
      ) : (
        <Layout>
          <BasePage />
        </Layout>
      )}
    </Switch>
  );
}
