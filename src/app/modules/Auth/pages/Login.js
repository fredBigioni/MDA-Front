import React, { useState } from "react";
import { useFormik } from "formik";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { login } from "../_redux/authCrud";

const initialValues = {
  userName: '',
  password: '',
};

function Login(props) {
  const { intl } = props;
  const [loading, setLoading] = useState(false);
 
  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };

  const getInputClasses = (fieldname) => {
    return "";
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      enableLoading();
      setTimeout(() => {
        login(values.userName, values.password)
          .then(({ data }) => {
            disableLoading();
            props.login(data);
          })
          .catch((e) => {
            console.error(e)
            disableLoading();
            setSubmitting(false);
            setStatus(
              intl.formatMessage({
                id: "AUTH.VALIDATION.INVALID_LOGIN",
              })
            );
          });
      }, 1000);
    },
  });

  return (
    <div className="login-form login-signin" id="kt_login_signin_form">
      {/* begin::Head */}
      <div className="text-center mb-10 mb-lg-20">
        <h3 className="font-size-h1">
          <FormattedMessage id="AUTH.LOGIN.TITLE" />
        </h3>
        <p className="text-muted font-weight-bold">
          <FormattedMessage id="AUTH.LOGIN.SUB_TITLE" />
        </p>
      </div>
      {/* end::Head */}

      {/*begin::Form*/}
      <form
        onSubmit={formik.handleSubmit}
        className="form fv-plugins-bootstrap fv-plugins-framework"
      >
        {formik.status ? (
          <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
            <div className="alert-text font-weight-bold">{formik.status}</div>
          </div>
        ): null }

        <div className="form-group fv-plugins-icon-container">
          <input
            placeholder={intl.formatMessage({id: "AUTH.LOGIN.USER_NAME"})}
            type="text"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "userName"
            )}`}
            name="userName"
            autoComplete="off"
            {...formik.getFieldProps("userName")}
          />
          {formik.touched.userName && formik.errors.userName ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.userName}</div>
            </div>
          ) : null}
        </div>
        <div className="form-group fv-plugins-icon-container">
          <input
            placeholder={intl.formatMessage({id: "AUTH.LOGIN.PASSWORD"})}
            type="password"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "password"
            )}`}
            name="password"
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.password}</div>
            </div>
          ) : null}
        </div>
        <div className="form-group float-right">
          <button
            id="kt_login_signin_submit"
            type="submit"
            disabled={formik.isSubmitting}
            className={`btn btn-primary font-weight-bold px-9 py-4 my-3`}
          >
            <span>
              <FormattedMessage id="FORM.ACTION.LOGIN" />
            </span>
            {loading && <span className="ml-3 spinner spinner-white"></span>}
          </button>
        </div>
      </form>
      {/*end::Form*/}
    </div>
  );
}

export default injectIntl(connect(null, auth.actions)(Login));
