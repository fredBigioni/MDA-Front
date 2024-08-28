/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Link, Switch, Redirect } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import { ContentRoute } from "../../../../_metronic/layout";
import Login from "./Login";
import "../../../../_metronic/_assets/sass/pages/login/classic/login-1.scss";
import { CircularProgress } from "@material-ui/core";

export function AuthPage(isAuthorized) {
  const today = new Date().getFullYear();
  return (
    <>
      <div className="d-flex flex-column flex-root">
        {/*begin::Login*/}
        <div
          className="login login-1 login-signin-on d-flex flex-column flex-lg-row flex-row-fluid bg-white"
          id="kt_login"
        >
          {/*begin::Aside*/}
          <div
            className="login-aside d-flex flex-row-auto bgi-size-cover bgi-no-repeat p-10 p-lg-10"
            style={{
              backgroundImage: `url(${toAbsoluteUrl("/media/bg/bg-5.jpg")})`,
            }}
          >
            {/*begin: Aside Container*/}
            <div className="d-flex flex-row-fluid flex-column justify-content-between">
              {/* start:: Aside header */}
              <Link to="/" className="flex-column-auto mt-5">
                <img
                  alt="Logo"
                  className="max-h-70px"
                  src={toAbsoluteUrl("/media/logos/logo-auth.png")}
                />
              </Link>
              {/* end:: Aside header */}

              {/* start:: Aside content */}
              <div className="flex-column-fluid d-flex flex-column justify-content-center">
                <h3 className="font-size-h1 mb-5 text-white">
                  <FormattedMessage id="MDA.TITLE" />
                </h3>
                <p className="font-weight-lighter text-white opacity-80">
                  <FormattedMessage id="MDA.SUB_TITLE" />
                </p>
              </div>
              {/* end:: Aside content */}

              {/* start:: Aside footer for desktop */}
              <div className="d-none flex-column-auto d-lg-flex justify-content-between mt-10">
                <div className="opacity-70 font-weight-bold	text-white">
                  <span className="text-white font-weight-bold mr-2">{today.toString()} &copy;{" "} </span>
                  <a
                    href="http://www.solutica.com.ar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white text-hover-white"
                  >
                    Solutica
                  </a>
                </div>
              </div>
              {/* end:: Aside footer for desktop */}
            </div>
            {/*end: Aside Container*/}
          </div>
          {/*begin::Aside*/}

          {/*begin::Content*/}
          <div className="flex-row-fluid d-flex flex-column position-relative p-7 overflow-hidden">
            {/* begin::Content body */}
            <div className="d-flex flex-column-fluid flex-center mt-30 mt-lg-0">
              {/* <Switch>
                <ContentRoute path="/auth/login" component={Login} />
                <Redirect from="/auth" exact={true} to="/auth/login" />
                <Redirect to="/auth/login" />
              </Switch> */}
              {isAuthorized ? <CircularProgress /> : "Su usuario no tiene acceso para cargar gastos en el sistema"}
            </div>
            {/*end::Content body*/}

            {/* begin::Mobile footer */}
            <div className="d-flex d-lg-none flex-column-auto flex-column flex-sm-row justify-content-between align-items-center mt-5 p-5">
              <div className="text-dark-50 font-weight-bold order-2 order-sm-1 my-2">
                <span className="text-white font-weight-bold mr-2">{today.toString()} &copy;{" "}</span>
                <a
                  href="http://www.solutica.com.ar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-hover-white"
                >
                  Solutica
                </a>
              </div>
            </div>
            {/* end::Mobile footer */}
          </div>
          {/*end::Content*/}
        </div>
        {/*end::Login*/}
      </div>
    </>
  );
}
