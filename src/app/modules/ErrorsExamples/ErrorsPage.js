import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { ErrorPage5 } from "./ErrorPage5";

export default function ErrorsPage() {
  return (
    <Switch>
      <Route path="/error" component={ErrorPage5} />
    </Switch>
  );
}
