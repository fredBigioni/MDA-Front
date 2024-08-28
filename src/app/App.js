// import React, { useState, useEffect } from "react";
// import { Provider } from "react-redux";
// import { BrowserRouter } from "react-router-dom";
// import { PersistGate } from "redux-persist/integration/react";
// import { I18nProvider } from "../_metronic/i18n";
// import { Routes } from "../app/Routes";
// import { LayoutSplashScreen, MaterialThemeProvider } from "../_metronic/layout";
// import { useMsal, useMsalAuthentication } from "@azure/msal-react";
// import { InteractionType } from "@azure/msal-browser";
// import { loginRequest } from "./authConfig";

// export default function App({ store, persistor, basename }) {
//   const { login, result, error } = useMsalAuthentication(InteractionType.Redirect, loginRequest);
//   const { accounts } = useMsal();
//   const [msUser, setMsUser] = useState("");

//   useEffect(() => {
//     if (accounts.length > 0) {
//       setMsUser(accounts[0].username);
//       console.log(result)
//     }
//   }, [accounts]);

//   if (error) {
//     return <div>Error in login: {error.message}</div>;  
//   }

//   if (msUser) {
//     return (
//       <Provider store={store}>
//         <PersistGate persistor={persistor} loading={<LayoutSplashScreen />}>
//           <React.Suspense fallback={<LayoutSplashScreen />}>
//             <BrowserRouter basename={basename}>
//               <MaterialThemeProvider>
//                 <I18nProvider>
//                   <Routes />
//                 </I18nProvider>
//               </MaterialThemeProvider>
//             </BrowserRouter>
//           </React.Suspense>
//         </PersistGate>
//       </Provider>
//     );
//   } else {
//     return <div>Please Wait...</div>;
//   }
// }


/**
 * Entry application component used to compose providers and render Routes.
 * */

import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import * as _redux from "../redux";
import axios from "axios";
import { PersistGate } from "redux-persist/integration/react";
import { Routes } from "../app/Routes";
import { I18nProvider } from "../_metronic/i18n";
import { LayoutSplashScreen, MaterialThemeProvider } from "../_metronic/layout";
import { useAccount, useMsal } from "@azure/msal-react";

export default function App({ store, persistor, basename }) {
  const { instance, accounts, inProgress } = useMsal();
  const account = useAccount(accounts[0] || {});
  _redux.setupAxios(axios, store, account);

  return (
    /* Provide Redux store */
    <Provider store={store}>
      {/* Asynchronously persist redux stores and show `SplashScreen` while it's loading. */}
      <PersistGate persistor={persistor} loading={<LayoutSplashScreen />}>
        {/* Add high level `Suspense` in case if was not handled inside the React tree. */}
        <React.Suspense fallback={<LayoutSplashScreen />}>
          {/* Override `basename` (e.g: `homepage` in `package.json`) */}
          <BrowserRouter basename={basename}>
            {/*This library only returns the location that has been active before the recent location change in the current window lifetime.*/}
            <MaterialThemeProvider>
              {/* Provide `react-intl` context synchronized with Redux state.  */}
              <I18nProvider>
                {/* Render routes with provided `Layout`. */}
                <Routes />
              </I18nProvider>
            </MaterialThemeProvider>
          </BrowserRouter>
        </React.Suspense>
      </PersistGate>
    </Provider>
  );
}
