import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
import Mercados from './modules/Mercados'
import BusinessUnit from './modules/BusinessUnit'
import ProductPresentation from './modules/ProductPresentation'
import Product from './modules/Product'
import ProductGroup from './modules/ProductGroup'
import ProductPresentationGroup from './modules/ProductPresentationGroup'
import LaboratoryGroup from './modules/LaboratoryGroup'
import DrugGroup from './modules/DrugGroup'
import User from './modules/User'
import Can from './config/Can';

export default function BasePage() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect exact from="/" to="/administracion-mercados" />
        }
        <ContentRoute path="/administracion-mercados" component={Mercados} />
        <Can I="view" a="menu-maestros">
          <ContentRoute path="/maestros/unidad-negocios" component={BusinessUnit} />
          <ContentRoute path="/maestros/presentaciones" component={ProductPresentation} />
          <ContentRoute path="/maestros/productos" component={Product} />
          <ContentRoute path="/maestros/grupo-productos" component={ProductGroup} />
          <ContentRoute path="/maestros/grupo-presentaciones" component={ProductPresentationGroup} />
          <ContentRoute path="/maestros/grupo-laboratorios" component={LaboratoryGroup} />
          <ContentRoute path="/maestros/grupo-drogas" component={DrugGroup} />
          <ContentRoute path="/usuarios" component={User} />
        </Can>
        {/* <Can I="view" a="menu-usuarios">
          <ContentRoute path="/usuarios" component={User} />
        </Can> */}                
        <Redirect to="error" />
        <ContentRoute path="/error" />
      </Switch>
    </Suspense>
  );
}
